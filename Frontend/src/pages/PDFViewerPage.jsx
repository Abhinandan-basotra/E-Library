import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use the local proxy endpoint for PDF.js worker
const pdfJsWorkerPath = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = pdfJsWorkerPath;

const PDFViewerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, fileName } = location.state || {};
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [workerReady, setWorkerReady] = useState(false);

  useEffect(() => {
    const verifyWorker = async () => {
      try {
        await pdfjs.getDocument({
          data: new Uint8Array(),
          useWorker: true,
          useSystemFonts: true
        }).promise;
        setWorkerReady(true);
      } catch (error) {
        console.error('PDF.js worker failed to load:', error);
        // Fallback to using the worker without web worker
        setWorkerReady(true);
      }
    };
    
    verifyWorker();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(newPageNumber, 1), numPages || 1);
    });
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No PDF Selected</h1>
          <p className="mb-4">Please select a PDF to view from the library.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  if (!workerReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-2xl font-bold">{fileName || 'PDF Document'}</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Back to Library
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="p-4">
            <div className="flex justify-center bg-gray-50 p-4 rounded">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                }
                error={
                  <div className="text-center p-4 text-red-500">
                    Failed to load PDF. Please try again.
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  width={Math.min(1000, window.innerWidth * 0.9)} 
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md"
                />
              </Document>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center bg-gray-50 p-3 rounded">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() => changePage(-1)}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {pageNumber} of {numPages || '--'}
              </span>
              <button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={() => changePage(1)}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerPage;
