import { tool } from '@openai/agents';
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
export const fileSystemTool = readFileTool;