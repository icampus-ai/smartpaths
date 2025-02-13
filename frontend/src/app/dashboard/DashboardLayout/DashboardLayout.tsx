"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "../Sidebar";
import StepComponent from "../StepComponent";
import UploadModal from "./UploadModal";
import FilePreviews from "./FilePreviews";
import ProfileModal from "../ProfileModal"; // Import ProfileModal

const DashboardLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [modelQFile, setModelQFile] = useState<File | null>(null);
  const [modelQFileUrl, setModelQFileUrl] = useState<string | null>(null);
  const [isModelQUploaded, setIsModelQUploaded] = useState(false);
  const [modelQandAFile, setModelQandAFile] = useState<File | null>(null);
  const [modelQandAFileUrl, setModelQandAFileUrl] = useState<string | null>(null);
  const [isModelQandAUploaded, setIsModelQandAUploaded] = useState(false);
  const [studentResponsesFiles, setStudentResponsesFiles] = useState<File[]>([]);
  const [studentResponsesFileUrls, setStudentResponsesFileUrls] = useState<string[]>([]);
  const [isStudentResponsesUploaded, setIsStudentResponsesUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [isDifficultySelected, setIsDifficultySelected] = useState(false);
  const [evaluationData, setEvaluationData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluationCompleted, setIsEvaluationCompleted] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State for Profile Modal

  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleModelQFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setModelQFile(file);
      setModelQFileUrl(fileUrl);
      setIsModelQUploaded(true);
      checkUploadStatus(true, isModelQandAUploaded, isStudentResponsesUploaded);
    }
  };

  const handleModelQandAFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setModelQandAFile(file);
      setModelQandAFileUrl(fileUrl);
      setIsModelQandAUploaded(true);
      checkUploadStatus(isModelQUploaded, true, isStudentResponsesUploaded);
    }
  };

  const handleStudentResponsesFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const fileUrls = files.map(file => URL.createObjectURL(file));
      setStudentResponsesFiles(files);
      setStudentResponsesFileUrls(fileUrls);
      setIsStudentResponsesUploaded(true);
      checkUploadStatus(isModelQUploaded, isModelQandAUploaded, true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      const files = Array.from(event.dataTransfer.items).map(item => item.getAsFile()).filter(file => file !== null) as File[];
      const fileUrls = files.map(file => URL.createObjectURL(file));
      setStudentResponsesFiles(files);
      setStudentResponsesFileUrls(fileUrls);
      setIsStudentResponsesUploaded(true);
      checkUploadStatus(isModelQUploaded, isModelQandAUploaded, true);
    }
  };

  const checkUploadStatus = (modelUploaded: boolean, modelQandAUploaded: boolean, studentUploaded: boolean) => {
    if (modelUploaded && modelQandAUploaded && studentUploaded) {
      setIsUploadMenuOpen(false);
      setError(null);
    } else if (modelUploaded && modelQandAUploaded && !studentUploaded) {
      setError("Please upload Student Responses file");
    } else if (modelUploaded && !modelQandAUploaded && studentUploaded) {
      setError("Please upload Model Q&A file");
    } else if (!modelUploaded && modelQandAUploaded && studentUploaded) {
      setError("Please upload Model Q file");
    } else if (!modelUploaded && !modelQandAUploaded && studentUploaded) {
      setError("Please upload Model Q and Model Q&A files");
    } else if (!modelUploaded && modelQandAUploaded && !studentUploaded) {
      setError("Please upload Model Q and Student Responses files");
    } else if (modelUploaded && !modelQandAUploaded && !studentUploaded) {
      setError("Please upload Model Q&A and Student Responses files");
    } else if (!modelUploaded && !modelQandAUploaded && !studentUploaded) {
      setError("Please upload Model Q, Model Q&A, and Student Responses files");
    }
  };

  const handleCloseUploadMenu = () => {
    setIsUploadMenuOpen(false);
  };

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setIsDifficultySelected(true);
  };

  const handleEvaluateButtonClicked = async () => {
    if (!modelQFile || !modelQandAFile || studentResponsesFiles.length === 0 || !selectedDifficulty) {
      setError("Please make sure all files are uploaded and difficulty is selected.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("modelQuestion", modelQFile);
      formData.append("modelQuestionAnswer", modelQandAFile);
      studentResponsesFiles.forEach(file => formData.append("studentAnswers", file));
      formData.append("difficultyLevel", selectedDifficulty);

      const response = await fetch("http://localhost:8000/api/evaluate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate files");
      }

      const data = await response.json();
      setEvaluationData(JSON.stringify(data));
      setIsEvaluationCompleted(true);

      console.log("Files evaluated successfully");
    } catch (error) {
      console.error("Error evaluating files:", error);
      setError("Error evaluating files. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUpload = () => {
    setIsModelQUploaded(false);
    setIsModelQandAUploaded(false);
    setIsStudentResponsesUploaded(false);
    setSelectedDifficulty(null);
    setIsDifficultySelected(false);
    setIsEvaluationCompleted(false);
  };

  const handleBackToHome = () => {
    router.push('/dashboard');
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} onProfileClick={handleProfileClick} />
      <main className={`flex-grow ${isSidebarExpanded ? "ml-60" : "ml-16"} flex flex-col min-h-screen bg-white p-4 overflow-auto`}>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-7xl text-black font-bold">
            <span className="text-orange-500">Smart</span>
            <span className="text-black">Paths</span>
          </h1>
          <p className="text-2xl text-black mt-4">Simplify. Systemize. Succeed.</p>
        </div>
        {modelQFileUrl && modelQandAFileUrl && studentResponsesFileUrls.length > 0 ? (
          <div className="flex flex-col flex-grow bg-white">
            <div className="flex flex-row flex-grow">
              <div className="flex flex-col items-center justify-center w-full bg-white overflow-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-7xl text-black mt-4">
                      <span className="text-orange-500">Hang on,</span>
                      <span className="text-black"> I am Evaluating...</span>
                    </p>
                    <div className="loader mt-4 animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : (
                  <FilePreviews
                    modelQFileUrl={modelQFileUrl}
                    studentResponsesFileUrl={studentResponsesFileUrls[0]} // Pass the first file URL for preview
                    evaluationData={evaluationData} // Pass evaluationData to FilePreviews
                    selectedDifficulty={selectedDifficulty}
                    handleDifficultySelection={handleDifficultyClick}
                    handleEvaluateButtonClicked={handleEvaluateButtonClicked}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow bg-white">
            {!isUploadMenuOpen ? (
              <>
                <div>
                  <p className="text-3xl text-black text-center mb-2">
                    <span className="text-orange-500">Evaluate</span>
                    <span className="text-black"> in 3 Simple Steps </span>
                  </p>
                  <StepComponent />
                </div>
                <div className="w-full flex items-center justify-center mt-8">
                  <button
                    onClick={() => setIsUploadMenuOpen(true)}
                    className="text-lg py-2 px-6 rounded-lg text-black hover:text-white hover:bg-[#2B2B2B]"
                  >
                    Start Uploading Files &nbsp; &#8594;
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full mt-64">
                <UploadModal
                  isUploadMenuOpen={isUploadMenuOpen}
                  handleCloseUploadMenu={handleCloseUploadMenu}
                  handleModelQFileChange={handleModelQFileChange}
                  handleModelQandAFileChange={handleModelQandAFileChange}
                  handleStudentResponsesFileChange={handleStudentResponsesFileChange}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  isModelQUploaded={isModelQUploaded}
                  isModelQandAUploaded={isModelQandAUploaded}
                  isStudentResponsesUploaded={isStudentResponsesUploaded}
                  error={error}
                  handleMouseDown={() => {}}
                  handleMouseMove={() => {}}
                />
              </div>
            )}
          </div>
        )}
      </main>
      {isProfileModalOpen && (
        <ProfileModal onClose={handleCloseProfileModal} />
      )}
    </div>
  );
};

export default DashboardLayout;