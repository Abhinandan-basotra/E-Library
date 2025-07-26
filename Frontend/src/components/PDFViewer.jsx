import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Use the local proxy endpoint for PDF.js worker
const pdfJsWorkerPath = '/pdfjs/pdfjs-dist@5.3.93/build/pdf.worker.min.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = pdfJsWorkerPath;

const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
        error={<div>Failed to load PDF.</div>}
      >
        <Page pageNumber={pageNumber} />
      </Document>

      <div className="mt-4 flex gap-4 items-center">
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button
          onClick={() =>
            setPageNumber((prev) => Math.min(prev + 1, numPages || prev))
          }
          disabled={pageNumber >= numPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
