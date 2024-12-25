"use client";

import React, { useState } from "react";
import { Header } from "../../sections/Header";
import Image from "next/image";
import evaluationImage from "../../assets/product-image.png"; // Ensure the image exists
import backgroundImage from "../../assets/abstract_8.png"; // Background image
import { StaticImageData } from "next/image";

const Features = () => {
  const [selectedCourse, setSelectedCourse] = useState<
    "Mathematics" | "Science" | "Economics"
  >("Mathematics");

  const courseResults: {
    [key in "Mathematics" | "Science" | "Economics"]: string;
  } = {
    Mathematics:
      "Results for Mathematics: Excellent performance with an average score of 85%.",
    Science:
      "Results for Science: Good performance with an average score of 78%.",
    Economics:
      "Results for Economics: Satisfactory performance with an average score of 70%.",
  };

  const courseImages: {
    [key in "Mathematics" | "Science" | "Economics"]: StaticImageData;
  } = {
    Mathematics: evaluationImage,
    Science: evaluationImage,
    Economics: evaluationImage,
  };

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
          <h1 className="text-4xl md:text-4xl font-extrabold bg-gradient-to-b from-black to-gray-700 text-transparent bg-clip-text text-center">
            <span className="text-orange-500">Our</span> Features
          </h1>
          <p className="text-lg text-gray-600 text-center mt-4">
            Discover the features that make <span className="text-orange-500">SmartPaths</span> the best choice for evaluators.
          </p>

          {/* Seamless Grading Section */}
          <div className="mt-16">
            <h2 className="text-4xl font-bold text-gray-900 text-center">
              <span className="text-orange-500">Seamless</span> Grading Experience
            </h2>
            <p className="text-lg text-gray-600 text-center mt-4">
              Empower educators to evaluate students efficiently with our AI-driven grading platform.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-4">
                <Image
                  src={evaluationImage}
                  alt="Seamless Grading Experience"
                  className="rounded-lg shadow-xl hover:scale-105 transition-transform"
                  width={500}
                  height={300}
                />
              </div>
              <div className="p-4">
                <ul className="list-disc text-lg text-gray-700 space-y-4 pl-6">
                  <li>Effortlessly upload student assignments and exams.</li>
                  <li>Leverage advanced AI algorithms for fair grading.</li>
                  <li>Access detailed insights and analytics for improvement.</li>
                  <li>Provide personalized feedback to students.</li>
                  <li>Track student progress and identify focus areas.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center">
              <span className="text-orange-500">Evaluation</span> Use Cases
            </h2>
            <p className="text-lg text-gray-600 text-center mt-4">
              Explore how our platform works across various subjects.
            </p>
            <div className="mt-12 text-center">
              <label
                htmlFor="course-select"
                className="text-lg text-gray-700 font-medium"
              >
                Select a Course:
              </label>
              <select
                id="course-select"
                className="mt-4 p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500"
                value={selectedCourse}
                onChange={(e) =>
                  setSelectedCourse(
                    e.target.value as "Mathematics" | "Science" | "Economics"
                  )
                }
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Economics">Economics</option>
              </select>
              <div className="mt-8 text-lg text-gray-700">
                <p className="font-semibold">{courseResults[selectedCourse]}</p>
              </div>
              <div className="mt-8 flex justify-center">
                <Image
                  src={courseImages[selectedCourse]}
                  alt={`${selectedCourse} Evaluation`}
                  className="rounded-lg shadow-lg hover:scale-105 transition-transform"
                  width={500}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
