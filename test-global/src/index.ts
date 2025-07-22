import dotenv from 'dotenv';

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

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { agent };