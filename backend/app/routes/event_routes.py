from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from app import mongo
import uuid

event_bp = Blueprint('event', __name__)

@event_bp.route('/create_events', methods=['POST'])
def create_event():
    events = request.get_json()

    if not isinstance(events, list):
        return jsonify({"error": "Request body must be a list of event objects"}), 400

    valid_events = []
    for event in events:
        required_fields = ["user_id", "session_id", "event_type", "event_name", "screen_name"]
        if not all(field in event for field in required_fields):
            return jsonify({"error": f"Missing required fields in event: {event}"}), 400

        try:
            created_at = datetime.fromisoformat(event.get("created_at", "").replace("Z", "+00:00"))
        except Exception:
            created_at = datetime.utcnow()

        valid_events.append({
            "_id": ObjectId(),
            "event_id": event.get("event_id", str(uuid.uuid4())),
            "user_id": event["user_id"],
            "session_id": event["session_id"],
            "event_type": event["event_type"],
            "event_name": event["event_name"],
            "screen_name": event["screen_name"],
            "scroll_count": event.get("scroll_count", 0),
            "touch_count": event.get("touch_count", 0),
            "created_at": created_at
        })

    if valid_events:
        mongo.db.events.insert_many(valid_events)
        return jsonify({
            "message": f"{len(valid_events)} event(s) created",
            "event_ids": [e["event_id"] for e in valid_events]
        }), 201

    return jsonify({"error": "No valid events to insert"}), 400
