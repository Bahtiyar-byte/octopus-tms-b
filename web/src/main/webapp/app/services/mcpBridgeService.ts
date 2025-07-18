import { grokService } from './grokService';
import { 
  MCPTool, 
  MCPToolResponse,
  CleanupComponentsParams,
  FixTypeScriptTypesParams,
  ConsolidateDuplicatesParams 
} from '../types/core/mcp.types';

class MCPBridgeService {
  private tools: Map<string, MCPTool<any, any>> = new Map();

  constructor() {
    this.registerDefaultTools();
  }

  private registerDefaultTools() {
    // Frontend cleanup tool
    this.registerTool<CleanupComponentsParams, MCPToolResponse>({
      name: 'cleanup_components',
      description: 'Analyze and clean up duplicate React components',
      execute: async (params) => {
        const { componentPath, action } = params;
        const question = `Analyze this component at ${componentPath} and suggest ${action} improvements following Octopus TMS patterns`;
        const result = await grokService.getCodeSuggestions('', question);
        return { success: true, result };
      }
    });

    // Type safety tool
    this.registerTool<FixTypeScriptTypesParams, MCPToolResponse>({
      name: 'fix_typescript_types',
      description: 'Replace any types with proper TypeScript interfaces',
      execute: async (params) => {
        const { code } = params;
        const question = 'Replace all "any" types in this code with proper TypeScript interfaces';
        const result = await grokService.getCodeSuggestions(code, question);
        return { success: true, result };
      }
    });

    // Component consolidation tool
    this.registerTool<ConsolidateDuplicatesParams, MCPToolResponse>({
      name: 'consolidate_duplicates',
      description: 'Merge duplicate components into a single configurable component',
      execute: async (params) => {
        const { components } = params;
        const question = `Consolidate these duplicate components into one: ${components.join(', ')}`;
        const result = await grokService.generateComponent(question);
        return { success: true, result };
      }
    });
  }

  registerTool<TParams = any, TResponse = any>(tool: MCPTool<TParams, TResponse>) {
    this.tools.set(tool.name, tool as MCPTool<any, any>);
  }

  async executeTool<TParams = any, TResponse = MCPToolResponse>(
    toolName: string, 
    params: TParams
  ): Promise<TResponse> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    return await tool.execute(params);
  }

  listTools() {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description
    }));
  }
}

export const mcpBridge = new MCPBridgeService();
