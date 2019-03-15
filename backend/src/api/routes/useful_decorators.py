from flask import jsonify, session
from functools import wraps

from ..models import (db,
                      Event,
                      User,
                      UserInEvent)


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
