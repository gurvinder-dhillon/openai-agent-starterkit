# OpenAI Agent Starter Kit

A production-ready starter kit for building single and multi-agent systems using the OpenAI Agent JavaScript SDK. This kit provides scaffolding and templates for all agent design patterns from Anthropic's guide to building effective agents.

## Features

- 🚀 **Production Ready**: Built with TypeScript, comprehensive testing, and CI/CD
- 🎯 **Pattern-Based**: Implements proven agent patterns from Anthropic's research
- 🛠️ **Tool-Rich**: Includes web search, file system, calculator, and memory tools
- 🔒 **Secure**: Built-in guardrails for input/output validation
- 📚 **Well-Documented**: Comprehensive documentation and examples
- 🧪 **Thoroughly Tested**: Unit tests, integration tests, and end-to-end testing

## Quick Start

```bash
# Generate a new agent project
npx openai-agent-starterkit --pattern augmented-llm --name my-agent

# Or use interactive mode
npx openai-agent-starterkit --interactive

# Navigate to your project
cd my-agent

# Install dependencies
npm install

# Set up your OpenAI API key
export OPENAI_API_KEY="your-api-key-here"

# Run your agent
npm run dev
```

## Available Patterns

### Augmented LLM
The foundational pattern that enhances a base LLM with:
- **Tool Access**: Web search, file operations, calculations
- **Memory Management**: Context retention across conversations
- **Guardrails**: Input/output validation and safety
- **Structured Interactions**: Clear tool usage patterns

```bash
npx openai-agent-starterkit --pattern augmented-llm
```

## Agent Patterns (Coming Soon)

This starter kit will support all major agent patterns:

- **Sequential Agents**: Linear handoff between specialized agents
- **Hierarchical Agents**: Manager-worker delegation patterns
- **Tool-calling Agents**: Specialized tool usage patterns
- **Collaborative Agents**: Shared context and parallel execution

## CLI Usage

```bash
# Basic usage
npx openai-agent-starterkit --pattern <pattern> --name <project-name>

# Options
--pattern, -p     Agent pattern to generate (default: augmented-llm)
--name, -n        Project name
--output, -o      Output directory (default: ./my-agent-project)
--interactive, -i Interactive mode with prompts
```

## Generated Project Structure

```
my-agent-project/
├── src/
│   ├── index.ts              # Main agent entry point
│   ├── tools/                # Tool implementations
│   │   ├── web-search.ts     # Web search capability
│   │   ├── file-system.ts    # File operations
│   │   ├── calculator.ts     # Mathematical operations
│   │   └── memory.ts         # Context management
│   ├── guardrails/           # Input/output validation
│   │   ├── input.ts          # Input validation
│   │   └── output.ts         # Output validation
│   ├── context/              # Context type definitions
│   │   └── types.ts          # Shared context interfaces
│   └── tests/                # Test files
├── package.json              # Node.js configuration
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project documentation
└── .env.example              # Environment variables template
```

## Development

### Building the Starter Kit

```bash
# Install dependencies
npm install

# Build the CLI
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

### Testing Project Generation

```bash
# Test project generation
npm run test:generate

# Test generated project
npm run test:integration
```

## Architecture

The starter kit follows a modular architecture:

- **CLI**: Command-line interface for project generation
- **Patterns**: Template definitions for different agent patterns
- **Generator**: File generation and templating engine
- **Types**: TypeScript type definitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Testing Before Publishing

Before publishing to npm, test the package locally:

```bash
# Build the package
npm run build

# Test globally
npm link
openai-agent-starterkit --pattern augmented-llm --name test-project

# Test package creation
npm pack
```

## Publishing

This project uses GitHub Actions for automated publishing:

1. Create a release on GitHub
2. GitHub Actions will automatically publish to npm
3. Version bumping is handled automatically

## License

MIT License - see LICENSE file for details.

## Support

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/your-org/openai-agent-starterkit/issues)
- 💬 [Discussions](https://github.com/your-org/openai-agent-starterkit/discussions)

## Acknowledgments

- [Anthropic](https://anthropic.com) for the agent patterns research
- [OpenAI](https://openai.com) for the Agent SDK
- The open-source community for inspiration and tools