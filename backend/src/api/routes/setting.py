from flask import request, session, jsonify
from api.routes import routes
from ..models import db, User, NotificationType
from functools import wraps
from .notification_service import send


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


@routes.route('/settings', methods=['GET', 'POST'])
@is_active_user
def settings(*args):
    if request.method == 'GET':
        user_id = session.get('user')
        query = db.session.query(User.settings).filter(User.id == user_id).first()

        # notification_type = NotificationType.query.filter(NotificationType.id == 1).first().name
        # result = User.query.filter(User.id == user_id).first().settings[notification_type]
        return jsonify(
            {
                'code': 200,
                'settings_data': query,
                # 'result': result
            }
        )

    if request.method == 'POST':
        user_id = session.get('user')
        req = request.get_json().get('setting')
        User.query.filter(User.id == user_id).update(dict(settings=req))
        db.session.commit()
        # send(2, user_id=13, event_id=2)
        return jsonify({'code': 200})


