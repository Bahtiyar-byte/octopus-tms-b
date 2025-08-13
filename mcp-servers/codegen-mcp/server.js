#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import fs from 'fs/promises';
import path from 'path';

class CodeGenMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'octopus-codegen-mcp',
        version: '1.0.0',
        description: 'Code generation tools for Octopus TMS',
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
          name: 'generate_component',
          description: 'Generate a React component with TypeScript',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Component name (e.g., LoadDetails)',
              },
              type: {
                type: 'string',
                enum: ['page', 'component', 'modal', 'form'],
                description: 'Type of component to generate',
              },
              module: {
                type: 'string',
                enum: ['shared', 'broker', 'shipper', 'carrier'],
                description: 'Module where component belongs',
              },
            },
            required: ['name', 'type', 'module'],
          },
        },
        {
          name: 'generate_service',
          description: 'Generate a Spring Boot service with repository',
          inputSchema: {
            type: 'object',
            properties: {
              entityName: {
                type: 'string',
                description: 'Entity name (e.g., Load, Carrier)',
              },
              module: {
                type: 'string',
                description: 'Module name (e.g., broker, shipper)',
              },
              operations: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['create', 'read', 'update', 'delete', 'list', 'search'],
                },
                description: 'CRUD operations to include',
              },
            },
            required: ['entityName', 'module'],
          },
        },
        {
          name: 'generate_api_client',
          description: 'Generate TypeScript API client for backend endpoints',
          inputSchema: {
            type: 'object',
            properties: {
              apiName: {
                type: 'string',
                description: 'API name (e.g., LoadAPI, CarrierAPI)',
              },
              endpoints: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    method: { type: 'string' },
                    path: { type: 'string' },
                    name: { type: 'string' },
                  },
                },
                description: 'List of endpoints to generate',
              },
            },
            required: ['apiName', 'endpoints'],
          },
        },
        {
          name: 'generate_dto',
          description: 'Generate DTO classes with MapStruct mappers',
          inputSchema: {
            type: 'object',
            properties: {
              entityName: {
                type: 'string',
                description: 'Entity name for DTO',
              },
              fields: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    type: { type: 'string' },
                    required: { type: 'boolean' },
                  },
                },
                description: 'Fields for the DTO',
              },
            },
            required: ['entityName', 'fields'],
          },
        },
      ],
    }));

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'generate_component':
          return await this.generateComponent(args.name, args.type, args.module);
        
        case 'generate_service':
          return await this.generateService(args.entityName, args.module, args.operations);
        
        case 'generate_api_client':
          return await this.generateAPIClient(args.apiName, args.endpoints);
        
        case 'generate_dto':
          return await this.generateDTO(args.entityName, args.fields);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async generateComponent(name, type, module) {
    const componentContent = this.getComponentTemplate(name, type);
    const testContent = this.getComponentTestTemplate(name);
    const styleContent = this.getStyleTemplate(name);

    const basePath = `web/src/main/webapp/app/modules/${module}/${type}s/${name}`;

    return {
      content: [
        {
          type: 'text',
          text: `Generated ${type} component: ${name}

Component file (${name}.tsx):
${componentContent}

Test file (${name}.test.tsx):
${testContent}

Style file (${name}.module.css):
${styleContent}

Files would be created at:
- ${basePath}/${name}.tsx
- ${basePath}/${name}.test.tsx
- ${basePath}/${name}.module.css`,
        },
      ],
    };
  }

  getComponentTemplate(name, type) {
    const templates = {
      page: `import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import styles from './${name}.module.css';

interface ${name}Props {
  // Add props here
}

export const ${name}: React.FC<${name}Props> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Add API call here
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>{t('${name.toLowerCase()}.title')}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {/* Add content here */}
        </div>
      )}
    </div>
  );
};

export default ${name};`,

      component: `import React from 'react';
import styles from './${name}.module.css';

interface ${name}Props {
  // Add props here
}

export const ${name}: React.FC<${name}Props> = (props) => {
  return (
    <div className={styles.container} data-testid="${name.toLowerCase()}">
      {/* Add component content here */}
    </div>
  );
};`,

      modal: `import React from 'react';
import { X } from 'lucide-react';
import styles from './${name}.module.css';

interface ${name}Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ${name}: React.FC<${name}Props> = ({ isOpen, onClose, title = 'Modal' }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.content}>
          {/* Add modal content here */}
        </div>
      </div>
    </div>
  );
};`,

      form: `import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import styles from './${name}.module.css';

interface ${name}Data {
  // Add form fields here
}

interface ${name}Props {
  onSubmit: (data: ${name}Data) => Promise<void>;
  initialData?: Partial<${name}Data>;
}

export const ${name}: React.FC<${name}Props> = ({ onSubmit, initialData }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<${name}Data>({
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: ${name}Data) => {
    try {
      setLoading(true);
      await onSubmit(data);
      toast.success('Form submitted successfully');
    } catch (error) {
      toast.error('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      {/* Add form fields here */}
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};`,
    };

    return templates[type] || templates.component;
  }

  getComponentTestTemplate(name) {
    return `import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ${name} } from './${name}';

const MockedComponent = (props: any) => (
  <BrowserRouter>
    <${name} {...props} />
  </BrowserRouter>
);

describe('${name}', () => {
  it('should render without crashing', () => {
    render(<MockedComponent />);
    expect(screen.getByTestId('${name.toLowerCase()}')).toBeInTheDocument();
  });

  // Add more tests here
});`;
  }

  getStyleTemplate(name) {
    return `.container {
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

/* Add more styles as needed */`;
  }

  async generateService(entityName, module, operations = ['create', 'read', 'update', 'delete', 'list']) {
    const serviceContent = this.getServiceTemplate(entityName, module, operations);
    const repositoryContent = this.getRepositoryTemplate(entityName, module);
    const controllerContent = this.getControllerTemplate(entityName, module, operations);

    return {
      content: [
        {
          type: 'text',
          text: `Generated Spring Boot service for ${entityName}:

Service (${entityName}Service.java):
${serviceContent}

Repository (${entityName}Repository.java):
${repositoryContent}

Controller (${entityName}Controller.java):
${controllerContent}`,
        },
      ],
    };
  }

  getServiceTemplate(entityName, module, operations) {
    const className = `${entityName}Service`;
    const entityVar = entityName.charAt(0).toLowerCase() + entityName.slice(1);

    return `package tms.octopus.octopus_tms.${module}.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tms.octopus.octopus_tms.${module}.domain.${entityName};
import tms.octopus.octopus_tms.${module}.repository.${entityName}Repository;
import tms.octopus.octopus_tms.${module}.dto.${entityName}DTO;
import tms.octopus.octopus_tms.${module}.mapper.${entityName}Mapper;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ${className} {
    
    private final ${entityName}Repository repository;
    private final ${entityName}Mapper mapper;
    
    ${operations.includes('create') ? `
    public ${entityName}DTO create(${entityName}DTO dto) {
        log.info("Creating new ${entityName}");
        ${entityName} entity = mapper.toEntity(dto);
        entity = repository.save(entity);
        return mapper.toDTO(entity);
    }` : ''}
    
    ${operations.includes('read') ? `
    public ${entityName}DTO findById(UUID id) {
        log.info("Finding ${entityName} by id: {}", id);
        return repository.findById(id)
            .map(mapper::toDTO)
            .orElseThrow(() -> new RuntimeException("${entityName} not found"));
    }` : ''}
    
    ${operations.includes('update') ? `
    public ${entityName}DTO update(UUID id, ${entityName}DTO dto) {
        log.info("Updating ${entityName} with id: {}", id);
        ${entityName} entity = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("${entityName} not found"));
        mapper.updateEntityFromDTO(dto, entity);
        entity = repository.save(entity);
        return mapper.toDTO(entity);
    }` : ''}
    
    ${operations.includes('delete') ? `
    public void delete(UUID id) {
        log.info("Deleting ${entityName} with id: {}", id);
        repository.deleteById(id);
    }` : ''}
    
    ${operations.includes('list') ? `
    public List<${entityName}DTO> findAll() {
        log.info("Finding all ${entityName}s");
        return repository.findAll()
            .stream()
            .map(mapper::toDTO)
            .toList();
    }` : ''}
}`;
  }

  getRepositoryTemplate(entityName, module) {
    return `package tms.octopus.octopus_tms.${module}.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tms.octopus.octopus_tms.${module}.domain.${entityName};

import java.util.UUID;

@Repository
public interface ${entityName}Repository extends JpaRepository<${entityName}, UUID> {
    // Add custom queries here
}`;
  }

  getControllerTemplate(entityName, module, operations) {
    const controllerName = `${entityName}Controller`;
    const basePath = `/${module}/${entityName.toLowerCase()}s`;

    return `package tms.octopus.octopus_tms.${module}.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tms.octopus.octopus_tms.${module}.dto.${entityName}DTO;
import tms.octopus.octopus_tms.${module}.service.${entityName}Service;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api${basePath}")
@RequiredArgsConstructor
public class ${controllerName} {
    
    private final ${entityName}Service service;
    
    ${operations.includes('create') ? `
    @PostMapping
    public ResponseEntity<${entityName}DTO> create(@Valid @RequestBody ${entityName}DTO dto) {
        log.info("Creating new ${entityName}");
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }` : ''}
    
    ${operations.includes('read') ? `
    @GetMapping("/{id}")
    public ResponseEntity<${entityName}DTO> getById(@PathVariable UUID id) {
        log.info("Getting ${entityName} by id: {}", id);
        return ResponseEntity.ok(service.findById(id));
    }` : ''}
    
    ${operations.includes('update') ? `
    @PutMapping("/{id}")
    public ResponseEntity<${entityName}DTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody ${entityName}DTO dto) {
        log.info("Updating ${entityName} with id: {}", id);
        return ResponseEntity.ok(service.update(id, dto));
    }` : ''}
    
    ${operations.includes('delete') ? `
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("Deleting ${entityName} with id: {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }` : ''}
    
    ${operations.includes('list') ? `
    @GetMapping
    public ResponseEntity<List<${entityName}DTO>> getAll() {
        log.info("Getting all ${entityName}s");
        return ResponseEntity.ok(service.findAll());
    }` : ''}
}`;
  }

  async generateAPIClient(apiName, endpoints) {
    const apiContent = this.getAPIClientTemplate(apiName, endpoints);
    const typesContent = this.getAPITypesTemplate(apiName);

    return {
      content: [
        {
          type: 'text',
          text: `Generated TypeScript API client:

