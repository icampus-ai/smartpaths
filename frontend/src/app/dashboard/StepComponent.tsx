"use client";

import React, { useState, useEffect } from "react";
import UploadModal from "./DashboardLayout/UploadModal";

const StepComponent: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModelQUploaded, setIsModelQUploaded] = useState(false);
  const [isStudentResponsesUploaded, setIsStudentResponsesUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isPopupOpen) {
        setActiveStep((prevStep) => (prevStep === 3 ? 1 : prevStep + 1));
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isPopupOpen]);

  const handleNumberClick = (step: number) => {
    if (step === 1) {
      setIsPopupOpen(true);
    }
  };

  const handleModelQFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIsModelQUploaded(true);
      checkUploadStatus(true, isStudentResponsesUploaded);
    }
  };

  const handleStudentResponsesFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIsStudentResponsesUploaded(true);
      checkUploadStatus(isModelQUploaded, true);
    }
  };

  const checkUploadStatus = (modelUploaded: boolean, studentUploaded: boolean) => {
    if (modelUploaded && studentUploaded) {
      setIsPopupOpen(false);
      setActiveStep(2);
    } else {
      setError("Please upload both files");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center mt-12 mb-12">
      <div className="flex items-center justify-center space-x-8 md:space-x-12 lg:space-x-16">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`text-2xl md:text-2xl lg:text-8xl font-extrabold cursor-pointer ${
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
      {isPopupOpen && (
        <div className="absolute top-0 left-20 mt-8 w-full flex justify-start">
          <div className="bg-white border border-gray-300 shadow-lg p-4 w-full max-w-lg">
            <UploadModal
              isUploadMenuOpen={isPopupOpen}
              handleCloseUploadMenu={() => setIsPopupOpen(false)}
              handleModelQFileChange={handleModelQFileChange}
              handleStudentResponsesFileChange={handleStudentResponsesFileChange}
              handleDragOver={() => {}}
              handleDrop={() => {}}
              handleMouseDown={() => {}}
              handleMouseMove={() => {}}
              isModelQUploaded={isModelQUploaded}
              isStudentResponsesUploaded={isStudentResponsesUploaded}
              error={error}
            />
          </div>
        </div>
      )}
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