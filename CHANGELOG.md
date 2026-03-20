# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.0.0] — 2026-03-20

### Added

- Interactive CLI via `inquirer` — prompts for slug, name, namespace, prefix, author, WP/PHP versions, and feature flags
- Non-interactive mode with full CLI flag support (`--namespace`, `--prefix`, `--no-claude`, etc.)
- PHP plugin scaffold: entry file, `Plugin`, `Activator`, `Deactivator` classes (PSR-4, PHP 8.1+)
- Admin settings page via WordPress Settings API (`src/admin/class-settings.php`)
- Frontend asset enqueuer with `wp_localize_script` for REST nonce (`src/frontend/class-assets.php`)
- Full REST API CRUD controller extending `WP_REST_Controller` (`src/api/class-rest-controller.php`)
- Custom DB table with `dbDelta()` migration, charset/collation, and indexes
- PHPUnit + WP_Mock test scaffold (`tests/bootstrap.php`, `tests/unit/Test_Settings.php`)
- `composer.json` with PHPCS (WordPress Coding Standards) and PHPUnit
- `package.json` with `@wordpress/scripts` for Webpack asset pipeline
- `phpunit.xml` with unit and integration test suites
- `.gitignore` tuned for WordPress plugin development
- Optional WP-CLI command scaffold (`src/cli/class-cli-command.php`)
- Optional Gutenberg block scaffold (`src/blocks/example-block/`)
- Claude Code memory system:
  - `CLAUDE.md` — project memory with stack, architecture, gotchas, workflow rules
  - `.claude/settings.json` — allow/deny permissions + PostToolUse lint hook
  - `.claude/skills/code-review/SKILL.md` — WP security checklist skill
  - `.claude/skills/testing/SKILL.md` — PHPUnit + WP_Mock patterns skill
  - `.claude/commands/deploy.md` — `/deploy` slash command
  - `.claude/agents/security-reviewer.md` — pre-release security audit agent
- All template files use `{{TOKEN}}` placeholders — fully resolved at generation time
- `ora` spinner and `chalk` colour output for a polished CLI experience
- GitHub Actions CI workflow (`ci.yml`) — tests on Node 18, 20, 22
- GitHub issue templates (bug report, feature request)
- GitHub pull request template
- MIT License
- README with quickstart, flag reference, architecture notes, Claude Code docs
- CONTRIBUTING guide with token reference and PR process

[Unreleased]: https://github.com/siddik-web/create-wp-plugin/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/siddik-web/create-wp-plugin/releases/tag/v1.0.0
