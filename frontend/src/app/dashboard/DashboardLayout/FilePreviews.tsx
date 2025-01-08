"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FilePreviewsProps {
  modelQFileUrl: string | null;
  studentResponsesFileUrl: string | null;
  evaluationData: string | null; // JSON string containing base64 file data
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
  const decodedFileContent = atob(decodedData.files[0].file);

  return (
    <div className="min-h-[800px] min-w-[800px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto flex-grow">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full flex flex-col">
        <h2 className="text-xl font-bold text-center mb-4 text-orange-600"></h2>
        <p className="text-gray-700 whitespace-pre-wrap flex-grow overflow-auto">
          {decodedFileContent}
        </p>
      </div>
    </div>
  );
};

const FilePreviews: React.FC<FilePreviewsProps> = ({
  modelQFileUrl,
  studentResponsesFileUrl,
  evaluationData,
}) => {
  // If neither the model Q&A nor evaluation data is provided, show nothing
  if (!modelQFileUrl && !evaluationData) return null;

  return (
    <div className="mt-8 w-full flex flex-col space-y-8 lg:space-y-0 lg:space-x-8 lg:flex-row">
      {/* ---------- MODEL Q&A PREVIEW ---------- */}
      {modelQFileUrl && (
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-center mb-4 text-orange-600">Model Q&A</h2>
          <div className="min-h-[800px] min-w-[800px] max-h-[80vh] bg-gray-50 rounded-lg shadow-md p-4 overflow-auto flex-grow">
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

      {/* ---------- EVALUATION RESULTS ---------- */}
      {evaluationData && (
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-center mb-4 text-orange-600">Evaluation Results</h2>
          <EvaluationResults evaluationData={evaluationData} />
        </div>
      )}
    </div>
  );
};

export default FilePreviews;