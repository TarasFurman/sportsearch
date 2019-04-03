import pytest
from api.models import User, UserInEvent, SportType, EventStatus


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
