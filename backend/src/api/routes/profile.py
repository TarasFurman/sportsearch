from flask import request, session, jsonify
from api.routes import routes

from ..models import db, User, Event, UserInEvent

@routes.route('/profile', methods=['GET','PUT'])
def profile():
    if request.method == 'GET':
        try:
            user = User.query.filter(User.id ==session.get('user')).first()
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
            user = User.query.filter(User.id ==session.get('user')).first()
            new_data = request.get_json().get('obj')
            if new_data.get('email') == user.email:
                user.first_name = new_data.get('first_name')
                user.last_name = new_data.get('last_name')
                user.birth_date = new_data.get('birth_date')
                user.description = new_data.get('description')
                user.phone = new_data.get('phone')
                db.session.commit()
                return jsonify({'code':200, 'message': 'true'})
        except:
            return jsonify({'code': 0, 'message': 'False'})
    else:
        return jsonify({'code': 0, 'message': 'false'})
