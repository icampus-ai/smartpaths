"use client";

import React, { useState } from "react";
import Sidebar from "../Sidebar";
import StepComponent from "../StepComponent";
import UploadModal from "./UploadModal";
import FilePreviews from "./FilePreviews";
import DifficultySelector from "./DifficultySelector";

const DashboardLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [modelQFile, setModelQFile] = useState<File | null>(null);
  const [modelQFileUrl, setModelQFileUrl] = useState<string | null>(null);
  const [isModelQUploaded, setIsModelQUploaded] = useState(false);
  const [studentResponsesFile, setStudentResponsesFile] = useState<File | null>(null);
  const [studentResponsesFileUrl, setStudentResponsesFileUrl] = useState<string | null>(null);
  const [isStudentResponsesUploaded, setIsStudentResponsesUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [isDifficultySelected, setIsDifficultySelected] = useState(false);
  const [evaluationData, setEvaluationData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "Upload") {
      setIsUploadMenuOpen(true);
    } else {
      setIsUploadMenuOpen(false);
    }
  };

  const handleModelQFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setModelQFile(file);
      setModelQFileUrl(fileUrl);
      setIsModelQUploaded(true);
      checkUploadStatus(true, isStudentResponsesUploaded);
    }
  };

  const handleStudentResponsesFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setStudentResponsesFile(file);
      setStudentResponsesFileUrl(fileUrl);
      setIsStudentResponsesUploaded(true);
      checkUploadStatus(isModelQUploaded, true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      const files = event.dataTransfer.items;
      for (let i = 0; i < files.length; i++) {
        const file = files[i].getAsFile();
        if (file) {
          const fileUrl = URL.createObjectURL(file);
          if (i === 0) {
            setModelQFile(file);
            setModelQFileUrl(fileUrl);
            setIsModelQUploaded(true);
          } else if (i === 1) {
            setStudentResponsesFile(file);
            setStudentResponsesFileUrl(fileUrl);
            setIsStudentResponsesUploaded(true);
          }
        }
      }
      checkUploadStatus(true, true);
    }
  };

  const checkUploadStatus = (modelUploaded: boolean, studentUploaded: boolean) => {
    if (modelUploaded && studentUploaded) {
      setIsUploadMenuOpen(false);
      setError(null);
    } else if (modelUploaded && !studentUploaded) {
      setError("Please upload Student Responses file");
    } else if (!modelUploaded && studentUploaded) {
      setError("Please upload Model Q&A file");
    } else if (!modelUploaded && !studentUploaded) {
      setError("Please upload both Model Q&A and Student Responses files");
    }
  };

  const handleCloseUploadMenu = () => {
    setIsUploadMenuOpen(false);
  };

  const handleDifficultyClick = async (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setIsDifficultySelected(true);
  };

  const handleEvaluateButtonClicked = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (modelQFile) {
        formData.append("modelQuestionAnswer", modelQFile);
      }
      if (studentResponsesFile) {
        formData.append("studentAnswers", studentResponsesFile);
      }
      if (selectedDifficulty) {
        formData.append("difficultyLevel", selectedDifficulty);
      }

      const response = await fetch("http://localhost:8000/api/evaluate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate files");
      }

      const data = await response.json();
      setEvaluationData(JSON.stringify(data));

      console.log("Files evaluated successfully");
    } catch (error) {
      console.error("Error evaluating files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUpload = () => {
    setIsModelQUploaded(false);
    setIsStudentResponsesUploaded(false);
    setSelectedDifficulty(null);
    setIsDifficultySelected(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <main className={`flex-grow ${isSidebarExpanded ? "ml-60" : "ml-16"} flex flex-col min-h-screen bg-white p-4`}>
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-7xl text-black font-bold">
            <span className="text-orange-500">Smart</span>
            <span className="text-black">Paths</span>
          </h1>
          <p className="text-2xl text-black mt-4">Simplify. Systemize. Succeed.</p>
          <hr className="w-full border-1 border-black mt-4 mb-4" />
          <div className="w-full bg-black py-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={() => handleMenuClick("Upload")}
                  className={`text-lg py-2 px-6 rounded-lg ${
                    activeMenu === "Upload" ? "border border-black" : "text-white hover:text-black hover:bg-gray-100"
                  }`}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
          <hr className="w-full border-1 border-black mt-4 mb-8" />
          {modelQFileUrl || studentResponsesFileUrl ? (
            <div className="flex flex-col items-center justify-center mb-4">
              <DifficultySelector
                isModelQUploaded={isModelQUploaded}
                isStudentResponsesUploaded={isStudentResponsesUploaded}
                isDifficultySelected={isDifficultySelected}
                handleDifficultyClick={handleDifficultyClick}
                handleEvaluateButtonClicked={handleEvaluateButtonClicked}
                handleBackToUpload={handleBackToUpload}
              />
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-7xl text-black mt-4">Evaluating...</p>
                  <div className="loader mt-4 animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <FilePreviews
                  modelQFileUrl={modelQFileUrl}
                  studentResponsesFileUrl={studentResponsesFileUrl}
                  evaluationData={evaluationData} // Pass evaluationData to FilePreviews
                />
              )}
            </div>
          ) : (
            <div>
              <p className="text-3xl text-black text-center mb-2">
                <span className="text-orange-500">Evaluate</span>
                <span className="text-black"> in 3 Simple Steps </span>
              </p>
              <StepComponent />
            </div>
          )}
          {isUploadMenuOpen && (
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 ${
                isSidebarExpanded ? "left-64" : "left-20"
              }`}
            >
              <UploadModal
                isUploadMenuOpen={isUploadMenuOpen}
                handleCloseUploadMenu={handleCloseUploadMenu}
                handleModelQFileChange={handleModelQFileChange}
                handleStudentResponsesFileChange={handleStudentResponsesFileChange}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                isModelQUploaded={isModelQUploaded}
                isStudentResponsesUploaded={isStudentResponsesUploaded}
                error={error}
                handleMouseDown={() => {}}
                handleMouseMove={() => {}}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;