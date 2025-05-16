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

@user_bp.route("/list", methods=["GET"])
def list_app_users():
    try:
        # Pagination params
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 20))
        skip = (page - 1) * limit

        # Optional filters
        user_id = request.args.get("user_id")
        user_email = request.args.get("user_email")
        account_id = request.args.get("account_id")

        query = {}
        if user_id:
            query["user_id"] = user_id
        if user_email:
            query["user_email"] = user_email
        if account_id:
            query["account_details.account_id"] = account_id

        # Total count for pagination
        total = mongo.db.app_users.count_documents(query)

        # Fetch paginated results
        users = list(
            mongo.db.app_users.find(query, {"_id": 0})
            .skip(skip)
            .limit(limit)
        )

        return jsonify({
            "page": page,
            "limit": limit,
            "total": total,
            "data": users
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500