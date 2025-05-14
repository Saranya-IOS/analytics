from flask import Blueprint, request, jsonify
from app import mongo
from app.utils import now_utc   
from bson import ObjectId

user_bp = Blueprint('user', __name__)

@user_bp.route('/register_user', methods=['POST'])
def register_user():
    data = request.get_json()
    required_fields = ["full_name", "user_id", "user_email"]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required user fields"}), 400

    if mongo.db.app_users.find_one({"user_id": data["user_id"]}):
        return jsonify({"error": "User already exists"}), 400

    user = {
        "_id": ObjectId(),
        "user_id": data["user_id"],
        "full_name": data["full_name"],
        "user_email": data["user_email"],
        "created_at": now_utc(),
        "last_login": now_utc(),
        "account_details": data.get("account_details", [])
    }

    mongo.db.app_users.insert_one(user)
    return jsonify({"message": "User registered successfully"}), 201
