"""
File for inserting into db fake data.
Available modes:
    - test (all tables are filled);
    - production (statuses tables are filled only).
"""

import sys
import random
from random import randint
from datetime import datetime, timedelta
from faker import Faker
from flask import Flask

from models import (db,
                      SportType,
                      EventStatus,
                      UserEventStatus,
                      UserStatus,
                      PaymentStatus,
                      User,
                      Event,
                      Feedback,
                      Payment,
                      UserInEvent,
                      Message)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://ss_user:5heMcHFf&L9ehUuk@sportsearch_database_1/ss_db'
db.init_app(app)
app.app_context().push()

# some img url for random.choice() data
user_img_urls = ( 'https://pngimage.net/wp-content/uploads/2018/06/logo-user-png-6.png',
                  'https://banner2.kisspng.com/20180716/lra/kisspng-logo-person-user-person-icon-5b4d2bd2236ca6.6010202115317841461451.jpg',
                  'https://pngimage.net/wp-content/uploads/2018/06/user-logo-png-4.png',
                )

# function for inserting data into sport_types table
def sport_type():
    with app.app_context():
        data_in_db = SportType.query.all()

    if not data_in_db:
        sport_types = [
            SportType(name='Football'),
            SportType(name='Volleyball'),
            SportType(name='Chess'),
            SportType(name='Basketball'),
            SportType(name='Ping Pong'),
            SportType(name='Other'),
        ]

        with app.app_context():
            for s_t in sport_types:
                db.session.add(s_t)
            db.session.commit()


# function for inserting data into event_status table
def event_status():
    with app.app_context():
        data_in_db = EventStatus.query.all()

    if not data_in_db:
        event_statuses = [
            EventStatus(name='Planned'),
            EventStatus(name='Finished'),
            EventStatus(name='Canceled'),
            EventStatus(name='In action'),
        ]

        with app.app_context():
            for e_s in event_statuses:
                db.session.add(e_s)
            db.session.commit()


#  function for inserting data into user_event_status table
def user_event_status():
    with app.app_context():
        data_in_db = UserEventStatus.query.all()

    if not data_in_db:
        user_event_statuses = [
            UserEventStatus(name='Waiting for approving'),
            UserEventStatus(name='Approved'),
            UserEventStatus(name='Rejected'),
            UserEventStatus(name='Kicked'),
        ]

        with app.app_context():
            for u_e_s in user_event_statuses:
                db.session.add(u_e_s)
            db.session.commit()


#  function for inserting data into user_status table
def user_status():
    with app.app_context():
        data_in_db = UserStatus.query.all()

    if not data_in_db:
        user_statuses = [
            UserStatus(name='active'),
            UserStatus(name='unactive'),
        ]

        with app.app_context():
            for u_s in user_statuses:
                db.session.add(u_s)
            db.session.commit()


#  function for inserting data into payment_status table
def payment_status():
    with app.app_context():
        data_in_db = PaymentStatus.query.all()

    if not data_in_db:
        payment_statuses = [
            PaymentStatus(name='paid'),
            PaymentStatus(name='canceled'),
            PaymentStatus(name='processing'),
        ]

        with app.app_context():
            for p_s in payment_statuses:
                db.session.add(p_s)
            db.session.commit()


#  function for inserting data into user table
def users(fake):
    user_default_settings = {'email_notification':True,
                             'new_event':True,
                             'new_reviews':True,
                             'conformation_of_app':True,
                             'event_invitation':True,
                             'viber_notification':False,
                             'telegram_notification':False, }

    with app.app_context():
        data_in_db = User.query.all()

    if not data_in_db:
        with app.app_context():
            for i in range(10):
                first_name = fake.first_name()
                last_name = fake.last_name()
                nickname = first_name + last_name
                new_User = User(nickname = nickname,
                                email = fake.email(),
                                phone = fake.phone_number(),
                                password = fake.password(length=10),
                                first_name = first_name,
                                last_name = last_name,
                                birth_date = fake.date_between(start_date="-30y",
                                   end_date="-20y").strftime('%Y-%m-%d'),
                                rating =  round(random.uniform(3, 5),2),
                                image_url = random.choice(user_img_urls),
                                description = fake.text(max_nb_chars=200),
                                viber_account = '1',
                                telegram_account = '1',
                                settings = user_default_settings,
                                status_id = 1)
                db.session.add(new_User)
            db.session.commit()



