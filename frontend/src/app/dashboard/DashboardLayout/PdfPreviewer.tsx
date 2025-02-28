"use client";
import React, { useState, useEffect } from "react";

interface PdfPreviewerProps {
  evaluationData: string | null;
}

const PdfPreviewer: React.FC<PdfPreviewerProps> = ({ evaluationData }) => {
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!evaluationData) {
      console.log("PdfPreviewer: evaluationData is null");
      setPdfDataUrl(null);
      return;
    }
    try {
      console.log("PdfPreviewer: evaluationData received", evaluationData);
      const parsed = JSON.parse(evaluationData);
      console.log("PdfPreviewer: parsed evaluationData", parsed);
      const base64PDF = parsed.files[0].file;
      console.log("PdfPreviewer: base64PDF snippet", base64PDF.slice(0, 20));
      const dataUrl = `data:application/pdf;base64,${base64PDF}`;
      setPdfDataUrl(dataUrl);
      console.log("PdfPreviewer: dataUrl set", dataUrl);
    } catch (err) {
      console.error("Error creating PDF data URL:", err);
      setPdfDataUrl(null);
    }
  }, [evaluationData]);

  if (!pdfDataUrl) return <p className="text-red-500">Evaluated result not available.</p>;

  return (
    <div className="flex flex-col mt-8">
      <h2 className="text-4xl font-bold text-center mb-4">Evaluated Results</h2>
      <embed src={pdfDataUrl} type="application/pdf" className="w-full h-[600px] border rounded-lg" />
    </div>
  );
};

export default PdfPreviewer;
