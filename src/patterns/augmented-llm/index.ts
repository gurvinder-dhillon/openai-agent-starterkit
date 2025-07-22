import { PatternConfig } from '../../types.js';
import { getPackageFiles } from './package-config.js';
import { getToolFiles } from './tools-config.js';
import { getGuardrailFiles } from './guardrails-config.js';
import { getAgentFiles } from './agent-config.js';
import { getTestFiles } from './test-config.js';

export function getAugmentedLLMPattern(): PatternConfig {
  return {
    name: 'Augmented LLM',
    description: 'Enhanced LLM with tools, retrieval, and memory capabilities',
    files: [
      ...getPackageFiles(),
      ...getAgentFiles(),
      ...getToolFiles(),
      ...getGuardrailFiles(),
      ...getTestFiles(),
    ],
  };
}