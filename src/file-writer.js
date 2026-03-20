import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { render } from './template-engine.js';

/**
 * Write a rendered template file to disk.
 *
 * @param {string} baseDir  - Output base directory
 * @param {string} filePath - Relative file path (may contain tokens)
 * @param {string} content  - Template content string
 * @param {object} tokens   - Token map
 */
export function writeFile(baseDir, filePath, content, tokens) {
  const renderedPath = render(filePath, tokens);
  const fullPath     = join(baseDir, renderedPath);

  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, render(content, tokens), 'utf8');

  return renderedPath;
}
