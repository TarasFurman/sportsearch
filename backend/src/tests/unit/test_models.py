from datetime import datetime

from api.models import Feedback, PaymentStatus


def test_new_user(new_user):
    assert new_user.id == 330
    assert new_user.nickname == 'nickname'
    assert new_user.email == 'olegmikadze10@gmail.com'
    assert new_user.phone == "+380990125386"
    assert new_user.password == 'awesomePAssword'
    assert new_user.first_name == 'Oleg'
    assert new_user.last_name == 'Mikadze'
    assert new_user.access_token == '43567ytg56g54f948f85794d'
    assert new_user.auth_type == 'google'


def test_setting_password(new_user):
    """
    GIVEN an existing User
    WHEN the password for the user is set
    THEN check the password is stored correctly and not as plaintext
    """
    new_user.set_password('MyNewPassword')
    assert new_user.set_password != 'awesomePAssword'
    assert new_user.check_password != 'awesomePAssword'


def test_user_id(new_user):
    """
    GIVEN an existing User
    WHEN the ID of the user is defined to a value
    THEN check the user ID returns a string (and not an integer) as needed by Flask-WTF
    """
    new_user.id = 330
    assert not isinstance(new_user.id, str)
    assert isinstance(new_user.id, int)
    assert new_user.id != "330"


def test_newuserinevent(new_userinevent):
    assert new_userinevent.user_event_status_id == 40
    assert new_userinevent.event_id == 1
    assert new_userinevent.user_id == 1


def test_sportType(new_sport_type):
    assert new_sport_type.id == 40
    assert new_sport_type.name == 'football'


def test_eventStatus(new_event_status):
    assert new_event_status.id == 40
    assert new_event_status.name == 'canceled'


def test_feedback_model():
    """Test Feedback database model"""
    feedback = Feedback(
        id=1,
        rating=5,
        text='feedback',
        feedback_time=datetime(2020, 4, 9, 15, 00),
        event_id=1,
        user_from_id=2,
        user_to_id=3,
    )

    assert feedback.id == 1
    assert feedback.rating == 5
    assert feedback.text == 'feedback'
    assert str(feedback.feedback_time) == '2020-04-09 15:00:00'
    assert feedback.event_id == 1
    assert feedback.user_from_id == 2
    assert feedback.user_to_id == 3


def test_payment_status_model():
    """Test PaymentStatus database model"""
    payment_status = PaymentStatus(
        id=1,
        name='payment_status'
    )
    
    assert payment_status.id == 1
    assert payment_status.name == 'payment_status'
