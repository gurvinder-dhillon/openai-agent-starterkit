import { TemplateFile } from '../../types.js';

export function getPackageFiles(): TemplateFile[] {
  return [
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
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
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
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
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
      useESM: true,
      tsconfig: {
        moduleResolution: 'bundler'
      }
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
  ];
}