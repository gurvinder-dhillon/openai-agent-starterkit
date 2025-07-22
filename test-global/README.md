# test-global

An Augmented LLM agent built with the OpenAI Agents SDK. This agent demonstrates the Augmented LLM pattern from Anthropic's guide to building effective agents.

## Features

- **Web Search**: Search the web for current information
- **File System**: Read and write files for document management
- **Calculator**: Perform mathematical calculations
- **Memory**: Store and retrieve information across conversations
- **Guardrails**: Input/output validation for safety and quality

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your OpenAI API key in the `.env` file:
   ```bash
   # Edit the .env file and replace with your actual API key
   OPENAI_API_KEY=your-actual-openai-api-key-here
   ```

3. Run the agent:
   ```bash
   npm run dev
   ```

## Usage

The agent can be used programmatically:

```typescript
import { agent } from './src/index';
import { run } from '@openai/agents';

const result = await run(agent, 'Your message here');
console.log(result.finalOutput);
```

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

- `npm run build` - Build the project
- `npm run dev` - Run in development mode
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run typecheck` - Type check

## Architecture

This project follows the Augmented LLM pattern, which enhances a base LLM with:
- Tool access for extended capabilities
- Memory for context retention
- Guardrails for safety and quality
- Structured interactions

## License

MIT
