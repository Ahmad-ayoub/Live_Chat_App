import secrets
import os

login_key = secrets.token_hex(32)
user_id_key = secrets.token_urlsafe(16)
group_id_key = secrets.token_urlsafe(16)

os.environ["LOGIN_KEY"] = login_key
os.environ["USER_ID_KEY"] = user_id_key
os.environ["GROUP_ID_KEY"] = group_id_key
