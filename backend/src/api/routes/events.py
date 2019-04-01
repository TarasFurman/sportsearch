"""This module is for getting events of register user and filter them.  """
from functools import wraps
from flask import request, session, jsonify
from sqlalchemy import or_
from api.routes import routes

from ..models import Event, User, UserInEvent, EventStatus, SportType, UserEventStatus, db

def error_func(error_status=400,
               error_description='Unknown error was occurred. Check your data and try to \
                   send your request later.',
               error_message='UNKNOWN_ERROR'):
    return jsonify(
        {
            'error': {
                'status': error_status,
                'description': error_description,
                'message': error_message,
            },
        }
    )

def is_active_user(func):
    @wraps(func)
    def inner(*args, **kwargs):
        try:
            user_id = session['user']  # identify user by their id
            user = db.session.query(User).filter(
                User.id == user_id,
                User.status_id == 1,  # only active users
            ).first()
            return func(user, *args, **kwargs)
        except KeyError:
            return error_func(error_status=404,
                              error_description='User is unauthorized.',
                              error_message='UNAUTHORIZED_USER',)
    return inner


@routes.route('/my-events', methods=['GET', 'POST'])
@is_active_user
def events(*args):

    # ev = Event(
    # name = "event5",
    # lng = 51.443575,
    # lat = 30.597445,
    # _start_time = "2019-04-29 17:30:00",
    # _end_time = "2019-04-28 20:30:00",
    # age_from = 22,
    # age_to = 26,
    # members_total = 10,
    # members_needed = 4,
    # sport_id = 6,
    # event_status_id = 1,
    # owner_id = 3
    # )

    # db.session.add(ev)
    # db.session.commit()

    # ev = UserInEvent(
    #     user_event_status_id  = 4,
    #     event_id = 24,
    #     user_id = 16
    # )
    # db.session.add(ev)
    # db.session.commit()
  
    user_id = session['user']
    filters = [UserInEvent.user_id == user_id]
    query = db.session.query(Event, UserInEvent, UserEventStatus, User, SportType, EventStatus)\
        .outerjoin(UserInEvent, UserInEvent.event_id == Event.id)\
        .outerjoin(UserEventStatus, UserInEvent.user_event_status_id == UserEventStatus.id)\
        .outerjoin(User, User.id == Event.owner_id)\
        .outerjoin(SportType, SportType.id == Event.sport_id)\
        .outerjoin(EventStatus, EventStatus.id == Event._event_status_id)
            
    if request.method == 'GET':
        events = query.filter(*filters).order_by(Event._start_time.desc()).all()   
        return jsonify(
            {
                'code': 200,
                'events_data': [
                    {
                        'start_time': event._start_time.isoformat(' '),
                        'id':event.id,
                        'name': event.name,
                        'image_url': event.image_url,
                        'end_time': event._end_time.isoformat(' '),
                        'price': event.price,
                        'age_from': event.age_from,
                        'age_to': event.age_to,
                        'lng': event.lng,
                        'lat': event.lat,
                        'status': userEventStatus.name,
                        'members_total': event.members_total,
                        'members_needed': event.members_needed,
                        'owner': user.nickname,
                        'address':event.address,
                        'sport_name': sportType.name,
                        'event_status': eventStatus.name
                    } for event, userInEvent, userEventStatus,\
                        user, sportType, eventStatus in events
                ]
            }
        )

    if request.method == 'POST':
        sport_type_filter = []
        owner_filter = []
        user_status_filter = []
        req = request.get_json().get('filters')
        if req.get('football'):             # adding filters
            sport_type_filter.append(Event.sport_id == 1)
        if req.get('volleyball'):
            sport_type_filter.append(Event.sport_id == 2)
        if req.get('chess'):
            sport_type_filter.append(Event.sport_id == 3)
        if req.get('basketball'):
            sport_type_filter.append(Event.sport_id == 4)
        if req.get('ping_pong'):
            sport_type_filter.append(Event.sport_id == 5)
        if req.get('other'):
            sport_type_filter.append(Event.sport_id == 6)
        if req.get('owner'):
            owner_filter.append(Event.owner_id == user_id)
        if req.get('not_owner'):
            owner_filter.append(Event.owner_id != user_id)
        if req.get('waiting'):
            user_status_filter.append(UserInEvent.user_event_status_id == 1)
        if req.get('approved'):
            user_status_filter.append(UserInEvent.user_event_status_id == 2)
        if req.get('rejected'):
            user_status_filter.append(UserInEvent.user_event_status_id == 3)
        if req.get('kicked'):
            user_status_filter.append(UserInEvent.user_event_status_id == 4)
        # Database queries
        if sport_type_filter and owner_filter and user_status_filter:
            events = query.filter(*filters, \
                or_(*sport_type_filter), or_(*owner_filter), or_(*user_status_filter))\
                    .order_by(Event._start_time.desc()).all()
        elif sport_type_filter and owner_filter:
            events = query.filter(*filters, \
                or_(*sport_type_filter), or_(*owner_filter))\
                .order_by(Event._start_time.desc()).all()
        elif owner_filter and user_status_filter:
            events = query.filter(*filters, \
                or_(*owner_filter), or_(*user_status_filter))\
                .order_by(Event._start_time.desc()).all()
        elif user_status_filter and sport_type_filter:
            events = query.filter(*filters, \
                or_(*user_status_filter), or_(*sport_type_filter))\
                .order_by(Event._start_time.desc()).all()
        elif owner_filter:
            events = query.filter(*filters, \
                or_(*owner_filter)).order_by(Event._start_time.desc()).all()
        elif sport_type_filter:
            events = query.filter(*filters, \
                or_(*sport_type_filter)).order_by(Event._start_time.desc()).all()
        elif user_status_filter:
            events = query.filter(*filters, \
                or_(*user_status_filter)).order_by(Event._start_time.desc()).all()
        else:
            events = query.filter(*filters).order_by(Event._start_time.desc()).all()

        return jsonify(
            {
                'code': 200,
                'events_data': [
                    {
                        'start_time': event._start_time.isoformat(' '),
                        'id':event.id,
                        'name': event.name,
                        'image_url': event.image_url,
                        'end_time': event._end_time.isoformat(' '),
                        'price': event.price,
                        'age_from': event.age_from,
                        'age_to': event.age_to,
                        'lng': event.lng,
                        'lat': event.lat,
                        'status': userEventStatus.name,
                        'members_total': event.members_total,
                        'members_needed': event.members_needed,
                        'owner': user.nickname,
                        'address':event.address,
                        'sport_name': sportType.name,
                        'event_status': eventStatus.name
                    } for event, userInEvent, userEventStatus, user,\
                        sportType, eventStatus in events
                ]
            }
        )
