import chalk from 'chalk';
import ora from 'ora';

export function printBanner(version) {
  console.log('');
  console.log(
    chalk.bgHex('#0073aa').white.bold('  create-wp-plugin  ') +
    chalk.dim(` v${version}`)
  );
  console.log(chalk.dim('  Production-ready WordPress plugin scaffold with Claude Code'));
  console.log('');
}

export function printSuccess(pluginSlug, pluginDir) {
  console.log('');
  console.log(chalk.green.bold('  ✔ Plugin scaffolded successfully!\n'));
  console.log(chalk.white.bold('  Next steps:\n'));

  const steps = [
    ['cd', pluginDir],
    ['composer install', '# Install PHP dependencies'],
    ['npm install', '# Install JS dependencies'],
    ['npm run start', '# Start asset watcher'],
    ['claude', '# Open Claude Code in the project'],
  ];

  steps.forEach(([cmd, comment]) => {
    console.log('  ' + chalk.cyan('$') + ' ' + chalk.white(cmd) + (comment ? '  ' + chalk.dim(comment) : ''));
  });

  console.log('');
  console.log(chalk.dim('  Docs: https://github.com/yourname/create-wp-plugin'));
  console.log('');
}

export function printError(message) {
  console.error('\n' + chalk.red.bold('  ✖ Error: ') + message + '\n');
}

export function printStep(message) {
  console.log('  ' + chalk.dim('→') + ' ' + message);
}

export function createSpinner(text) {
  return ora({ text, prefixText: '  ' });
}
