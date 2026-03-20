# {{PLUGIN_NAME}} — Claude Memory

## Project Overview
**Plugin Name:** {{PLUGIN_NAME}}
**Type:** WordPress Plugin (PHP + JS)
**Stack:** PHP {{MIN_PHP}}+, WordPress {{MIN_WP}}+, Vanilla JS / React (block editor), REST API
**Purpose:** {{PLUGIN_DESCRIPTION}}

---

## Tech Stack
| Layer | Technology |
|---|---|
| Language | PHP {{MIN_PHP}}+ |
| CMS | WordPress {{MIN_WP}}+ |
| REST API | WordPress REST API (`{{PREFIX}}/v1`) |
| DB | `$wpdb` + custom table `{prefix}{{DB_TABLE}}` |
| Assets | @wordpress/scripts (Webpack) |
| Testing | PHPUnit + WP_Mock |
| i18n | gettext / .pot — text domain `{{TEXT_DOMAIN}}` |
| Linting | PHPCS — WordPress Coding Standards |

---

## Directory Structure
```
{{PLUGIN_SLUG}}/
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   ├── skills/code-review/SKILL.md
│   ├── skills/testing/SKILL.md
│   ├── commands/deploy.md
│   └── agents/security-reviewer.md
├── src/
│   ├── admin/class-settings.php
│   ├── frontend/class-assets.php
│   ├── includes/class-plugin.php
│   ├── includes/class-activator.php
│   └── api/class-rest-controller.php
├── assets/css/ & assets/js/
├── languages/
├── tests/unit/ & tests/integration/
└── {{PLUGIN_SLUG}}.php
```

---

## Architecture Decisions

### Namespace & Prefix
- PHP namespace root: `{{NAMESPACE}}\`
- Hook / option / transient prefix: `{{PREFIX}}_`
- REST API base: `{{PREFIX}}/v1`
- Text domain: `{{TEXT_DOMAIN}}`
- Constants: `{{PREFIX_UPPER}}_*`

### Bootstrap
- Entry: `{{PLUGIN_SLUG}}.php`
- Main class boots on `plugins_loaded` (priority 10)
- Admin-only code guarded with `is_admin()`
- REST routes registered on `rest_api_init`

### Database
- Custom table: `{$wpdb->prefix}{{DB_TABLE}}`
- Created via `dbDelta()` on activation
- Always use `$wpdb->prepare()` — never interpolate variables

### REST API
- Namespace: `{{PREFIX}}/v1`
- Resources: `src/api/` — one class per resource
- Auth: WordPress nonce + `current_user_can()`

---

## Commands
```bash
composer install       # Install PHP deps
npm install            # Install JS deps
npm run start          # Webpack watch
npm run build          # Production build
composer lint          # PHPCS (WordPress standards)
composer test          # PHPUnit
npm run makepot        # Generate .pot translation file
```

---

## Gotchas Claude Must Know
- ALWAYS escape output: `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`
- ALWAYS sanitize input: `sanitize_text_field()`, `absint()`, `sanitize_email()`
- NEVER echo raw user data — not even inside admin pages
- Nonces are REQUIRED for all forms and AJAX: `check_admin_referer()` / `check_ajax_referer()`
- REST endpoints MUST have a real `permission_callback` — never `__return_true`
- ALL hooks/options/transients prefixed `{{PREFIX}}_`
- ALL user-facing strings use `__()` / `_e()` / `esc_html__()` with domain `{{TEXT_DOMAIN}}`
- DB queries with variables MUST use `$wpdb->prepare()`
- Enqueue assets via `wp_enqueue_scripts` / `admin_enqueue_scripts` — no inline scripts

---

## Workflow Rules
1. `composer lint` before every commit
2. PHPUnit must pass before PR merge
3. New REST endpoints need a test
4. Conventional commits: `feat:` `fix:` `chore:` `docs:`
5. Run `/security-review` before any release

---

## References
- @src/includes/class-plugin.php — Main bootstrap
- @src/includes/class-activator.php — DB setup & defaults
- @src/api/class-rest-controller.php — REST endpoints
- @src/admin/class-settings.php — Settings page
- @src/frontend/class-assets.php — Frontend enqueue
- @tests/unit/ — PHPUnit test suite
