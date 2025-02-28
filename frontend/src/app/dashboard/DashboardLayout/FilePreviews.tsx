"use client";
import React, { useState, useEffect } from "react";
import UploadModal from "./UploadModal";
import RubricDisplay from "./RubricDisplay";
import EvaluationResults from "./EvaluationResults";
import { jsPDF } from "jspdf";

interface FilePreviewsProps {
  outerModelQandAFile?: File | null;
  outerModelQandAFileUrl?: string | null;
  modelQandAFileUrl: string | null;
  studentResponsesFileUrl: string | null;
  evaluationData: string | null;
  selectedDifficulty: string | null;
  handleDifficultySelection: (difficulty: string) => void;
  /**
   * This callback receives the generated rubrics JSON (as an object)
   * from this component when Evaluate is clicked.
   */
  handleEvaluateButtonClicked: (rubrics: any) => Promise<void>;
}

const FilePreviews: React.FC<FilePreviewsProps> = ({
  outerModelQandAFile = null,
  outerModelQandAFileUrl = null,
  modelQandAFileUrl: initialModelQandAFileUrl,
  studentResponsesFileUrl: initialStudentResponsesFileUrl,
  evaluationData,
  selectedDifficulty,
  handleDifficultySelection,
  handleEvaluateButtonClicked,
}) => {
  // Local states for files and blob URLs
  const [modelQandAFile, setModelQandAFile] = useState<File | null>(null);
  const [modelQandABlobUrl, setModelQandABlobUrl] = useState<string | null>(initialModelQandAFileUrl);
  const [studentResponsesFile, setStudentResponsesFile] = useState<File | null>(null);
  const [studentResponsesBlobUrl, setStudentResponsesBlobUrl] = useState<string | null>(initialStudentResponsesFileUrl);

  // UI states for uploads and errors
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isModelQandAUploaded, setIsModelQandAUploaded] = useState(false);
  const [isStudentResponsesUploaded, setIsStudentResponsesUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rubrics generation state (raw JSON object from the API)
  const [isGeneratingRubrics, setIsGeneratingRubrics] = useState(false);
  const [rubrics, setRubrics] = useState<any>(null);

  // Fallback to outer file if local file is not set
  useEffect(() => {
    if (!modelQandAFile && outerModelQandAFile) {
      setModelQandAFile(outerModelQandAFile);
      setModelQandABlobUrl(outerModelQandAFileUrl || URL.createObjectURL(outerModelQandAFile));
      setIsModelQandAUploaded(true);
    }
  }, [modelQandAFile, outerModelQandAFile, outerModelQandAFileUrl]);

  // --- Upload Modal Handlers ---
  const handleFileUploadClick = () => setIsUploadModalOpen(true);
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);

  const handleModelQandAFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setModelQandAFile(file);
      setModelQandABlobUrl(URL.createObjectURL(file));
      setIsModelQandAUploaded(true);
      checkUploadStatus(true, isStudentResponsesUploaded);
    }
  };

  const handleStudentResponsesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setStudentResponsesFile(file);
      setStudentResponsesBlobUrl(URL.createObjectURL(file));
      setIsStudentResponsesUploaded(true);
      checkUploadStatus(isModelQandAUploaded, true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      let isModelSet = false;
      let isStudentSet = false;
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const file = e.dataTransfer.items[i].getAsFile();
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
      checkUploadStatus(isModelSet, isStudentResponsesUploaded);
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
    } else {
      setError("Please upload both Model Q&A and Student Responses files");
    }
  };

  // --- Rubrics Generation ---
  const handleGenerateRubrics = async () => {
    const finalModelFile = modelQandAFile || outerModelQandAFile;
    if (!finalModelFile) {
      setError("Please upload the Model Q&A file first.");
      return;
    }
    setIsGeneratingRubrics(true);
    try {
      const formData = new FormData();
      formData.append("model_question_answer", finalModelFile);
      const resp = await fetch("http://localhost:8000/api/generate_rubrics", {
        method: "POST",
        body: formData,
      });
      if (!resp.ok) throw new Error("Failed to generate rubrics");
      const data = await resp.json();
      // Store the rubrics exactly as returned by the backend.
      setRubrics(data);
    } catch (err) {
      console.error("Error generating rubrics:", err);
      setError("Error generating rubrics. Please try again.");
    } finally {
      setIsGeneratingRubrics(false);
    }
  };

  // --- Evaluate Button ---
  const onEvaluateClick = () => {
    handleEvaluateButtonClicked(rubrics);
  };

  // --- Download Report Handler (if needed) ---
  const handleDownloadReport = () => {
    if (!evaluationData) return;
    try {
      const parsed = JSON.parse(evaluationData);
      const base64PDF = parsed.files[0].file;
      const decoded = atob(base64PDF);
      const doc = new jsPDF();
      doc.text(decoded, 10, 10);
      doc.save("evaluation_report.pdf");
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };

  // --- Render Model Q&A Preview ---
  const renderModelPreview = () => {
    if (!modelQandABlobUrl) return null;
    const fileName = modelQandAFile?.name?.toLowerCase() || "";
    if (fileName.endsWith(".pdf")) {
      return <embed src={modelQandABlobUrl} type="application/pdf" className="w-full h-full rounded-lg" />;
    } else if (fileName.endsWith(".docx")) {
      return <iframe src={modelQandABlobUrl} title="DOCX Preview" className="w-full h-full rounded-lg" />;
    } else {
      return <iframe src={modelQandABlobUrl} title="File Preview" className="w-full h-full rounded-lg" />;
    }
  };

  // --- Render Right Column: either generated rubrics OR evaluated result ---
  const renderRightColumn = () => {
    if (evaluationData) {
      return (
        <div className="flex-1 flex flex-col">
          <h2 className="text-4xl font-bold text-center mb-4 mt-8">
            <span className="text-orange-500">Evaluation</span>
            <span className="text-black"> Results</span>
          </h2>
          <div className="min-h-[600px] min-w-[500px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto">
            <EvaluationResults evaluationData={evaluationData} />
          </div>
        </div>
      );
    } else if (rubrics) {
      return (
        <div className="flex-1 flex flex-col">
          <h2 className="text-4xl font-bold text-center mb-4 mt-8">Generated Rubrics</h2>
          <div className="min-h-[600px] min-w-[500px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto">
            <RubricDisplay rubrics={rubrics} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

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
          <button
            onClick={handleGenerateRubrics}
            className="py-2 px-4 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Generate Rubrics
          </button>
        </div>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value === "download") {
              handleDownloadReport();
            }
          }}
          className="w-1/6 p-1 border rounded-lg bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Status</option>
          <option value="download">Download Report</option>
        </select>
      </div>

      {/* Evaluate & Back Buttons (only if rubrics exist and evaluation not done yet) */}
      {selectedDifficulty && rubrics && !evaluationData && (
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={onEvaluateClick}
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

      {/* 2-Column Layout */}
      <div className="flex flex-row space-x-4">
        {/* Left: Model Q&A Preview */}
        {modelQandABlobUrl && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-4xl font-bold text-center mb-4 mt-8">
              <span className="text-orange-500">Model</span>
              <span className="text-black"> Q&A</span>
            </h2>
            <div className="min-h-[725px] min-w-[500px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto">
              {renderModelPreview()}
            </div>
          </div>
        )}

        {/* Right: Either Rubrics or Evaluated Results */}
        <div className="flex-1 flex flex-col">
          {renderRightColumn()}
        </div>
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
            handleSubmit={() => {}}
          />
        </div>
      )}

      {/* Loading Overlay for Rubrics Generation */}
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