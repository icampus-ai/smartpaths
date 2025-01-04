"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaQuestionCircle, FaCog, FaArrowLeft, FaBars } from "react-icons/fa";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import "@react-pdf-viewer/core/lib/styles/index.css";

// Set the worker URL for pdfjs-dist
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

// Sidebar Component
interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => router.push(path);

  return (
    <aside
      className={`bg-gradient-to-r from-indigo-800 to-blue-700 text-gray-200 ${
        isExpanded ? "w-60" : "w-16"
      } h-screen fixed flex flex-col transition-all duration-300 shadow-lg`}
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isExpanded ? "block" : "hidden"}`}>
          Smart<span className="text-orange-400">Paths</span>
        </h1>
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none transition-transform transform hover:rotate-180"
        >
          <FaBars />
        </button>
      </div>
      <nav className="flex-grow space-y-4">
        {[
          { icon: FaHome, label: "Home", path: "/" },
          { icon: FaQuestionCircle, label: "Help Center", path: "/help" },
          { icon: FaCog, label: "Settings", path: "/settings" },
        ].map(({ icon: Icon, label, path }, idx) => (
          <button
            key={idx}
            onClick={() => handleNavigation(path)}
            className="text-white w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-600 rounded-md transition"
          >
            <Icon size={20} />
            <span className={`${isExpanded ? "block" : "hidden"}`}>{label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4">
        <button
          onClick={() => router.back()}
          className="w-full flex items-center bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-500"
        >
          <FaArrowLeft className="mr-3" />
          <span className={`${isExpanded ? "block" : "hidden"}`}>Back</span>
        </button>
      </div>
    </aside>
  );
};

// Main Page Component
const ReportsPage = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [hoveredQuestion, setHoveredQuestion] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<HoverPosition | null>(null);
  const questionRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {}

  interface TextItem {
    str: string;
  }

  const handleFileUpload = async (e: FileUploadEvent): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(fileUrl);

      // Extract text from PDF
      const pdf = await getDocument(fileUrl).promise;
      const extractedQuestions: string[] = [];
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const textContent = await page.getTextContent();
        textContent.items.forEach((item) => {
          if ('str' in item) {
            const text = item.str.trim();
            if (/^\d+\./.test(text)) extractedQuestions.push(text);
          }
        });
      }
      setQuestions(extractedQuestions);
    }
  };

  interface HoverPosition {
    x: number;
    y: number;
  }

  const handleQuestionHover = (index: number): void => {
    const rect = questionRefs.current[index]?.getBoundingClientRect();
    if (rect) {
      setHoverPosition({ x: rect.left, y: rect.top });
      setHoveredQuestion(questions[index]);
    }
  };

  const handleQuestionLeave = () => {
    setHoverPosition(null);
    setHoveredQuestion(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <main className={`flex-grow ${isSidebarExpanded ? "ml-60" : "ml-16"} p-6`}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Reports</h1>
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <label className="font-semibold text-gray-700">
              Upload a PDF File:
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="file-input rounded-md border border-gray-300 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex space-x-6">
            <div className="w-1/2 h-96 bg-white rounded-md shadow-lg overflow-auto">
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                {pdfFile && <Viewer fileUrl={pdfFile} />}
              </Worker>
            </div>
            <div className="w-1/2 space-y-4">
              <h2 className="font-semibold text-gray-700">Extracted Questions:</h2>
              <div className="bg-gray-50 p-4 rounded-md shadow-lg max-h-96 overflow-auto">
                {questions.map((q, idx) => (
                  <p
                    key={idx}
                    ref={(el) => {
                      questionRefs.current[idx] = el;
                    }}
                    className="text-blue-600 cursor-pointer hover:text-blue-800 transition"
                    onMouseEnter={() => handleQuestionHover(idx)}
                    onMouseLeave={handleQuestionLeave}
                  >
                    {q}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        {hoveredQuestion && hoverPosition && (
          <div
            className="absolute bg-white border border-gray-200 shadow-xl rounded-md p-4"
            style={{
              top: hoverPosition.y + window.scrollY + 10,
              left: hoverPosition.x + window.scrollX + 10,
            }}
          >
            <h3 className="font-bold text-gray-800">Question Details</h3>
            <p className="text-sm text-gray-600">{hoveredQuestion}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
