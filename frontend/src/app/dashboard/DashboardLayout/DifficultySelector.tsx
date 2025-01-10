"use client";

import React, { useState } from "react";

interface DifficultySelectorProps {
  isModelQUploaded: boolean;
  isStudentResponsesUploaded: boolean;
  isDifficultySelected: boolean;
  handleDifficultyClick: (difficulty: string) => void;
  handleEvaluateButtonClicked: () => void;
  handleBackToUpload: () => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  isModelQUploaded,
  isStudentResponsesUploaded,
  isDifficultySelected,
  handleDifficultyClick,
  handleEvaluateButtonClicked,
  handleBackToUpload,
  selectedDifficulty,
  setSelectedDifficulty,
}) => {
  const [showEvaluate, setShowEvaluate] = useState(isDifficultySelected);

  // Only show if both files are uploaded
  if (!isModelQUploaded || !isStudentResponsesUploaded) return null;

  const handleDifficultySelection = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    handleDifficultyClick(difficulty);
    setShowEvaluate(true);
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
              <select
                value={selectedDifficulty}
                onChange={(e) => handleDifficultySelection(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
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