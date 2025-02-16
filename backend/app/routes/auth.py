from flask import Blueprint
import sys
import os
from flask_login import login_required, current_user

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from backend.app.services.auth_service import google_login, google_callback, google_logout

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/")
def home():
    return "Welcome! <a href='/login'>Login with Google</a>"

@auth_bp.route("/api/google/login")
def login():
    return google_login()

@auth_bp.route("/callback")
def google_callback_route():
    return google_callback()

@auth_bp.route("/dashboard")
@login_required
def dashboard():
    return f"Hello, {current_user.name}! <br> <img src='{current_user.picture}' width='100px'> <br> <a href='/logout'>Logout</a>"

@auth_bp.route("/logout")
@login_required
def logout():
    return google_logout()
