from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from app import mongo
import uuid

account_bp = Blueprint('account', __name__)

@account_bp.route("/accounts", methods=["GET"])
def get_accounts():
    
    account_id = request.args.get("account_id")
    account_type = request.args.get("account_type")

    query = {}
    if account_id:
        query["account_id"] = account_id
    if account_type:
        query["account_type"] = account_type

    accounts = list(mongo.db.accounts.find(query, {"_id": 0}))  # exclude Mongo's _id field
    return jsonify(accounts), 200