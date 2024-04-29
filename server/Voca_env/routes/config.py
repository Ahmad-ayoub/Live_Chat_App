import secrets
import os

login_key = secrets.token_hex(32)
user_id_key = secrets.token_urlsafe(16)
group_id_key = secrets.token_urlsafe(16)
app_config_key = secrets.token_hex(32)
flask_app_key = secrets.token_hex(32)

os.environ["LOGIN_KEY"] = login_key
os.environ["USER_ID_KEY"] = user_id_key
os.environ["GROUP_ID_KEY"] = group_id_key
os.environ["APP_CONFIG_KEY"] = app_config_key
os.environ["FLASK_APP_KEY"] = flask_app_key
