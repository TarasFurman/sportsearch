from flask import request, session, jsonify
from api.routes import routes

from ..models import User, db
from .signup import create_nickname, count_nickname, save_user


def is_user(email, auth_type):
    try:
        user = User.query.filter(User.email == email).first()
        if user and user.auth_type == auth_type:
            return user.id
        return False
    except:
        return False

def is_email(email):
        result = User.query.filter(User.email == email).all()
        return bool(result)


@routes.route('/facebook', methods=['GET', 'POST'])
def signin_fb():
    if request.method == 'POST':
        session.pop('user', None)
        req = request.get_json().get('obj')
        if is_user(req.get('email'), req.get('auth_type')):
            user = is_user(req.get('email'), req.get('auth_type'))
            session['user'] = user
            user = User.query.filter(User.id == session.get('user')).first()
            return jsonify({'code': 200, 'message': user.first_name})
        elif not is_user(req.get('email'), req.get('auth_type')):
            nickname = create_nickname(req.get('first_name'), req.get('last_name'))
            user = User(nickname=nickname,
                        email=req.get('email'),
                        access_token=req.get('accessToken'),
                        auth_type=req.get('auth_type'),
                        first_name=req.get('first_name'),
                        last_name=req.get('last_name'),
                        status_id=1)
            save_user(user)
            user = is_user(req.get('email'), req.get('auth_type'))
            session['user'] = user
            user = User.query.filter(User.id == session.get('user')).first()
            return jsonify({'code': 200, 'message': user.first_name})
        else:
            return jsonify({'error' : 'error'})

