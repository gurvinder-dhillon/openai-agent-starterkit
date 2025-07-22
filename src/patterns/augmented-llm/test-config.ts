import { TemplateFile } from '../../types.js';

export function getTestFiles(): TemplateFile[] {
  return [
    // Basic test
    {
      path: 'src/tests/agent.test.ts',
      content: `// Mock environment variables before importing
process.env.OPENAI_API_KEY = 'test-api-key';

import { agent } from '../agents/research-assistant.js';

describe('Augmented LLM Agent', () => {
  it('should initialize successfully', () => {
    expect(agent).toBeDefined();
    expect(agent.name).toBe('Augmented Research Assistant');
  });

  it('should have all required tools', () => {
    expect(agent.tools).toBeDefined();
    expect(agent.tools.length).toBe(8); // web_search, read_file, write_file, check_file_exists, calculator, store_memory, retrieve_memory, list_memory
  });

  it('should have input guardrails configured', () => {
    expect(agent.inputGuardrails).toBeDefined();
    expect(agent.inputGuardrails.length).toBeGreaterThan(0);
  });

  it('should have output guardrails configured', () => {
    expect(agent.outputGuardrails).toBeDefined();
    expect(agent.outputGuardrails.length).toBeGreaterThan(0);
  });
});`,
    },
  ];
}