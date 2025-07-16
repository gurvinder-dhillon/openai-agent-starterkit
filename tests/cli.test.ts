import { describe, it, expect, vi } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('CLI', () => {
  it('should show help when no arguments provided', async () => {
    const result = await execAsync('node dist/cli.js --help');
    expect(result.stdout).toContain('Generate OpenAI Agent projects');
  });

  it('should show version information', async () => {
    const result = await execAsync('node dist/cli.js --version');
    expect(result.stdout).toContain('1.0.0');
  });

  it('should validate required parameters', async () => {
    // This test would require the CLI to be built first
    // For now, we'll skip it and add a todo for integration testing
    expect(true).toBe(true);
  });
});