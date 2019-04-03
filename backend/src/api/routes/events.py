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


@routes.route('/my-events/page=<int:page_num>', methods=['POST'])
@is_active_user
def events(*args, page_num):

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
    
    # Main query
    user_id = session['user']
    filters = [UserInEvent.user_id == user_id]
    query = db.session.query(Event, UserInEvent, UserEventStatus.name, \
        User.nickname, SportType.name, EventStatus.name)\
        .outerjoin(UserInEvent, UserInEvent.event_id == Event.id)\
        .outerjoin(UserEventStatus, UserInEvent.user_event_status_id == UserEventStatus.id)\
        .outerjoin(User, User.id == Event.owner_id)\
        .outerjoin(SportType, SportType.id == Event.sport_id)\
        .outerjoin(EventStatus, EventStatus.id == Event.event_status_id)
      
    if request.method == 'POST':
        req = request.get_json().get('filters')
        
        sport_types = {
            'football': 1,
            'volleyball': 2,
            'chess': 3,
            'basketball': 4,
            'ping_pong': 5,
            'other': 6
        }

        user_event_status = {
            'waiting': 1,
            'approved': 2,
            'rejected': 3,
            'kicked': 4
        }

        sport_type_filter = []
        owner_filter = []
        user_status_filter = []

        for k, v in sport_types.items():
            if req.get(k):
                sport_type_filter.append(Event.sport_id == v)

        for k, v in user_event_status.items():
            if req.get(k):
                user_status_filter.append(UserInEvent.user_event_status_id == v)

        if req.get('owner'):
            owner_filter.append(Event.owner_id == user_id)
        if req.get('not_owner'):
            owner_filter.append(Event.owner_id != user_id)
        
        # Pagination
        limit = 8
        length = query.filter(*filters, \
                    or_(*sport_type_filter), or_(*owner_filter), or_(*user_status_filter)).count()
        if page_num == 1:
            offset = 0
        else:
            offset = page_num*limit - limit
        
        if length%limit == 0:
            pages = length//limit
        else:
            pages = length//limit + 1
        
        # Database querie

        events = query.filter(*filters, \
                or_(*sport_type_filter), or_(*owner_filter), or_(*user_status_filter))\
                    .order_by(Event.start_time.desc()).offset(offset).limit(limit).all()
        if events:
            return jsonify(
                {
                    'code': 200,
                    'pages': pages,
                    'events_data': [
                        {
                            'start_time': event.start_time.isoformat(' '),
                            'id':event.id,
                            'name': event.name,
                            'image_url': event.image_url,
                            'end_time': event.end_time.isoformat(' '),
                            'price': event.price,
                            'age_from': event.age_from,
                            'age_to': event.age_to,
                            'x_coord': event.x_coord,
                            'y_coord': event.y_coord,
                            'status': userEventStatus,
                            'members_total': event.members_total,
                            'members_needed': event.members_needed,
                            'owner': user,
                            'address':event.address,
                            'sport_name': sportType,
                            'event_status': eventStatus
                        } for event, userInEvent, userEventStatus, user,\
                            sportType, eventStatus in events
                    ]
                }
            )
        else:
            return error_func(error_status=404,
                              error_description='No events with this filters',
                              error_message='NO_EVENTS',)


        # sport_types = {
        #     'football': 1
        # }

        # sport_type_filter = [Event.sport_id == sport_id 
        #     for sport_name, sport_id in filter(lambda k, v: k in req, sport_types.items())]
            
