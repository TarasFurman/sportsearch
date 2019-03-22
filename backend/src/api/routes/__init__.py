from flask import Blueprint
from flask_socketio import SocketIO

routes = Blueprint('routes', __name__)

# Initialize sockets here to have an access to them
# from an endpoints (configured with app in app.py)
socketio = SocketIO()

# add a file you want to write code in, for instance zaebis.py
# ADD IT HERE
# then add here:
# from .zaebis import zaebis1, zaebis2 ...

from .signup import signup
from .signin import signin
from .facebook import signin_fb
from .google import signin_google
from .main_page import get_events, get_filters
from .create_event import get_sports, create_event
from .events import events
from .setting import save_setting
from .notification import notification
from .another_users_profile import another_users_profile

from .event_page import (get_event_room,
                         leave_event,
                         cancel_event,
                         search_members,
                         invite_member, )

from .feedbacks_page import (get_feedbacks_info,
                             get_feedbacks_data, )

from .event_chat import (join,
                         leave,
                         send_message,
                         get_event_messages, )

from .event_members import (join,
                            leave,
                            get_event_members,
                            kick_user,
                            rate_user,
                            grant_request_member,
                            get_request_members, )
