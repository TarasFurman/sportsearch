from flask import request, session, jsonify
from api.routes import routes
from ..models import User, db


def is_user(email, auth_type):
    try:
        user = User.query.filter(User.email == email).first()
        if user and user.auth_type == auth_type:
            return user.id
        return False
    except:
        return False

def save_user(user):
    db.session.add(user)
    db.session.commit()
    db.session.close()

def is_email(email):
        result = User.query.filter(User.email == email).all()
        return bool(result)

def create_nickname(email):
    i = int(email.index('@'))
    nick = email[:i]

    users = count_nickname(nick)
    count = len(users)
    if count:
        nickname = nick + str(count)
    else:
        nickname = nick
    return nickname

def count_nickname(nick):
    pattern = r'{}%'.format(nick)
    result = db.session.query(User).filter(User.nickname.like(pattern)).all()
    return result
    
def create_firstname(name):
    i = name.index(' ')
    first_name = name[:i]
    return first_name

def create_lastname(name):
    i = name.index(' ')
    last_name = name[i+1:]
    return last_name


@routes.route('/google', methods=['GET', 'POST'])
def signin_google():
    if request.method == 'POST':
        session.pop('user', None)
        # return jsonify(request.get_json())
        req = request.get_json()
        
        if is_user(req.get('email'), req.get('type')):
            # return jsonify("is")
            user = is_user(req.get('email'), req.get('type'))
            session['user'] = user
            return jsonify({'code': 200, 'message': 'login'})
        elif not is_user(req.get('email'), req.get('type')):
            # return jsonify("isnt")
            nickname = create_nickname(req.get('email'))
            first_name = create_firstname(req.get('name'))
            last_name = create_lastname(req.get('name'))
            # return jsonify(nickname, req.get('email'), req.get('token'), req.get('type'), first_name, last_name)
            user = User(nickname=nickname,
                        email=req.get('email'),
                        access_token=req.get('token'),
                        auth_type=req.get('type'),
                        first_name=first_name,
                        last_name=last_name,
                        settings = {"email_notification": True, "telegram_notification": False, 
                                    "viber_notification": False, "request_approved": False, 
                                    "request_rejected": False, "is_kicked": False, "event_finished": False, 
                                    "event_canceled": False, "received_feedback": False, "before_event": False, 
                                    "event_request": False, "event_invitation": False},
                        status_id=1)
            # return jsonify(user)

            save_user(user)
            return jsonify({'code': 200, 'message': 'register'})
        else:
            return jsonify({'error' : 'error'})
