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
  FaSearch,
  FaChevronUp,
  FaCheckCircle,
} from "react-icons/fa";
import Image from 'next/image';
import bookImage from '../../assets/abstract_17.png'; // Import the book image
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Sidebar Component
interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  onFileUpload: (fileUrl: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar, onFileUpload }) => {
  const router = useRouter();
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [isAnalyticsMenuOpen, setIsAnalyticsMenuOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    // Perform any logout logic here, such as clearing tokens or user data
    router.push("/login");
  };

  const toggleUploadMenu = () => {
    setIsUploadMenuOpen(!isUploadMenuOpen);
  };

  const toggleAnalyticsMenu = () => {
    setIsAnalyticsMenuOpen(!isAnalyticsMenuOpen);
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      onFileUpload(fileUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000); // Hide the check mark after 3 seconds
    }
  };

  return (
    <aside className={`bg-gray-900 text-gray-400 ${isExpanded ? "w-48" : "w-16"} h-screen fixed flex flex-col transition-width duration-300`}>
      <div className="p-4 flex items-center justify-between">
        <h1 className={`text-2xl text-white font-bold ${isExpanded ? "block" : "hidden"}`}>
          <span className="text-orange-500">Smart</span>
          <span className="text-white">Paths</span>
        </h1>
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <FaBars />
        </button>
      </div>
      <nav className="flex-grow">
        <button onClick={() => handleNavigation('/')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaHome />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Home</span>
        </button>
        <button onClick={() => handleNavigation('/mocks')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaUsers />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Templates</span>
        </button>
        <button onClick={toggleUploadMenu} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaUpload />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Upload</span>
        </button>
        {isUploadMenuOpen && (
          <div className="ml-4">
            <button onClick={handleFileUploadClick} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
              <FaFileAlt />
              <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Model Q</span>
              {uploadSuccess && <FaCheckCircle className="text-green-500 ml-2" />}
            </button>
            <button onClick={handleFileUploadClick} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
              <FaFileAlt />
              <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Model Q&A</span>
              {uploadSuccess && <FaCheckCircle className="text-green-500 ml-2" />}
            </button>
            <button onClick={handleFileUploadClick} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
              <FaFilePdf />
              <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Responses</span>
              {uploadSuccess && <FaCheckCircle className="text-green-500 ml-2" />}
            </button>
          </div>
        )}
        <button onClick={toggleAnalyticsMenu} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaChartBar />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Analytics</span>
        </button>
        {isAnalyticsMenuOpen && (
          <div className="ml-4">
            <button onClick={() => handleNavigation('/analytics/evaluators')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
              <FaUsers />
              <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Evaluators</span>
            </button>
            <button onClick={() => handleNavigation('/analytics/students')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
              <FaUsers />
              <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Students</span>
            </button>
          </div>
        )}
        <button onClick={() => handleNavigation('/reports')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaEnvelope />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Reports</span>
        </button>
        <button onClick={() => handleNavigation('/upgrade')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaBriefcase />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Upgrade</span>
        </button>
        <button onClick={() => handleNavigation('/help')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaQuestionCircle />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Help Center</span>
        </button>
        <button onClick={() => handleNavigation('/settings')} className="text-white focus:outline-none px-4 py-2 hover:bg-gray-800 rounded-lg flex items-center cursor-pointer">
          <FaCog />
          <span className={`${isExpanded ? 'block' : 'hidden'} ml-3`}>Settings</span>
        </button>
      </nav>
      <div className="px-4 py-4 mt-auto">
        <button onClick={handleLogout} className="w-full flex items-center bg-gray-800 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700">
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

// Right Sidebar Component
import { FaMicrophone, FaPaperPlane, FaChevronDown, FaChevronLeft } from "react-icons/fa";

const RightSidebar: React.FC<{ isExpanded: boolean; toggleRightSidebar: () => void; }> = ({ isExpanded, toggleRightSidebar }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setIsDropdownOpen(false);
  };

  const handleSendAction = () => {
    alert(`Sending input to ${selectedModel}`);
  };

  return (
    <aside className={`bg-white text-gray-800 ${isExpanded ? "w-64" : "w-16"} h-screen fixed right-0 p-4 flex flex-col justify-between transition-width duration-300`}>
      <div>
        <button onClick={toggleRightSidebar} className="text-gray-600 focus:outline-none">
          <FaChevronLeft />
        </button>
        {isExpanded && (
          <>
            {/* User Info */}
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-4 text-center">It's all about you</h2>
              <div className="bg-gray-200 p-2 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-800 text-center">User</p>
                <p className="text-center">Dr. Prateek Shantharama</p>
                <p className="font-semibold text-green-700 text-sm text-center">Faculty</p>
              </div>
            </div>

            {/* Activity Section */}
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2 text-center">Activity</h2>
              <div className="bg-gray-200 p-2 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-800 text-center">Total Evaluations</p>
                <p className="font-semibold text-green-700 text-sm text-center">1</p>
                <p className="font-semibold text-green-700 text-sm text-center">Cost: $12.70</p>
                <p className="font-semibold text-red-700 text-center">Today</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search and Chat Section */}
      {isExpanded && (
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex flex-col">
          <h2
            className="text-lg font-bold mb-4 text-center cursor-pointer"
            onClick={toggleSearch}
          >
            Let's Talk & Evaluate
          </h2>
          <div className="relative flex flex-col">
            <textarea
              placeholder="Search..."
              className={`w-full text-lg rounded-lg bg-gray-100 text-gray-800 focus:outline-none transition-all duration-300 resize-none ${
                isSearchExpanded ? "h-[450px] p-4" : "h-10 p-2"
              }`}
              style={{
                boxSizing: "border-box",
              }}
            />
            {/* Controls at the Bottom */}
            <div className="flex items-center justify-between mt-2 p-2">
              {/* Microphone Button */}
              <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                <FaMicrophone size={20} />
              </button>

              {/* Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <span>{selectedModel}</span>
                  <FaChevronDown className="ml-2" />
                </button>
                {isDropdownOpen && (
                  <ul className="absolute bottom-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <li
                      onClick={() => handleModelSelect("llama 3.2")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      llama 3.2
                    </li>
                    <li
                      onClick={() => handleModelSelect("llama 3.3")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      llama 3.3
                    </li>
                    <li
                      onClick={() => handleModelSelect("Custom")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Custom
                    </li>
                  </ul>
                )}
              </div>

              {/* Arrow Button */}
              <button
                onClick={handleSendAction}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <FaPaperPlane size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

// BusinessOverview Component
const BusinessOverview = ({ fileUrl }: { fileUrl: string | null }) => {
  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <div className="flex-grow ml-6">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-2xl font-bold">Evaluate with me!</h1>
          <p className="text-gray-500 text-sm">Simplify. Systemize. Succeed.</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-green-200 text-black py-2 px-6 rounded-lg hover:bg-green-400">
            Generate
          </button>
        </div>

        {/* PDF/Text Preview Section */}
        <div className="mt-6 md:mt-0 md:h-[648px] md:flex-1 relative">
          {fileUrl ? (
            <>
              <h2 className="text-lg font-bold mb-2 text-center">File Preview</h2>
              <div className="h-[600px] w-[800px] overflow-y-scroll bg-gray-100 p-2 rounded shadow-lg">
                {fileUrl.endsWith(".pdf") ? (
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                    <Viewer fileUrl={fileUrl} />
                  </Worker>
                ) : (
                  <iframe
                    src={fileUrl}
                    title="Text Preview"
                    width="100%"
                    height="100%"
                    className="rounded"
                  />
                )}
              </div>
            </>
          ) : (
            // Centered Image with Text Below
            <div className="flex flex-col items-center justify-center h-[600px]">
              <Image
                src={bookImage}
                alt="Book"
                width={500}
                height={500}
                className="mb-6"
              />
              <p className="text-gray-500 text-lg text-center">
                No file uploaded yet. Upload to see a preview!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// DashboardLayout Component
const DashboardLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarExpanded(!isRightSidebarExpanded);
  };

  const handleFileUpload = (url: string) => {
    setFileUrl(url);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} onFileUpload={handleFileUpload} />
      <main className={`flex-grow bg-white ${isSidebarExpanded ? 'ml-48' : 'ml-16'} ${isRightSidebarExpanded ? 'mr-64' : 'mr-16'} flex flex-col min-h-screen`}>
        <div className="p-6 flex-grow">
          <BusinessOverview fileUrl={fileUrl} />
        </div>
      </main>
      <RightSidebar isExpanded={isRightSidebarExpanded} toggleRightSidebar={toggleRightSidebar} />
    </div>
  );
};

export default DashboardLayout;