
import os

# mongodb://admin:secret@localhost:27017/dashboardDB?authSource=admin
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:secret@localhost:27017/dashboardDB?authSource=admin")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwtsecretkey")
