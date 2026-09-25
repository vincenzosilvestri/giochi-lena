/* Scrivi con il dito — pre-scrittura: ripassare lettere maiuscole e cifre seguendo il tracciato, nel verso giusto. In 5 lingue. */
(() => {
  const { h, say, sfx, wait } = App;
  /* tratti in un riquadro 0..100 (y verso il basso); arc() = arco in gradi, positivo in senso orario */
  const arc = (cx, cy, r, a0, a1, n = 14) => [...Array(n + 1).keys()].map(i => {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const L = [[30, 10], [30, 90], [75, 90]];
  const SHAPES = {
    A: [[[50, 10], [20, 90]], [[50, 10], [80, 90]], [[32, 62], [68, 62]]],
    B: [[[26, 10], [26, 90]], [[26, 10], [52, 10], ...arc(52, 30, 20, -90, 90), [26, 50]], [[26, 50], [56, 50], ...arc(56, 70, 20, -90, 90), [26, 90]]],
    C: [arc(52, 50, 38, -40, -320, 22)],
    D: [[[26, 10], [26, 90]], [[26, 10], [40, 10], ...arc(40, 50, 40, -90, 90, 18), [26, 90]]],
    E: [[[72, 10], [28, 10], [28, 90], [72, 90]], [[28, 50], [62, 50]]],
    F: [[[72, 10], [28, 10], [28, 90]], [[28, 50], [62, 50]]],
    G: [arc(52, 50, 38, -40, -360, 22), [[90, 50], [62, 50]]],
    H: [[[25, 10], [25, 90]], [[75, 10], [75, 90]], [[25, 50], [75, 50]]],
    I: [[[50, 10], [50, 90]]],
    J: [[[66, 10], [66, 66], ...arc(46, 66, 20, 0, 180)]],
    K: [[[28, 10], [28, 90]], [[74, 10], [30, 54], [76, 90]]],
    L: [L],
    M: [[[18, 90], [18, 10], [50, 62], [82, 10], [82, 90]]],
    N: [[[25, 90], [25, 10], [75, 90], [75, 10]]],
    O: [arc(50, 50, 40, -90, -450, 26)],
    P: [[[28, 10], [28, 90]], [[28, 10], [52, 10], ...arc(52, 32, 22, -90, 90), [28, 54]]],
    Q: [arc(50, 50, 40, -90, -450, 26), [[58, 66], [84, 92]]],
    R: [[[28, 10], [28, 90]], [[28, 10], [52, 10], ...arc(52, 32, 22, -90, 90), [28, 54]], [[46, 54], [76, 90]]],
    S: [[[76, 22], [66, 12], [50, 10], [34, 14], [28, 26], [34, 40], [50, 48], [66, 56], [74, 70], [68, 84], [50, 90], [34, 88], [24, 78]]],
    T: [[[20, 10], [80, 10]], [[50, 10], [50, 90]]],
    U: [[[25, 10], [25, 62], ...arc(50, 62, 25, 180, 0), [75, 10]]],
    V: [[[20, 10], [50, 90], [80, 10]]],
    W: [[[14, 10], [32, 90], [50, 40], [68, 90], [86, 10]]],
    X: [[[22, 10], [78, 90]], [[78, 10], [22, 90]]],
    Y: [[[22, 10], [50, 50]], [[78, 10], [50, 50], [50, 90]]],
    Z: [[[22, 10], [78, 10], [22, 90], [78, 90]]],
    0: [arc(50, 50, 38, -90, -450, 26).map(([x, y]) => [50 + (x - 50) * .75, y])],
    1: [[[34, 26], [54, 10], [54, 90]]],
    2: [[[28, 28], [36, 14], [52, 10], [68, 16], [72, 30], [64, 46], [26, 90], [76, 90]]],
    3: [[[28, 18], [48, 10], [66, 16], [68, 32], [50, 46], [70, 58], [70, 78], [52, 90], [28, 84]]],
    4: [[[56, 10], [20, 64], [80, 64]], [[62, 30], [62, 90]]],
    5: [[[72, 10], [32, 10], [28, 46], [48, 40], [68, 48], [74, 66], [66, 84], [48, 90], [28, 84]]],
    6: [[[70, 16], [54, 10], [36, 18], [26, 40], [26, 66], [36, 86], [54, 90], [70, 80], [74, 64], [64, 50], [48, 48], [32, 56], [26, 66]]],
    7: [[[22, 10], [78, 10], [40, 90]]],
    8: [[[64, 16], [50, 10], [36, 16], [32, 28], [40, 40], [50, 48], [62, 58], [70, 72], [62, 86], [50, 90], [38, 86], [30, 72], [38, 58], [50, 48], [60, 40], [68, 28], [64, 16]]],
    9: [[[70, 22], [60, 12], [48, 10], [34, 16], [28, 30], [32, 46], [48, 54], [64, 48], [72, 32], [72, 60], [64, 84], [46, 90], [30, 84]]],
  };
  const LETTER_IT = {
    A: 'a', B: 'bi', C: 'ci', D: 'di', E: 'e', F: 'effe', G: 'gi', H: 'acca', I: 'i', J: 'i lunga', K: 'cappa',
    L: 'elle', M: 'emme', N: 'enne', O: 'o', P: 'pi', Q: 'cu', R: 'erre', S: 'esse', T: 'ti', U: 'u', V: 'vu',
    W: 'doppia vu', X: 'ics', Y: 'ipsilon', Z: 'zeta',
  };
  const isDigit = c => /[0-9]/.test(c);
  const TX = {
    it: {
      letter: c => `Scrivi la lettera ${LETTER_IT[c]}! Segui i puntini.`, digit: w => `Scrivi il numero ${w}!`,
      doneL: c => `${LETTER_IT[c]}!`, tut: 'Parti dal pallino verde e segui la strada col dito!',
    },
    fr: {
      letter: c => `Écris la lettre ${c} ! Suis les points.`, digit: w => `Écris le chiffre ${w} !`,
      doneL: c => `${c} !`, tut: 'Pars du point vert et suis le chemin avec ton doigt !',
    },
    de: {
      letter: c => `Schreib das ${c}! Folge den Punkten.`, digit: w => `Schreib die Zahl ${w}!`,
      doneL: c => `${c}!`, tut: 'Fang beim grünen Punkt an und folge dem Weg mit dem Finger!',
    },
    en: {
      letter: c => `Write the letter ${c}! Follow the dots.`, digit: w => `Write the number ${w}!`,
      doneL: c => `${c}!`, tut: 'Start at the green dot and follow the path with your finger!',
    },
    es: {
      letter: c => `¡Escribe la ${c}! Sigue los puntos.`, digit: w => `¡Escribe el número ${w}!`,
      doneL: c => `¡${c}!`, tut: '¡Empieza en el punto verde y sigue el camino con el dedo!',
    },
  };
  const ROUND = 5;
  /* livello 1: lettere del nome + 1-3; livello 2: vocali, qualche consonante, 0-5; livello 3: tutto */
  const poolFor = lv => {
    const name = [...new Set(App.NAME.toUpperCase().replace(/[^A-Z]/g, ''))];
    if (lv <= 1) return [...name, '1', '2', '3'];
    if (lv === 2) return [...new Set([...name, 'A', 'E', 'I', 'O', 'U', 'M', 'P', 'S', 'T', '0', '1', '2', '3', '4', '5'])];
    return Object.keys(SHAPES);
  };
  /* punti di controllo lungo un tratto, circa ogni 7 unità */
  function resample(pts) {
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(d / 7));
      for (let k = 1; k <= n; k++) out.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
    }
    return out;
  }
  const poly = pts => pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');

  App.registerGame({
    id: 'scrivi', short: 'Scrivi', icon: '✏️',
    title: { fr: 'Écris avec le doigt', it: 'Scrivi con il dito', de: 'Schreib mit dem Finger', en: 'Write with your finger', es: 'Escribe con el dedo' },
    phrases: l => {
      const T = TX[l];
      const out = [T.tut];
      Object.keys(SHAPES).forEach(c => {
        if (isDigit(c)) out.push(T.digit(App.NUM[l][+c]), App.excl(App.NUM[l][+c], l));
        else out.push(T.letter(c), T.doneL(c));
      });
      return out;
    },
    start({ stage, addPill, setHelp }) {
      let alive = true;
      let lv = App.level('scrivi');
      let good = 0;
      let lastQ = '';
      let lastC = null;
      const pill = addPill(`⭐ 0/${ROUND}`);
      stage.style.background = 'linear-gradient(180deg,#eef7ff 0%,#fff 60%)';
      const board = h('div', { class: 'wr-board' });
      const prompt = h('div', { class: 'prompt wr-prompt' });
      stage.append(prompt, board);
      const steps = () => [{ text: TX[App.lang].tut, icon: '✏️', action: 'tap', at: () => board.querySelector('.wr-start'), cap: 'top' }];
      setHelp(() => App.tutorial(steps()).then(() => alive && say(lastQ)));

      function item() {
        if (!alive) return;
        const l = App.nextLang(), T = TX[l];
        const pool = poolFor(lv).filter(c => c !== lastC);
        const c = pool[Math.floor(Math.random() * pool.length)];
        lastC = c;
        const strokes = SHAPES[c].map(resample);
        prompt.innerHTML = '';
        prompt.append(h('b', {}, c));
        lastQ = isDigit(c) ? T.digit(App.NUM[l][+c]) : T.letter(c);
        board.innerHTML = `<svg viewBox="-8 -8 116 116" width="100%" height="100%">
          <g class="wr-guide">${SHAPES[c].map(s => `<polyline points="${poly(s)}"/>`).join('')}</g>
          <g class="wr-dots">${strokes.map(s => s.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.4"/>`).join('')).join('')}</g>
          <g class="wr-done"></g><polyline class="wr-ink" points=""/>
          <circle class="wr-hint" r="4"/><circle class="wr-start" r="6.5"/><text class="wr-num" text-anchor="middle" dy="3.5">1</text></svg>`;
        const svg = board.querySelector('svg');
        const ink = svg.querySelector('.wr-ink'), doneG = svg.querySelector('.wr-done');
        const startDot = svg.querySelector('.wr-start'), num = svg.querySelector('.wr-num'), hint = svg.querySelector('.wr-hint');
        let si = 0, idx = 0, trail = [], drawing = false, strayed = false, finished = false, pid = null;
        const setStart = () => {
          const [x, y] = strokes[si][0];
          startDot.setAttribute('cx', x); startDot.setAttribute('cy', y);
          num.setAttribute('x', x); num.setAttribute('y', y); num.textContent = si + 1;
        };
        setStart();
        /* puntino guida che mostra il verso del tratto */
        let hintT = 0, raf = 0;
        const hintLoop = () => {
          if (!alive || finished) return;
          const s = strokes[si];
          hintT = (hintT + 0.35) % (s.length + 12);
          const p = s[Math.min(s.length - 1, Math.floor(hintT))];
          hint.setAttribute('cx', p[0]); hint.setAttribute('cy', p[1]);
          hint.style.opacity = drawing || hintT >= s.length ? 0 : 1;
          raf = requestAnimationFrame(hintLoop);
        };
        raf = requestAnimationFrame(hintLoop);
        const toBox = e => {
          const r = svg.getBoundingClientRect();
          return [(e.clientX - r.left) / r.width * 116 - 8, (e.clientY - r.top) / r.height * 116 - 8];
        };
        const near = (p, q, tol) => Math.hypot(p[0] - q[0], p[1] - q[1]) < tol;
        svg.addEventListener('pointerdown', e => {
          if (finished || drawing) return;
          e.preventDefault();
          try { svg.setPointerCapture(e.pointerId); } catch (err) { /* dito non più attivo */ }
          const p = toBox(e);
          const s = strokes[si];
          if (idx === 0 && !near(p, s[0], 16)) { sfx.tap(); startDot.classList.remove('pulse'); void startDot.offsetWidth; startDot.classList.add('pulse'); return; }
          drawing = true;
          pid = e.pointerId;
          trail = trail.length ? trail : [s[0]];
        });
        svg.addEventListener('pointermove', e => {
          if (!drawing || finished || e.pointerId !== pid) return;
          const p = toBox(e);
          const s = strokes[si];
          /* avanza sui punti di controllo nell'ordine (può saltarne al massimo 2) */
          for (let k = idx + 1; k <= Math.min(idx + 3, s.length - 1); k++) {
            if (near(p, s[k], 13)) { idx = k; break; }
          }
          const off = Math.min(...s.slice(Math.max(0, idx - 1), idx + 4).map(q => Math.hypot(p[0] - q[0], p[1] - q[1])));
          if (off > 26 && !strayed) { strayed = true; }
          trail.push(off < 20 ? p : s[idx]);
          ink.setAttribute('points', poly(trail));
          if (Math.random() < .12) App.glitter(e.clientX, e.clientY, 3);
          if (idx >= s.length - 1) strokeDone();
        });
        const lift = e => { if (e.pointerId === pid) drawing = false; };
        svg.addEventListener('pointerup', lift);
        svg.addEventListener('pointercancel', lift);

        async function strokeDone() {
          drawing = false;
          sfx.pop();
          doneG.insertAdjacentHTML('beforeend', `<polyline points="${poly(strokes[si])}"/>`);
          ink.setAttribute('points', '');
          trail = []; idx = 0; si++;
          if (si < strokes.length) { setStart(); return; }
          finished = true;
          cancelAnimationFrame(raf);
          startDot.style.display = 'none'; num.style.display = 'none'; hint.style.display = 'none';
          svg.classList.add('wr-complete');
          sfx.ding();
          App.track('scrittura', null, !strayed);
          const r = board.getBoundingClientRect();
          App.glitter(r.left + r.width / 2, r.top + r.height / 2, 30);
          App.addStars(1, r.left + r.width / 2, r.top + 20);
          await say(isDigit(c) ? App.excl(App.NUM[l][+c], l) : T.doneL(c), { lang: l });
          if (!alive) return;
          await App.praise();
          if (!alive) return;
          good++;
          pill.textContent = `⭐ ${good}/${ROUND}`;
          if (good >= ROUND) {
            await App.reward();
            if (!alive) return;
            good = 0; pill.textContent = `⭐ 0/${ROUND}`;
            if (lv < 3) { lv++; App.levelUp('scrivi', lv); }
          }
          await wait(300);
          item();
        }
        App.intro('scrivi', steps()).then(() => alive && say(lastQ, { lang: l }));
      }

      requestAnimationFrame(item);
      return () => { alive = false; };
    },
  });
})();
