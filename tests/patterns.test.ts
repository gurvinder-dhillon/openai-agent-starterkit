import { describe, it, expect } from 'vitest';
import { getAugmentedLLMPattern } from '../src/patterns/augmented-llm';

describe('Patterns', () => {
  describe('Augmented LLM Pattern', () => {
    it('should return valid pattern configuration', () => {
      const pattern = getAugmentedLLMPattern();
      
      expect(pattern.name).toBe('Augmented LLM');
      expect(pattern.description).toBe('Enhanced LLM with tools, retrieval, and memory capabilities');
      expect(pattern.files).toBeInstanceOf(Array);
      expect(pattern.files.length).toBeGreaterThan(0);
    });

    it('should include all required files', () => {
      const pattern = getAugmentedLLMPattern();
      
      const requiredFiles = [
        'package.json',
        'tsconfig.json',
        'src/index.ts',
        'src/tools/web-search.ts',
        'src/tools/file-system.ts',
        'src/tools/calculator.ts',
        'src/tools/memory.ts',
        'src/guardrails/input.ts',
        'src/guardrails/output.ts',
        'src/context/types.ts',
        'README.md',
        '.env.example',
      ];

      const filePaths = pattern.files.map(f => f.path);
      
      for (const requiredFile of requiredFiles) {
        expect(filePaths).toContain(requiredFile);
      }
    });

    it('should have non-empty file contents', () => {
      const pattern = getAugmentedLLMPattern();
      
      for (const file of pattern.files) {
        expect(file.content).toBeDefined();
        expect(file.content.length).toBeGreaterThan(0);
      }
    });

    it('should contain template variables', () => {
      const pattern = getAugmentedLLMPattern();
      
      const packageJsonFile = pattern.files.find(f => f.path === 'package.json');
      expect(packageJsonFile?.content).toContain('{{PROJECT_NAME}}');
      
      const readmeFile = pattern.files.find(f => f.path === 'README.md');
      expect(readmeFile?.content).toContain('{{PROJECT_NAME}}');
    });
  });
});