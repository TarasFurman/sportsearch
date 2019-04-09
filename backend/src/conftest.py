import pytest
from api.models import User, UserInEvent, SportType, EventStatus, UserStatus, UserEventStatus, \
                        Payment, Message, UserNotification, NotificationType


@pytest.fixture(scope='module')
def new_user():
    new_user = User(
        id = 330,
        nickname = 'nickname',
        email = 'olegmikadze10@gmail.com',
        phone = "+380990125386",
        password = 'awesomePAssword',
        first_name = 'Oleg',
        last_name = 'Mikadze',
        access_token = '43567ytg56g54f948f85794d',
        auth_type = 'google'
    )
    return new_user


@pytest.fixture(scope='module')
def new_userinevent():
    new_userinevent = UserInEvent(
        user_event_status_id = 40,
        event_id = 1,
        user_id = 1
    )
    return new_userinevent


@pytest.fixture(scope='module')
def new_sport_type():
    new_sport_type = SportType(
        id = 40,
        name = 'football',
    )
    return new_sport_type


@pytest.fixture(scope='module')
def new_event_status():
    new_event_status = EventStatus(
        id = 40,
        name = 'canceled',
    )
    return new_event_status

@pytest.fixture(scope='module')
def new_user_event_status():
    new_user_event_status = UserEventStatus(
        name= 'test'
    )
    return new_user_event_status

@pytest.fixture(scope='module')
def new_user_status():
    new_user_status = UserStatus(
        name= 'abc'
    )
    return new_user_status

@pytest.fixture(scope='module')
def new_payment():
    new_payment = Payment(
        bank_response='Bank response',
        event_id=2,
        user_from_id=3,
        payment_status_id=1
    )
    return new_payment

@pytest.fixture(scope='module')
def new_user_in_event():
    new_user_in_event = UserInEvent(
        user_event_status_id=1,
        event_id=3,
        user_id=9
    )
    return new_user_in_event

@pytest.fixture(scope='module')
def new_message():
    new_message = Message(
        text='New message test',
        message_time='2019-03-18 10:13:27.0',
        event_id=3,
        sender_id=2
    )
    return new_message

@pytest.fixture(scope='module')
def new_user_notification():
    new_user_notification = UserNotification(
        event_id=2,
        user_id=3,
        notification_id=2
    )
    return new_user_notification

@pytest.fixture(scope='module')
def new_notification_type():
    new_notification_type = NotificationType(
        name='request_approved',
        message='Your request has been approved'
    )
    return new_notification_type