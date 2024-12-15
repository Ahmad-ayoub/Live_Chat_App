from flask import Flask, request, Blueprint, jsonify, render_template, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from models import User
from server.routes.main import app, db


app = Flask(
    __name__, static_folder="../../client-vite/dist/assets", static_url_path="/assets"
)
print("app", app)

register_bp = Blueprint("register", __name__)


@register_bp.route("/api/register", methods=["POST"])
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


__all__ = ["register_bp"]
