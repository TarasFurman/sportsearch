from flask import Flask
from flask_cors import CORS
import logging
from api.models import db
from api.routes import routes, socketio

from conf import APP_CONFIG


def register_blueprints(app):
    app.register_blueprint(routes)


def init_extensions(app):
    logging.basicConfig(level=logging.DEBUG)
    db.init_app(app)
    CORS(
        app,
        supports_credentials=True,
        resources=r"/*",
    )
    with app.app_context():
        db.create_all()


def flask_app():
    app = Flask(__name__)
    app.config.from_object(APP_CONFIG)
    register_blueprints(app)
    init_extensions(app)
    socketio.init_app(app)
    return app, socketio

