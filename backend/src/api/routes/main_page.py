from flask import request, jsonify, Response
# from sqlalchemy import func

from . import routes
from ..models import Event


@routes.route('/get-events', methods=['GET'])
def get_events():
    """
    Endpoint that returns list of events filtered by request data
    :return:
    """

    query = Event.get_events(request.args)

    # if there was any error, called method will return a jsonify object
    if isinstance(query, Response):
        return query

    return jsonify(
                {
                    'events': [
                        {
                            'name': ev.name,
                            'id': ev.id,
                            'sport_type': ev.sport_type.name,
                            'x_coord': ev.x_coord,
                            'y_coord': ev.y_coord,
                            'start_time': ev.start_time,
                            'end_time': ev.end_time,
                            'period': ev.period,
                            'price': ev.price,
                            'age_from': ev.age_from,
                            'age_to': ev.age_to,
                            'members_total': ev.members_total,
                            'members_needed': ev.members_needed,
                            'description': ev.description,
                            'owner_id': ev.owner_id,
                            'owner': ev.owner_joined.nickname,
                            'owner_rating': ev.owner_joined.rating,
                            'image_url': ev.image_url,
                            'address': ev.address
                        } for ev in query
                    ]
                }
            )


@routes.route('/get-filters', methods=['GET'])
def get_filters():
    """
    Endpoint that returns all filters that can be used on frontend
    :return:
    """

    return Event.get_filters()
