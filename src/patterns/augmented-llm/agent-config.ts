import { TemplateFile } from '../../types.js';

export function getAgentFiles(): TemplateFile[] {
  return [
    // Main index file
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

import { run } from '@openai/agents';
import { agent } from './agents/research-assistant.js';
import { AgentContext } from './context/types.js';

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

    // Research assistant agent
    {
      path: 'src/agents/research-assistant.ts',
      content: `import { Agent } from '@openai/agents';
import { webSearchTool } from '../tools/web-search.js';
import { readFileTool, writeFileTool, checkFileExistsTool } from '../tools/file-system.js';
import { calculatorTool } from '../tools/calculator.js';
import { storeMemoryTool, retrieveMemoryTool, listMemoryTool } from '../tools/memory.js';
import { inputGuardrail } from '../guardrails/input.js';
import { outputGuardrail } from '../guardrails/output.js';
import { AgentContext } from '../context/types.js';

export const agent = new Agent<AgentContext>({
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
});`,
    },

    // Context types
    {
      path: 'src/context/types.ts',
      content: `export interface AgentContext {
  memory: Map<string, unknown>;
  sessionId: string;
}`,
    },

    // MCP servers directory placeholder
    {
      path: 'src/mcp-servers/.gitkeep',
      content: '# This directory contains MCP (Model Context Protocol) server implementations\n# Add your MCP servers here as needed\n',
    },
  ];
}