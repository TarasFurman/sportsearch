import requests
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.ext.hybrid import hybrid_property
from flask import jsonify
from sqlalchemy import func, or_
from datetime import datetime


db = SQLAlchemy()


class SportType(db.Model):
    __tablename__ = 'sport_type'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, unique=True)
    # image_url = db.Column(db.Text, nullable=True, unique=True) # to have an image for a sport by default

    events = db.relationship('Event', backref='sport_type', lazy=True)

    @staticmethod
    def get_sports():
        data = SportType.query.all()
        return data


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
    phone = db.Column(db.Text, nullable=True, unique=False)
    password = db.Column(db.Text, nullable=True, unique=False)
    first_name = db.Column(db.Text, nullable=False, unique=False)
    last_name = db.Column(db.Text, nullable=False, unique=False)
    birth_date = db.Column(db.DateTime, nullable=True, unique=False)
    rating = db.Column(db.Float, nullable=True, unique=False)
    image_url = db.Column(db.Text, nullable=True, unique=False)
    description = db.Column(db.Text, nullable=True, unique=False)
    viber_account = db.Column(db.Text, nullable=True, unique=False)
    telegram_account = db.Column(db.Text, nullable=True, unique=False)
    settings = db.Column(db.JSON, nullable=True, unique=False)
    access_token = db.Column(db.Text, nullable=True, unique=False)
    auth_type = db.Column(db.Text, nullable=True, unique=False)

    status_id = db.Column(db.Integer, db.ForeignKey('user_status.id'), nullable=False, unique=False)

    @staticmethod
    def set_password(password):
        return generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

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
    _start_time = db.Column(db.DateTime, nullable=False, unique=False)
    _end_time = db.Column(db.DateTime, nullable=False, unique=False)
    period = db.Column(db.Integer, nullable=True, unique=False)
    price = db.Column(db.Integer, nullable=True, unique=False)
    card_number = db.Column(db.Integer, nullable=True, unique=False)
    card_holder = db.Column(db.Integer, nullable=True, unique=False)
    age_from = db.Column(db.Integer, nullable=False, unique=False)
    age_to = db.Column(db.Integer, nullable=False, unique=False)
    members_total = db.Column(db.Integer, nullable=False, unique=False)
    members_needed = db.Column(db.Integer, nullable=False, unique=False)
    address = db.Column(db.Text, nullable=True, unique=False)

    sport_id = db.Column(db.Integer, db.ForeignKey('sport_type.id'), nullable=False, unique=False)
    _event_status_id = db.Column(db.Integer, db.ForeignKey('event_status.id'), nullable=False, unique=False)
    owner_id = db.Column(db.Integer,  db.ForeignKey('user.id'), nullable=False, unique=False)

    owner = db.relationship('User', foreign_keys=[owner_id], backref='user_event_owner', lazy=True)
    owner_joined = db.relationship('User', foreign_keys=[owner_id], backref='user_joined_event_owner', lazy='joined')

    feedbacks = db.relationship('Feedback', backref='event_feedback', lazy=True)
    payments = db.relationship('Payment', backref='event_payment', lazy=True)
    users = db.relationship('UserInEvent', backref='event_user', lazy=True)
    messages = db.relationship('Message', backref='event_message', lazy=True)

    @hybrid_property
    def start_time(self):
        """
        Return event start time and updates it according to a period,
        :return:
        """
        # We need to check if event is periodic and update its start time
        # and end_time to keep it fresh for every period (not finished)
        # The only way to finish a such event is to cancel it
        now = datetime.utcnow()
        if self.period and self._end_time < now:
            self._start_time += timedelta(days=self.period)
            self._end_time += timedelta(days=self.period)
            db.session.commit()
        return self._start_time

    @hybrid_property
    def end_time(self):
        """
        Return event end time and updates it according to a period,
        :return:
        """
        # We need to check if event is periodic and update its start time
        # and end_time to keep it fresh for every period (not finished)
        # The only way to finish a such event is to cancel it
        now = datetime.utcnow()
        if self.period and self._end_time < now:
            self._start_time += timedelta(days=self.period)
            self._end_time += timedelta(days=self.period)
            db.session.commit()
        return self._end_time

    @hybrid_property
    def event_status_id(self):
        """
        Return event status according to the time relatively to event.
        :return:
        """
        if self._event_status_id == 3:
            return 3
        now = datetime.utcnow()
        if now < self.start_time:
            return 1
        if self.start_time <= now < self.end_time:
            return 4
        if self.end_time <= now:
            return 2
        return 0

    @event_status_id.setter
    def event_status_id(self, value):
        """
        Update event status of an event (using only for).
        :return:
        """
        self._event_status_id = value

    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        self.init_address()


    def init_address(self):
        base = "https://maps.googleapis.com/maps/api/geocode/json?"
        params = "latlng={lat},{lon}&key={api_key}".format(
            lat=self.x_coord,
            lon=self.y_coord,
            api_key='AIzaSyDqP6ssmZfq_A7htoIJ8gsWuJDN6OwaZLE'
        )
        url = "{base}{params}".format(base=base, params=params)
        try:
            response = requests.get(url).json()['results'][0]['formatted_address'].split(' ')
            if int(response[-1]):
                response = ' '.join(response[:-1]).strip(',')
        except ValueError:
            response = requests.get(url).json()['results'][0]['formatted_address']

        self.address = response


    @staticmethod
    def create_event(new_instance):
        db.session.add(new_instance)
        db.session.flush()
        db.session.commit()
        return new_instance.id

    @staticmethod
    def get_events(data):
        """
            Method returns list of events filtered using
            parameters from the main page filter and map.
            You can use any combination of parameters you wish except required ones.

            Acceptable parameters:
            - x1_coord, y1_coord, x2_coord, y2_coord :
                (float) {required} : latitude and longitude accordingly
            - start_time, end_time : (int) [seconds] : minimal start time for beginning event and
                maximal time for finishing it
            - price_from, price_to : (int) : maximal and minimal price for an event
            - age_from, age_to : (int) : minimal and maximal allowed age for participants
            - members_from, members_to: (int) : minimal and maximal number of participants
            :return:
            """

        try:
            # NOTE :: average time for dict.get() is O(1), so we will use it
            # instead of assigning value to a variable

            # 1. let's create filters first

            # firstly, filter objects by their type
            filters = [or_(
                Event.sport_id == name for name in data.getlist('sport_ids'))
            ] if data.getlist('sport_ids') else []


            """
                        ---------------------------------
                        |                      <-(x1,y1)|
                        |                             | |
                        |                             v |
                        |                               |
                        |             (x,y)             |
                        |                               |
                        | ^                             |
                        | |                             |
                        |(x2,y2)->                      |
                        ---------------------------------
            """

            # then, check for coordinates; they are necessary!
            if data.get('x1_coord') and data.get('y1_coord') \
                    and data.get('x2_coord') and data.get('y2_coord'):

                filters.extend(
                    (
                        Event.x_coord <= float(data.get('x1_coord')),
                        Event.y_coord <= float(data.get('y1_coord')),
                        Event.x_coord >= float(data.get('x2_coord')),
                        Event.y_coord >= float(data.get('y2_coord')),
                    )
                )
            else:
                raise KeyError

            # then check other possible constraints

            if data.get('start_time'):
                filters.append(
                    Event.start_time >= datetime.fromtimestamp(int(data.get('start_time'))),
                )
            if data.get('end_time'):
                filters.append(
                        Event.end_time <= datetime.fromtimestamp(int(data.get('end_time'))),
                )

            if data.get('price_from'):
                filters.append(
                        Event.price >= int(data.get('price_from')),
                )
            if data.get('price_to'):
                filters.append(
                    Event.price <= int(data.get('price_to')),
                )

            if data.get('price_free'):
                filters.append(
                    (Event.price == 0) | (Event.price == None),
                )
            if data.get('price_paid'):
                filters.append(
                    (Event.price != 0) & (Event.price != None),
                )

            if data.get('age_from'):
                filters.append(
                        Event.age_from >= int(data.get('age_from')),
                )
            if data.get('age_to'):
                filters.append(
                    Event.age_to <= int(data.get('age_to')),
                )

            if data.get('members_from'):
                filters.append(
                        Event.members_total >= int(data.get('members_from')),
                )
            if data.get('members_to'):
                filters.append(
                    Event.members_total <= int(data.get('members_to')),
                )

            # filter events by status
            if data.get('event_status'):
                filters.append(
                    Event.event_status_id == int(data.get('event_status')),
                )

            # 2. execute query
            query = db.session.query(Event).filter(*filters).all()

        except KeyError:
            return jsonify(
                {
                    'error': {
                        'status': 422,
                        'description': 'Coordinates are not provided properly.',
                    }
                }
            )
        except (TypeError, ValueError):
            return jsonify(
                {
                    'error': {
                        'status': 422,
                        'description': 'Provided data is not valid. Check you input.',
                    }
                }
            )
        except Exception:
            return jsonify(
                {
                    'error': {
                        'status': 400,
                        'description': 'Unknown error was occured. Check your data and try to'
                                       'send your request later.',
                    }
                }
            )

        return query

    @staticmethod
    def get_filters():
        """
            Method that returns current filters than can be adjusted by user
            This fields will be used to search events
            :return:
            """

        # query to get all data (using subqueries)
        limits = db.session.query(
            func.min(Event.start_time).label('start_time'),
            func.max(Event.end_time).label('end_time'),
            func.min(Event.price).label('price_min'),
            func.max(Event.price).label('price_max'),
            func.min(Event.age_from).label('age_min'),
            func.max(Event.age_to).label('age_max'),
            func.min(Event.members_total).label('members_min'),
            func.max(Event.members_total).label('members_max'),
        ).first()

        return jsonify(
            {
                'sport_types': [
                    {
                        sport_type[0]: sport_type[1]
                    } for sport_type in SportType.query.with_entities(SportType.name, SportType.id).all()
                ],
                'start_time_min':
                    limits[0],
                'end_time_max':
                    limits[1],
                'price_min':
                    limits[2],
                'price_max':
                    limits[3],
                'age_min':
                    limits[4],
                'age_max':
                    limits[5],
                'members_min':
                    limits[6],
                'members_max':
                    limits[7],
            }
        )


