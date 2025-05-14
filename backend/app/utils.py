
import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

def now_utc():
    return datetime.now(timezone.utc)

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, hashed):
    return check_password_hash(hashed, password)

def create_admin_user(email, first_name, last_name, password):
    return {
        "admin_user_email": email,
        "first_name": first_name,
        "last_name": last_name,
        "password": hash_password(password),
        "role": "Admin",
        "created_at": datetime.utcnow(),
        "last_login": None,
        "admin_user_id": str(uuid.uuid4())
    }
