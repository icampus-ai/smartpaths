from authlib.integrations.flask_client import OAuth
from flask import url_for, request, redirect, session, current_app
from werkzeug.security import generate_password_hash, check_password_hash

oauth = OAuth()

# Configure Google OAuth
google = oauth.register(
    name='google',
    client_id='YOUR_GOOGLE_CLIENT_ID',
    client_secret='YOUR_GOOGLE_CLIENT_SECRET',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://localhost:5000/auth/google/callback',
    client_kwargs={'scope': 'profile email'}
)

# Configure GitHub OAuth
github = oauth.register(
    name='github',
    client_id='YOUR_GITHUB_CLIENT_ID',
    client_secret='YOUR_GITHUB_CLIENT_SECRET',
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://localhost:5000/auth/github/callback',
    client_kwargs={'scope': 'user:email'}
)

def login_google():
    redirect_uri = url_for('auth.auth_google_callback_route', _external=True)
    return google.authorize_redirect(redirect_uri)

def auth_google_callback():
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    return user_info

def login_github():
    redirect_uri = url_for('auth.auth_github_callback_route', _external=True)
    return github.authorize_redirect(redirect_uri)

def auth_github_callback():
    token = github.authorize_access_token()
    resp = github.get('user')
    user_info = resp.json()
    return user_info

def get_user_by_email(email):
    user = current_app.mongo.your_database_name.users.find_one({'email': email})
    return user

def create_user(first_name, last_name, middle_name, email, password):
    hashed_password = generate_password_hash(password)
    user = {
        'first_name': first_name,
        'last_name': last_name,
        'middle_name': middle_name,
        'email': email,
        'password': hashed_password
    }
    current_app.mongo.your_database_name.users.insert_one(user)
    return user