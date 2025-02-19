"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import jsPDF from "jspdf";
import mammoth from "mammoth";
import UploadModal from "./UploadModal";

// Configure the PDF.js worker for React-PDF
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/* ------------------------------------------------------------------
 * PDFPreview Component
 * ----------------------------------------------------------------*/
const PDFPreview: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error("PDF load error:", err);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={index + 1}
            pageNumber={index + 1}
            scale={1.5}
            className="my-4 border border-gray-200 rounded-md shadow-sm"
          />
        ))}
      </Document>
    </div>
  );
};

/* ------------------------------------------------------------------
 * DocxPreview Component (Reads File Directly, No Download)
 * ----------------------------------------------------------------*/
const DocxPreview: React.FC<{ file: File }> = ({ file }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocx = async () => {
      try {
        // Read the file's binary data in the browser
        const arrayBuffer = await file.arrayBuffer();
        // Convert .docx to HTML
        const { value } = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(value);
      } catch (err) {
        console.error("Error converting docx:", err);
        setError("Error processing .docx file. Please ensure it is valid.");
      }
    };
    loadDocx();
  }, [file]);

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

/* ------------------------------------------------------------------
 * EvaluationResults Component (Unchanged from your code)
 * ----------------------------------------------------------------*/
const EvaluationResults: React.FC<{ evaluationData: string }> = ({ evaluationData }) => {
  const decodedData = JSON.parse(evaluationData);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const totalFiles = decodedData.files.length;
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
    <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevious} className="text-black hover:text-gray-700">
            &lt; Previous
          </button>
          <h2 className="text-xl font-bold text-center text-orange-600">
            File {currentFileIndex + 1} of {totalFiles}
          </h2>
          <button onClick={handleNext} className="text-black hover:text-gray-700">
            Next &gt;
          </button>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap flex-grow overflow-auto">
          {decodedFileContent}
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
 * Main FilePreviews Component
 * ----------------------------------------------------------------*/
interface FilePreviewsProps {
  modelQandAFileUrl: string | null;
  studentResponsesFileUrl: string | null;
  evaluationData: string | null; // JSON string containing base64 file data
  selectedDifficulty: string | null;
  handleDifficultySelection: (difficulty: string) => void;
  handleEvaluateButtonClicked: () => Promise<void>;
}

