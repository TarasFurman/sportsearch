from api.routes import routes
from flask import session, jsonify
from ..models import UserNotification, Event, NotificationType


@routes.route('/notification', methods=['GET'])
def notification():
    user_id = session.get('user')
    user_notification = UserNotification.query.join(Event).join(NotificationType).filter(UserNotification.user_id == user_id).all()

    return jsonify(
        {
            'code': 200,
            'notifications': [
                {
                    'id': notification.id,
                    'event_name': notification.event.name,
                    'notification_message': notification.notification.message
                }for notification in user_notification
            ]
        }
    )
