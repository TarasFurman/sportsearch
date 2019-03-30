from flask import request, session, jsonify
from api.routes import routes
from ..models import db, User
from .notification_service import send


@routes.route('/save_setting', methods=['GET', 'POST'])
def save_setting():
    if request.method == 'POST':
        user_id = session.get('user')
        req = request.get_json().get('setting')
        User.query.filter(User.id == user_id).update(dict(settings=req))
        db.session.commit()
        send(1, user_id=20)
        return jsonify({'code': 200})
