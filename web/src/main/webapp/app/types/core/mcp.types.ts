/**
 * MCP (Model Context Protocol) type definitions
 */

// Tool parameter types
export interface CleanupComponentsParams {
  componentPath: string;
  action: 'refactor' | 'simplify' | 'modularize';
}

export interface FixTypeScriptTypesParams {
  code: string;
}

export interface ConsolidateDuplicatesParams {
  components: string[];
}

export type MCPToolParams = 
  | CleanupComponentsParams 
  | FixTypeScriptTypesParams 
  | ConsolidateDuplicatesParams;

// Tool response types
export interface MCPToolResponse {
  success: boolean;
  result?: string;
  error?: string;
  suggestions?: string[];
}

// Tool definition
export interface MCPTool<TParams = MCPToolParams, TResponse = MCPToolResponse> {
  name: string;
  description: string;
  execute: (params: TParams) => Promise<TResponse>;
}