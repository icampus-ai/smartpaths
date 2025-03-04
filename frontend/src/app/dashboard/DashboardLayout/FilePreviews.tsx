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
  /**
   * Optional callbacks to update parent state when new files are uploaded.
   */
  onModelQandAFileChange?: (file: File) => void;
  onStudentResponsesFileChange?: (file: File) => void;
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
  onModelQandAFileChange,
  onStudentResponsesFileChange,
}) => {
  // -----------------------------
  // State for files and previews (local state)
  // -----------------------------
  const [modelQandAFile, setModelQandAFile] = useState<File | null>(null);
  const [modelQandABlobUrl, setModelQandABlobUrl] = useState<string | null>(initialModelQandAFileUrl);
  const [studentResponsesFile, setStudentResponsesFile] = useState<File | null>(null);
  const [studentResponsesBlobUrl, setStudentResponsesBlobUrl] = useState<string | null>(
    initialStudentResponsesFileUrl
  );

  // -----------------------------
  // UI / Upload states
  // -----------------------------
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isModelQandAUploaded, setIsModelQandAUploaded] = useState(false);
  const [isStudentResponsesUploaded, setIsStudentResponsesUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Rubrics & generation
  // -----------------------------
  const [isGeneratingRubrics, setIsGeneratingRubrics] = useState(false);
  const [rubrics, setRubrics] = useState<any>(null);

  // -----------------------------
  // Carousel Navigation
  // -----------------------------
  const [currentSlide, setCurrentSlide] = useState(0);

  // -----------------------------
  // Effects
  // -----------------------------
  // If an outer Model Q&A file is provided, use it
  useEffect(() => {
    if (!modelQandAFile && outerModelQandAFile) {
      setModelQandAFile(outerModelQandAFile);
      setModelQandABlobUrl(outerModelQandAFileUrl || URL.createObjectURL(outerModelQandAFile));
      setIsModelQandAUploaded(true);
    }
  }, [modelQandAFile, outerModelQandAFile, outerModelQandAFileUrl]);

  // Reset the carousel index whenever the available views change
  useEffect(() => {
    setCurrentSlide(0);
  }, [modelQandABlobUrl, rubrics, evaluationData]);

  // -----------------------------
  // Upload Modal Handlers
  // -----------------------------
  const handleFileUploadClick = () => setIsUploadModalOpen(true);
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);

  // When a new Model Q&A file is uploaded, update local state and clear previous rubrics.
  // Also call the parent callback (if provided) to update parent state.
  const handleModelQandAFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setModelQandAFile(file);
      setModelQandABlobUrl(URL.createObjectURL(file));
      setIsModelQandAUploaded(true);
      setRubrics(null); // clear previous rubrics
      if (onModelQandAFileChange) onModelQandAFileChange(file);
      checkUploadStatus(true, isStudentResponsesUploaded);
    }
  };

  // When a new Student Responses file is uploaded, update local state and clear previous rubrics.
  // Also call the parent callback (if provided) to update parent state.
  const handleStudentResponsesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setStudentResponsesFile(file);
      setStudentResponsesBlobUrl(URL.createObjectURL(file));
      setIsStudentResponsesUploaded(true);
      setRubrics(null); // clear previous rubrics
      if (onStudentResponsesFileChange) onStudentResponsesFileChange(file);
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
            if (onModelQandAFileChange) onModelQandAFileChange(file);
          } else if (!isStudentSet) {
            setStudentResponsesFile(file);
            setStudentResponsesBlobUrl(URL.createObjectURL(file));
            setIsStudentResponsesUploaded(true);
            isStudentSet = true;
            if (onStudentResponsesFileChange) onStudentResponsesFileChange(file);
          }
        }
      }
      // Clear rubrics since new files are uploaded.
      setRubrics(null);
      checkUploadStatus(isModelSet, isStudentSet);
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

  // -----------------------------
  // Generate Rubrics
  // -----------------------------
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
      // Preserve rubrics in local state
      setRubrics(data);
    } catch (err) {
      console.error("Error generating rubrics:", err);
      setError("Error generating rubrics. Please try again.");
    } finally {
      setIsGeneratingRubrics(false);
    }
  };

  // -----------------------------
  // Evaluate
  // -----------------------------
  const onEvaluateClick = () => {
    // Re-run the evaluation using current file states.
    handleEvaluateButtonClicked(rubrics);
  };

  // -----------------------------
  // Download Report (optional)
  // -----------------------------
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

  // -----------------------------
  // Render Helpers
  // -----------------------------
  /**
   * Model Q&A Preview
   * - Displays the file using embed/iframe without internal headers.
   */
  const renderModelPreview = () => {
    if (!modelQandABlobUrl) return null;
    return (
      <div className="h-full w-full">
        {modelQandAFile?.name?.toLowerCase().endsWith(".pdf") ? (
          <embed src={modelQandABlobUrl} type="application/pdf" className="w-full h-full" />
        ) : modelQandAFile?.name?.toLowerCase().endsWith(".docx") ? (
          <iframe src={modelQandABlobUrl} title="DOCX Preview" className="w-full h-full" />
        ) : (
          <iframe src={modelQandABlobUrl} title="File Preview" className="w-full h-full" />
        )}
      </div>
    );
  };

  /**
   * Rubrics View
   * - Displays the rubric content without internal headers.
   */
  const renderRubricsView = () => {
    if (!rubrics) return null;
    return (
      <div className="h-full w-full p-4 overflow-auto">
        <RubricDisplay rubrics={rubrics} />
      </div>
    );
  };

  /**
   * Evaluation Results View
   * - Displays evaluation results without internal headers.
   */
  const renderEvaluationView = () => {
    if (!evaluationData) return null;
    return (
      <div className="h-full w-full p-4 overflow-auto">
        <EvaluationResults evaluationData={evaluationData} />
      </div>
    );
  };

  // -----------------------------
  // Build Carousel Views
  // -----------------------------
  interface View {
    key: string;
    title: JSX.Element;
    content: JSX.Element | null;
  }
  const availableViews: View[] = [];
  if (modelQandABlobUrl) {
    availableViews.push({
      key: "model",
      title: (
        <>
          <span className="text-orange-500">Model</span>
          <span className="text-black"> Q&amp;A</span>
        </>
      ),
      content: renderModelPreview(),
    });
  }
  if (rubrics || (evaluationData && rubrics)) {
    availableViews.push({
      key: "rubrics",
      title: (
        <>
          <span className="text-orange-500">Generated</span>
          <span className="text-black"> Rubrics</span>
        </>
      ),
      content: renderRubricsView(),
    });
  }
  if (evaluationData) {
    availableViews.push({
      key: "evaluation",
      title: (
        <>
          <span className="text-orange-500">Evaluation</span>
          <span className="text-black"> Results</span>
        </>
      ),
      content: renderEvaluationView(),
    });
  }

  // -----------------------------
  // Carousel Navigation
  // -----------------------------
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < availableViews.length - 1 ? prev + 1 : prev));
  };

  // -----------------------------
  // Central Carousel Preview
  // -----------------------------
  const renderCentralPreview = () => {
    if (availableViews.length === 0) return null;
    return (
      <div className="relative w-full flex flex-col items-center h-[80vh]">
        {/* Large heading for the current view */}
        <h2 className="text-4xl font-bold text-center mb-4 mt-8">
          {availableViews[currentSlide].title}
        </h2>
        {/* Row layout: Button - Preview - Button */}
        <div className="flex w-full max-w-5xl h-full items-center justify-center space-x-4">
          {/* Left Button */}
          {availableViews.length > 1 && (
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
          )}
          {/* Main preview area */}
          <div className="flex-1 h-full">
            <div className="bg-gray-50 rounded-lg shadow-md h-full overflow-hidden p-2">
              <div className="w-full h-full">{availableViews[currentSlide].content}</div>
            </div>
          </div>
          {/* Right Button */}
          {availableViews.length > 1 && (
            <button
              onClick={handleNext}
              disabled={currentSlide === availableViews.length - 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  };

  // -----------------------------
  // Main Render
  // -----------------------------
  return (
    <div className="mt-8 w-full flex flex-col relative">
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
            className="py-2 px-4 bg-gradient-to-r from-orange-400 to-orange-600 text-black rounded-lg shadow-lg hover:from-orange-500 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transform transition-transform duration-300 hover:scale-105"
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

      {/* Evaluate & Back Buttons (always shown when difficulty & rubrics exist) */}
      {selectedDifficulty && rubrics && (
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={onEvaluateClick}
            className="py-2 px-6 rounded-lg bg-black text-white shadow-md mb-4 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Evaluate
          </button>
        </div>
      )}

      {/* Central Carousel Preview */}
      {renderCentralPreview()}

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
