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
    def __init__(self, id_, name, email, profile_pic):
        self.id = id_
        self.name = name
        self.email = email
        self.profile_pic = profile_pic

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
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=GOOGLE_REDIRECT_URI,
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

    client.parse_request_body_response(token_response.text)

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
        id_=user_data["sub"],
        name=user_data["name"],
        email=user_data["email"],
        profile_pic=user_data["picture"],
    )

    # Store user info in session
    session["user"] = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "picture": user.profile_pic,
    }
    print(f"user: {user.name}")
    login_user(user)

    # Return token and user information as JSON
    return jsonify({
        "access_token": token_response.json().get("access_token"),
        "id_token": token_response.json().get("id_token"),
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "picture": user.profile_pic,
        }
    }), 200

# Logout
def google_logout():
    logout_user()
    session.clear()
    return jsonify({"message": "User logged out successfully"})
