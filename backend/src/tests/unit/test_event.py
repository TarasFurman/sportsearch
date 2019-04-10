import pytest
from datetime import datetime

from api.routes.create_event import normalize, validate
from api.models import Event


class TestCreateEvent(object):

    data = {
        'name': 'event',
        'description': 'description',
        'image_url': 'https://www.google.com',
        'lng': 30.423,
        'lat': 50.441,
        'start_time': '2020-04-09T11:11:00',
        'end_time': '2020-04-09T13:11:00',
        'period': 5,
        'price': 999,
        'card_number': '1234567890123456',
        'card_holder': 'holder',
        'age_from': 20,
        'age_to': 50,
        'members_total': 11,
        'members_needed': 10,
        'sport_id': 20,
        'event_status_id': 1,
        'owner_id': 9,
    }

    def test_new_event(self):
        """Test new event instance"""
        data = dict(**TestCreateEvent.data)
        normalized_data = normalize(data)
        event = Event(**normalized_data)

        assert event.name == 'event'
        assert event.description =='description'
        assert event.image_url == 'https://www.google.com'
        assert event.lng == 30.423
        assert event.lat == 50.441
        assert event._start_time == datetime(2020, 4, 9, 11, 11)
        assert event._end_time == datetime(2020, 4, 9, 13, 11)
        assert event.period == 5
        assert event.price == 999
        assert event.card_number == '1234567890123456'
        assert event.card_holder == 'holder'
        assert event.age_from == 20
        assert event.age_to == 50
        assert event.members_total == 11
        assert event.members_needed == 10
        assert event.sport_id == 20
        assert event._event_status_id == 1
        assert event.owner_id == 9

    def test_new_event_normalization(self):
        """Test new event normalization"""
        data = dict(**TestCreateEvent.data)
        normalized_data = normalize(data)

        assert normalized_data['_start_time'] == datetime(2020, 4, 9, 11, 11)
        assert normalized_data['_end_time'] == datetime(2020, 4, 9, 13, 11)
        assert 'start_time' not in normalized_data
        assert 'end_time' not in normalized_data
        
    def test_new_event_validation(self):
        """Test new event validation"""
        data = dict(**TestCreateEvent.data)
        normalized_data = normalize(data)
        
        assert validate(normalized_data) == True
