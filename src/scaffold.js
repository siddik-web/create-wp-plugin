import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { promptPluginDetails } from './prompts.js';
import { buildTokens, render } from './template-engine.js';
import { writeFile } from './file-writer.js';
import { printSuccess, printError, createSpinner } from './ui.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, 'templates');

/**
 * Read a template file from the templates directory.
 */
function tpl(relativePath) {
  return readFileSync(join(TEMPLATES_DIR, relativePath), 'utf8');
}

/**
 * Main scaffold entry point.
 */
export async function scaffold(slugArg, cliOptions) {
  // 1. Collect plugin details interactively
  let answers;
  try {
    answers = await promptPluginDetails(slugArg, cliOptions);
  } catch (err) {
    if (err.name === 'ExitPromptError') {
      console.log('\n' + chalk.dim('  Cancelled.'));
      process.exit(0);
    }
    throw err;
  }

  const tokens  = buildTokens(answers);
  const outDir  = join(process.cwd(), answers.slug);
  const spinner = createSpinner(`Creating ${chalk.cyan(answers.slug)}/`);

  // 2. Guard: warn if directory already exists
  if (existsSync(outDir)) {
    printError(`Directory "${answers.slug}" already exists. Remove it or choose a different slug.`);
    process.exit(1);
  }

  console.log('');
  spinner.start();

  try {
    // ── Core files ─────────────────────────────────────────────────────────
    writeFile(outDir, '{{PLUGIN_SLUG}}.php',  tpl('plugin-entry.php.tpl'),  tokens);
    writeFile(outDir, 'composer.json',         tpl('composer.json.tpl'),     tokens);
    writeFile(outDir, 'package.json',          tpl('package.json.tpl'),      tokens);
    writeFile(outDir, 'phpunit.xml',           tpl('phpunit.xml.tpl'),       tokens);
    writeFile(outDir, '.gitignore',            tpl('.gitignore.tpl'),        tokens);

    // ── src/includes ───────────────────────────────────────────────────────
    writeFile(outDir, 'src/includes/class-plugin.php',      tpl('src/includes/class-plugin.php.tpl'),      tokens);
    writeFile(outDir, 'src/includes/class-activator.php',   tpl('src/includes/class-activator.php.tpl'),   tokens);
    writeFile(outDir, 'src/includes/class-deactivator.php', tpl('src/includes/class-deactivator.php.tpl'), tokens);

    // ── src/admin ──────────────────────────────────────────────────────────
    if (answers.hasAdmin) {
      writeFile(outDir, 'src/admin/class-settings.php', tpl('src/admin/class-settings.php.tpl'), tokens);
    }

    // ── src/frontend ───────────────────────────────────────────────────────
    writeFile(outDir, 'src/frontend/class-assets.php', tpl('src/frontend/class-assets.php.tpl'), tokens);

    // ── src/api ────────────────────────────────────────────────────────────
    if (answers.hasRestApi) {
      writeFile(outDir, 'src/api/class-rest-controller.php', tpl('src/api/class-rest-controller.php.tpl'), tokens);
    }

    // ── WP-CLI command ─────────────────────────────────────────────────────
    if (answers.hasWpCli) {
      writeFile(outDir, 'src/cli/class-cli-command.php', generateWpCliCommand(tokens), tokens);
    }

    // ── Gutenberg block ────────────────────────────────────────────────────
    if (answers.hasBlock) {
      writeFile(outDir, 'src/blocks/example-block/block.json', generateBlockJson(tokens), tokens);
      writeFile(outDir, 'src/blocks/example-block/index.js',   generateBlockIndex(tokens), tokens);
    }

    // ── Empty asset stubs ──────────────────────────────────────────────────
    writeFile(outDir, 'assets/css/frontend.css', `/* {{PLUGIN_NAME}} — frontend styles */\n`, tokens);
    writeFile(outDir, 'assets/css/admin.css',    `/* {{PLUGIN_NAME}} — admin styles */\n`,    tokens);
    writeFile(outDir, 'assets/js/frontend.js',   generateFrontendJs(tokens),                  tokens);

    // ── Languages ──────────────────────────────────────────────────────────
    writeFile(outDir, 'languages/.gitkeep', '', tokens);

    // ── Tests ──────────────────────────────────────────────────────────────
    if (answers.hasTests) {
      writeFile(outDir, 'tests/bootstrap.php',            tpl('tests/bootstrap.php.tpl'),            tokens);
      writeFile(outDir, 'tests/unit/Test_Settings.php',   tpl('tests/unit/Test_Settings.php.tpl'),   tokens);
      writeFile(outDir, 'tests/integration/.gitkeep',     '',                                        tokens);
    }

    // ── Claude Code files ──────────────────────────────────────────────────
    if (answers.hasClaude) {
      writeFile(outDir, 'CLAUDE.md',                                   tpl('CLAUDE.md.tpl'),                                   tokens);
      writeFile(outDir, '.claude/settings.json',                        tpl('.claude/settings.json.tpl'),                        tokens);
      writeFile(outDir, '.claude/skills/code-review/SKILL.md',          tpl('.claude/skills/code-review/SKILL.md.tpl'),          tokens);
      writeFile(outDir, '.claude/skills/testing/SKILL.md',              tpl('.claude/skills/testing/SKILL.md.tpl'),              tokens);
      writeFile(outDir, '.claude/commands/deploy.md',                   tpl('.claude/commands/deploy.md.tpl'),                   tokens);
      writeFile(outDir, '.claude/agents/security-reviewer.md',          tpl('.claude/agents/security-reviewer.md.tpl'),          tokens);
    }

    spinner.succeed(chalk.green(`Scaffolded ${chalk.bold(answers.slug)}/`));
    printSuccess(answers.slug, answers.slug);

  } catch (err) {
    spinner.fail('Scaffold failed');
    printError(err.message);
    process.exit(1);
  }
}

