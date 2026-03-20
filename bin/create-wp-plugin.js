#!/usr/bin/env node
/**
 * create-wp-plugin
 * CLI scaffolding tool for production-ready WordPress plugins
 */

import { program } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { scaffold } from '../src/scaffold.js';
import { printBanner } from '../src/ui.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('create-wp-plugin')
  .description('Scaffold a production-ready WordPress plugin with Claude Code support')
  .version(pkg.version)
  .argument('[plugin-slug]', 'Plugin slug (e.g. my-awesome-plugin)')
  .option('--no-claude', 'Skip Claude Code files (CLAUDE.md, .claude/ directory)')
  .option('--no-tests', 'Skip PHPUnit test scaffold')
  .option('--no-rest-api', 'Skip REST API controller')
  .option('--no-admin', 'Skip admin settings page')
  .option('--no-git', 'Skip .gitignore')
  .option('--author <name>', 'Plugin author name')
  .option('--author-uri <url>', 'Plugin author URI')
  .option('--plugin-uri <url>', 'Plugin URI')
  .option('--namespace <ns>', 'PHP root namespace (e.g. MyPlugin)')
  .option('--prefix <prefix>', 'PHP/JS prefix (e.g. myplugin)')
  .option('--min-wp <version>', 'Minimum WordPress version', '6.0')
  .option('--min-php <version>', 'Minimum PHP version', '8.1')
  .action(async (slugArg, options) => {
    printBanner(pkg.version);
    await scaffold(slugArg, options);
  });

program.parse();
