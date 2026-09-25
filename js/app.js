/* Giochi di Lena — nucleo dell'app: stato, voce, suoni, schermate, premi, timer, area genitori. */
const App = (() => {
  const NAME = 'Lena';
  const BIRTH = { y: 2022, m: 0, d: 27 }; // 27 gennaio 2022
  const KEY = 'lena_v1';
  const VERSION = '5 · 25/09/2026'; // aggiornare insieme a VERSION in sw.js

  const CHARS = [
    { id: 'coniglio', e: '🐰', name: 'Coniglietto', the: 'il coniglietto' },
    { id: 'gatto', e: '🐱', name: 'Gattino', the: 'il gattino' },
    { id: 'unicorno', e: '🦄', name: 'Unicorno', the: "l'unicorno" },
    { id: 'cane', e: '🐶', name: 'Cagnolino', the: 'il cagnolino' },
  ];
  const COLORS = [
    { c: '#ff6fa8', n: 'Rosa' }, { c: '#ff5a5a', n: 'Rosso' }, { c: '#ff9f40', n: 'Arancione' },
    { c: '#f5c400', n: 'Giallo' }, { c: '#3cc45c', n: 'Verde' }, { c: '#2ed3c6', n: 'Turchese' },
    { c: '#3fb0ff', n: 'Azzurro' }, { c: '#4a6cff', n: 'Blu' }, { c: '#9b5cff', n: 'Viola' },
    { c: '#d17de8', n: 'Lilla' },
  ];
  const STICKERS = ['🦄', '🌈', '🍦', '🎈', '🦋', '🌸', '⭐', '🐞', '🍓', '🐬', '🦊', '🐼',
    '🧁', '🎀', '🐙', '🌻', '🍭', '🐢', '🦜', '🏰', '👑', '🚀', '🐳', '🍉'];
  const VOICE_SLOTS = [
    { id: 'ciao', label: 'Saluto all\'apertura', hint: 'es. «Ciao amore, giochiamo?»', max: 3 },
    { id: 'bravo', label: 'Complimenti', hint: 'es. «Bravissima Lena!», «Sei un fenomeno!»', max: 6 },
    { id: 'nanna', label: 'Buonanotte (fine tempo)', hint: 'es. «Ora basta giocare, vieni ad abbracciarmi!»', max: 3 },
  ];
  const PRAISE = ['Bravissima!', 'Brava Lena!', 'Evviva!', 'Super!', 'Fantastico!', 'Che brava!', 'Grande Lena!', 'Perfetto!'];
  const RETRY = ['Riprova!', 'Quasi! Riprova.', 'Prova ancora!'];

  const games = [];
  let state;
  let cleanup = null;
  let screenName = '';
  let started = false;

  /* ---------- utilità ---------- */
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (const k of kids.flat()) {
      if (k == null || k === false) continue;
      e.append(k.nodeType ? k : document.createTextNode(k));
    }
    return e;
  }

  /* ---------- stato ---------- */
  const defaults = () => ({
    char: null, color: '#ff6fa8', stickers: [], levels: {}, timerMin: 20, pin: null,
    usage: { day: '', sec: 0, extra: 0, warned: false }, bdayShown: 0, hopBest: 0, diploma: false, tut: {},
  });
  function load() {
    try { state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { state = defaults(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage pieno o bloccato */ } }
  const char = () => CHARS.find(c => c.id === state.char) || CHARS[0];
  const level = id => state.levels[id] || 1;
  function setLevel(id, n) { state.levels[id] = n; save(); }

  /* ---------- tema ---------- */
  function mix(hex, other, t) {
    const a = parseInt(hex.slice(1), 16), b = parseInt(other.slice(1), 16);
    const ch = s => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
    return '#' + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, '0')).join('');
  }
  function applyTheme(c) {
    const r = document.documentElement.style;
    r.setProperty('--accent', c);
    r.setProperty('--accent-soft', mix(c, '#ffffff', .82));
    r.setProperty('--accent-dark', mix(c, '#000000', .22));
    r.setProperty('--bg', mix(c, '#ffffff', .95));
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.setAttribute('content', c);
  }

  /* ---------- suoni ---------- */
  let ac = null;
  function unlockAudio() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; } }
    if (ac && ac.state === 'suspended') ac.resume();
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* non supportato */ }
  }
  function tone(freq, dur, type = 'sine', vol = .2, when = 0, slideTo = 0) {
    if (!ac) return;
    const t = ac.currentTime + when;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .02);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(ac.destination);
    o.start(t); o.stop(t + dur + .05);
  }
  function noise(dur, vol = .15) {
    if (!ac) return;
    const len = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 900;
    g.gain.value = vol; s.buffer = buf;
    s.connect(f).connect(g).connect(ac.destination);
    s.start();
  }
  const sfx = {
    pop: () => tone(600, .12, 'sine', .25, 0, 900),
    tap: () => tone(700, .06, 'triangle', .12),
    ding: () => { tone(880, .25, 'triangle', .2); tone(1320, .35, 'triangle', .15, .08); },
    boing: () => tone(320, .3, 'sine', .2, 0, 130),
    hop: () => tone(420, .08, 'square', .05, 0, 640),
    star: () => { tone(1046, .12, 'triangle', .15); tone(1568, .2, 'triangle', .12, .06); },
    splash: () => noise(.5, .25),
    puff: () => { noise(.3, .18); tone(260, .25, 'sine', .12, 0, 90); },
    flip: () => tone(500, .07, 'triangle', .12, 0, 700),
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .3, 'triangle', .18, i * .12)),
  };
  function birthdaySong() {
    const N = { G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, F5: 698, G5: 784 };
    const song = [['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
      ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
      ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
      ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2]];
    const beat = .42;
    let t = 0;
    for (const [n, b] of song) { tone(N[n], b * beat * .95, 'triangle', .2, t); t += b * beat; }
    return t;
  }

  /* ---------- voce ----------
     Le frasi fisse sono file audio pre-generati (voice/<hash>.mp3, vedi tools/).
     Quelle non in catalogo (es. nomi dalle foto) usano la sintesi vocale del telefono. */
  let voice = null;
  let clipAudio = null;
  let clipSrc = null;
  let gen = 0;
  let chain = Promise.resolve();
  const clips = { have: new Set(), buf: new Map() };
  const vkey = t => t.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
  function vhash(t) {
    let x = 0x811c9dc5;
    for (const ch of vkey(t)) { x ^= ch.codePointAt(0); x = Math.imul(x, 0x01000193) >>> 0; }
    return x.toString(16).padStart(8, '0');
  }
  async function loadVoiceIndex() {
    try { clips.have = new Set(await (await fetch('voice/index.json')).json()); } catch (e) { clips.have = new Set(); }
  }
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const it = speechSynthesis.getVoices().filter(v => /^it/i.test(v.lang));
    voice = it.find(v => /premium|enhanced|alice|federica|elsa|google/i.test(v.name)) || it[0] || null;
  }
  function stopVoice() {
    gen++;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (clipAudio) { clipAudio.pause(); clipAudio = null; }
    if (clipSrc) { try { clipSrc.stop(); } catch (e) { /* già fermo */ } clipSrc = null; }
  }
  async function playFile(hsh, my) {
    let b = clips.buf.get(hsh);
    if (!b) {
      const data = await (await fetch(`voice/${hsh}.mp3`)).arrayBuffer();
      b = await ac.decodeAudioData(data);
      clips.buf.set(hsh, b);
    }
    if (my !== gen) return;
    await new Promise(res => {
      const s = ac.createBufferSource();
      s.buffer = b;
      s.connect(ac.destination);
      s.onended = () => { if (clipSrc === s) clipSrc = null; res(); };
      clipSrc = s;
      s.start();
    });
  }
  function speakTTS(text, opts, my) {
    if (!('speechSynthesis' in window) || my !== gen) return Promise.resolve();
    return new Promise(res => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'it-IT';
      if (voice) u.voice = voice;
      u.rate = opts.rate || .95;
      u.pitch = 1.05;
      let done = false;
      const end = () => { if (!done) { done = true; res(); } };
      u.onend = end; u.onerror = end;
      setTimeout(end, 1500 + text.length * 110);
      speechSynthesis.speak(u);
    });
  }
  function say(text, opts = {}) {
    if (!opts.queue) stopVoice();
    const my = gen;
    const run = async () => {
      if (my !== gen) return;
      const hsh = vhash(text);
      if (ac && clips.have.has(hsh)) {
        try { return await playFile(hsh, my); } catch (e) { /* file non disponibile: sintesi */ }
      } else if (clips.have.size) console.warn('voce mancante:', text);
      return speakTTS(text, opts, my);
    };
    chain = (opts.queue ? chain : Promise.resolve()).then(run, run);
    return chain;
  }
  function playClip(slot) {
    const list = media.voices[slot] || [];
    if (!list.length) return null;
    stopVoice();
    clipAudio = new Audio(pick(list).url);
    return new Promise(res => {
      clipAudio.onended = res; clipAudio.onerror = res;
      clipAudio.play().catch(res);
    });
  }
  function praise() {
    if ((media.voices.bravo || []).length && Math.random() < .6) return playClip('bravo');
    return say(pick(PRAISE));
  }
  const retry = () => say(pick(RETRY));

  /* ---------- foto e voci registrate (IndexedDB) ---------- */
  const media = { voices: {}, photos: [], drawings: [] };
  const DB = {
    db: null,
    open() {
      return new Promise(res => {
        if (!('indexedDB' in window)) return res();
        const r = indexedDB.open('lena', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('media', { keyPath: 'id' });
        r.onsuccess = () => { this.db = r.result; res(); };
        r.onerror = () => res();
      });
    },
    tx(mode, fn) {
      return new Promise(res => {
        if (!this.db) return res(null);
        const req = fn(this.db.transaction('media', mode).objectStore('media'));
        req.onsuccess = () => res(req.result);
        req.onerror = () => res(null);
      });
    },
    all() { return this.tx('readonly', s => s.getAll()).then(r => r || []); },
    put(item) { return this.tx('readwrite', s => s.put(item)); },
    del(id) { return this.tx('readwrite', s => s.delete(id)); },
  };
  async function reloadMedia() {
    Object.values(media.voices).flat().concat(media.photos, media.drawings).forEach(m => URL.revokeObjectURL(m.url));
    media.voices = {}; media.photos = []; media.drawings = [];
    const items = await DB.all();
    items.sort((a, b) => a.created - b.created);
    for (const it of items) {
      const m = { id: it.id, name: it.name, secs: it.secs, url: URL.createObjectURL(it.blob) };
      if (it.kind === 'voice') (media.voices[it.slot] = media.voices[it.slot] || []).push(m);
      else if (it.kind === 'photo') media.photos.push(m);
      else if (it.kind === 'drawing') media.drawings.push(m);
    }
  }

  /* ---------- effetti ---------- */
  function confetti(n = 70) {
    const fx = document.getElementById('fx');
    const cols = ['#ff6fa8', '#ffd23f', '#4cd06b', '#3fb8ff', '#9b5cff', '#ff9f40'];
    for (let i = 0; i < n; i++) {
      const gl = i % 3 === 0;
      const d = h('div', { class: gl ? 'confetto glitter' : 'confetto' });
      const dur = 1.6 + Math.random() * 1.6;
      d.style.cssText = `left:${Math.random() * 100}%;background:${gl ? pick(GLITTER) : pick(cols)};animation-duration:${dur}s;animation-delay:${Math.random() * .5}s`;
      fx.append(d);
      setTimeout(() => d.remove(), (dur + .6) * 1000);
    }
  }
  /* brillantini: piccola esplosione di glitter nel punto toccato */
  const GLITTER = ['#ffd700', '#fff4b0', '#ff9ad5', '#c9a7ff', '#9fe8ff', '#ffffff'];
  function glitter(x, y, n = 9) {
    const fx = document.getElementById('fx');
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, dist = 25 + Math.random() * 45;
      const star = Math.random() < .35;
      const sz = star ? 14 + Math.random() * 8 : 5 + Math.random() * 5;
      const d = h('div', { class: star ? 'gl-star' : 'gl-dot' }, star ? '✦' : null);
      d.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * dist}px;--dy:${Math.sin(a) * dist}px;` +
        (star ? `font-size:${sz}px;color:${pick(GLITTER)}` : `width:${sz}px;height:${sz}px;background:${pick(GLITTER)}`);
      fx.append(d);
      setTimeout(() => d.remove(), 900);
    }
  }
  function floatAt(x, y, emoji) {
    const d = h('div', { class: 'float-emoji', style: `left:${x}px;top:${y}px` }, emoji);
    document.getElementById('fx').append(d);
    setTimeout(() => d.remove(), 1300);
  }

  /* ---------- schermate ---------- */
  let pendingReload = false;
  function show(name, cls, render) {
    if (pendingReload && (name === 'home' || name === 'splash')) { location.reload(); return; }
    if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
    document.querySelectorAll('.modal-back, .tut').forEach(m => m.remove());
    const app = document.getElementById('app');
    app.innerHTML = '';
    const scr = h('div', { class: 'screen ' + cls });
    app.append(scr);
    screenName = name;
    const c = render(scr);
    if (typeof c === 'function') cleanup = c;
  }

  function modal(content) {
    const back = h('div', { class: 'modal-back' }, h('div', { class: 'modal' }, content));
    document.body.append(back);
    return () => back.remove();
  }

  function splash() {
    show('splash', 'splash', s => {
      s.append(
        h('div', { class: 'hero' }, state.char ? char().e : '🌈'),
        h('h1', {}, `Ciao ${NAME}!`),
        h('button', { class: 'big-btn', onclick: start }, 'Giochiamo! ▶'),
        h('div', { class: 'ver' }, `versione ${VERSION}`),
        ...[...Array(14)].map(() => h('span', {
          class: 'spark',
          style: `left:${rint(4, 92)}%;top:${rint(4, 92)}%;font-size:${rint(14, 34)}px;animation-delay:-${(Math.random() * 2.4).toFixed(2)}s`,
        }, '✦')),
      );
    });
  }

  function start() {
    unlockAudio();
    pickVoice();
    started = true;
    if (isLocked()) return sleepScreen();
    const greet = (media.voices.ciao || []).length ? playClip('ciao') : say(`Ciao ${NAME}! Giochiamo?`);
    if (isBirthdayToday() && state.bdayShown !== new Date().getFullYear()) {
      stopVoice();
      return birthday(false);
    }
    if (!state.char) return setup(true);
    home();
    return greet;
  }

  function home() {
    show('home', 'home', s => {
      let pressT = null;
      const gear = h('button', { class: 'icon-btn gear', 'aria-label': 'Area genitori' }, '⚙️');
      const startPress = () => { pressT = setTimeout(parentGate, 1500); };
      const endPress = () => clearTimeout(pressT);
      gear.addEventListener('pointerdown', startPress);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => gear.addEventListener(ev, endPress));
      gear.addEventListener('click', () => say('Questo è per papà!'));

      s.append(h('div', { class: 'home-head' },
        h('button', { class: 'avatar', onclick: () => { sfx.pop(); setup(false); } }, char().e),
        h('h1', {}, `Ciao ${NAME}!`),
        gear,
      ));
      const tiles = h('div', { class: 'tiles' });
      games.forEach((g, i) => {
        tiles.append(h('button', {
          class: `tile t${i + 1}` + (i === games.length - 1 && games.length % 2 ? ' wide' : ''),
          onclick: () => { sfx.pop(); say(g.title); startGame(g); },
        }, h('div', { class: 'ico' }, g.icon), h('div', { class: 'lbl' }, g.title)));
      });
      tiles.append(h('button', {
        class: 'tile talbum wide',
        onclick: () => { sfx.pop(); album(); },
      }, h('div', { class: 'ico' }, '📒'), h('div', { class: 'lbl' }, `Album di ${NAME}  ${state.stickers.length}/${STICKERS.length}`)));
      s.append(tiles);
      const t = state.tut.home ? 0 : setTimeout(() => screenName === 'home' && intro('home', [
        { text: 'Tocca un gioco per iniziare!', icon: '🎮', action: 'tap', at: () => tiles.children[0] },
        { text: 'Qui trovi gli sticker che vinci giocando!', icon: '📒', action: 'tap', at: () => tiles.lastElementChild },
      ]), 2600);
      return () => { endPress(); clearTimeout(t); };
    });
  }

  function setup(first) {
    show('setup', 'setup', s => {
      let selC = state.char || null;
      let selCol = state.color;
      const charBtns = CHARS.map(c => h('button', {
        class: 'char-btn' + (c.id === selC ? ' sel' : ''),
        onclick: () => {
          selC = c.id; sfx.pop(); say(c.name + '!');
          charBtns.forEach((b, i) => b.classList.toggle('sel', CHARS[i].id === selC));
          go.style.visibility = 'visible';
        },
      }, c.e, h('span', {}, c.name)));
      const sw = COLORS.map(c => h('button', {
        class: 'swatch' + (c.c === selCol ? ' sel' : ''), style: `background:${c.c}`, 'aria-label': c.n,
        onclick: () => {
          selCol = c.c; sfx.tap(); say(c.n + '!'); applyTheme(c.c);
          sw.forEach((b, i) => b.classList.toggle('sel', COLORS[i].c === selCol));
        },
      }));
      const go = h('button', {
        class: 'big-btn go', style: selC ? '' : 'visibility:hidden',
        onclick: () => {
          state.char = selC; state.color = selCol; save();
          sfx.win(); say(`Evviva! Ciao ${char().name}!`);
          home();
        },
      }, 'Fatto! ✓');
      s.append(
        ...(first ? [] : [h('div', { class: 'topbar' }, h('button', { class: 'icon-btn', onclick: () => { applyTheme(state.color); home(); } }, '🏠'))]),
        h('h2', {}, 'Scegli il tuo amico!'),
        h('div', { class: 'char-grid' }, charBtns),
        h('h2', {}, 'Scegli il tuo colore!'),
        h('div', { class: 'palette' }, sw),
        go,
      );
      if (first) say(`Ciao ${NAME}! Scegli il tuo amico e il tuo colore preferito!`);
    });
  }

  function album(highlight) {
    show('album', 'album', s => {
      const done = state.stickers.length >= STICKERS.length;
      s.append(h('div', { class: 'topbar' },
        h('button', { class: 'icon-btn', onclick: home }, '🏠'),
        h('div', { class: 'title' }, `Album di ${NAME}`),
        h('div', { class: 'pill' }, `${state.stickers.length}/${STICKERS.length}`),
      ));
      s.append(h('div', { class: 'album-grid' }, STICKERS.map(st => h('button', {
        class: 'sticker' + (state.stickers.includes(st) ? '' : ' off') + (st === highlight ? ' new' : ''),
        onclick: ev => {
          if (state.stickers.includes(st)) { sfx.pop(); const r = ev.currentTarget.getBoundingClientRect(); floatAt(r.left + r.width / 2, r.top, st); }
          else say('Questo lo vinci giocando!');
        },
      }, st))));
      if (done) s.append(h('button', { class: 'big-btn', style: 'margin:8px auto 0', onclick: diploma }, '🏅 Diploma'));
      say(done ? 'Hai completato l\'album! Sei bravissima!' :
        `Hai ${state.stickers.length} sticker. Gioca per vincerne altri!`);
    });
  }

  /* premio: nuovo sticker (Promise risolta alla chiusura) */
  function reward() {
    const missing = STICKERS.filter(s => !state.stickers.includes(s));
    sfx.win(); confetti();
    if (!missing.length) { praise(); return wait(1200); }
    const st = pick(missing);
    state.stickers.push(st); save();
    return new Promise(res => {
      const close = modal([
        h('div', { class: 'big' }, st),
        h('h2', {}, 'Nuovo sticker!'),
        h('div', { class: 'row' }, h('button', {
          class: 'big-btn', onclick: () => {
            close(); sfx.pop();
            if (state.stickers.length >= STICKERS.length && !state.diploma) { state.diploma = true; save(); diploma().then(res); }
            else res();
          },
        }, 'Evviva!')),
      ]);
      say('Evviva! Un nuovo sticker per il tuo album!');
    });
  }

  function diploma() {
    confetti(120); sfx.win();
    const d = new Date();
    return new Promise(res => {
      const close = modal(h('div', { class: 'diploma' },
        h('div', { style: 'font-size:70px' }, '🏅' + char().e),
        h('h1', {}, 'Diploma di'),
        h('div', { class: 'name' }, `Super ${NAME}`),
        h('p', {}, 'ha completato l\'album di sticker!'),
        h('p', { style: 'font-size:15px;opacity:.7' }, d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })),
        h('button', { class: 'big-btn', onclick: () => { close(); res(); } }, 'Evviva!'),
      ));
      say(`Complimenti ${NAME}! Hai completato tutto l'album! Sei una Super ${NAME}!`);
    });
  }

  /* ---------- giochi ---------- */
  function registerGame(g) { games.push(g); }

  function startGame(g) {
    show('game', 'game ' + (g.cls || ''), s => {
      const stage = h('div', { class: 'stage' });
      let help = null;
      const hud = h('div', { class: 'hud' },
        h('button', { class: 'icon-btn', onclick: () => { stopVoice(); home(); } }, '🏠'),
        h('button', { class: 'icon-btn', 'aria-label': 'Aiuto', onclick: () => help && help() }, '❓'),
        h('div', { class: 'spacer' }));
      s.append(stage, hud);
      const addPill = txt => { const p = h('div', { class: 'pill' }, txt); hud.append(p); return p; };
      const setHelp = fn => { help = fn; };
      const stopGame = g.start({ stage, hud, screen: s, addPill, setHelp });
      return () => { stopVoice(); if (stopGame) stopGame(); };
    });
  }

  /* ---------- timer della nanna ---------- */
  function today() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
  function usage() {
    if (state.usage.day !== today()) state.usage = { day: today(), sec: 0, extra: 0, warned: false };
    return state.usage;
  }
  const limitSec = () => state.timerMin ? (state.timerMin + usage().extra) * 60 : Infinity;
  const isLocked = () => state.timerMin > 0 && usage().sec >= limitSec();

  function tick() {
    if (document.hidden || !started || !state.timerMin) return;
    if (['sleep', 'parent', 'splash'].includes(screenName)) return;
    const u = usage();
    u.sec++;
    if (u.sec % 5 === 0) save();
    const left = limitSec() - u.sec;
    if (left === 60 && !u.warned) {
      u.warned = true; save();
      say(`Ancora un minuto e poi ${char().the} va a nanna!`, { queue: true });
    }
    if (left <= 0) { save(); sleepScreen(); }
  }

  function sleepScreen() {
    show('sleep', 'sleep', s => {
      s.append(
        h('div', { class: 'moon' }, '🌙'),
        h('div', { class: 'sleeper' }, char().e, h('span', { class: 'z' }, '💤')),
        h('p', {}, `${char().the[0].toUpperCase() + char().the.slice(1)} è stanco e va a nanna. Ci vediamo domani, ${NAME}!`),
        h('button', { class: 'parent-link', onclick: parentGate }, '🔒 Genitore'),
      );
      if ((media.voices.nanna || []).length) playClip('nanna');
      else say(`${char().the} è stanco e va a nanna. Ci vediamo domani, ${NAME}! Buonanotte!`);
    });
  }

  /* ---------- compleanno ---------- */
  function isBirthdayToday() { const d = new Date(); return d.getMonth() === BIRTH.m && d.getDate() === BIRTH.d; }
  function ageAtBirthday() {
    const d = new Date();
    let y = d.getFullYear();
    if (d > new Date(y, BIRTH.m, BIRTH.d, 23, 59)) y++;
    return y - BIRTH.y;
  }

  function birthday(preview) {
    if (!preview) { state.bdayShown = new Date().getFullYear(); save(); }
    const age = ageAtBirthday();
    const words = ['zero', 'una', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci'];
    show('bday', 'bday', s => {
      let blown = 0;
      const candles = h('div', { class: 'candles' });
      for (let i = 0; i < age; i++) {
        const c = h('button', {
          class: 'candle', 'aria-label': 'candelina',
          onclick: async () => {
            if (c.classList.contains('out')) return;
            c.classList.add('out'); blown++; sfx.puff();
            say(blown === 1 ? 'una!' : words[blown] + '!');
            if (blown === age) {
              await wait(900);
              const dur = birthdaySong();
              confetti(150);
              say(`Tanti auguri ${NAME}! Oggi hai ${age} anni!`, { rate: .9 });
              setTimeout(() => confetti(120), 2500);
              setTimeout(() => {
                s.append(h('button', {
                  class: 'big-btn', onclick: async () => {
                    await reward();
                    if (!state.char) setup(true); else home();
                  },
                }, 'Un regalo! 🎁'));
              }, Math.min(dur * 1000, 6000));
            }
          },
        }, h('span', { class: 'flame' }));
        candles.append(c);
      }
      s.append(
        h('h1', {}, `Buon compleanno ${NAME}! 🎉`),
        h('p', {}, 'Tocca le candeline per soffiarle!'),
        h('div', { class: 'cake' }, h('div', { class: 'plate' }), h('div', { class: 'layer l1' }), h('div', { class: 'layer l2' }), candles),
      );
      confetti(80);
      say(`Buon compleanno ${NAME}! Oggi compi ${age} anni! Contiamo le candeline e soffiamole tutte!`);
    });
  }

  /* ---------- area genitori ---------- */
  function pinPad(title, onDone, extra) {
    let code = '';
    const dots = h('div', { class: 'pin-dots' }, [0, 1, 2, 3].map(() => h('i')));
    const box = h('div', {}, h('h2', { style: 'font-size:22px' }, title), dots);
    const upd = () => [...dots.children].forEach((d, i) => d.classList.toggle('on', i < code.length));
    const pad = h('div', { class: 'pin-pad' });
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '✕', '0', '⌫'];
    let close;
    keys.forEach(k => pad.append(h('button', {
      onclick: () => {
        if (k === '✕') return close();
        if (k === '⌫') code = code.slice(0, -1);
        else if (code.length < 4) code += k;
        upd();
        if (code.length === 4) setTimeout(() => {
          const ok = onDone(code);
          if (ok === false) { box.classList.add('shake'); setTimeout(() => box.classList.remove('shake'), 500); code = ''; upd(); }
          else close();
        }, 150);
      },
    }, k)));
    box.append(pad);
    if (extra) box.append(extra);
    close = modal(box);
    return () => close();
  }

  function parentGate() {
    stopVoice();
    if (!state.pin) {
      pinPad('Crea un PIN genitore (4 cifre)', code => {
        setTimeout(() => pinPad('Ripeti il PIN', c2 => {
          if (c2 !== code) return false;
          state.pin = code; save();
          setTimeout(parentArea, 50);
        }), 50);
      });
      return;
    }
    const a = rint(6, 9), b = rint(6, 9);
    let closePad;
    const forgot = h('button', {
      class: 'soft-btn', style: 'margin-top:14px;font-size:15px',
      onclick: () => {
        const v = prompt(`PIN dimenticato? Quanto fa ${a} × ${b}?`);
        if (v && parseInt(v, 10) === a * b) { state.pin = null; save(); closePad(); parentGate(); }
      },
    }, 'PIN dimenticato?');
    closePad = pinPad('PIN genitore', code => {
      if (code !== state.pin) return false;
      setTimeout(parentArea, 50);
    }, forgot);
  }

  function parentArea() {
    show('parent', 'parent', s => {
      let rec = null;
      const scroll = h('div', { class: 'scroll' });
      s.append(h('div', { class: 'topbar' },
        h('button', { class: 'icon-btn', onclick: () => (isLocked() ? sleepScreen() : home()) }, '🏠'),
        h('div', { class: 'title' }, 'Area genitori')), scroll,
        h('div', { class: 'ver', style: 'position:static;text-align:center' }, `versione ${VERSION}`));

      const section = (title, hint, ...body) => h('section', {}, h('h3', {}, title), hint ? h('p', { class: 'hint' }, hint) : null, ...body);
      const opts = (list, cur, onPick) => {
        const wrap = h('div', { class: 'opts' });
        const draw = sel => { wrap.innerHTML = ''; list.forEach(([v, l]) => wrap.append(h('button', { class: 'opt' + (v === sel ? ' sel' : ''), onclick: () => { onPick(v); draw(v); } }, l))); };
        draw(cur);
        return wrap;
      };

      function render() {
        scroll.innerHTML = '';
        const u = usage();
        const usedMin = Math.floor(u.sec / 60);
        scroll.append(section('⏰ Timer della nanna',
          `Oggi ha giocato ${usedMin} min` + (state.timerMin ? ` su ${state.timerMin + u.extra}.` : '.') + ' Allo scadere l\'app si blocca fino a domani.',
          opts([[0, 'Spento'], [10, '10 min'], [15, '15'], [20, '20'], [30, '30'], [45, '45'], [60, '60']], state.timerMin, v => { state.timerMin = v; save(); }),
          h('div', { class: 'opts', style: 'margin-top:10px' },
            h('button', { class: 'act', onclick: () => { u.extra += 10; save(); render(); } }, '+10 min oggi'),
            h('button', { class: 'act ghost', onclick: () => { u.sec = 0; u.extra = 0; u.warned = false; save(); render(); } }, 'Azzera oggi')),
        ));

        const voices = section('🎙️ Le vostre voci',
          'Registrate frasi per Lena: le sentirà al posto della voce del telefono. Restano solo su questo telefono.',
          VOICE_SLOTS.map(sl => {
            const list = media.voices[sl.id] || [];
            const recBtn = h('button', { class: 'act' }, '● Registra');
            recBtn.onclick = () => toggleRec(sl.id, recBtn);
            return h('div', { class: 'slot' },
              h('b', {}, `${sl.label}`), h('p', { class: 'hint', style: 'margin:0 0 6px' }, sl.hint),
              list.length < sl.max ? recBtn : h('p', { class: 'hint' }, `Massimo ${sl.max} registrazioni.`),
              h('div', { class: 'list' }, list.map((m, i) => h('div', { class: 'item' },
                h('span', {}, `Voce ${i + 1}` + (m.secs ? ` · ${m.secs}s` : '')),
                h('button', { class: 'act ghost', onclick: () => new Audio(m.url).play() }, '▶'),
                h('button', { class: 'act ghost', onclick: async () => { await DB.del(m.id); await reloadMedia(); render(); } }, '🗑'),
              ))));
          }));
        scroll.append(voices);

        const nameIn = h('input', { type: 'text', placeholder: 'Nome (es. Papà, Mahault, Nonna)', maxlength: '14' });
        const fileIn = h('input', { type: 'file', accept: 'image/*', style: 'display:none' });
        fileIn.onchange = async () => {
          const f = fileIn.files[0];
          if (!f) return;
          const blob = await resizePhoto(f);
          await DB.put({ id: 'p' + Date.now(), kind: 'photo', name: nameIn.value.trim(), blob, created: Date.now() });
          await reloadMedia(); render();
        };
        scroll.append(section('📷 Foto di famiglia',
          'Finiscono nel Memory di famiglia (servono almeno 2 foto) e i nomi in Pesca le Lettere.',
          nameIn,
          h('div', { class: 'opts', style: 'margin-top:10px' }, h('button', {
            class: 'act', onclick: () => {
              if (!nameIn.value.trim()) { nameIn.focus(); nameIn.style.borderColor = '#e33'; return; }
              fileIn.click();
            },
          }, '📷 Aggiungi foto'), fileIn),
          h('div', { class: 'list' }, media.photos.map(p => h('div', { class: 'item' },
            h('img', { src: p.url, alt: '' }), h('span', {}, p.name || '—'),
            h('button', { class: 'act ghost', onclick: async () => { await DB.del(p.id); await reloadMedia(); render(); } }, '🗑'),
          ))),
        ));

        scroll.append(section('🖼️ Disegni di Lena', media.drawings.length ? 'Tocca ⬇️ per salvarli tra le foto o condividerli.' : 'Qui compaiono i disegni finiti in «Colora con Lena».',
          h('div', { class: 'list' }, media.drawings.slice().reverse().map(dw => h('div', { class: 'item' },
            h('img', { src: dw.url, alt: '' }), h('span', {}, dw.name || 'Disegno'),
            h('button', { class: 'act ghost', onclick: () => exportDrawing(dw) }, '⬇️'),
            h('button', { class: 'act ghost', onclick: async () => { if (!confirm('Eliminare questo disegno?')) return; await DB.del(dw.id); await reloadMedia(); render(); } }, '🗑'),
          )))));

        scroll.append(section('🎨 Personaggio e colore', null,
          h('button', { class: 'act', onclick: () => setup(false) }, `Cambia (ora: ${char().e} ${char().name})`)));

        scroll.append(section('🎂 Compleanno', `Il 27 gennaio l'app si apre con la festa (${ageAtBirthday()} candeline).`,
          h('button', { class: 'act', onclick: () => birthday(true) }, 'Prova la festa')));

        scroll.append(section('📒 Progressi', `Sticker: ${state.stickers.length}/${STICKERS.length}. Livelli: ` +
          games.map(g => `${g.short || g.title} ${level(g.id)}`).join(', ') + `. Record Salta: ${state.hopBest}.`,
          h('div', { class: 'opts' },
            h('button', {
              class: 'act ghost', onclick: () => {
                if (!confirm('Azzerare sticker, livelli e record?')) return;
                state.stickers = []; state.levels = {}; state.hopBest = 0; state.diploma = false; save(); render();
              },
            }, 'Azzera progressi'),
            h('button', { class: 'act ghost', onclick: () => { state.pin = null; save(); parentGate(); } }, 'Cambia PIN'))));
      }

      async function toggleRec(slot, btn) {
        if (rec) { rec.stop(); return; }
        if (!navigator.mediaDevices || !window.MediaRecorder) { alert('Registrazione non supportata su questo browser.'); return; }
        let stream;
        try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
        catch (e) { alert('Serve il permesso per il microfono.'); return; }
        const chunks = [];
        const r = new MediaRecorder(stream);
        const t0 = Date.now();
        rec = r;
        r.ondataavailable = e => e.data.size && chunks.push(e.data);
        r.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          clearInterval(iv); clearTimeout(auto);
          rec = null;
          const secs = Math.max(1, Math.round((Date.now() - t0) / 1000));
          const blob = new Blob(chunks, { type: r.mimeType || 'audio/webm' });
          await DB.put({ id: 'v' + Date.now(), kind: 'voice', slot, blob, secs, created: Date.now() });
          await reloadMedia(); render();
        };
        r.start();
        btn.classList.add('rec');
        const iv = setInterval(() => { btn.textContent = `■ Stop (${Math.round((Date.now() - t0) / 1000)}s)`; }, 250);
        const auto = setTimeout(() => r.state === 'recording' && r.stop(), 8000);
      }

      render();
      return () => { if (rec && rec.state === 'recording') rec.stop(); };
    });
  }

  async function saveDrawing(blob, name) {
    await DB.put({ id: 'd' + Date.now(), kind: 'drawing', name, blob, created: Date.now() });
    await reloadMedia();
  }
  async function exportDrawing(dw) {
    const blob = await (await fetch(dw.url)).blob();
    const file = new File([blob], `disegno-lena-${dw.id}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Disegno di Lena' }); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    const a = h('a', { href: dw.url, download: file.name });
    document.body.append(a); a.click(); a.remove();
  }

  function resizePhoto(file) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => {
        const S = 360, m = Math.min(img.width, img.height);
        const c = document.createElement('canvas');
        c.width = c.height = S;
        c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        URL.revokeObjectURL(img.src);
        c.toBlob(b => res(b), 'image/jpeg', .85);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /* ---------- tutorial con la manina ----------
     steps: [{ text, icon, action: 'tap'|'swipe'|'drag', at, to, cap: 'top' }]
     at/to: elemento, {x,y} o funzione che li restituisce (valutata al momento). */
  function tutorial(steps) {
    stopVoice();
    document.querySelectorAll('.tut').forEach(t => t.remove());
    const ov = h('div', { class: 'tut' });
    const hand = h('div', { class: 'tut-hand' }, '👆');
    const cap = h('div', { class: 'tut-cap' });
    ov.append(cap, hand);
    document.body.append(ov);
    const pt = t => {
      const v = typeof t === 'function' ? t() : t;
      if (v && v.getBoundingClientRect) {
        const r = v.getBoundingClientRect();
        if (r.width) return { x: r.left + r.width / 2, y: r.top + r.height / 2, el: v };
      } else if (v && 'x' in v) return v;
      return { x: innerWidth / 2, y: innerHeight / 2 };
    };
    const T = (p, s = 1) => `translate(${p.x - 30}px, ${p.y - 8}px) scale(${s})`;
    const ripple = p => {
      const r = h('div', { class: 'tut-ripple', style: `left:${p.x}px;top:${p.y}px` });
      ov.append(r);
      setTimeout(() => r.remove(), 700);
    };
    async function act(s) {
      const a = pt(s.at);
      if (s.action === 'swipe' || s.action === 'drag') {
        const b = pt(s.to);
        let ghost = null;
        if (s.action === 'drag' && a.el) {
          const r = a.el.getBoundingClientRect();
          ghost = a.el.cloneNode(true);
          ghost.classList.add('tut-ghost');
          ghost.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;margin:0`;
          ov.insertBefore(ghost, hand);
        }
        const dx = b.x - a.x, dy = b.y - a.y;
        const opts = { duration: 1400, easing: 'ease-in-out' };
        const an = hand.animate([{ transform: T(a, .9), opacity: 0 }, { transform: T(a, .9), opacity: 1, offset: .15 },
          { transform: T(b, .9), opacity: 1, offset: .8 }, { transform: T(b, .9), opacity: 0 }], opts);
        if (ghost) ghost.animate([{ transform: 'none' }, { transform: 'none', offset: .15 },
          { transform: `translate(${dx}px, ${dy}px)`, offset: .8 }, { transform: `translate(${dx}px, ${dy}px)` }], opts);
        await an.finished.catch(() => {});
        if (ghost) ghost.remove();
      } else {
        hand.style.transform = T(a);
        const an = hand.animate([{ transform: T(a, 1) }, { transform: T(a, .8), offset: .4 }, { transform: T(a, 1) }], { duration: 600 });
        setTimeout(() => ripple(a), 240);
        await an.finished.catch(() => {});
        await wait(250);
      }
    }
    return new Promise(async resolve => {
      for (const s of steps) {
        if (!ov.isConnected) return resolve();
        if (s.before) s.before();
        cap.innerHTML = '';
        cap.append(h('span', { class: 'ico' }, s.icon || '👆'), h('span', {}, s.text));
        cap.classList.toggle('top', s.cap === 'top');
        const v = say(s.text);
        for (let i = 0; i < (s.reps || 2) && ov.isConnected; i++) await act(s);
        await v;
        await wait(250);
      }
      if (!ov.isConnected) return resolve();
      hand.style.display = 'none';
      cap.innerHTML = '';
      cap.classList.remove('top');
      cap.append(h('span', { class: 'ico' }, '⭐'), h('span', {}, 'Adesso prova tu!'));
      say('Adesso prova tu!');
      ov.append(h('button', { class: 'big-btn tut-go', onclick: () => { sfx.pop(); ov.remove(); resolve(); } }, 'Ho capito! 👍'));
    });
  }
  /* tutorial solo la prima volta; risolve subito se già visto */
  async function intro(id, steps) {
    if (state.tut[id]) return false;
    await tutorial(steps);
    state.tut[id] = true;
    save();
    return true;
  }

  /* ---------- catalogo frasi (per generare i file audio, vedi tools/) ---------- */
  function phrases() {
    const out = [...PRAISE, ...RETRY, `Ciao ${NAME}! Giochiamo?`, `Ciao ${NAME}! Scegli il tuo amico e il tuo colore preferito!`,
      'Questo è per papà!', 'Questo lo vinci giocando!', 'Hai completato l\'album! Sei bravissima!',
      'Evviva! Un nuovo sticker per il tuo album!', `Complimenti ${NAME}! Hai completato tutto l'album! Sei una Super ${NAME}!`,
      'Adesso prova tu!', 'Tocca un gioco per iniziare!', 'Qui trovi gli sticker che vinci giocando!'];
    CHARS.forEach(c => out.push(`${c.name}!`, `Evviva! Ciao ${c.name}!`, `Ancora un minuto e poi ${c.the} va a nanna!`,
      `${c.the} è stanco e va a nanna. Ci vediamo domani, ${NAME}! Buonanotte!`));
    COLORS.forEach(c => out.push(`${c.n}!`));
    for (let n = 0; n < STICKERS.length; n++) out.push(`Hai ${n} sticker. Gioca per vincerne altri!`);
    ['una', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci'].forEach(w => out.push(w));
    for (let a = 1; a <= 10; a++) {
      out.push(`Tanti auguri ${NAME}! Oggi hai ${a} anni!`,
        `Buon compleanno ${NAME}! Oggi compi ${a} anni! Contiamo le candeline e soffiamole tutte!`);
    }
    games.forEach(g => { out.push(g.title); if (g.phrases) out.push(...g.phrases()); });
    return out;
  }

  /* ---------- avvio ---------- */
  async function boot() {
    load();
    applyTheme(state.color);
    if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      /* aggiornamenti: controlla a ogni riapertura; quando arriva la nuova versione ricarica (solo fuori dai giochi) */
      navigator.serviceWorker.register('sw.js').then(reg => {
        document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
      }).catch(() => {});
      let hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController) { hadController = true; return; }
        if (['splash', 'home', 'sleep'].includes(screenName)) location.reload();
        else pendingReload = true;
      });
    }
    document.addEventListener('pointerdown', e => { if (e.isPrimary !== false) glitter(e.clientX, e.clientY); }, { passive: true });
    await Promise.all([DB.open().then(reloadMedia), loadVoiceIndex()]);
    setInterval(tick, 1000);
    document.addEventListener('visibilitychange', () => { if (document.hidden) { stopVoice(); save(); } });
    document.addEventListener('gesturestart', e => e.preventDefault());
    splash();
  }

  return {
    NAME, CHARS, boot, h, say, stopVoice, sfx, praise, retry, reward, confetti, floatAt,
    rint, pick, shuffle, wait, level, setLevel, char, registerGame, home, media,
    tutorial, intro, phrases, vhash, modal, saveDrawing, glitter,
    get state() { return state; }, save,
  };
})();
