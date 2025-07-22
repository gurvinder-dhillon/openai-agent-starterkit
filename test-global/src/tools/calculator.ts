import { tool } from '@openai/agents';
import { z } from 'zod';

export const calculatorTool = tool({
  name: 'calculator',
  description: 'Perform mathematical calculations and evaluations',
  parameters: z.object({
    expression: z.string().describe('Mathematical expression to evaluate'),
  }),
  async execute({ expression }) {
    try {
      // Basic expression evaluation (in production, use a proper math library)
      const sanitizedExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
      
      if (sanitizedExpression !== expression) {
        return {
          error: 'Invalid characters in expression',
          expression: expression,
        };
      }
      
      const result = eval(sanitizedExpression);
      
      return {
        expression: expression,
        result: result,
        message: `${expression} = ${result}`,
      };
    } catch (error) {
      return {
        error: 'Calculation failed',
        expression: expression,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});