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

#TOP SCREENS API
@analytics_bp.route("/top_screens", methods=["GET"])
def top_screens():
    pipeline = [
        {
            "$group": {
                "_id": "$screen_name",
                "event_count": {"$sum": 1},
                "unique_users": {"$addToSet": "$user_id"}  # Replace with actual user identifier field
            }
        },
        {
            "$project": {
                "event_count": 1,
                "user_count": {"$size": "$unique_users"}
            }
        },
        {"$sort": {"event_count": -1}},  # Or use "user_count" if sorting by users
        {"$limit": 10}
    ]
    result = mongo.db.events.aggregate(pipeline)
    return jsonify([
        {
            "screen_name": item["_id"],
            "event_count": item["event_count"],
            "user_count": item["user_count"]
        } for item in result
    ])

@analytics_bp.route("/event_donut", methods=["GET"])
def event_donut():
    pipeline = [
        {"$group": {
            "_id": "$event_name",
            "count": {"$sum": 1}
        }}
    ]
    result = list(mongo.db.events.aggregate(pipeline))
    total = sum(item["count"] for item in result)

    distribution = [
        {
            "event_name": item["_id"],
            "count": item["count"],
            "percentage": round((item["count"] / total) * 100, 2)
        }
        for item in result
    ]
    return jsonify({"total_events": total, "event_distribution": distribution})

#SCREEN LIST API
@analytics_bp.route("/screen_list", methods=["GET"])
def screen_list():
    pipeline = [
        {
            "$group": {
                "_id": "$screen_name",
                "event_count": {"$sum": 1},
                "user_ids": {"$addToSet": "$user_id"}
            }
        },
        {
            "$lookup": {
                "from": "app_users",
                "localField": "user_ids",
                "foreignField": "user_id",  # This is a string field in users
                "as": "users_info"
            }
        },
        {
            "$project": {
                "screen_name": "$_id",
                "event_count": 1,
                "unique_user_count": {"$size": "$users_info"}
            }
        },
        {"$sort": {"event_count": -1}}
    ]
    result = mongo.db.events.aggregate(pipeline)
    response = [
        {
            "screen_name": item["_id"],
            "event_count": item["event_count"],
            "unique_user_count": item["unique_user_count"]
        }
        for item in result
    ]
    return jsonify(response)

# USER INTERACTIONS API 
@analytics_bp.route("/user_interactions", methods=["GET"])
def user_interactions():
    pipeline = [
        {"$group": {
            "_id": "$screen_name",
            "touch_count": {"$sum": "$touch_count"},
            "scroll_count": {"$sum": "$scroll_count"}
        }}
    ]
    result = mongo.db.events.aggregate(pipeline)
    return jsonify([
        {
            "screen_name": item["_id"],
            "touch_count": item.get("touch_count", 0),
            "scroll_count": item.get("scroll_count", 0)
        }
        for item in result
    ])

#TOP SCREENS API
@analytics_bp.route("/screen_visited", methods=["GET"])
def screen_visited():
    pipeline = [
        {"$group": {
            "_id": "$screen_name",
            "event_count": {"$sum": 1}
        }},
        {"$sort": {"event_count": -1}},
        {"$limit": 10}
    ]
    result = mongo.db.events.aggregate(pipeline)
    return jsonify([{"screen_name": item["_id"], "event_count": item["event_count"]} for item in result])

@analytics_bp.route("/events", methods=["GET"])
def list_events():
    try:
        # Pagination
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        if page < 1 or limit < 1:
            return jsonify({"error": "Page and limit must be positive integers."}), 400

        skip = (page - 1) * limit

        # Filters
        filters = {}
        for field in ["event_type", "screen_name", "user_id", "device_id"]:
            value = request.args.get(field)
            if value:  # Skip if value is None or empty string
                filters[field] = value

        # Date range
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        if start_date or end_date:
            filters["created_at"] = {}
            if start_date:
                filters["created_at"]["$gte"] = datetime.fromisoformat(start_date)
            if end_date:
                filters["created_at"]["$lte"] = datetime.fromisoformat(end_date)

        # Query
        cursor = (
            mongo.db.events
            .find(filters)
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )

        events = []
        for doc in cursor:
            event = {
                "event_name": doc.get("event_name", ""),          # Customize fallback as needed
                "user_id": doc.get("user_id", ""),
                "event_type": doc.get("event_type", ""),
                "screen_name": doc.get("screen_name", ""),
                "touch_count": doc.get("touch_count", 0),
                "scroll_count": doc.get("scroll_count", 0),
                "timestamp": doc.get("created_at").isoformat() if doc.get("created_at") else None
            }
            events.append(event)

        total = mongo.db.events.count_documents(filters)

        return jsonify({
            "page": page,
            "limit": limit,
            "total": total,
            "count": len(events),
            "events": events
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
