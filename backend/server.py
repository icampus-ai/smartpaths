from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
import os
from dotenv import load_dotenv

from app.routes.auth import auth_bp
from app.routes.evaluation import evaluation_bp
from app.services.auth_service import load_user

load_dotenv()  # Load environment variables

def create_app():
    app = Flask(__name__)
    
    # Force Flask to use https URLs
    app.config['PREFERRED_URL_SCHEME'] = 'https'
    
    # Secure secret key
    app.secret_key = os.getenv("SECRET_KEY", "your-secure-random-key")

    # Configure CORS
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://8d19-2001-861-e3c6-2290-6ddd-7b0e-2070-7b0f.ngrok-free.app"], "methods": ["GET", "POST", "PUT", "DELETE"], "supports_credentials": True}})

    # Setup Login Manager
    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def user_loader(user_id):
        return load_user(user_id)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(evaluation_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="localhost", port=8000, debug=True)
