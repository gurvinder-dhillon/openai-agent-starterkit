import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { generateProject } from '../src/generator';
import { ProjectOptions } from '../src/types';

describe('Project Generator', () => {
  const testOutputDir = './test-output';
  const testProjectName = 'test-project';
  
  beforeEach(() => {
    // Clean up test output directory
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true });
    }
  });
  
  afterEach(() => {
    // Clean up test output directory
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true });
    }
  });

  it('should generate augmented-llm pattern successfully', async () => {
    const options: ProjectOptions = {
      pattern: 'augmented-llm',
      name: testProjectName,
      outputPath: testOutputDir,
    };

    await generateProject(options);

    // Check that the project directory was created
    expect(existsSync(testOutputDir)).toBe(true);

    // Check that essential files were created
    const expectedFiles = [
      'package.json',
      'tsconfig.json',
      'README.md',
      'src/index.ts',
      'src/tools/web-search.ts',
      'src/tools/file-system.ts',
      'src/tools/calculator.ts',
      'src/tools/memory.ts',
      'src/guardrails/input.ts',
      'src/guardrails/output.ts',
      'src/context/types.ts',
      '.env.example',
    ];

    for (const file of expectedFiles) {
      const filePath = join(testOutputDir, file);
      expect(existsSync(filePath)).toBe(true);
    }
  });

  it('should replace template variables correctly', async () => {
    const options: ProjectOptions = {
      pattern: 'augmented-llm',
      name: testProjectName,
      outputPath: testOutputDir,
    };

    await generateProject(options);

    // Check package.json for correct project name
    const packageJsonPath = join(testOutputDir, 'package.json');
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    
    expect(packageJson.name).toBe(testProjectName);
    expect(packageJson.description).toContain('Enhanced LLM with tools, retrieval, and memory capabilities project');
  });

  it('should create directory structure correctly', async () => {
    const options: ProjectOptions = {
      pattern: 'augmented-llm',
      name: testProjectName,
      outputPath: testOutputDir,
    };

    await generateProject(options);

    // Check directory structure
    const expectedDirs = [
      'src',
      'src/tools',
      'src/guardrails',
      'src/context',
      'src/tests',
    ];

    for (const dir of expectedDirs) {
      const dirPath = join(testOutputDir, dir);
      expect(existsSync(dirPath)).toBe(true);
    }
  });

  it('should handle unknown pattern gracefully', async () => {
    const options: ProjectOptions = {
      pattern: 'unknown-pattern' as any,
      name: testProjectName,
      outputPath: testOutputDir,
    };

    await expect(generateProject(options)).rejects.toThrow('Unknown pattern: unknown-pattern');
  });
});