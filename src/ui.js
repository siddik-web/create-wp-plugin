import chalk from 'chalk';
import ora from 'ora';

const REPO_URL = 'https://github.com/siddik-web/create-wp-plugin';

export function printBanner(version) {
  console.log('');
  console.log(
    chalk.bgHex('#0073aa').white.bold('  create-wp-plugin  ') +
    chalk.dim(` v${version}`)
  );
  console.log(chalk.dim('  Production-ready WordPress plugin scaffold with Claude Code'));
  console.log('');
}

export function printSuccess(pluginSlug, pluginDir, answers = {}) {
  console.log('');
  console.log(chalk.green.bold('  ✔ Plugin scaffolded successfully!\n'));
  console.log(chalk.white.bold('  Next steps:\n'));

  const steps = [
    [`cd ${pluginDir}`, null],
    ['composer install', '# Install PHP dependencies'],
    ['npm install', '# Install JS dependencies'],
    ['npm run start', '# Start asset watcher'],
  ];

  if (answers.hasClaude !== false) {
    steps.push(['claude', '# Open Claude Code in the project']);
  }

  steps.forEach(([cmd, comment]) => {
    console.log('  ' + chalk.cyan('$') + ' ' + chalk.white(cmd) + (comment ? '  ' + chalk.dim(comment) : ''));
  });

  console.log('');
  console.log(chalk.dim(`  Docs: ${REPO_URL}`));
  console.log('');
}

export function printError(message) {
  console.error('\n' + chalk.red.bold('  ✖ Error: ') + message + '\n');
}

export function printStep(message) {
  console.log('  ' + chalk.dim('→') + ' ' + chalk.dim(message));
}

export function printWarning(message) {
  console.log('  ' + chalk.yellow.bold('⚠') + '  ' + chalk.yellow(message));
}

export function createSpinner(text) {
  return ora({ text, prefixText: '  ' });
}

/**
 * Print a dry-run tree of files that would be created.
 *
 * @param {string} slug        - Plugin slug (root dir name)
 * @param {string[]} filePaths - List of relative file paths
 */
export function printDryRunTree(slug, filePaths) {
  console.log('');
  console.log(chalk.cyan.bold(`  Dry run — ${filePaths.length} files would be created in ${chalk.white(slug + '/')}:\n`));

  // Group by top-level directory
  const grouped = {};
  for (const f of filePaths) {
    const parts = f.split('/');
    const dir   = parts.length > 1 ? parts[0] : '(root)';
    if (!grouped[dir]) grouped[dir] = [];
    grouped[dir].push(f);
  }

  for (const [dir, files] of Object.entries(grouped)) {
    console.log('  ' + chalk.white.bold(dir + '/'));
    for (const f of files) {
      const name = f.includes('/') ? f.slice(f.indexOf('/') + 1) : f;
      console.log('    ' + chalk.dim('└─ ') + name);
    }
  }

  console.log('');
  console.log(chalk.dim('  Run without --dry-run to generate these files.'));
  console.log('');
}
