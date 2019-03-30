import pytest

def test_new_user(new_user):
 assert new_user.id == 330
 assert new_user.nickname == 'nickname'
 assert new_user.email == 'olegmikadze10@gmail.com'
 assert new_user.phone == "+380990125386"
 assert new_user.password == 'awesomePAssword'
 assert new_user.first_name == 'Oleg'
 assert new_user.last_name == 'Mikadze'
 assert new_user.access_token == '43567ytg56g54f948f85794d'
 assert new_user.auth_type == 'google'

