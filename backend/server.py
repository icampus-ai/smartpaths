from flask import Flask
from .routes.auth import auth_bp, oauth
from .routes.evaluation import evaluation_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = 'your_secret_key'
    oauth.init_app(app)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(evaluation_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
