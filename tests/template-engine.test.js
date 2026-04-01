import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTokens, render } from '../src/template-engine.js';
import { validateSlug, validateNamespace, validatePrefix, validateVersion, sanitizeForPhpComment, toComposerVendor } from '../src/validator.js';

const baseAnswers = {
  slug:        'my-cool-plugin',
  name:        'My Cool Plugin',
  description: 'A test plugin.',
  pluginUri:   'https://example.com/my-cool-plugin',
  author:      'Jane Doe',
  authorUri:   'https://janedoe.dev',
  namespace:   'MyCoolPlugin',
  prefix:      'mycoolplugin',
  minWp:       '6.0',
  minPhp:      '8.1',
};

describe('buildTokens()', () => {
  it('derives CONST prefix from prefix', () => {
    const tokens = buildTokens(baseAnswers);
    assert.equal(tokens['{{PREFIX_UPPER}}'], 'MYCOOLPLUGIN');
  });

  it('builds CONST_VERSION correctly', () => {
    const tokens = buildTokens(baseAnswers);
    assert.equal(tokens['{{CONST_VERSION}}'], 'MYCOOLPLUGIN_VERSION');
  });

  it('uses slug as TEXT_DOMAIN', () => {
    const tokens = buildTokens(baseAnswers);
    assert.equal(tokens['{{TEXT_DOMAIN}}'], 'my-cool-plugin');
  });

  it('builds DB_TABLE from prefix', () => {
    const tokens = buildTokens(baseAnswers);
    assert.equal(tokens['{{DB_TABLE}}'], 'mycoolplugin_items');
  });

  it('includes current year', () => {
    const tokens = buildTokens(baseAnswers);
    assert.equal(tokens['{{YEAR}}'], String(new Date().getFullYear()));
  });

  it('builds COMPOSER_VENDOR from author name', () => {
    const tokens = buildTokens(baseAnswers);
    assert.equal(tokens['{{COMPOSER_VENDOR}}'], 'jane-doe');
  });

  it('WOOCOMMERCE_HOOK is empty when hasWooCommerce is false', () => {
    const tokens = buildTokens({ ...baseAnswers, hasWooCommerce: false });
    assert.equal(tokens['{{WOOCOMMERCE_HOOK}}'], '');
  });

  it('WOOCOMMERCE_HOOK is empty when hasWooCommerce is undefined', () => {
    const tokens = buildTokens(baseAnswers);
    assert.equal(tokens['{{WOOCOMMERCE_HOOK}}'], '');
  });

  it('WOOCOMMERCE_HOOK is non-empty when hasWooCommerce is true', () => {
    const tokens = buildTokens({ ...baseAnswers, hasWooCommerce: true });
    assert.ok(tokens['{{WOOCOMMERCE_HOOK}}'].includes('register_woocommerce'));
  });

  it('sanitizes description containing PHP comment-close sequence', () => {
    const tokens = buildTokens({ ...baseAnswers, description: 'Plugin with */ injection' });
    assert.ok(!tokens['{{PLUGIN_DESCRIPTION}}'].includes('*/'));
    assert.ok(tokens['{{PLUGIN_DESCRIPTION}}'].includes('* /'));
  });
});

describe('render()', () => {
  it('replaces a single token', () => {
    const result = render('Hello {{PLUGIN_NAME}}!', { '{{PLUGIN_NAME}}': 'My Cool Plugin' });
    assert.equal(result, 'Hello My Cool Plugin!');
  });

  it('replaces multiple occurrences of the same token', () => {
    const result = render('{{A}} and {{A}}', { '{{A}}': 'X' });
    assert.equal(result, 'X and X');
  });

  it('replaces multiple different tokens', () => {
    const result = render('{{A}}/{{B}}', { '{{A}}': 'foo', '{{B}}': 'bar' });
    assert.equal(result, 'foo/bar');
  });

  it('leaves unrecognised tokens untouched', () => {
    const result = render('{{UNKNOWN}}', { '{{KNOWN}}': 'x' });
    assert.equal(result, '{{UNKNOWN}}');
  });

  it('handles empty template string', () => {
    const result = render('', { '{{A}}': 'x' });
    assert.equal(result, '');
  });

  it('handles template with no tokens', () => {
    const result = render('plain text', {});
    assert.equal(result, 'plain text');
  });
});

