/* Lena Salta — attraversa prati, strade (col semaforo) e fiumi. Niente game over: si riparte dall'ultimo prato. */
(() => {
  const { h, say, sfx, rint, pick } = App;
  const COLS = 9;
  const SPAN = COLS + 6;
  const HOP_TIME = .13;
  const CARS = ['🚗', '🚕', '🚙', '🚓'];
  const MILESTONES = [25, 60, 100];
  const LIGHT = { green: 4, blink: 1.3, red: 4.5 };
  const GREEN_REWARD = 8;
  const STOP_SAYS = ['Stop! È rosso: aspetta il verde!', 'Fermati! Col rosso non si passa.', 'Rosso! Aspettiamo il verde.'];
  const GREEN_SAYS = ['Brava! Col verde si passa!', 'Verde: via libera!', 'Perfetto, hai aspettato il verde!', 'Super! Attraversamento sicuro!'];
  const INTRO = 'Tocca per saltare. Col rosso aspetta, col verde passa!';
  const TUT_TEXT = ['Tocca lo schermo per saltare avanti!', 'Striscia il dito di lato per spostarti.',
    'Semaforo rosso: fermati e aspetta!', 'Semaforo verde: le macchine si fermano e puoi passare!',
    'Attenzione ai fiumi: salta sui tronchi!'];
  const DIE_SAYS = ['Ops! Attenta alle macchine!', 'Ops! Guarda bene prima di saltare!'];

  App.registerGame({
    id: 'salta', title: 'Lena Salta', short: 'Salta', cls: 'hop',
    get icon() { return App.char().e; },
    phrases: () => [...STOP_SAYS, ...GREEN_SAYS, ...TUT_TEXT, ...DIE_SAYS, INTRO, 'Splash! Salta sui tronchi!',
      'Ops! Il semaforo è diventato rosso: attraversa quando è appena verde!'],
    start({ stage, addPill, setHelp }) {
      let alive = true;
      let paused = false;
      const canvas = h('canvas');
      const hint = h('div', { class: 'hop-hint' }, 'Tocca per saltare • striscia per andare di lato');
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
      let plan = [];
      let roadsMade = 0;
      let time = 0;

      let forceLight = null;
      const lightState = L => {
        if (forceLight) return forceLight;
        const tot = LIGHT.green + LIGHT.blink + LIGHT.red;
        const p = (time + L.offset) % tot;
        return p < LIGHT.green ? 'green' : p < LIGHT.green + LIGHT.blink ? 'blink' : 'red';
      };
      const carsStopped = row => row.light && lightState(row.light) !== 'red';

      function planMore(i) {
        for (let k = rint(1, 2); k > 0; k--) plan.push({ t: 'grass' });
        if (i < 10 || Math.random() < .6) {
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
        if (i < 4) return { t: 'grass', trees: new Set(i < 3 ? [0, 8] : [0, 1, 7, 8]), star: -1 };
        if (!plan.length) planMore(i);
        const p = plan.shift();
        const dir = Math.random() < .5 ? -1 : 1;
        if (p.t === 'grass') {
          const trees = new Set();
          if (p.post) { trees.add(0); trees.add(COLS - 1); }
          for (let k = rint(0, 3); k > 0; k--) trees.add(rint(0, COLS - 1));
          let star = -1;
          if (Math.random() < .4) { const c = rint(1, COLS - 2); if (!trees.has(c)) star = c; }
          return { t: 'grass', trees, star, post: p.post };
        }
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
        if (i < 0) return { t: 'grass', trees: new Set(), star: -1 };
        while (rows.length <= i) rows.push(makeRow(rows.length));
        return rows[i];
      };

      /* ---------- giocatore ---------- */
      const pl = { x: 4, row: 1, fx: 4, frow: 1, t: 1, log: null, dead: 0, inv: 0, deathIco: '' };
      let lastSafe = { row: 1, x: 4 };
      let cam = pl.row - 3;
      let best = 1;
      let stars = 0;
      let queued = null;
      let greenFlag = false;
      let greens = 0;
      let lastStop = -99;
      const greenPill = addPill('🚦 0');
      function sign(e) {
        const d = h('div', { class: 'hop-sign' }, e);
        stage.append(d);
        setTimeout(() => d.remove(), 1150);
      }
      let nextMs = 0;
      const milestone = n => (n < MILESTONES.length ? MILESTONES[n] : MILESTONES[MILESTONES.length - 1] + 50 * (n - MILESTONES.length + 1));

      function hop(dc, dr) {
        if (paused || pl.dead) return;
        if (pl.t < 1) { queued = [dc, dr]; return; }
        const tr = pl.row + dr;
        const tx = Math.round(pl.x) + dc;
        if (tx < 0 || tx > COLS - 1 || tr < 0 || tr < Math.floor(cam)) return;
        const R = row(tr);
        if (R.t === 'grass' && R.trees.has(tx)) { sfx.tap(); return; }
        if (R.t === 'road' && carsStopped(R) && R.cars.some(c => tx + .8 > c.x + .05 && tx + .2 < c.x + c.len - .05)) { sfx.tap(); return; }
        /* verifica semaforo: dal prato non si scende in strada col rosso */
        if (R.t === 'road' && R.light && row(pl.row).t === 'grass' && lightState(R.light) === 'red') {
          sfx.boing();
          sign('✋');
          if (time - lastStop > 3) { lastStop = time; say(pick(STOP_SAYS)); }
          return;
        }
        pl.fx = pl.x; pl.frow = pl.row;
        pl.x = tx; pl.row = tr; pl.t = 0; pl.log = null;
        sfx.hop();
        if (hint.style.opacity !== '0') hint.style.opacity = '0';
      }

      function land() {
        const R = row(pl.row);
        if (R.t === 'grass') {
          lastSafe = { row: pl.row, x: pl.x };
          if (R.star === pl.x) {
            R.star = -1; stars++; starPill.textContent = `⭐ ${stars}`; sfx.star();
            const y = rowY(pl.row);
            App.floatAt(stage.getBoundingClientRect().left + (pl.x + .5) * cell, stage.getBoundingClientRect().top + y, '⭐');
          }
          if (greenFlag && row(pl.row - 1).t === 'road') {
            greens++;
            greenPill.textContent = `🚦 ${greens}`;
            sign('✅');
            sfx.ding();
            if (greens % GREEN_REWARD === 0) celebrate();
            else say(pick(GREEN_SAYS));
          }
          greenFlag = false;
        } else if (R.t === 'road') {
          if (R.light && row(pl.row - 1).t === 'grass') greenFlag = carsStopped(R);
        } else if (R.t === 'river') {
          const lg = R.logs.find(l => pl.x + .5 > l.x && pl.x + .5 < l.x + l.len);
          if (lg) pl.log = lg; else die('splash');
        }
        if (pl.row > best) {
          best = pl.row;
          distPill.textContent = `🏁 ${best - 1}`;
          if (best - 1 > App.state.hopBest) { App.state.hopBest = best - 1; App.save(); }
          if (best - 1 >= milestone(nextMs)) { nextMs++; celebrate(); }
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
        if (kind === 'splash') { sfx.splash(); say('Splash! Salta sui tronchi!'); }
        else {
          sfx.puff();
          say(R.light && lightState(R.light) === 'red' ? 'Ops! Il semaforo è diventato rosso: attraversa quando è appena verde!' : pick(DIE_SAYS));
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
        }
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

      function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const first = Math.floor(cam) - 1, lastR = Math.floor(cam) + Math.ceil(H / cell) + 2;
        for (let i = lastR; i >= first; i--) {
          const R = row(i), y = rowY(i);
          if (R.t === 'grass') {
            ctx.fillStyle = i % 2 ? '#8fdc6a' : '#84d35f';
            ctx.fillRect(0, y, W, cell + 1);
          } else if (R.t === 'road') {
            ctx.fillStyle = '#5b5d6b'; ctx.fillRect(0, y, W, cell + 1);
            if (row(i + 1).t === 'road') {
              ctx.fillStyle = 'rgba(255,255,255,.7)';
              for (let x = 0; x < W; x += cell) ctx.fillRect(x + cell * .2, y - 2, cell * .5, 4);
            }
            if (R.light && carsStopped(R)) { ctx.fillStyle = 'rgba(61,255,110,.12)'; ctx.fillRect(0, y, W, cell); }
          } else {
            ctx.fillStyle = '#4fb4f0'; ctx.fillRect(0, y, W, cell + 1);
            ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2;
            for (let x = ((time * 20 * R.dir) % cell + cell) % cell - cell; x < W; x += cell) {
              ctx.beginPath(); ctx.arc(x + cell / 2, y + cell * .55, cell * .18, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
            }
          }
        }
        for (let i = lastR; i >= first; i--) {
          const R = row(i), y = rowY(i), cy = y + cell / 2;
          if (R.t === 'grass') {
            R.trees.forEach(c => { if (!(R.post && (c === 0 || c === COLS - 1))) emoji('🌳', (c + .5) * cell, cy - cell * .08, cell * .92); });
            if (R.post) { drawLight(R.post, cell * .5, cy); drawLight(R.post, (COLS - .5) * cell, cy); }
            if (R.star >= 0) emoji('⭐', (R.star + .5) * cell, cy + Math.sin(time * 4 + i) * 3, cell * .6);
          } else if (R.t === 'road') {
            R.cars.forEach(c => emoji(c.e, (c.x + c.len / 2) * cell, cy, cell * (c.len > 1 ? 1.5 : .95), R.dir > 0));
          } else {
            R.logs.forEach(l => {
              ctx.fillStyle = '#9a6a3a'; rrect(l.x * cell + 2, y + cell * .15, l.len * cell - 4, cell * .7, cell * .3); ctx.fill();
              ctx.fillStyle = '#b8844f'; rrect(l.x * cell + 8, y + cell * .3, l.len * cell - 16, cell * .12, 4); ctx.fill();
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
      raf = requestAnimationFrame(t => { lastT = t; loop(t); });

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

      /* tutorial: col semaforo "forzato" per mostrare rosso e verde */
      const visibleRow = test => {
        for (let i = pl.row; i < pl.row + Math.ceil(H / cell) - 3; i++) if (test(row(i))) return i;
        return -1;
      };
      function tutSteps() {
        const li = visibleRow(R => R.post);
        const ri = visibleRow(R => R.t === 'river');
        /* coordinate del canvas -> coordinate dello schermo (su PC l'app è centrata) */
        const sp = (x, y) => () => { const b = stage.getBoundingClientRect(); return { x: b.left + x, y: b.top + y }; };
        const lightPt = () => sp(cell * .5, rowY(li) + cell * .15)();
        const steps = [
          { text: TUT_TEXT[0], icon: '👆', action: 'tap', at: sp(W / 2, H * .62), cap: 'top' },
          { text: TUT_TEXT[1], icon: '👉', action: 'swipe', at: sp(W * .25, H * .62), to: sp(W * .75, H * .62), cap: 'top' },
        ];
        if (li >= 0) {
          steps.push({ text: TUT_TEXT[2], icon: '🔴', action: 'tap', at: lightPt, cap: 'top', before: () => { forceLight = 'red'; } });
          steps.push({ text: TUT_TEXT[3], icon: '🟢', action: 'tap', at: lightPt, cap: 'top', before: () => { forceLight = 'green'; } });
        }
        if (ri >= 0) steps.push({ text: TUT_TEXT[4], icon: '🪵', action: 'tap', at: () => sp(W / 2, rowY(ri) + cell / 2)(), cap: 'top' });
        return steps;
      }
      const runTut = p => p.then(() => { forceLight = null; });
      setHelp(() => runTut(App.tutorial(tutSteps())));
      runTut(App.intro('salta', tutSteps())).then(ran => { if (!ran && alive) say(INTRO); });

      return () => {
        alive = false;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('keydown', onKey);
      };
    },
  });
})();
