"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Header } from "../../sections/Header";
import abstract34 from "../../assets/abstract_33.png";
import studentsImage from "../../assets/student_1.png";

const SignupPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook from next/navigation
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Read query params from the URL
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const picture = searchParams.get("picture");

    // If a token is present, store all user info and go to dashboard
    if (token) {
      localStorage.setItem("username", name || "");
      localStorage.setItem("email", email || "");
      localStorage.setItem("imageUrl", picture || "");
      router.push("/dashboard");
    }
  }, [router, searchParams]);

  // Dummy local login
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      (username === "admin" && password === "admin") ||
      (username === "user" && password === "user")
    ) {
      localStorage.setItem("username", username);
      localStorage.setItem("email", "user@example.com");
      router.push("/dashboard");
    } else {
      setErrorMessage("Invalid credentials");
    }
  };

  // Trigger Google sign-in
  const handleGoogleLogin = () => {
    setLoading(true);
    // This should match your backend login endpoint
    window.location.href =
      "https://8d19-2001-861-e3c6-2290-6ddd-7b0e-2070-7b0f.ngrok-free.app/api/google/login";
  };

  return (
    <>
      <Header />
      <section className="relative bg-white py-14 min-h-screen flex flex-col justify-center items-center">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={abstract34}
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
          />
        </div>

        {/* Title */}
        <div className="relative z-10 text-center mb-10 mt-20">
          <h1 className="text-7xl font-extrabold text-gray-800">
            <span className="text-orange-500">Your</span>
            <span className="text-black"> Journey,</span>
            <span className="text-orange-500"> Your</span>
            <span className="text-black"> Path Awaits</span>
          </h1>
        </div>

        <div className="relative z-10 flex items-center justify-center w-full max-w-6xl">
          {/* Signup/Login Container */}
          <div className="w-full max-w-md bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-lg p-10 transform transition hover:scale-105 mr-8">
            <div className="text-center flex justify-center gap-4 mb-4">
              <button
                onClick={() => setIsSignup(true)}
                className={`text-2xl font-bold px-4 py-2 rounded-lg transition-colors ${
                  isSignup ? "bg-black text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Signup
              </button>
              <button
                onClick={() => setIsSignup(false)}
                className={`text-2xl font-bold px-4 py-2 rounded-lg transition-colors ${
                  !isSignup ? "bg-black text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Login
              </button>
            </div>

            {isSignup ? (
              <div className="space-y-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg shadow-md hover:scale-105 transform transition disabled:opacity-50"
                >
                  {loading ? "Redirecting..." : "Sign in with Google"}
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleLogin}>
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your password"
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-blue-500 hover:underline transition-colors"
                >
                  {isSignup ? "Login" : "Signup"}
                </button>
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="hidden md:block">
            <Image
              src={studentsImage}
              alt="Students"
              width={500}
              height={400}
              className="rounded-2xl"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default SignupPage;
