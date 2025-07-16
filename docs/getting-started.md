# Getting Started

This guide will help you get started with the OpenAI Agent Starter Kit and create your first agent.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- OpenAI API key

## Installation

The OpenAI Agent Starter Kit is designed to be used as an npx command, so you don't need to install it globally.

## Creating Your First Agent

### Option 1: Quick Start

```bash
npx openai-agent-starterkit --pattern augmented-llm --name my-first-agent
cd my-first-agent
npm install
```

### Option 2: Interactive Mode

```bash
npx openai-agent-starterkit --interactive
```

This will prompt you for:
- Agent pattern selection
- Project name
- Output directory

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000
```

### API Key Setup

You can obtain an OpenAI API key from:
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Set it as an environment variable

## Running Your Agent

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test
```

## Understanding the Generated Code

### Main Agent File (`src/index.ts`)

This is the entry point for your agent. It defines:
- Agent configuration
- Tool bindings
- Guardrails
- Context setup

### Tools Directory (`src/tools/`)

Contains implementations for:
- **Web Search**: Search the web for current information
- **File System**: Read and write files
- **Calculator**: Perform mathematical operations
- **Memory**: Store and retrieve context

### Guardrails Directory (`src/guardrails/`)

Safety and quality checks:
- **Input Validation**: Sanitize user input
- **Output Validation**: Ensure safe and quality output

## Customizing Your Agent

### Adding New Tools

1. Create a new tool file in `src/tools/`
2. Define the tool using the `tool()` function
3. Add it to the agent's tools array

```typescript
import { tool } from '@openai/agents';
import { z } from 'zod';

export const myCustomTool = tool({
  name: 'my_custom_tool',
  description: 'Description of what this tool does',
  parameters: z.object({
    input: z.string().describe('Input parameter'),
  }),
  async execute({ input }) {
    // Tool implementation
    return { result: `Processed: ${input}` };
  },
});
```

### Modifying Instructions

Edit the `instructions` field in your agent configuration to change its behavior:

```typescript
const agent = new Agent({
  name: 'My Agent',
  instructions: `You are a specialized assistant that...`,
  tools: [...],
});
```

### Adding Guardrails

Create new guardrails in `src/guardrails/`:

```typescript
import { guardrail } from '@openai/agents';
import { z } from 'zod';

export const myGuardrail = guardrail({
  name: 'my_guardrail',
  description: 'Custom validation logic',
  parameters: z.object({
    input: z.string(),
  }),
  async execute({ input }) {
    // Validation logic
    return {
      allowed: true,
      message: 'Validation passed',
    };
  },
});
```

## Testing Your Agent

### Unit Tests

Test individual components:

```bash
npm test
```

### Integration Tests

Test the full agent workflow:

```bash
npm run test:integration
```

### Manual Testing

Run your agent in development mode and interact with it:

```bash
npm run dev
```

## Deployment

### Local Deployment

```bash
npm run build
npm start
```

### Production Deployment

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting platform
3. Set environment variables in your hosting platform
4. Start with `npm start`

## Next Steps

- [Agent Patterns](./patterns.md) - Learn about different agent patterns
- [Tools Guide](./tools.md) - Deep dive into tool development
- [Guardrails Guide](./guardrails.md) - Implement safety measures
- [API Reference](./api.md) - Complete API documentation

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure `OPENAI_API_KEY` is set correctly
   - Check API key permissions

2. **Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

3. **Runtime Issues**
   - Check console logs for error details
   - Verify tool implementations

### Getting Help

- Check the [FAQ](./faq.md)
- Open an issue on GitHub
- Join our community discussions