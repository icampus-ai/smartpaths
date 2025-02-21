import json
import requests
import os
from flask import session, redirect, url_for, request, jsonify
from flask_login import UserMixin, login_user, logout_user
from oauthlib.oauth2 import WebApplicationClient
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
GOOGLE_DISCOVERY_URL = os.getenv("GOOGLE_DISCOVERY_URL")

client = WebApplicationClient(GOOGLE_CLIENT_ID)

# User class (No database, stored in session)
class User(UserMixin):
    def __init__(self, id, name, email, picture):
        self.id = id
        self.name = name
        self.email = email
        self.picture = picture

# Load user from session
def load_user(user_id):
    user_data = session.get("user")
    if user_data and user_data["id"] == user_id:
        return User(user_data["id"], user_data["name"], user_data["email"], user_data["picture"])
    return None

# Fetch Google provider config
def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

# Google Login
def google_login():
    google_provider_cfg = get_google_provider_cfg()
    print(f"google_provider_cfg: {google_provider_cfg}")
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    print(f"authorization_endpoint: {authorization_endpoint}")

    redirect_uri = url_for("auth.google_callback_route", _external=True)
    redirect_uri = redirect_uri.replace("http://", "https://")  # force https
    print(f"redirect_uri: {redirect_uri}")
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=redirect_uri,
        scope=["openid", "email", "profile"],
    )
    print(f"request_uri: {request_uri}")
    return redirect(request_uri)

# Google Callback
def google_callback():
    code = request.args.get("code")
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    print(f"code: {code}")
    print(f"token_endpoint: {token_endpoint}")
    print(f"request.url: {request.url}")
    print(f"request.base_url: {request.base_url}")
    request.base_url = request.base_url.replace("http://", "https://")  # force https
    request.url = request.url.replace("http://", "https://")  # force https
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    print(f"token_url: {token_url}")
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )
    print(f"token_response: {token_response}")
    if token_response.status_code != 200:
        return "Failed to obtain token!", 400

    client.parse_request_body_response(json.dumps(token_response.json()))

    # Get user info
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    print(f"userinfo_response: {userinfo_response}")
    if not userinfo_response.json().get("email_verified"):
        return "User email not verified", 400

    # Create a User instance
    user_data = userinfo_response.json()
    user = User(
        id=user_data["sub"],
        name=user_data["name"],
        email=user_data["email"],
        picture=user_data["picture"],
    )

    # Store user info in session
    session["user"] = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "picture": user.picture,
    }
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "picture": user.picture,
    }), 200

# Logout
def google_logout():
    logout_user()
    session.clear()
    return redirect(url_for("auth.login"))