// ─── Inline generators for optional / small files ──────────────────────────

function generateFrontendJs(tokens) {
  return render(`/* {{PLUGIN_NAME}} — frontend JS */
( function () {
  'use strict';

  const api   = window.{{PREFIX}}Data?.apiUrl || '';
  const nonce = window.{{PREFIX}}Data?.nonce  || '';

  async function fetchItems() {
    const res  = await fetch( api + 'items', { headers: { 'X-WP-Nonce': nonce } } );
    const data = await res.json();
    console.log( '{{PLUGIN_NAME}} items:', data );
  }

  document.addEventListener( 'DOMContentLoaded', fetchItems );
}() );
`, tokens);
}

function generateWpCliCommand(tokens) {
  return render(`<?php
/**
 * WP-CLI Command
 *
 * @package {{NAMESPACE}}\\Cli
 */

namespace {{NAMESPACE}}\\Cli;

/**
 * Manage {{PLUGIN_NAME}} via WP-CLI.
 *
 * @when after_wp_load
 */
class Cli_Command extends \\WP_CLI_Command {

  /**
   * List all items.
   *
   * ## EXAMPLES
   *   wp {{PREFIX}} list
   *
   * @subcommand list
   */
  public function list_items( array $args, array $assoc_args ): void {
    global $wpdb;
    $items = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}{{DB_TABLE}}" );
    \\WP_CLI\\Utils\\format_items( 'table', $items, [ 'id', 'title', 'status', 'created_at' ] );
  }
}

if ( defined( 'WP_CLI' ) && WP_CLI ) {
  \\WP_CLI::add_command( '{{PREFIX}}', {{NAMESPACE}}\\Cli\\Cli_Command::class );
}
`, tokens);
}

function generateBlockJson(tokens) {
  return render(`{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "{{PREFIX}}/example-block",
  "version": "1.0.0",
  "title": "{{PLUGIN_NAME}} Block",
  "category": "widgets",
  "textdomain": "{{TEXT_DOMAIN}}",
  "editorScript": "file:./index.js"
}
`, tokens);
}

function generateBlockIndex(tokens) {
  return render(`import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps }    from '@wordpress/block-editor';
import metadata             from './block.json';

registerBlockType( metadata.name, {
  edit: () => <p { ...useBlockProps() }>{{PLUGIN_NAME}} — edit view</p>,
  save: () => <p { ...useBlockProps.save() }>{{PLUGIN_NAME}} — save view</p>,
} );
`, tokens);
}
