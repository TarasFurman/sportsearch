from datetime import datetime
from flask import request
from flask_socketio import join_room, leave_room

from . import socketio
from .useful_decorators import error_func, visitor_allowed_socket
from ..models import (db,
                      Message)

NAMESPACE = '/chat'


@socketio.on('join', namespace=NAMESPACE)
@visitor_allowed_socket
def join(*args, **kwargs):
    event = args[0]
    event = args[0]
    join_room(event.id)


@socketio.on('leave', namespace=NAMESPACE)
@visitor_allowed_socket
def leave(*args, **kwargs):
    event = args[0]
    leave_room(event.id)


@socketio.on('send_message', namespace=NAMESPACE)
@visitor_allowed_socket
def send_message(*args, **kwargs):
    """
    This function send a message from a particular user in particular event chat.
    Required body:
        {
            "text": <your text here>,
        }
    :return:
    """

    event = args[0]
    user = args[1]
    data = args[2]

    try:
        message_text = data.get('text')

        if not message_text:
            return error_func(error_status=400,
                              error_description='Message text is empty or missed.',
                              error_message='MESSAGE_TEXT_EMPTY', )

        if event.event_status_id not in (1, 4):
            return error_func(error_status=403,
                              error_description='Event was finished or cancelled.',
                              error_message='EVENT_FINISHED_OR_CANCELLED', )

        message = Message(
            text=message_text,
            message_time=datetime.utcnow(),
            event_id=event.id,
            sender_id=user.id,
        )
        db.session.add(message)
        db.session.commit()

        # send message to all chat members
        socketio.emit(
            'receive_message',
            {
                'message': {
                    'id': message.id,
                    'text': message.text,
                    'message_time': message.message_time.isoformat(),
                    'sender_id': message.sender_id,
                    'sender_nickname': message.sender.nickname,
                    'sender_image_url': message.sender.image_url,
                }
            },
            room=event.id,
            namespace=NAMESPACE,
        )

    except Exception:
        return error_func()


@socketio.on('request_messages', namespace=NAMESPACE)
@visitor_allowed_socket
def get_event_messages(*args, **kwargs):
    """
    Function that returns list of messages for particular event using
    data from previous messages and offset (number of messages we want to return).
    You can pass here next parameters:
        - limit : (int) : number of rows that will be normally returned from the whole query
        - offset : (int) : number of rows you want to be skipped (from the beginning)
    :return:
    """

    event = args[0]
    data = args[2]

    # filters for the query that will get messages

    try:
        messages = db.session.query(Message).filter(
            Message.event_id == event.id,
        ).order_by(
            Message.message_time.desc()
        ).offset(
            data.get('offset') or None
        ).limit(
            data.get('limit') or None
        ).all()

        socketio.emit(
            'receive_messages',
            {
                'messages': [
                    {
                        'id': message.id,
                        'text': message.text,
                        'message_time': message.message_time.isoformat(),
                        'sender_id': message.sender_id,
                        'sender_nickname': message.sender.nickname,
                        'sender_image_url': message.sender.image_url,
                    } for message in messages
                ]
            },
            room=request.sid,
            namespace="/chat",
        )

    except Exception:
        return error_func(error_status=400,
                          error_description='You provided incorrect data.',
                          error_message='INCORRECT_DATA_PROVIDED')
