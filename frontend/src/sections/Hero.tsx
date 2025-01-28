"use client";
import React, { useRef } from "react";
import { useRouter } from 'next/navigation';
import { motion, useScroll } from 'framer-motion';
import Image from 'next/image';
import ArrowIcon from '../assets/arrow-right.svg';
import student_1 from '../assets/aibrain.png';
import private_1 from '../assets/private_1.png';
import speed from '../assets/speed.png';
import fair from '../assets/fair.png';
import accuracyIcon from '../assets/accuracy.png';
import timeSavingsIcon from '../assets/time-savings.png';
import insightsIcon from '../assets/insights.png';
import biasReductionIcon from '../assets/bias-reduction.png';
import CheckIcon from "../assets/check.svg";
import ArrowRight from "../assets/arrow-right.svg";
import faculty from "../assets/faculty.png";
import { twMerge } from "tailwind-merge";

const pricingTiers = [
  {
    title: "Free",
    monthlyPrice: 0,
    buttonText: "Get started for free",
    popular: false,
    inverse: false,
    features: [
      "Up to 2 evaluators",
      "15 evaluations per month",
      "1GB storage",
      "Basic support",
    ],
  },
  {
    title: "Pay / Evaluation",
    monthlyPrice: 0.99,
    buttonText: "Sign up now",
    popular: true,
    inverse: true,
    features: [
      "Unlimited evaluations per month",
      "Unlimited evaluations per evaluator",
      "5GB storage per evaluator",
      "Integrations",
      "Advanced support",
    ],
  },
  {
    title: "Organization",
    buttonText: "Let's Evaluate Your Needs",
    popular: false,
    inverse: false,
    features: [
      "Unlimited evaluators",
      "Unlimited evaluations",
      "200GB storage",
      "Integrations",
      "Advanced analytics",
      "Export capabilities",
      "API access",
      "Advanced security features",
    ],
  },
];

