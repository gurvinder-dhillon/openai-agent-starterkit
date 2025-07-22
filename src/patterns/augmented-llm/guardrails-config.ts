import { TemplateFile } from '../../types.js';

export function getGuardrailFiles(): TemplateFile[] {
  return [
    // Input guardrail
    {
      path: 'src/guardrails/input.ts',
      content: `import { InputGuardrail } from '@openai/agents';

export const inputGuardrail: InputGuardrail = {
  name: 'input_validation',
  async execute({ input, context: _context }) {
    // Extract text content from input
    let textContent = '';
    if (typeof input === 'string') {
      textContent = input;
    } else if (input && typeof input === 'object' && 'content' in input) {
      if (typeof input.content === 'string') {
        textContent = input.content;
      } else if (Array.isArray(input.content)) {
        textContent = input.content
          .filter(item => item.type === 'input_text')
          .map(item => item.text)
          .join(' ');
      }
    }
    
    // Basic input validation
    if (!textContent || textContent.trim().length === 0) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Input cannot be empty',
      };
    }
    
    // Check for potential harmful content
    const harmfulPatterns = [
      /system|prompt|instruction/i,
      /ignore|forget|disregard/i,
    ];
    
    const containsHarmfulContent = harmfulPatterns.some(pattern => 
      pattern.test(textContent)
    );
    
    if (containsHarmfulContent) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Input contains potentially harmful content',
      };
    }
    
    // Input length validation
    if (textContent.length > 10000) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Input exceeds maximum length limit',
      };
    }
    
    return {
      tripwireTriggered: false,
      outputInfo: 'Input validation passed',
    };
  },
};`,
    },

    // Output guardrail
    {
      path: 'src/guardrails/output.ts',
      content: `import { OutputGuardrail } from '@openai/agents';

export const outputGuardrail: OutputGuardrail = {
  name: 'output_validation',
  async execute({ agentOutput, context: _context }) {
    // Basic output validation
    if (!agentOutput || agentOutput.trim().length === 0) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Output cannot be empty',
      };
    }
    
    // Check for potential sensitive information
    const sensitivePatterns = [
      /api[_-]?key|secret|token|password/i,
      /\\b[A-Za-z0-9]{20,}\\b/g, // Long alphanumeric strings that might be keys
    ];
    
    const containsSensitiveInfo = sensitivePatterns.some(pattern => 
      pattern.test(agentOutput)
    );
    
    if (containsSensitiveInfo) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Output contains potentially sensitive information',
      };
    }
    
    // Quality check - ensure output is substantial
    if (agentOutput.length < 10) {
      return {
        tripwireTriggered: true,
        outputInfo: 'Output is too short to be meaningful',
      };
    }
    
    return {
      tripwireTriggered: false,
      outputInfo: 'Output validation passed',
    };
  },
};`,
    },
  ];
}