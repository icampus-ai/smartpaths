"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import UploadModal from "./UploadModal";
import jsPDF from "jspdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FilePreviewsProps {
  modelQFileUrl: string | null;
  studentResponsesFileUrl: string | null;
  evaluationData: string | null; // JSON string containing base64 file data
  selectedDifficulty: string | null;
  handleDifficultySelection: (difficulty: string) => void;
  handleEvaluateButtonClicked: () => Promise<void>;
}

const PDFPreview: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={index + 1}
            pageNumber={index + 1}
            scale={1.5} // Increase the scale for a larger preview
            className="my-4 border border-gray-200 rounded-md shadow-sm"
          />
        ))}
      </Document>
    </div>
  );
};

const EvaluationResults: React.FC<{ evaluationData: string }> = ({ evaluationData }) => {
  const decodedData = JSON.parse(evaluationData);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const totalFiles = decodedData.files.length;
  const decodedFileContent = atob(decodedData.files[currentFileIndex].file);

  const handlePrevious = () => {
    setCurrentFileIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : totalFiles - 1));
  };

  const handleNext = () => {
    setCurrentFileIndex((prevIndex) => (prevIndex < totalFiles - 1 ? prevIndex + 1 : 0));
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

const FilePreviews: React.FC<FilePreviewsProps> = ({
  modelQFileUrl: initialModelQFileUrl,
  studentResponsesFileUrl: initialStudentResponsesFileUrl,
  evaluationData,
  selectedDifficulty,
  handleDifficultySelection,
  handleEvaluateButtonClicked,
}) => {
  const [modelQFileUrl, setModelQFileUrl] = useState<string | null>(initialModelQFileUrl);
  const [studentResponsesFileUrl, setStudentResponsesFileUrl] = useState<string | null>(initialStudentResponsesFileUrl);
  const [dropdown3, setDropdown3] = useState<string>("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [modelQFile, setModelQFile] = useState<File | null>(null);
  const [studentResponsesFile, setStudentResponsesFile] = useState<File | null>(null);
  const [isModelQUploaded, setIsModelQUploaded] = useState(false);
  const [isStudentResponsesUploaded, setIsStudentResponsesUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleModelQFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      setModelQFile(file);
      setModelQFileUrl(URL.createObjectURL(file));
      setIsModelQUploaded(true);
      checkUploadStatus(true, isStudentResponsesUploaded);
    }
  };

  const handleStudentResponsesFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      setStudentResponsesFile(file);
      setStudentResponsesFileUrl(URL.createObjectURL(file));
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
          if (i === 0) {
            setModelQFile(file);
            setModelQFileUrl(URL.createObjectURL(file));
            setIsModelQUploaded(true);
          } else if (i === 1) {
            setStudentResponsesFile(file);
            setStudentResponsesFileUrl(URL.createObjectURL(file));
            setIsStudentResponsesUploaded(true);
          }
        }
      }
      checkUploadStatus(true, true);
    }
  };

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

  const handleDownloadReport = () => {
    if (evaluationData) {
      const decodedData = JSON.parse(evaluationData);
      const decodedFileContent = atob(decodedData.files[0].file);

      const doc = new jsPDF();
      doc.text(decodedFileContent, 10, 10);
      doc.save("evaluation_report.pdf");
    }
  };

  // If neither the model Q&A nor evaluation data is provided, show nothing
  if (!modelQFileUrl && !evaluationData) return null;

  return (
    <div className="mt-8 w-full flex flex-col space-y-4 lg:space-y-0 lg:space-x-4 lg:flex-col relative">
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
          <option value="option3">Hold</option>
          <option value="option3">Download Report</option>
        </select>
      </div>

      {selectedDifficulty && (
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

      <div className="flex flex-row space-x-4">
        {/* -------- MODEL Q&A PREVIEW -------- */}
        {modelQFileUrl && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-4xl font-bold text-center mb-4 mt-8">
              <span className="text-orange-500">Model</span>
              <span className="text-black"> Q&A</span>
            </h2>
            <div className="min-h-[600px] min-w-[800px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto flex-grow">
              {modelQFileUrl.endsWith(".pdf") ? (
                <PDFPreview fileUrl={modelQFileUrl} />
              ) : (
                <iframe
                  src={modelQFileUrl}
                  title="Model Q&A Preview"
                  className="w-full h-full rounded-lg"
                />
              )}
            </div>
          </div>
        )}

        {/* -------- EVALUATION RESULTS -------- */}
        {evaluationData && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-4xl font-bold text-center mb-4 mt-8 text-orange-600">
              <span className="text-orange-500">Evaluation</span>
              <span className="text-black"> Results</span>
            </h2>
            <div className="min-h-[600px] min-w-[800px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto flex-grow">
              <EvaluationResults evaluationData={evaluationData} />
            </div>
          </div>
        )}
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <UploadModal
            isUploadMenuOpen={isUploadModalOpen}
            handleCloseUploadMenu={handleCloseUploadModal}
            handleModelQFileChange={handleModelQFileChange}
            handleStudentResponsesFileChange={handleStudentResponsesFileChange}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            isModelQUploaded={isModelQUploaded}
            isStudentResponsesUploaded={isStudentResponsesUploaded}
            error={error}
            handleMouseDown={() => {}}
            handleMouseMove={() => {}}
            handleModelQandAFileChange={handleModelQFileChange}
            isModelQandAUploaded={isModelQUploaded}
          />
        </div>
      )}
    </div>
  );
};

export default FilePreviews;