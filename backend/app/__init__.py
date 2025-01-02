# from flask import Flask
# from flasgger import Swagger
# from pymongo import MongoClient
# from app.routes.auth_routes import auth_bp
# from .routes.evaluation import evaluation_bp
# from .services.auth_service import oauth

# def create_app():
#     app = Flask(__name__)
#     app.secret_key = 'your_generated_secret_key'  # Replace with your generated secret key
#     oauth.init_app(app)
    
#     # MongoDB configuration
#     app.config['MONGO_URI'] = 'mongodb://localhost:27017/your_database_name'
#     mongo = MongoClient(app.config['MONGO_URI'])
#     app.mongo = mongo

#     app.register_blueprint(auth_bp)
#     app.register_blueprint(evaluation_bp)
    
#     swagger = Swagger(app)
    
#     return app