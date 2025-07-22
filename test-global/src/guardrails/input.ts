import { InputGuardrail } from '@openai/agents';

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
};