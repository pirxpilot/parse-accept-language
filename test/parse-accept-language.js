import test from 'node:test';
import pal from '../lib/parse-accept-language.js';

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

test('parse empty', t => {
  let req = request('');
  let parsed = pal(req);

  t.assert.ok(Array.isArray(parsed));
  t.assert.equal(parsed.length, 0);
  req = request();
  parsed = pal(req);

  t.assert.ok(Array.isArray(parsed));
  t.assert.equal(parsed.length, 0);
});

test('parse standard', t => {
  const req = request('en-US,en;q=0.8,pl;q=0.6');
  const parsed = pal(req);

  t.assert.ok(Array.isArray(parsed));
  t.assert.equal(parsed.length, 3);

  t.assert.equal(parsed[0].q, 1);
  t.assert.equal(parsed[1].q, 0.8);
  t.assert.equal(parsed[2].q, 0.6);

  t.assert.equal(parsed[0].value, 'en-US');
  t.assert.equal(parsed[1].value, 'en');
  t.assert.equal(parsed[2].value, 'pl');

  t.assert.equal(parsed[0].region, 'US');
  t.assert.equal(parsed[1].region, '');
  t.assert.equal(parsed[2].region, '');

  t.assert.equal(parsed[0].language, 'en');
  t.assert.equal(parsed[1].language, 'en');
  t.assert.equal(parsed[2].language, 'pl');

  const parsed2 = pal(req);
  t.assert.equal(parsed2, parsed);
});

test('only parse once per request', t => {
  const req = request('en-US,en;q=0.8,pl;q=0.6');
  const parsed1 = pal(req);
  const parsed2 = pal(req);
  t.assert.equal(parsed2, parsed1);
});

test('parse out of order', t => {
  const req = request('de-DE;q=0.2,pl,en-GB;q=0.6');
  const parsed = pal(req);
  t.assert.ok(Array.isArray(parsed));
  t.assert.equal(parsed.length, 3);

  t.assert.equal(parsed[0].q, 1);
  t.assert.equal(parsed[1].q, 0.6);
  t.assert.equal(parsed[2].q, 0.2);

  t.assert.equal(parsed[0].value, 'pl');
  t.assert.equal(parsed[1].value, 'en-GB');
  t.assert.equal(parsed[2].value, 'de-DE');

  t.assert.equal(parsed[0].region, '');
  t.assert.equal(parsed[1].region, 'GB');
  t.assert.equal(parsed[2].region, 'DE');

  t.assert.equal(parsed[0].language, 'pl');
  t.assert.equal(parsed[1].language, 'en');
  t.assert.equal(parsed[2].language, 'de');
});

test('parse country variants', t => {
  const req = request('de-DE,de-AT;q=0.8,de;q=0.6,en-US;q=0.4,en;q=0.2');
  const parsed = pal(req);

  t.assert.ok(Array.isArray(parsed));
  t.assert.equal(parsed.length, 5);

  t.assert.deepEqual(pluck(parsed, 'value'), ['de-DE', 'de-AT', 'de', 'en-US', 'en']);
  t.assert.deepEqual(pluck(parsed, 'region'), ['DE', 'AT', '', 'US', '']);
  t.assert.deepEqual(pluck(parsed, 'language'), ['de', 'de', 'de', 'en', 'en']);
  t.assert.deepEqual(pluck(parsed, 'q'), [1, 0.8, 0.6, 0.4, 0.2]);
});

test('convert region to uppercase', t => {
  const req = request('en-us');
  const parsed = pal(req);

  t.assert.ok(Array.isArray(parsed));
  t.assert.equal(parsed.length, 1);

  t.assert.equal(parsed[0].q, 1);
  t.assert.equal(parsed[0].value, 'en-us');
  t.assert.equal(parsed[0].region, 'US');
  t.assert.equal(parsed[0].language, 'en');
});
