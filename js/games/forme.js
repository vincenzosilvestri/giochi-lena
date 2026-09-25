/* Forme e Colori — incastri da trascinare e sequenze da completare. */
(() => {
  const { h, say, sfx, pick, shuffle, wait } = App;

  const star = (() => {
    const p = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 20 : 47;
      p.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(53 + r * Math.sin(a)).toFixed(1)}`);
    }
    return `<polygon points="${p.join(' ')}"/>`;
  })();
  const SHAPES = {
    cerchio: { f: 0, el: '<circle cx="50" cy="50" r="42"/>' },
    quadrato: { f: 0, el: '<rect x="10" y="10" width="80" height="80" rx="8"/>' },
    triangolo: { f: 0, el: '<polygon points="50,8 94,90 6,90"/>' },
    stella: { f: 1, el: star },
    cuore: { f: 0, el: '<path d="M50 90 C22 68 5 50 5 31 C5 17 16 7 29 7 C39 7 46 13 50 21 C54 13 61 7 71 7 C84 7 95 17 95 31 C95 50 78 68 50 90Z"/>' },
    rombo: { f: 0, el: '<polygon points="50,4 94,50 50,96 6,50"/>' },
  };
  const COLORS = [
    { c: '#ff5a5a', m: 'rosso', f: 'rossa' }, { c: '#f5c400', m: 'giallo', f: 'gialla' },
    { c: '#3cc45c', m: 'verde', f: 'verde' }, { c: '#4a6cff', m: 'blu', f: 'blu' },
    { c: '#ff9f40', m: 'arancione', f: 'arancione' }, { c: '#9b5cff', m: 'viola', f: 'viola' },
    { c: '#ff6fa8', m: 'rosa', f: 'rosa' },
  ];
  const LEVELS = [null, { n: 3, color: false }, { n: 4, color: false }, { n: 4, color: true }, { n: 5, color: true }];
  const PATTERNS = [null, ['AB'], ['AB', 'AAB'], ['AB', 'AAB', 'ABC', 'ABB'], ['AAB', 'ABC', 'ABB', 'AABB']];
  const ROUND = 3;
  const TUT = ['Trascina la forma nel posto uguale!', 'Attenta: anche il colore deve essere uguale!',
    'Guarda la fila: le forme si ripetono.', 'Tocca quella che viene dopo!'];

  const name = it => `${it.shape[0].toUpperCase()}${it.shape.slice(1)} ${SHAPES[it.shape].f ? it.color.f : it.color.m}`;
  function svg(shape, fill, stroke = 'none', dash = '') {
    return `<svg viewBox="-4 -4 108 108" width="100%" height="100%"><g fill="${fill}" stroke="${stroke}" stroke-width="5" stroke-dasharray="${dash}" stroke-linejoin="round">${SHAPES[shape].el}</g></svg>`;
  }

  App.registerGame({
    id: 'forme', title: 'Forme e Colori', short: 'Forme', icon: '🔷',
    phrases: () => {
      const out = [...TUT, 'Metti ogni forma al suo posto. Attenta ai colori!', 'Trascina ogni forma nel suo posto!',
        'Guarda il colore!', 'Non entra! Prova un altro posto.', 'Cosa viene dopo?', 'Guarda bene la fila! Riprova.'];
      Object.keys(SHAPES).forEach(shape => COLORS.forEach(color => out.push(name({ shape, color }))));
      return out;
    },
    start({ stage, addPill, setHelp }) {
      let alive = true;
      let lastQ = '';
      let lastSteps = [];
      function ask(text, tutId, steps) {
        lastQ = text;
        lastSteps = steps;
        App.intro(tutId, steps).then(() => alive && say(text));
      }
      setHelp(() => App.tutorial(lastSteps).then(() => alive && say(lastQ)));
      let lv = App.level('forme');
      let done = 0;
      const pill = addPill(`⭐ 0/${ROUND}`);
      stage.style.background = 'linear-gradient(180deg,#f3ecff 0%,#fff 60%)';

      async function roundDone() {
        done++;
        pill.textContent = `⭐ ${done}/${ROUND}`;
        await App.praise();
        if (!alive) return;
        if (done >= ROUND) {
          await App.reward();
          if (!alive) return;
          done = 0; pill.textContent = `⭐ 0/${ROUND}`;
          if (lv < LEVELS.length - 1) { lv++; App.setLevel('forme', lv); }
        }
        next();
      }

      function next() {
        if (!alive) return;
        [...stage.children].forEach(c => c.remove());
        if (done === ROUND - 1) sequence(); else puzzle();
      }

      /* --- incastri --- */
      function puzzle() {
        const L = LEVELS[Math.min(lv, LEVELS.length - 1)];
        const shapes = shuffle(Object.keys(SHAPES));
        let items;
        if (L.color) {
          const twin = shapes[0];
          const cols = shuffle(COLORS);
          items = [{ shape: twin, color: cols[0] }, { shape: twin, color: cols[1] }]
            .concat(shapes.slice(1, L.n - 1).map((s, i) => ({ shape: s, color: cols[i + 2] })));
        } else {
          const cols = shuffle(COLORS);
          items = shapes.slice(0, L.n).map((s, i) => ({ shape: s, color: cols[i] }));
        }
        items.forEach((it, i) => { it.id = i; });

        const holesBox = h('div', { class: 'shape-holes' });
        const holes = shuffle(items).map(it => {
          const el = h('div', {
            class: 'hole',
            html: L.color ? svg(it.shape, it.color.c + '33', it.color.c, '8 6') : svg(it.shape, '#e9e3f0', '#b9adc7', '8 6'),
          });
          holesBox.append(el);
          return { it, el, filled: false };
        });
        stage.append(h('div', { class: 'tray' }), holesBox);

        const S = stage.getBoundingClientRect();
        const tray = stage.querySelector('.tray').getBoundingClientRect();
        const perRow = items.length > 3 ? Math.ceil(items.length / 2) : items.length;
        const rowsN = Math.ceil(items.length / perRow);
        let left = items.length;
        const pieces = [];

        shuffle(items).forEach((it, i) => {
          const row = Math.floor(i / perRow), col = i % perRow;
          const inRow = Math.min(perRow, items.length - row * perRow);
          const hx = tray.left - S.left + (tray.width / inRow) * (col + .5) - 45;
          const hy = tray.top - S.top + (tray.height / rowsN) * (row + .5) - 45;
          const p = h('div', { class: 'piece', style: `left:${hx}px;top:${hy}px`, html: svg(it.shape, it.color.c, '#fff', '') });
          stage.append(p);
          pieces.push({ el: p, it });
          let ox = 0, oy = 0, dragging = false;
          p.addEventListener('pointerdown', e => {
            if (p.dataset.done) return;
            e.preventDefault();
            p.setPointerCapture(e.pointerId);
            p.classList.remove('back');
            p.classList.add('drag');
            const r = p.getBoundingClientRect();
            ox = e.clientX - r.left; oy = e.clientY - r.top;
            dragging = true;
            sfx.tap();
            say(name(it));
          });
          p.addEventListener('pointermove', e => {
            if (!dragging) return;
            p.style.left = `${e.clientX - S.left - ox}px`;
            p.style.top = `${e.clientY - S.top - oy}px`;
          });
          const drop = () => {
            if (!dragging) return;
            dragging = false;
            p.classList.remove('drag');
            const r = p.getBoundingClientRect();
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            let near = null;
            for (const ho of holes) {
              if (ho.filled) continue;
              const hr = ho.el.getBoundingClientRect();
              const d = Math.hypot(cx - (hr.left + hr.width / 2), cy - (hr.top + hr.height / 2));
              if (d < 70 && (!near || d < near.d)) near = { ho, hr, d };
            }
            const fits = ho => ho.it.shape === it.shape && (!L.color || ho.it.color === it.color);
            const target = near && (fits(near.ho) ? near.ho : holes.find(ho => !ho.filled && fits(ho) &&
              Math.hypot(cx - (ho.el.getBoundingClientRect().left + 48), cy - (ho.el.getBoundingClientRect().top + 48)) < 70));
            if (target) {
              const hr = target.el.getBoundingClientRect();
              target.filled = true;
              p.dataset.done = '1';
              p.classList.add('back');
              p.style.left = `${hr.left - S.left + (hr.width - 90) / 2}px`;
              p.style.top = `${hr.top - S.top + (hr.height - 90) / 2}px`;
              sfx.ding();
              App.floatAt(hr.left + hr.width / 2, hr.top, '✨');
              left--;
              if (!left) setTimeout(() => alive && roundDone(), 500);
            } else {
              if (near) {
                sfx.boing();
                say(L.color && near.ho.it.shape === it.shape ? 'Guarda il colore!' : 'Non entra! Prova un altro posto.');
              }
              p.classList.add('back');
              p.style.left = `${hx}px`; p.style.top = `${hy}px`;
            }
          };
          p.addEventListener('pointerup', drop);
          p.addEventListener('pointercancel', drop);
        });
        const firstPiece = () => pieces.find(p => !p.el.dataset.done);
        const holeFor = () => { const fp = firstPiece(); return fp && holes.find(ho => ho.it === fp.it).el; };
        const steps = [{ text: TUT[0], icon: '✋', action: 'drag', at: () => (firstPiece() || {}).el, to: holeFor, cap: 'top' }];
        if (L.color) steps.push({ text: TUT[1], icon: '🎨', action: 'tap', at: holeFor, cap: 'top' });
        ask(L.color ? 'Metti ogni forma al suo posto. Attenta ai colori!' : 'Trascina ogni forma nel suo posto!',
          L.color ? 'forme-colori' : 'forme', steps);
      }

      /* --- sequenze --- */
      function sequence() {
        const pat = pick(PATTERNS[Math.min(lv, PATTERNS.length - 1)]);
        const kinds = [...new Set(pat)];
        const cols = shuffle(COLORS);
        const sameShape = lv <= 2 ? pick(Object.keys(SHAPES)) : null;
        const shp = shuffle(Object.keys(SHAPES));
        const unit = {};
        kinds.forEach((k, i) => { unit[k] = { shape: sameShape || shp[i], color: cols[i] }; });
        const len = Math.max(5, pat.length * 2 + 1);
        const seq = [...Array(len + 1).keys()].map(i => unit[pat[i % pat.length]]);
        const answer = seq.pop();
        const row = h('div', { class: 'seq-row' }, seq.map(u => h('div', { class: 'it', html: svg(u.shape, u.color.c) })), h('div', { class: 'q' }, '?'));
        const wrong = [unit[kinds.find(k => unit[k] !== answer)] || null, { shape: answer.shape, color: cols[kinds.length] }, { shape: shp.find(s => s !== answer.shape), color: answer.color }]
          .filter(Boolean).filter(u => u !== answer).slice(0, 2);
        const choices = h('div', { class: 'seq-choices' });
        let locked = false;
        shuffle([answer].concat(wrong)).forEach(u => {
          const b = h('button', { html: svg(u.shape, u.color.c) });
          b.onclick = async () => {
            if (locked) return;
            if (u === answer) {
              locked = true;
              row.querySelector('.q').innerHTML = svg(u.shape, u.color.c);
              row.querySelector('.q').style.border = '0';
              sfx.ding();
              await roundDone();
            } else {
              sfx.boing();
              b.classList.add('shake');
              setTimeout(() => b.classList.remove('shake'), 500);
              say('Guarda bene la fila! Riprova.');
            }
          };
          choices.append(b);
        });
        stage.append(h('div', { class: 'prompt' }, 'Cosa viene dopo? 🤔'), row, choices);
        ask('Cosa viene dopo?', 'sequenze', [
          { text: TUT[2], icon: '👀', action: 'swipe', at: () => row.firstElementChild, to: () => row.querySelector('.q') },
          { text: TUT[3], icon: '❓', action: 'tap', at: () => choices.children[1], cap: 'top' },
        ]);
      }

      requestAnimationFrame(next);
      return () => { alive = false; };
    },
  });
})();
