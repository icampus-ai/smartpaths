"use client";
import React from "react";

interface UploadModalProps {
  isUploadMenuOpen: boolean;
  handleCloseUploadMenu: () => void;
  handleModelQandAFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStudentResponsesFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  isModelQandAUploaded: boolean;
  isStudentResponsesUploaded: boolean;
  error: string | null;
  handleMouseDown: () => void;
  handleMouseMove: () => void;
  handleSubmit: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isUploadMenuOpen,
  handleCloseUploadMenu,
  handleModelQandAFileChange,
  handleStudentResponsesFileChange,
  handleDragOver,
  handleDrop,
  isModelQandAUploaded,
  isStudentResponsesUploaded,
  error,
  handleMouseDown,
  handleMouseMove,
  handleSubmit,
}) => {
  if (!isUploadMenuOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50 transition-all">
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative transform transition-all duration-300 hover:scale-105"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <button
          onClick={handleCloseUploadMenu}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">
          Upload Files
        </h2>

        {/* Model Q&A File */}
        <div className="mb-6">
          <>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Model Q&A File:
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.jpg,.png"
              onChange={handleModelQandAFileChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </>
          {isModelQandAUploaded && (
            <p className="text-green-600 mt-2 text-sm">
              Model Q&A file uploaded successfully!
            </p>
          )}
        </div>

        {/* Student Responses File */}
        <div className="mb-6">
          <>
            <label className="block mb-2 text-lg font-medium text-gray-700">
              Student Responses File:
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.jpg,.png"
              multiple
              onChange={handleStudentResponsesFileChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </>
          {isStudentResponsesUploaded && (
            <p className="text-green-600 mt-2 text-sm">
              Student Responses file uploaded successfully!
            </p>
          )}
        </div>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadModal;