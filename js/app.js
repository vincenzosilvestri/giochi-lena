/* Giochi di Lena — nucleo dell'app: stato, lingue FR/IT, voce, suoni, schermate, premi, armadio,
   timer con storia della buonanotte, pagella e area genitori (in italiano). */
const App = (() => {
  const NAME = 'Lena';
  const BIRTH = { y: 2022, m: 0, d: 18 }; // 18 gennaio 2022
  const KEY = 'lena_v1';
  const VERSION = '11 · 25/09/2026'; // aggiornare insieme a VERSION in sw.js
  const LANGS = ['fr', 'it'];
  const FLAG = { fr: '🇫🇷', it: '🇮🇹' };

  const CHARS = [
    { id: 'coniglio', e: '🐰', name: { it: 'Coniglietto', fr: 'Petit lapin' }, the: { it: 'il coniglietto', fr: 'le petit lapin' }, fem: { it: 0, fr: 0 } },
    { id: 'gatto', e: '🐱', name: { it: 'Gattino', fr: 'Petit chat' }, the: { it: 'il gattino', fr: 'le petit chat' }, fem: { it: 0, fr: 0 } },
    { id: 'unicorno', e: '🦄', name: { it: 'Unicorno', fr: 'Licorne' }, the: { it: "l'unicorno", fr: 'la licorne' }, fem: { it: 0, fr: 1 } },
    { id: 'cane', e: '🐶', name: { it: 'Cagnolino', fr: 'Petit chien' }, the: { it: 'il cagnolino', fr: 'le petit chien' }, fem: { it: 0, fr: 0 } },
  ];
  const COLORS = [
    { c: '#ff6fa8', n: { it: 'Rosa', fr: 'Rose' } }, { c: '#ff5a5a', n: { it: 'Rosso', fr: 'Rouge' } },
    { c: '#ff9f40', n: { it: 'Arancione', fr: 'Orange' } }, { c: '#f5c400', n: { it: 'Giallo', fr: 'Jaune' } },
    { c: '#3cc45c', n: { it: 'Verde', fr: 'Vert' } }, { c: '#2ed3c6', n: { it: 'Turchese', fr: 'Turquoise' } },
    { c: '#3fb0ff', n: { it: 'Azzurro', fr: 'Bleu clair' } }, { c: '#4a6cff', n: { it: 'Blu', fr: 'Bleu' } },
    { c: '#9b5cff', n: { it: 'Viola', fr: 'Violet' } }, { c: '#d17de8', n: { it: 'Lilla', fr: 'Lilas' } },
  ];
  const STICKERS = ['🦄', '🌈', '🍦', '🎈', '🦋', '🌸', '⭐', '🐞', '🍓', '🐬', '🦊', '🐼',
    '🧁', '🎀', '🐙', '🌻', '🍭', '🐢', '🦜', '🏰', '👑', '🚀', '🐳', '🍉'];
  /* armadio: accessori comprati con le stelle, uno per zona */
  const ITEMS = [
    { id: 'fiore', e: '🌸', slot: 'head', price: 5, n: { fr: 'La fleur', it: 'Il fiore' } },
    { id: 'fiocco', e: '🎀', slot: 'head', price: 8, n: { fr: 'Le nœud', it: 'Il fiocco' } },
    { id: 'paglia', e: '👒', slot: 'head', price: 10, n: { fr: 'Le chapeau de paille', it: 'Il cappello di paglia' } },
    { id: 'cilindro', e: '🎩', slot: 'head', price: 12, n: { fr: 'Le chapeau magique', it: 'Il cappello magico' } },
    { id: 'corona', e: '👑', slot: 'head', price: 15, n: { fr: 'La couronne', it: 'La corona' } },
    { id: 'occhiali', e: '👓', slot: 'eyes', price: 6, n: { fr: 'Les lunettes', it: 'Gli occhiali' } },
    { id: 'sole', e: '🕶️', slot: 'eyes', price: 10, n: { fr: 'Les lunettes de soleil', it: 'Gli occhiali da sole' } },
    { id: 'lecca', e: '🍭', slot: 'hand', price: 5, n: { fr: 'La sucette', it: 'Il lecca-lecca' } },
    { id: 'palloncino', e: '🎈', slot: 'hand', price: 6, n: { fr: 'Le ballon', it: 'Il palloncino' } },
    { id: 'bacchetta', e: '🪄', slot: 'hand', price: 20, n: { fr: 'La baguette magique', it: 'La bacchetta magica' } },
    { id: 'cuori', e: '💖', slot: 'aura', price: 12, n: { fr: 'Les cœurs', it: 'I cuori' } },
    { id: 'farfalle', e: '🦋', slot: 'aura', price: 18, n: { fr: 'Les papillons', it: 'Le farfalle' } },
    { id: 'brillantini', e: '✨', slot: 'aura', price: 25, n: { fr: 'Les paillettes', it: 'I brillantini' } },
    { id: 'arcobaleno', e: '🌈', slot: 'aura', price: 30, n: { fr: "L'arc-en-ciel", it: "L'arcobaleno" } },
  ];
  const VOICE_SLOTS = [
    { id: 'ciao', label: 'Saluto all\'apertura', hint: 'es. «Ciao amore, giochiamo?» / «Coucou ma chérie !»', max: 3 },
    { id: 'bravo', label: 'Complimenti', hint: 'es. «Bravissima Lena!», «Bravo ma puce !»', max: 6 },
    { id: 'nanna', label: 'Buonanotte (fine tempo)', hint: 'es. «Ora basta giocare, vieni ad abbracciarmi!»', max: 3 },
  ];
  const NUM = {
    it: ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci'],
    fr: ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'],
  };
  const numWord = (n, fem, l = lang) => (n === 1 ? (l === 'fr' ? (fem ? 'une' : 'un') : (fem ? 'una' : 'uno')) : NUM[l][n]);

  /* testi dell'app (fr/it); le funzioni ricevono parametri */
  const T = {
    hello: { fr: `Coucou ${NAME} !`, it: `Ciao ${NAME}!` },
    playBtn: { fr: 'On joue ! ▶', it: 'Giochiamo! ▶' },
    greet: { fr: `Coucou ${NAME} ! On joue ?`, it: `Ciao ${NAME}! Giochiamo?` },
    forDad: { fr: "Ça, c'est pour papa !", it: 'Questo è per papà!' },
    chooseFriend: { fr: 'Choisis ton ami !', it: 'Scegli il tuo amico!' },
    chooseColor: { fr: 'Choisis ta couleur !', it: 'Scegli il tuo colore!' },
    done: { fr: "C'est fait ! ✓", it: 'Fatto! ✓' },
    setupSay: { fr: `Coucou ${NAME} ! Choisis ton ami et ta couleur préférée !`, it: `Ciao ${NAME}! Scegli il tuo amico e il tuo colore preferito!` },
    hiChar: { fr: n => `Youpi ! Coucou ${n} !`, it: n => `Evviva! Ciao ${n}!` },
    album: { fr: `L'album de ${NAME}`, it: `Album di ${NAME}` },
    albumDone: { fr: "Tu as complété l'album ! Tu es super forte !", it: "Hai completato l'album! Sei bravissima!" },
    albumCount: { fr: n => (n <= 1 ? `Tu as ${n} autocollant. Joue pour en gagner d'autres !` : `Tu as ${n} autocollants. Joue pour en gagner d'autres !`), it: n => `Hai ${n} sticker. Gioca per vincerne altri!` },
    albumLocked: { fr: 'Celui-là, tu le gagnes en jouant !', it: 'Questo lo vinci giocando!' },
    newSticker: { fr: 'Nouvel autocollant !', it: 'Nuovo sticker!' },
    newStickerSay: { fr: 'Youpi ! Un nouvel autocollant pour ton album !', it: 'Evviva! Un nuovo sticker per il tuo album!' },
    yay: { fr: 'Youpi !', it: 'Evviva!' },
    diplomaOf: { fr: 'Diplôme de', it: 'Diploma di' },
    diplomaTxt: { fr: "a complété l'album d'autocollants !", it: "ha completato l'album di sticker!" },
    diplomaSay: { fr: `Bravo ${NAME} ! Tu as complété tout l'album ! Tu es une Super ${NAME} !`, it: `Complimenti ${NAME}! Hai completato tutto l'album! Sei una Super ${NAME}!` },
    yourTurn: { fr: 'À toi de jouer !', it: 'Adesso prova tu!' },
    gotIt: { fr: "J'ai compris ! 👍", it: 'Ho capito! 👍' },
    tutGame: { fr: 'Touche un jeu pour commencer !', it: 'Tocca un gioco per iniziare!' },
    tutAlbum: { fr: 'Ici, tu trouves les autocollants que tu gagnes !', it: 'Qui trovi gli sticker che vinci giocando!' },
    tutWardrobe: { fr: 'Ici, tu dépenses tes étoiles pour habiller ton ami !', it: 'Qui spendi le stelle per vestire il tuo amico!' },
    minute: { fr: c => `Encore une minute et ${c} va faire dodo !`, it: c => `Ancora un minuto e poi ${c} va a nanna!` },
    sleepTxt: { fr: (c, f) => `${cap(c)} est fatigué${f ? 'e' : ''} et va faire dodo. À demain, ${NAME} !`, it: c => `${cap(c)} è stanco e va a nanna. Ci vediamo domani, ${NAME}!` },
    sleepSay: { fr: (c, f) => `${cap(c)} est fatigué${f ? 'e' : ''} et va faire dodo. À demain, ${NAME} ! Bonne nuit !`, it: c => `${cap(c)} è stanco e va a nanna. Ci vediamo domani, ${NAME}! Buonanotte!` },
    bdayTitle: { fr: `Joyeux anniversaire ${NAME} ! 🎉`, it: `Buon compleanno ${NAME}! 🎉` },
    bdayHint: { fr: 'Touche les bougies pour les souffler !', it: 'Tocca le candeline per soffiarle!' },
    bdaySay: { fr: a => `Joyeux anniversaire ${NAME} ! Aujourd'hui tu as ${a} ans ! Comptons les bougies et soufflons-les toutes !`, it: a => `Buon compleanno ${NAME}! Oggi compi ${a} anni! Contiamo le candeline e soffiamole tutte!` },
    bdayWish: { fr: a => `Joyeux anniversaire ${NAME} ! Tu as ${a} ans !`, it: a => `Tanti auguri ${NAME}! Oggi hai ${a} anni!` },
    gift: { fr: 'Un cadeau ! 🎁', it: 'Un regalo! 🎁' },
    wardrobe: { fr: `L'armoire de ${NAME}`, it: `L'armadio di ${NAME}` },
    wardrobeTile: { fr: 'Armoire', it: 'Armadio' },
    wardrobeSay: { fr: 'Choisis des habits pour ton ami !', it: 'Scegli i vestiti per il tuo amico!' },
    buyQ: { fr: "Tu veux l'acheter ?", it: 'Lo vuoi comprare?' },
    bought: { fr: "Youpi ! C'est à toi !", it: 'Evviva! È tuo!' },
    missing: { fr: n => (n === 1 ? 'Il te manque une étoile ! Joue pour en gagner.' : `Il te manque ${n} étoiles ! Joue pour en gagner.`), it: n => (n === 1 ? 'Ti manca una stella! Gioca per vincerla.' : `Ti mancano ${n} stelle! Gioca per vincerle.`) },
    storyNext: { fr: 'Suite ▶', it: 'Avanti ▶' },
    newLevel: { fr: 'Bravo ! Nouveau niveau !', it: 'Brava! Nuovo livello!' },
  };
  const PRAISE = {
    fr: ['Bravo !', `Bravo ${NAME} !`, 'Youpi !', 'Super !', 'Génial !', 'Trop bien !', 'Parfait !', 'Bien joué !'],
    it: ['Bravissima!', `Brava ${NAME}!`, 'Evviva!', 'Super!', 'Fantastico!', 'Che brava!', `Grande ${NAME}!`, 'Perfetto!'],
  };
  const RETRY = { fr: ['Essaie encore !', 'Presque ! Réessaie.', 'Encore une fois !'], it: ['Riprova!', 'Quasi! Riprova.', 'Prova ancora!'] };

  /* storie della buonanotte: {c} = personaggio di Lena nella scena */
  const STORIES = [
    [
      { s: '🌙 🏡 {c}', fr: `Il était une fois, un soir, ${NAME} et son ami qui regardaient le ciel.`, it: `C'era una volta, una sera, ${NAME} e il suo amico che guardavano il cielo.` },
      { s: '✨ ⭐ 🌷', fr: 'Tout à coup, une petite étoile est tombée dans le jardin !', it: 'A un tratto, una piccola stella è caduta in giardino!' },
      { s: '⭐ 💧', fr: "L'étoile était triste : elle voulait rentrer chez elle, dans le ciel.", it: 'La stella era triste: voleva tornare a casa, nel cielo.' },
      { s: '{c} 🎈 ⭐', fr: `${NAME} a eu une idée : un ballon ! L'étoile s'est envolée tout doucement.`, it: `${NAME} ha avuto un'idea: un palloncino! La stella è volata su, piano piano.` },
      { s: '🌌 ⭐ 💖', fr: `Maintenant, chaque nuit, l'étoile brille rien que pour ${NAME}. Bonne nuit !`, it: `Adesso, ogni notte, la stella brilla solo per ${NAME}. Buonanotte!` },
    ],
    [
      { s: '🌊 🐟', fr: 'Au fond de la mer vivait un petit poisson qui avait peur du noir.', it: 'In fondo al mare viveva un pesciolino che aveva paura del buio.' },
      { s: '🐟 🌑', fr: 'Chaque soir, il se cachait derrière un gros rocher.', it: 'Ogni sera si nascondeva dietro a un grande scoglio.' },
      { s: '🐙 💡', fr: 'Un soir, une gentille pieuvre est arrivée avec une lanterne.', it: 'Una sera è arrivata una polpessa gentile con una lanterna.' },
      { s: '🐟 🐙 🐚', fr: 'Ensemble, ils ont découvert les coquillages qui brillent dans la nuit.', it: 'Insieme hanno scoperto le conchiglie che brillano nella notte.' },
      { s: '🐟 😴 💤', fr: "Le petit poisson n'avait plus peur. Il s'est endormi en souriant. Bonne nuit !", it: 'Il pesciolino non aveva più paura. Si è addormentato sorridendo. Buonanotte!' },
    ],
    [
      { s: '☁️ 🌤️', fr: 'Il était une fois un petit nuage qui voulait dormir.', it: 'C\'era una volta una nuvoletta che voleva dormire.' },
      { s: '☁️ 🌬️', fr: 'Mais le vent le faisait voler partout : ici, là-bas, et encore plus loin !', it: 'Ma il vento la faceva volare dappertutto: di qua, di là, e ancora più lontano!' },
      { s: '☁️ 🌙', fr: 'Alors la lune lui a dit : viens, je te garde une place près de moi.', it: 'Allora la luna le ha detto: vieni, ti tengo un posto vicino a me.' },
      { s: '{c} ☁️ ⭐', fr: `${NAME} et son ami ont fait un bisou au petit nuage.`, it: `${NAME} e il suo amico hanno dato un bacino alla nuvoletta.` },
      { s: '🌙 ☁️ 💤', fr: 'Et le petit nuage a fait de beaux rêves tout doux. Bonne nuit !', it: 'E la nuvoletta ha fatto sogni belli e morbidi. Buonanotte!' },
    ],
  ];

  /* abilità seguite nella pagella: livello dal gioco collegato + storico giornaliero delle risposte */
  const SKILLS = [
    { id: 'numeri', name: 'Numeri', icon: '🔢', game: 'conta', max: 4 },
    { id: 'lettere', name: 'Lettere', icon: '🔤', game: 'lettere', max: 3 },
    { id: 'memoria', name: 'Memoria', icon: '🃏', game: 'memory', max: 4 },
    { id: 'logica', name: 'Forme e logica', icon: '🔷', game: 'forme', max: 4 },
    { id: 'lingue', name: 'Due lingue', icon: '🌍', game: 'lingue', max: 3 },
    { id: 'colori', name: 'Colori', icon: '🖍️', game: 'colora', max: 0 },
    { id: 'strada', name: 'Educazione stradale', icon: '🚦', game: 'salta', max: 4 },
  ];
  const DETAIL = { numeri: 'numbers', lettere: 'letters' };

  const games = [];
  let state;
  let cleanup = null;
  let screenName = '';
  let started = false;
  let lang = 'fr';

  /* ---------- utilità ---------- */
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const cap = s => s[0].toUpperCase() + s.slice(1);

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

  /* ---------- lingue ---------- */
  /* tr({fr, it}) → testo nella lingua corrente; t('chiave', ...args) → testo dell'app */
  const tr = o => (o == null ? '' : typeof o === 'string' ? o : (o[lang] ?? o.it));
  function t(key, ...args) { const v = tr(T[key]); return typeof v === 'function' ? v(...args) : v; }
  const langMode = () => state.langMode || 'alt';
  /* nuovo turno: in alternanza cambia lingua */
  function nextLang() {
    const m = langMode();
    lang = m === 'alt' ? (lang === 'fr' ? 'it' : 'fr') : m;
    document.querySelectorAll('.flag-pill').forEach(p => {
      p.textContent = FLAG[lang];
      p.classList.remove('flip'); void p.offsetWidth; p.classList.add('flip');
    });
    return lang;
  }

  /* ---------- stato ---------- */
  const defaults = () => ({
    char: null, color: '#ff6fa8', stickers: [], levels: {}, timerMin: 20, pin: null,
    usage: { day: '', sec: 0, extra: 0, warned: false }, bdayShown: 0, hopBest: 0, diploma: false, tut: {},
    langMode: 'alt', stars: 0, owned: [], wear: {}, story: 0, hist: {}, levelLog: [],
    stats: { letters: {}, numbers: {}, langs: { fr: [0, 0], it: [0, 0] }, greens: 0, reds: 0, zebra: 0, days: {}, games: {} },
  });
  function load() {
    try { state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { state = defaults(); }
    state.stats = Object.assign(defaults().stats, state.stats);
    /* storico: si tengono gli ultimi 200 giorni */
    const old = Date.now() - 200 * 864e5;
    Object.keys(state.hist).forEach(k => { const [y, m, d] = k.split('-').map(Number); if (new Date(y, m - 1, d).getTime() < old) delete state.hist[k]; });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage pieno o bloccato */ } }
  const char = () => CHARS.find(c => c.id === state.char) || CHARS[0];
  const level = id => state.levels[id] || 1;
  function setLevel(id, n) { state.levels[id] = n; save(); }

  /* pagella: registra una risposta per abilità (dettaglio per lettere/numeri, lingua, storico del giorno) */
  function track(skill, key, ok) {
    const s = state.stats;
    const cat = DETAIL[skill];
    if (cat && key != null) {
      const e = s[cat][key] = s[cat][key] || [0, 0];
      e[ok ? 0 : 1]++;
    }
    if (skill !== 'strada') s.langs[lang][ok ? 0 : 1]++;
    const day = state.hist[today()] = state.hist[today()] || {};
    const h0 = day[skill] = day[skill] || [0, 0];
    h0[ok ? 0 : 1]++;
    save();
  }
  const hopLevel = () => (state.hopBest < 25 ? 1 : state.hopBest < 60 ? 2 : state.hopBest < 100 ? 3 : 4);
  const skillLevel = sk => (sk.id === 'strada' ? hopLevel() : sk.max ? level(sk.game) : 0);
  /* sale di livello: badge nel gioco, festa, voce e registro per papà */
  function levelUp(id, n) {
    if (n <= level(id)) return;
    state.levels[id] = n;
    state.levelLog.push({ d: today(), g: id, lv: n });
    if (state.levelLog.length > 60) state.levelLog.shift();
    save();
    document.querySelectorAll('.lvl-pill').forEach(p => { p.textContent = `🏅 ${n}`; p.classList.remove('flip'); void p.offsetWidth; p.classList.add('flip'); });
    const b = h('div', { class: 'lvl-up' }, h('span', {}, '🏅'), h('b', {}, n));
    document.body.append(b);
    setTimeout(() => b.remove(), 2200);
    confetti(50); sfx.win();
    say(t('newLevel'), { queue: true });
  }
  function count(key, n = 1) { state.stats[key] = (state.stats[key] || 0) + n; save(); }

  /* stelle: moneta per l'armadio */
  function addStars(n, x, y) {
    state.stars += n;
    save();
    if (x != null) floatAt(x, y, n > 1 ? `+${n}⭐` : '⭐');
    document.querySelectorAll('.stars-pill').forEach(p => { p.textContent = `⭐ ${state.stars}`; });
  }

  /* ---------- tema ---------- */
  function mix(hex, other, k) {
    const a = parseInt(hex.slice(1), 16), b = parseInt(other.slice(1), 16);
    const ch = s => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k);
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
    const t0 = ac.currentTime + when;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + .02);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(g).connect(ac.destination);
    o.start(t0); o.stop(t0 + dur + .05);
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
    bell: () => { tone(988, .18, 'square', .06); tone(988, .18, 'square', .06, .3); },
    train: () => { noise(1.4, .2); tone(440, .5, 'sawtooth', .06); tone(554, .5, 'sawtooth', .05, .05); },
  };
  function birthdaySong() {
    const N = { G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, F5: 698, G5: 784 };
    const song = [['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
      ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
      ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
      ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2]];
    const beat = .42;
    let t0 = 0;
    for (const [n, b] of song) { tone(N[n], b * beat * .95, 'triangle', .2, t0); t0 += b * beat; }
    return t0;
  }

  /* ---------- voce ----------
     Le frasi fisse sono file audio pre-generati (voice/<hash>.mp3, vedi tools/), per lingua.
     Quelle non in catalogo (es. nomi dalle foto) usano la sintesi vocale del telefono. */
  const voices = { it: null, fr: null };
  let clipAudio = null;
  let clipSrc = null;
  let gen = 0;
  let chain = Promise.resolve();
  const clips = { have: new Set(), buf: new Map() };
  const vkey = s => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
  /* l'italiano mantiene gli hash storici; il francese ha il prefisso "fr " */
  function vhash(text, l = 'it') {
    let x = 0x811c9dc5;
    for (const ch of (l === 'it' ? '' : l + ' ') + vkey(text)) { x ^= ch.codePointAt(0); x = Math.imul(x, 0x01000193) >>> 0; }
    return x.toString(16).padStart(8, '0');
  }
  async function loadVoiceIndex() {
    try { clips.have = new Set(await (await fetch('voice/index.json')).json()); } catch (e) { clips.have = new Set(); }
  }
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const all = speechSynthesis.getVoices();
    for (const l of LANGS) {
      const list = all.filter(v => v.lang.toLowerCase().startsWith(l));
      voices[l] = list.find(v => /premium|enhanced|google|alice|federica|amelie|audrey/i.test(v.name)) || list[0] || null;
    }
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
  function speakTTS(text, l, opts, my) {
    if (!('speechSynthesis' in window) || my !== gen) return Promise.resolve();
    return new Promise(res => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = l === 'fr' ? 'fr-FR' : 'it-IT';
      if (voices[l]) u.voice = voices[l];
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
    const l = opts.lang || lang;
    const run = async () => {
      if (my !== gen) return;
      const hsh = vhash(text, l);
      if (ac && clips.have.has(hsh)) {
        try { return await playFile(hsh, my); } catch (e) { /* file non disponibile: sintesi */ }
      } else if (clips.have.size) console.warn('voce mancante:', l, text);
      return speakTTS(text, l, opts, my);
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
    if ((media.voices.bravo || []).length && Math.random() < .5) return playClip('bravo');
    return say(pick(PRAISE[lang]));
  }
  const retry = () => say(pick(RETRY[lang]));

  /* ---------- foto, voci registrate e disegni (IndexedDB) ---------- */
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
  const GLITTER = ['#ffd700', '#fff4b0', '#ff9ad5', '#c9a7ff', '#9fe8ff', '#ffffff'];
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

  /* personaggio con gli accessori dell'armadio; size in px */
  function avatar(size, wear = state.wear) {
    const box = h('span', { class: 'av', style: `font-size:${size}px` });
    const it = slot => ITEMS.find(i => i.id === wear[slot]);
    const aura = it('aura');
    if (aura) box.append(h('span', { class: `acc aura aura-${aura.id}` }, aura.id === 'arcobaleno' ? aura.e : [1, 2, 3, 4].map(() => h('i', {}, aura.e))));
    box.append(h('span', { class: 'base' }, char().e));
    ['eyes', 'head', 'hand'].forEach(slot => { const i = it(slot); if (i) box.append(h('span', { class: `acc ${slot} acc-${i.id}` }, i.e)); });
    return box;
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
        h('div', { class: 'hero' }, state.char ? avatar(120) : '🌈'),
        h('h1', {}, `${T.hello.fr}`), h('div', { class: 'sub' }, T.hello.it),
        h('button', { class: 'big-btn', onclick: start }, `${FLAG.fr} ${FLAG.it} ▶`),
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
    lang = langMode() === 'alt' ? (Math.random() < .5 ? 'fr' : 'it') : langMode();
    if (isLocked()) return sleepScreen();
    const greet = (media.voices.ciao || []).length ? playClip('ciao') : say(t('greet'));
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
      gear.addEventListener('click', () => say(t('forDad')));

      s.append(h('div', { class: 'home-head' },
        h('button', { class: 'avatar', onclick: () => { sfx.pop(); setup(false); } }, avatar(36)),
        h('h1', {}, t('hello')),
        h('div', { class: 'pill stars-pill' }, `⭐ ${state.stars}`),
        gear,
      ));
      const tiles = h('div', { class: 'tiles' });
      games.forEach((g, i) => {
        tiles.append(h('button', {
          class: `tile t${i + 1}`,
          onclick: () => { sfx.pop(); say(tr(g.title)); startGame(g); },
        }, h('div', { class: 'ico' }, g.icon), h('div', { class: 'lbl' }, g.title.fr), h('div', { class: 'lbl2' }, g.title.it)));
      });
      const albumTile = h('button', { class: 'tile talbum', onclick: () => { sfx.pop(); album(); } },
        h('div', { class: 'ico' }, '📒'), h('div', { class: 'lbl' }, `Album ${state.stickers.length}/${STICKERS.length}`));
      const wardTile = h('button', { class: 'tile tward', onclick: () => { sfx.pop(); wardrobe(); } },
        h('div', { class: 'ico' }, '👗'), h('div', { class: 'lbl' }, T.wardrobeTile.fr), h('div', { class: 'lbl2' }, T.wardrobeTile.it));
      tiles.append(albumTile, wardTile);
      s.append(tiles);
      const tm = state.tut.home ? 0 : setTimeout(() => screenName === 'home' && intro('home', [
        { text: t('tutGame'), icon: '🎮', action: 'tap', at: () => tiles.children[0] },
        { text: t('tutAlbum'), icon: '📒', action: 'tap', at: () => albumTile },
        { text: t('tutWardrobe'), icon: '👗', action: 'tap', at: () => wardTile },
      ]), 2600);
      return () => { endPress(); clearTimeout(tm); };
    });
  }

  function setup(first) {
    show('setup', 'setup', s => {
      let selC = state.char || null;
      let selCol = state.color;
      const charBtns = CHARS.map(c => h('button', {
        class: 'char-btn' + (c.id === selC ? ' sel' : ''),
        onclick: () => {
          selC = c.id; sfx.pop(); say(tr(c.name) + (lang === 'fr' ? ' !' : '!'));
          charBtns.forEach((b, i) => b.classList.toggle('sel', CHARS[i].id === selC));
          go.style.visibility = 'visible';
        },
      }, c.e, h('span', {}, tr(c.name))));
      const sw = COLORS.map(c => h('button', {
        class: 'swatch' + (c.c === selCol ? ' sel' : ''), style: `background:${c.c}`, 'aria-label': c.n.it,
        onclick: () => {
          selCol = c.c; sfx.tap(); say(tr(c.n) + (lang === 'fr' ? ' !' : '!')); applyTheme(c.c);
          sw.forEach((b, i) => b.classList.toggle('sel', COLORS[i].c === selCol));
        },
      }));
      const go = h('button', {
        class: 'big-btn go', style: selC ? '' : 'visibility:hidden',
        onclick: () => {
          state.char = selC; state.color = selCol; save();
          sfx.win(); say(t('hiChar', tr(char().name)));
          home();
        },
      }, t('done'));
      s.append(
        ...(first ? [] : [h('div', { class: 'topbar' }, h('button', { class: 'icon-btn', onclick: () => { applyTheme(state.color); home(); } }, '🏠'))]),
        h('h2', {}, t('chooseFriend')),
        h('div', { class: 'char-grid' }, charBtns),
        h('h2', {}, t('chooseColor')),
        h('div', { class: 'palette' }, sw),
        go,
      );
      if (first) say(t('setupSay'));
    });
  }

  function album(highlight) {
    show('album', 'album', s => {
      const done = state.stickers.length >= STICKERS.length;
      s.append(h('div', { class: 'topbar' },
        h('button', { class: 'icon-btn', onclick: home }, '🏠'),
        h('div', { class: 'title' }, t('album')),
        h('div', { class: 'pill' }, `${state.stickers.length}/${STICKERS.length}`),
      ));
      s.append(h('div', { class: 'album-grid' }, STICKERS.map(st => h('button', {
        class: 'sticker' + (state.stickers.includes(st) ? '' : ' off') + (st === highlight ? ' new' : ''),
        onclick: ev => {
          if (state.stickers.includes(st)) { sfx.pop(); const r = ev.currentTarget.getBoundingClientRect(); floatAt(r.left + r.width / 2, r.top, st); }
          else say(t('albumLocked'));
        },
      }, st))));
      if (done) s.append(h('button', { class: 'big-btn', style: 'margin:8px auto 0', onclick: diploma }, '🏅 ' + t('diplomaOf').replace(/ de$| di$/, '')));
      say(done ? t('albumDone') : t('albumCount', state.stickers.length));
    });
  }

  /* ---------- armadio ---------- */
  function wardrobe() {
    show('wardrobe', 'wardrobe', s => {
      const starP = h('div', { class: 'pill stars-pill' }, `⭐ ${state.stars}`);
      const stageAv = h('div', { class: 'ward-av' });
      const grid = h('div', { class: 'ward-grid' });
      s.append(h('div', { class: 'topbar' },
        h('button', { class: 'icon-btn', onclick: home }, '🏠'),
        h('div', { class: 'title' }, t('wardrobe')), starP), stageAv, grid);
      const draw = () => {
        stageAv.innerHTML = '';
        stageAv.append(avatar(130));
        grid.innerHTML = '';
        ITEMS.forEach(it => {
          const own = state.owned.includes(it.id);
          const worn = state.wear[it.slot] === it.id;
          grid.append(h('button', {
            class: 'ward-item' + (own ? ' own' : '') + (worn ? ' worn' : ''),
            onclick: ev => choose(it, ev.currentTarget),
          }, h('span', { class: 'e' }, it.e), own ? (worn ? h('span', { class: 'tag' }, '✔') : null) : h('span', { class: 'price' }, `⭐${it.price}`)));
        });
      };
      function choose(it, el) {
        const r = el.getBoundingClientRect();
        if (state.owned.includes(it.id)) {
          if (state.wear[it.slot] === it.id) delete state.wear[it.slot]; else state.wear[it.slot] = it.id;
          save(); sfx.pop(); glitter(r.left + r.width / 2, r.top + r.height / 2, 12);
          say(tr(it.n) + (lang === 'fr' ? ' !' : '!'));
          draw();
          return;
        }
        if (state.stars < it.price) {
          sfx.boing();
          say(t('missing', it.price - state.stars));
          return;
        }
        say(`${tr(it.n)}${lang === 'fr' ? ' !' : '!'} ${t('buyQ')}`);
        const close = modal([h('div', { class: 'big' }, it.e), h('h2', {}, `⭐ ${it.price}`), h('div', { class: 'row' },
          h('button', {
            class: 'big-btn', style: 'background:#4cd06b;box-shadow:0 8px 0 #2f9a4a', onclick: () => {
              close();
              state.stars -= it.price; state.owned.push(it.id); state.wear[it.slot] = it.id; save();
              starP.textContent = `⭐ ${state.stars}`;
              sfx.win(); confetti(60); say(t('bought'));
              draw();
            },
          }, '✔️'),
          h('button', { class: 'big-btn', style: 'background:#ff6b6b;box-shadow:0 8px 0 #c94444', onclick: () => close() }, '✖️'))]);
      }
      draw();
      say(t('wardrobeSay'));
    });
  }

  /* premio: nuovo sticker (Promise risolta alla chiusura) */
  function reward() {
    const missing = STICKERS.filter(s => !state.stickers.includes(s));
    sfx.win(); confetti();
    addStars(3);
    if (!missing.length) { praise(); return wait(1200); }
    const st = pick(missing);
    state.stickers.push(st); save();
    return new Promise(res => {
      const close = modal([
        h('div', { class: 'big' }, st),
        h('h2', {}, t('newSticker')),
        h('div', { class: 'row' }, h('button', {
          class: 'big-btn', onclick: () => {
            close(); sfx.pop();
            if (state.stickers.length >= STICKERS.length && !state.diploma) { state.diploma = true; save(); diploma().then(res); }
            else res();
          },
        }, t('yay'))),
      ]);
      say(t('newStickerSay'));
    });
  }

  function diploma() {
    confetti(120); sfx.win();
    const d = new Date();
    return new Promise(res => {
      const close = modal(h('div', { class: 'diploma' },
        h('div', { style: 'font-size:60px' }, '🏅', avatar(60)),
        h('h1', {}, t('diplomaOf')),
        h('div', { class: 'name' }, `Super ${NAME}`),
        h('p', {}, t('diplomaTxt')),
        h('p', { style: 'font-size:15px;opacity:.7' }, d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'it-IT', { day: 'numeric', month: 'long', year: 'numeric' })),
        h('button', { class: 'big-btn', onclick: () => { close(); res(); } }, t('yay')),
      ));
      say(t('diplomaSay'));
    });
  }

  /* ---------- giochi ---------- */
  function registerGame(g) { games.push(g); }

  function startGame(g) {
    state.stats.games[g.id] = (state.stats.games[g.id] || 0) + 1;
    save();
    show('game', 'game ' + (g.cls || ''), s => {
      const stage = h('div', { class: 'stage' });
      let help = null;
      const hud = h('div', { class: 'hud' },
        h('button', { class: 'icon-btn', onclick: () => { stopVoice(); home(); } }, '🏠'),
        h('button', { class: 'icon-btn', 'aria-label': 'Aiuto', onclick: () => help && help() }, '❓'),
        h('div', { class: 'pill flag-pill' }, FLAG[lang]),
        SKILLS.some(sk => sk.game === g.id && sk.max) ? h('div', { class: 'pill lvl-pill' }, `🏅 ${level(g.id)}`) : null,
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
    if (document.hidden || !started) return;
    if (['sleep', 'parent', 'splash', 'story'].includes(screenName)) return;
    const days = state.stats.days;
    days[today()] = (days[today()] || 0) + 1;
    if (!state.timerMin) { if (days[today()] % 10 === 0) save(); return; }
    const u = usage();
    u.sec++;
    if (u.sec % 5 === 0) save();
    const left = limitSec() - u.sec;
    if (left === 60 && !u.warned) {
      u.warned = true; save();
      say(t('minute', tr(char().the)), { queue: true });
    }
    if (left <= 0) { save(); story(); }
  }

  /* storia della buonanotte, poi la schermata della nanna */
  function story() {
    const pages = STORIES[state.story % STORIES.length];
    state.story++; save();
    nextLang();
    show('story', 'story', s => {
      let i = 0, alive = true;
      const scene = h('div', { class: 'story-scene' });
      const text = h('p', { class: 'story-text' });
      const dots = h('div', { class: 'story-dots' }, pages.map(() => h('i')));
      const next = h('button', { class: 'big-btn story-next', onclick: () => { sfx.tap(); go(i + 1); } }, t('storyNext'));
      s.append(h('div', { class: 'story-moon' }, '🌙'), scene, text, dots, next);
      async function go(k) {
        if (!alive) return;
        if (k >= pages.length) { alive = false; sleepScreen(); return; }
        i = k;
        const p = pages[i];
        scene.innerHTML = '';
        p.s.split(' ').forEach((e, j) => scene.append(e === '{c}' ? avatar(84) : h('span', { style: `animation-delay:${j * .15}s` }, e)));
        text.textContent = tr(p);
        [...dots.children].forEach((d, j) => d.classList.toggle('on', j <= i));
        const my = i;
        await say(tr(p), { rate: .9 });
        await wait(1500);
        if (alive && i === my) go(i + 1);
      }
      go(0);
      return () => { alive = false; };
    });
  }

  function sleepScreen() {
    show('sleep', 'sleep', s => {
      const c = char();
      s.append(
        h('div', { class: 'moon' }, '🌙'),
        h('div', { class: 'sleeper' }, avatar(110), h('span', { class: 'z' }, '💤')),
        h('p', {}, t('sleepTxt', tr(c.the), tr(c.fem))),
        h('button', { class: 'parent-link', onclick: parentGate }, '🔒 Genitore'),
      );
      if ((media.voices.nanna || []).length) playClip('nanna');
      else say(t('sleepSay', tr(c.the), tr(c.fem)));
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
    show('bday', 'bday', s => {
      let blown = 0;
      const candles = h('div', { class: 'candles' });
      for (let i = 0; i < age; i++) {
        const c = h('button', {
          class: 'candle', 'aria-label': 'candelina',
          onclick: async () => {
            if (c.classList.contains('out')) return;
            c.classList.add('out'); blown++; sfx.puff();
            say(numWord(blown, true) + (lang === 'fr' ? ' !' : '!'));
            if (blown === age) {
              await wait(900);
              const dur = birthdaySong();
              confetti(150);
              say(t('bdayWish', age), { rate: .9 });
              setTimeout(() => confetti(120), 2500);
              setTimeout(() => {
                s.append(h('button', {
                  class: 'big-btn', onclick: async () => {
                    await reward();
                    if (!state.char) setup(true); else home();
                  },
                }, t('gift')));
              }, Math.min(dur * 1000, 6000));
            }
          },
        }, h('span', { class: 'flame' }));
        candles.append(c);
      }
      s.append(
        h('h1', {}, t('bdayTitle')),
        h('p', {}, t('bdayHint')),
        h('div', { class: 'cake' }, h('div', { class: 'plate' }), h('div', { class: 'layer l1' }), h('div', { class: 'layer l2' }), candles),
      );
      confetti(80);
      say(t('bdaySay', age));
    });
  }

  /* ---------- area genitori (in italiano) ---------- */
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

  /* livelli e progressi: per ogni abilità livello, % giuste questa settimana vs precedente, ultime 8 settimane */
  function progressSection(section) {
    const dayKey = ms => { const d = new Date(ms); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
    const week = (skill, w) => {
      let ok = 0, ko = 0;
      for (let i = 0; i < 7; i++) {
        const e = (state.hist[dayKey(Date.now() - (w * 7 + i) * 864e5)] || {})[skill];
        if (e) { ok += e[0]; ko += e[1]; }
      }
      return { ok, ko, n: ok + ko, p: ok + ko ? Math.round(ok / (ok + ko) * 100) : null };
    };
    const rows = SKILLS.map(sk => {
      const cur = week(sk.id, 0), prev = week(sk.id, 1);
      const lvTxt = sk.max ? `${skillLevel(sk)}/${sk.max}` : '—';
      let trend = h('span', { class: 'tr eq' }, '·');
      if (cur.p != null && prev.p != null) {
        const d = cur.p - prev.p;
        trend = d >= 5 ? h('span', { class: 'tr up' }, `▲ +${d}%`) : d <= -5 ? h('span', { class: 'tr down' }, `▼ ${d}%`) : h('span', { class: 'tr eq' }, '= stabile');
      }
      const weeks = [7, 6, 5, 4, 3, 2, 1, 0].map(w => week(sk.id, w));
      return h('div', { class: 'prog-row' },
        h('div', { class: 'prog-name' }, `${sk.icon} ${sk.name}`),
        h('div', { class: 'prog-lv' }, sk.max ? h('span', { class: 'lv' }, `Liv. ${lvTxt}`) : h('span', { class: 'lv off' }, 'libero')),
        h('div', { class: 'prog-pct' }, cur.p != null ? `${cur.p}%` : '—', h('small', {}, cur.n ? ` (${cur.n})` : '')),
        h('div', { class: 'prog-trend' }, trend),
        h('div', { class: 'spark', title: 'ultime 8 settimane' }, weeks.map(x => h('i', { class: x.p == null ? 'none' : '', style: `height:${x.p == null ? 6 : Math.max(8, x.p)}%` }))));
    });
    const gName = Object.fromEntries(games.map(g => [g.id, g.short]));
    const log = state.levelLog.slice(-6).reverse().map(e => {
      const [y, m, d] = e.d.split('-').map(Number);
      return h('li', {}, `${new Date(y, m - 1, d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} · ${gName[e.g] || e.g} → livello ${e.lv}`);
    });
    return section('📈 Livelli e progressi',
      '% di risposte giuste negli ultimi 7 giorni (tra parentesi quante risposte), confronto con la settimana prima e andamento delle ultime 8 settimane.',
      h('div', { class: 'prog' },
        h('div', { class: 'prog-row head' }, h('div', {}, 'Abilità'), h('div', {}, 'Livello'), h('div', {}, '7 giorni'), h('div', {}, 'Tendenza'), h('div', {}, '8 settimane')),
        rows),
      h('b', {}, 'Ultimi livelli raggiunti'),
      log.length ? h('ul', { class: 'lvl-log' }, log) : h('p', { class: 'hint' }, 'Ancora nessun livello nuovo: arriveranno giocando!'));
  }

  /* pagella: riassunto leggibile per papà */
  function reportSection(section) {
    const st = state.stats;
    const judge = obj => {
      const good = [], weak = [];
      Object.entries(obj).forEach(([k, [ok, ko]]) => {
        if (ok + ko < 2) return;
        if (ok / (ok + ko) >= .75) good.push(k); else weak.push(`${k} (${ko} err.)`);
      });
      return { good, weak };
    };
    const chips = (list, cls) => h('div', { class: 'chips' }, list.length ? list.map(x => h('span', { class: 'chip ' + cls }, x)) : h('span', { class: 'hint' }, '—'));
    const L = judge(st.letters), N = judge(st.numbers);
    const pct = ([ok, ko]) => (ok + ko ? `${Math.round(ok / (ok + ko) * 100)}% giuste (${ok + ko} risposte)` : 'ancora nessuna risposta');
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      const k = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      days.push([d.toLocaleDateString('it-IT', { weekday: 'short' }), Math.round((st.days[k] || 0) / 60)]);
    }
    const maxM = Math.max(10, ...days.map(d => d[1]));
    const names = Object.fromEntries(games.map(g => [g.id, g.short]));
    const fav = Object.entries(st.games).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, n]) => `${names[id] || id} (${n})`).join(', ');
    return section('📊 Pagella di Lena', 'Si basa sulla prima risposta a ogni domanda.',
      h('b', {}, 'Lettere che conosce bene'), chips(L.good, 'ok'),
      h('b', {}, 'Lettere da ripassare'), chips(L.weak, 'ko'),
      h('b', {}, 'Numeri che conosce bene'), chips(N.good, 'ok'),
      h('b', {}, 'Numeri da ripassare'), chips(N.weak, 'ko'),
      h('b', {}, 'Lingue'),
      h('p', { class: 'hint' }, `🇫🇷 Francese: ${pct(st.langs.fr)}`), h('p', { class: 'hint' }, `🇮🇹 Italiano: ${pct(st.langs.it)}`),
      h('b', {}, 'Educazione stradale (Lena Salta)'),
      h('p', { class: 'hint' }, `Attraversamenti col verde: ${st.greens} · sulle strisce: ${st.zebra} · fermate col rosso o col treno: ${st.reds}`),
      h('b', {}, 'Tempo di gioco, ultimi 7 giorni'),
      h('div', { class: 'bars' }, days.map(([d, m]) => h('div', { class: 'bar' },
        h('i', { style: `height:${Math.max(2, m / maxM * 100)}%` }), h('span', {}, `${m}′`), h('small', {}, d)))),
      fav ? h('p', { class: 'hint' }, `Giochi preferiti: ${fav}`) : null,
      h('p', { class: 'hint' }, `Stelle guadagnate da spendere: ${state.stars} · accessori: ${state.owned.length}/${ITEMS.length}`));
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
          `Oggi ha giocato ${usedMin} min` + (state.timerMin ? ` su ${state.timerMin + u.extra}.` : '.') + ' Allo scadere parte una storia della buonanotte e l\'app si blocca fino a domani.',
          opts([[0, 'Spento'], [10, '10 min'], [15, '15'], [20, '20'], [30, '30'], [45, '45'], [60, '60']], state.timerMin, v => { state.timerMin = v; save(); }),
          h('div', { class: 'opts', style: 'margin-top:10px' },
            h('button', { class: 'act', onclick: () => { u.extra += 10; save(); render(); } }, '+10 min oggi'),
            h('button', { class: 'act ghost', onclick: () => { u.sec = 0; u.extra = 0; u.warned = false; save(); render(); } }, 'Azzera oggi'),
            h('button', { class: 'act ghost', onclick: story }, 'Prova la storia'))));

        scroll.append(section('🗣️ Lingua dei giochi', 'Alternanza: un turno in francese e uno in italiano.',
          opts([['alt', '🇫🇷🇮🇹 Alternanza'], ['fr', '🇫🇷 Solo francese'], ['it', '🇮🇹 Solo italiano']], langMode(), v => { state.langMode = v; save(); })));

        scroll.append(progressSection(section));
        scroll.append(reportSection(section));

        const voicesSec = section('🎙️ Le vostre voci',
          'Registrate frasi per Lena (in francese o in italiano): le sentirà al posto della voce del telefono. Restano solo su questo telefono.',
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
        scroll.append(voicesSec);

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
          h('button', { class: 'act', onclick: () => setup(false) }, `Cambia (ora: ${char().e} ${char().name.it})`)));

        scroll.append(section('🎂 Compleanno', `Il 18 gennaio l'app si apre con la festa (${ageAtBirthday()} candeline).`,
          h('button', { class: 'act', onclick: () => birthday(true) }, 'Prova la festa')));

        scroll.append(section('📒 Progressi', `Sticker: ${state.stickers.length}/${STICKERS.length}. Livelli: ` +
          games.map(g => `${g.short} ${level(g.id)}`).join(', ') + `. Record Salta: ${state.hopBest}.`,
          h('div', { class: 'opts' },
            h('button', { class: 'act ghost', onclick: () => { state.stars += 20; save(); render(); } }, '+20 ⭐ regalo'),
            h('button', {
              class: 'act ghost', onclick: () => {
                if (!confirm('Azzerare sticker, livelli, stelle, armadio e pagella?')) return;
                const d = defaults();
                Object.assign(state, { stickers: [], levels: {}, hopBest: 0, diploma: false, stars: 0, owned: [], wear: {}, stats: d.stats, hist: {}, levelLog: [] });
                save(); render();
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
          stream.getTracks().forEach(tr0 => tr0.stop());
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
    document.querySelectorAll('.tut').forEach(x => x.remove());
    const ov = h('div', { class: 'tut' });
    const hand = h('div', { class: 'tut-hand' }, '👆');
    const capEl = h('div', { class: 'tut-cap' });
    ov.append(capEl, hand);
    document.body.append(ov);
    const pt = x => {
      const v = typeof x === 'function' ? x() : x;
      if (v && v.getBoundingClientRect) {
        const r = v.getBoundingClientRect();
        if (r.width) return { x: r.left + r.width / 2, y: r.top + r.height / 2, el: v };
      } else if (v && 'x' in v) return v;
      return { x: innerWidth / 2, y: innerHeight / 2 };
    };
    const TT = (p, s = 1) => `translate(${p.x - 30}px, ${p.y - 8}px) scale(${s})`;
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
        const o = { duration: 1400, easing: 'ease-in-out' };
        const an = hand.animate([{ transform: TT(a, .9), opacity: 0 }, { transform: TT(a, .9), opacity: 1, offset: .15 },
          { transform: TT(b, .9), opacity: 1, offset: .8 }, { transform: TT(b, .9), opacity: 0 }], o);
        if (ghost) ghost.animate([{ transform: 'none' }, { transform: 'none', offset: .15 },
          { transform: `translate(${dx}px, ${dy}px)`, offset: .8 }, { transform: `translate(${dx}px, ${dy}px)` }], o);
        await an.finished.catch(() => {});
        if (ghost) ghost.remove();
      } else {
        hand.style.transform = TT(a);
        const an = hand.animate([{ transform: TT(a, 1) }, { transform: TT(a, .8), offset: .4 }, { transform: TT(a, 1) }], { duration: 600 });
        setTimeout(() => ripple(a), 240);
        await an.finished.catch(() => {});
        await wait(250);
      }
    }
    return new Promise(async resolve => {
      for (const s of steps) {
        if (!ov.isConnected) return resolve();
        if (s.before) s.before();
        capEl.innerHTML = '';
        capEl.append(h('span', { class: 'ico' }, s.icon || '👆'), h('span', {}, s.text));
        capEl.classList.toggle('top', s.cap === 'top');
        const v = say(s.text);
        for (let i = 0; i < (s.reps || 2) && ov.isConnected; i++) await act(s);
        await v;
        await wait(250);
      }
      if (!ov.isConnected) return resolve();
      hand.style.display = 'none';
      capEl.innerHTML = '';
      capEl.classList.remove('top');
      capEl.append(h('span', { class: 'ico' }, '⭐'), h('span', {}, t('yourTurn')));
      say(t('yourTurn'));
      ov.append(h('button', { class: 'big-btn tut-go', onclick: () => { sfx.pop(); ov.remove(); resolve(); } }, t('gotIt')));
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
    const out = [];
    const saved = lang;
    for (const l of LANGS) {
      lang = l;
      const bang = l === 'fr' ? ' !' : '!';
      const add = (...xs) => xs.forEach(x => out.push([l, x]));
      add(...PRAISE[l], ...RETRY[l]);
      ['greet', 'forDad', 'setupSay', 'albumDone', 'albumLocked', 'newStickerSay', 'diplomaSay', 'yourTurn',
        'tutGame', 'tutAlbum', 'tutWardrobe', 'wardrobeSay', 'bought', 'newLevel'].forEach(k => add(t(k)));
      CHARS.forEach(c => add(tr(c.name) + bang, t('hiChar', tr(c.name)), t('minute', tr(c.the)), t('sleepSay', tr(c.the), tr(c.fem))));
      COLORS.forEach(c => add(tr(c.n) + bang));
      for (let n = 0; n < STICKERS.length; n++) add(t('albumCount', n));
      for (let n = 1; n <= 10; n++) add(numWord(n, true) + bang);
      for (let a = 1; a <= 10; a++) add(t('bdayWish', a), t('bdaySay', a));
      ITEMS.forEach(it => add(tr(it.n) + bang, `${tr(it.n)}${bang} ${t('buyQ')}`));
      for (let n = 1; n <= 30; n++) add(t('missing', n));
      STORIES.flat().forEach(p => add(p[l]));
      games.forEach(g => { add(g.title[l]); if (g.phrases) add(...g.phrases(l)); });
    }
    lang = saved;
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
    NAME, CHARS, NUM, FLAG, boot, h, say, stopVoice, sfx, praise, retry, reward, confetti, floatAt,
    rint, pick, shuffle, wait, level, setLevel, char, registerGame, home, media,
    tutorial, intro, phrases, vhash, modal, saveDrawing, glitter, avatar,
    tr, t, nextLang, numWord, track, count, addStars, levelUp,
    get lang() { return lang; }, set lang(l) { lang = l; },
    get state() { return state; }, save,
  };
})();
