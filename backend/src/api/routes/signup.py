from re import compile, match

from flask import request, session, jsonify, url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

from api.routes import routes
from ..models import db, User

from conf import APP_CONFIG

s = URLSafeTimedSerializer(APP_CONFIG.SECRET_KEY)

mail = Mail()


def create_nickname(first_name, last_name):
    nick = first_name+last_name
    nick = nick.lower()
    users = count_nickname(nick)
    count = len(users)
    if count:
        nickname = nick + str(count)
    else:
        nickname = nick
    return nickname


def is_email(email):
    pattern = compile(r'^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$')
    is_valid = pattern.match(email)
    return bool(is_valid)


def confirm_password(password, conf_password):
    if password:
        return password == conf_password
    else:
        return False


def send_mail(email):
    token = s.dumps(email, salt=APP_CONFIG.SECURITY_PASSWORD_SALT)
    msg = Message('Confirm Email', sender=APP_CONFIG.MAIL_USERNAME, recipients=[email])
    link = url_for('routes.confirm_email', token=token, _external=True)
    msg.body = 'Your link is {}'.format(link)
    mail.send(msg)


def save_user(user):
    db.session.add(user)
    db.session.commit()


def is_user(email):
        result = User.query.filter(User.email == email).all()
        return bool(result)


def count_nickname(nick):
    pattern = r'{}%'.format(nick)
    result = User.query.filter(User.nickname.like(pattern)).all()
    return result


@routes.route('/signUp', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        session.pop('user', None)
        req = request.get_json().get('obj')
        if is_email(req.get('email')) and confirm_password(req.get('password'), req.get('confirm_password')):
            if is_user(req.get('email')):
                return jsonify({'code': 1, 'error': 'email is used'})
            else:
                nickname = create_nickname(req.get('first_name'), req.get('last_name'))
                try:
                    user = User(nickname=nickname,
                                email=req.get('email'),
                                phone=req.get('phone'),
                                password=User.set_password(req.get('password')),
                                first_name=req.get('first_name'),
                                last_name=req.get('last_name'),
                                birth_date=req.get('birth_date'),
                                status_id=2)
                    send_mail(req.get('email'))
                except:
                    return jsonify({'code': 0, 'error': 'not send mail'})
                save_user(user)
                return jsonify({'code': 200})
        return jsonify({'error': 'not email or password'})
    else:
        return jsonify({'error': 'error'})


@routes.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        email = s.loads(token, salt=APP_CONFIG.SECURITY_PASSWORD_SALT)
        user = User.query.filter(User.email == email).update(dict(status_id=1))
        db.session.commit()
    except SignatureExpired:
        return '<h1>The token is expired!</h1>'
    return '<h1>Mail was confirmed! You can sign in <a href=\'http://localhost:5998/signin\'>here</a></h1>'