def datetime_generator():
    time_pattern = ('past','future')
    if random.choice(time_pattern) == 'past':
        start_time = fake.date_time_between(start_date="-30d", end_date="now", tzinfo=None)
        end_time = start_time + timedelta(hours=randint(1,4))
        event_status = 2

    else:
        start_time = fake.date_time_between(start_date="+30d", end_date="+60d", tzinfo=None)
        end_time = start_time + timedelta(hours=randint(1,4))
        event_status = 1
    return (start_time.strftime('%Y-%m-%d %H:%M:%S'),end_time.strftime('%Y-%m-%d %H:%M:%S'),event_status)

#  function for inserting data into event table
def event(fake):
    # Use for some cords in Kyiv. Format for google maps: (y,x) - exemple (50.400393,30.741315)
    some_Kyiv_cords = { 'x_min':30.419814,
                        'x_max':30.646404,
                        'y_min':50.401979,
                        'y_max':50.472314,
                      }

    with app.app_context():
        data_in_db = Event.query.all()

    if not data_in_db:
        with app.app_context():
            for i in range(10):
                event_time = datetime_generator()
                new_event = Event ( name = fake.text(max_nb_chars=50),
                                    image_url = random.choice(user_img_urls),
                                    x_coord = round(random.uniform(some_Kyiv_cords['x_min'],some_Kyiv_cords['x_max']),6),
                                    y_coord = round(random.uniform(some_Kyiv_cords['y_min'],some_Kyiv_cords['y_max']),6),
                                    start_time = event_time[0],
                                    end_time = event_time[1],
                                    #price = None,
                                    #period = None,
                                    age_from = randint(10,14),
                                    age_to = randint(16,70),
                                    members_total = randint(6,10),
                                    members_needed = randint(1,5),
                                    sport_id = randint(1,6),
                                    event_status_id = event_time[2],
                                    owner_id = randint(1,10),)
                db.session.add(new_event)
            db.session.commit()


# function for inserting data into user in event table
def user_in_event():
        with app.app_context():
            data_in_db = UserInEvent.query.all()
            events = Event.query.all()
            #for event in events:
            #    print (event.id, event.name, event.members_needed)

        if not data_in_db:
            with app.app_context():
                for event in events:
                    for i in range(event.members_needed):
                        if i!= event.owner_id:
                            user_id = i+1
                        else:
                            user_id = i+2
                        new_UserInEvent = UserInEvent ( user_event_status_id = randint(1,4),
                                                        event_id = event.id,
                                                        user_id  = user_id, )
                        db.session.add(new_UserInEvent)
                        db.session.commit()

# function for inserting data into message table
def message(fake):
    with app.app_context():
        data_in_db = Message.query.all()
        events = Event.query.all()

    if not data_in_db:
        with app.app_context():
            for event in events:
                users_in_event = UserInEvent.query.filter_by(event_id = event.id)
                for user_in_event in users_in_event:
                    new_Message = Message ( text = fake.text(max_nb_chars=150),
                                            message_time = fake.date_time_between(start_date="-30d", end_date="now", tzinfo=None).strftime('%Y-%m-%d %H:%M:%S'),
                                            sender_id = user_in_event.user_id,
                                            event_id = event.id,)
                    db.session.add(new_Message)
                db.session.commit()

def feedback(fake):
    with app.app_context():
        data_in_db = Feedback.query.all()
        events = Event.query.filter_by(event_status_id = 2)

    if not data_in_db:
        with app.app_context():
            for event in events:
                users_in_event = UserInEvent.query.filter_by(event_id = event.id).all()
                for user_in_event in users_in_event:
                    for i in range(event.members_needed):
                        new_Feedback = Feedback (rating =  round(random.uniform(3, 5),2),
                                             text = fake.text(max_nb_chars=150),
                                             feedback_time = fake.date_time_between(start_date="-30d", end_date="now", tzinfo=None).strftime('%Y-%m-%d %H:%M:%S'),
                                             event_id = event.id,
                                             user_from_id = user_in_event.user_id,
                                             user_to_id = event.owner_id,)
                        db.session.add(new_Feedback)
                        db.session.commit()

def payment(fake):
    pass


if __name__ == '__main__':
    # initialize db.Models
    db.create_all()
    if not('test' in sys.argv
           or 'production' in sys.argv):
        raise IndexError("Undefined mode of filling the database is ambiguous.Choose 'test' or 'production'.")
    if sys.argv[1] == 'test':
        # initialize Faker object to produce fake (test) data
        fake = Faker()
        sport_type()
        event_status()
        user_event_status()
        user_status()
        payment_status()
        users(fake)
        event(fake)
        user_in_event()
        message(fake)
        feedback(fake)
        # add more...
    elif sys.argv[1] == 'production':
        sport_type()
        event_status()
        user_event_status()
        user_status()
        payment_status()
    else:
        raise ValueError("Improperly defined mode of filling the database is not allowed. Choose 'test' or 'production'.")
    print('Data was inserted into a database! Good luck!')
