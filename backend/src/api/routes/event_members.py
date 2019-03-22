from datetime import date, datetime
from flask import Response, request
from flask_socketio import join_room, leave_room
from sqlalchemy import or_

from . import socketio
from .useful_decorators import error_func, visitor_allowed_socket
from ..models import (db,
                      Feedback,
                      User,
                      UserInEvent,)

NAMESPACE = '/members'


@socketio.on('join', namespace=NAMESPACE)
@visitor_allowed_socket
def join(*args, **kwargs):
    event = args[0]
    join_room(event.id)


@socketio.on('leave', namespace=NAMESPACE)
@visitor_allowed_socket
def leave(*args, **kwargs):
    event = args[0]
    leave_room(event.id)


@socketio.on('get_active_members', namespace=NAMESPACE)
@visitor_allowed_socket
def get_event_members(*args, **kwargs):
    """
    Function that returns a list of event members
    :return:
    """
    event = args[0]
    user = args[1]
    data = args[2]

    try:

        # get all members that event has
        members = db.session.query(User).filter(
            or_(*(User.id == q_user.user_id
                  for q_user in event.users
                  # user status has to be 'approved'
                  if q_user.user_event_status_id == 2))
        ).order_by(
            User.first_name,
            User.last_name
        ).all()

        socketio.emit(
            'receive_active_members',
            {
                'members': [
                    {
                        'id': member.id,
                        'name': member.first_name,
                        'surname': member.last_name,
                        'nickname': member.nickname,
                        'rating': member.rating,
                        'request_user_rating':
                            getattr(db.session.query(Feedback).filter(
                                Feedback.user_from_id == user.id,
                                Feedback.user_to_id == member.id,
                                Feedback.event_id == event.id,
                            ).first(), 'rating', 0) if member.id != user.id else 0,
                        # if there are no such object, return 0
                        # also, it is the turn of a request user, there is no need to query the database, so return 0
                        'image_url': member.image_url,
                    } for member in members
                ],
            },
            room=event.id if data.get('update_all_users') else request.sid,
            namespace=NAMESPACE,
        )

    except Exception:
        return error_func()


@socketio.on('kick_member', namespace=NAMESPACE)
@visitor_allowed_socket
def kick_user(*args, **kwargs):
    """
    Function that kicks a user from an event.
    Required parameters:
        - kick_user_id : (int) { required } : id of user function need to kick from an event
    :return:
    """

    event = args[0]
    user = args[1]
    data = args[2]
    user_is_owner = user.id == event.owner_id

    if not user_is_owner:
        return error_func(error_status=403,
                          error_description='Only event owner can kick users.',
                          error_message='USER_NOT_OWNER_FORBIDDEN', )
    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Users can be kicked only from active events.',
                          error_message='EVENT_NOT_PLANNED', )

    try:
        kick_id = data.get('kick_user_id')

        if not kick_id:
            return error_func(error_status=400,
                              error_description='Kick user id was not provided correctly.',
                              error_message='USER_ID_NOT_FOUND', )

        if user.id == kick_id:
            return error_func(error_status=403,
                              error_description='Admin/owner can not kick themselves.',
                              error_message='USER_OWNER_FORBIDDEN', )

        kick_in_event = db.session.query(UserInEvent).filter(
            UserInEvent.user_id == kick_id,
            UserInEvent.event_id == event.id,
        ).first()

        kick_in_event.user_event_status_id = 4

        db.session.commit()

    except Exception:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED', )

    return Response(status=200)


@socketio.on('grant_user', namespace=NAMESPACE)
@visitor_allowed_socket
def grant_request_member(*args, **kwargs):
    """
    Function that kicks a user from an event or accepts for an event.
    Required parameters:
        - target_user_id : (int) { required } : id of user that will be granted
        - target_user_status: (int) { required } : status of user that will be granted to him
    :return:
    """

    event = args[0]
    user = args[1]
    data = args[2]
    user_is_owner = user.id == event.owner_id

    if not user_is_owner:
        return error_func(error_status=403,
                          error_description='Only event owner can accept or decline users.',
                          error_message='USER_NOT_OWNER_FORBIDDEN', )
    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Users can be only accepted to an planned event.',
                          error_message='EVENT_NOT_PLANNED', )

    try:
        target_id = data.get('target_user_id')
        target_status = data.get('target_user_status')

        if not (target_id and target_status):
            return error_func(error_status=400,
                              error_description='Some of required fields missed.',
                              error_message='INCORRECT_DATA_PROVIDED', )

        if target_status not in (2, 3):
            return error_func(error_status=400,
                              error_description='User status can be changed only to 2 or 3.',
                              error_message='INCORRECT_STATUS_PROVIDED', )

        if user.id == target_id:
            return error_func(error_status=403,
                              error_description='Admin/owner can not grand themselves.',
                              error_message='USER_OWNER_FORBIDDEN', )

        target_user = db.session.query(User).filter(
            User.id == target_id,
        ).first()

        today = date.today()
        user_age = today.year - target_user.birth_date.year - \
                   ((today.month, today.day) < (target_user.birth_date.month, target_user.birth_date.day))
        if not (event.age_from <= user_age <= event.age_to):
            return error_func(error_status=400,
                              error_description='User does not fit age restrictions.',
                              error_message='USER_AGE_RESTRICTED', )

        target_in_event = db.session.query(UserInEvent).filter(
            UserInEvent.user_id == target_id,
            UserInEvent.event_id == event.id,
        ).first()

        if not target_in_event:
            return error_func(error_status=404,
                              error_description='User does not have request for this event.',
                              error_message='USER_NOT_REQUESTED_EVENT', )

        target_in_event.user_event_status_id = target_status

        db.session.commit()

    except Exception:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED', )

    return Response(status=200)


