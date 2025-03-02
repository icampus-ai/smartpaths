"use client";
import React, { useState } from "react";

interface EvaluationResultsProps {
  evaluationData: string;
}

const EvaluationResults: React.FC<EvaluationResultsProps> = ({ evaluationData }) => {
  // Parse the evaluationData JSON from the backend.
  const decodedData = JSON.parse(evaluationData);
  const totalFiles = decodedData.files.length;
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // Decode the current file's base64 content.
  const decodedFileContent = atob(decodedData.files[currentFileIndex].file);

  const handlePrevious = () => {
    setCurrentFileIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : totalFiles - 1
    );
  };

  const handleNext = () => {
    setCurrentFileIndex((prevIndex) =>
      prevIndex < totalFiles - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevious}
          className="text-black hover:text-gray-700 bg-gray-200 rounded-full px-4 py-2 shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          &lt; Previous
        </button>
        <h2 className="text-xl font-bold text-center text-orange-600">
          File {currentFileIndex + 1} of {totalFiles}
        </h2>
        <button
          onClick={handleNext}
          className="text-black hover:text-gray-700 bg-gray-200 rounded-full px-4 py-2 shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Next &gt;
        </button>
      </div>
      <pre className="text-gray-700 whitespace-pre-wrap flex-grow overflow-auto bg-gray-100 p-4 rounded-lg shadow-inner">
        {decodedFileContent}
      </pre>
    </div>
  );
};

export default EvaluationResults;