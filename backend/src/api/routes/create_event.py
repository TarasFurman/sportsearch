import os
import boto3
import imghdr
import dateutil.parser
from flask import request, jsonify, session
from datetime import datetime
from cerberus import Validator
from uuid import uuid4
from functools import wraps

from . import routes
from ..models import Event, SportType, UserInEvent


def login_required(func):
    """ Derorator to check is use in a session """
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'user' not in session:
            return jsonify({
                'code': 401,
                'message': 'Please, authenticate!',
            })
        else:
            return func(*args, **kwargs)
    return wrapper


@routes.route('/sports')
def get_sports():
    """ Endpoint that returns all sport types """
    sports = SportType.get_sports()
    data = list({'ids': sport.id, 'name': sport.name} for sport in sports)

    return jsonify(data)


def normalize(data):
    """ Normalize data for new event """
    try:
        start_time = dateutil.parser.parse(data['start_time'])
        end_time = dateutil.parser.parse(data['end_time'])
        del data['end_time']
        del data['start_time']
        data.update({'_start_time': start_time})
        data.update({'_end_time': end_time})
        return data
    except KeyError:
        return False


def validate(data):
    """ Validate data for new event """
    schema = {
        "name": {'required': True, "type": "string", "minlength":3, "maxlength": 200},
        "image_url": {"type": "string"},
        "lng": {'required': True, "type": "float", "min": -180, "max": 180},
        "lat": {'required': True, "type": "float", "min": -90, "max": 90},
        "period": {"type": "integer", "min": 0, "max": 365},
        "price": {'required': True, "type": "integer", "min": 0, "max": 100000},
        "age_from": {'required': True, "type": "integer", "min": 1, "max": 100},
        "age_to": {'required': True, "type": "integer", "min": 1, "max": 100},
        "members_total": {'required': True, "type": "integer", "min": 1, "max": 1000},
        "members_needed": {'required': True, "type": "integer", "min": 0, "max": 1000},
        "sport_id": {'required': True, "type": 'integer', 'min': 1},
        "owner_id": {'required': True, "type": 'integer', 'min': 1},
        "event_status_id": {'required': True, "type": 'integer', 'min': 1},
        "_start_time": {'required': True, 'type': 'datetime'},
        "_end_time": {'required': True, 'type': 'datetime'},
        'description': {'type': 'string', 'maxlength': 1000},
        'card_number': {'type': 'string', 'maxlength': 16},
        'card_holder': {'type': 'string', 'maxlength': 255},
    }

    validator = Validator(schema)
    is_valid = validator.validate(data)

    try:
        if (is_valid and (datetime.utcnow() < data['_start_time'] < data['_end_time'])
            and (data['members_needed'] < data['members_total'])
            and (data['age_from'] <= data['age_to'])):
            return True
        else:
            return False
    except KeyError:
        raise KeyError('Not enough data for new event')


@routes.route("/events", methods=["POST"])
@login_required
def create_event():
    """ Endpoint that creates new event """

    data = request.json
    data['owner_id'] = session['user']

    normalized_data = normalize(data)

    if normalized_data and validate(normalized_data):
        event = Event(**data)
        instance_id = Event.create_event(event)
        user_id = session['user']
        
        # add owner the to event to get access to event
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
        })


@routes.route('/upload_image', methods=['POST'])
@login_required
def upload_image_to_s3():
    """ Endpoint to upload image to amazon s3 """
    bucket = 'eventsportsearch'
    aws_access_key_id = 'AKIAWCGFITH6DGFB5MHH'
    aws_secret_access_key = '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'

    file = request.files.get('image')
    print('after getting file')

    if not file: 
        return jsonify({'message': 'File not found'})

    filetype = imghdr.what(file)

    if filetype not in ('png', 'jpg', 'jpeg'):
        return jsonify({'message': 'This file is not an image'})
    filename = str(uuid4())

    s3 = boto3.resource(
        's3',
        region_name='eu-north-1',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
    )
    
    s3.Bucket('eventsportsearch').put_object(
        Key=f'{filename}.png',
        Body=file,
        ACL='public-read',
    )

    return jsonify({
        'url': f'https://s3.eu-west-3.amazonaws.com/eventsportsearch/{filename}.{filetype}',
    })