const FilePreviews: React.FC<FilePreviewsProps> = ({
  modelQandAFileUrl: initialModelQandAFileUrl,
  studentResponsesFileUrl: initialStudentResponsesFileUrl,
  evaluationData,
  selectedDifficulty,
  handleDifficultySelection,
  handleEvaluateButtonClicked,
}) => {
  // We store both the File object and the Blob URL for PDF
  const [modelQandAFile, setModelQandAFile] = useState<File | null>(null);
  const [modelQandABlobUrl, setModelQandABlobUrl] = useState<string | null>(initialModelQandAFileUrl);

  const [studentResponsesFile, setStudentResponsesFile] = useState<File | null>(null);
  const [studentResponsesBlobUrl, setStudentResponsesBlobUrl] = useState<string | null>(
    initialStudentResponsesFileUrl
  );

  const [dropdown3, setDropdown3] = useState<string>("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const [isModelQandAUploaded, setIsModelQandAUploaded] = useState(false);
  const [isStudentResponsesUploaded, setIsStudentResponsesUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingRubrics, setIsGeneratingRubrics] = useState(false);
  const [rubrics, setRubrics] = useState<string | null>(null);

  /* ----------------------------------------
   * Show/Hide Upload Modal
   * --------------------------------------*/
  const handleFileUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  /* ----------------------------------------
   * Model Q&A File Upload
   * --------------------------------------*/
  const handleModelQandAFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setModelQandAFile(file);

      // If it's a PDF, we create a blob URL for PDFPreview
      // If it's docx, we'll parse in DocxPreview directly from the File object
      const url = URL.createObjectURL(file);
      setModelQandABlobUrl(url);

      setIsModelQandAUploaded(true);
      checkUploadStatus(true, isStudentResponsesUploaded);
    }
  };

  /* ----------------------------------------
   * Student Responses File Upload
   * --------------------------------------*/
  const handleStudentResponsesFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setStudentResponsesFile(file);
      setStudentResponsesBlobUrl(URL.createObjectURL(file));
      setIsStudentResponsesUploaded(true);
      checkUploadStatus(isModelQandAUploaded, true);
    }
  };

  /* ----------------------------------------
   * Drag & Drop Handling
   * --------------------------------------*/
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      const files = event.dataTransfer.items;
      let isModelSet = false;
      let isStudentSet = false;

      // We assume the first file is "Model Q&A", the second is "Student Responses"
      for (let i = 0; i < files.length; i++) {
        const file = files[i].getAsFile();
        if (file) {
          if (!isModelSet) {
            setModelQandAFile(file);
            setModelQandABlobUrl(URL.createObjectURL(file));
            setIsModelQandAUploaded(true);
            isModelSet = true;
          } else if (!isStudentSet) {
            setStudentResponsesFile(file);
            setStudentResponsesBlobUrl(URL.createObjectURL(file));
            setIsStudentResponsesUploaded(true);
            isStudentSet = true;
          }
        }
      }
      checkUploadStatus(isModelSet, isStudentSet);
    }
  };

  /* ----------------------------------------
   * Check if both files are uploaded
   * --------------------------------------*/
  const checkUploadStatus = (modelUploaded: boolean, studentUploaded: boolean) => {
    if (modelUploaded && studentUploaded) {
      setIsUploadModalOpen(false);
      setError(null);
    } else if (modelUploaded && !studentUploaded) {
      setError("Please upload Student Responses file");
    } else if (!modelUploaded && studentUploaded) {
      setError("Please upload Model Q&A file");
    } else if (!modelUploaded && !studentUploaded) {
      setError("Please upload both Model Q&A and Student Responses files");
    }
  };

  /* ----------------------------------------
   * Generate Rubrics
   * --------------------------------------*/
  const handleGenerateRubrics = async () => {
    setIsGeneratingRubrics(true);
    try {
      const response = await fetch("http://localhost:8000/api/generate-rubrics", {
        method: "POST",
        body: JSON.stringify({ modelQandABlobUrl }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate rubrics");
      }

      const data = await response.json();
      setRubrics(data.rubrics);
      console.log("Rubrics generated successfully");
    } catch (error) {
      console.error("Error generating rubrics:", error);
      setError("Error generating rubrics. Please try again.");
    } finally {
      setIsGeneratingRubrics(false);
    }
  };

  /* ----------------------------------------
   * Download Report
   * --------------------------------------*/
  const handleDownloadReport = () => {
    if (evaluationData) {
      const decodedData = JSON.parse(evaluationData);
      const decodedFileContent = atob(decodedData.files[0].file);

      const doc = new jsPDF();
      doc.text(decodedFileContent, 10, 10);
      doc.save("evaluation_report.pdf");
    }
  };

  /* ----------------------------------------
   * If no file/eval data, hide previews
   * --------------------------------------*/
  // If neither the model Q&A file nor evaluation data is provided, we show nothing
  if (!modelQandABlobUrl && !evaluationData) return null;

  return (
    <div className="mt-8 w-full flex flex-col space-y-4 lg:space-y-0 lg:space-x-4 lg:flex-col relative">
      {/* Top Controls */}
      <div className="w-full flex justify-between mb-4 p-2 border rounded-lg bg-white shadow-sm space-x-2">
        <button
          onClick={handleFileUploadClick}
          className="w-1/6 p-2 border rounded-lg bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer text-center"
        >
          Upload
        </button>
        <select
          value={selectedDifficulty || ""}
          onChange={(e) => handleDifficultySelection(e.target.value)}
          className="w-1/6 p-1 border rounded-lg bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <div className="w-1/6 flex items-center justify-center">
          <label className="flex items-center cursor-pointer">
            <span className="mr-2">Generate Rubrics</span>
            <input
              type="checkbox"
              className="hidden"
              onChange={handleGenerateRubrics}
            />
            <div className="relative">
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
            </div>
          </label>
        </div>
        <select
          value={dropdown3}
          onChange={(e) => {
            setDropdown3(e.target.value);
            if (e.target.value === "option3") {
              handleDownloadReport();
            }
          }}
          className="w-1/6 p-1 border rounded-lg bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Status</option>
          <option value="option1">Pending</option>
          <option value="option2">Completed</option>
          <option value="option3">Download Report</option>
        </select>
      </div>

      {/* Evaluate & Back Buttons */}
      {selectedDifficulty && rubrics && (
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={handleEvaluateButtonClicked}
            className="py-2 px-6 rounded-lg bg-black text-white shadow-md mb-4 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Evaluate
          </button>
          <button
            onClick={() => handleDifficultySelection("")}
            className="py-2 px-6 rounded-lg text-sm text-black shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Back
          </button>
        </div>
      )}

      {/* Preview Section */}
      <div className="flex flex-row space-x-4">
        {/* MODEL Q&A PREVIEW */}
        {modelQandABlobUrl && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-4xl font-bold text-center mb-4 mt-8">
              <span className="text-orange-500">Model</span>
              <span className="text-black"> Q&A</span>
            </h2>
            <div className="min-h-[600px] min-w-[800px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto flex-grow">
              {/* 
                - If extension is .pdf → Show PDFPreview using blob URL
                - If extension is .docx → Show DocxPreview using the raw File
                - Otherwise → fallback to iframe
              */}
              {modelQandAFile && modelQandAFile.name.toLowerCase().endsWith(".pdf") ? (
                <PDFPreview fileUrl={modelQandABlobUrl} />
              ) : modelQandAFile && modelQandAFile.name.toLowerCase().endsWith(".docx") ? (
                <DocxPreview file={modelQandAFile} />
              ) : (
                <iframe
                  src={modelQandABlobUrl}
                  title="File Preview"
                  className="w-full h-full rounded-lg"
                />
              )}
            </div>
          </div>
        )}

        {/* GENERATED RUBRICS */}
        {rubrics && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-4xl font-bold text-center mb-4 mt-8">
              <span className="text-orange-500">Generated</span>
              <span className="text-black"> Rubrics</span>
            </h2>
            <div className="min-h-[600px] min-w-[800px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto flex-grow">
              <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
                <p className="text-gray-700 whitespace-pre-wrap flex-grow overflow-auto">
                  {rubrics}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <UploadModal
            isUploadMenuOpen={isUploadModalOpen}
            handleCloseUploadMenu={handleCloseUploadModal}
            handleModelQandAFileChange={handleModelQandAFileChange}
            handleStudentResponsesFileChange={handleStudentResponsesFileChange}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            isModelQandAUploaded={isModelQandAUploaded}
            isStudentResponsesUploaded={isStudentResponsesUploaded}
            error={error}
            handleMouseDown={() => {}}
            handleMouseMove={() => {}}
          />
        </div>
      )}

      {/* Loading message for generating rubrics */}
      {isGeneratingRubrics && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center justify-center">
            <p className="text-7xl text-black mt-4">
              <span className="text-orange-500">Hang on,</span>
              <span className="text-black"> I am Generating the Rubrics...</span>
            </p>
            <div className="loader mt-4 animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePreviews;