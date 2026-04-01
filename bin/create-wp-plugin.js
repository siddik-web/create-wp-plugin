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
import { printBanner, printError } from '../src/ui.js';
import { validateSlug, validateNamespace, validatePrefix, validateVersion } from '../src/validator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('create-wp-plugin')
  .description('Scaffold a production-ready WordPress plugin with Claude Code support')
  .version(pkg.version)
  .argument('[plugin-slug]', 'Plugin slug (e.g. my-awesome-plugin)')

  // ── Feature toggles (default-ON, negatable) ────────────────────────────────
  .option('--no-claude',   'Skip Claude Code files (CLAUDE.md, .claude/ directory)')
  .option('--no-tests',    'Skip PHPUnit test scaffold')
  .option('--no-rest-api', 'Skip REST API controller')
  .option('--no-admin',    'Skip admin settings page')
  .option('--no-git',      'Skip .gitignore')
  .option('--no-db',       'Skip custom DB table')

  // ── Feature toggles (default-OFF, opt-in) ─────────────────────────────────
  .option('--woocommerce', 'Include WooCommerce integration class')
  .option('--block',       'Include Gutenberg block scaffold')
  .option('--wpcli',       'Include WP-CLI command class')

  // ── Scaffold behaviour ─────────────────────────────────────────────────────
  .option('--dry-run',     'Preview files that would be created without writing anything')
  .option('--force',       'Overwrite output directory if it already exists')
  .option('-y, --yes',     'Skip the confirmation prompt')
  .option('--verbose',     'Log each file as it is written and show full error stack traces')

  // ── Plugin metadata ────────────────────────────────────────────────────────
  .option('--author <name>',      'Plugin author name')
  .option('--author-uri <url>',   'Plugin author URI')
  .option('--plugin-uri <url>',   'Plugin URI')
  .option('--namespace <ns>',     'PHP root namespace (e.g. MyPlugin)')
  .option('--prefix <prefix>',    'PHP/JS prefix (e.g. myplugin)')
  .option('--min-wp <version>',   'Minimum WordPress version', '6.0')
  .option('--min-php <version>',  'Minimum PHP version', '8.1')

  .action(async (slugArg, options) => {
    printBanner(pkg.version);

    // ── Validate CLI args that bypass interactive prompts ──────────────────
    const errors = [];

    if (slugArg) {
      const r = validateSlug(slugArg);
      if (r !== true) errors.push(`Invalid slug "${slugArg}": ${r}`);
    }
    if (options.namespace) {
      const r = validateNamespace(options.namespace);
      if (r !== true) errors.push(`Invalid --namespace: ${r}`);
    }
    if (options.prefix) {
      const r = validatePrefix(options.prefix);
      if (r !== true) errors.push(`Invalid --prefix: ${r}`);
    }
    if (options.minWp) {
      const r = validateVersion(options.minWp);
      if (r !== true) errors.push(`Invalid --min-wp: ${r}`);
    }
    if (options.minPhp) {
      const r = validateVersion(options.minPhp);
      if (r !== true) errors.push(`Invalid --min-php: ${r}`);
    }

    if (errors.length > 0) {
      for (const e of errors) printError(e);
      process.exit(1);
    }

    await scaffold(slugArg, options);
  });

program.parse();
