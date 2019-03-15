from flask import jsonify, request

from . import routes
from .useful_decorators import visitor_allowed_feedback, error_func
from ..models import (db,
                      Feedback)


@routes.route('/feedbacks/info/<int:target_id>', methods=['GET'])
@visitor_allowed_feedback
def get_feedbacks_info(*args, **kwargs):
    """
    Function that returns short info about a user we want to
    get feedbacks about.
    :return:
    """
    target_user = args[1]

    return jsonify(
        {
            'user_data': {
                'authorized': True,
                'id': target_user.id,
                'nick': target_user.nickname,
                'first_name': target_user.first_name,
                'last_name': target_user.last_name,
                'rating': target_user.rating,
                'image_url': target_user.image_url,
            }
        }
    )


@routes.route('/feedbacks/data/<int:target_id>', methods=['GET'])
@visitor_allowed_feedback
def get_feedbacks_data(*args, **kwargs):
    """
    Function that will return feedbacks about the user.
    You can pass here next parameters:
        - limit : (int) : number of rows that will be normally returned from the whole query
        - offset : (int) : number of rows you want to be skipped (from the beginning)
    :return:
    """

    target_user = args[1]

    try:
        feedbacks = db.session.query(Feedback).filter(
            Feedback.user_to_id == target_user.id,
        ).order_by(
            Feedback.feedback_time.desc()
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
            'feedbacks': [
                {
                    'id': feedback.id,
                    'text': feedback.text,
                    'rating': feedback.rating,
                    'feedback_time': feedback.feedback_time.isoformat(),
                    'sender_id': feedback.sender.id,
                    'sender_nickname': feedback.sender.nickname,
                    'sender_first_name': feedback.sender.first_name,
                    'sender_last_name': feedback.sender.last_name,
                    'sender_image_url': feedback.sender.image_url,
                    'event_id': feedback.event.id,
                    'sport_type': feedback.event.sport_type.name,
                    'event_start_time': feedback.event.start_time.isoformat(),
                } for feedback in feedbacks
            ]
        }
    )
