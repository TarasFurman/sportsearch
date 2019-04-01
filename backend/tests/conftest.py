import pytest

# from ..src.wsgi import flask_app

# @pytest.fixture
# def app():
#     app = flask_app()
#     app.debug = True
#     return app


from ..api.models import User

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



# class DB(object):
#     pass


# @pytest.fixture(scope="session")
# def db():
#     return DB()



