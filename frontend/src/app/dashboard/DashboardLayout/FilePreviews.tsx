"use client";
import React, { useState, useEffect } from "react";
import UploadModal from "./UploadModal";
import jsPDF from "jspdf";
import RubricDisplay from "./RubricDisplay";

interface FilePreviewsProps {
  outerModelQandAFile?: File | null;
  outerModelQandAFileUrl?: string | null;
  modelQandAFileUrl: string | null;
  studentResponsesFileUrl: string | null;
  evaluationData: string | null;
  selectedDifficulty: string | null;
  handleDifficultySelection: (difficulty: string) => void;
  /**
   * Updated signature:
   * This callback receives the generated rubrics JSON (as a string)
   * from this component when Evaluate is clicked.
   */
  handleEvaluateButtonClicked: (rubrics: string | null) => Promise<void>;
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
  // Local state for files and blob URLs
  const [modelQandAFile, setModelQandAFile] = useState<File | null>(null);
  const [modelQandABlobUrl, setModelQandABlobUrl] = useState<string | null>(
    initialModelQandAFileUrl
  );
  const [studentResponsesFile, setStudentResponsesFile] = useState<File | null>(null);
  const [studentResponsesBlobUrl, setStudentResponsesBlobUrl] = useState<string | null>(
    initialStudentResponsesFileUrl
  );

  // UI states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isModelQandAUploaded, setIsModelQandAUploaded] = useState(false);
  const [isStudentResponsesUploaded, setIsStudentResponsesUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingRubrics, setIsGeneratingRubrics] = useState(false);
  /**
   * Local state to store the generated rubrics JSON string.
   */
  const [rubrics, setRubrics] = useState<string | null>(null);
  const [dropdown3, setDropdown3] = useState<string>("");

  // Fallback to outer file if local file is not set
  useEffect(() => {
    if (!modelQandAFile && outerModelQandAFile) {
      setModelQandAFile(outerModelQandAFile);
      setModelQandABlobUrl(
        outerModelQandAFileUrl || URL.createObjectURL(outerModelQandAFile)
      );
      setIsModelQandAUploaded(true);
    }
  }, [modelQandAFile, outerModelQandAFile, outerModelQandAFileUrl]);

  // Handlers for showing/hiding the upload modal
  const handleFileUploadClick = () => {
    setIsUploadModalOpen(true);
  };
  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  // File upload handlers
  const handleModelQandAFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setModelQandAFile(file);
      setModelQandABlobUrl(URL.createObjectURL(file));
      setIsModelQandAUploaded(true);
      checkUploadStatus(true, isStudentResponsesUploaded);
    }
  };

  const handleStudentResponsesFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setStudentResponsesFile(file);
      setStudentResponsesBlobUrl(URL.createObjectURL(file));
      setIsStudentResponsesUploaded(true);
      checkUploadStatus(isModelQandAUploaded, true);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      let isModelSet = false;
      let isStudentSet = false;
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const file = event.dataTransfer.items[i].getAsFile();
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

  // Check if both files have been uploaded
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

  // Generate Rubrics API call
  const handleGenerateRubrics = async () => {
    const finalModelFile = modelQandAFile || outerModelQandAFile;
    if (!finalModelFile) {
      setError("Please upload the Model Q&A file (outer or inner).");
      return;
    }

    setIsGeneratingRubrics(true);
    try {
      const formData = new FormData();
      formData.append("model_question_answer", finalModelFile);

      const response = await fetch("http://localhost:8000/api/generate_rubrics", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate rubrics");
      }

      const data = await response.json();
      // Store the rubrics JSON as a formatted string
      setRubrics(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error generating rubrics:", error);
      setError("Error generating rubrics. Please try again.");
    } finally {
      setIsGeneratingRubrics(false);
    }
  };

  // Download report handler
  const handleDownloadReport = () => {
    if (evaluationData) {
      const decodedData = JSON.parse(evaluationData);
      if (decodedData?.files?.[0]?.file) {
        const decodedFileContent = atob(decodedData.files[0].file);
        const doc = new jsPDF();
        doc.text(decodedFileContent, 10, 10);
        doc.save("evaluation_report.pdf");
      }
    }
  };

  if (!modelQandABlobUrl && !evaluationData) return null;

  // Helper function for model preview rendering
  const renderModelPreview = () => {
    if (!modelQandABlobUrl) return null;
    const fileName = modelQandAFile?.name?.toLowerCase() || "";
    if (fileName.endsWith(".pdf")) {
      return (
        <embed
          src={modelQandABlobUrl}
          type="application/pdf"
          className="w-full h-full rounded-lg"
        />
      );
    } else if (fileName.endsWith(".docx")) {
      return (
        <iframe
          src={modelQandABlobUrl}
          title="DOCX Preview"
          className="w-full h-full rounded-lg"
        />
      );
    } else {
      return (
        <iframe
          src={modelQandABlobUrl}
          title="File Preview"
          className="w-full h-full rounded-lg"
        />
      );
    }
  };

  /**
   * When the user clicks "Evaluate", we call the parent's
   * handleEvaluateButtonClicked, passing in the rubrics JSON string.
   */
  const onEvaluateClick = () => {
    handleEvaluateButtonClicked(rubrics);
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

      {/* Preview Section */}
      <div className="flex flex-row space-x-4">
        {/* Model Q&A Preview */}
        {modelQandABlobUrl && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-4xl font-bold text-center mb-4 mt-8">
              <span className="text-orange-500">Model</span>
              <span className="text-black"> Q&A</span>
            </h2>
            <div className="min-h-[600px] min-w-[800px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto flex-grow">
              {renderModelPreview()}
            </div>
          </div>
        )}

        {/* Generated Rubrics */}
        {rubrics && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-4xl font-bold text-center mb-4 mt-8">
              <span className="text-orange-500">Generated</span>
              <span className="text-black"> Rubrics</span>
            </h2>
            <div className="min-h-[600px] min-w-[800px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto flex-grow">
              <RubricDisplay rubrics={rubrics} />
            </div>
          </div>
        )}
      </div>

      {/* Inner Upload Modal */}
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

      {/* Loading Overlay for Generating Rubrics */}
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
