import unittest
from unittest.mock import patch, MagicMock
from werkzeug.security import check_password_hash

from app.services.auth_service import (
    login_google, auth_google_callback, login_github, auth_github_callback,
    get_user_by_email, create_user, users_db
)

class TestAuthService(unittest.TestCase):

    @patch('app.services.auth_service.google')
    def test_login_google(self, mock_google):
        mock_google.authorize_redirect.return_value = 'redirect_url'
        response = login_google()
        self.assertEqual(response, 'redirect_url')
        mock_google.authorize_redirect.assert_called_once()

    @patch('app.services.auth_service.google')
    def test_auth_google_callback(self, mock_google):
        mock_google.authorize_access_token.return_value = 'token'
        mock_google.get.return_value.json.return_value = {'email': 'test@example.com'}
        user_info = auth_google_callback()
        self.assertEqual(user_info['email'], 'test@example.com')
        mock_google.authorize_access_token.assert_called_once()
        mock_google.get.assert_called_once_with('userinfo')

    @patch('app.services.auth_service.github')
    def test_login_github(self, mock_github):
        mock_github.authorize_redirect.return_value = 'redirect_url'
        response = login_github()
        self.assertEqual(response, 'redirect_url')
        mock_github.authorize_redirect.assert_called_once()

    @patch('app.services.auth_service.github')
    def test_auth_github_callback(self, mock_github):
        mock_github.authorize_access_token.return_value = 'token'
        mock_github.get.return_value.json.return_value = {'email': 'test@example.com'}
        user_info = auth_github_callback()
        self.assertEqual(user_info['email'], 'test@example.com')
        mock_github.authorize_access_token.assert_called_once()
        mock_github.get.assert_called_once_with('user')

    def test_get_user_by_email(self):
        users_db.append({'email': 'test@example.com'})
        user = get_user_by_email('test@example.com')
        self.assertIsNotNone(user)
        self.assertEqual(user['email'], 'test@example.com')
        users_db.clear()

    def test_create_user(self):
        user = create_user('John', 'Doe', 'M', 'john.doe@example.com', 'password123')
        self.assertEqual(user['first_name'], 'John')
        self.assertEqual(user['last_name'], 'Doe')
        self.assertEqual(user['middle_name'], 'M')
        self.assertEqual(user['email'], 'john.doe@example.com')
        self.assertTrue(check_password_hash(user['password'], 'password123'))
        users_db.clear()

if __name__ == '__main__':
    unittest.main()