import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from conf import config

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
db = SQLAlchemy(app)


@app.route('/')
def index():
    return "Hello, World!"
