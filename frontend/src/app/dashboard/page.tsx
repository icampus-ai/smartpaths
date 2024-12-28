"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaChartBar,
  FaUsers,
  FaEnvelope,
  FaBriefcase,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaUpload,
  FaFileAlt,
  FaFilePdf,
  FaCheckCircle,
} from "react-icons/fa";
import Image from "next/image";
import bookImage from "../../assets/abstract_17.png";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { uploadFileToBackend } from "../../services/fileUploadService"; // Import the service function

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  onFileUpload: (fileUrl: string, fileType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  toggleSidebar,
  onFileUpload,
}) => {
  const router = useRouter();
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState({
    modelQ: false,
    modelQA: false,
    responses: false,
    additionalFile: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFileType, setCurrentFileType] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const toggleUploadMenu = () => {
    setIsUploadMenuOpen(!isUploadMenuOpen);
  };

  const handleFileUploadClick = (fileType: string) => {
    setCurrentFileType(fileType);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && currentFileType) {
      const fileUrl = URL.createObjectURL(files[0]);
      onFileUpload(fileUrl, currentFileType);
      setUploadSuccess((prevState) => ({
        ...prevState,
        [currentFileType]: true,
      }));

      // Call the service function to upload the file to the backend
      try {
        await uploadFileToBackend(fileUrl, currentFileType);
        console.log('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleLogout = () => {
    router.push('/login'); // Redirect to the login page
  };

  return (
    <aside
      className={`bg-gradient-to-b from-gray-800 to-gray-900 text-gray-400 ${
        isExpanded ? "w-60" : "w-16"
      } h-screen fixed flex flex-col transition-all duration-300 shadow-xl`}
    >
      <div className="p-4 flex items-center justify-between">
        <h1
          className={`text-2xl text-white font-bold ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          <span className="text-orange-500">Smart</span>
          <span className="text-white">Paths</span>
        </h1>
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <FaBars />
        </button>
      </div>
      <nav className="flex-grow space-y-2"> {/* Adjusted spacing */}
        <button
          onClick={() => handleNavigation("/")}
          className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
        >
          <FaHome />
          <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>Home</span>
        </button>
        <button
          onClick={() => handleNavigation("/mocks")}
          className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
        >
          <FaUsers />
          <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>
            Templates
          </span>
        </button>
        <button
          onClick={toggleUploadMenu}
          className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
        >
          <FaUpload />
          <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>
            Upload
          </span>
        </button>
        {isUploadMenuOpen && (
          <div className="ml-4 space-y-2">
            <button
              onClick={() => handleFileUploadClick("modelQ")}
              className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <FaFileAlt />
              <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>
                Model Q
              </span>
              {uploadSuccess.modelQ && <FaCheckCircle className="text-green-500 ml-2" />}
            </button>
            <button
              onClick={() => handleFileUploadClick("modelQA")}
              className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <FaFileAlt />
              <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>
                Model Q&A
              </span>
              {uploadSuccess.modelQA && <FaCheckCircle className="text-green-500 ml-2" />}
            </button>
            <button
              onClick={() => handleFileUploadClick("responses")}
              className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <FaFilePdf />
              <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>
                Responses
              </span>
              {uploadSuccess.responses && <FaCheckCircle className="text-green-500 ml-2" />}
            </button>
            <button
              onClick={() => handleFileUploadClick("additionalFile")}
              className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <FaFilePdf />
              <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>
                Additional File
              </span>
              {uploadSuccess.additionalFile && <FaCheckCircle className="text-green-500 ml-2" />}
            </button>
          </div>
        )}
        <button
          onClick={() => handleNavigation("/analytics")}
          className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
        >
          <FaChartBar />
          <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>
            Analytics
          </span>
        </button>
        <button
          onClick={() => handleNavigation("/reports")}
          className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
        >
          <FaEnvelope />
          <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>
            Reports
          </span>
        </button>
        <button
          onClick={() => handleNavigation("/help")}
          className="text-white flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
        >
          <FaQuestionCircle />
          <span className={`${isExpanded ? "block" : "hidden"} ml-3`}>
            Help Center
          </span>
        </button>
      </nav>
      <div className="px-4 py-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center bg-gray-800 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200"
        >
          <FaSignOutAlt className="mr-3" />
          <span className={`${isExpanded ? "block" : "hidden"}`}>Logout</span>
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".txt,application/pdf"
        onChange={handleFileChange}
      />
    </aside>
  );
};

const BusinessOverview = ({ fileUrl, fileType }: { fileUrl: string | null, fileType: string | null }) => {
  const [showEvaluationOptions, setShowEvaluationOptions] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleEvaluateClick = (level: string) => {
    setShowEvaluationOptions(true);
  };

  const handleFileUploadSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-white p-6">
      <div className="flex w-full">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center items-start ml-20">
          <h1 className="text-4xl font-bold text-gray-800 animate-typing text-center">Evaluate with me!</h1>
          <p className="text-gray-800 mt-4 text-center ml-12">Simplify. Systemize. Succeed.</p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowEvaluationOptions(true)}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-6 rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 ml-24"
            >
              Evaluate
            </button>
          </div>

          {showEvaluationOptions && (
            <div className="mt-6 flex gap-4 justify-center">
              <button
                className="flex items-center border border-gray-500 text-gray-700 py-1 px-6 rounded-full relative transition-all hover:bg-gray-200"
                onClick={() => { handleEvaluateClick('Easy'); setSelectedDifficulty('Easy'); }}
              >
                <span className="font-bold text-lg">Easy</span>
                {selectedDifficulty === 'Easy' && (
                  <div className="bg-green-500 w-2 h-2 rounded-full ml-2" />
                )}
              </button>
              <button
                className="flex items-center border border-gray-500 text-gray-700 py-1 px-6 rounded-full relative transition-all hover:bg-gray-200"
                onClick={() => { handleEvaluateClick('Medium'); setSelectedDifficulty('Medium'); }}
              >
                <span className="font-bold text-lg">Medium</span>
                {selectedDifficulty === 'Medium' && (
                  <div className="bg-green-500 w-2 h-2 rounded-full ml-2" />
                )}
              </button>
              <button
                className="flex items-center border border-gray-500 text-gray-700 py-1 px-6 rounded-full relative transition-all hover:bg-gray-200"
                onClick={() => { handleEvaluateClick('Hard'); setSelectedDifficulty('Hard'); }}
              >
                <span className="font-bold text-lg">Hard</span>
                {selectedDifficulty === 'Hard' && (
                  <div className="bg-green-500 w-2 h-2 rounded-full ml-2" />
                )}
              </button>
            </div>
          )}

          {showSuccessMessage && (
            <p className="text-green-500 mt-4 text-center">File uploaded successfully!</p>
          )}
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex flex-col items-center">
          <div className="mt-6 relative w-full max-w-4xl mr-20">
            {fileUrl ? (
              <div>
                <h2 className="text-lg font-semibold mb-2">File Preview</h2>
                {fileUrl.endsWith(".pdf") ? (
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                    <Viewer fileUrl={fileUrl} />
                  </Worker>
                ) : (
                  <iframe
                    src={fileUrl}
                    title="File Preview"
                    className="w-full h-96 rounded-lg"
                  ></iframe>
                )}
                <p className="text-green-500 mt-4 text-center">
                  {fileType} uploaded successfully!
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Image
                  src={bookImage}
                  alt="No File Uploaded"
                  width={400}
                  height={400}
                  className="mx-auto"
                />
                <p className="text-gray-500 mt-4">No file uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const handleFileUploadSuccess = () => {
    console.log('File uploaded successfully');
  };
  
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleFileUpload = (url: string, type: string) => {
    setFileUrl(url);
    setFileType(type);
    handleFileUploadSuccess();
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        onFileUpload={handleFileUpload}
      />
      <main
        className={`flex-grow ${
          isSidebarExpanded ? "ml-60" : "ml-16"
        } bg-white flex flex-col min-h-screen`}
      >
        <div className="p-6 flex-grow">
          <BusinessOverview fileUrl={fileUrl} fileType={fileType} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;