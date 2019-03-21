from flask import jsonify, session, request, Response
from sqlalchemy import or_

from api.routes import routes
from ..models import (db,
                      User,
                      )

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

@routes.route('/another-users-profile', methods=['POST'])
def another_users_profile():
    """
    Function that returns data about the selected user
    if user is logged in
    :return:
    """
    another_user = request.json['another_user']
    print(another_user)
    try:
        current_user = User.query.filter(User.id == session.get('user'), User.status_id == 1).first()
        if not current_user:
            return error_func(error_status=401,
                            error_description='User is not authorized.',
                            error_message='UNAUTHORIZED_USER')
        another_user = User.query.filter(User.id == another_user).first()
        return jsonify(
            {'code': 200,
             'users_profile': {
                'user_nickname': another_user.nickname,
                'user_email': another_user.email,
                'user_phone': another_user.phone,
                'user_first_name': another_user.first_name,
                'user_last_name': another_user.last_name,
                'user_birth_date': another_user.birth_date,
                'user_rating': another_user.rating,
                'user_image_url': another_user.image_url,
                'user_description': another_user.description,
                'user_viber_account': another_user.viber_account,
                'user_telegram_account': another_user.telegram_account,
                }
            }
        )
    except:
        return jsonify({'code': 0, 'message': 'false'})
    