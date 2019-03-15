from datetime import datetime, date
from functools import wraps
from flask import jsonify, session, request, Response
from sqlalchemy import or_

from . import routes
from ..models import (db,
                      User,
                      Event,
                      UserInEvent,
                      Message,
                      EventStatus,
                      Feedback)


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


def visitor_allowed(func):
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
                                  error_message='INCORRECT_EVENT_ID',)

            event = db.session.query(Event).filter(Event.id == event_id).first()
            if not event:
                return error_func(error_status=404,
                                  error_description='Event was not found.',
                                  error_message='EVENT_NOT_FOUND',)

            user_id = session.get('user')  # identify user by their id
            user = db.session.query(User).filter(
                User.id == user_id,
                User.status_id == 1,  # only active users
            ).first()
            if not user:
                return error_func(error_status=404,
                                  error_description='User is unauthorized.',
                                  error_message='UNAUTHORIZED_USER',)

            if not db.session.query(UserInEvent).filter(
                    UserInEvent.user_id == user_id,
                    UserInEvent.event_id == event_id,
                    UserInEvent.user_event_status_id == 2,
            ).first():
                return error_func(error_status=403,
                                  error_description='User is not in this event.',
                                  error_message='USER_FORBIDDEN',)
            user_is_owner = (user == event.owner)

        except Exception:
            return error_func()

        return func(event, user, user_is_owner, *args, **kwargs)
    return inner


@routes.route('/event-room/<int:event_id>', methods=['GET'])
@visitor_allowed
def get_event_room(*args, **kwargs):
    """
    Function that returns data about an event
    :return:
    """

    event = args[0]
    user = args[1]
    is_owner = args[2]

    return jsonify(
        {
            'user_data': {
                'id': user.id,
                'authorized': True,
                'event_owner': is_owner,
            },
            'event_data': {
                'name': event.name,
                'description': event.description,
                'image_url': event.image_url,
                'start_time': event.start_time.isoformat(),
                'end_time': event.end_time.isoformat(),
                'price': event.price,
                'card_number': event.card_number,
                'card_holder': event.card_holder,
                'age_from': event.age_from,
                'age_to': event.age_to,
                'x_coord': event.x_coord,
                'y_coord': event.y_coord,
                'status': db.session.query(EventStatus)
                        .filter(EventStatus.id == event.event_status_id).first().name,
                'status_id': event.event_status_id,
                'members_total': event.members_total,
                'members_needed': event.members_needed,
                'owner_id': event.owner_id,
            }
        }
    )


@routes.route('/event-members/<int:event_id>', methods=['GET'])
@visitor_allowed
def get_event_members(*args, **kwargs):
    """
    Function that returns a list of event members
    :return:
    """

    event = args[0]
    user = args[1]

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

    return jsonify(
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
        }
    )


@routes.route('/event-messages/<int:event_id>', methods=['GET'])
@visitor_allowed
def get_event_messages(*args, **kwargs):
    """
    Function that returns list of messages for particular event using
    data from previous messages and offset (number of messages we want to return).
    You can pass here next parameters:
        - limit : (int) : number of rows that will be normally returned from the whole query
        - offset : (int) : number of rows you want to be skipped (from the beginning)
    :return:
    """

    event = args[0]

    # filters for the query that will get messages

    try:
        messages = db.session.query(Message).filter(
            Message.event_id == event.id,
        ).order_by(
            Message.message_time.desc()
        ).offset(
            request.args.get('offset') or None
        ).limit(
            request.args.get('limit') or None
        ).all()

    except Exception:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED')

    return jsonify(
        {
            'messages': [
                {
                    'id': message.id,
                    'text': message.text,
                    'message_time': message.message_time.isoformat(),
                    'sender_id': message.sender_id,
                    'sender_nickname': message.sender.nickname,
                    'sender_image_url': message.sender.image_url,
                } for message in messages
            ]
        }
    )


@routes.route('/new-event-messages/<int:event_id>', methods=['GET'])
@visitor_allowed
def get_new_event_messages(*args, **kwargs):
    """
    This function returns messages that are newer that the last message on a frontend.
    Required arguments:
        - last_time: (int) : timestamp to determine new messages
    :return:
    """

    event = args[0]

    try:
        if event.event_status_id not in (1, 4):
            return error_func(error_status=403,
                              error_description='Event was finished or cancelled.',
                              error_message='EVENT_FINISHED_OR_CANCELLED')

        last_time = request.args.get('last_time')

        if not last_time:
            raise Exception

        messages = db.session.query(Message).filter(
            Message.event_id == event.id,
            Message.message_time > last_time,
        ).order_by(
            Message.message_time.desc()
        ).all()

    except Exception:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED')

    return jsonify(
        {
            'messages': [
                {
                    'id': message.id,
                    'text': message.text,
                    'message_time': message.message_time.isoformat(),
                    'sender_id': message.sender_id,
                    'sender_nickname': message.sender.nickname,
                    'sender_image_url': message.sender.image_url,
                } for message in messages
            ]
        }
    )