class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False, unique=False)
    text = db.Column(db.Text, nullable=True, unique=False)
    feedback_time = db.Column(db.DateTime, nullable=False, unique=False)

    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False, unique=False)
    user_from_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=False)
    user_to_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=False)

    sender = db.relationship('User', foreign_keys=[user_from_id], backref='user_from_feedback', lazy='joined')
    receiver = db.relationship('User', foreign_keys=[user_to_id], backref='user_to_feedback', lazy=True)
    event = db.relationship('Event', foreign_keys=[event_id], backref='event-feedback', lazy='joined')


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


class UserNotification(db.Model):
    __tablename__ = 'user_notification'

    id = db.Column(db.Integer, primary_key=True)
    seen = db.Column(db.Boolean)

    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=True, unique=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=False)
    notification_id = db.Column(db.Integer, db.ForeignKey('notification_type.id'), nullable=False, unique=False)

    user = db.relationship('User', foreign_keys=[user_id], backref='user_notification', lazy=True)
    event = db.relationship('Event', foreign_keys=[event_id], backref='event_notification', lazy=True)
    notification = db.relationship('NotificationType', foreign_keys=[notification_id], backref='notification', lazy=True)


class NotificationType(db.Model):
    __tablename__ = 'notification_type'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, unique=False)
    message = db.Column(db.Text, nullable=False, unique=False)
