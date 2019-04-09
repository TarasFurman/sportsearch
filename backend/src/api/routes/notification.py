from api.routes import routes
from flask import session, jsonify, request
from ..models import db, UserNotification, Event, NotificationType, User


@routes.route('/notification', methods=['GET','POST'])
def notification():
    if request.method == 'GET':
        user_id = session.get('user')
        user_notification = UserNotification.query.join(Event).join(NotificationType).filter(UserNotification.user_id == user_id).all()

        return jsonify(
            {
                'code': 200,
                'notifications': [
                    {
                        'id': notification.id,
                        'event_name': notification.event.name,
                        'notification_message': notification.notification.message,
                        'seen': notification.seen
                    } for notification in user_notification
                ]
            }
        )


    if request.method == "POST":
        user_id = session.get('user')
        req = request.get_json().get('obj')
        user_notification = UserNotification.query.filter(UserNotification.id == req.get('id')).one()
        user_notification.seen = req.get('seen')
        db.session.commit()
        return jsonify({"code": 200})
        
