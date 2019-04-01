import os

basedir = os.path.abspath(os.path.dirname('../'))


class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_USERNAME = 'kv047python@gmail.com'
    MAIL_PASSWORD = 'Kv-047.Python'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USE_TLS = False
    SECURITY_PASSWORD_SALT = 'email-confirm'


class ProductionConfig(Config):
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True
    DEVELOPMENT = True


class TestingConfig(Config):
    TESTING = True
