#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import { generateProject } from './generator';
import { AgentPattern, ProjectOptions } from './types';

const program = new Command();

program
  .name('openai-agent-starterkit')
  .description('Generate OpenAI Agent projects with various patterns')
  .version('1.0.0');

program
  .option('-p, --pattern <pattern>', 'Agent pattern to generate', 'augmented-llm')
  .option('-n, --name <name>', 'Project name')
  .option('-o, --output <path>', 'Output directory', './my-agent-project')
  .option('-i, --interactive', 'Interactive mode')
  .action(async (options) => {
    try {
      let projectOptions: ProjectOptions;

      if (options.interactive) {
        projectOptions = await promptForOptions();
      } else {
        projectOptions = {
          pattern: options.pattern as AgentPattern,
          name: options.name || 'my-agent-project',
          outputPath: options.output,
        };
      }

      console.log('🚀 Generating OpenAI Agent project...');
      console.log(`Pattern: ${projectOptions.pattern}`);
      console.log(`Name: ${projectOptions.name}`);
      console.log(`Output: ${projectOptions.outputPath}`);

      await generateProject(projectOptions);

      console.log('✅ Project generated successfully!');
      console.log('');
      console.log('Next steps:');
      console.log(`  cd ${projectOptions.outputPath}`);
      console.log('  npm install');
      console.log('  npm run dev');
      console.log('');
      console.log('📚 Check the README.md for more information.');
    } catch (error) {
      console.error('❌ Error generating project:', error);
      process.exit(1);
    }
  });

async function promptForOptions(): Promise<ProjectOptions> {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'pattern',
      message: 'Which agent pattern would you like to use?',
      choices: [
        {
          name: 'Augmented LLM - Enhanced with tools, retrieval, and memory',
          value: 'augmented-llm',
        },
        // Future patterns can be added here
      ],
    },
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: 'my-agent-project',
      validate: (input: string) => {
        if (input.length === 0) {
          return 'Project name is required';
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'outputPath',
      message: 'Output directory:',
      default: (answers: any) => `./${answers.name}`,
    },
  ]);

  return answers;
}

program.parse();