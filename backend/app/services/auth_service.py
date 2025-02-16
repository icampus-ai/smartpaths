import json
import requests
from flask import session, redirect, url_for, request
from flask_login import UserMixin, login_user, logout_user
from oauthlib.oauth2 import WebApplicationClient

# Google OAuth credentials (Replace with actual credentials)
GOOGLE_CLIENT_ID = "your_google_client_id"
GOOGLE_CLIENT_SECRET = "your_google_client_secret"
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

client = WebApplicationClient(GOOGLE_CLIENT_ID)

# User class (no database)
class User(UserMixin):
    def __init__(self, id, name, email, picture):
        self.id = id
        self.name = name
        self.email = email
        self.picture = picture

# Load user from session
def load_user(user_id):
    user_data = session.get("user")
    if user_data:
        return User(user_data["sub"], user_data["name"], user_data["email"], user_data["picture"])
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
        redirect_uri=url_for("auth.google_callback", _external=True),
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

# Google Callback
def google_callback():
    code = request.args.get("code")
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    client.parse_request_body_response(json.dumps(token_response.json()))
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    if userinfo_response.json().get("email_verified"):
        user = User(
            id=userinfo_response.json()["sub"],
            name=userinfo_response.json()["name"],
            email=userinfo_response.json()["email"],
            picture=userinfo_response.json()["picture"],
        )
        session["user"] = userinfo_response.json()
        login_user(user)
        return redirect(url_for("auth.dashboard"))

    return "User email not verified", 400

# Logout
def google_logout():
    logout_user()
    session.clear()
    return redirect(url_for("auth.home"))
