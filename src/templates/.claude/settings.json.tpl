{
  "permissions": {
    "allow": [
      "Read:*",
      "Bash:git:*",
      "Bash:composer:*",
      "Bash:npm:*",
      "Bash:php:*",
      "Bash:phpunit:*",
      "Write:src/**",
      "Write:assets/**",
      "Write:tests/**",
      "Write:languages/**"
    ],
    "deny": [
      "Read:.env",
      "Bash:sudo:*",
      "Bash:rm -rf:*",
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
            "command": "composer lint 2>/dev/null || true",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
