# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Octopus TMS is a Transportation Management System built as a modular monolith with:
- **Backend**: Spring Boot 3.5.1 with Java 21, PostgreSQL, JWT authentication
- **Frontend**: React 19.1 with TypeScript, Webpack 5, Tailwind CSS
- **Architecture**: Domain-driven design with clear module boundaries

## Essential Commands

### Development Setup
```bash
# Install frontend dependencies
npm install

# NO DOCKER - Local PostgreSQL 14 running
# Database: octopus-tms-b
# Username: haydarovbahtiyar
# Password: password
# URL: jdbc:postgresql://localhost:5432/octopus-tms-b

# Run frontend dev server (port 3000)
npm run devserver

# Run Spring Boot backend
./gradlew bootRun -Dspring.profiles.active=local
# OR in IntelliJ: Set VM options: -Dspring.profiles.active=local
```

### Building & Testing
```bash
# Build entire application (frontend + backend)
./gradlew clean build

# Run frontend tests
npm run test

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
- **security/**: Authentication provider and guards
- **types/**: TypeScript type definitions
- **utils/**: Utility functions and API client

### Key Architectural Patterns

1. **Authentication**: JWT-based with role hierarchy (ADMIN > SUPERVISOR > DISPATCHER > DRIVER)
2. **API Design**: RESTful endpoints under `/api/`, OpenAPI documented
3. **Database**: UUID primary keys, Flyway migrations (must be idempotent)
4. **Testing**: 
   - Backend: Integration tests extend `BaseIT` with Testcontainers
   - Frontend: Jest with React Testing Library
5. **DTO Pattern**: Separate DTOs for requests/responses, MapStruct for mapping
6. **Security**: Role-based access control, JWT filter chain

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
// Tests use custom render with router wrapper
// Mock i18next translations
// Use React Testing Library queries
```

### Important Notes

1. **NO DOCKER**: Local PostgreSQL 14 running. Never suggest Docker.
2. **NO FLYWAY**: Temporarily removed for simplification
3. **Lombok**: Requires IDE plugin with annotation processing enabled
4. **MapStruct**: Generates mapper implementations at compile time
5. **Frontend Build**: Integrated into Gradle build, outputs to Spring Boot static resources
6. **Environment Config**: Use Spring profiles (local, production) and .env files
7. **Module Dependencies**: Core modules should not depend on domain-specific modules
8. **Focus**: Complete modules one at a time, starting with Broker module

### Test Users (Simplified)

Only 3 test users during development:
- **BROKER**: emily.anderson@octopus-tms.com (password: password)
- **SHIPPER**: shipper1@octopustms.com (password: password)  
- **CARRIER**: carrier1@octopustms.com (password: password)

### Authentication & Authorization

**Current Issue**: Role confusion - multiple employees at same company type (e.g., broker company) all have same role ("BROKER").

**Proposed Solution**: Multi-tenant architecture with Companies and User Profiles
- Companies have types: BROKER_COMPANY, SHIPPER_COMPANY, CARRIER_COMPANY
- Users belong to companies and have profiles/positions within company
- Permissions based on company type + user profile combination

**Focus**: Simplify authentication and complete one module at a time, starting with Broker module.