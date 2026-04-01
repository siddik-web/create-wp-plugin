import { readFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { promptPluginDetails } from './prompts.js';
import { buildTokens, render } from './template-engine.js';
import { writeFile } from './file-writer.js';
import { printSuccess, printError, printWarning, printStep, createSpinner, printDryRunTree } from './ui.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, 'templates');

/**
 * Read a template file from the templates directory.
 * @param {string} relativePath
 * @returns {string}
 */
function tpl(relativePath) {
  try {
    return readFileSync(join(TEMPLATES_DIR, relativePath), 'utf8');
  } catch (err) {
    throw new Error(`Template not found: ${relativePath}`);
  }
}

/**
 * Build the complete ordered list of files to write based on answers.
 * Returns an array of [destPath, content] pairs (content is raw template string).
 *
 * @param {object} answers
 * @returns {Array<[string, string]>}
 */
function buildFileList(answers) {
  const files = [];
  const add   = (dest, content) => files.push([dest, content]);

  // ── Core files ─────────────────────────────────────────────────────────────
  add('{{PLUGIN_SLUG}}.php',  tpl('plugin-entry.php.tpl'));
  add('composer.json',         tpl('composer.json.tpl'));
  add('package.json',          tpl('package.json.tpl'));
  add('phpunit.xml',           tpl('phpunit.xml.tpl'));
  add('.gitignore',            tpl('.gitignore.tpl'));

  // ── src/includes ───────────────────────────────────────────────────────────
  add('src/includes/class-plugin.php',      tpl('src/includes/class-plugin.php.tpl'));
  add('src/includes/class-activator.php',   tpl('src/includes/class-activator.php.tpl'));
  add('src/includes/class-deactivator.php', tpl('src/includes/class-deactivator.php.tpl'));

  // ── src/admin ──────────────────────────────────────────────────────────────
  if (answers.hasAdmin) {
    add('src/admin/class-settings.php', tpl('src/admin/class-settings.php.tpl'));
  }

  // ── src/frontend ───────────────────────────────────────────────────────────
  add('src/frontend/class-assets.php', tpl('src/frontend/class-assets.php.tpl'));

  // ── src/api ────────────────────────────────────────────────────────────────
  if (answers.hasRestApi) {
    add('src/api/class-rest-controller.php', tpl('src/api/class-rest-controller.php.tpl'));
  }

  // ── WP-CLI command ─────────────────────────────────────────────────────────
  if (answers.hasWpCli) {
    add('src/cli/class-cli-command.php', generateWpCliCommand());
  }

  // ── WooCommerce integration ────────────────────────────────────────────────
  if (answers.hasWooCommerce) {
    add('src/woocommerce/class-wc-integration.php', tpl('src/woocommerce/class-wc-integration.php.tpl'));
  }

  // ── Gutenberg block ────────────────────────────────────────────────────────
  if (answers.hasBlock) {
    add('src/blocks/example-block/block.json', tpl('src/blocks/example-block/block.json.tpl'));
    add('src/blocks/example-block/index.js',   tpl('src/blocks/example-block/index.js.tpl'));
  }

  // ── Empty asset stubs ──────────────────────────────────────────────────────
  add('assets/css/frontend.css', `/* {{PLUGIN_NAME}} — frontend styles */\n`);
  add('assets/css/admin.css',    `/* {{PLUGIN_NAME}} — admin styles */\n`);
  add('assets/js/frontend.js',   generateFrontendJs());

  // ── Languages ──────────────────────────────────────────────────────────────
  add('languages/.gitkeep', '');

  // ── Tests ──────────────────────────────────────────────────────────────────
  if (answers.hasTests) {
    add('tests/bootstrap.php',          tpl('tests/bootstrap.php.tpl'));
    add('tests/unit/Test_Settings.php', tpl('tests/unit/Test_Settings.php.tpl'));
    add('tests/integration/.gitkeep',   '');
  }

  // ── Claude Code files ──────────────────────────────────────────────────────
  if (answers.hasClaude) {
    add('CLAUDE.md',                             tpl('CLAUDE.md.tpl'));
    add('.mcp.json',                             tpl('.mcp.json.tpl'));
    add('.claude/settings.json',                 tpl('.claude/settings.json.tpl'));
    add('.claude/skills/code-review/SKILL.md',   tpl('.claude/skills/code-review/SKILL.md.tpl'));
    add('.claude/skills/testing/SKILL.md',       tpl('.claude/skills/testing/SKILL.md.tpl'));
    add('.claude/commands/deploy.md',            tpl('.claude/commands/deploy.md.tpl'));
    add('.claude/agents/security-reviewer.md',   tpl('.claude/agents/security-reviewer.md.tpl'));
  }

  return files;
}

/**
 * Main scaffold entry point.
 *
 * @param {string|undefined} slugArg
 * @param {object} cliOptions
 */
export async function scaffold(slugArg, cliOptions) {
  const isDryRun = cliOptions.dryRun === true;
  const isForce  = cliOptions.force  === true;
  const isYes    = cliOptions.yes    === true;
  const verbose  = cliOptions.verbose === true;

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

  const tokens = buildTokens(answers);
  const outDir = join(process.cwd(), answers.slug);

  // 2. Build file list (reads all templates — fails fast if any are missing)
  let fileList;
  try {
    fileList = buildFileList(answers);
  } catch (err) {
    printError(err.message);
    process.exit(1);
  }

  // 3. Dry-run: print tree and exit
  if (isDryRun) {
    const renderedPaths = fileList.map(([dest]) => render(dest, tokens));
    printDryRunTree(answers.slug, renderedPaths);
    return;
  }

  // 4. Directory conflict check
  if (existsSync(outDir)) {
    if (!isForce) {
      printError(`Directory "${answers.slug}" already exists. Use --force to overwrite.`);
      process.exit(1);
    }
    printWarning(`Overwriting existing directory: ${answers.slug}/`);
  }

  // 5. Confirmation step (skip with --yes or non-interactive flags)
  if (!isYes) {
    const featureList = [
      answers.hasAdmin       && 'Admin settings page',
      answers.hasRestApi     && 'REST API controller',
      answers.hasTests       && 'PHPUnit tests',
      answers.hasClaude      && 'Claude Code files',
      answers.hasDb          && 'Custom DB table',
      answers.hasWpCli       && 'WP-CLI command',
      answers.hasBlock       && 'Gutenberg block',
      answers.hasWooCommerce && 'WooCommerce integration',
    ].filter(Boolean);

    console.log('');
    console.log(chalk.white.bold('  Plugin summary:\n'));
    console.log(`    Slug:       ${chalk.cyan(answers.slug)}`);
    console.log(`    Namespace:  ${chalk.cyan(answers.namespace)}`);
    console.log(`    Prefix:     ${chalk.cyan(answers.prefix)}`);
    console.log(`    Features:   ${chalk.cyan(featureList.join(', ') || 'core only')}`);
    console.log(`    Files:      ${chalk.cyan(fileList.length)}`);
    console.log('');

    const { confirmed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirmed',
      message: 'Scaffold this plugin?',
      default: true,
    }]);

    if (!confirmed) {
      console.log('\n' + chalk.dim('  Cancelled.'));
      process.exit(0);
    }
  }

  // 6. Write files
  console.log('');
  const spinner   = createSpinner(`Creating ${chalk.cyan(answers.slug)}/`);
  const total     = fileList.length;
  let   written   = 0;
  let   dirMade   = false;

  spinner.start();

  try {
    for (const [dest, content] of fileList) {
      const renderedPath = writeFile(outDir, dest, content, tokens);
      dirMade = true;
      written++;

      if (verbose) {
        spinner.stop();
        printStep(renderedPath);
        spinner.start();
      }

      spinner.text = `Creating ${chalk.cyan(answers.slug)}/ (${written}/${total} files…)`;
    }

    spinner.succeed(chalk.green(`Scaffolded ${chalk.bold(answers.slug)}/ (${total} files)`));
    printSuccess(answers.slug, answers.slug, answers);

  } catch (err) {
    spinner.fail('Scaffold failed');
    printError(verbose ? (err.stack || err.message) : err.message);

    // Rollback: clean up partial output directory
    if (dirMade && existsSync(outDir)) {
      try {
        rmSync(outDir, { recursive: true, force: true });
        console.log(chalk.dim(`  Rolled back: removed ${answers.slug}/`));
      } catch {
        // Best-effort cleanup — don't mask the original error
      }
    }

    process.exit(1);
  }
}

// ─── Inline generators for optional / small files ──────────────────────────

function generateFrontendJs() {
  return `/* {{PLUGIN_NAME}} — frontend JS */
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
`;
}

function generateWpCliCommand() {
  return `<?php
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
`;
}
