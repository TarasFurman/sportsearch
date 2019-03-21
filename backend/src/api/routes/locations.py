from flask import request, jsonify, Response

from . import routes
from ..models import Event


@routes.route('/locations', method=['GET'])
def get_locations():
    """
    useless method
    """
    return jsonify({'message': 'Hello, it is locations!'})
