import React, { useState } from 'react';

interface SemicircularGaugeProps {
  percentage: number;
}

const SemicircularGauge: React.FC<SemicircularGaugeProps> = ({ percentage }) => {
  const [currentPercentage, setCurrentPercentage] = useState(percentage);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 100 50">
            <path
              d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
              stroke="#d6d6d6"
              strokeWidth="10"
              fillOpacity="0"
            />
            <path
              d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
              stroke="#03A9F4"
              strokeWidth="10"
              strokeDasharray={currentPercentage + " " + (100 - currentPercentage)}
              fillOpacity="0"
            />
          </svg>
        </div>
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-blue-500">{currentPercentage}%</p>
      </div>
      <p className="text-blue-500 font-bold text-xl mt-4">Excellent!</p>
      <p className="text-gray-700 text-sm">{currentPercentage}% of students responded correctly.</p>
    </div>
  );
};

export default SemicircularGauge;