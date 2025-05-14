from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from app import mongo
import uuid

session_bp = Blueprint('session', __name__)

@session_bp.route('/create_session', methods=['POST'])
def create_session():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id or not mongo.db.app_users.find_one({"user_id": user_id}):
        return jsonify({"error": "User not registered"}), 404

    session_id = data.get("session_id", str(uuid.uuid4()))

    try:
        started_at = datetime.fromisoformat(data.get("started_at", "").replace("Z", "+00:00"))
    except Exception:
        started_at = datetime.utcnow()

    try:
        ended_at = datetime.fromisoformat(data.get("ended_at", "").replace("Z", "+00:00"))
    except Exception:
        ended_at = None

    session = {
        "_id": ObjectId(),
        "session_id": session_id,
        "user_id": user_id,
        "started_at": started_at,
        "ended_at": ended_at,
        "account_id": data.get("account_id"),
        "instance_id": data.get("instance_id"),
        "app_details": data.get("app_details", {}),
        "device_details": data.get("device_details", {}),
        "location": data.get("location", {})
    }

    mongo.db.user_sessions.insert_one(session)

    return jsonify({
        "message": "Session created",
        "session_id": session_id
    }), 201

@session_bp.route('/end_session', methods=['POST'])
def end_session():
    data = request.get_json()
    session_id = data.get("session_id")

    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400

    session = mongo.db.user_sessions.find_one({"session_id": session_id})
    if not session:
        return jsonify({"error": "Session not found"}), 404

    mongo.db.user_sessions.update_one(
        {"session_id": session_id},
        {"$set": {"ended_at": datetime.utcnow()}}
    )

    return jsonify({"message": "Session ended"}), 200
