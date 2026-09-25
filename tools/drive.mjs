// Uso: node drive.mjs steps.json  — pilota Chrome headless via CDP
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const steps = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = process.argv[3];
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',
  ['--headless=new', '--remote-debugging-port=' + (process.env.PORT || 9333), '--user-data-dir=' + out + '/prof' + (process.env.PORT || ''), '--autoplay-policy=no-user-gesture-required', 'about:blank']);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws;
for (let i = 0; i < 40; i++) {
  try { const l = await (await fetch('http://127.0.0.1:' + (process.env.PORT || 9333) + '/json')).json(); const p = l.find(t => t.type === 'page'); if (p) { ws = new WebSocket(p.webSocketDebuggerUrl); break; } } catch {}
  await sleep(250);
}
await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; const logs = [];
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; }
  if (d.method === 'Runtime.exceptionThrown') logs.push('EXC ' + JSON.stringify(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text));
  if (d.method === 'Runtime.consoleAPICalled' && ['error','warning'].includes(d.params.type)) logs.push(d.params.type + ' ' + d.params.args.map(a => a.value || a.description).join(' ')); };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +(process.env.W || 390), height: +(process.env.H || 844), deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true });
for (const s of steps) {
  if (s.cdp) { const r = await send(s.cdp, s.params || {}); console.log('CDP>', s.cdp, JSON.stringify(r.result || r.error || {}).slice(0, 120)); }
  if (s.nav) { await send('Page.navigate', { url: s.nav }); await sleep(1500); }
  if (s.js) { const r = await send('Runtime.evaluate', { expression: s.js, awaitPromise: true, returnByValue: true }); console.log('JS>', JSON.stringify(r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description)); }
  if (s.tap) { for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: s.tap[0], y: s.tap[1], button: 'left', clickCount: 1 }); }
  if (s.wait) await sleep(s.wait);
  if (s.shot) { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(out + '/shots/' + s.shot + '.png', Buffer.from(r.result.data, 'base64')); console.log('shot', s.shot); }
}
console.log('LOGS:', logs.join('\n') || 'none');
chrome.kill(); process.exit(0);
