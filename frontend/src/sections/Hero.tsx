"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import ArrowIcon from "../assets/arrow-right.svg";
import student_1 from "../assets/aibrain.png";
import private_1 from "../assets/private_1.png";
import speed from "../assets/speed.png";
import fair from "../assets/fair.png";
import accuracyIcon from "../assets/accuracy.png";
import timeSavingsIcon from "../assets/time-savings.png";
import insightsIcon from "../assets/insights.png";
import biasReductionIcon from "../assets/bias-reduction.png";
import CheckIcon from "../assets/check.svg";
import faculty from "../assets/faculty.png";
import { twMerge } from "tailwind-merge";

export const Hero: React.FC = () => {
  const heroRef = useRef(null);
  const { scrollXProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const router = useRouter();

  const handleSignUpClick = () => router.push("/signup");
  const handleLearnMoreClick = () => router.push("/features");

  return (
    <div>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="bg-white pt-16 pb-24 md:pt-20 md:pb-28 flex flex-col-reverse md:flex-row items-center text-center md:text-left"
      >
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
          {/* Left Text Section */}
          <div className="md:w-1/2">
            <div className="btn btn-primary mb-4">Version 2.0 is here</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mt-6">
              <span className="text-orange-500">Welcome</span>
              <span className="text-black"> to the Future of Education</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-800 tracking-tight mt-6">
              Experience a streamlined approach to administrative tasks,
              grading, research, and more—powered by our on-premise AI Agents.
              By automating repetitive tasks and delivering real-time insights,
              institutions can optimize their academic processes with greater
              efficiency and reliability.
            </p>
            <div className="flex flex-col md:flex-row gap-4 items-center mt-8">
              <button
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full md:w-auto"
                onClick={handleSignUpClick}
              >
                Try for Free
              </button>
              <button
                className="flex items-center gap-2 text-orange-500 text-lg font-medium hover:underline w-full md:w-auto"
                onClick={handleLearnMoreClick}
              >
                Learn more
                <ArrowIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="md:w-1/2 flex justify-center mt-12 md:mt-0">
            <motion.img
              src={student_1.src}
              alt="AI Brain"
              className="w-full max-w-xs md:max-w-md"
              animate={{
                translateY: [-10, 10],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="text-orange-500">Why</span>
            <span className="text-black"> Choose SmartPaths?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-800 mt-4">
            Discover the features that make SmartPaths the best choice for
            evaluators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[private_1, speed, fair].map((img, index) => (
              <div
                key={index}
                className="p-6 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-300 transform transition-transform hover:scale-105"
              >
                <Image
                  src={img}
                  alt="Feature"
                  width={100}
                  height={100}
                  className="mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold mb-2 text-center">
                  {["Private & Secure", "Speed & Accuracy", "Objective & Fair"][
                    index
                  ]}
                </h3>
                <p className="text-center">
                  {[
                    "AI agents dedicated to university servers, ensuring secure academic workflows and local data confidentiality.",
                    "Experience lightning-fast grading speeds and minimize human error with our advanced AI algorithms.",
                    "Ensure consistent and objective assessment by eliminating bias inherent in human grading practices.",
                  ][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-white py-32 text-center">
        <h2 className="text-4xl md:text-6xl font-bold">
          <span className="text-orange-500">Ready</span>
          <span className="text-black"> to Get Started?</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-800 mt-4">
          Sign up for <span className="text-orange-500 font-bold">Smart</span>
          Paths today and streamline your evaluation process like never before.
        </p>
        <button
          className="mt-8 bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-transform hover:scale-105"
          onClick={handleSignUpClick}
        >
          Sign Up
        </button>
      </section>
    </div>
  );
};

export default Hero;
