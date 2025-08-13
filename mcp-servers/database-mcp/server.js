#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseMCPServer {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'octopus-tms-b',
      user: process.env.DB_USER || 'haydarovbahtiyar',
      password: process.env.DB_PASSWORD || 'password',
    });

    this.server = new Server(
      {
        name: 'octopus-db-mcp',
        version: '1.0.0',
        description: 'Database operations for Octopus TMS',
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
          name: 'query_database',
          description: 'Execute a SQL query on the Octopus TMS database',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'SQL query to execute',
              },
              params: {
                type: 'array',
                description: 'Query parameters for prepared statements',
                items: { type: 'string' },
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'list_tables',
          description: 'List all tables in the database',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'describe_table',
          description: 'Get schema information for a table',
          inputSchema: {
            type: 'object',
            properties: {
              tableName: {
                type: 'string',
                description: 'Name of the table to describe',
              },
            },
            required: ['tableName'],
          },
        },
        {
          name: 'generate_migration',
          description: 'Generate a Flyway migration file',
          inputSchema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: 'Description of the migration',
              },
              sql: {
                type: 'string',
                description: 'SQL statements for the migration',
              },
            },
            required: ['description', 'sql'],
          },
        },
      ],
    }));

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'query_database':
          return await this.queryDatabase(args.query, args.params);
        
        case 'list_tables':
          return await this.listTables();
        
        case 'describe_table':
          return await this.describeTable(args.tableName);
        
        case 'generate_migration':
          return await this.generateMigration(args.description, args.sql);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async queryDatabase(query, params = []) {
    try {
      const result = await this.pool.query(query, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              rows: result.rows,
              rowCount: result.rowCount,
              fields: result.fields?.map(f => ({ name: f.name, dataType: f.dataTypeID })),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing query: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async listTables() {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    return await this.queryDatabase(query);
  }

  async describeTable(tableName) {
    const query = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `;
    
    return await this.queryDatabase(query, [tableName]);
  }

  async generateMigration(description, sql) {
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const fileName = `V${timestamp}__${description.replace(/\s+/g, '_')}.sql`;
    
    const migrationContent = `-- ${description}
-- Generated at: ${new Date().toISOString()}

${sql}
`;

    return {
      content: [
        {
          type: 'text',
          text: `Migration file generated: ${fileName}\n\nContent:\n${migrationContent}`,
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Database MCP Server started');
  }
}

const server = new DatabaseMCPServer();
server.start().catch(console.error);