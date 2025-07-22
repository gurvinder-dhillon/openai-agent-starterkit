import { Agent } from '@openai/agents';
import { webSearchTool } from '../tools/web-search.js';
import { readFileTool, writeFileTool, checkFileExistsTool } from '../tools/file-system.js';
import { calculatorTool } from '../tools/calculator.js';
import { storeMemoryTool, retrieveMemoryTool, listMemoryTool } from '../tools/memory.js';
import { inputGuardrail } from '../guardrails/input.js';
import { outputGuardrail } from '../guardrails/output.js';
import { AgentContext } from '../context/types.js';

export const agent = new Agent<AgentContext>({
  name: 'Augmented Research Assistant',
  instructions: `You are an advanced research assistant with access to powerful tools.
  
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

Remember to be helpful, accurate, and thorough in your responses.`,
  
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