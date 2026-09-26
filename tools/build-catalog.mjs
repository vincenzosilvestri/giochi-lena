// Estrae tutte le frasi fisse dell'app e scrive voice/catalog.json + voice/index.json.
// Uso: node tools/build-catalog.mjs   (poi: python tools/gen_voice.py)
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const files = ['js/app.js', 'js/games/hop.js', 'js/games/cucciolo.js', 'js/games/conta.js', 'js/games/memory.js', 'js/games/lettere.js', 'js/games/forme.js', 'js/games/colora.js', 'js/games/suoni.js', 'js/games/scrivi.js', 'js/games/spazio.js', 'js/games/lingue.js'];
const ctx = { console, setTimeout, clearTimeout, setInterval, performance: { now: () => 0 }, requestAnimationFrame: () => 0, navigator: {} };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });

const list = vm.runInContext('App.phrases().map(([l, t]) => [App.vhash(t, l), l, t])', ctx);
const byHash = new Map();
for (const [h, lang, text] of list) if (!byHash.has(h)) byHash.set(h, { h, lang, text });
const catalog = [...byHash.values()];
fs.writeFileSync(path.join(root, 'voice/catalog.json'), JSON.stringify(catalog, null, 1));
fs.writeFileSync(path.join(root, 'voice/index.json'), JSON.stringify(catalog.map(c => c.h)));
/* un indice per lingua: il telefono scarica solo le voci delle lingue scelte */
for (const l of [...new Set(catalog.map(c => c.lang))]) fs.writeFileSync(path.join(root, `voice/index-${l}.json`), JSON.stringify(catalog.filter(c => c.lang === l).map(c => c.h)));
console.log(`${catalog.length} frasi nel catalogo`, Object.entries(catalog.reduce((a, c) => ((a[c.lang] = (a[c.lang] || 0) + 1), a), {})).map(([k, v]) => `${k} ${v}`).join(', '));
