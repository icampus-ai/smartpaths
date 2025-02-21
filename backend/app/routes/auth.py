from flask import Blueprint
import os
import sys
from flask_login import login_required, current_user

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from backend.app.services.auth_service import google_login, google_callback, google_logout

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/google/login")
def login():
    return google_login()

@auth_bp.route("/api/callback")
def google_callback_route():
    return google_callback()

@auth_bp.route("/logout")
@login_required
def logout():
    return google_logout()
