/* Lena Salta / Lena saute — attraversa prati, strade (semaforo e strisce), binari (passaggio a livello) e fiumi.
   Quattro mondi che cambiano con la distanza. Niente game over: si riparte dall'ultimo prato. Bilingue FR/IT. */
(() => {
  const { h, say, sfx, rint, pick } = App;
  const COLS = 9;
  const SPAN = COLS + 6;
  const HOP_TIME = .13;
  const CARS = ['🚗', '🚕', '🚙', '🚓'];
  const MILESTONES = [25, 60, 100];
  const LIGHT = { green: 4, blink: 1.3, red: 4.5 };
  const GREEN_REWARD = 8;
  const ZEBRA = [3, 4, 5];          // colonne delle strisce pedonali
  const WORLD_LEN = 40;
  const TRAIN = { speed: 16, len: 6, warn: 2.4 };
  const HEAD_ACC = { fiore: '🌸', fiocco: '🎀', paglia: '👒', cilindro: '🎩', corona: '👑' };
  const WORLDS = [
    { grass: ['#8fdc6a', '#84d35f'], trees: ['🌳'], road: '#5b5d6b', water: '#4fb4f0', log: ['#9a6a3a', '#b8844f'], sign: '🌳',
      hello: { fr: 'Bienvenue dans le monde des prés !', it: 'Benvenuta nel mondo dei prati!' } },
    { grass: ['#f2f8ff', '#e3eefa'], trees: ['🌲', '🌲', '⛄'], road: '#6b7080', water: '#8fd0f5', log: ['#e8f6ff', '#ffffff'], sign: '❄️',
      hello: { fr: 'Bienvenue dans le monde de la neige !', it: 'Benvenuta nel mondo della neve!' } },
    { grass: ['#f7e3a1', '#f0d88a'], trees: ['🌴', '🌴', '🐚', '🦀'], road: '#6b6b73', water: '#2fa6e0', log: ['#e07a5f', '#f2a488'], sign: '🏖️',
      hello: { fr: 'Bienvenue à la plage !', it: 'Benvenuta al mare!' } },
    { grass: ['#8d93a8', '#848a9e'], trees: ['🌳', '🏠', '🌳'], road: '#3b3d4a', water: '#2c5f96', log: ['#9a6a3a', '#b8844f'], sign: '🌃', night: true,
      hello: { fr: 'Bienvenue en ville, la nuit !', it: 'Benvenuta nella città di notte!' } },
  ];
  const TX = {
    it: {
      stop: ['Stop! È rosso: aspetta il verde!', 'Fermati! Col rosso non si passa.', 'Rosso! Aspettiamo il verde.'],
      green: ['Brava! Col verde si passa!', 'Verde: via libera!', 'Perfetto, hai aspettato il verde!', 'Super! Attraversamento sicuro!'],
      zebra: 'Sulle strisce e col verde: bravissima!',
      trainStop: ['Arriva il treno! Aspetta!', 'Attenta, il treno! Aspettiamo.'],
      trainDie: 'Ops, il treno! Quando le luci lampeggiano, si aspetta.',
      die: ['Ops! Attenta alle macchine!', 'Ops! Guarda bene prima di saltare!'],
      dieRed: 'Ops! Il semaforo è diventato rosso: attraversa quando è appena verde!',
      splash: 'Splash! Salta sui tronchi!',
      intro: 'Tocca per saltare. Col rosso aspetta, col verde passa!',
      tut: ['Tocca lo schermo per saltare avanti!', 'Striscia il dito di lato per spostarti.',
        'Semaforo rosso: fermati e aspetta!', 'Semaforo verde: le macchine si fermano e puoi passare!',
        'Attenzione ai fiumi: salta sui tronchi!'],
      tutZebra: 'Attraversa sulle strisce bianche: è più sicuro e vinci più stelle!',
      tutTrain: 'Quando le luci rosse lampeggiano, arriva il treno: aspetta sul prato!',
    },
    fr: {
      stop: ["Stop ! C'est rouge : attends le vert !", 'Arrête-toi ! Au rouge, on ne passe pas.', 'Rouge ! On attend le vert.'],
      green: ['Bravo ! Au vert, on passe !', 'Vert : on peut y aller !', 'Parfait, tu as attendu le vert !', 'Super ! Tu as traversé en sécurité !'],
      zebra: 'Sur le passage piéton et au vert : bravo !',
      trainStop: ['Le train arrive ! Attends !', 'Attention, le train ! On attend.'],
      trainDie: 'Oh là là, le train ! Quand les lumières clignotent, on attend.',
      die: ['Oups ! Attention aux voitures !', 'Oups ! Regarde bien avant de sauter !'],
      dieRed: 'Oups ! Le feu est passé au rouge : traverse quand il vient de passer au vert !',
      splash: 'Plouf ! Saute sur les troncs !',
      intro: 'Touche pour sauter. Au rouge on attend, au vert on passe !',
      tut: ["Touche l'écran pour sauter en avant !", 'Glisse ton doigt sur le côté pour te déplacer.',
        'Feu rouge : arrête-toi et attends !', "Feu vert : les voitures s'arrêtent et tu peux passer !",
        'Attention aux rivières : saute sur les troncs !'],
      tutZebra: "Traverse sur les bandes blanches : c'est plus sûr et tu gagnes plus d'étoiles !",
      tutTrain: "Quand les lumières rouges clignotent, le train arrive : attends sur l'herbe !",
    },
  };
  const tx = () => TX[App.lang];
  /* ogni frase detta cambia lingua (alternanza) */
  const speak = f => { App.nextLang(); say(f(tx())); };

  App.registerGame({
    id: 'salta', title: { fr: 'Lena saute', it: 'Lena Salta' }, short: 'Salta', cls: 'hop',
    get icon() { return App.char().e; },
    phrases: l => {
      const T = TX[l];
      return [...T.stop, ...T.green, T.zebra, ...T.trainStop, T.trainDie, ...T.die, T.dieRed, T.splash, T.intro, ...T.tut,
        T.tutZebra, T.tutTrain, ...WORLDS.map(w => w.hello[l])];
    },
    start({ stage, addPill, setHelp }) {
      let alive = true;
      let paused = false;
      const canvas = h('canvas');
      const hint = h('div', { class: 'hop-hint' }, '👆 ⬆️   👉 ↔️');
      stage.append(canvas, hint);
      const ctx = canvas.getContext('2d');
      const starPill = addPill('⭐ 0');
      const distPill = addPill('🏁 0');

      let W = 0, H = 0, cell = 0, dpr = 1;
      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = stage.clientWidth; H = stage.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        cell = W / COLS;
      }
      resize();
      window.addEventListener('resize', resize);

      /* ---------- mondo ---------- */
      const rows = [];
      const plan = [];
      let roadsMade = 0;
      let time = 0;
      const worldIdx = i => Math.floor(Math.max(0, i - 4) / WORLD_LEN) % WORLDS.length;
      const world = i => WORLDS[worldIdx(i)];

      let forceLight = null;
      const lightState = L => {
        if (forceLight) return forceLight;
        const tot = LIGHT.green + LIGHT.blink + LIGHT.red;
        const p = (time + L.offset) % tot;
        return p < LIGHT.green ? 'green' : p < LIGHT.green + LIGHT.blink ? 'blink' : 'red';
      };
      const carsStopped = row => row.light && lightState(row.light) !== 'red';
      /* treno: fase nel ciclo; pericolo = luci che lampeggiano o treno che passa */
      const trainDur = (COLS + TRAIN.len + 6) / TRAIN.speed;
      const trainPhase = R => (time + R.train.offset) % R.train.period;
      const trainX = R => {
        const p = trainPhase(R);
        if (p >= trainDur) return null;
        return R.dir > 0 ? -TRAIN.len - 3 + TRAIN.speed * p : COLS + 3 - TRAIN.speed * p;
      };
      const trainDanger = R => trainX(R) != null || trainPhase(R) > R.train.period - TRAIN.warn;

      function planMore(i) {
        for (let k = rint(1, 2); k > 0; k--) plan.push({ t: 'grass' });
        const r = Math.random();
        if (i > 18 && r < .2) {
          plan[plan.length - 1].rail = true;
          plan.push({ t: 'rail' });
        } else if (i < 10 || r < .68) {
          const lanes = rint(1, Math.min(3, 1 + Math.floor(i / 15)));
          const light = roadsMade < 3 || Math.random() < .5 ? { offset: Math.random() * 10 } : null;
          roadsMade++;
          if (light) plan[plan.length - 1].post = light;
          for (let k = 0; k < lanes; k++) plan.push({ t: 'road', light });
        } else {
          for (let k = rint(1, 2); k > 0; k--) plan.push({ t: 'river' });
        }
      }

      function makeRow(i) {
        if (i < 4) return { t: 'grass', trees: new Map(i < 3 ? [[0, '🌳'], [8, '🌳']] : [[0, '🌳'], [1, '🌳'], [7, '🌳'], [8, '🌳']]), star: -1 };
        if (!plan.length) planMore(i);
        const p = plan.shift();
        const dir = Math.random() < .5 ? -1 : 1;
        const w = world(i);
        if (p.t === 'grass') {
          const trees = new Map();
          if (p.post || p.rail) { trees.set(0, ''); trees.set(COLS - 1, ''); }
          for (let k = rint(0, 3); k > 0; k--) { const c = rint(0, COLS - 1); if (!trees.has(c)) trees.set(c, pick(w.trees)); }
          let star = -1;
          if (Math.random() < .4) { const c = rint(1, COLS - 2); if (!trees.has(c)) star = c; }
          return { t: 'grass', trees, star, post: p.post, rail: p.rail };
        }
        if (p.t === 'rail') return { t: 'rail', dir, train: { offset: Math.random() * 8, period: rint(7, 10) }, warned: false };
        if (p.t === 'road') {
          const speed = 1.3 + Math.min(i / 50, 1.8) + Math.random() * .5;
          const n = rint(2, 3);
          const off = Math.random() * SPAN;
          const cars = [...Array(n).keys()].map(k => {
            const bus = Math.random() < .2;
            return { x: (off + k * SPAN / n) % SPAN - 3, len: bus ? 2 : 1, e: bus ? '🚌' : pick(CARS) };
          });
          return { t: 'road', dir, speed, cars, light: p.light };
        }
        const speed = .8 + Math.min(i / 80, .8);
        const len = i > 40 ? 2 : 3;
        const off = Math.random() * SPAN;
        const logs = [0, 1, 2].map(k => ({ x: (off + k * SPAN / 3) % SPAN - 3, len }));
        return { t: 'river', dir, speed, logs };
      }
      const row = i => {
        if (i < 0) return { t: 'grass', trees: new Map(), star: -1 };
        while (rows.length <= i) rows.push(makeRow(rows.length));
        return rows[i];
      };

      /* ---------- giocatore ---------- */
      const pl = { x: 4, row: 1, fx: 4, frow: 1, t: 1, log: null, dead: 0, inv: 0, deathIco: '' };
      /* solo per i test: ?hoprow=N parte più avanti (sul primo prato libero) */
      const dbgRow = +(new URLSearchParams(location.search).get('hoprow')) || 0;
      if (dbgRow) {
        let i = dbgRow;
        while (row(i).t !== 'grass' || row(i).trees.has(4)) i++;
        pl.row = pl.frow = i;
      }
      let lastSafe = { row: pl.row, x: 4 };
      let cam = pl.row - 3;
      let best = pl.row;
      let stars = 0;
      let queued = null;
      let greenFlag = false;
      let zebraOk = false;
      let greens = 0;
      let lastStop = -99;
      let curWorld = worldIdx(pl.row);
      let nextMs = 0;
      const greenPill = addPill('🚦 0');
      const milestone = n => (n < MILESTONES.length ? MILESTONES[n] : MILESTONES[MILESTONES.length - 1] + 50 * (n - MILESTONES.length + 1));
      function sign(e) {
        const d = h('div', { class: 'hop-sign' }, e);
        stage.append(d);
        setTimeout(() => d.remove(), 1150);
      }
      const screenPt = (x, y) => { const b = stage.getBoundingClientRect(); return { x: b.left + x, y: b.top + y }; };

      function hop(dc, dr) {
        if (paused || pl.dead) return;
        if (pl.t < 1) { queued = [dc, dr]; return; }
        const tr = pl.row + dr;
        const tx0 = Math.round(pl.x) + dc;
        if (tx0 < 0 || tx0 > COLS - 1 || tr < 0 || tr < Math.floor(cam)) return;
        const R = row(tr);
        const from = row(pl.row);
        if (R.t === 'grass' && R.trees.has(tx0)) { sfx.tap(); return; }
        if (R.t === 'road' && carsStopped(R) && R.cars.some(c => tx0 + .8 > c.x + .05 && tx0 + .2 < c.x + c.len - .05)) { sfx.tap(); return; }
        /* verifiche: dal prato non si scende in strada col rosso, né sui binari quando arriva il treno */
        const redStop = R.t === 'road' && R.light && from.t === 'grass' && lightState(R.light) === 'red';
        const trainStop = R.t === 'rail' && from.t === 'grass' && trainDanger(R);
        if (redStop || trainStop) {
          sfx.boing();
          sign('✋');
          App.count('reds');
          App.track('strada', null, false);
          if (time - lastStop > 3) { lastStop = time; speak(T => pick(trainStop ? T.trainStop : T.stop)); }
          return;
        }
        pl.fx = pl.x; pl.frow = pl.row;
        pl.x = tx0; pl.row = tr; pl.t = 0; pl.log = null;
        sfx.hop();
        if (hint.style.opacity !== '0') hint.style.opacity = '0';
      }

      function land() {
        const R = row(pl.row);
        if (R.t === 'grass') {
          lastSafe = { row: pl.row, x: pl.x };
          if (R.star === pl.x) {
            R.star = -1; stars++; starPill.textContent = `⭐ ${stars}`; sfx.star();
            const p = screenPt((pl.x + .5) * cell, rowY(pl.row));
            App.addStars(1, p.x, p.y);
          }
          if (greenFlag && row(pl.row - 1).t === 'road') {
            greens++;
            App.count('greens');
            App.track('strada', null, true);
            greenPill.textContent = `🚦 ${greens}`;
            sfx.ding();
            const p = screenPt(W / 2, H * .38);
            if (zebraOk) {
              sign('🦓');
              App.count('zebra');
              App.addStars(2, p.x, p.y);
              if (greens % GREEN_REWARD !== 0) speak(T => T.zebra);
            } else {
              sign('✅');
              App.addStars(1, p.x, p.y);
              if (greens % GREEN_REWARD !== 0) speak(T => pick(T.green));
            }
            if (greens % GREEN_REWARD === 0) celebrate();
          }
          greenFlag = false;
        } else if (R.t === 'road') {
          if (R.light && row(pl.row - 1).t === 'grass') { greenFlag = carsStopped(R); zebraOk = ZEBRA.includes(pl.x); }
          else if (!ZEBRA.includes(pl.x)) zebraOk = false;
        } else if (R.t === 'river') {
          const lg = R.logs.find(l => pl.x + .5 > l.x && pl.x + .5 < l.x + l.len);
          if (lg) pl.log = lg; else die('splash');
        }
        if (pl.row > best) {
          best = pl.row;
          distPill.textContent = `🏁 ${best - 1}`;
          if (best - 1 > App.state.hopBest) { App.state.hopBest = best - 1; App.save(); }
          if (best - 1 >= milestone(nextMs)) { nextMs++; celebrate(); }
          const w = worldIdx(best);
          if (w !== curWorld) {
            curWorld = w;
            sign(WORLDS[w].sign);
            const p = screenPt(W / 2, H * .38);
            App.glitter(p.x, p.y, 24);
            speak(() => WORLDS[w].hello[App.lang]);
          }
        }
      }

      async function celebrate() {
        paused = true;
        await App.reward();
        paused = false;
      }

      function die(kind) {
        if (pl.dead || pl.inv > 0) return;
        const R = row(pl.row);
        pl.dead = .9;
        pl.deathIco = kind === 'splash' ? '💦' : '💫';
        if (kind === 'splash') { sfx.splash(); speak(T => T.splash); }
        else if (kind === 'train') { sfx.puff(); App.track('strada', null, false); speak(T => T.trainDie); }
        else {
          App.track('strada', null, false);
          sfx.puff();
          speak(T => (R.light && lightState(R.light) === 'red' ? T.dieRed : pick(T.die)));
        }
      }

      function respawn() {
        pl.dead = 0; pl.log = null;
        pl.row = pl.frow = lastSafe.row;
        pl.x = pl.fx = lastSafe.x;
        pl.t = 1; pl.inv = 1.5;
        greenFlag = false;
      }

      /* ---------- aggiornamento ---------- */
      function update(dt) {
        time += dt;
        const first = Math.floor(cam) - 1, lastR = Math.floor(cam) + Math.ceil(H / cell) + 3;
        for (let i = Math.max(0, first); i <= lastR; i++) {
          const R = row(i);
          if (R.t === 'road' && !carsStopped(R)) R.cars.forEach(c => move(c, R, dt));
          if (R.t === 'river') R.logs.forEach(l => move(l, R, dt));
          if (R.t === 'rail') {
            const passing = trainX(R) != null;
            const warn = trainDanger(R) && !passing;
            if (warn && !R.warned) { R.warned = true; if (Math.abs(i - pl.row) < 6) sfx.bell(); }
            if (passing && R.warned) { R.warned = false; if (Math.abs(i - pl.row) < 6) sfx.train(); }
          }
        }
        maybeTrainTutorial();
        if (paused) return;
        if (pl.dead) {
          pl.dead -= dt;
          if (pl.dead <= 0) respawn();
          return;
        }
        pl.inv = Math.max(0, pl.inv - dt);
        if (pl.t < 1) {
          pl.t = Math.min(1, pl.t + dt / HOP_TIME);
          if (pl.t >= 1) {
            land();
            if (queued && !pl.dead) { const q = queued; queued = null; hop(q[0], q[1]); }
          }
        } else {
          const R = row(pl.row);
          if (R.t === 'river' && pl.log) {
            pl.x += R.dir * R.speed * dt;
            if (pl.x < -.4 || pl.x > COLS - .6) die('splash');
          }
          if (R.t === 'road' && R.cars.some(c => pl.x + .78 > c.x + .08 && pl.x + .22 < c.x + c.len - .08)) die('car');
          if (R.t === 'rail') {
            const x = trainX(R);
            if (x != null && pl.x + .8 > x && pl.x + .2 < x + TRAIN.len) die('train');
          }
        }
        const target = pl.row - 3;
        if (target > cam) cam += (target - cam) * Math.min(1, dt * 4);
      }
      function move(o, R, dt) {
        o.x += R.dir * R.speed * dt;
        if (R.dir > 0 && o.x > COLS + 3) o.x -= SPAN;
        if (R.dir < 0 && o.x + o.len < -3) o.x += SPAN;
      }

      /* ---------- disegno ---------- */
      const rowY = i => H - (i - cam + 1) * cell;
      function emoji(e, x, y, size, flip) {
        ctx.save();
        ctx.translate(x, y);
        if (flip) ctx.scale(-1, 1);
        ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.fillText(e, 0, 0);
        ctx.restore();
      }
      function rrect(x, y, w, hh, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + hh, r); ctx.arcTo(x + w, y + hh, x, y + hh, r);
        ctx.arcTo(x, y + hh, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
      }
      function drawLight(L, cx, cy) {
        const s = lightState(L);
        const w = cell * .5, hh = cell * .8;
        ctx.fillStyle = '#555'; ctx.fillRect(cx - 2, cy, 4, cell * .45);
        ctx.fillStyle = '#2b2b33'; rrect(cx - w / 2, cy - hh * .75, w, hh, 6); ctx.fill();
        const on = s === 'green' || (s === 'blink' && Math.floor(time * 4) % 2 === 0);
        ctx.fillStyle = s === 'red' ? '#ff3b3b' : '#4a2323';
        ctx.beginPath(); ctx.arc(cx, cy - hh * .52, w * .32, 0, 7); ctx.fill();
        ctx.fillStyle = on ? '#3dff6e' : '#1f4a2a';
        ctx.beginPath(); ctx.arc(cx, cy - hh * .12, w * .32, 0, 7); ctx.fill();
      }
      /* passaggio a livello: croce di Sant'Andrea + due luci rosse che lampeggiano quando arriva il treno */
      function drawCrossing(R, cx, cy) {
        const danger = trainDanger(R);
        const blink = Math.floor((time + (paused ? performance.now() / 1000 : 0)) * 3) % 2;
        ctx.fillStyle = '#555'; ctx.fillRect(cx - 2, cy - cell * .5, 4, cell * .9);
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(cx - 11, cy - cell * .66); ctx.lineTo(cx + 11, cy - cell * .44);
        ctx.moveTo(cx + 11, cy - cell * .66); ctx.lineTo(cx - 11, cy - cell * .44); ctx.stroke();
        ctx.strokeStyle = '#e33'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#2b2b33'; rrect(cx - cell * .32, cy - cell * .32, cell * .64, cell * .26, 5); ctx.fill();
        [[-1, blink], [1, 1 - blink]].forEach(([sx, on]) => {
          ctx.fillStyle = danger && on ? '#ff3b3b' : '#4a2323';
          ctx.beginPath(); ctx.arc(cx + sx * cell * .16, cy - cell * .19, cell * .09, 0, 7); ctx.fill();
        });
      }

      function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const first = Math.floor(cam) - 1, lastR = Math.floor(cam) + Math.ceil(H / cell) + 2;
        for (let i = lastR; i >= first; i--) {
          const R = row(i), y = rowY(i), w = world(i);
          if (R.t === 'grass') {
            ctx.fillStyle = w.grass[((i % 2) + 2) % 2];
            ctx.fillRect(0, y, W, cell + 1);
          } else if (R.t === 'road') {
            ctx.fillStyle = w.road; ctx.fillRect(0, y, W, cell + 1);
            if (row(i + 1).t === 'road') {
              ctx.fillStyle = 'rgba(255,255,255,.7)';
              for (let x = 0; x < W; x += cell) ctx.fillRect(x + cell * .2, y - 2, cell * .5, 4);
            }
            if (R.light) {
              ctx.fillStyle = 'rgba(255,255,255,.85)';
              for (let k = 0; k < 6; k++) ctx.fillRect(ZEBRA[0] * cell + k * cell * .5 + cell * .1, y + 3, cell * .28, cell - 6);
              if (carsStopped(R)) { ctx.fillStyle = 'rgba(61,255,110,.12)'; ctx.fillRect(0, y, W, cell); }
            }
          } else if (R.t === 'rail') {
            ctx.fillStyle = '#b9a58a'; ctx.fillRect(0, y, W, cell + 1);
            ctx.fillStyle = '#6b4a2e';
            for (let x = 0; x < W; x += cell * .5) ctx.fillRect(x + 2, y + cell * .15, cell * .18, cell * .7);
            ctx.fillStyle = '#7d828c';
            ctx.fillRect(0, y + cell * .28, W, 4); ctx.fillRect(0, y + cell * .66, W, 4);
          } else {
            ctx.fillStyle = w.water; ctx.fillRect(0, y, W, cell + 1);
            ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2;
            for (let x = ((time * 20 * R.dir) % cell + cell) % cell - cell; x < W; x += cell) {
              ctx.beginPath(); ctx.arc(x + cell / 2, y + cell * .55, cell * .18, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
            }
          }
          if (w.night) { ctx.fillStyle = 'rgba(15,15,60,.38)'; ctx.fillRect(0, y, W, cell + 1); }
        }
        for (let i = lastR; i >= first; i--) {
          const R = row(i), y = rowY(i), cy = y + cell / 2, w = world(i);
          if (R.t === 'grass') {
            R.trees.forEach((e, c) => { if (e) emoji(e, (c + .5) * cell, cy - cell * .08, cell * .92); });
            if (R.post) { drawLight(R.post, cell * .5, cy); drawLight(R.post, (COLS - .5) * cell, cy); }
            if (R.rail) { const RR = row(i + 1); drawCrossing(RR, cell * .5, cy); drawCrossing(RR, (COLS - .5) * cell, cy); }
            if (R.star >= 0) emoji('⭐', (R.star + .5) * cell, cy + Math.sin(time * 4 + i) * 3, cell * .6);
          } else if (R.t === 'road') {
            R.cars.forEach(c => {
              if (w.night) {
                ctx.fillStyle = 'rgba(255,240,150,.35)';
                ctx.beginPath(); ctx.arc((R.dir > 0 ? c.x + c.len : c.x) * cell, cy, cell * .45, 0, 7); ctx.fill();
              }
              emoji(c.e, (c.x + c.len / 2) * cell, cy, cell * (c.len > 1 ? 1.5 : .95), R.dir > 0);
            });
          } else if (R.t === 'rail') {
            const x = trainX(R);
            if (x != null) {
              for (let k = 0; k < TRAIN.len; k++) {
                const head = R.dir > 0 ? k === TRAIN.len - 1 : k === 0;
                emoji(head ? '🚂' : '🚃', (x + k + .5) * cell, cy, cell * 1.05, R.dir > 0);
              }
            }
          } else {
            R.logs.forEach(l => {
              ctx.fillStyle = w.log[0]; rrect(l.x * cell + 2, y + cell * .15, l.len * cell - 4, cell * .7, cell * .3); ctx.fill();
              ctx.fillStyle = w.log[1]; rrect(l.x * cell + 8, y + cell * .3, l.len * cell - 16, cell * .12, 4); ctx.fill();
            });
          }
          if (i === pl.row || (pl.t < 1 && i === pl.frow)) drawPlayer(i);
        }
      }
      let drawnPlayer = false;
      function drawPlayer(i) {
        if (drawnPlayer || i !== (pl.t < 1 ? Math.max(pl.row, pl.frow) : pl.row)) return;
        drawnPlayer = true;
        const e = pl.t < 1 ? pl.t : 1;
        const x = (pl.fx + (pl.x - pl.fx) * e + .5) * cell;
        const r = pl.frow + (pl.row - pl.frow) * e;
        const y = rowY(r) + cell / 2 - Math.sin(Math.PI * e) * cell * .35 * (pl.t < 1 ? 1 : 0);
        if (pl.dead) { emoji(pl.deathIco, x, y, cell * (1.2 - pl.dead * .3)); return; }
        if (pl.inv > 0 && Math.floor(pl.inv * 10) % 2) return;
        ctx.fillStyle = 'rgba(0,0,0,.18)';
        ctx.beginPath(); ctx.ellipse(x, rowY(r) + cell * .85, cell * .3, cell * .1, 0, 0, 7); ctx.fill();
        emoji(App.char().e, x, y, cell * 1.05);
        const headE = HEAD_ACC[App.state.wear.head];   // accessorio in testa dall'armadio
        if (headE) emoji(headE, x, y - cell * .5, cell * .5);
      }

      /* ---------- ciclo ---------- */
      let raf = 0, lastT = performance.now();
      function loop(now) {
        const dt = Math.min(.05, (now - lastT) / 1000);
        lastT = now;
        if (!paused) update(dt);
        drawnPlayer = false;
        draw();
        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(tt => { lastT = tt; loop(tt); });

      /* ---------- controlli ---------- */
      let sx = 0, sy = 0, down = false;
      canvas.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sy = e.clientY; e.preventDefault(); });
      canvas.addEventListener('pointerup', e => {
        if (!down) return;
        down = false;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) < 25 && Math.abs(dy) < 25) hop(0, 1);
        else if (Math.abs(dx) > Math.abs(dy)) hop(dx > 0 ? 1 : -1, 0);
        else hop(0, dy < 0 ? 1 : -1);
      });
      const onKey = e => {
        const m = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
        if (m) { e.preventDefault(); hop(m[0], m[1]); }
      };
      window.addEventListener('keydown', onKey);

      /* ---------- tutorial (semaforo "forzato" per mostrare rosso e verde) ---------- */
      const visibleRow = test => {
        for (let i = pl.row; i < pl.row + Math.ceil(H / cell) - 3; i++) if (test(row(i))) return i;
        return -1;
      };
      const sp = (x, y) => () => screenPt(x, y);
      const zebraStep = li => ({ text: tx().tutZebra, icon: '🦓', action: 'tap', at: () => sp((ZEBRA[1] + .5) * cell, rowY(li + 1) + cell / 2)(), cap: 'top', before: () => { forceLight = 'green'; } });
      function tutSteps() {
        const T = tx();
        const li = visibleRow(R => R.post);
        const ri = visibleRow(R => R.t === 'river');
        const lightPt = () => sp(cell * .5, rowY(li) + cell * .15)();
        const steps = [
          { text: T.tut[0], icon: '👆', action: 'tap', at: sp(W / 2, H * .62), cap: 'top' },
          { text: T.tut[1], icon: '👉', action: 'swipe', at: sp(W * .25, H * .62), to: sp(W * .75, H * .62), cap: 'top' },
        ];
        if (li >= 0) {
          steps.push({ text: T.tut[2], icon: '🔴', action: 'tap', at: lightPt, cap: 'top', before: () => { forceLight = 'red'; } });
          steps.push({ text: T.tut[3], icon: '🟢', action: 'tap', at: lightPt, cap: 'top', before: () => { forceLight = 'green'; } });
          steps.push(zebraStep(li));
        }
        if (ri >= 0) steps.push({ text: T.tut[4], icon: '🪵', action: 'tap', at: () => sp(W / 2, rowY(ri) + cell / 2)(), cap: 'top' });
        return steps;
      }
      const runTut = p => p.then(r => { forceLight = null; return r; });
      setHelp(() => runTut(App.tutorial(tutSteps())));
      App.nextLang();
      (async () => {
        const ran = await runTut(App.intro('salta', tutSteps()));
        if (ran) { App.state.tut.salta2 = true; App.save(); return; }
        /* chi aveva già visto il primo tutorial vede solo la novità delle strisce */
        const li = visibleRow(R => R.post);
        if (!App.state.tut.salta2 && li >= 0) { await runTut(App.intro('salta2', [zebraStep(li)])); return; }
        if (alive) say(tx().intro);
      })();

      /* tutorial del treno la prima volta che un binario compare vicino: il treno viene "messo in arrivo" */
      let trainTutDone = !!App.state.tut.treno;
      function maybeTrainTutorial() {
        if (trainTutDone || document.querySelector('.tut')) return;
        for (let i = pl.row + 1; i <= pl.row + 4; i++) {
          const RR = row(i);
          if (RR.t !== 'rail') continue;
          trainTutDone = true;
          paused = true;
          const P = RR.train.period, target = P - TRAIN.warn + .2;
          RR.train.offset = ((target - time) % P + P) % P;
          App.nextLang();
          App.intro('treno', [{ text: tx().tutTrain, icon: '🚂', action: 'tap', at: () => sp(cell * .5, rowY(i - 1) + cell * .25)(), cap: 'top' }])
            .then(() => { paused = false; });
          return;
        }
      }

      return () => {
        alive = false;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('keydown', onKey);
      };
    },
  });
})();
