/* Service worker: tutto in cache per giocare offline. Cambiare VERSION a ogni aggiornamento. */
const VERSION = 'lena-v20';
/* voci ed emoji stanno in cache separate che sopravvivono agli aggiornamenti */
const VOICE_CACHE = 'lena-voice-1';
const EMOJI_CACHE = 'lena-emoji-1';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css', 'js/app.js',
  'js/games/hop.js', 'js/games/cucciolo.js', 'js/games/conta.js', 'js/games/memory.js', 'js/games/lettere.js', 'js/games/forme.js', 'js/games/colora.js', 'js/games/suoni.js', 'js/games/scrivi.js', 'js/games/spazio.js', 'js/games/lingue.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/icon-maskable-512.png',
];

/* avanzamento dell'aggiornamento verso l'app (barra sulla schermata iniziale) */
async function tell(done, total) {
  const list = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  list.forEach(c => c.postMessage({ type: 'dl', done, total }));
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    const ec = await caches.open(EMOJI_CACHE);
    let emoji = null;
    try { const r = await fetch('emoji/index.json', { cache: 'no-cache' }); if (r.ok) emoji = await r.json(); } catch (err) { /* offline */ }
    const todo = [];
    let total = FILES.length;
    try {
      for (const f of emoji || []) if (!(await ec.match(`emoji/${f}`))) todo.push(f);
      total = FILES.length + todo.length;
      await tell(0, total);
      for (let i = 0; i < FILES.length; i += 5) {
        await Promise.all(FILES.slice(i, i + 5).map(f => c.add(new Request(f, { cache: 'no-cache' }))));
        await tell(Math.min(FILES.length, i + 5), total);
      }
      if (emoji) await ec.put('emoji/index.json', new Response(JSON.stringify(emoji), { headers: { 'Content-Type': 'application/json' } }));
      for (let i = 0; i < todo.length; i += 20) {
        await Promise.all(todo.slice(i, i + 20).map(f => ec.add(`emoji/${f}`).catch(() => {})));
        await tell(FILES.length + Math.min(todo.length, i + 20), total);
      }
    } finally {
      await tell(total, total);   // anche se l'aggiornamento fallisce la barra sparisce
    }
    /* le voci non si scaricano qui: le scarica l'app, solo per le lingue scelte dal genitore */
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => ![VERSION, VOICE_CACHE, EMOJI_CACHE].includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  /* voci ed emoji non cambiano mai: prima la cache */
  if (/\/voice\/[0-9a-f]{8}\.mp3$/.test(url) || /\/emoji\/[^/]+\.(png|svg)$/.test(url)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok && /\/emoji\//.test(url)) { const copy = res.clone(); caches.open(EMOJI_CACHE).then(cc => cc.put(e.request, copy)); }
      return res;
    })));
    return;
  }
  /* il resto: prima la rete (aggiornamenti subito), la cache se offline; si salvano solo risposte valide */
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(r => {
        if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(cc => cc.put(e.request, copy)); }
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })
        .then(r => r || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()))),
  );
});
