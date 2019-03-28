from app import flask_app
import pytest
from flask import url_for


@pytest.fixture
def app():
    app = flask_app()
    return app


def f():
    print(1/0)

def test_exception():
    with pytest.raises(ZeroDivisionError):
        f()

def test_one():
    print ("test_one")