import React, {useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
// Use unpkg as a more reliable CDN that doesn't have CORS issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface DocumentViewerProps {
    file: string,
    className?: string,
    documentUrl?: string,
    documentType?: string
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({file, className = '', documentUrl, documentType}) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const onDocumentLoadSuccess = ({numPages}: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const onDocumentLoadError = (error: Error) => {
        console.error('Error loading PDF:', error);
        setError(error);
        setLoading(false);
    };

    const goToPrevPage = () => {
        setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));
    };

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.2, 2.0));
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.2, 0.6));
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="bg-gray-100 p-2 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className={`p-1 rounded ${pageNumber <= 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
                        title="Previous page"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="text-sm">
            Page {pageNumber} of {numPages || '?'}
          </span>
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= (numPages || 1)}
                        className={`p-1 rounded ${pageNumber >= (numPages || 1) ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
                        title="Next page"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={zoomOut}
                        disabled={scale <= 0.6}
                        className={`p-1 rounded ${scale <= 0.6 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
                        title="Zoom out"
                    >
                        <i className="fas fa-search-minus"></i>
                    </button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <button
                        onClick={zoomIn}
                        disabled={scale >= 2.0}
                        className={`p-1 rounded ${scale >= 2.0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
                        title="Zoom in"
                    >
                        <i className="fas fa-search-plus"></i>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-200 flex justify-center p-4">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="text-red-500 text-4xl mb-2">
                            <i className="fas fa-exclamation-circle"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading document</h3>
                        <p className="text-sm text-gray-600 max-w-md">
                            There was a problem loading this document. Please try again or contact support if the issue
                            persists.
                        </p>
                    </div>
                )}

                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading=""
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="shadow-lg"
                    />
                </Document>
            </div>
        </div>
    );
};

export default DocumentViewer;