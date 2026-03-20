# /deploy — {{PLUGIN_NAME}} Deploy Command

## Steps
1. `composer test` — all tests must pass
2. `composer lint` — zero PHPCS errors
3. `npm run build` — production assets
4. `npm run makepot` — update translations
5. Bump version in `{{PLUGIN_SLUG}}.php` and `package.json`
6. Build release zip (excludes dev files)
7. `git tag v{version} && git push --tags`

## Excluded from Release ZIP
`.claude/`, `node_modules/`, `vendor/`, `tests/`, `*.log`, `.env`,
`webpack.config.js`, `phpunit.xml`, `composer.json`, `package.json`

## Pre-Deploy Checklist
- [ ] `WP_DEBUG` is `false` on production
- [ ] All `error_log()` / `console.log()` removed
- [ ] Translations up to date
- [ ] readme.txt changelog updated
- [ ] Tested on latest WordPress ({{MIN_WP}}+)
- [ ] Tested on PHP {{MIN_PHP}}+
