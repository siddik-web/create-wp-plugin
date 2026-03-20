# Contributing to create-wp-plugin

Thank you for your interest in contributing! This document covers everything you need to get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Adding a New Template File](#adding-a-new-template-file)
- [Adding a New Feature Flag](#adding-a-new-feature-flag)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating you agree to abide by its terms. Please be respectful and constructive.

---

## How to Contribute

- **Bug reports** → open a [GitHub Issue](.github/ISSUE_TEMPLATE/bug_report.md) with reproduction steps
- **Feature requests** → open a [GitHub Issue](.github/ISSUE_TEMPLATE/feature_request.md) with your use case
- **Code changes** → fork → branch → PR (see below)
- **Documentation** → PRs for README / code comments are always welcome

---

## Development Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Clone & install

```bash
git clone https://github.com/siddik-web/create-wp-plugin.git
cd create-wp-plugin
npm install
```

### Run the CLI locally

```bash
node bin/create-wp-plugin.js my-test-plugin
# or
npm start
```

### Run tests

```bash
npm test
```

---

## Project Structure

```
create-wp-plugin/
├── bin/
│   └── create-wp-plugin.js   ← CLI entry point (Commander.js)
├── src/
│   ├── scaffold.js           ← Main orchestrator — reads templates, writes files
│   ├── prompts.js            ← Inquirer.js interactive prompts
│   ├── template-engine.js    ← {{TOKEN}} replacement engine
│   ├── file-writer.js        ← Disk writer utility
│   └── ui.js                 ← Chalk/Ora output helpers
├── src/templates/            ← All .tpl template files
│   ├── plugin-entry.php.tpl
│   ├── composer.json.tpl
│   ├── CLAUDE.md.tpl
│   ├── src/...
│   ├── tests/...
│   └── .claude/...
├── .github/
│   ├── workflows/ci.yml
│   └── ISSUE_TEMPLATE/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Adding a New Template File

1. Create your template in `src/templates/` with a `.tpl` extension.
2. Use `{{TOKEN}}` placeholders — see `src/template-engine.js` for the full token list.
3. Register the file in `src/scaffold.js` inside the `scaffold()` function:

```js
writeFile(
  outDir,
  "src/my-new-file.php",
  tpl("src/my-new-file.php.tpl"),
  tokens,
);
```

4. If the file is optional (feature-gated), guard it with an `answers.has*` boolean:

```js
if (answers.hasMyFeature) {
  writeFile(
    outDir,
    "src/my-feature.php",
    tpl("src/my-feature.php.tpl"),
    tokens,
  );
}
```

---

## Adding a New Feature Flag

1. Add the option to `bin/create-wp-plugin.js`:

```js
.option('--no-my-feature', 'Skip my feature')
```

2. Add a checkbox in `src/prompts.js` inside the `features` array:

```js
{ name: 'My new feature', value: 'myFeature', checked: cliOptions.myFeature !== false },
```

3. Add the boolean to the answers map at the bottom of `promptPluginDetails()`:

```js
answers.hasMyFeature = features.includes("myFeature");
```

4. Add any new tokens to `buildTokens()` in `src/template-engine.js` if needed.

---

## Available Template Tokens

| Token                    | Example output               |
| ------------------------ | ---------------------------- |
| `{{PLUGIN_SLUG}}`        | `my-awesome-plugin`          |
| `{{PLUGIN_NAME}}`        | `My Awesome Plugin`          |
| `{{PLUGIN_DESCRIPTION}}` | `A production-ready plugin.` |
| `{{NAMESPACE}}`          | `MyAwesomePlugin`            |
| `{{PREFIX}}`             | `myawesomeplugin`            |
| `{{PREFIX_UPPER}}`       | `MYAWESOMEPLUGIN`            |
| `{{TEXT_DOMAIN}}`        | `my-awesome-plugin`          |
| `{{CONST_VERSION}}`      | `MYAWESOMEPLUGIN_VERSION`    |
| `{{CONST_DIR}}`          | `MYAWESOMEPLUGIN_PLUGIN_DIR` |
| `{{CONST_URL}}`          | `MYAWESOMEPLUGIN_PLUGIN_URL` |
| `{{DB_TABLE}}`           | `myawesomeplugin_items`      |
| `{{MIN_WP}}`             | `6.0`                        |
| `{{MIN_PHP}}`            | `8.1`                        |
| `{{AUTHOR_NAME}}`        | `Jane Doe`                   |
| `{{AUTHOR_URI}}`         | `https://janedoe.dev`        |
| `{{YEAR}}`               | `2026`                       |

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Gutenberg block scaffold option
fix: correct namespace in REST controller template
docs: add token reference to CONTRIBUTING
chore: bump chalk to 5.4.0
test: add template-engine unit tests
```

---

## Pull Request Process

1. Fork the repo and create a branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes and ensure `npm test` passes.
3. Update `CHANGELOG.md` under `[Unreleased]`.
4. Open a PR against `main` — fill in the PR template.
5. A maintainer will review within a few days.

**Please keep PRs focused** — one feature or fix per PR makes review much easier.

---

Thank you for contributing! 🎉
