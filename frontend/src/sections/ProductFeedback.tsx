import React from 'react';
import Image from 'next/image';
import accuracyIcon from '../assets/accuracy.png';
import timeSavingsIcon from '../assets/time-savings.png';
import insightsIcon from '../assets/insights.png';
import biasReductionIcon from '../assets/bias-reduction.png';

export const ProductFeedback = () => {
  return (
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
  );
};