export const Hero: React.FC = () => {
  const heroRef = useRef(null);
  const { scrollXProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push('/signup');
  };

  const handleLearnMoreClick = () => {
    router.push('/features');
  };

  const handleEvaluateNeedsClick = () => {
    router.push('/evaluationneeds');
  };

  const features = [
    {
      title: "Private & Secure",
      description: "AI agents dedicated to university servers, ensuring secure academic workflows and local data confidentiality.",
      image: private_1,
      bgColor: "bg-white",
      borderColor: "border-gray-300",
    },
    {
      title: "Speed & Accuracy",
      description: "Experience lightning-fast grading speeds and minimize human error with our advanced AI algorithms.",
      image: speed,
      bgColor: "bg-white",
      borderColor: "border-gray-300",
    },
    {
      title: "Objective & Fair",
      description: "Ensure consistent and objective assessment by eliminating bias inherent in human grading practices.",
      image: fair,
      bgColor: "bg-white",
      borderColor: "border-gray-300",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="bg-white pt-16 pb-24 md:pt-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="md:flex items-center">
            <div className="md:w-[478px]">
              <div className="btn btn-primary mb-4">Version 2.0 is here</div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-gray-700 text-transparent bg-clip-text mt-6">
                <span className="text-orange-500">Welcome</span>
                <span className="text-black"> to the Future of Education</span> 
              </h1>
              <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              Unleash a smarter way to grade! Our AI-powered grading system provides quicker, fairer, and more insightful evaluations, allowing educators to focus on what matters most—helping students succeed.
              </p>
              <div className="flex gap-4 items-center mt-8">
                <button className="btn btn-primary" onClick={handleSignUpClick}>Try for Free</button>
                <button className="btn btn-text flex items-center gap-2" onClick={handleLearnMoreClick}>
                  <span className="text-orange-500">Learn</span>
                  <span className="text-black">more</span>
                  <ArrowIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
              <motion.img
                src={student_1.src}
                alt="Cog Image"
                className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-0"
                animate={{
                  translateX: [-20, 20],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="relative bg-white py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-800 mt-2">
              <span className="text-orange-500">Why</span>
              <span className="text-black"> Choose</span>
              <span className="text-orange-500"> Smart</span>
              <span className="text-black">Paths?</span>
            </h2>
            <p className="text-xl text-black tracking-tight mt-5">
              Discover the features that make SmartPaths the best choice for evaluators.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card p-6 ${feature.bgColor} text-gray-800 rounded-lg shadow-lg border ${feature.borderColor} transform transition-transform hover:scale-105`}>
                <Image src={feature.image} alt="Feature Image" width={100} height={100} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-center">{feature.title}</h3>
                <p className="text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Feedback Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-5xl md:text-7xl font-bold tracking-tighter text-gray-800 mt-2">
              <span className="text-orange-500">Our</span>
              <span className="text-black"> Exclusive Premiere Feature</span>
            </h2>
            <p className="section-description text-2xl text-black tracking-tight mt-5">
              Evaluate and Elevate!
            </p>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="metric-card p-6 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105">
                <Image src={accuracyIcon} alt="Accuracy Icon" width={100} height={100} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">Accuracy Rate</h3>
                <p className="text-gray-800 text-4xl font-bold text-center">98%</p>
              </div>
              <div className="metric-card p-6 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105">
                <Image src={timeSavingsIcon} alt="Time Savings Icon" width={100} height={100} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">Time Savings</h3>
                <p className="text-gray-800 text-4xl font-bold text-center">75%</p>
              </div>
              <div className="metric-card p-6 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105">
                <Image src={insightsIcon} alt="Insights Icon" width={100} height={100} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">Detailed Insights</h3>
                <p className="text-gray-800 text-4xl font-bold text-center">85%</p>
              </div>
              <div className="metric-card p-6 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105">
                <Image src={biasReductionIcon} alt="Bias Reduction Icon" width={100} height={100} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">Bias Reduction</h3>
                <p className="text-gray-800 text-4xl font-bold text-center">90%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-14 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black">
              <span className="text-orange-500">Affordable</span>
              <span className="text-black"> Plans for Every Need</span>
            </h2>
            <p className="text-xl text-black mt-5">
              Free forever. Upgrade for unlimited tasks, better security, and
              exclusive features.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            {pricingTiers.map(
              ({ title, monthlyPrice, buttonText, popular, inverse, features }, index) => (
                <div
                  key={index}
                  className={twMerge(
                    "p-8 rounded-3xl shadow-lg transform transition-transform hover:scale-105 max-w-xs w-full",
                    inverse
                      ? "bg-gray-900 text-white border border-gray-700"
                      : "bg-white text-black border border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <h3
                      className={twMerge(
                        "text-lg font-bold",
                        inverse ? "text-gray-300" : "text-gray-600"
                      )}
                    >
                      {title}
                    </h3>
                    {popular && (
                      <div className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow">
                        Popular
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <div className="flex items-baseline">
                      {monthlyPrice !== undefined ? (
                        <>
                          <span className="text-4xl font-bold">
                            {monthlyPrice === 0 ? "$0" : `$${monthlyPrice}`}
                          </span>
                          <span className="ml-2 text-gray-500 text-sm">/evaluation</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold">Contact Us</span>
                      )}
                    </div>
                  </div>
                  <button
                    className={twMerge(
                      "w-full mt-6 py-2 px-4 rounded-lg font-semibold shadow-md transition-colors duration-300",
                      inverse
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-blue-700"
                    )}
                    onClick={
                      title === "Free"
                        ? handleSignUpClick
                        : title === "Pay / Evaluation"
                        ? handleSignUpClick
                        : title === "Business"
                        ? handleEvaluateNeedsClick
                        : undefined
                    }
                  >
                    {buttonText}
                  </button>
                  <ul className="mt-8 space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                        <span
                          className={twMerge(
                            "text-sm",
                            inverse ? "text-gray-300" : "text-gray-600"
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative bg-white py-40 overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Heading Section */}
          <div className="relative text-center mb-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-800 mt-2">
              <span className="text-orange-500">Ready</span>
              <span className="text-black"> to Get Started? </span>
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Sign up for <span className="text-orange-500 font-bold">Smart</span><span>Paths</span> today and streamline your evaluation process like never before.
            </p>

            {/* Floating Hand Animation */}
            <motion.div
              className="absolute -right-[150px] -top-[80px] hidden md:block"
              animate={{
                translateY: [-20, 20],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              <Image src={faculty} alt="Hand Image" width={300} height={300} />
            </motion.div>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col md:flex-row gap-4 mt-10 justify-center">
            {/* Primary Button */}
            <button
              className="w-full md:w-auto bg-black text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform"
              onClick={handleSignUpClick}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [0.8, 1.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          ></motion.div>
          <motion.div
            animate={{
              scale: [0.8, 1.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          ></motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;