/**
 * Input validation rules — shared by both interactive prompts and CLI args.
 *
 * Every function returns `true` on success or a human-readable error string.
 */

const RESERVED_SLUGS = new Set([
  'wordpress', 'plugins', 'themes', 'wp-admin', 'wp-content',
  'wp-includes', 'wp-json', 'wp-login', 'wp-cron', 'wp-comments-post',
]);

/**
 * Validate a plugin slug.
 * Must be lowercase letters/numbers/hyphens, start with a letter,
 * not end with a hyphen, and not be a reserved WordPress name.
 *
 * @param {string} v
 * @returns {true|string}
 */
export function validateSlug(v) {
  if (!v || typeof v !== 'string') return 'Slug is required';
  if (!/^[a-z][a-z0-9-]+[a-z0-9]$/.test(v)) {
    return 'Must be lowercase letters, numbers, and hyphens — no leading/trailing hyphens';
  }
  if (RESERVED_SLUGS.has(v)) {
    return `"${v}" is a reserved WordPress name — choose a different slug`;
  }
  return true;
}

/**
 * Validate a PHP namespace (PascalCase, 3–60 chars).
 *
 * @param {string} v
 * @returns {true|string}
 */
export function validateNamespace(v) {
  if (!v || typeof v !== 'string') return 'Namespace is required';
  if (!/^[A-Z][A-Za-z]{2,59}$/.test(v)) {
    return 'Must be PascalCase letters only, 3–60 characters (e.g. MyAwesomePlugin)';
  }
  return true;
}

/**
 * Validate a PHP/JS prefix (lowercase, letters/numbers/underscores).
 *
 * @param {string} v
 * @returns {true|string}
 */
export function validatePrefix(v) {
  if (!v || typeof v !== 'string') return 'Prefix is required';
  if (!/^[a-z][a-z0-9_]{1,30}$/.test(v)) {
    return 'Must be lowercase letters, numbers, or underscores — 2–31 characters';
  }
  return true;
}

/**
 * Validate a WordPress/PHP version string (e.g. "6.0", "8.1", "6.4.2").
 *
 * @param {string} v
 * @returns {true|string}
 */
export function validateVersion(v) {
  if (!v || typeof v !== 'string') return 'Version is required';
  if (!/^\d+\.\d+(\.\d+)?$/.test(v.trim())) {
    return 'Must be a version number like 6.0, 6.4, or 8.1.2';
  }
  return true;
}

/**
 * Sanitize a string for safe insertion into a PHP block comment.
 * Prevents `* /` comment-close injection.
 *
 * @param {string} str
 * @returns {string}
 */
export function sanitizeForPhpComment(str) {
  return String(str).replace(/\*\//g, '* /');
}

/**
 * Convert an author name to a safe Composer vendor slug
 * (lowercase, hyphens only — no spaces or special chars).
 *
 * @param {string} name
 * @returns {string}
 */
export function toComposerVendor(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'vendor';
}
