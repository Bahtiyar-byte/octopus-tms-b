import { useState, useEffect } from 'react';
import { brokerApi, Document } from '../api/brokerApi';

interface UseDocumentsResult {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  refreshDocuments: () => Promise<void>;
  uploadDocument: (file: File, loadId: string, type: Document['type']) => Promise<void>;
}

export const useDocuments = (loadId?: string): UseDocumentsResult => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const documentsData = await brokerApi.getDocuments(loadId);
      setDocuments(documentsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents on component mount and when loadId changes
  useEffect(() => {
    fetchDocuments();
  }, [loadId]);

  // Mock function to simulate uploading a document
  const uploadDocument = async (file: File, loadId: string, type: Document['type']) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would upload the file to a server
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new document object
      const newDocument: Document = {
        id: `D${Math.floor(1000 + Math.random() * 9000)}`,
        loadId,
        type,
        name: file.name,
        uploadedAt: new Date().toISOString(),
        url: `/documents/${type}/${file.name}`
      };
      
      // Add the new document to the list
      setDocuments(prevDocuments => [...prevDocuments, newDocument]);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload document'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    documents,
    isLoading,
    error,
    refreshDocuments: fetchDocuments,
    uploadDocument
  };
};

export default useDocuments;