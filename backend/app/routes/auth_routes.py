from flask import session, Blueprint, redirect, url_for
from app.services.auth_service import auth_github_callback, auth_google_callback, login_github, login_google
from app.services.auth_service import (
    login_google,
    login_github,
    auth_google_callback,
    auth_github_callback
)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login/google')
def login_google_route():
    return login_google()

@auth_bp.route('/auth/google/callback')
def auth_google_callback_route():
    user_info = auth_google_callback()
    if 'email' in user_info:
        session['user'] = user_info['email']
        return redirect(url_for('index'))
    return 'Login failed'

@auth_bp.route('/login/github')
def login_github_route():
    return login_github()

@auth_bp.route('/auth/github/callback')
def auth_github_callback_route():
    user_info = auth_github_callback()
    if 'email' in user_info:
        session['user'] = user_info['email']
        return redirect(url_for('index'))
    return 'Login failed'
