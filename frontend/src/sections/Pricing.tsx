"use client";

import React from "react";
import CheckIcon from "../assets/check.svg";
import { twMerge } from "tailwind-merge";
import { useRouter } from 'next/navigation';

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
    monthlyPrice: 2.99,
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
    title: "Business",
    buttonText: "Let’s Evaluate Your Needs",
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

export const Pricing: React.FC = () => {
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push('/signup');
  };

  const handleEvaluateNeedsClick = () => {
    router.push('/evaluationneeds');
  };

  return (
    <section className="bg-gradient-to-b from-gray-800 to-white py-14 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-gray-400 text-transparent bg-clip-text">
            Pricing
          </h2>
          <p className="text-xl text-gray-600 mt-5">
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
                    ? "bg-gray-800 text-white border border-gray-700"
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
                        <span className="ml-2 text-gray-500 text-sm">/month</span>
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
                      : "bg-blue-600 text-white hover:bg-blue-700"
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
  );
};