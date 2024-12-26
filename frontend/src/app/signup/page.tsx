"use client";

import React from "react";

const SignupPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-800 flex items-center justify-center px-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
      </div>

      {/* Signup Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        {/* Social Signup Options */}
        <div className="bg-gradient-to-b from-white to-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-md transform transition hover:scale-105">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Sign Up with
          </h2>
          <div className="space-y-4">
            <button
              className="w-full bg-[#4285F4] text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-[#357AE8] focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
              onClick={() => alert("Google Signup Clicked")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              />
              Sign Up with Google
            </button>
            <button
              className="w-full bg-[#1877F2] text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-[#165DBA] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
              onClick={() => alert("Facebook Signup Clicked")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png"
                alt="Facebook Logo"
                className="w-5 h-5 mr-2"
              />
              Sign Up with Facebook
            </button>
            <button
              className="w-full bg-[#0077B5] text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-[#005983] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
              onClick={() => alert("LinkedIn Signup Clicked")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                alt="LinkedIn Logo"
                className="w-5 h-5 mr-2"
              />
              Sign Up with LinkedIn
            </button>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-gradient-to-b from-white to-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-md transform transition hover:scale-105">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create an Account
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Join SmartPaths and start simplifying your workflows today.
          </p>
          <form className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:outline-none transition"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:outline-none transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:outline-none transition"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
          </form>
          <p className="text-gray-600 text-sm text-center mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:underline transition-colors"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

