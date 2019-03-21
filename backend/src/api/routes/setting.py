from flask import request, session, jsonify
from api.routes import routes
from ..models import db, User


@routes.route('/save_setting', methods=['GET', 'POST'])
def save_setting():
    if request.method == 'POST':
        user_id = session.get('user')
        req = request.get_json().get('setting')
        User.query.filter(User.id == user_id).update(dict(settings=req))
        db.session.commit()
        return jsonify({'code': 200})
