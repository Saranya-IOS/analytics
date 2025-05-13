from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from app import mongo

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route("/users_sessions_line", methods=["GET"])
def users_sessions_line():
    from_date_str = request.args.get("from")
    to_date_str = request.args.get("to")

    try:
        if from_date_str:
            from_dt = datetime.strptime(from_date_str, "%Y-%m-%d")
        if to_date_str:
            to_dt = datetime.strptime(to_date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    # Default to last 7 days if dates not provided
    if not from_date_str and not to_date_str:
        to_dt = datetime.utcnow()
        from_dt = to_dt - timedelta(days=6)
    elif from_date_str and not to_date_str:
        to_dt = datetime.utcnow()
    elif not from_date_str and to_date_str:
        from_dt = datetime.utcnow() - timedelta(days=6)

    # Build match filters
    date_filter_users = {
        "created_at": {
            "$gte": from_dt,
            "$lte": to_dt
        }
    }
    date_filter_sessions = {
        "started_at": {
            "$gte": from_dt,
            "$lte": to_dt
        }
    }

    pipeline_users = [
        {"$match": date_filter_users},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
            "user_count": {"$sum": 1}
        }}
    ]
    pipeline_sessions = [
        {"$match": date_filter_sessions},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$started_at"}},
            "session_count": {"$sum": 1}
        }}
    ]

    users = {item["_id"]: item["user_count"] for item in mongo.db.app_users.aggregate(pipeline_users)}
    sessions = {item["_id"]: item["session_count"] for item in mongo.db.user_sessions.aggregate(pipeline_sessions)}

    all_dates = sorted(set(users) | set(sessions))
    data = [
        {
            "date": d,
            "user_count": users.get(d, 0),
            "session_count": sessions.get(d, 0)
        }
        for d in all_dates
    ]
    return jsonify(data)
