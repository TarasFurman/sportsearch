import dateutil.parser
from flask import request, jsonify, session
from datetime import datetime
from cerberus import Validator


from . import routes
from ..models import Event, SportType, UserInEvent


@routes.route('/sports')
def get_sports():
    '''
    endpoint that returns all sport types
    '''
    sports = SportType.get_sports()
    data = list({'ids': sport.id, 'name': sport.name} for sport in sports)
    return jsonify(data)


@routes.route("/events", methods=["POST"])
def create_event():
    """
    endpoint that creates new event
    """
    if 'user' not in session:
        return jsonify({
            'code': 401,
            'message': 'Please, authenticate'
        })
    
    schema = {
        "name": {"type": "string", "minlength":3, "maxlength": 200},
        "image_url": {"type": "string"},
        "x_coord": {"type": "float", "min": -180, "max": 180},
        "y_coord": {"type": "float", "min": -90, "max": 90},
        "period": {"type": "integer", "min": 0, "max": 365},
        "price": {"type": "integer", "min": 0, "max": 100000},
        "age_from": {"type": "integer", "min": 1, "max": 100},
        "age_to": {"type": "integer", "min": 1, "max": 100},
        "members_total": {"type": "integer", "min": 1, "max": 1000},
        "members_needed": {"type": "integer", "min": 0, "max": 1000},
        "sport_id": {"type": 'integer', 'min': 1},
        "owner_id": {"type": 'integer', 'min': 1},
        "event_status_id": {"type": 'integer', 'min': 1},
        "_start_time": {'type': 'datetime'},
        "_end_time": {'type': 'datetime'},
        'description': {'type': 'string', 'maxlength': 1000}
    }

    try:
        data = request.json
        data['owner_id'] = session['user']

        start_time = dateutil.parser.parse(data['start_time'])
        end_time = dateutil.parser.parse(data['end_time'])

        # rewrite dates
        del data['end_time']
        del data['start_time']
        data.update({'_start_time': start_time})
        data.update({'_end_time': end_time})

        validator = Validator(schema)
        is_valid = validator.validate(data)

        # validate data
        if (is_valid and (datetime.now() < start_time < end_time)
            and (data['members_needed'] < data['members_total'])
            and (data['age_from'] <= data['age_to'])):

            # insert into DB new event
            event = Event(**data)
            instance_id = Event.create_event(event)
            user_id = session['user']
            
            # add user to event
            newUserInEvent = UserInEvent(event_id=instance_id, user_id=user_id, user_event_status_id=2)
            UserInEvent.create_userInEvent(newUserInEvent)

            return jsonify({
                'code': 201,
                'message': 'New event was created successfully',
                'id': instance_id,
            })
        else:
            return jsonify({
                'code': 400,
                'message': 'Validation failed',
                'errors': {
                    **validator.errors,
                    'others': 'Check dates and ages!'
                }
            })
    except KeyError:
        return jsonify({
            'code': 500,
            'message': 'Something went wrong'
        })
