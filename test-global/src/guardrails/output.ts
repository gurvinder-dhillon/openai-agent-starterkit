import { OutputGuardrail } from '@openai/agents';

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
      /\b[A-Za-z0-9]{20,}\b/g, // Long alphanumeric strings that might be keys
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
};