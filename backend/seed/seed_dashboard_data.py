from faker import Faker
import random
from datetime import datetime, timedelta, UTC
from bson.objectid import ObjectId
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import uuid

# MongoDB setup
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "dashboardDB"
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
app_users_collection = db.app_users
user_sessions_collection = db.user_sessions
events_collection = db.events
accounts_collection = db.accounts
admin_users_collection = db.admin_users

# Faker setup
fake = Faker()

def seed_data():
    # Clear only non-master collections
    app_users_collection.delete_many({})
    user_sessions_collection.delete_many({})
    events_collection.delete_many({})
    admin_users_collection.delete_many({})

    # Fetch existing accounts with instances
    accounts = list(accounts_collection.find({}))
    if not accounts:
        print("❌ No accounts found in 'accounts' collection. Seeding aborted.")
        return

    users = []
    sessions = []
    events = []
    admin_users = []

    # Step 1: Create app users
    for i in range(100):  # 100 users
        user_id = f"{fake.uuid4()}"
        created_at = fake.date_time_this_year(tzinfo=UTC)
        last_login = fake.date_time_this_month(tzinfo=UTC)

        # Choose 1–3 random accounts, and sample one instance from each
        selected_accounts = random.sample(accounts, k=random.randint(1, 3))
        account_details = []
        for acc in selected_accounts:
            if acc.get("instances"):
                inst = random.choice(acc["instances"])
                account_details.append({
                    "account_id": acc["account_id"],
                    "instance_id": inst["instance_id"]
                })

        if not account_details:
            continue  # skip user if no instance available

        primary_account = random.choice(account_details)

        user_doc = {
            "_id": ObjectId(),
            "user_id": user_id,
            "full_name": fake.name(),
            "user_email": fake.email(),
            "created_at": created_at,
            "last_login": last_login,
            "account_details": account_details
        }
        users.append(user_doc)

        # Session
        session_id = ObjectId()
        session_start = fake.date_time_this_year(tzinfo=UTC)
        session_end = session_start + timedelta(minutes=random.randint(10, 120))

        session_doc = {
            "_id": session_id,
            "user_id": user_id,
            "session_id": fake.uuid4(),
            "started_at": session_start,
            "ended_at": session_end,
            "account_id": primary_account["account_id"],
            "instance_id": primary_account["instance_id"],
            "app_details": {
                "selected_app": "Training",
                "app_domain": "Mitsubishi",
                "app_version": f"1.0.{random.randint(0, 9)}"
            },
            "device_details": {
                "device_id": fake.uuid4(),
                "platform": random.choice(["Android", "iOS"]),
                "os_version": f"{random.randint(1, 12)}.{random.randint(0, 9)}",
                "model": random.choice(["Pixel 5", "iPhone 13", "Galaxy S21"])
            },
            "location": {
                "latitude": float(fake.latitude()),
                "longitude": float(fake.longitude()),
                "city": fake.city(),
                "country": fake.country()
            }
        }
        sessions.append(session_doc)

        # Events
        for _ in range(200):
            event_created = fake.date_time_between(start_date=session_start, end_date=session_end, tzinfo=UTC)
            event_doc = {
                "_id": ObjectId(),
                "event_id": f"{fake.uuid4()}",
                "user_id": user_id,
                "session_id": session_doc["session_id"],
                "event_type": random.choice(["GEN_EVENT", "USER", "ACTION_EVENT", "APP_FUNCTIONS"]),
                "event_name": random.choice(["Login", "Clicked Button", "Logout", "App Open", "App Close"]),
<<<<<<< Updated upstream
                "screen_name": random.choice(["Home", "Profile", "Incidents", "Requests", "Ticket Status", "Change Password"]),
=======
                "screen_name": random.choice(["Home", "Profile", "Settings", "Something Broken", "Create Request"]),
>>>>>>> Stashed changes
                "scroll_count": random.randint(0, 30),
                "touch_count": random.randint(0, 50),
                "created_at": event_created
            }
            events.append(event_doc)

    app_users_collection.insert_many(users)
    user_sessions_collection.insert_many(sessions)
    events_collection.insert_many(events)

    # Step 2: Create admin users
    for _ in range(5):  # 5 admin users
        full_name = fake.name()
        first_name = full_name.split(" ")[0]
        last_name = full_name.split(" ")[-1]
        email = fake.email()
        password = generate_password_hash("admin123")

        selected_accounts = random.sample(accounts, k=random.randint(1, 2))
        account_details = []
        for acc in selected_accounts:
            if acc.get("instances"):
                inst = random.choice(acc["instances"])
                account_details.append({
                    "account_id": acc["account_id"],
                    "instance_id": inst["instance_id"]
                })

        admin_user_doc = {
            "_id": ObjectId(),
            "admin_user_email": email,
            "first_name": first_name,
            "last_name": last_name,
            "full_name": full_name,
            "password": password,
            "created_at": datetime.now(UTC),
            "last_login": None,
            "admin_user_id": str(uuid.uuid4()),
            "account_details": account_details
        }
        admin_users.append(admin_user_doc)

    admin_users_collection.insert_many(admin_users)

    print(f"✅ Seeded {len(users)} app users, {len(sessions)} sessions, {len(events)} events, {len(admin_users)} admin users.")
    print("📂 Collections created:", db.list_collection_names())

if __name__ == "__main__":
    seed_data()