API Client (${apiName}.ts):
${apiContent}

Types (${apiName}.types.ts):
${typesContent}`,
        },
      ],
    };
  }

  getAPIClientTemplate(apiName, endpoints) {
    const endpointMethods = endpoints.map(endpoint => {
      const methodName = endpoint.name || endpoint.path.split('/').pop();
      const hasParams = endpoint.path.includes(':');
      
      return `  async ${methodName}(${hasParams ? 'id: string, ' : ''}${endpoint.method !== 'GET' ? 'data: any' : ''}) {
    const response = await apiClient.${endpoint.method.toLowerCase()}(
      \`${endpoint.path.replace(/:(\w+)/g, '${$1}')}\`${endpoint.method !== 'GET' ? ', data' : ''}
    );
    return response.data;
  }`;
    }).join('\n\n');

    return `import { apiClient } from '../../../utils/apiClient';
import { ${apiName}Response, ${apiName}Request } from './${apiName}.types';

class ${apiName} {
${endpointMethods}
}

export const ${apiName.charAt(0).toLowerCase() + apiName.slice(1)} = new ${apiName}();`;
  }

  getAPITypesTemplate(apiName) {
    return `export interface ${apiName}Response {
  id: string;
  // Add response fields
}

export interface ${apiName}Request {
  // Add request fields
}

export interface ${apiName}ListResponse {
  items: ${apiName}Response[];
  total: number;
  page: number;
  pageSize: number;
}`;
  }

  async generateDTO(entityName, fields) {
    const dtoContent = this.getDTOTemplate(entityName, fields);
    const mapperContent = this.getMapperTemplate(entityName);

    return {
      content: [
        {
          type: 'text',
          text: `Generated DTO and Mapper:

DTO (${entityName}DTO.java):
${dtoContent}

Mapper (${entityName}Mapper.java):
${mapperContent}`,
        },
      ],
    };
  }

  getDTOTemplate(entityName, fields) {
    const fieldDeclarations = fields.map(field => {
      const javaType = this.getJavaType(field.type);
      const validation = field.required ? '@NotNull' : '';
      return `    ${validation}
    private ${javaType} ${field.name};`;
    }).join('\n\n');

    return `package tms.octopus.octopus_tms.dto;

import lombok.Data;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ${entityName}DTO {
${fieldDeclarations}
}`;
  }

  getMapperTemplate(entityName) {
    return `package tms.octopus.octopus_tms.mapper;

import org.mapstruct.*;
import tms.octopus.octopus_tms.domain.${entityName};
import tms.octopus.octopus_tms.dto.${entityName}DTO;

@Mapper(componentModel = "spring")
public interface ${entityName}Mapper {
    
    ${entityName}DTO toDTO(${entityName} entity);
    
    ${entityName} toEntity(${entityName}DTO dto);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(${entityName}DTO dto, @MappingTarget ${entityName} entity);
}`;
  }

  getJavaType(type) {
    const typeMap = {
      'string': 'String',
      'number': 'Long',
      'boolean': 'Boolean',
      'date': 'LocalDateTime',
      'uuid': 'UUID',
      'decimal': 'BigDecimal',
    };
    return typeMap[type.toLowerCase()] || 'String';
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('CodeGen MCP Server started');
  }
}

const server = new CodeGenMCPServer();
server.start().catch(console.error);