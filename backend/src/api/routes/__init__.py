from flask import Blueprint

routes = Blueprint('routes', __name__)

# add a file you want to write code in, for instance zaebis.py
# ADD IT HERE
# then add here:
# from .zaebis import zaebis1, zaebis2 ...

from .event_page import (get_event_room,
                         get_event_members,
                         get_event_messages,
                         get_new_event_messages,
                         send_event_message,
                         leave_event,
                         cancel_event,
                         kick_user,
                         rate_user,
                         get_request_members,
                         grant_request_member,
                         search_members,
                         invite_member,)

from .feedbacks_page import (get_feedbacks_info,
                             get_feedbacks_data)
