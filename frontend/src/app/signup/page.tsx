"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../sections/Header";
import Image from "next/image";
import abstract34 from "../../assets/abstract_33.png"; // Adjust the path as needed
import studentsImage from "../../assets/students_3.png"; // Adjust the path as needed

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      router.push("/dashboard");
    } else {
      setErrorMessage("Invalid credentials");
    }
  };

  return (
    <>
      <Header />
      <section className="relative bg-white py-24 min-h-screen flex flex-col justify-center items-center">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={abstract34}
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
          />
        </div>

        {/* Title */}
        <div className="relative z-10 text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
          <span className="text-orange-500">Your</span>
          <span className="text-black"> Journey</span>
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
                className={`text-2xl font-bold px-4 py-2 rounded-lg transition-colors ${isSignup ? "bg-black text-white" : "bg-gray-200 text-gray-800"}`}
              >
                Signup
              </button>
              <button
                onClick={() => setIsSignup(false)}
                className={`text-2xl font-bold px-4 py-2 rounded-lg transition-colors ${!isSignup ? "bg-black text-white" : "bg-gray-200 text-gray-800"}`}
              >
                Login
              </button>
            </div>

            {isSignup ? (
              <form className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-300 focus:outline-none transition"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-300 focus:outline-none transition"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-300 focus:outline-none transition"
                  />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="terms" className="mr-2" />
                  <label htmlFor="terms" className="text-gray-600 text-sm">
                    I accept all terms & conditions
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg shadow-md hover:scale-105 transform transition"
                >
                  Signup
                </button>
              </form>
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
                {isSignup ? "Already have an account?" : "Don't have an account?"} {" "}
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
              width={600}
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