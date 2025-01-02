# from flask import session, Blueprint, redirect, url_for, request, jsonify
# from flasgger import swag_from
# from app.services.auth_service import auth_github_callback, auth_google_callback, login_github, login_google
# # from app.services.user_service import create_user, get_user_by_email
# from authlib.integrations.flask_client import OAuth

# auth_bp = Blueprint('auth', __name__)
# oauth = OAuth()

# # Configure OAuth provider
# oauth_provider = oauth.register(
#     name='oauth_provider',
#     client_id='your_client_id',
#     client_secret='your_client_secret',
#     authorize_url='https://provider.com/oauth/authorize',
#     authorize_params=None,
#     access_token_url='https://provider.com/oauth/token',
#     access_token_params=None,
#     refresh_token_url=None,
#     redirect_uri='http://localhost:5000/auth',
#     client_kwargs={'scope': 'profile email'}
# )

# @auth_bp.route('/login/google')
# @swag_from({
#     'responses': {
#         302: {
#             'description': 'Redirect to Google OAuth provider'
#         }
#     }
# })
# def login_google_route():
#     return login_google()

# @auth_bp.route('/auth/google/callback')
# @swag_from({
#     'responses': {
#         302: {
#             'description': 'Redirect to index after successful Google authentication'
#         }
#     }
# })
# def auth_google_callback_route():
#     user_info = auth_google_callback()
#     if 'email' in user_info:
#         session['user'] = user_info['email']
#         return redirect(url_for('index'))
#     return 'Login failed'

# @auth_bp.route('/login/github')
# @swag_from({
#     'responses': {
#         302: {
#             'description': 'Redirect to GitHub OAuth provider'
#         }
#     }
# })
# def login_github_route():
#     return login_github()

# @auth_bp.route('/auth/github/callback')
# @swag_from({
#     'responses': {
#         302: {
#             'description': 'Redirect to index after successful GitHub authentication'
#         }
#     }
# })
# def auth_github_callback_route():
#     user_info = auth_github_callback()
#     if 'email' in user_info:
#         session['user'] = user_info['email']
#         return redirect(url_for('index'))
#     return 'Login failed'

# @auth_bp.route('/signup', methods=['POST'])
# @swag_from({
#     'parameters': [
#         {
#             'name': 'first_name',
#             'in': 'body',
#             'type': 'string',
#             'required': True,
#             'description': 'First name of the user'
#         },
#         {
#             'name': 'last_name',
#             'in': 'body',
#             'type': 'string',
#             'required': True,
#             'description': 'Last name of the user'
#         },
#         {
#             'name': 'middle_name',
#             'in': 'body',
#             'type': 'string',
#             'required': False,
#             'description': 'Middle name of the user'
#         },
#         {
#             'name': 'email',
#             'in': 'body',
#             'type': 'string',
#             'required': True,
#             'description': 'Email of the user'
#         },
#         {
#             'name': 'password',
#             'in': 'body',
#             'type': 'string',
#             'required': True,
#             'description': 'Password of the user'
#         }
#     ],
#     'responses': {
#         201: {
#             'description': 'Account created successfully',
#             'schema': {
#                 'type': 'object',
#                 'properties': {
#                     'message': {'type': 'string'},
#                     'user': {
#                         'type': 'object',
#                         'properties': {
#                             'first_name': {'type': 'string'},
#                             'last_name': {'type': 'string'},
#                             'middle_name': {'type': 'string'},
#                             'email': {'type': 'string'}
#                         }
#                     }
#                 }
#             }
#         },
#         400: {
#             'description': 'Account already exists or missing required fields',
#             'schema': {
#                 'type': 'object',
#                 'properties': {
#                     'message': {'type': 'string'}
#                 }
#             }
#         }
#     }
# })
# def signup():
#     data = request.get_json()
#     email = data.get('email')
#     if get_user_by_email(email):
#         return jsonify({'message': 'Account already exists'}), 400

#     first_name = data.get('first_name')
#     last_name = data.get('last_name')
#     middle_name = data.get('middle_name', '')
#     password = data.get('password')

#     if not all([first_name, last_name, email, password]):
#         return jsonify({'message': 'Missing required fields'}), 400

#     user = create_user(first_name, last_name, middle_name, email, password)
#     return jsonify({'message': 'Account created successfully', 'user': user}), 201

# @auth_bp.route('/login')
# def login():
#     redirect_uri = url_for('auth.auth', _external=True)
#     return oauth_provider.authorize_redirect(redirect_uri)

# @auth_bp.route('/auth')
# def auth():
#     token = oauth_provider.authorize_access_token()
#     session['oauth_token'] = token
#     user_info = oauth_provider.get('user')
#     session['user'] = user_info.json()
#     return redirect(url_for('evaluation.evaluation'))

# @oauth_provider.tokengetter
# def get_oauth_token():
#     return session.get('oauth_token')