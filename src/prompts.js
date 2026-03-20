import inquirer from 'inquirer';
import chalk from 'chalk';

/**
 * Convert a slug to a human-readable title
 * e.g. "my-awesome-plugin" → "My Awesome Plugin"
 */
function slugToTitle(slug) {
  return slug
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Convert a slug to a PHP namespace
 * e.g. "my-awesome-plugin" → "MyAwesomePlugin"
 */
function slugToNamespace(slug) {
  return slug
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

/**
 * Convert a slug to a PHP/JS prefix
 * e.g. "my-awesome-plugin" → "myawesomeplugin"
 */
function slugToPrefix(slug) {
  return slug.replace(/[-_]/g, '').toLowerCase();
}

export async function promptPluginDetails(slugArg, cliOptions) {
  console.log(chalk.white.bold('  Configure your plugin:\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'slug',
      message: 'Plugin slug (lowercase, hyphens):',
      default: slugArg || 'my-awesome-plugin',
      validate: v => /^[a-z][a-z0-9-]+$/.test(v) || 'Must be lowercase letters, numbers, and hyphens only',
      when: !slugArg,
    },
    {
      type: 'input',
      name: 'name',
      message: 'Plugin name:',
      default: (a) => slugToTitle(a.slug || slugArg),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Short description:',
      default: 'A production-ready WordPress plugin.',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name:',
      default: cliOptions.author || '',
    },
    {
      type: 'input',
      name: 'authorUri',
      message: 'Author URI:',
      default: cliOptions.authorUri || 'https://example.com',
    },
    {
      type: 'input',
      name: 'pluginUri',
      message: 'Plugin URI:',
      default: (a) => `https://example.com/${a.slug || slugArg}`,
    },
    {
      type: 'input',
      name: 'namespace',
      message: 'PHP namespace:',
      default: (a) => cliOptions.namespace || slugToNamespace(a.slug || slugArg),
      validate: v => /^[A-Z][A-Za-z]+$/.test(v) || 'Must be PascalCase letters only',
    },
    {
      type: 'input',
      name: 'prefix',
      message: 'PHP/JS prefix (for hooks, options, slugs):',
      default: (a) => cliOptions.prefix || slugToPrefix(a.slug || slugArg),
      validate: v => /^[a-z][a-z0-9]+$/.test(v) || 'Must be lowercase letters/numbers only',
    },
    {
      type: 'input',
      name: 'minWp',
      message: 'Minimum WordPress version:',
      default: cliOptions.minWp || '6.0',
    },
    {
      type: 'input',
      name: 'minPhp',
      message: 'Minimum PHP version:',
      default: cliOptions.minPhp || '8.1',
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Include features:',
      choices: [
        { name: 'Admin settings page', value: 'admin', checked: cliOptions.admin !== false },
        { name: 'REST API controller', value: 'restApi', checked: cliOptions.restApi !== false },
        { name: 'PHPUnit test scaffold', value: 'tests', checked: cliOptions.tests !== false },
        { name: 'Claude Code files (CLAUDE.md + .claude/)', value: 'claude', checked: cliOptions.claude !== false },
        { name: 'Custom DB table', value: 'db', checked: true },
        { name: 'WP-CLI command', value: 'wpcli', checked: false },
        { name: 'Gutenberg block', value: 'block', checked: false },
      ],
    },
  ]);

  // Merge slug from arg or prompt answer
  answers.slug = answers.slug || slugArg;

  // Flatten features into booleans
  const features = answers.features || [];
  answers.hasAdmin   = features.includes('admin');
  answers.hasRestApi = features.includes('restApi');
  answers.hasTests   = features.includes('tests');
  answers.hasClaude  = features.includes('claude');
  answers.hasDb      = features.includes('db');
  answers.hasWpCli   = features.includes('wpcli');
  answers.hasBlock   = features.includes('block');

  delete answers.features;
  return answers;
}
