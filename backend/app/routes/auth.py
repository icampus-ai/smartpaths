from flask import Blueprint, redirect, url_for, session
from authlib.integrations.flask_client import OAuth
from flasgger import swag_from

auth_bp = Blueprint('auth', __name__)
oauth = OAuth()

# Configure OAuth provider
oauth_provider = oauth.register(
    name='oauth_provider',
    client_id='your_client_id',
    client_secret='your_client_secret',
    authorize_url='https://provider.com/oauth/authorize',
    authorize_params=None,
    access_token_url='https://provider.com/oauth/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://localhost:5000/auth',
    client_kwargs={'scope': 'profile email'}
)

@auth_bp.route('/login')
@swag_from({
    'responses': {
        302: {
            'description': 'Redirect to OAuth provider'
        }
    }
})
def login():
    redirect_uri = url_for('auth.auth', _external=True)
    return oauth_provider.authorize_redirect(redirect_uri)

@auth_bp.route('/auth')
@swag_from({
    'responses': {
        302: {
            'description': 'Redirect to evaluation route after successful authentication'
        }
    }
})
def auth():
    token = oauth_provider.authorize_access_token()
    session['oauth_token'] = token
    user_info = oauth_provider.get('user')
    session['user'] = user_info.json()
    return redirect(url_for('evaluation.evaluation'))

@oauth_provider.tokengetter
def get_oauth_token():
    return session.get('oauth_token')