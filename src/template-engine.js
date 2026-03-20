/**
 * Template engine
 *
 * Replaces {{TOKEN}} placeholders in template strings using plugin context.
 */

/**
 * Build the full token map from plugin answers.
 * @param {object} answers - Plugin config from prompts
 * @returns {object} Token map
 */
export function buildTokens(answers) {
  const slug        = answers.slug;
  const ns          = answers.namespace;       // e.g. MyAwesomePlugin
  const prefix      = answers.prefix;          // e.g. myawesomeplugin
  const CONST       = prefix.toUpperCase();    // e.g. MYAWESOMEPLUGIN
  const year        = new Date().getFullYear();

  return {
    // Basic info
    '{{PLUGIN_SLUG}}':        slug,
    '{{PLUGIN_NAME}}':        answers.name,
    '{{PLUGIN_DESCRIPTION}}': answers.description,
    '{{PLUGIN_URI}}':         answers.pluginUri || `https://example.com/${slug}`,
    '{{AUTHOR_NAME}}':        answers.author || 'Your Name',
    '{{AUTHOR_URI}}':         answers.authorUri || 'https://example.com',
    '{{MIN_WP}}':             answers.minWp || '6.0',
    '{{MIN_PHP}}':            answers.minPhp || '8.1',
    '{{YEAR}}':               String(year),

    // PHP namespace & prefix
    '{{NAMESPACE}}':          ns,              // MyAwesomePlugin
    '{{PREFIX}}':             prefix,          // myawesomeplugin
    '{{PREFIX_UPPER}}':       CONST,           // MYAWESOMEPLUGIN
    '{{TEXT_DOMAIN}}':        slug,            // my-awesome-plugin (slug doubles as text domain)

    // Derived constant / option names
    '{{CONST_VERSION}}':      `${CONST}_VERSION`,
    '{{CONST_FILE}}':         `${CONST}_PLUGIN_FILE`,
    '{{CONST_DIR}}':          `${CONST}_PLUGIN_DIR`,
    '{{CONST_URL}}':          `${CONST}_PLUGIN_URL`,
    '{{CONST_BASENAME}}':     `${CONST}_BASENAME`,
    '{{OPTION_VERSION}}':     `${prefix}_version`,
    '{{DB_TABLE}}':           `${prefix}_items`,

    // Hook names
    '{{HOOK_PREFIX}}':        prefix,

    // Namespace paths (for use/class refs)
    '{{NS_INCLUDES}}':        `${ns}\\Includes`,
    '{{NS_ADMIN}}':           `${ns}\\Admin`,
    '{{NS_FRONTEND}}':        `${ns}\\Frontend`,
    '{{NS_API}}':             `${ns}\\Api`,

    // Class names
    '{{CLASS_PLUGIN}}':       `${ns}\\Includes\\Plugin`,
    '{{CLASS_ACTIVATOR}}':    `${ns}\\Includes\\Activator`,
    '{{CLASS_DEACTIVATOR}}':  `${ns}\\Includes\\Deactivator`,
    '{{CLASS_SETTINGS}}':     `${ns}\\Admin\\Settings`,
    '{{CLASS_ASSETS}}':       `${ns}\\Frontend\\Assets`,
    '{{CLASS_REST}}':         `${ns}\\Api\\Items_Controller`,

    // File name (slug as php filename)
    '{{PLUGIN_FILE}}':        `${slug}.php`,
  };
}

/**
 * Apply token replacements to a template string.
 * @param {string} template
 * @param {object} tokens
 * @returns {string}
 */
export function render(template, tokens) {
  let result = template;
  for (const [token, value] of Object.entries(tokens)) {
    // Escape special regex chars in token
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escaped, 'g'), value);
  }
  return result;
}
