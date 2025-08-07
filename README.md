# Octopus TMS MCP Servers

This directory contains Model Context Protocol (MCP) servers designed to boost development productivity for the Octopus TMS project.

## Available MCP Servers

### 1. Database MCP Server (`database-mcp`)
Provides direct database operations and query capabilities.

**Features:**
- Execute SQL queries safely
- List and describe tables
- Generate Flyway migrations
- Database schema exploration

**Tools:**
- `query_database` - Execute SQL queries
- `list_tables` - List all database tables
- `describe_table` - Get table schema information
- `generate_migration` - Create Flyway migration files

### 2. Testing MCP Server (`testing-mcp`)
Automated testing tools for comprehensive test coverage.

**Features:**
- Run backend Spring Boot tests
- Execute frontend Jest tests
- Run E2E Playwright tests
- Generate test files
- Create coverage reports

**Tools:**
- `run_backend_tests` - Run Java tests
- `run_frontend_tests` - Run React tests
- `run_e2e_tests` - Run Playwright tests
- `generate_test` - Generate test templates
- `coverage_report` - Generate coverage reports

### 3. Code Generation MCP Server (`codegen-mcp`)
Accelerate development with intelligent code generation.

**Features:**
- Generate React components with TypeScript
- Create Spring Boot services and controllers
- Generate DTOs with MapStruct mappers
- Create API client code
- Follow project conventions

**Tools:**
- `generate_component` - Create React components
- `generate_service` - Create Spring Boot services
- `generate_api_client` - Generate TypeScript API clients
- `generate_dto` - Create DTOs and mappers

## Installation

1. Install dependencies for each server:
```bash
cd mcp-servers/database-mcp && npm install
cd ../testing-mcp && npm install
cd ../codegen-mcp && npm install
```

2. Make servers executable:
```bash
chmod +x database-mcp/server.js
chmod +x testing-mcp/server.js
chmod +x codegen-mcp/server.js
```

## Configuration

Add to your MCP configuration file (usually `~/.config/mcp/config.json` or update the project's `mcp.config.json`):

```json
{
  "mcpServers": {
    "octopus-db": {
      "command": "node",
      "args": ["./mcp-servers/database-mcp/server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "5432",
        "DB_NAME": "octopus-tms-b",
        "DB_USER": "haydarovbahtiyar",
        "DB_PASSWORD": "password"
      }
    },
    "octopus-testing": {
      "command": "node",
      "args": ["./mcp-servers/testing-mcp/server.js"]
    },
    "octopus-codegen": {
      "command": "node",
      "args": ["./mcp-servers/codegen-mcp/server.js"]
    }
  }
}
```

## Usage Examples

### Database Operations
```
# List all tables
Use the octopus-db MCP server to list all tables

# Query specific data
Use octopus-db to query: SELECT * FROM loads WHERE status = 'PENDING'

# Generate a migration
Use octopus-db to generate a migration for adding an index on loads.created_at
```

### Testing
```
# Run all backend tests
Use octopus-testing to run backend tests for the broker module

# Generate a component test
Use octopus-testing to generate a test for LoadDetails component

# Run E2E tests
Use octopus-testing to run E2E tests with chromium in headed mode
```

### Code Generation
```
# Generate a new page component
Use octopus-codegen to generate a page component called LoadTracking in the shared module

# Create a complete service
Use octopus-codegen to generate a service for Shipment entity in shipper module with all CRUD operations

# Generate API client
Use octopus-codegen to create an API client for the carrier endpoints
```

## Benefits

1. **Faster Development**: Generate boilerplate code instantly
2. **Consistency**: All generated code follows project conventions
3. **Quality**: Built-in test generation ensures coverage
4. **Productivity**: Direct database access for quick queries
5. **Automation**: Run tests and generate reports with simple commands

## Extending

To add new capabilities:

1. Add new tools to the `tools/list` handler
2. Implement the tool logic in `tools/call` handler
3. Update this README with the new functionality

## Troubleshooting

- Ensure Node.js is installed (v18+ recommended)
- Check database credentials in environment variables
- Verify project structure matches expected paths
- Run servers with `--verbose` flag for debugging