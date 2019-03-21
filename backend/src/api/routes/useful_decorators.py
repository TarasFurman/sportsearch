import boto3
import os
import imghdr
from botocore.exceptions import ClientError
from flask import jsonify, session
from functools import wraps
from uuid import uuid4

from ..models import (db,
                      Event,
                      User,
                      UserInEvent)


class AWSS3Exception(Exception):
    """
    Class to identify Amazon AWS S3 specific exception
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


def error_func(error_status=400,
               error_description='Unknown error was occurred. Check your data and try to '
                                 'send your request later.',
               error_message='UNKNOWN_ERROR'):
    """
    Function that returns an error API status.
    :return:
    """
    return jsonify(
        {
            'error': {
                'status': error_status,
                'description': error_description,
                'message': error_message,
            },
        }
    )


def upload_image_to_s3(file=None, bucket=None):
    """
    Function that pushes image to an Amazon AWS S3 bucket
    Required parameters:
        - file : (file) : file that need to be pushed (opened image)
        - bucket : (str) : bucket you want to push it to; bucket Є {'users', 'events'}
    :return:
    """

    # Check all constraints for bucket and file
    if not file:
        return AWSS3Exception('FILE_EMPTY')
    # Check file type (can only upload .jpeg, .jpg and .png images)
    filetype = imghdr.what(file)
    if filetype not in ('jpeg', 'png'):
        return AWSS3Exception('FILE_TYPE_UNSUPPORTED')
    if not bucket:
        return AWSS3Exception('BUCKET_NAME_EMPTY')
    if bucket not in ('user', 'event'):
        return AWSS3Exception('BUCKET_NAME_NOT_ALLOWED')

    # Initialize resource (connect to AWS S3)
    try:
        s3 = boto3.resource(
            's3',
            region_name='eu-north-1',
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY'),
            aws_secret_access_key=os.environ.get('AWS_SECRET_KEY'),
        )

        # Generate random name for a file
        filename = str(uuid4())
        # Set bucket name dependent on the input
        bucket_name = 'sportsearch-images-events' \
            if bucket == 'event' \
            else 'sportsearch-images-users'

        s3.Bucket(bucket_name).put_object(
            Key=filename + '.' + filetype,
            Body=file,
        )

    except ClientError:
        return AWSS3Exception('CREDENTIALS_NOT_VALID')

    return 'https://s3.eu-north-1.amazonaws.com/{bucket}/' \
               .format(bucket=bucket_name) \
           + filename \
           + '.jpg'


def visitor_allowed_feedback(func):
    """
    Decorator that will check:
        1. If user is authenticated.
        :return:
    """

    @wraps(func)
    def inner(*args, **kwargs):
        try:
            target_user_id = kwargs['target_id']

            if not target_user_id or not isinstance(target_user_id, int):
                return error_func(error_status=422,
                                  error_description='User id was not provided properly.',
                                  error_message='INCORRECT_USER_ID', )

            target_user = db.session.query(User).filter(
                User.id == target_user_id,
                User.status_id == 1,  # only active users
            ).first()
            if not target_user:
                return error_func(error_status=404,
                                  error_description='User was not found.',
                                  error_message='USER_NOT_FOUND', )

            user_id = session.get('user')  # identify user by their id

            if target_user_id == user_id:
                user = target_user
            else:
                user = db.session.query(User).filter(
                    User.id == user_id,
                    User.status_id == 1,  # only active users
                ).first()
            if not user:
                return error_func(error_status=404,
                                  error_description='User is unauthorized.',
                                  error_message='UNAUTHORIZED_USER', )
        except Exception:
            return error_func()

        return func(user, target_user, *args, **kwargs)

    return inner


def visitor_allowed_event(func):
    """
    Decorator that will check:
    1. If user is registered.
    2. If event with given id exists.
    3. If user has an access to that event.
    4. If user is an event owner/admin.
    5. If event exists.
    :return:
    """

    @wraps(func)
    def inner(*args, **kwargs):
        # variables for errors; they are necessary to make function more readable
        try:
            event_id = kwargs['event_id']

            if not event_id or not isinstance(event_id, int):
                return error_func(error_status=422,
                                  error_description='Event id was not provided properly.',
                                  error_message='INCORRECT_EVENT_ID', )

            event = db.session.query(Event).filter(Event.id == event_id).first()
            if not event:
                return error_func(error_status=404,
                                  error_description='Event was not found.',
                                  error_message='EVENT_NOT_FOUND', )

            user_id = session.get('user')  # identify user by their id
            user = db.session.query(User).filter(
                User.id == user_id,
                User.status_id == 1,  # only active users
            ).first()
            if not user:
                return error_func(error_status=404,
                                  error_description='User is unauthorized.',
                                  error_message='UNAUTHORIZED_USER', )

            if not db.session.query(UserInEvent).filter(
                    UserInEvent.user_id == user_id,
                    UserInEvent.event_id == event_id,
                    UserInEvent.user_event_status_id == 2,
            ).first():
                return error_func(error_status=403,
                                  error_description='User is not in this event.',
                                  error_message='USER_FORBIDDEN', )
            user_is_owner = (user == event.owner)

        except Exception:
            return error_func()

        return func(event, user, user_is_owner, *args, **kwargs)

    return inner


def visitor_allowed_socket(func):
    """
    Decorator that checks data, necessary for sending and receiving
    messages via sockets.
    """

    @wraps(func)
    def inner(*args, **kwargs):
        try:
            # flask-socketio gives *args with a such structure:
            # ({ <actual **kwargs here> },)
            data = args[0]

            event_id = int(data['event_id'])

            if not event_id or not isinstance(event_id, int):
                return error_func(error_status=422,
                                  error_description='Event id was not provided properly.',
                                  error_message='INCORRECT_EVENT_ID', )
            event = db.session.query(Event).filter(Event.id == event_id).first()
            if not event:
                return error_func(error_status=404,
                                  error_description='Event was not found.',
                                  error_message='EVENT_NOT_FOUND', )

            user_id = int(data['user_id'])
            user = db.session.query(User).filter(
                User.id == user_id,
                User.status_id == 1,  # only active users
            ).first()
            if not user:
                return error_func(error_status=404,
                                  error_description='User is unauthorized.',
                                  error_message='UNAUTHORIZED_USER', )

            if not db.session.query(UserInEvent).filter(
                    UserInEvent.user_id == user_id,
                    UserInEvent.event_id == event_id,
                    UserInEvent.user_event_status_id == 2,
            ).first():
                return error_func(error_status=403,
                                  error_description='User is not in this event.',
                                  error_message='USER_FORBIDDEN', )

        except Exception:
            return error_func()

        return func(event, user, *args, **kwargs)

    return inner
