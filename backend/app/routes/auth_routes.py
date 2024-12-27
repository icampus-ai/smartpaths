from flask import session, Blueprint, redirect, url_for
from app.services.auth_service import auth_github_callback, auth_google_callback, login_github, login_google
from flask import request, jsonify
from app.services.user_service import create_user, get_user_by_email
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

@auth_bp.route('/signup', methods=['POST'])
def signup():
        data = request.get_json()
        email = data.get('email')
        if get_user_by_email(email):
            return jsonify({'message': 'Account already exists'}), 400

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        middle_name = data.get('middle_name', '')
        password = data.get('password')

        if not all([first_name, last_name, email, password]):
            return jsonify({'message': 'Missing required fields'}), 400

        user = create_user(first_name, last_name, middle_name, email, password)
        return jsonify({'message': 'Account created successfully', 'user': user}), 201