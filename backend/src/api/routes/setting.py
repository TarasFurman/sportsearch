import requests
from flask import request, session, jsonify
from api.routes import routes
from ..models import db, User, NotificationType
from functools import wraps
from .notification_service import send
from sqlalchemy import update

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

        return jsonify(
            {
                'code': 200,
                'settings_data': query,
            }
        )

    if request.method == 'POST':
        user_id = session.get('user')
        req = request.get_json().get('setting')
        User.query.filter(User.id == user_id).update(dict(settings=req))
        db.session.commit()
        telegram_chat = db.session.query(User).filter(User.id == user_id).first().telegram_account
        if req.get('telegram_notification') and not telegram_chat:
            url = 'https://api.telegram.org/bot628686042:AAE7G9c_5cv082F8fEZN-97U2GFDXb6rSYM/getUpdates'
            response = requests.get(url).json()
            chat_id = response['result'][0]['message']['chat']['id']
            User.query.filter(User.id == user_id).update(dict(telegram_account=chat_id))
            db.session.commit()
            print(chat_id)
            print('telegramTrue')
        else:
            print('telegramFalse')
        return jsonify({'code': 200})


