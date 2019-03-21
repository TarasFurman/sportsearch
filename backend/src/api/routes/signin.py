from flask import request, session, jsonify
from api.routes import routes

from ..models import User
from .signup import is_email


def is_user(email, password):
    user = User.query.filter(User.email == email).first()
    if user and user.check_password(password):
        return user.id
    return False


def confirm_user(email):
    user = User.query.filter(User.email == email).first()
    if user and user.status_id == 1:
        return True
    return False


@routes.route('/header', methods=['GET'])
def header():
    if request.method == 'GET':
        try:
            print(session.get('user'))
            user = User.query.filter(User.id == session.get('user')).first()
            return jsonify({'code': 200, 'message': user.first_name})
        except:
            return jsonify({'code': 0, 'message': 'false'})
    else:
        return jsonify({'code': 0, 'message': 'false'})


@routes.route('/signIn', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        session.pop('user', None)
        req = request.get_json().get('obj')
        if is_email(req.get('email')):
            user = is_user(req.get('email'), req.get('password'))
            conf_user = confirm_user(req.get('email'))
            if user:
                if conf_user:
                    session['user'] = user
                    user = User.query.filter(User.id == session.get('user')).first()
                    return jsonify({'code': 200, 'message': user.first_name})
                return jsonify({'code': 0, 'message': 'not confirmed'})
            else:
                return jsonify({'code': 0, 'message': 'not user'})
        return jsonify({'code': 0, 'message': 'not email or password'})
    else:
        return jsonify({'code': 0, 'message': 'error'})


@routes.route('/logout', methods=['GET', 'POST'])
def logout():
    if request.method == 'GET':
        try:
            session.pop('user', None)
            return jsonify({'code': 200, 'message': 'success'})
        except:
            return jsonify({'code': 0, 'message': 'error'})
