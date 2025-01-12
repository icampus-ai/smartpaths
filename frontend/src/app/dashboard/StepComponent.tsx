"use client";

import React, { useState, useEffect } from "react";
import { Upload, Star, Check } from "lucide-react";

const StepComponent: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveStep((prevStep) => (prevStep === 3 ? 1 : prevStep + 1));
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const handleNumberClick = (step: number) => {
    setActiveStep(step);
  };

  return (
    <div className="relative flex flex-col items-center justify-center mt-12 mb-12">
      <div className="flex items-center justify-center space-x-8 md:space-x-12 lg:space-x-16">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-16 h-16 flex items-center justify-center text-4xl md:text-4xl lg:text-8xl font-extrabold cursor-pointer rounded-full border-4 ${
                activeStep === step
                  ? "bg-orange-500 text-white border-orange-500 animate-pulse"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => handleNumberClick(step)}
            >
              {step === 1 && <Upload className="w-10 h-10" />}
              {step === 2 && <Star className="w-10 h-10" />}
              {step === 3 && <Check className="w-10 h-10" />}
            </div>
            {activeStep === step && (
              <div className="text-base md:text-lg lg:text-xl font-medium text-gray-600 mt-2">
                {getStepText(step)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

function getStepText(step: number): string {
  switch (step) {
    case 1:
      return "Upload";
    case 2:
      return "Select Difficulty";
    case 3:
      return "Evaluate";
    default:
      return "";
  }
}

export default StepComponent;