"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../sections/Header";
import Image from "next/image";
import abstractImage from "../../assets/abstract_29.png";

const Login = () => {
  const router = useRouter();

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
      <section className="relative bg-gradient-to-b from-gray-800 to-white py-24 min-h-screen flex flex-col justify-center items-center">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={abstractImage}
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center mb-10">
          <h1 className="text-6xl font-extrabold bg-gradient-to-b text-black bg-clip-text">
            Welcome to 
            <span className="text-orange-500"> Smart</span>
            <span className="text-black">Paths</span>
          </h1>
          <p className="text-lg text-gray-800 mt-4">
            Login to streamline your evaluation process today.
          </p>
        </div>

        {/* Login Box */}
        <div className="relative z-10 w-full max-w-lg p-8 bg-white rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Login
          </h2>

          {/* Organizational Login */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;