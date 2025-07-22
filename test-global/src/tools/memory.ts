import { tool } from '@openai/agents';
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
      return { message: `Stored value for key: ${key}`, key, value };
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
        return { message: `No value found for key: ${key}`, key };
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
      return { keys, message: `Memory contains ${keys.length} items` };
    } catch (error) {
      return {
        error: 'Memory operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

// Export main tool for convenience
export const memoryTool = storeMemoryTool;