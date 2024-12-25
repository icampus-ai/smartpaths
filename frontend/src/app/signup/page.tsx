import React from "react";

const SignupPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center px-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-30 rounded-full blur-3xl"></div>
      </div>

      {/* Signup Form Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
        {/* Welcome Message */}
        <h1 className="text-center text-4xl md:text-3xl font-bold mb-6">
          Welcome to{" "}
          <span className="text-orange-500">Smart</span>
          <span className="text-black">Paths</span>
        </h1>
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Create your account to get started
        </p>
        <form className="mt-8 space-y-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:outline-none transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:outline-none transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:outline-none transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
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
  );
};

export default SignupPage;
