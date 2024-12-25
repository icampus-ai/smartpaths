import React from 'react';
import Image from 'next/image';
import accuracyIcon from '../assets/accuracy.png';
import timeSavingsIcon from '../assets/time-savings.png';
import insightsIcon from '../assets/insights.png';
import biasReductionIcon from '../assets/bias-reduction.png';

export const ProductFeedback = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-800 py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-gray-700 text-transparent bg-clip-text mt-2">
            Our Exclusive Premiere Feature
          </h2>
          <p className="section-description text-2xl text-[#010D3E] tracking-tight mt-5">
            Evaluate and Elevate !
          </p>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="metric-card p-6 bg-gradient-to-b from-white to-gray-800 rounded-lg shadow-[0_7px_14px_#EAEAEA] transform transition-transform hover:scale-105">
              <Image src={accuracyIcon} alt="Accuracy Icon" width={100} height={100} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-center text-white">Accuracy Rate</h3>
              <p className="text-white text-4xl font-bold text-center">98%</p>
            </div>
            <div className="metric-card p-6 bg-gradient-to-b from-white to-gray-800 rounded-lg shadow-[0_7px_14px_#EAEAEA] transform transition-transform hover:scale-105">
              <Image src={timeSavingsIcon} alt="Time Savings Icon" width={100} height={100} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-center text-white">Time Savings</h3>
              <p className="text-white text-gray-700 text-4xl font-bold text-center">75%</p>
            </div>
            <div className="metric-card p-6 bg-gradient-to-b from-white to-gray-800 rounded-lg shadow-[0_7px_14px_#EAEAEA] transform transition-transform hover:scale-105">
              <Image src={insightsIcon} alt="Insights Icon" width={100} height={100} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-center text-white">Detailed Insights</h3>
              <p className="text-white text-4xl font-bold text-center">85%</p>
            </div>
            <div className="metric-card p-6 bg-gradient-to-b from-white to-gray-800 rounded-lg shadow-[0_7px_14px_#EAEAEA] transform transition-transform hover:scale-105">
              <Image src={biasReductionIcon} alt="Bias Reduction Icon" width={100} height={100} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-center text-white">Bias Reduction</h3>
              <p className="text-white text-4xl font-bold text-center">90%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      </div>
    </section>
  );
};
