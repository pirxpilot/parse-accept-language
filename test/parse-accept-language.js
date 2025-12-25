const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const pal = require('../');

function request(language) {
  return {
    get headers() {
      return { 'accept-language': language };
    }
  };
}

function pluck(arr, prop) {
  return arr.map(item => item[prop]);
}

describe('parse-accept-language node module', () => {
  it('parse empty', () => {
    let req = request('');
    let parsed = pal(req);

    assert.ok(Array.isArray(parsed));
    assert.equal(parsed.length, 0);
    req = request();
    parsed = pal(req);

    assert.ok(Array.isArray(parsed));
    assert.equal(parsed.length, 0);
  });

  it('parse standard', () => {
    const req = request('en-US,en;q=0.8,pl;q=0.6');
    const parsed = pal(req);

    assert.ok(Array.isArray(parsed));
    assert.equal(parsed.length, 3);

    assert.equal(parsed[0].q, 1);
    assert.equal(parsed[1].q, 0.8);
    assert.equal(parsed[2].q, 0.6);

    assert.equal(parsed[0].value, 'en-US');
    assert.equal(parsed[1].value, 'en');
    assert.equal(parsed[2].value, 'pl');

    assert.equal(parsed[0].region, 'US');
    assert.equal(parsed[1].region, '');
    assert.equal(parsed[2].region, '');

    assert.equal(parsed[0].language, 'en');
    assert.equal(parsed[1].language, 'en');
    assert.equal(parsed[2].language, 'pl');

    const parsed2 = pal(req);
    assert.equal(parsed2, parsed);
  });

  it('only parse once per request', () => {
    const req = request('en-US,en;q=0.8,pl;q=0.6');
    const parsed1 = pal(req);
    const parsed2 = pal(req);
    assert.equal(parsed2, parsed1);
  });

  it('parse out of order', () => {
    const req = request('de-DE;q=0.2,pl,en-GB;q=0.6');
    const parsed = pal(req);
    assert.ok(Array.isArray(parsed));
    assert.equal(parsed.length, 3);

    assert.equal(parsed[0].q, 1);
    assert.equal(parsed[1].q, 0.6);
    assert.equal(parsed[2].q, 0.2);

    assert.equal(parsed[0].value, 'pl');
    assert.equal(parsed[1].value, 'en-GB');
    assert.equal(parsed[2].value, 'de-DE');

    assert.equal(parsed[0].region, '');
    assert.equal(parsed[1].region, 'GB');
    assert.equal(parsed[2].region, 'DE');

    assert.equal(parsed[0].language, 'pl');
    assert.equal(parsed[1].language, 'en');
    assert.equal(parsed[2].language, 'de');
  });

  it('parse country variants', () => {
    const req = request('de-DE,de-AT;q=0.8,de;q=0.6,en-US;q=0.4,en;q=0.2');
    const parsed = pal(req);

    assert.ok(Array.isArray(parsed));
    assert.equal(parsed.length, 5);

    assert.deepEqual(pluck(parsed, 'value'), ['de-DE', 'de-AT', 'de', 'en-US', 'en']);
    assert.deepEqual(pluck(parsed, 'region'), ['DE', 'AT', '', 'US', '']);
    assert.deepEqual(pluck(parsed, 'language'), ['de', 'de', 'de', 'en', 'en']);
    assert.deepEqual(pluck(parsed, 'q'), [1, 0.8, 0.6, 0.4, 0.2]);
  });

  it('convert region to uppercase', () => {
    const req = request('en-us');
    const parsed = pal(req);

    assert.ok(Array.isArray(parsed));
    assert.equal(parsed.length, 1);

    assert.equal(parsed[0].q, 1);
    assert.equal(parsed[0].value, 'en-us');
    assert.equal(parsed[0].region, 'US');
    assert.equal(parsed[0].language, 'en');
  });
});
