"use client";
 
import React, { useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
 
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
 
interface FilePreviewsProps {

  modelQFileUrl: string | null;

  studentResponsesFileUrl: string | null;

  evaluationData: string | null; // Add evaluationData prop

}
 
const PDFPreview: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {

  const [numPages, setNumPages] = useState<number>(0);
 
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {

    setNumPages(numPages);

  };
 
  return (
<div className="w-full h-full overflow-auto bg-white">
<Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>

        {Array.from({ length: numPages }, (_, index) => (
<Page

            key={index + 1}

            pageNumber={index + 1}

            scale={1.0}

            className="m-auto my-2"

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
<div className="bg-white rounded-lg shadow-lg p-6 mt-6">
<h2 className="text-lg font-bold text-center mb-4">Evaluation Results</h2>
<p className="text-gray-700 whitespace-pre-wrap">{decodedFileContent}</p>
</div>

  );

};
 
const FilePreviews: React.FC<FilePreviewsProps> = ({

  modelQFileUrl,

  studentResponsesFileUrl,

  evaluationData,

}) => {

  if (!modelQFileUrl && !studentResponsesFileUrl) return null;
 
  return (
<div className="flex flex-col md:flex-row mt-8 w-full md:space-x-4">

      {/* Model Q&A Preview */}

      {modelQFileUrl && (
<div className="flex flex-col items-center flex-1 mb-8 md:mb-0">
<h2 className="text-lg font-bold text-center mb-4">Model Q&A</h2>
<div className="w-full h-96">

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
 
      {/* Student Responses Preview */}

      {studentResponsesFileUrl && (
<div className="flex flex-col items-center flex-1">
<h2 className="text-lg font-bold text-center mb-4">Student Responses</h2>
<div className="w-full h-96">

            {studentResponsesFileUrl.endsWith(".pdf") ? (
<PDFPreview fileUrl={studentResponsesFileUrl} />

            ) : (
<iframe

                src={studentResponsesFileUrl}

                title="Student Responses Preview"

                className="w-full h-full rounded-lg"

              />

            )}
</div>
</div>

      )}
 
      {/* Evaluation Results */}

      {evaluationData && <EvaluationResults evaluationData={evaluationData} />}
</div>

  );

};
 
export default FilePreviews;