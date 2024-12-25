import React from 'react';
import happyfeedbackImage from '../assets/happyfeedback.png';
import Image from 'next/image';

export const ProductShowcase = () => {
  const features = [
    {
      title: "Private & Secure",
      description: "AI agents dedicated to university servers, ensuring secure academic workflows and local data confidentiality.",
      image: happyfeedbackImage,
      bgColor: "bg-gradient-to-b from-gray-800 to-white",
      borderColor: "border-gray-900",
    },
    {
      title: "Speed & Accuracy",
      description: "Experience lightning-fast grading speeds and minimize human error with our advanced AI algorithms.",
      image: happyfeedbackImage,
      bgColor: "bg-gradient-to-b from-gray-800 to-white",
      borderColor: "border-gray-800",
    },
    {
      title: "Objective & Fair",
      description: "Ensure consistent and objective assessment by eliminating bias inherent in human grading practices.",
      image: happyfeedbackImage,
      bgColor: "bg-gradient-to-b from-gray-800 to-white",
      borderColor: "border-gray-700",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-800 to-white py-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-gray-700 text-transparent bg-clip-text mt-2">
            Why Choose 
            <span className="text-orange-500"> Smart</span>
            <span className="text-transparent">Paths?</span>
          </h2>
          <p className="text-xl text-[#010D3E] tracking-tight mt-5">
            Discover the features that make SmartPaths the best choice for evaluators.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card p-6 ${feature.bgColor} text-white rounded-lg shadow-[0_7px_14px_#EAEAEA] border ${feature.borderColor} transform transition-transform hover:scale-105`}>
              <Image src={feature.image} alt="Feature Image" width={100} height={100} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-center text-black">{feature.title}</h3>
              <p className="text-black text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};