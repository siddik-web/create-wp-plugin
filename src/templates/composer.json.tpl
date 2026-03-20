{
  "name": "{{AUTHOR_NAME}}/{{PLUGIN_SLUG}}",
  "description": "{{PLUGIN_DESCRIPTION}}",
  "type": "wordpress-plugin",
  "license": "GPL-2.0-or-later",
  "require": {
    "php": ">={{MIN_PHP}}"
  },
  "require-dev": {
    "phpunit/phpunit": "^9.6",
    "10up/wp_mock": "^0.5",
    "squizlabs/php_codesniffer": "^3.7",
    "wp-coding-standards/wpcs": "^3.0",
    "phpcompatibility/phpcompatibility-wp": "^2.1"
  },
  "autoload": {
    "psr-4": {
      "{{NAMESPACE}}\\": "src/"
    }
  },
  "autoload-dev": {
    "psr-4": {
      "{{NAMESPACE}}\\Tests\\": "tests/"
    }
  },
  "scripts": {
    "test": "phpunit",
    "test:unit": "phpunit --testsuite unit",
    "test:integration": "phpunit --testsuite integration",
    "test:coverage": "phpunit --coverage-html reports/coverage",
    "lint": "phpcs --standard=WordPress src/",
    "lint:fix": "phpcbf --standard=WordPress src/",
    "post-install-cmd": [
      "vendor/bin/phpcs --config-set installed_paths vendor/wp-coding-standards/wpcs,vendor/phpcompatibility/phpcompatibility-wp"
    ]
  },
  "config": {
    "allow-plugins": {
      "dealerdirect/phpcodesniffer-composer-installer": true
    }
  }
}
