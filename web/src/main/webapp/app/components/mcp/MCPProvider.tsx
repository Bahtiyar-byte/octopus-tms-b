import React, { createContext, useContext, ReactNode } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CopilotKit } from '@copilotkit/react-core';

interface MCPContextType {
  isConnected: boolean;
  connectToServer: (serverUrl: string) => Promise<void>;
}

const MCPContext = createContext<MCPContextType | undefined>(undefined);

interface MCPProviderProps {
  children: ReactNode;
}

export const MCPProvider: React.FC<MCPProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(false);

  const connectToServer = async (serverUrl: string) => {
    try {
      // MCP connection logic here
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
    }
  };

  return (
    <MCPContext.Provider value={{ isConnected, connectToServer }}>
      <CopilotKit url={''} >
        {children}
      </CopilotKit>
    </MCPContext.Provider>
  );
};

export const useMCP = () => {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCP must be used within MCPProvider');
  }
  return context;
};