@socketio.on('get_request_users', namespace=NAMESPACE)
@visitor_allowed_socket
def get_request_members(*args, **kwargs):
    """
    Function that returns list of requests to participate in event.
    :return:
    """

    event = args[0]
    user = args[1]
    user_is_owner = user.id == event.owner_id

    if not user_is_owner:
        return error_func(error_status=403,
                          error_description='Only admin/owner can get membership requests.',
                          error_message='USER_NOT_OWNER_FORBIDDEN', )
    try:
        # check initial filters
        # we need to do this, because if filters will be empty,
        # query will return all users in database (filter() behaviour)
        filters = [*(User.id == q_user.user_id
                     for q_user in event.users
                     # user status has to be 'waiting for approve'
                     if q_user.user_event_status_id == 1)]
        if filters:
            # get all requested members
            members = db.session.query(User).filter(
                or_(*(User.id == q_user.user_id
                      for q_user in event.users
                      # user status has to be 'waiting for approve'
                      if q_user.user_event_status_id == 1))
            ).order_by(
                User.first_name,
                User.last_name
            ).all()
        else:
            members = []

        today = date.today()

        socketio.emit(
            'receive_request_members',
            {
                'members': [
                    {
                        'id': member.id,
                        'name': member.first_name,
                        'surname': member.last_name,
                        'nickname': member.nickname,
                        'rating': member.rating,
                        'age': today.year - member.birth_date.year -\
                               ((today.month, today.day) < (member.birth_date.month, member.birth_date.day)),
                        'image_url': member.image_url,
                    } for member in members
                ],
            },
            room=request.sid,
            namespace=NAMESPACE
        )
    except Exception:
        error_func()


@socketio.on('rate_user', namespace=NAMESPACE)
@visitor_allowed_socket
def rate_user(*args, **kwargs):
    """
    Function that create a feedback for the user.
    Required parameters:
        - target_user_id : (int) { required } : id of user function need to kick from an event
        - mark : (int) { required } : mark that request user gave to the tarhet user
        - comment : (str) { optional } : comment that user can leave
    :return:
    """

    event = args[0]
    user = args[1]
    data = args[2]

    try:
        target_user_id = data.get('target_user_id')
        mark = data.get('mark')
        comment = data.get('comment')

        if not target_user_id:
            return error_func(error_status=400,
                              error_description='User id ws not found.',
                              error_message='USER_ID_NOT_FOUND', )
        if not mark:
            return error_func(error_status=400,
                              error_description='Rate for user is empty.',
                              error_message='USER_RATE_NOT_FOUND', )
        if target_user_id == user.id:
            return error_func(error_status=400,
                              error_description='User can not rate themselves.',
                              error_message='USER_RATE_FORBIDDEN', )
        if event.event_status_id != 2:
            return error_func(error_status=400,
                              error_description='Only when event was finished feedback can be left.',
                              error_message='EVENT_NOT_FINISHED', )

        feedback = db.session.query(Feedback).filter(
            Feedback.event_id == event.id,
            Feedback.user_from_id == user.id,
            Feedback.user_to_id == target_user_id,
        ).first()

        if not feedback:
            feedback = Feedback(
                rating=mark,
                text=comment if comment else None,
                feedback_time=datetime.utcnow(),
                event_id=event.id,
                user_from_id=user.id,
                user_to_id=target_user_id,
            )

            db.session.add(feedback)

        else:
            feedback.rating = mark
            feedback.text = comment or None

        db.session.commit()

        User.update_rating(target_user_id)

    except Exception as ex:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED')

    return Response(status=200)
