from flask import Flask
from flask_cors import CORS
# from app.routes.auth import auth_bp, oauth
from app.routes.evaluation import evaluation_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = 'your_secret_key'
    CORS(app, resources={r"/*": {
    "origins": "*",                  # Replace "" with the specific domain if needed
    "methods": ["GET", "POST", "PUT", "DELETE"],  # Allow specific HTTP methods
    "allow_headers": ["Content-Type", "Authorization"]  # Add required headers here
}})
    # oauth.init_app(app)
    
    # app.register_blueprint(auth_bp)
    app.register_blueprint(evaluation_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='thesmartpaths.com', port=8000, debug=False)

