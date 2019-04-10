from api.routes import routes
from flask import session, jsonify, request
from ..models import db, UserNotification, Event, NotificationType, User
from sqlalchemy import func


@routes.route('/notification', methods=['GET','POST'])
def notification():
    if request.method == 'GET':
        user_id = session.get('user')
        user_notification = UserNotification.query.join(Event).join(NotificationType).filter(UserNotification.user_id == user_id).all()
        rows = UserNotification.query.filter(UserNotification.seen==False).count()

        user = User.query.filter(User.id == user_id).first()
        print(user.nickname)
        owners = db.session.query(User.nickname).join(Event, UserNotification).filter(UserNotification.event_id==Event.id, Event.owner_id==User.id).all() 
        print(owners)
        # u_n = UserNotification.query(UserNotification.id, Event.name, NotificationType.message, UserNotification.seen, User.nickname,).join(Event).join(NotificationType).join(User).filter(UserNotification.user_id == user_id).all()
        
        return jsonify(
            {
                'code': 200,
                'count': rows,
                'notifications': [
                    {
                        'id': notification.id,
                        'event_name': notification.event.name,
                        'notification_message': notification.notification.message,
                        'seen': notification.seen,
                        'user': user.nickname,

                    } for notification in user_notification
                ],
                'owners': [
                    {
                        'name': owners
                    } for owner in owners
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
        
