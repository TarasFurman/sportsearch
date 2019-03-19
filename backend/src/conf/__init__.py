import os
from conf.config import DevelopmentConfig, ProductionConfig, TestingConfig

APP_CONFIG = {
    'dev': DevelopmentConfig,
    'prod': ProductionConfig,
    'test': TestingConfig
}.get(os.getenv('APP_ENV', 'dev'))
