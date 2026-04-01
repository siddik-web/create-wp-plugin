# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test          # Run all tests (Node.js native test runner)
npm run lint      # ESLint check on src/ and bin/
npm start         # Run the CLI interactively
```

Run a single test file:
```bash
node --test tests/template-engine.test.js
node --test tests/scaffold.test.js
```

Smoke-test the scaffold in non-interactive mode:
```bash
node bin/create-wp-plugin.js my-test-plugin \
  --author "Test" --namespace "MyTestPlugin" --prefix "mtp" \
  --no-claude --no-tests
```

## Architecture

This is a Node.js CLI tool (ESM modules) that scaffolds production-ready WordPress plugins. Five core modules:

- **`bin/create-wp-plugin.js`** — Commander.js CLI entry point; parses flags and calls `scaffold()`
- **`src/prompts.js`** — Inquirer.js interactive Q&A; slug auto-derives title, namespace, and prefix; validates formats
- **`src/template-engine.js`** — `buildTokens()` constructs a 65+ entry map of `{{TOKEN}}` → value; `renderTemplate()` does global regex replacement
- **`src/scaffold.js`** — Main orchestrator; iterates over template files, conditionally writes based on feature flags (admin, REST API, tests, Claude Code, etc.)
- **`src/file-writer.js`** — Renders tokens in both file paths and content; auto-creates nested directories

### Token system

All template files in `src/templates/` use `{{TOKEN}}` placeholders (e.g., `{{PLUGIN_SLUG}}`, `{{NAMESPACE}}`, `{{PREFIX}}`). The token map is built once in `buildTokens()` and applied globally. When adding new tokens, update both `template-engine.js` (token map) and any relevant templates.

### Feature flags

CLI flags (`--no-admin`, `--no-rest-api`, `--no-tests`, `--no-claude`) gate which files get written. The feature state flows: CLI flags → `scaffold()` options → conditional `writeFile()` calls. Templates for optional features live alongside core templates but are only written when the feature is enabled.

### Template authoring

Templates are `.tpl` files. File paths themselves can contain tokens (e.g., `src/includes/class-{{PLUGIN_CLASS}}.php.tpl`). The file writer strips the `.tpl` extension and resolves tokens in the output path.

## Testing

Tests use Node.js built-in `node:test` — no Jest/Mocha. `scaffold.test.js` writes real files to a temp directory and asserts no unreplaced `{{TOKEN}}` remain in output. CI tests against Node 18, 20, and 22.
