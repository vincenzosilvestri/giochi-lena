// Trova tutte le emoji usate nel codice e scrive emoji/needed.json (poi: python tools/fetch_emoji.py)
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
export const EMOJI_RE = /\p{RI}\p{RI}|[#*0-9]️?⃣|\p{Extended_Pictographic}(?:️|\p{EMod})?(?:‍\p{Extended_Pictographic}(?:️|\p{EMod})?)*/gu;
const files = ['index.html', 'css/style.css', 'js/app.js', ...fs.readdirSync(path.join(root, 'js/games')).map(f => 'js/games/' + f)];
const found = new Set();
for (const f of files) for (const m of fs.readFileSync(path.join(root, f), 'utf8').matchAll(EMOJI_RE)) {
  if (/^[©®™‼⁉↔↕]$/.test(m[0])) continue;
  found.add(m[0]);
}
const key = e => [...e].filter(c => c !== '️').map(c => c.codePointAt(0).toString(16)).join('-');
const list = [...found].map(e => ({ e, file: key(e) }));
fs.mkdirSync(path.join(root, 'emoji'), { recursive: true });
fs.writeFileSync(path.join(root, 'emoji/needed.json'), JSON.stringify(list, null, 1));
console.log(`${list.length} emoji usate`);
