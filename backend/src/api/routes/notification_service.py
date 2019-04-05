from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
import requests
from ..models import db, User, UserNotification, NotificationType, UserInEvent

from conf import APP_CONFIG


s = URLSafeTimedSerializer(APP_CONFIG.SECRET_KEY)

mail = Mail()

URL = 'https://api.telegram.org/bot628686042:AAE7G9c_5cv082F8fEZN-97U2GFDXb6rSYM/'
# chat_id = 228568230


class NotificationService:
    def __init__(self, notification_type, event_id=None):
        self.users = []
        self.event_id = event_id
        self.notification_type = notification_type

    def create_message(self):
        try:
            message_body = NotificationType.query.filter(NotificationType.id == self.notification_type).first().message

            return message_body
        except:
            return False

    def check_notification_type(self, user_id):
        try:
            notification_type = NotificationType.query.filter(NotificationType.id == self.notification_type).first().name
            result = User.query.filter(User.id == user_id).first().settings
            if result[notification_type]:
                return True
            else:
                return False
        except:
            return False

    def add_notification(self, user_id=None):
        notification = UserNotification(seen=False,
                                        event_id=self.event_id,
                                        user_id=user_id,
                                        notification_id=self.notification_type)
        db.session.add(notification)
        db.session.commit()


class UserEventNotificationService(NotificationService):
    def __init__(self, notification_type, user_id, event_id):
        NotificationService.__init__(self, notification_type, event_id)
        self.users.append(user_id)


class UserNotificationService(NotificationService):
    def __init__(self, notification_type, user_id):
        NotificationService.__init__(self, notification_type)
        self.users.append(user_id)


class EventNotificationService(NotificationService):
    def __init__(self, notification_type, event_id):
        NotificationService.__init__(self, notification_type, event_id)
        self.add_users()

    def add_users(self):
        users = UserInEvent.query.filter(UserInEvent.event_id == self.event_id,
                                         UserInEvent.user_event_status_id == 2).all()
        for user in users:
            self.users.append(user.user_id)


class SendMethods:
    @staticmethod
    def check_methods(user_id):
        result = User.query.filter(User.id == user_id).first().settings
        email_notification = result['email_notification']
        telegram_notification = result['telegram_notification']
        viber_notification = result['viber_notification']

        return email_notification, telegram_notification, viber_notification

    @staticmethod
    def send_email_notification(message_body, email):
        msg = Message('Email Notification', sender=APP_CONFIG.MAIL_USERNAME, recipients=[email])
        msg.body = '{}'.format(message_body)
        mail.send(msg)

    @staticmethod
    def send_telegram_notification(message_body, chat_id):
        url = URL + 'sendMessage?chat_id={}&text={}'.format(chat_id, message_body)
        requests.get(url)

    @staticmethod
    def send_viber_notification(self):
        pass

    def send_notification(self, user_id, message_body):
        email_notification, telegram_notification, viber_notification = self.check_methods(user_id)

        user = User.query.filter(User.id == user_id).first()

        if email_notification:
            email = user.email
            self.send_email_notification(message_body, email)
        if telegram_notification:
            chat_id = user.telegram_account
            self.send_telegram_notification(message_body, chat_id)
        # if viber_notification:
        #    send_viber_notification()


def send(notification_type, user_id=None, event_id=None):

    if notification_type in (1, 2, 3, 8, 9):
        notification = UserEventNotificationService(notification_type=notification_type,
                                                    user_id=user_id,
                                                    event_id=event_id)
    elif notification_type in (4, 5, 7):
        notification = EventNotificationService(notification_type=notification_type,
                                                event_id=event_id)
    elif notification_type in (6, ):
        notification = UserNotificationService(notification_type=notification_type,
                                               user_id=user_id)
    else:
        notification = NotificationService(notification_type)

    message_body = notification.create_message()

    send_methods = SendMethods()

    for user in notification.users:
        if notification.check_notification_type(user):
            notification.add_notification(user_id)
            send_methods.send_notification(user, message_body)
