from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from api.models import db
from api.routes import *

from conf import config

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
# db = SQLAlchemy(app)

app.register_blueprint(routes)
db.init_app(app)


@app.route('/')
def index():
    return "Hello, World!"
