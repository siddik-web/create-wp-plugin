{
  "name": "{{PLUGIN_SLUG}}",
  "version": "1.0.0",
  "description": "{{PLUGIN_DESCRIPTION}}",
  "private": true,
  "scripts": {
    "start": "wp-scripts start",
    "build": "wp-scripts build",
    "lint:js": "wp-scripts lint-js assets/js",
    "lint:css": "wp-scripts lint-style assets/css",
    "makepot": "wp i18n make-pot . languages/{{PLUGIN_SLUG}}.pot --domain={{TEXT_DOMAIN}}"
  },
  "devDependencies": {
    "@wordpress/scripts": "^27.0"
  }
}
