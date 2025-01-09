"use client";

import React, { useState, useEffect } from "react";

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
              className={`text-4xl md:text-4xl lg:text-8xl font-extrabold cursor-pointer ${
                activeStep === step ? "text-orange-500 animate-pulse" : "text-black"
              }`}
              onClick={() => handleNumberClick(step)}
            >
              {step}
            </div>
            {activeStep === step && (
              <div className="text-base md:text-lg lg:text-xl font-medium text-black mt-2">
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