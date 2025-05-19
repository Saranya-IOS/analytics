
from flask import Blueprint, request, jsonify
from app import mongo
from app.utils import create_admin_user, verify_password
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get("email")
    if mongo.db.admin_users.find_one({"admin_user_email": email}):
        return jsonify({"msg": "User already exists"}), 409

    new_user = create_admin_user(
        email=email,
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        password=data.get("password"),
        account_details=data.get("account_details")
    )
    mongo.db.admin_users.insert_one(new_user)
    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = mongo.db.admin_users.find_one({"admin_user_email": email})
    if not user or not verify_password(password, user["password"]):
        return jsonify({"msg": "Invalid email or password"}), 401

    mongo.db.admin_users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )

    access_token = create_access_token(
        identity=user["admin_user_id"], expires_delta=timedelta(hours=1)
    )
    return jsonify({
        "access_token": access_token,
        "admin_user_id": user["admin_user_id"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
    }), 200
