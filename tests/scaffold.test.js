import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { writeFile } from '../src/file-writer.js';
import { buildTokens, render } from '../src/template-engine.js';
import { readFileSync as rf } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TMP = join(__dirname, '../tmp/smoke-test');
const TEMPLATES = join(__dirname, '../src/templates');

const answers = {
  slug:        'smoke-test',
  name:        'Smoke Test',
  description: 'Smoke test plugin.',
  pluginUri:   'https://example.com',
  author:      'CI Bot',
  authorUri:   'https://example.com',
  namespace:   'SmokeTest',
  prefix:      'smoketest',
  minWp:       '6.0',
  minPhp:      '8.1',
};

const tokens = buildTokens(answers);

function tpl(rel) {
  return readFileSync(join(TEMPLATES, rel), 'utf8');
}

before(() => {
  mkdirSync(TMP, { recursive: true });
});

after(() => {
  rmSync(TMP, { recursive: true, force: true });
});

describe('scaffold file-writer integration', () => {
  it('writes plugin entry file with correct tokens', () => {
    writeFile(TMP, '{{PLUGIN_SLUG}}.php', tpl('plugin-entry.php.tpl'), tokens);
    const out = join(TMP, 'smoke-test.php');
    assert.ok(existsSync(out), 'Plugin entry file should exist');
    const content = readFileSync(out, 'utf8');
    assert.ok(content.includes('SmokeTest'), 'Namespace token replaced');
    assert.ok(content.includes('smoketest'), 'Prefix token replaced');
    assert.ok(content.includes('smoke-test'), 'Slug token replaced');
    assert.ok(!content.includes('{{'), 'No unreplaced tokens remain');
  });

  it('writes composer.json with correct autoload namespace', () => {
    writeFile(TMP, 'composer.json', tpl('composer.json.tpl'), tokens);
    const content = readFileSync(join(TMP, 'composer.json'), 'utf8');
    const json = JSON.parse(content);
    assert.equal(json.autoload['psr-4']['SmokeTest\\'], 'src/');
  });

  it('writes CLAUDE.md with plugin-specific content', () => {
    writeFile(TMP, 'CLAUDE.md', tpl('CLAUDE.md.tpl'), tokens);
    const content = readFileSync(join(TMP, 'CLAUDE.md'), 'utf8');
    assert.ok(content.includes('Smoke Test'), 'Plugin name present');
    assert.ok(content.includes('smoketest/v1'), 'REST namespace present');
    assert.ok(!content.includes('{{'), 'No unreplaced tokens');
  });

  it('writes REST controller with correct namespace', () => {
    writeFile(TMP, 'src/api/class-rest-controller.php',
      tpl('src/api/class-rest-controller.php.tpl'), tokens);
    const content = readFileSync(join(TMP, 'src/api/class-rest-controller.php'), 'utf8');
    assert.ok(content.includes('namespace SmokeTest\\Api'));
    assert.ok(content.includes("'smoketest/v1'"));
    assert.ok(!content.includes('{{'));
  });
});
