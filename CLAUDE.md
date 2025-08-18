# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Octopus TMS is a Transportation Management System built as a modular monolith with:
- **Backend**: Spring Boot 3.5.1 with Java 21, PostgreSQL, JWT authentication (using com.auth0:java-jwt library)
- **Frontend**: React 18.2 with TypeScript, Vite 6.3.5, Tailwind CSS (with custom Poppins font)
- **Architecture**: Domain-driven design with clear module boundaries

## Essential Commands

### Development Setup
```bash
# Install frontend dependencies (in web/src/main/webapp)
cd web/src/main/webapp && npm install

# Database Configuration (NO DOCKER - user preference)
# Local PostgreSQL 14 running on port 5432
# Database: octopus-tms-b
# Username: haydarovbahtiyar
# Password: password
# URL: jdbc:postgresql://localhost:5432/octopus-tms-b

# Run frontend dev server (port 3000)
cd web/src/main/webapp && npm run dev

# Run Spring Boot backend
./gradlew bootRun -Dspring.profiles.active=local
# OR in IntelliJ: Set VM options: -Dspring.profiles.active=local
```

### Building & Testing
```bash
# Build entire application (frontend + backend)
./gradlew clean build

# Run frontend tests (in web/src/main/webapp)
npm run test:puppeteer  # Puppeteer tests
npm run test:playwright # Playwright E2E tests
npm run test:playwright:ui # Playwright with UI
npm run test:playwright:report # Show test report

# Run backend tests
./gradlew test

# Run specific test
./gradlew :module-name:test --tests "ClassName.methodName"

# Build production JAR
./gradlew bootJar

# Build Docker image (only if needed - user prefers no Docker)
# ./gradlew bootBuildImage --imageName=tms.octopus/octopus-tms
```

### Running the Application
```bash
# Development: Frontend on port 3000, backend on port 8080
# Production JAR includes frontend build
java -Dspring.profiles.active=production -jar ./web/build/libs/web-0.0.1-SNAPSHOT.jar
```

## Architecture & Structure

### Module Organization
The project follows a multi-module Gradle structure:
- **base**: Core infrastructure, configuration, shared utilities
- **core**: User management, authentication, companies, workflows, audit
- **load**: Load/shipment management
- **broker**: Broker dashboards and features
- **shipper**: Warehouse and inventory management
- **carrier**: Carrier, driver, and equipment management
- **financial**: Invoicing and payment processing
- **web**: Spring Boot application and React frontend

Each module contains:
```
module/
├── src/main/java/tms/octopus/octopus_tms/module/
│   ├── domain/        # JPA entities
│   ├── dto/           # Request/Response DTOs
│   ├── repository/    # Spring Data repositories
│   ├── service/       # Business logic
│   ├── controller/    # REST endpoints
│   └── mapper/        # MapStruct mappers
├── src/main/resources/db/migration/  # Flyway migrations
└── src/test/          # Tests and test data
```

