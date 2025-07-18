#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

class TestingMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'octopus-testing-mcp',
        version: '1.0.0',
        description: 'Automated testing tools for Octopus TMS',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'run_backend_tests',
          description: 'Run Spring Boot backend tests',
          inputSchema: {
            type: 'object',
            properties: {
              module: {
                type: 'string',
                description: 'Module to test (e.g., core, broker, shipper)',
              },
              testClass: {
                type: 'string',
                description: 'Specific test class to run (optional)',
              },
            },
          },
        },
        {
          name: 'run_frontend_tests',
          description: 'Run React frontend tests',
          inputSchema: {
            type: 'object',
            properties: {
              testFile: {
                type: 'string',
                description: 'Specific test file to run (optional)',
              },
              watch: {
                type: 'boolean',
                description: 'Run tests in watch mode',
                default: false,
              },
            },
          },
        },
        {
          name: 'run_e2e_tests',
          description: 'Run Playwright end-to-end tests',
          inputSchema: {
            type: 'object',
            properties: {
              browser: {
                type: 'string',
                enum: ['chromium', 'firefox', 'webkit'],
                description: 'Browser to use for tests',
                default: 'chromium',
              },
              headed: {
                type: 'boolean',
                description: 'Run tests in headed mode',
                default: false,
              },
            },
          },
        },
        {
          name: 'generate_test',
          description: 'Generate a test file for a component or service',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['component', 'service', 'integration', 'e2e'],
                description: 'Type of test to generate',
              },
              targetFile: {
                type: 'string',
                description: 'Path to the file to test',
              },
            },
            required: ['type', 'targetFile'],
          },
        },
        {
          name: 'coverage_report',
          description: 'Generate test coverage report',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['frontend', 'backend', 'all'],
                description: 'Type of coverage to generate',
                default: 'all',
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'run_backend_tests':
          return await this.runBackendTests(args.module, args.testClass);
        
        case 'run_frontend_tests':
          return await this.runFrontendTests(args.testFile, args.watch);
        
        case 'run_e2e_tests':
          return await this.runE2ETests(args.browser, args.headed);
        
        case 'generate_test':
          return await this.generateTest(args.type, args.targetFile);
        
        case 'coverage_report':
          return await this.generateCoverageReport(args.type);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async runBackendTests(module, testClass) {
    try {
      let command = './gradlew test';
      
      if (module) {
        command = `./gradlew :${module}:test`;
      }
      
      if (testClass) {
        command += ` --tests "${testClass}"`;
      }

      const { stdout, stderr } = await execAsync(command);
      
      return {
        content: [
          {
            type: 'text',
            text: `Backend tests executed:\n${stdout}\n${stderr}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Test execution failed: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async runFrontendTests(testFile, watch) {
    try {
      let command = 'npm test';
      
      if (testFile) {
        command += ` ${testFile}`;
      }
      
      if (!watch) {
        command += ' -- --watchAll=false';
      }

      const { stdout, stderr } = await execAsync(command, {
        cwd: 'web/src/main/webapp',
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Frontend tests executed:\n${stdout}\n${stderr}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Test execution failed: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async runE2ETests(browser, headed) {
    try {
      let command = `npm run test:e2e -- --browser=${browser}`;
      
      if (headed) {
        command += ' --headed';
      }

      const { stdout, stderr } = await execAsync(command, {
        cwd: 'web/src/main/webapp',
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `E2E tests executed:\n${stdout}\n${stderr}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `E2E test execution failed: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async generateTest(type, targetFile) {
    let testContent = '';
    const fileName = path.basename(targetFile);
    const componentName = fileName.replace(/\.(tsx?|jsx?|java)$/, '');

    switch (type) {
      case 'component':
        testContent = this.generateComponentTest(componentName);
        break;
      case 'service':
        testContent = this.generateServiceTest(componentName);
        break;
      case 'integration':
        testContent = this.generateIntegrationTest(componentName);
        break;
      case 'e2e':
        testContent = this.generateE2ETest(componentName);
        break;
    }

    return {
      content: [
        {
          type: 'text',
          text: testContent,
        },
      ],
    };
  }

  generateComponentTest(componentName) {
    return `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <${componentName} {...props} />
      </BrowserRouter>
    );
  };

  it('should render without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('${componentName.toLowerCase()}')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    renderComponent();
    // Add interaction tests
  });

  it('should display correct data', () => {
    const mockData = { /* mock data */ };
    renderComponent({ data: mockData });
    // Add data display tests
  });
});`;
  }

  generateServiceTest(serviceName) {
    return `import { ${serviceName} } from './${serviceName}';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('${serviceName}', () => {
  let service: ${serviceName};

  beforeEach(() => {
    service = new ${serviceName}();
  });

  describe('initialization', () => {
    it('should initialize correctly', () => {
      expect(service).toBeDefined();
    });
  });

  describe('methods', () => {
    it('should handle successful operations', async () => {
      // Add method tests
    });

    it('should handle errors gracefully', async () => {
      // Add error handling tests
    });
  });
});`;
  }

  generateIntegrationTest(className) {
    return `package tms.octopus.octopus_tms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class ${className}IT extends BaseIT {

    @Test
    void contextLoads() {
        assertThat(true).isTrue();
    }

    @Test
    void testEndpoint() throws Exception {
        // Add integration test
    }
}`;
  }

  generateE2ETest(pageName) {
    return `import { test, expect } from '@playwright/test';

test.describe('${pageName} Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Add login steps
  });

  test('should load successfully', async ({ page }) => {
    await page.goto('/${pageName.toLowerCase()}');
    await expect(page).toHaveTitle(/Octopus TMS/);
  });

  test('should display main elements', async ({ page }) => {
    await page.goto('/${pageName.toLowerCase()}');
    // Add element checks
  });

  test('should handle user interactions', async ({ page }) => {
    await page.goto('/${pageName.toLowerCase()}');
    // Add interaction tests
  });
});`;
  }

  async generateCoverageReport(type) {
    try {
      let commands = [];
      
      if (type === 'backend' || type === 'all') {
        commands.push('./gradlew jacocoTestReport');
      }
      
      if (type === 'frontend' || type === 'all') {
        commands.push('cd web/src/main/webapp && npm run test:coverage');
      }

      const results = await Promise.all(
        commands.map(cmd => execAsync(cmd))
      );

      return {
        content: [
          {
            type: 'text',
            text: `Coverage reports generated:\n${results.map(r => r.stdout).join('\n')}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Coverage generation failed: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Testing MCP Server started');
  }
}

const server = new TestingMCPServer();
server.start().catch(console.error);