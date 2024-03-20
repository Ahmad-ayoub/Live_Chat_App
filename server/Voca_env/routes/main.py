import os
import secrets
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
from dotenv import load_dotenv
import jwt
import logging
from datetime import datetime
from flask_socketio import SocketIO, emit
from flask_cors import CORS


load_dotenv()

app = Flask(__name__, static_folder="../../../build", static_url_path="")
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000"])
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add(
        "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"
    )
    return response


@socketio.on_error()
def handle_socket_error(e):
    print(f"Socket error: {str(e)}")


@socketio.on_error_default
def default_error_handler(e):
    print(f"Socket error: {str(e)}")


@socketio.on("frontend_to_backend")
def handle_frontend_message(message):
    print("Received message from frontend:", message)


@socketio.on("connect")
def handle_connect():
    emit("backend_to_frontend", "Hello from the backend")


logging.basicConfig(
    level=logging.DEBUG,
    filename="app.log",
    format="%(asctime)s %(levelname)s:%(message)s",
)

SECRET_KEY = secrets.token_hex(16)
print("SECRET_KEY", SECRET_KEY)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    os.environ.get("DATABASE_URL")
    or "postgresql://postgres:Talintiar123@localhost:5432/userdata"
)

print("SQLALCHEMY_DATABASE_URI", app.config["SQLALCHEMY_DATABASE_URI"])

print("DATABASE_URL", os.environ.get("DATABASE_URL"))

app.config["SECRET_KEY"] = SECRET_KEY

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model):
    __tablename__ = "userdata"  # this specifies the name of the table in the database

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    birthdate = db.Column(db.Date)


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("userdata.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("messages", lazy=True))


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha1")

    new_user = User(
        name=data["name"],
        email=data["email"],
        username=data["username"],
        password=hashed_password,
        birthdate=data["birthdate"],
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        if "unique" in str(e).lower():
            return jsonify({"message": "Username or email already exists!"}), 400
        print(e)
        return jsonify({"message": "Internal server error!"}), 500
    finally:
        db.session.close()


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user_name_or_email = data.get("username") or data.get("email")
    password = data.get("password")
    name = data.get("name")

    user = User.query.filter(
        (User.username == user_name_or_email) | (User.email == user_name_or_email)
    ).first()

    if not user:
        return jsonify({"error": "User not found!"}), 404
    token = jwt.encode({"user_id": user.id}, "your_secret_key", algorithm="HS256")
    print("token", token)
    if check_password_hash(user.password, password):
        return (
            jsonify(
                {
                    "token": token,
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "name": user.name,
                }
            ),
            200,
        )
    else:
        return jsonify({"error": "Incorrect password!"}), 401


def validate_name(name):
    if len(name) < 3:
        return "Name must be at least 3 characters long."
    return ""


import re


def validate_username(username):
    if len(username) < 3:
        return "Username must be at least 3 characters long."

    letter_count = len(re.findall(r"[a-zA-Z]", username))
    if letter_count < 3:
        return "Username must contain at least 3 letters."

    return ""


def validate_email(email):
    valid_domains = ["gmail.com", "yahoo.com", "outlook.com"]  # Add more as needed
    if "@" not in email or "." not in email:
        return "Email must contain '@' and a dot."

    domain = email.split("@")[1]
    if domain not in valid_domains:
        return "Email domain is not valid."

    return ""


def validate_password(password):
    if len(password) < 10:
        return "Password must be at least 10 characters long."

    if not re.search(r"\d", password):
        return "Password must include at least one number."

    if not re.search(r"[A-Z]", password):
        return "Password must include at least one uppercase letter."

    if not re.search(r"[!?]", password):
        return "Password must include either '!' or '?'."

    return ""


def get_current_user_id():
    token = request.headers.get("Authorization")
    if len(token) > 0:
        prefix = "Bearer"
        if token.startswith(prefix):
            token = token[len(prefix) :]
            token = token.strip()
        try:

            data = jwt.decode(token, "your_secret_key", algorithms=["HS256"])
            return data.get("user_id")
        except jwt.ExpiredSignatureError:

            return None
        except jwt.InvalidTokenError:

            return None
    else:
        return None


@app.route("/edit", methods=["POST"])
def edit_profile():
    data = request.json
    print("Received data:", data)

    errors = {
        "name": validate_name(data.get("name")),
        "username": validate_username(data.get("username")),
        "email": validate_email(data.get("email")),
        "password": validate_password(data.get("password")),
    }

    if any(errors.values()):
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        user_id = get_current_user_id()
        print("user_id", user_id)

        if not user_id:
            return jsonify({"error": "User ID is missing"}), 400

        user = db.session.get(User, user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        user.name = data.get("name")
        user.username = data.get("username")
        user.email = data.get("email")
        if data.get("password"):
            user.password = generate_password_hash(
                data["password"], method="pbkdf2:sha256"
            )

        db.session.commit()

        return (
            jsonify(
                {
                    "name": user.name,
                    "username": user.username,
                    "email": user.email,
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error occurred in /edit route: {e}", exc_info=True)
        return jsonify({"error": "An error occurred"}), 500


@app.route("/messages/send", methods=["POST"])
def send_message():
    data = request.json
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    message = Message(user_id=user_id, text=data.get("text"))

    try:
        db.session.add(message)
        db.session.commit()
        return jsonify({"message": "Message sent successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to send message"}), 500


@app.route("/messages", methods=["GET"])
def get_messages():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    messages = (
        Message.query.filter_by(user_id=user_id)
        .order_by(Message.timestamp.desc())
        .all()
    )
    return (
        jsonify(
            [
                {"id": msg.id, "text": msg.text, "timestamp": msg.timestamp}
                for msg in messages
            ]
        ),
        200,
    )


if __name__ == "__main__":
    app.run(debug=True)
