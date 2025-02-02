"use client";

import React from "react";
import { Header } from "../../sections/Header";
import Image from "next/image";
import evaluationImage from "../../assets/evaluate.png"; // Ensure the image exists
import backgroundImage from "../../assets/abstract_33.png"; // Background image
import { FaCheckCircle } from "react-icons/fa";

const Features = () => {
  return (
    <>
      <Header />
      <section className="relative bg-gradient-to-b from-white to-gray-100 py-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Abstract Background"
            layout="fill"
            objectFit="cover"
            className="opacity-10"
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          {/* Section Heading */}
          <h1 className="text-4xl md:text-7xl font-extrabold bg-gradient-to-b from-black to-gray-700 text-transparent bg-clip-text text-center mt-16">
            <span className="text-orange-500">Enhancing </span> Education:  
            <span className="text-orange-500"> Smart</span>Paths Feature Suite
          </h1>

          {/* Seamless Grading Section */}
          <div className="mt-16 text-center">
            <h2 className="text-4xl font-bold text-black">
              <span className="text-orange-500">Seamless</span> Grading Experience
            </h2>
            <p className="text-lg text-black mt-4">
              Empower educators to evaluate students efficiently with our AI-driven grading platform.
            </p>
            <div className="mt-12 space-y-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-black-900 rounded-full"></div>

              {[
                "Seamlessly upload question papers with automated, customizable rubric extraction.",
                "Leverage advanced AI algorithms and models for lightning-fast, accurate, fair, and unbiased grading.",
                "Gain comprehensive insights and analytics to enhance student and faculty performance.",
                "Deliver personalized feedback on each question along with overall performance insights for students.",
                "Adapt grading to multiple difficulty levels based on overall class performance.",
              ].map((feature, index) => (
                <div key={index} className={`relative pl-16 text-left ${index === 4 ? 'mb-20' : ''}`}>
                  {/* Icon */}
                  <div className="absolute left-4 top-4 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full shadow">
                    <FaCheckCircle size={16} />
                  </div>
                  {/* Feature */}
                  <div className="bg-gray-100 text-gray-800 shadow-md rounded-lg p-4">
                    <p className="text-lg">{feature}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-8">
                <div className="transition-transform transform hover:scale-150">
                  <Image
                    src={evaluationImage}
                    alt="Seamless Grading Experience"
                    className="rounded-lg shadow-xl"
                    width={900}
                    height={900}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* New Features Section */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-black text-center">
              <span className="text-orange-500">Innovative</span> Features
            </h2>
            <p className="text-lg text-black text-center mt-4">
              Explore the cutting-edge features that set SmartPaths apart.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold text-center">
                  <span className="text-orange-500">Vertical</span> AI Agents
                </h3>
                <p className="text-lg text-gray-700 mt-4 text-center">
                  We prioritize data security and privacy by implementing AI agents specifically tailored to each institution. These agents process and handle data exclusively within the institution’s private ecosystem.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold text-center">
                  <span className="text-orange-500">Human-in-the-Loop</span> Grading System
                </h3>
                <p className="text-lg text-black mt-4 text-center">
                  Our unique system reduces 95% of the manual grading workload, allowing educators to focus on teaching and student engagement rather than administrative tasks.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold text-center">
                  <span className="text-orange-500">Bias</span> Reduction
                </h3>
                <p className="text-lg text-black mt-4 text-center">
                  SmartPaths employs a unique approach by using faculty-defined Model Q&A frameworks for grading student responses. This ensures consistent, transparent, and aligned grading standards while minimizing individual biases.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold text-center">
                  <span className="text-orange-500">NLP</span> for Flexibility
                </h3>
                <p className="text-lg text-gray-700 mt-4 text-center">
                  SmartPaths leverages Natural Language Processing (NLP) technology to offer unparalleled flexibility in grading. Our NLP-based system understands diverse student responses, capturing the essence of their answers regardless of variations in structure or language.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold text-center">
                  <span className="text-orange-500">Detailed</span> Analytics
                </h3>
                <p className="text-lg text-gray-700 mt-4 text-center">
                  Our platform provides actionable insights into each students strengths, weaknesses, and areas for improvement, enabling personalized learning paths and better academic outcomes.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold text-center">
                  <span className="text-orange-500">Faculty</span> Engagement
                </h3>
                <p className="text-lg text-gray-700 mt-4 text-center">
                  SmartPaths empowers faculty with in-depth analytics on course engagement, helping them design more interactive and effective teaching strategies.
                </p>
              </div>
            </div>
          </div>

          {/* Discover How it Works Section */}
          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold text-black">
              <span className="text-orange-500">Discover </span>
              <span className="text-black"> How it works</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <iframe
                width="900"
                height="506"
                src="https://www.youtube.com/embed/IAAzeD8xYAI"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-xl"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;