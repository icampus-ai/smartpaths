"use client";

import React, { useState } from "react";

interface DifficultySelectorProps {
  isModelQUploaded: boolean;
  isStudentResponsesUploaded: boolean;
  isDifficultySelected: boolean;
  handleDifficultyClick: (difficulty: string) => void;
  handleEvaluateButtonClicked: () => void;
  handleBackToUpload: () => void;
  onClick: (difficulty: string) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  isModelQUploaded,
  isStudentResponsesUploaded,
  isDifficultySelected,
  handleDifficultyClick,
  handleEvaluateButtonClicked,
  handleBackToUpload,
  onClick,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showEvaluate, setShowEvaluate] = useState(isDifficultySelected);

  // Only show if both files are uploaded
  if (!isModelQUploaded || !isStudentResponsesUploaded) return null;

  const handleDifficultySelection = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    handleDifficultyClick(difficulty);
    setShowEvaluate(true);
    onClick(difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {showEvaluate ? (
        <div className="flex flex-col items-center">
          <button
            onClick={handleEvaluateButtonClicked}
            className="py-2 px-6 rounded-lg bg-black text-white shadow-md mb-4"
          >
            Evaluate
          </button>
          <button
            onClick={() => setShowEvaluate(false)}
            className="py-2 px-6 rounded-lg text-sm text-black shadow-md"
          >
            Back
          </button>
        </div>
      ) : (
        <div>
          <p className="text-lg text-black text-center">How do you want to evaluate?</p>
          <hr className="w-full border-1 border-black mt-2 mb-2" />
          <div className="w-full py-4">
            <div className="flex items-center justify-center space-x-4 mt-4">
              <button
                onClick={() => handleDifficultySelection("Easy")}
                className="py-2 px-6 rounded-lg bg-black text-white shadow-md flex items-center"
              >
                {selectedDifficulty === "Easy" && <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>}
                Easy
              </button>
              <button
                onClick={() => handleDifficultySelection("Medium")}
                className="py-2 px-6 rounded-lg bg-black text-white shadow-md flex items-center"
              >
                {selectedDifficulty === "Medium" && <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>}
                Medium
              </button>
              <button
                onClick={() => handleDifficultySelection("Hard")}
                className="py-2 px-6 rounded-lg bg-black text-white shadow-md flex items-center"
              >
                {selectedDifficulty === "Hard" && <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>}
                Hard
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleBackToUpload}
                className="py-2 px-6 rounded-lg text-sm text-center text-black shadow-md"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DifficultySelector;