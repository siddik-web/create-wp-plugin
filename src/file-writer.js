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
 * @returns {string} The rendered relative file path
 * @throws {Error} With file path context included in the message
 */
export function writeFile(baseDir, filePath, content, tokens) {
  const renderedPath = render(filePath, tokens);
  const fullPath     = join(baseDir, renderedPath);

  try {
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, render(content, tokens), 'utf8');
  } catch (err) {
    throw new Error(`Failed to write ${renderedPath}: ${err.message}`);
  }

  return renderedPath;
}
