from datetime import datetime, date
from flask import jsonify, request, Response
from sqlalchemy import or_
from .notification_service import send
from . import routes
from .useful_decorators import visitor_allowed_event, error_func, apply_event
from ..models import (db,
                      User,
                      Event,
                      UserInEvent,
                      EventStatus,
                      Feedback)



@routes.route('/apply-for-event/<int:event_id>', methods=['GET'])
@apply_event
def apply_for_event(*args, **kwargs):
    event = args[0]
    user = args[1]

    print(event.owner_id)
    print(user.id)
    if event.owner_id == user.id:
        return error_func(error_status=403,
                          error_description='Owner can not apply to his own event.',
                          error_message='OWNER_EVENT', )

    if event.event_status_id != 1:
        return error_func(error_status=403,
                          error_description='Users can apply to an planned event.',
                          error_message='EVENT_NOT_PLANNED', )

    if not user.birth_date:
        return error_func(error_status=403,
                          error_description='User not specified birth date.',
                          error_message='BIRTHDATE_IS_EMPTY', )
    
    today = date.today()  
    age = today.year - user.birth_date.year - ((today.month, today.day)\
         < (user.birth_date.month, user.birth_date.day))
    
    

    user_in_event = UserInEvent(
        user_event_status_id=1,
        event_id=event.id,
        user_id=user.id
    )

    send(8, user_id=event.owner_id, event_id=event.id) #send notification to owner(new request)

    db.session.add(user_in_event)
    db.session.commit()
    db.session.close()

    return jsonify(
        {
        'user_data':{
            'id': user.id
        },

        'event_data':{
            'id': event.id,
            'name': event.name,
            'status_id': event.event_status_id,
        }
    })

@routes.route('/event/<int:event_id>/info', methods=['GET'])
@visitor_allowed_event
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
                'lng': event.lng,
                'lat': event.lat,
                'status': db.session.query(EventStatus)
                    .filter(EventStatus.id == event.event_status_id).first().name,
                'status_id': event.event_status_id,
                'members_total': event.members_total,
                'members_needed': event.members_needed,
                'owner_id': event.owner_id,
            }
        }
    )


@routes.route('/event/<int:event_id>/leave', methods=['GET'])
@visitor_allowed_event
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
                          error_message='EVENT_NOT_PLANNED', )
    if is_owner:
        return error_func(error_status=403,
                          error_description='Admin/owner can not leave event.',
                          error_message='USER_OWNER_FORBIDDEN', )

    user_in_event = db.session.query(UserInEvent).filter(
        UserInEvent.event_id == event.id,
        UserInEvent.user_id == user.id,
    ).first()

    user_in_event.user_event_status_id = 3

    db.session.commit()

    return Response(status=200)


@routes.route('/event/<int:event_id>/cancel', methods=['GET'])
@visitor_allowed_event
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
                          error_message='USER_NOT_OWNER_FORBIDDEN', )
    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Only active event can be canceled.',
                          error_message='EVENT_NOT_PLANNED', )

    event.event_status_id = 3
    db.session.commit()
    send(5, event_id=event.id)
    
    return Response(status=200)


@routes.route('/event/<int:event_id>/users/search', methods=['GET'])
@visitor_allowed_event
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
                          error_message='USER_NOT_OWNER_FORBIDDEN', )
    if event.event_status_id != 1:
        return error_func(error_status=400,
                          error_description='Users can be only invited to an planned event.',
                          error_message='EVENT_NOT_PLANNED', )

    today = date.today()

    try:
        nick = request.args.get('nickname')

        if not nick:
            return error_func(error_status=400,
                              error_description='Nickname missed.',
                              error_message='INCORRECT_DATA_PROVIDED', )

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
                UserInEvent.user_event_status_id.is_(None), )
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
                          error_message='INCORRECT_DATA_PROVIDED', )

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


@routes.route('/event/<int:event_id>/user/invite', methods=['POST'])
@visitor_allowed_event
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
                              error_message='USER_ID_NOT_FOUND', )

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
            
            send(9, user_id=target_id, event_id=event.id)   #notification (event_invitation)
            db.session.add(user_event)

        db.session.commit()

    except Exception as ex:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED', )

    return Response(status=200)
