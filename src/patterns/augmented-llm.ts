import { PatternConfig } from '../types';

export function getAugmentedLLMPattern(): PatternConfig {
  return {
    name: 'Augmented LLM',
    description: 'Enhanced LLM with tools, retrieval, and memory capabilities',
    files: [
      // Package.json
      {
        path: 'package.json',
        content: `{
  "name": "{{PROJECT_NAME}}",
  "version": "1.0.0",
  "description": "{{PROJECT_DESCRIPTION}}",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js",
    "test": "node --experimental-vm-modules node_modules/.bin/jest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@openai/agents": "^0.0.11",
    "dotenv": "^16.0.0",
    "zod": "<=3.25.67"
  },
  "devDependencies": {
    "@types/jest": "^29.0.0",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`,
      },
      
      // TypeScript config
      {
        path: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
      },

      // Main agent implementation
      {
        path: 'src/index.ts',
        content: `import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY is not set');
  console.error('Please create a .env file with your OpenAI API key:');
  console.error('OPENAI_API_KEY=your-api-key-here');
  process.exit(1);
}

import { Agent, run } from '@openai/agents';
import { webSearchTool } from './tools/web-search';
import { readFileTool, writeFileTool, checkFileExistsTool } from './tools/file-system';
import { calculatorTool } from './tools/calculator';
import { storeMemoryTool, retrieveMemoryTool, listMemoryTool } from './tools/memory';
import { inputGuardrail } from './guardrails/input';
import { outputGuardrail } from './guardrails/output';
import { AgentContext } from './context/types';

const agent = new Agent<AgentContext>({
  name: 'Augmented Research Assistant',
  instructions: \`You are an advanced research assistant with access to powerful tools.
  
Your capabilities include:
- Web search for current information
- File system operations for document management
- Mathematical calculations
- Memory management for context retention

Guidelines:
- Always verify information from multiple sources when possible
- Use the memory tools to retain important information across conversations
- Break down complex problems into smaller, manageable tasks
- Provide clear, well-structured responses with proper citations
- Ask clarifying questions when requests are ambiguous

Available tools:
- web_search: Search the web for information
- read_file: Read file contents
- write_file: Write content to files
- check_file_exists: Check if files exist
- calculator: Perform mathematical calculations
- store_memory: Store information for later use
- retrieve_memory: Retrieve stored information
- list_memory: List stored memory keys

Remember to be helpful, accurate, and thorough in your responses.\`,
  
  tools: [
    webSearchTool,
    readFileTool,
    writeFileTool,
    checkFileExistsTool,
    calculatorTool,
    storeMemoryTool,
    retrieveMemoryTool,
    listMemoryTool,
  ],
  
  inputGuardrails: [
    inputGuardrail,
  ],
  
  outputGuardrails: [
    outputGuardrail,
  ],
});

async function main() {
  try {
    console.log('🤖 Augmented LLM Agent starting...');
    
    const context: AgentContext = {
      memory: new Map(),
      sessionId: Date.now().toString(),
    };
    
    // Example usage
    const result = await run(
      agent,
      'Hello! Can you help me research the latest developments in AI agents?',
      { context }
    );
    
    console.log('Agent response:', result.finalOutput);
  } catch (error) {
    console.error('Error:', error);
  }
}

if (import.meta.url === \`file://\${process.argv[1]}\`) {
  main();
}

export { agent };`,
      },

      // Context types
      {
        path: 'src/context/types.ts',
        content: `export interface AgentContext {
  memory: Map<string, any>;
  sessionId: string;
}`,
      },

      // Web search tool
      {
        path: 'src/tools/web-search.ts',
        content: `import { tool } from '@openai/agents';
import { z } from 'zod';

export const webSearchTool = tool({
  name: 'web_search',
  description: 'Search the web for current information on any topic',
  parameters: z.object({
    query: z.string().describe('The search query'),
    maxResults: z.number().default(5).describe('Maximum number of results to return'),
  }),
  async execute({ query, maxResults = 5 }) {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would use a web search API
      return {
        query,
        results: [
          {
            title: 'Example search result',
            url: 'https://example.com',
            snippet: 'This is a placeholder search result for: ' + query,
          },
        ],
        message: \`Found search results for: "\${query}". Note: This is a placeholder implementation.\`,
      };
    } catch (error) {
      return {
        error: 'Failed to perform web search',
        message: 'Web search is currently unavailable',
      };
    }
  },
});`,
      },

      // File system tools
      {
        path: 'src/tools/file-system.ts',
        content: `import { tool } from '@openai/agents';
import { z } from 'zod';
import { readFileSync, writeFileSync, existsSync } from 'fs';

export const readFileTool = tool({
  name: 'read_file',
  description: 'Read the contents of a file',
  parameters: z.object({
    path: z.string().describe('The file path to read'),
  }),
  async execute({ path }) {
    try {
      if (!existsSync(path)) {
        return { error: 'File not found', path };
      }
      const content = readFileSync(path, 'utf-8');
      return { content, path };
    } catch (error) {
      return {
        error: 'Failed to read file',
        message: error instanceof Error ? error.message : 'Unknown error',
        path,
      };
    }
  },
});

export const writeFileTool = tool({
  name: 'write_file',
  description: 'Write content to a file',
  parameters: z.object({
    path: z.string().describe('The file path to write to'),
    content: z.string().describe('The content to write'),
  }),
  async execute({ path, content }) {
    try {
      writeFileSync(path, content);
      return { message: 'File written successfully', path };
    } catch (error) {
      return {
        error: 'Failed to write file',
        message: error instanceof Error ? error.message : 'Unknown error',
        path,
      };
    }
  },
});

export const checkFileExistsTool = tool({
  name: 'check_file_exists',
  description: 'Check if a file exists',
  parameters: z.object({
    path: z.string().describe('The file path to check'),
  }),
  async execute({ path }) {
    try {
      return { exists: existsSync(path), path };
    } catch (error) {
      return {
        error: 'Failed to check file existence',
        message: error instanceof Error ? error.message : 'Unknown error',
        path,
      };
    }
  },
});

// Export all tools for convenience
export const fileSystemTool = readFileTool;`,
      },

      // Calculator tool
      {
        path: 'src/tools/calculator.ts',
        content: `import { tool } from '@openai/agents';
import { z } from 'zod';

export const calculatorTool = tool({
  name: 'calculator',
  description: 'Perform mathematical calculations and evaluations',
  parameters: z.object({
    expression: z.string().describe('Mathematical expression to evaluate'),
  }),
  async execute({ expression }) {
    try {
      // Basic expression evaluation (in production, use a proper math library)
      const sanitizedExpression = expression.replace(/[^0-9+\\-*/().\\s]/g, '');
      
      if (sanitizedExpression !== expression) {
        return {
          error: 'Invalid characters in expression',
          expression: expression,
        };
      }
      
      const result = eval(sanitizedExpression);
      
      return {
        expression: expression,
        result: result,
        message: \`\${expression} = \${result}\`,
      };
    } catch (error) {
      return {
        error: 'Calculation failed',
        expression: expression,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});`,
      },

      // Memory tools
      {
        path: 'src/tools/memory.ts',
        content: `import { tool } from '@openai/agents';
import { z } from 'zod';
import { AgentContext } from '../context/types';

export const storeMemoryTool = tool({
  name: 'store_memory',
  description: 'Store information in memory for later retrieval',
  parameters: z.object({
    key: z.string().describe('Memory key to store the value under'),
    value: z.string().describe('Value to store'),
  }),
  async execute({ key, value }, context) {
    try {
      const agentContext = context as unknown as AgentContext;
      
      if (!agentContext || !agentContext.memory) {
        return { error: 'Memory context not available' };
      }
      
      agentContext.memory.set(key, value);
      return { message: \`Stored value for key: \${key}\`, key, value };
    } catch (error) {
      return {
        error: 'Memory operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const retrieveMemoryTool = tool({
  name: 'retrieve_memory',
  description: 'Retrieve information from memory',
  parameters: z.object({
    key: z.string().describe('Memory key to retrieve'),
  }),
  async execute({ key }, context) {
    try {
      const agentContext = context as unknown as AgentContext;
      
      if (!agentContext || !agentContext.memory) {
        return { error: 'Memory context not available' };
      }
      
      const retrievedValue = agentContext.memory.get(key);
      if (retrievedValue === undefined) {
        return { message: \`No value found for key: \${key}\`, key };
      }
      return { key, value: retrievedValue };
    } catch (error) {
      return {
        error: 'Memory operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const listMemoryTool = tool({
  name: 'list_memory',
  description: 'List all stored memory keys',
  parameters: z.object({}),
  async execute({}, context) {
    try {
      const agentContext = context as unknown as AgentContext;
      
      if (!agentContext || !agentContext.memory) {
        return { error: 'Memory context not available' };
      }
      
      const keys = Array.from(agentContext.memory.keys());
      return { keys, message: \`Memory contains \${keys.length} items\` };
    } catch (error) {
      return {
        error: 'Memory operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

// Export main tool for convenience
export const memoryTool = storeMemoryTool;`,
      },

      // Input guardrail
      {
        path: 'src/guardrails/input.ts',
        content: `import { InputGuardrail } from '@openai/agents';

export const inputGuardrail: InputGuardrail = {
  name: 'input_validation',
  async execute({ input, context }) {
    // Extract text content from input
    let textContent = '';
    if (typeof input === 'string') {
      textContent = input;
    } else if (input && typeof input === 'object' && 'content' in input) {
      if (typeof input.content === 'string') {
        textContent = input.content;
      } else if (Array.isArray(input.content)) {
        textContent = input.content
          .filter(item => item.type === 'input_text')
          .map(item => item.text)
          .join(' ');
      }
    }
    
    // Basic input validation
    if (!textContent || textContent.trim().length === 0) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Input cannot be empty',
      };
    }
    
    // Check for potential harmful content
    const harmfulPatterns = [
      /system|prompt|instruction/i,
      /ignore|forget|disregard/i,
    ];
    
    const containsHarmfulContent = harmfulPatterns.some(pattern => 
      pattern.test(textContent)
    );
    
    if (containsHarmfulContent) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Input contains potentially harmful content',
      };
    }
    
    // Input length validation
    if (textContent.length > 10000) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Input exceeds maximum length limit',
      };
    }
    
    return {
      tripwireTriggered: false,
      outputInfo: 'Input validation passed',
    };
  },
};`,
      },

      // Output guardrail
      {
        path: 'src/guardrails/output.ts',
        content: `import { OutputGuardrail } from '@openai/agents';

export const outputGuardrail: OutputGuardrail = {
  name: 'output_validation',
  async execute({ agentOutput, context }) {
    // Basic output validation
    if (!agentOutput || agentOutput.trim().length === 0) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Output cannot be empty',
      };
    }
    
    // Check for potential sensitive information
    const sensitivePatterns = [
      /api[_-]?key|secret|token|password/i,
      /\\b[A-Za-z0-9]{20,}\\b/g, // Long alphanumeric strings that might be keys
    ];
    
    const containsSensitiveInfo = sensitivePatterns.some(pattern => 
      pattern.test(agentOutput)
    );
    
    if (containsSensitiveInfo) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Output contains potentially sensitive information',
      };
    }
    
    // Quality check - ensure output is substantial
    if (agentOutput.length < 10) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Output is too short to be meaningful',
      };
    }
    
    return {
      tripwireTriggered: false,
      outputInfo: 'Output validation passed',
    };
  },
};`,
      },

      // README
      {
        path: 'README.md',
        content: `# {{PROJECT_NAME}}

An Augmented LLM agent built with the OpenAI Agents SDK. This agent demonstrates the Augmented LLM pattern from Anthropic's guide to building effective agents.

## Features

- **Web Search**: Search the web for current information
- **File System**: Read and write files for document management
- **Calculator**: Perform mathematical calculations
- **Memory**: Store and retrieve information across conversations
- **Guardrails**: Input/output validation for safety and quality

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up your OpenAI API key in the \`.env\` file:
   \`\`\`bash
   # Edit the .env file and replace with your actual API key
   OPENAI_API_KEY=your-actual-openai-api-key-here
   \`\`\`

3. Run the agent:
   \`\`\`bash
   npm run dev
   \`\`\`

## Usage

The agent can be used programmatically:

\`\`\`typescript
import { agent } from './src/index';
import { run } from '@openai/agents';

const result = await run(agent, 'Your message here');
console.log(result.finalOutput);
\`\`\`

## Tools

### Web Search
Search the web for current information on any topic.

### File System
Read and write files for document management.

### Calculator
Perform mathematical calculations and evaluations.

### Memory
Store and retrieve information across conversations.

## Guardrails

### Input Validation
- Validates user input for safety and quality
- Checks for harmful content patterns
- Enforces length limits

### Output Validation
- Ensures output quality and safety
- Prevents sensitive information leakage
- Validates output structure

## Development

- \`npm run build\` - Build the project
- \`npm run dev\` - Run in development mode
- \`npm test\` - Run tests
- \`npm run lint\` - Lint code
- \`npm run typecheck\` - Type check

## Architecture

This project follows the Augmented LLM pattern, which enhances a base LLM with:
- Tool access for extended capabilities
- Memory for context retention
- Guardrails for safety and quality
- Structured interactions

## License

MIT
`,
      },

      // Default .env file
      {
        path: '.env',
        content: `# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Customize model settings
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000
`,
      },

      // Environment example
      {
        path: '.env.example',
        content: `# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Customize model settings
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000
`,
      },

      // ESLint configuration
      {
        path: 'eslint.config.js',
        content: `import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'error',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
];`,
      },

      // Jest configuration
      {
        path: 'jest.config.js',
        content: `export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@openai/agents|@openai/agents-core)/)'
  ],
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/tests/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};`,
      },

      // Basic test
      {
        path: 'src/tests/agent.test.ts',
        content: `import { agent } from '../index';

describe('Augmented LLM Agent', () => {
  it('should initialize successfully', () => {
    expect(agent).toBeDefined();
    expect(agent.name).toBe('Augmented Research Assistant');
  });

  it('should have all required tools', () => {
    expect(agent.tools).toBeDefined();
    expect(agent.tools.length).toBe(8); // web_search, read_file, write_file, check_file_exists, calculator, store_memory, retrieve_memory, list_memory
  });

  it('should have input guardrails configured', () => {
    expect(agent.inputGuardrails).toBeDefined();
    expect(agent.inputGuardrails.length).toBeGreaterThan(0);
  });

  it('should have output guardrails configured', () => {
    expect(agent.outputGuardrails).toBeDefined();
    expect(agent.outputGuardrails.length).toBeGreaterThan(0);
  });
});`,
      },
    ],
  };
}
