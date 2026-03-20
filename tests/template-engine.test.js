import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTokens, render } from '../src/template-engine.js';

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