@routes.route('/event-message/<int:event_id>', methods=['POST'])
@visitor_allowed
def send_event_message(*args, **kwargs):
    """
    This function send a message from a particular user in particular event chat.
    Required body:
        {
            "text": <your text here>,
        }
    :return:
    """

    event = args[0]
    user = args[1]

    try:
        message_text = request.get_json().get('text')

        if not message_text:
            return error_func(error_status=400,
                              error_description='Message text is empty or missed.',
                              error_message='MESSAGE_TEXT_EMPTY',)
        if event.event_status_id not in (1, 4):
            return error_func(error_status=403,
                              error_description='Event was finished or cancelled.',
                              error_message='EVENT_FINISHED_OR_CANCELLED',)

        message = Message(
            text=message_text,
            message_time=datetime.utcnow(),
            event_id=event.id,
            sender_id=user.id,
        )
        db.session.add(message)
        db.session.commit()
    except Exception:
        return error_func()

    return Response(status=200)


@routes.route('/leave-event/<int:event_id>', methods=['GET'])
@visitor_allowed
def leave_event(*args, **kwargs):
    """
    Function that kicks user from an event because of his desire.
    :return:
    """

    event = args[0]
    user = args[1]
    is_owner = args[2]

    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Only planned events can be left.',
                          error_message='EVENT_NOT_PLANNED',)
    if is_owner:
        return error_func(error_status=403,
                          error_description='Admin/owner can not leave event.',
                          error_message='USER_OWNER_FORBIDDEN',)

    user_in_event = db.session.query(UserInEvent).filter(
        UserInEvent.event_id == event.id,
        UserInEvent.user_id == user.id,
    ).first()

    user_in_event.user_event_status_id = 3

    db.session.commit()

    return Response(status=200)


@routes.route('/cancel-event/<int:event_id>', methods=['GET'])
@visitor_allowed
def cancel_event(*args, **kwargs):
    """
    Function that cancels an event because of event owner desire.
    :return:
    """

    event = args[0]
    user_is_owner = args[2]

    if not user_is_owner:
        return error_func(error_status=403,
                          error_description='Only event owner can cancel event.',
                          error_message='USER_NOT_OWNER_FORBIDDEN',)
    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Only active event can be canceled.',
                          error_message='EVENT_NOT_PLANNED',)

    event.event_status_id = 3

    db.session.commit()

    return Response(status=200)


@routes.route('/kick-user/<int:event_id>', methods=['DELETE'])
@visitor_allowed
def kick_user(*args, **kwargs):
    """
    Function that kicks a user from an event.
    Required parameters:
        - kick_user_id : (int) { required } : id of user function need to kick from an event
    :return:
    """

    event = args[0]
    user = args[1]
    user_is_owner = args[2]

    if not user_is_owner:
        return error_func(error_status=403,
                          error_description='Only event owner can kick users.',
                          error_message='USER_NOT_OWNER_FORBIDDEN',)
    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Users can be kicked only from active events.',
                          error_message='EVENT_NOT_PLANNED',)

    try:
        kick_id = request.get_json().get('kick_user_id')

        if not kick_id:
            return error_func(error_status=400,
                              error_description='Kick user id was not provided correctly.',
                              error_message='USER_ID_NOT_FOUND',)

        if user.id == kick_id:
            return error_func(error_status=403,
                              error_description='Admin/owner can not kick themselves.',
                              error_message='USER_OWNER_FORBIDDEN',)

        kick_in_event = db.session.query(UserInEvent).filter(
            UserInEvent.user_id == kick_id,
            UserInEvent.event_id == event.id,
        ).first()

        kick_in_event.user_event_status_id = 4

        db.session.commit()

    except Exception:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED',)

    return Response(status=200)


