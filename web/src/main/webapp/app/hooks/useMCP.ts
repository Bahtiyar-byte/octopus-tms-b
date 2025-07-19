import { useState, useCallback } from 'react';
import { mcpBridge } from '../services/mcpBridgeService';
import { MCPToolParams, MCPToolResponse } from '../types/core/mcp.types';

interface UseMCPReturn {
  isExecuting: boolean;
  error: string | null;
  executeTool: <TParams = MCPToolParams, TResponse = MCPToolResponse>(
    toolName: string, 
    params: TParams
  ) => Promise<TResponse>;
  listAvailableTools: () => Array<{ name: string; description: string }>;
}

export const useMCP = (): UseMCPReturn => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTool = useCallback(async <TParams = MCPToolParams, TResponse = MCPToolResponse>(
    toolName: string, 
    params: TParams
  ): Promise<TResponse> => {
    setIsExecuting(true);
    setError(null);

    try {
      const result = await mcpBridge.executeTool<TParams, TResponse>(toolName, params);
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
