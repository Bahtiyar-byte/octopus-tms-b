#!/bin/bash

echo "Setting up Octopus TMS MCP Servers..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Install dependencies for each server
echo -e "${BLUE}Installing database-mcp dependencies...${NC}"
cd database-mcp
npm install
chmod +x server.js
cd ..

echo -e "${BLUE}Installing testing-mcp dependencies...${NC}"
cd testing-mcp
npm install
chmod +x server.js
cd ..

echo -e "${BLUE}Installing codegen-mcp dependencies...${NC}"
cd codegen-mcp
npm install
chmod +x server.js
cd ..

echo -e "${GREEN}✓ MCP Servers setup complete!${NC}"
echo ""
echo "Available MCP Servers:"
echo "  - octopus-db: Database operations and queries"
echo "  - octopus-testing: Automated testing tools"
echo "  - octopus-codegen: Code generation utilities"
echo ""
echo "These servers have been added to your mcp.config.json"
echo "Restart Claude Code to use the new MCP servers."