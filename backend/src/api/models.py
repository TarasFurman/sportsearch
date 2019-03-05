from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

db = SQLAlchemy()


class SportType(db.Model):
    __tablename__ = 'sport_type'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, unique=True)
    # image_url = db.Column(db.Text, nullable=True, unique=True) # to have an image for a sport by default

    events = db.relationship('Event', backref='sport_type', lazy=True)


class EventStatus(db.Model):
    __tablename__ = 'event_status'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, unique=True)

    events = db.relationship('Event', backref='event_status', lazy=True)


class UserEventStatus(db.Model):
    __tablename__ = 'user_event_status'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, unique=True)

    users = db.relationship('UserInEvent', backref='user_event_status', lazy=True)


class UserStatus(db.Model):
    __tablename__ = 'user_status'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, unique=True)

    users = db.relationship('User', backref='user_status', lazy=True)


class PaymentStatus(db.Model):
    __tablename__ = 'payment_status'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, unique=True)

    payments = db.relationship('Payment', backref='payment_status', lazy=True)


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.Text, nullable=False, unique=True)
    email = db.Column(db.Text, nullable=False, unique=True)
    phone = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=True, unique=False)
    first_name = db.Column(db.Text, nullable=False, unique=False)
    last_name = db.Column(db.Text, nullable=False, unique=False)
    birth_date = db.Column(db.DateTime, nullable=False, unique=False)
    rating = db.Column(db.Float, nullable=True, unique=False)
    image_url = db.Column(db.Text, nullable=True, unique=False)
    description = db.Column(db.Text, nullable=True, unique=False)
    viber_account = db.Column(db.Text, nullable=True, unique=False)
    telegram_account = db.Column(db.Text, nullable=True, unique=False)
    settings = db.Column(db.JSON, nullable=False, unique=False)

    status_id = db.Column(db.Integer, db.ForeignKey('user_status.id'), nullable=False, unique=False)

    @staticmethod
    def update_rating(user_id):
        """
        Method that replaces a trigger in database (but not entirely, it'll not be updated ).
        It will count current rating of a user and update it.
        :return:
        """
        user = db.session.query(User).filter(
            User.id == user_id,
        ).first()
        user.rating = db.session.query(func.avg(Feedback.rating).label('avg_rate')).filter(
            Feedback.user_to_id == user_id,
        )

        db.session.commit()


class Event(db.Model):
    __tablename__ = 'event'

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.Text, nullable=False, unique=False)
    description = db.Column(db.Text, nullable=True, unique=False)
    image_url = db.Column(db.Text, nullable=True, unique=False)
    x_coord = db.Column(db.Float, nullable=False, unique=False)
    y_coord = db.Column(db.Float, nullable=False, unique=False)
    start_time = db.Column(db.DateTime, nullable=False, unique=False)
    end_time = db.Column(db.DateTime, nullable=False, unique=False)
    period = db.Column(db.Integer, nullable=True, unique=False)
    price = db.Column(db.Integer, nullable=True, unique=False)
    age_from = db.Column(db.Integer, nullable=False, unique=False)
    age_to = db.Column(db.Integer, nullable=False, unique=False)
    members_total = db.Column(db.Integer, nullable=False, unique=False)
    members_needed = db.Column(db.Integer, nullable=False, unique=False)

    sport_id = db.Column(db.Integer, db.ForeignKey('sport_type.id'), nullable=False, unique=False)
    event_status_id = db.Column(db.Integer, db.ForeignKey('event_status.id'), nullable=False, unique=False)
    owner_id = db.Column(db.Integer,  db.ForeignKey('user.id'), nullable=False, unique=False)

    owner = db.relationship('User', foreign_keys=[owner_id], backref='user_event_owner', lazy=True)

    feedbacks = db.relationship('Feedback', backref='event_feedback', lazy=True)
    payments = db.relationship('Payment', backref='event_payment', lazy=True)
    users = db.relationship('UserInEvent', backref='event_user', lazy=True)
    messages = db.relationship('Message', backref='event_message', lazy=True)


class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False, unique=False)
    text = db.Column(db.Text, nullable=True, unique=False)
    feedback_time = db.Column(db.DateTime, nullable=False, unique=False)

    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False, unique=False)
    user_from_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=False)
    user_to_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=False)

    feedbacks_from = db.relationship('User', foreign_keys=[user_from_id], backref='user_from_feedback', lazy=True)
    feedbacks_to = db.relationship('User', foreign_keys=[user_to_id], backref='user_to_feedback', lazy=True)


class Payment(db.Model):
    __tablename__ = 'payment'

    id = db.Column(db.Integer, primary_key=True)
    bank_response = db.Column(db.Text, nullable=False, unique=False)

    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False, unique=False)
    user_from_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=False)
    payment_status_id = db.Column(db.Integer, db.ForeignKey('payment_status.id'), nullable=False, unique=False)

    payments = db.relationship('User', foreign_keys=[user_from_id], backref='user_from_payment', lazy=True)


# change to Table object instead of Model
class UserInEvent(db.Model):
    __tablename__ = 'user_in_event'

    id = db.Column(db.Integer, primary_key=True)

    user_event_status_id = db.Column(db.Integer, db.ForeignKey('user_event_status.id'), nullable=False, unique=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False, unique=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=False)

    users_in_events = db.relationship('User', foreign_keys=[user_id], backref='user_in_event', lazy=True)


class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False, unique=False)
    message_time = db.Column(db.DateTime, nullable=False, unique=False)

    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False, unique=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=False)

    sender = db.relationship('User', foreign_keys=[sender_id], backref='user_message', lazy='subquery')