@routes.route('/rate-user/<int:event_id>', methods=['POST', 'PUT'])
@visitor_allowed
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

    try:
        target_user_id = request.get_json().get('target_user_id')
        mark = request.get_json().get('mark')
        comment = request.get_json().get('comment')

        if not target_user_id :
            return error_func(error_status=400,
                              error_description='User id ws not found.',
                              error_message='USER_ID_NOT_FOUND',)
        if not mark:
            return error_func(error_status=400,
                              error_description='Rate for user is empty.',
                              error_message='USER_RATE_NOT_FOUND',)
        if target_user_id == user.id:
            return error_func(error_status=400,
                              error_description='User can not rate themselves.',
                              error_message='USER_RATE_FORBIDDEN', )
        if event.event_status_id != 2:
            return error_func(error_status=400,
                              error_description='Only when event was finished feedback can be left.',
                              error_message='EVENT_NOT_FINISHED',)

        feedback = db.session.query(Feedback).filter(
            Feedback.event_id == event.id,
            Feedback.user_from_id == user.id,
            Feedback.user_to_id == target_user_id,
        ).first()

        if not feedback and request.method == 'POST':
            feedback = Feedback(
                rating=mark,
                text=comment if comment else None,
                feedback_time=datetime.utcnow(),
                event_id=event.id,
                user_from_id=user.id,
                user_to_id=target_user_id,
            )

            db.session.add(feedback)

        elif feedback and request.method == 'PUT':
            feedback.rating = mark
            feedback.text = comment or None
        else:
            pass

        db.session.commit()

        User.update_rating(target_user_id)

    except Exception as ex:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED')

    return Response(status=200)


@routes.route('/request-members/<int:event_id>', methods=['GET'])
@visitor_allowed
def get_request_members(*args, **kwargs):
    """
    Function that returns list of requests to participate in event.
    :return:
    """

    event = args[0]
    user_is_owner = args[2]

    if not user_is_owner:
        return error_func(error_status=403,
                          error_description='Only admin/owner can get membership requests.',
                          error_message='USER_NOT_OWNER_FORBIDDEN',)

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

    return jsonify(
        {
            'members': [
                {
                    'id': member.id,
                    'name': member.first_name,
                    'surname': member.last_name,
                    'nickname': member.nickname,
                    'rating': member.rating,
                    'age': today.year - member.birth_date.year - \
                           ((today.month, today.day) < (member.birth_date.month, member.birth_date.day)),
                    'image_url': member.image_url,
                } for member in members
            ],
        }
    )


@routes.route('/request-member/<int:event_id>', methods=['POST'])
@visitor_allowed
def grant_request_member(*args, **kwargs):
    """
    Function that kicks a user from an event.
    Required parameters:
        - target_user_id : (int) { required } : id of user that will be granted
        - target_user_status: (int) { required } : status of user that will be granted to him
    :return:
    """

    event = args[0]
    user = args[1]
    user_is_owner = args[2]

    if not user_is_owner:
        return error_func(error_status=403,
                          error_description='Only event owner can accept or decline users.',
                          error_message='USER_NOT_OWNER_FORBIDDEN',)
    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Users can be only accepted to an planned event.',
                          error_message='EVENT_NOT_PLANNED',)

    try:
        target_id = request.get_json().get('target_user_id')
        target_status = request.get_json().get('target_user_status')

        if not (target_id and target_status):
            return error_func(error_status=400,
                              error_description='Some of required fields missed.',
                              error_message='INCORRECT_DATA_PROVIDED',)

        if target_status not in (2, 3):
            return error_func(error_status=400,
                              error_description='User status can be changed only to 2 or 3.',
                              error_message='INCORRECT_STATUS_PROVIDED',)

        if user.id == target_id:
            return error_func(error_status=403,
                              error_description='Admin/owner can not grand themselves.',
                              error_message='USER_OWNER_FORBIDDEN',)

        target_user = db.session.query(User).filter(
            User.id == target_id,
        ).first()

        today = date.today()
        user_age = today.year - target_user.birth_date.year - \
                   ((today.month, today.day) < (target_user.birth_date.month, target_user.birth_date.day))
        if not (event.age_from <= user_age <= event.age_to):
            return error_func(error_status=400,
                              error_description='User does not fit age restrictions.',
                              error_message='USER_AGE_RESTRICTED',)

        target_in_event = db.session.query(UserInEvent).filter(
            UserInEvent.user_id == target_id,
            UserInEvent.event_id == event.id,
        ).first()

        if not target_in_event:
            return error_func(error_status=404,
                              error_description='User does not have request for this event.',
                              error_message='USER_NOT_REQUESTED_EVENT',)

        target_in_event.user_event_status_id = target_status

        db.session.commit()

    except Exception:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED',)

    return Response(status=200)


