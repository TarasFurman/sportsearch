from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from api.models import db
from api.routes import *

from conf import config

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
CORS(app)
# db = SQLAlchemy(app)

app.register_blueprint(routes)
db.init_app(app)
with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return "Hello, World!"
