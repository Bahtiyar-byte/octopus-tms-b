import { useState, useCallback } from 'react';
import { mcpBridge } from '../services/mcpBridgeService';

interface UseMCPReturn {
  isExecuting: boolean;
  error: string | null;
  executeTool: (toolName: string, params: any) => Promise<any>;
  listAvailableTools: () => Array<{ name: string; description: string }>;
}

export const useMCP = (): UseMCPReturn => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTool = useCallback(async (toolName: string, params: any) => {
    setIsExecuting(true);
    setError(null);

    try {
      const result = await mcpBridge.executeTool(toolName, params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tool execution failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const listAvailableTools = useCallback(() => {
    return mcpBridge.listTools();
  }, []);

  return { isExecuting, error, executeTool, listAvailableTools };
};
