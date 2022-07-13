from requests import sessions
from pprint import pprint
from rocketchat_API.rocketchat import RocketChat

with sessions.Session() as session:
    rocket = RocketChat('test_bot', 'Ulyana13Ulyana12', server_url='http://localhost:3000', session=session)
    pprint(rocket.me().json())
    pprint(rocket.channels_list().json())
    pprint(rocket.chat_post_message('good news everyone!', channel='GENERAL').json())
    pprint(rocket.channels_history('GENERAL', count=5).json())