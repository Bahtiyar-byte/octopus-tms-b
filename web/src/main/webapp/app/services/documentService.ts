// Document service to provide sample PDF URLs for the document viewer

// Sample PDF URLs from Mozilla's PDF.js examples
const samplePDFs = {
  rate_confirmation: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  bol: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/basicapi.pdf',
  pod: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/annotation-line.pdf',
  invoice: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/issue6637.pdf',
  other: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/rotation.pdf'
};

// Get a sample PDF URL based on document type
export const getSamplePdfUrl = (type: string): string => {
  return samplePDFs[type as keyof typeof samplePDFs] || samplePDFs.other;
};

// Get a sample PDF URL based on document ID
export const getSamplePdfUrlById = (id: string): string => {
  // Map document IDs to types for demo purposes
  const idToTypeMap: Record<string, string> = {
    '1': 'rate_confirmation',
    '2': 'rate_confirmation',
    '3': 'rate_confirmation',
    '4': 'rate_confirmation',
    '5': 'rate_confirmation',
    '6': 'bol',
    '7': 'bol',
    '8': 'bol',
    '9': 'pod',
    '10': 'pod',
    '11': 'pod'
  };
  
  const type = idToTypeMap[id] || 'other';
  return getSamplePdfUrl(type);
};

// Function to get document metadata
export const getDocumentMetadata = (id: string) => {
  // This would typically come from an API
  // For demo purposes, we're returning static data
  return {
    uploadedBy: 'John Doe',
    uploadedDate: '2025-05-21T14:34:00Z',
    lastViewed: '2025-05-22T10:15:00Z',
    viewCount: 3,
    downloadCount: 1
  };
};

export default {
  getSamplePdfUrl,
  getSamplePdfUrlById,
  getDocumentMetadata
};