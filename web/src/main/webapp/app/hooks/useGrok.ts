import { useState, useCallback } from 'react';
import { grokService } from '../services/grokService';

interface UseGrokReturn {
  isLoading: boolean;
  error: string | null;
  askGrok: (question: string, codeContext?: string) => Promise<string>;
  generateComponent: (spec: string) => Promise<string>;
}

export const useGrok = (): UseGrokReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askGrok = useCallback(async (question: string, codeContext?: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = codeContext 
        ? await grokService.getCodeSuggestions(codeContext, question)
        : await grokService.chat([{ role: 'user', content: question }]);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateComponent = useCallback(async (spec: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await grokService.generateComponent(spec);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, askGrok, generateComponent };
};