@routes.route('/search-members/<int:event_id>', methods=['GET'])
@visitor_allowed
def search_members(*args, **kwargs):
    """
    Function that returns list of people who can be invited.
    Required parameters:
        - nickname: (str) {required} : nickname that will be used to find user
    :return:
    """

    event = args[0]
    user_is_owner = args[2]

    if not user_is_owner:
        return error_func(error_status=403,
                          error_description='Only event owner can search users.',
                          error_message='USER_NOT_OWNER_FORBIDDEN',)
    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Users can be only invited to an planned event.',
                          error_message='EVENT_NOT_PLANNED',)

    today = date.today()

    try:
        nick = request.args.get('nickname')

        if not nick:
            return error_func(error_status=400,
                              error_description='Nickname missed.',
                              error_message='INCORRECT_DATA_PROVIDED',)


        # get all members that has an object that are not in an event
        # it includes users that were kicked, rejected and did not yet
        # interact with the event in any way
        # for this sake, we need to do LEFT OUTER JOIN user -> user_in_event
        found_members = db.session.query(
            User,
            UserInEvent
        ).outerjoin(
            UserInEvent,
            User.id == UserInEvent.user_id
        ).filter(
            User.nickname.ilike('%' + nick + '%'),
            or_(UserInEvent.event_id == event.id,
                UserInEvent.event_id.is_(None)),
            or_(UserInEvent.user_id == User.id,
                UserInEvent.user_id.is_(None)),
            or_(UserInEvent.user_event_status_id == 3,
                UserInEvent.user_event_status_id == 4,
                UserInEvent.user_event_status_id.is_(None),)
        ).order_by(
            User.nickname,
        ).offset(
            request.args.get('offset') or None
        ).limit(
            request.args.get('limit') or None
        ).all()

    except Exception:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED',)

    return jsonify(
        {
            'members': [
                {
                    'id': member.id,
                    'name': member.first_name,
                    'surname': member.last_name,
                    'nickname': member.nickname,
                    'rating': member.rating,
                    'age': today.year - member.birth_date.year - \
                           ((today.month, today.day) < (member.birth_date.month, member.birth_date.day)),
                    'image_url': member.image_url,
                    'event_status': getattr(mem_status, 'user_event_status_id', None)
                } for member, mem_status in found_members
            ],
        }
    )


@routes.route('/invite-member/<int:event_id>', methods=['POST'])
@visitor_allowed
def invite_member(*args, **kwargs):
    """
    Function that will change user status to 'waiting for user approving'
    Required parameters:
        - invite_user_id: (int) {required} : id of a user you want to invite
    :return:
    """

    event = args[0]
    user_is_owner = args[2]

    if not user_is_owner:
        return error_func(error_status=403,
                          error_description='Only event owner can search users.',
                          error_message='USER_NOT_OWNER_FORBIDDEN', )
    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Users can be only invited to an planned event.',
                          error_message='EVENT_NOT_PLANNED', )

    today = date.today()

    try:
        target_id = request.get_json().get('invite_user_id')

        if not target_id:
            return error_func(error_status=400,
                              error_description='Target user ID missed.',
                              error_message='USER_ID_NOT_FOUND',)

        target_user = db.session.query(User).filter(
            User.id == target_id,
        ).first()

        today = date.today()
        user_age = today.year - target_user.birth_date.year - \
                   ((today.month, today.day) < (target_user.birth_date.month, target_user.birth_date.day))
        if not (event.age_from <= user_age <= event.age_to):
            return error_func(error_status=400,
                              error_description='User does not fit age restrictions.',
                              error_message='USER_AGE_RESTRICTED',)

        user_event = db.session.query(UserInEvent).filter(
            UserInEvent.user_id == target_id,
            UserInEvent.event_id == event.id,
        ).first()

        if user_event:
            if user_event.user_event_status_id not in (3, 4):
                return error_func(error_status=400,
                                  error_description='User status is already set. '
                                                    'User is not kicked or rejected.',
                                  error_message='USER_STATUS_FORBIDDEN', )

            user_event.user_event_status_id = 5

        else:
            user_event = UserInEvent(event_id=event.id,
                                     user_id=target_id,
                                     user_event_status_id=5)
            db.session.add(user_event)

        db.session.commit()

    except Exception as ex:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED', )

    return Response(status=200)
