import axios from 'axios';

interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GrokResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      refusal: string | null;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class GrokService {
  private readonly baseURL = 'https://api.x.ai/v1/chat/completions';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_GROK_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Grok API key not found. Please set REACT_APP_GROK_API_KEY environment variable.');
    }
  }

  async chat(messages: GrokMessage[], temperature = 0.7): Promise<string> {
    try {
      const response = await axios.post<GrokResponse>(this.baseURL, {
        messages,
        model: 'grok-4-0709',
        stream: false,
        temperature
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Grok API error:', error);
      throw new Error('Failed to communicate with Grok API');
    }
  }

  // Project-aware assistant for code suggestions
  async getCodeSuggestions(codeContext: string, question: string): Promise<string> {
    const systemPrompt = `You are an expert React TypeScript developer working on the Octopus TMS project. 
    The project structure includes:
    - React 18.2.0 with TypeScript 5.0.4
    - Zustand for state management
    - React Router for navigation
    - Tailwind CSS for styling
    - Module-based architecture (broker, carrier, shipper, shared)
    
    Current code context: ${codeContext}
    
    Provide specific, actionable suggestions that follow the project's patterns and best practices.`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ]);
  }

  // Component generation assistant
  async generateComponent(componentSpec: string): Promise<string> {
    const systemPrompt = `You are a React TypeScript component generator for the Octopus TMS project.
    Generate clean, type-safe components using:
    - Proper TypeScript interfaces
    - Tailwind CSS classes
    - React functional components with hooks
    - Follow the project's existing patterns
    
    Always include proper imports and export statements.`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate a component: ${componentSpec}` }
    ]);
  }
}

export const grokService = new GrokService();