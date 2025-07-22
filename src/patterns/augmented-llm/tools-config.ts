import { TemplateFile } from '../../types.js';

export function getToolFiles(): TemplateFile[] {
  return [
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
  async execute({ query, maxResults: _maxResults = 5 }) {
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
import { AgentContext } from '../context/types.js';

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
  async execute(_params, context) {
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
  ];
}