describe('validateSlug()', () => {
  it('accepts valid slugs', () => {
    assert.equal(validateSlug('my-plugin'), true);
    assert.equal(validateSlug('my-awesome-plugin'), true);
    assert.equal(validateSlug('plugin123'), true);
  });

  it('rejects slugs with trailing hyphens', () => {
    assert.notEqual(validateSlug('my-plugin-'), true);
  });

  it('rejects slugs starting with a number', () => {
    assert.notEqual(validateSlug('1my-plugin'), true);
  });

  it('rejects single-character slugs', () => {
    assert.notEqual(validateSlug('p'), true);
  });

  it('rejects reserved WordPress slugs', () => {
    assert.notEqual(validateSlug('wordpress'), true);
    assert.notEqual(validateSlug('plugins'), true);
    assert.notEqual(validateSlug('wp-admin'), true);
    assert.notEqual(validateSlug('wp-content'), true);
  });

  it('rejects empty or non-string input', () => {
    assert.notEqual(validateSlug(''), true);
    assert.notEqual(validateSlug(null), true);
    assert.notEqual(validateSlug(undefined), true);
  });
});

describe('validateNamespace()', () => {
  it('accepts valid PascalCase namespaces', () => {
    assert.equal(validateNamespace('MyPlugin'), true);
    assert.equal(validateNamespace('MyAwesomePlugin'), true);
  });

  it('rejects namespaces shorter than 3 chars', () => {
    assert.notEqual(validateNamespace('My'), true);
  });

  it('rejects namespaces starting with lowercase', () => {
    assert.notEqual(validateNamespace('myPlugin'), true);
  });

  it('rejects namespaces with numbers or special chars', () => {
    assert.notEqual(validateNamespace('My1Plugin'), true);
    assert.notEqual(validateNamespace('My_Plugin'), true);
  });
});

describe('validatePrefix()', () => {
  it('accepts valid prefixes', () => {
    assert.equal(validatePrefix('myplugin'), true);
    assert.equal(validatePrefix('my_plugin'), true);
  });

  it('rejects prefixes starting with a number', () => {
    assert.notEqual(validatePrefix('1myplugin'), true);
  });

  it('rejects prefixes with hyphens', () => {
    assert.notEqual(validatePrefix('my-plugin'), true);
  });

  it('rejects single-character prefixes', () => {
    assert.notEqual(validatePrefix('m'), true);
  });
});

describe('validateVersion()', () => {
  it('accepts valid version strings', () => {
    assert.equal(validateVersion('6.0'), true);
    assert.equal(validateVersion('8.1'), true);
    assert.equal(validateVersion('6.4.2'), true);
  });

  it('rejects non-numeric versions', () => {
    assert.notEqual(validateVersion('foo.bar'), true);
    assert.notEqual(validateVersion('latest'), true);
    assert.notEqual(validateVersion(''), true);
  });

  it('rejects single-number versions', () => {
    assert.notEqual(validateVersion('6'), true);
  });
});

describe('sanitizeForPhpComment()', () => {
  it('replaces */ with * /', () => {
    assert.equal(sanitizeForPhpComment('hello */ world'), 'hello * / world');
  });

  it('leaves safe strings unchanged', () => {
    assert.equal(sanitizeForPhpComment('A safe description.'), 'A safe description.');
  });

  it('handles multiple occurrences', () => {
    const result = sanitizeForPhpComment('a */ b */ c');
    assert.ok(!result.includes('*/'));
  });
});

describe('toComposerVendor()', () => {
  it('converts spaces to hyphens and lowercases', () => {
    assert.equal(toComposerVendor('Jane Doe'), 'jane-doe');
  });

  it('strips special characters', () => {
    assert.equal(toComposerVendor('Jane@Doe!'), 'jane-doe');
  });

  it('handles already-valid names', () => {
    assert.equal(toComposerVendor('janedoe'), 'janedoe');
  });

  it('falls back to "vendor" for empty input', () => {
    assert.equal(toComposerVendor(''), 'vendor');
  });
});
