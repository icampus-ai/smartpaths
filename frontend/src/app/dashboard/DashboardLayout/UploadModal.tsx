"use client";

import React, { MouseEventHandler } from "react";
import { Check, X } from "lucide-react";

interface UploadModalProps {
  isUploadMenuOpen: boolean;
  handleCloseUploadMenu: () => void;
  handleModelQFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleModelQandAFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStudentResponsesFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleMouseDown: MouseEventHandler<HTMLDivElement>;
  handleMouseMove: MouseEventHandler<HTMLDivElement>;
  isModelQUploaded: boolean;
  isModelQandAUploaded: boolean;
  isStudentResponsesUploaded: boolean;
  error: string | null;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isUploadMenuOpen,
  handleCloseUploadMenu,
  handleModelQFileChange,
  handleModelQandAFileChange,
  handleStudentResponsesFileChange,
  handleDragOver,
  handleDrop,
  handleMouseDown,
  handleMouseMove,
  isModelQUploaded,
  isModelQandAUploaded,
  isStudentResponsesUploaded,
  error,
}) => {
  if (!isUploadMenuOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="bg-white h-auto w-80 border border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer relative z-10 mx-auto p-4 shadow-lg overflow-y-auto"
      >
        <div className="flex justify-center w-full p-2 bg-orange-500 text-white border-b border-orange-500">
          <button onClick={handleCloseUploadMenu} className="text-black hover:text-gray-200">
            <X className="text-lg text-black" />
          </button>
        </div>

        <div className="w-full py-4">
          <div className="flex flex-col items-center justify-center mb-4 mt-4">
            <p className="text-lg text-black">Drag and drop files here</p>
            <p className="text-sm text-black">or click to upload</p>
          </div>

          <div className="flex flex-col items-center">
            {/* Model Q Upload */}
            <label>
              <input type="file" onChange={handleModelQFileChange} className="w-full h-full opacity-0" />
              <div className="bg-[#2B2B2B] border-2 border-solid rounded-lg w-full h-12 flex items-center justify-center cursor-pointer text-white">
                Model Q
                {isModelQUploaded && <Check className="text-lg text-green-500 ml-2" />}
              </div>
            </label>

            {/* Model Q&A Upload */}
            <label className="mt-2">
              <input type="file" onChange={handleModelQandAFileChange} className="w-full h-full opacity-0" />
              <div className="bg-[#2B2B2B] border-2 border-solid rounded-lg w-full h-12 flex items-center justify-center cursor-pointer text-white">
                Model Q&A
                {isModelQandAUploaded && <Check className="text-lg text-green-500 ml-2" />}
              </div>
            </label>

            {/* Student Responses Upload */}
            <label className="mt-2">
              <input
                type="file"
                onChange={handleStudentResponsesFileChange}
                className="w-full h-full opacity-0"
                multiple // Allow multiple file uploads
              />
              <div className="bg-[#2B2B2B] border-2 border-solid rounded-lg w-full h-12 flex items-center justify-center cursor-pointer text-white">
                Student Responses
                {isStudentResponsesUploaded && <Check className="text-lg text-green-500 ml-2" />}
              </div>
            </label>
          </div>
        </div>

        {/* Show error only if not all files are uploaded */}
        {error && (!isModelQUploaded || !isModelQandAUploaded || !isStudentResponsesUploaded) && (
          <p className="text-red-500 text-sm mt-2 px-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default UploadModal;