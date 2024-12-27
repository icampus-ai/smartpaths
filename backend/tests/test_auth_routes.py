import unittest
from unittest.mock import patch
from flask import session
from app import create_app

class AuthRoutesTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    @patch('app.services.auth_service.login_google')
    def test_login_google_route(self, mock_login_google):
        mock_login_google.return_value = 'redirect_to_google'
        response = self.client.get('/login/google')
        self.assertEqual(response.status_code, 302)
        self.assertIn('redirect_to_google', response.location)

    @patch('app.services.auth_service.auth_google_callback')
    def test_auth_google_callback_route_success(self, mock_auth_google_callback):
        mock_auth_google_callback.return_value = {'email': 'test@example.com'}
        with self.client.session_transaction() as sess:
            sess['user'] = None
        response = self.client.get('/auth/google/callback')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(session['user'], 'test@example.com')
        self.assertIn('/index', response.location)

    @patch('app.services.auth_service.auth_google_callback')
    def test_auth_google_callback_route_failure(self, mock_auth_google_callback):
        mock_auth_google_callback.return_value = {}
        response = self.client.get('/auth/google/callback')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Login failed', response.data.decode())

    @patch('app.services.auth_service.login_github')
    def test_login_github_route(self, mock_login_github):
        mock_login_github.return_value = 'redirect_to_github'
        response = self.client.get('/login/github')
        self.assertEqual(response.status_code, 302)
        self.assertIn('redirect_to_github', response.location)

    @patch('app.services.auth_service.auth_github_callback')
    def test_auth_github_callback_route_success(self, mock_auth_github_callback):
        mock_auth_github_callback.return_value = {'email': 'test@example.com'}
        with self.client.session_transaction() as sess:
            sess['user'] = None
        response = self.client.get('/auth/github/callback')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(session['user'], 'test@example.com')
        self.assertIn('/index', response.location)

    @patch('app.services.auth_service.auth_github_callback')
    def test_auth_github_callback_route_failure(self, mock_auth_github_callback):
        mock_auth_github_callback.return_value = {}
        response = self.client.get('/auth/github/callback')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Login failed', response.data.decode())

    @patch('app.services.user_service.create_user')
    @patch('app.services.user_service.get_user_by_email')
    def test_signup_route_success(self, mock_get_user_by_email, mock_create_user):
        mock_get_user_by_email.return_value = None
        mock_create_user.return_value = {
            'first_name': 'Test',
            'last_name': 'Name',
            'middle_name': 'M',
            'email': 'test.name@example.com'
        }
        response = self.client.post('/signup', json={
            'first_name': 'Test',
            'last_name': 'Name',
            'middle_name': 'M',
            'email': 'test.name@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn('Account created successfully', response.data.decode())

    @patch('app.services.user_service.get_user_by_email')
    def test_signup_route_account_exists(self, mock_get_user_by_email):
        mock_get_user_by_email.return_value = {'email': 'test.name@example.com'}
        response = self.client.post('/signup', json={
            'first_name': 'Test',
            'last_name': 'Name',
            'middle_name': 'M',
            'email': 'jtest.name@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('Account already exists', response.data.decode())

    def test_signup_route_missing_fields(self):
        response = self.client.post('/signup', json={
            'first_name': 'Test',
            'last_name': 'Name',
            'email': 'test.name@example.com'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('Missing required fields', response.data.decode())

if __name__ == '__main__':
    unittest.main()