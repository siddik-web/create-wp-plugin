{
  "permissions": {
    "allow": [
      "Read:*",
      "Bash:git:*",
      "Bash:composer:*",
      "Bash:npm:*",
      "Bash:node:*",
      "Bash:npx:*",
      "Bash:php:*",
      "Bash:phpunit:*",
      "Bash:wp:*",
      "Write:src/**",
      "Write:assets/**",
      "Write:tests/**",
      "Write:languages/**",
      "Write:CLAUDE.md",
      "Write:README.md"
    ],
    "deny": [
      "Read:.env",
      "Read:wp-config.php",
      "Bash:sudo:*",
      "Bash:rm -rf:*",
      "Bash:curl * | bash:*",
      "Bash:wget * | sh:*",
      "Bash:git push --force:*",
      "Bash:git push -f:*",
      "Write:wp-config.php",
      "Write:.env",
      "Write:.claude/settings.json"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "errors=$(find src/ -name '*.php' 2>/dev/null | xargs php -l 2>&1 | grep -E 'Parse error|Fatal error' || true); [ -z \"$errors\" ] || { printf 'PHP syntax error — blocked:\\n%s\\n' \"$errors\" >&2; exit 2; }",
            "timeout": 20
          },
          {
            "type": "command",
            "command": "[ -f vendor/bin/phpcs ] && vendor/bin/phpcs --standard=WordPress --report=summary src/ 2>/dev/null || true",
            "timeout": 30
          },
          {
            "type": "command",
            "command": "[ -f node_modules/.bin/eslint ] && npx eslint --fix --quiet assets/js/ src/blocks/ 2>/dev/null || true",
            "timeout": 20
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "cmd=$(cat | python3 -c \"import sys,json;d=json.load(sys.stdin);print(d.get('command',''))\" 2>/dev/null || echo ''); [ -z \"$cmd\" ] && exit 0; echo \"$cmd\" | grep -qE 'rm -rf|DROP TABLE|DELETE FROM wp_|TRUNCATE wp_' && { echo 'Blocked: destructive operation — run manually if intentional' >&2; exit 2; }; echo \"$cmd\" | grep -qE 'curl.+\\|.+bash|wget.+\\|.+sh' && { echo 'Blocked: remote code execution pattern' >&2; exit 2; }; exit 0",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "path=$(cat | python3 -c \"import sys,json;d=json.load(sys.stdin);print(d.get('file_path',''))\" 2>/dev/null || echo ''); [ -z \"$path\" ] && exit 0; echo \"$path\" | grep -qE '(wp-config\\.php|\\.env)$' && { echo \"Blocked: writing to $path is not allowed\" >&2; exit 2; }; exit 0",
            "timeout": 5
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "[ -f vendor/bin/phpunit ] && vendor/bin/phpunit --testsuite unit -q 2>/dev/null && echo 'PHPUnit unit tests passed ✔' || true",
            "timeout": 60
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "printf '\\n\\033[1;36m=== {{PLUGIN_NAME}} — Claude context ===\\033[0m\\n'; printf 'Plugin : {{PLUGIN_NAME}}\\n'; printf 'Prefix : {{PREFIX}}_   (hooks, options, transients, DB columns)\\n'; printf 'NS     : {{NAMESPACE}}\\\\   (PHP namespace root)\\n'; printf 'Domain : {{TEXT_DOMAIN}}  (i18n text domain)\\n'; printf 'REST   : {{PREFIX}}/v1  (REST API namespace)\\n'; printf '\\nCommands:\\n'; printf '  composer install    install PHP deps + configure PHPCS\\n'; printf '  composer lint       PHPCS WordPress standards check\\n'; printf '  composer test       PHPUnit full suite\\n'; printf '  npm install         install JS deps\\n'; printf '  npm run build       production asset build\\n'; printf '\\nRules:\\n'; printf '  - ALWAYS esc_html/esc_attr/esc_url before output\\n'; printf '  - ALWAYS sanitize_text_field/absint on input\\n'; printf '  - ALWAYS $wpdb->prepare() — never interpolate SQL\\n'; printf '  - ALWAYS check nonce + current_user_can() on AJAX/REST\\n'; printf '  - ALL hooks/options/transients prefixed {{PREFIX}}_\\n'; printf '  - ALL strings wrapped __()/_e() with domain {{TEXT_DOMAIN}}\\n'; printf '\\033[2mBranch: '; git branch --show-current 2>/dev/null || printf 'unknown'; printf '\\033[0m\\n\\n'",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
