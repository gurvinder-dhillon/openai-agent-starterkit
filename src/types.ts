export type AgentPattern = 'augmented-llm';

export interface ProjectOptions {
  pattern: AgentPattern;
  name: string;
  outputPath: string;
}

export interface TemplateFile {
  path: string;
  content: string;
}

export interface PatternConfig {
  name: string;
  description: string;
  files: TemplateFile[];
}