### Frontend Structure
React code lives in `web/src/main/webapp/app/`:
- **components/**: Reusable UI components
- **pages/**: Page components for each route  
- **modules/**: Feature-specific modules
- **context/**: React Context providers for global state
- **hooks/**: Custom React hooks
- **services/**: API and business logic
- **types/**: TypeScript type definitions
- **utils/**: Utility functions and API client

### Key Architectural Patterns

1. **Authentication**: JWT-based using com.auth0:java-jwt library, currently with ADMIN and SALES_REP roles
2. **API Design**: RESTful endpoints under `/api/`, OpenAPI documented  
3. **Database**: UUID primary keys, Flyway temporarily disabled (commented out in build.gradle)
4. **Testing**: 
   - Backend: Integration tests extend `BaseIT` with Testcontainers
   - Frontend: Playwright for E2E testing, Puppeteer for screenshots
5. **DTO Pattern**: Separate DTOs for requests/responses, MapStruct for mapping
6. **Security**: Role-based access control, JWT filter chain with 60-minute token validity
7. **Environment Variables**: `.env` files for configuration (database, API keys, etc.)

### Development Environment

- **Database**: Local PostgreSQL 14 on port 5432 (NO DOCKER - user preference)
- **Backend**: Spring Boot on port 8080
- **Frontend Dev Server**: Webpack on port 3000 (proxies to backend)
- **Required Tools**: Java 21, Node.js 22

### Testing Approach

Backend integration tests:
```java
@SpringBootTest
class MyControllerIT extends BaseIT {
    // BaseIT provides JWT tokens for different roles
    // Uses Testcontainers for PostgreSQL and email testing
}
```

Frontend tests:
```typescript
// Unit tests use custom render with router wrapper
// Mock i18next translations
// Use React Testing Library queries
```

End-to-end testing:
```bash
# E2E tests with Playwright
npm run test:e2e

# Screenshot generation with Puppeteer
npm run screenshots
```

### Important Notes

1. **NO DOCKER FOR LOCAL DEV**: User prefers local PostgreSQL 14. Docker only for Testcontainers in tests.
2. **FLYWAY DISABLED**: Temporarily commented out in build.gradle (lines 198-199)
3. **Lombok**: Requires IDE plugin with annotation processing enabled
4. **MapStruct**: Generates mapper implementations at compile time (version 1.6.3)
5. **Frontend Build**: Vite build integrated into Gradle, outputs to `web/build/resources/main/static`
6. **Environment Config**: 
   - Spring profiles (local, production)
   - `.env` files for API keys and database config
   - Frontend uses Vite env vars (VITE_ prefix)
7. **Module Dependencies**: Core modules should not depend on domain-specific modules
8. **Tailwind CSS**: Configured with custom Poppins font and primary color palette

### Test Users

Only 3 test users during development (all with ADMIN role):
- **emily.anderson@octopus-tms.com** (password: password) - BROKER company type
- **shipper1@octopustms.com** (password: password) - SHIPPER company type
- **carrier1@octopustms.com** (password: password) - CARRIER company type

### Authentication & Authorization

**Architecture**: Multi-tenant system where:
- Users have roles: `ADMIN` or `SALES_REP` (defined in UserRole enum)
- Companies have types: `BROKER`, `SHIPPER`, `CARRIER` (defined in CompanyType enum)
- Access control is based on both user role AND company type combination
- Each user belongs to exactly one company

**Focus**: Simplify authentication and complete one module at a time, starting with Broker module.

## Claude Code Workflow Optimization

### Quick Start with Context
To start Claude Code with full project context:
```bash
# Option 1: Use the project prompt file
claude --append-system-prompt "$(cat .claude-prompt)"

# Option 2: Use aliases (after running: source setup-aliases.sh)
octi          # General development with full context
octi-test     # Testing focused mode
octi-b        # Broker module development
octi-s        # Shipper module development
octi-c        # Carrier module development
octi-ui       # Frontend development
octi-db       # Database work
```

### Productivity Tips

1. **Always start with context**: Use `--append-system-prompt` to maintain project awareness
2. **Use todo tracking**: Claude will use TodoWrite tool to manage complex tasks
3. **Reference specific sections**: Point Claude to CLAUDE.md sections when needed
4. **Test before complete**: Always run tests before marking tasks as done
5. **Module-specific work**: Use focused prompts for specific modules

### Quick Commands
```bash
# Run backend
octi-run         # Alias for: ./gradlew bootRun -Dspring.profiles.active=local

# Run frontend
octi-ui-run      # Alias for: npm run devserver

# Build project
octi-build       # Alias for: ./gradlew clean build

# E2E testing
octi-e2e         # Alias for: npm run test:e2e

# Screenshots
octi-screenshot  # Alias for: npm run screenshots
```

### Daily Workflow
1. Start Claude with project context using aliases
2. Let Claude manage tasks with TodoWrite tool
3. Verify changes with appropriate tests
4. Use Claude's git integration for consistent commits
5. Focus on completing one feature/module at a time