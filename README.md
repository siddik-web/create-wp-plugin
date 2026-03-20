# create-wp-plugin

> CLI scaffolding tool for production-ready WordPress plugins — with built-in [Claude Code](https://claude.ai/code) support.

[![npm version](https://img.shields.io/npm/v/create-wp-plugin.svg?style=flat-square)](https://www.npmjs.com/package/create-wp-plugin)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![CI](https://github.com/siddik-web/create-wp-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/siddik-web/create-wp-plugin/actions/workflows/ci.yml)

---

## What it does

One command generates a complete, opinionated WordPress plugin structure — the same way `wp scaffold plugin` does, but with a modern PHP 8.1+ architecture, REST API, PHPUnit tests, and a full [Claude Code](https://claude.ai/code) memory system baked in.

```
my-awesome-plugin/
├── CLAUDE.md                        ← Claude Code persistent memory
├── .claude/
│   ├── settings.json                ← Permissions & hooks
│   ├── skills/code-review/SKILL.md  ← Auto-invoked WP security review
│   ├── skills/testing/SKILL.md      ← PHPUnit patterns
│   ├── commands/deploy.md           ← /deploy slash command
│   └── agents/security-reviewer.md  ← Pre-release security audit agent
├── my-awesome-plugin.php            ← Plugin header & bootstrap
├── src/
│   ├── includes/
│   │   ├── class-plugin.php         ← Main orchestrator
│   │   ├── class-activator.php      ← DB setup & defaults
│   │   └── class-deactivator.php
│   ├── admin/class-settings.php     ← Settings API page
│   ├── frontend/class-assets.php    ← Enqueue scripts/styles
│   └── api/class-rest-controller.php← REST API (CRUD)
├── assets/css/ & assets/js/
├── languages/
├── tests/
│   ├── bootstrap.php
│   └── unit/Test_Settings.php
├── composer.json                    ← PHPCS + PHPUnit
├── package.json                     ← @wordpress/scripts
└── phpunit.xml
```

---

## Requirements

| Tool    | Version  |
| ------- | -------- |
| Node.js | ≥ 18.0.0 |
| npm     | ≥ 9.0.0  |

---

## Quick Start

```bash
# No install needed — use npx
npx create-wp-plugin

# Or install globally
npm install -g create-wp-plugin
create-wp-plugin
```

The CLI will interactively ask for:

- Plugin slug, name, description
- Author name & URI
- PHP namespace & hook prefix
- Minimum WordPress / PHP versions
- Features to include (admin page, REST API, tests, Claude Code, DB table, WP-CLI command, Gutenberg block)

---

## Usage

### Interactive (recommended)

```bash
npx create-wp-plugin
```

### With a slug argument

```bash
npx create-wp-plugin my-awesome-plugin
```

### Non-interactive (CI / scripting)

```bash
npx create-wp-plugin my-awesome-plugin \
  --author "Jane Doe" \
  --author-uri "https://janedoe.dev" \
  --namespace "MyAwesomePlugin" \
  --prefix "myawesomeplugin" \
  --min-wp "6.4" \
  --min-php "8.2" \
  --no-claude \
  --no-tests
```

### All flags

| Flag                  | Description              | Default            |
| --------------------- | ------------------------ | ------------------ |
| `[slug]`              | Plugin slug (positional) | prompted           |
| `--author <name>`     | Author name              | prompted           |
| `--author-uri <url>`  | Author URI               | prompted           |
| `--plugin-uri <url>`  | Plugin URI               | prompted           |
| `--namespace <ns>`    | PHP root namespace       | derived from slug  |
| `--prefix <prefix>`   | Hook/option prefix       | derived from slug  |
| `--min-wp <version>`  | Min WordPress version    | `6.0`              |
| `--min-php <version>` | Min PHP version          | `8.1`              |
| `--no-claude`         | Skip Claude Code files   | claude included    |
| `--no-tests`          | Skip PHPUnit scaffold    | tests included     |
| `--no-rest-api`       | Skip REST controller     | REST included      |
| `--no-admin`          | Skip admin settings page | admin included     |
| `--no-git`            | Skip `.gitignore`        | gitignore included |
| `-V, --version`       | Print version            |                    |
| `-h, --help`          | Print help               |                    |

---

## After Scaffolding

```bash
cd my-awesome-plugin

# Install PHP dependencies (PHPCS + PHPUnit)
composer install

# Install JS dependencies (@wordpress/scripts)
npm install

# Start asset watcher
npm run start

# Open in Claude Code
claude
```

### Available commands in your new plugin

```bash
# PHP
composer lint          # PHPCS — WordPress Coding Standards
composer lint:fix      # Auto-fix PHPCS errors
composer test          # PHPUnit — all tests
composer test:unit     # Unit tests only (fast, no WP needed)
composer test:coverage # HTML coverage report

# JS
npm run start          # Webpack watch
npm run build          # Production build
npm run lint:js        # ESLint
npm run lint:css       # Stylelint
npm run makepot        # Generate .pot translation file
```

---

## Claude Code Integration

When `--claude` is enabled (default), the scaffold writes a full [Claude Code](https://claude.ai/code) memory system:

| File                                  | Purpose                                                       |
| ------------------------------------- | ------------------------------------------------------------- |
| `CLAUDE.md`                           | Project memory — stack, architecture, gotchas, workflow rules |
| `.claude/settings.json`               | Permissions (allow/deny) + PostToolUse lint hook              |
| `.claude/skills/code-review/SKILL.md` | Auto-invoked WP security checklist                            |
| `.claude/skills/testing/SKILL.md`     | PHPUnit + WP_Mock patterns                                    |
| `.claude/commands/deploy.md`          | `/deploy` slash command                                       |
| `.claude/agents/security-reviewer.md` | Pre-release audit agent                                       |

All files are pre-filled with your plugin's namespace, prefix, and text domain — no manual find-and-replace needed.

---

## Optional Features

### WP-CLI Command

Generates `src/cli/class-cli-command.php` with a `wp <prefix> list` command wired up.

### Gutenberg Block

Generates `src/blocks/example-block/` with `block.json` and `index.js` using `@wordpress/scripts`.

### Custom DB Table

Generates a `CREATE TABLE` migration in the Activator with proper `dbDelta()`, charset collation, and indexed columns.

---

## Architecture Decisions

- **PSR-4 autoloading** via Composer — no `require` chains
- **Single entry file** bootstrap pattern — `plugins_loaded` hook, priority 10
- **Settings API** for all options — never raw `$_POST`
- **WordPress Coding Standards** enforced via PHPCS
- **WP_Mock** for unit tests — no WordPress bootstrap needed for fast tests
- **`$wpdb->prepare()`** enforced in all templates — no raw SQL interpolation

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

```bash
# Clone and set up
git clone https://github.com/siddik-web/create-wp-plugin.git
cd create-wp-plugin
npm install

# Run the CLI locally
node bin/create-wp-plugin.js my-test-plugin

# Run tests
npm test
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

---

## License

[MIT](LICENSE) © create-wp-plugin contributors
