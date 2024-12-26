from flask import Flask
from flasgger import Swagger
from .routes.auth import auth_bp, oauth
from .routes.evaluation import evaluation_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = 'your_generated_secret_key'  # Replace with your generated secret key
    oauth.init_app(app)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(evaluation_bp)
    
    swagger = Swagger(app)
    
    return app