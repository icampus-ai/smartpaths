from flask import Flask
from .routes.auth import auth_bp, oauth
from .routes.evaluation import evaluation_bp
import secrets


def create_app():
    app = Flask(__name__)
    app.secret_key = secrets.token_hex(16)
    oauth.init_app(app)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(evaluation_bp)
    
    return app