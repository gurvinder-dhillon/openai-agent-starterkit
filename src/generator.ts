import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { ProjectOptions, PatternConfig } from './types';
import { getAugmentedLLMPattern } from './patterns/augmented-llm/index.js';

export async function generateProject(options: ProjectOptions): Promise<void> {
  const { pattern, name, outputPath } = options;
  
  // Get pattern configuration
  const patternConfig = getPatternConfig(pattern);
  
  // Create output directory
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  
  // Generate files
  for (const file of patternConfig.files) {
    const filePath = join(outputPath, file.path);
    const fileDir = dirname(filePath);
    
    // Create directory if it doesn't exist
    if (!existsSync(fileDir)) {
      mkdirSync(fileDir, { recursive: true });
    }
    
    // Replace template variables
    const content = file.content
      .replace(/{{PROJECT_NAME}}/g, name)
      .replace(/{{PROJECT_DESCRIPTION}}/g, `${patternConfig.description} project`)
      .replace(/{{PATTERN_NAME}}/g, pattern);
    
    writeFileSync(filePath, content);
  }
  
  console.log(`✅ Generated ${patternConfig.files.length} files`);
}

function getPatternConfig(pattern: string): PatternConfig {
  switch (pattern) {
    case 'augmented-llm':
      return getAugmentedLLMPattern();
    default:
      throw new Error(`Unknown pattern: ${pattern}`);
  }
}