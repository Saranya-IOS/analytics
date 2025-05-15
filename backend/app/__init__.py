
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from .config import Config

mongo = PyMongo()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from .routes.analytics import analytics_bp
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

    from app.routes.user_routes import user_bp
    from app.routes.session_routes import session_bp
    from app.routes.event_routes import event_bp
    from app.routes.account_routes import account_bp
    
    app.register_blueprint(user_bp, url_prefix="/api/app_user")
    app.register_blueprint(session_bp, url_prefix="/api/app_user")
    app.register_blueprint(event_bp, url_prefix="/api/app_user")
    app.register_blueprint(account_bp, url_prefix="/api/app_user")

    return app
