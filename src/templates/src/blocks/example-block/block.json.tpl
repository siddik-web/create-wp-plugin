{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "{{PREFIX}}/example-block",
  "version": "1.0.0",
  "title": "{{PLUGIN_NAME}} Block",
  "category": "widgets",
  "icon": "smiley",
  "description": "An example block scaffolded by {{PLUGIN_NAME}}.",
  "textdomain": "{{TEXT_DOMAIN}}",
  "editorScript": "file:./index.js",
  "editorStyle":  "file:./index.css",
  "style":        "file:./style-index.css",
  "attributes": {
    "message": {
      "type":    "string",
      "default": "Hello from {{PLUGIN_NAME}}!"
    },
    "align": {
      "type": "string"
    }
  },
  "supports": {
    "html":  false,
    "align": [ "wide", "full" ],
    "color": {
      "text":       true,
      "background": true
    },
    "typography": {
      "fontSize": true
    }
  }
}
