const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const js = fs.readFileSync('callback.js', 'utf8');
const html = fs.readFileSync('callback.html', 'utf8');
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

function render(query = '') {
  const ids = ['title', 'message', 'status-icon', 'open-app', 'help'];
  const nodes = Object.fromEntries(ids.map(id => [id, {
    textContent: '', href: '', hidden: true, classList: { add() {} },
  }]));
  const address = new URL('https://mi-bolsillo-web-two.vercel.app/auth/callback' + query);
  const navigation = [];
  const history = [];
  const timers = [];
  const window = {
    location: { search: address.search, hash: address.hash, assign(url) { navigation.push(url); } },
    history: { replaceState(...args) { history.push(args); } },
    setTimeout(fn) { timers.push(fn); },
  };
  vm.runInNewContext(js, { window, document: { getElementById: id => nodes[id] }, URLSearchParams });
  return { nodes, navigation, history, timers };
}

test('La ruta web está configurada y no se almacena en caché', () => {
  assert(vercel.rewrites.some(rule => rule.source === '/auth/callback' && rule.destination === '/callback.html'));
  assert(vercel.headers.some(item => item.source === '/auth/callback' &&
    item.headers.some(header => header.key === 'Cache-Control' && header.value.includes('no-store'))));
  assert(html.includes('referrer" content="no-referrer"'));
  assert(!html.includes('fonts.googleapis.com'));
});

test('Un código PKCE válido va solo a Mi Bolsillo', () => {
  const { nodes, history, navigation, timers } = render('?code=abc_123-xyz');
  assert.equal(nodes['open-app'].hidden, false);
  assert.equal(nodes['open-app'].href, 'mibolsillo://auth/callback?code=abc_123-xyz');
  assert.equal(history[0][2], '/auth/callback');
  assert.equal(timers.length, 1);
  timers[0]();
  assert.deepEqual(navigation, ['mibolsillo://auth/callback?code=abc_123-xyz']);
});

test('Cancelación, ausencia de código y caracteres inválidos se bloquean', () => {
  for (const query of ['', '?error=access_denied', '?code=a%2Fb']) {
    const { nodes, navigation, timers, history } = render(query);
    assert.equal(nodes['open-app'].hidden, true);
    assert.equal(navigation.length, 0);
    assert.equal(timers.length, 0);
    assert.equal(history[0][2], '/auth/callback');
  }
});

test('Un fragmento de callback también admite código y omite tokens implícitos', () => {
  const { nodes } = render('#code=abc123');
  assert.equal(nodes['open-app'].href, 'mibolsillo://auth/callback?code=abc123');
  const invalid = render('#access_token=token&refresh_token=token');
  assert.equal(invalid.nodes['open-app'].hidden, true);
});
