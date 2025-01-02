from flask import Flask
# from app.routes.auth import auth_bp, oauth
from app.routes.evaluation import evaluation_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = 'your_secret_key'
    # oauth.init_app(app)
    
    # app.register_blueprint(auth_bp)
    app.register_blueprint(evaluation_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=False)

