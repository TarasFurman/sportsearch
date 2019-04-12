from flask import request, session, jsonify, url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from conf import APP_CONFIG
from uuid import uuid4
import boto3
import imghdr

from api.routes import routes
from ..models import db, User, Event, UserInEvent
from .signup import create_nickname, count_nickname


s = URLSafeTimedSerializer(APP_CONFIG.SECRET_KEY)
mail = Mail()

@routes.route('/profile', methods=['GET', 'PUT'])
def profile():
    if request.method == 'GET':
        try:
            user = User.query.filter(User.id == session.get('user')).first()
            return jsonify({'code': 200,
                            'user_data':{
                                'user_id':user.id,
                                'nickname':user.nickname,
                                'email':user.email,
                                'phone':user.phone,
                                'first_name':user.first_name,
                                'last_name':user.last_name,
                                'birth_date':user.birth_date,
                                'rating':user.rating,
                                'image_url':user.image_url,
                                'description':user.description,
                                'viber_account':user.viber_account,
                                'telegram_account':user.telegram_account,
                            }
                           })
        except:
            return jsonify({'code': 0, 'message': 'false'})
    elif request.method == 'PUT':
        try:
            user = User.query.filter(User.id == session.get('user')).first()
            new_data = request.get_json().get('obj')
            if user.first_name != new_data.get('first_name') or \
            user.last_name != new_data.get('last_name'):
                user.nickname = create_nickname(new_data.get('first_name'),\
                new_data.get('last_name'))
            user.first_name = new_data.get('first_name')
            user.last_name = new_data.get('last_name')
            user.birth_date = new_data.get('birth_date')
            user.description = new_data.get('description')
            user.phone = new_data.get('phone')
            if user.email != new_data.get('email'):
                send_mail(user.id, new_data.get('email'))
            db.session.commit()
            return jsonify({'code':200, 'message': 'true'})
        except:
            return jsonify({'code': 0, 'message': 'False'})
    else:
        return jsonify({'code': 0, 'message': 'false'})


@routes.route('/change_email/<token>', methods=['GET', 'PUT'])
def change_email(token):
    if request.method == 'GET':
        try:
            emails = s.loads(token, salt=APP_CONFIG.SECURITY_PASSWORD_SALT, max_age=60*10)
            user = User.query.filter(User.id == emails.get('user_id')).first()
            return jsonify({'code': 200, 'message': 'True'})
        except:
            return jsonify({'code': 0, 'message': 'false'})
    elif request.method =='PUT':
        try:
            emails = s.loads(token, salt=APP_CONFIG.SECURITY_PASSWORD_SALT, max_age=60*10)
            user = User.query.filter(User.id == emails.get('user_id')).first()
            if user.check_password(request.get_json().get('password')):
                user.email = emails.get('new_email')
                db.session.commit()
                return jsonify({'code': 200, 'message': 'True'})
        except:
            return jsonify({'code': 0, 'message': request.get_json().get('password')})
    else:
        return jsonify({'code': 0, 'message': 'false'})

@routes.route('/change-password', methods=['GET'])
def change_password():
    if request.method == 'GET':
        try:
            user = User.query.filter(User.id == session.get('user')).first()
            send_password_mail(user.id, user.email)
            return jsonify({'code': 200, 'message': 'Mail was sended'})
        except:
            return jsonify({'code': 0, 'message': 'false'})


@routes.route('/confirm_password_changing/<token>', methods=['GET', 'PUT'])
def confirm_password_changing(token):
    if request.method == 'GET':
        try:
            user_id = s.loads(token, salt=APP_CONFIG.SECURITY_PASSWORD_SALT, max_age=60*10)
            user = User.query.filter(User.id == user_id.get('user_id')).first()
            return jsonify({'code': 200})
        except:
            return jsonify({'code': 0, 'message': 'false'})
    elif request.method =='PUT':
        try:
            user_id = s.loads(token, salt=APP_CONFIG.SECURITY_PASSWORD_SALT, max_age=60*10)
            new_data = request.get_json().get('obj')
            if  user_id.get('user_id') == session.get('user'):
                user = User.query.filter(User.id == user_id.get('user_id')).first()
                user.password = User.set_password(new_data.get('password'))
                db.session.commit()
                return jsonify({'code': 200})
        except:
            return jsonify({'code': 0, 'message': 'false'})

    else:
        return jsonify({'code': 0, 'message': 'false'})

@routes.route('/upload_profile_img', methods = ['GET', 'POST'])
def upload_profileimage_to_s3():
    bucket = 'profileimgsportsearch'
    aws_access_key_id = 'AKIAWCGFITH6DGFB5MHH'
    aws_secret_access_key = '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'

    if request.method == 'POST':
        try:
            new_img = request.files.get('img')
            user = User.query.filter(User.id == session.get('user')).first()
            print(request.files.get('img'))
            if not new_img:
                return jsonify({'message': 'File not found'})
            filetype = imghdr.what(new_img)

            if filetype not in ('png', 'jpg', 'jpeg'):
                return jsonify({'message': 'This file is not an image'})
            filename = str(uuid4())
            s3 = boto3.resource(
                's3',
                region_name='eu-north-1',
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key=aws_secret_access_key,
            )

            s3.Bucket(bucket).put_object(Key=f'{filename}.{filetype}', Body=new_img, ACL='public-read', )

            user.image_url = f'https://s3.eu-north-1.amazonaws.com/{bucket}/{filename}.{filetype}'
            db.session.commit()

            return jsonify({'code': 200, 'url': f'https://s3.eu-north-1.amazonaws.com/{bucket}/{filename}.{filetype}'})

        except Exception as e:
            print (e)
            return jsonify({'code': 0, 'message': 'false'})

def send_mail(user_id, new_email):
    token = s.dumps({'new_email':new_email,'user_id':user_id}, salt=APP_CONFIG.SECURITY_PASSWORD_SALT)
    msg = Message('Change Email', sender=APP_CONFIG.MAIL_USERNAME, recipients=[new_email])
    link = 'http://localhost:5998/change_email/'+token
    msg.body = 'Your link is {}'.format(link)
    mail.send(msg)


def send_password_mail(user_id, email):
    token = s.dumps({'user_id':user_id,}, salt=APP_CONFIG.SECURITY_PASSWORD_SALT)
    msg = Message('Go here to end password changing', sender=APP_CONFIG.MAIL_USERNAME, recipients=[email])
    link = 'http://localhost:5998/confirm_password_changing/'+token
    msg.body = 'Your link is {}'.format(link)
    mail.send(msg)
