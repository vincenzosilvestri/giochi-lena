/* Service worker: tutto in cache per giocare offline. Cambiare VERSION a ogni aggiornamento. */
const VERSION = 'lena-v10';
/* le voci stanno in una cache separata che sopravvive agli aggiornamenti (cambiarla solo se si rigenerano con altra voce) */
const VOICE_CACHE = 'lena-voice-1';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css', 'js/app.js',
  'js/games/hop.js', 'js/games/conta.js', 'js/games/memory.js', 'js/games/lettere.js', 'js/games/forme.js', 'js/games/colora.js', 'js/games/lingue.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/icon-maskable-512.png', 'voice/index.json',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(FILES.map(f => new Request(f, { cache: 'no-cache' })));
    /* voci: una per una, così un file mancante non blocca l'installazione */
    const vc = await caches.open(VOICE_CACHE);
    const list = await (await fetch('voice/index.json')).json();
    for (let i = 0; i < list.length; i += 20) {
      await Promise.all(list.slice(i, i + 20).map(async h => {
        const url = `voice/${h}.mp3`;
        if (!(await vc.match(url))) await vc.add(url).catch(() => {});
      }));
    }
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
