/* Service worker: tutto in cache per giocare offline. Cambiare VERSION a ogni aggiornamento. */
const VERSION = 'lena-v17';
/* le voci stanno in una cache separata che sopravvive agli aggiornamenti (cambiarla solo se si rigenerano con altra voce) */
const VOICE_CACHE = 'lena-voice-1';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css', 'js/app.js',
  'js/games/hop.js', 'js/games/conta.js', 'js/games/memory.js', 'js/games/lettere.js', 'js/games/forme.js', 'js/games/colora.js', 'js/games/suoni.js', 'js/games/scrivi.js', 'js/games/spazio.js', 'js/games/lingue.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/icon-maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(FILES.map(f => new Request(f, { cache: 'no-cache' })));
    /* le voci non si scaricano qui: le scarica l'app, solo per le lingue scelte dal genitore */
    /* immagini delle emoji (poche MB): servono subito e offline */
    try {
      const list = await (await fetch('emoji/index.json', { cache: 'no-cache' })).json();
      await c.add(new Request('emoji/index.json', { cache: 'no-cache' }));
      for (let i = 0; i < list.length; i += 20) await Promise.all(list.slice(i, i + 20).map(f => c.add(`emoji/${f}`).catch(() => {})));
    } catch (err) { /* offline durante l'installazione */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== VOICE_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* rete prima (così gli aggiornamenti arrivano subito), cache se offline; le voci non cambiano: cache prima */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (/\/voice\/[0-9a-f]{8}\.mp3$/.test(e.request.url)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
    return;
  }
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(r => {
        const copy = r.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))),
  );
});
