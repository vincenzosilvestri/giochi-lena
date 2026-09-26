/* Forme e Colori / Formes et couleurs — incastri da trascinare e sequenze da completare. Bilingue FR/IT. */
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
    cerchio: { f: 0, fr: ['Cercle', 0], de: ['Kreis', 'm'], en: 'circle', es: ['Círculo', 0], el: '<circle cx="50" cy="50" r="42"/>' },
    quadrato: { f: 0, fr: ['Carré', 0], de: ['Quadrat', 'n'], en: 'square', es: ['Cuadrado', 0], el: '<rect x="10" y="10" width="80" height="80" rx="8"/>' },
    triangolo: { f: 0, fr: ['Triangle', 0], de: ['Dreieck', 'n'], en: 'triangle', es: ['Triángulo', 0], el: '<polygon points="50,8 94,90 6,90"/>' },
    stella: { f: 1, fr: ['Étoile', 1], de: ['Stern', 'm'], en: 'star', es: ['Estrella', 1], el: star },
    cuore: { f: 0, fr: ['Cœur', 0], de: ['Herz', 'n'], en: 'heart', es: ['Corazón', 0], el: '<path d="M50 90 C22 68 5 50 5 31 C5 17 16 7 29 7 C39 7 46 13 50 21 C54 13 61 7 71 7 C84 7 95 17 95 31 C95 50 78 68 50 90Z"/>' },
    rombo: { f: 0, fr: ['Losange', 0], de: ['Raute', 'f'], en: 'diamond', es: ['Rombo', 0], el: '<polygon points="50,4 94,50 50,96 6,50"/>' },
  };
  const COLORS = [
    { c: '#ff5a5a', m: 'rosso', f: 'rossa', fr: ['rouge', 'rouge'], de: { m: 'Roter', f: 'Rote', n: 'Rotes' }, en: 'Red', es: ['rojo', 'roja'] }, { c: '#f5c400', m: 'giallo', f: 'gialla', fr: ['jaune', 'jaune'], de: { m: 'Gelber', f: 'Gelbe', n: 'Gelbes' }, en: 'Yellow', es: ['amarillo', 'amarilla'] },
    { c: '#3cc45c', m: 'verde', f: 'verde', fr: ['vert', 'verte'], de: { m: 'Grüner', f: 'Grüne', n: 'Grünes' }, en: 'Green', es: ['verde', 'verde'] }, { c: '#4a6cff', m: 'blu', f: 'blu', fr: ['bleu', 'bleue'], de: { m: 'Blauer', f: 'Blaue', n: 'Blaues' }, en: 'Blue', es: ['azul', 'azul'] },
    { c: '#ff9f40', m: 'arancione', f: 'arancione', fr: ['orange', 'orange'], de: { m: 'Orangefarbener', f: 'Orangefarbene', n: 'Orangefarbenes' }, en: 'Orange', es: ['naranja', 'naranja'] }, { c: '#9b5cff', m: 'viola', f: 'viola', fr: ['violet', 'violette'], de: { m: 'Lila', f: 'Lila', n: 'Lila' }, en: 'Purple', es: ['morado', 'morada'] },
    { c: '#ff6fa8', m: 'rosa', f: 'rosa', fr: ['rose', 'rose'], de: { m: 'Rosa', f: 'Rosa', n: 'Rosa' }, en: 'Pink', es: ['rosa', 'rosa'] },
  ];
  const LEVELS = [null, { n: 3, color: false }, { n: 4, color: false }, { n: 4, color: true }, { n: 5, color: true }];
  const PATTERNS = [null, ['AB'], ['AB', 'AAB'], ['AB', 'AAB', 'ABC', 'ABB'], ['AAB', 'ABC', 'ABB', 'AABB']];
  const ROUND = 3;
  const TX = {
    it: {
      tut: ['Trascina la forma nel posto uguale!', 'Attenta: anche il colore deve essere uguale!', 'Guarda la fila: cosa si ripete?', 'Tocca quella che viene dopo!'],
      putColor: 'Metti ogni forma al suo posto. Attenta ai colori!', put: 'Trascina ogni forma nel suo posto!',
      lookColor: 'Guarda il colore!', noFit: 'Non entra! Prova un altro posto.', next: 'Cosa viene dopo?', nextShow: 'Cosa viene dopo? 🤔',
      lookRow: 'Guarda bene la fila! Riprova.',
    },
    fr: {
      tut: ['Fais glisser la forme à la bonne place !', 'Attention : la couleur aussi doit être pareille !', "Regarde la suite : qu'est-ce qui se répète ?", 'Touche celle qui vient après !'],
      putColor: 'Mets chaque forme à sa place. Attention aux couleurs !', put: 'Fais glisser chaque forme à sa place !',
      lookColor: 'Regarde la couleur !', noFit: 'Ça ne rentre pas ! Essaie une autre place.', next: "Qu'est-ce qui vient après ?", nextShow: 'Et après ? 🤔',
      lookRow: 'Regarde bien la suite ! Réessaie.',
    },
  };
  Object.assign(TX, {
    de: {
      tut: ['Zieh die Form an den passenden Platz!', 'Achtung: Auch die Farbe muss gleich sein!', 'Schau dir die Reihe an: Was wiederholt sich?', 'Tippe auf die, die als Nächstes kommt!'],
      putColor: 'Leg jede Form an ihren Platz. Achte auf die Farben!', put: 'Zieh jede Form an ihren Platz!',
      lookColor: 'Schau dir die Farbe an!', noFit: 'Das passt nicht! Probier einen anderen Platz.', next: 'Was kommt als Nächstes?', nextShow: 'Was kommt dann? 🤔',
      lookRow: 'Schau dir die Reihe genau an! Versuch es nochmal.',
    },
    en: {
      tut: ['Drag the shape to the matching place!', 'Careful: the colour must match too!', 'Look at the row: what repeats?', 'Tap the one that comes next!'],
      putColor: 'Put each shape in its place. Watch the colours!', put: 'Drag each shape to its place!',
      lookColor: 'Look at the colour!', noFit: "It doesn't fit! Try another place.", next: 'What comes next?', nextShow: 'What comes next? 🤔',
      lookRow: 'Look carefully at the row! Try again.',
    },
    es: {
      tut: ['¡Arrastra la forma a su sitio!', 'Cuidado: ¡el color también tiene que ser igual!', 'Mira la fila: ¿qué se repite?', '¡Toca la que viene después!'],
      putColor: 'Pon cada forma en su sitio. ¡Fíjate en los colores!', put: '¡Arrastra cada forma a su sitio!',
      lookColor: '¡Mira el color!', noFit: '¡No cabe! Prueba otro sitio.', next: '¿Qué viene después?', nextShow: '¿Y después? 🤔',
      lookRow: '¡Mira bien la fila! Inténtalo otra vez.',
    },
  });
  const tx = () => TX[App.lang];
  /* nome di forma + colore, con l'accordo di genere di ogni lingua */
  const name = (it, l = App.lang) => {
    const S = SHAPES[it.shape], C = it.color;
    if (l === 'fr') return `${S.fr[0]} ${C.fr[S.fr[1]]}`;
    if (l === 'de') return `${C.de[S.de[1]]} ${S.de[0]}`;
    if (l === 'en') return `${C.en} ${S.en}`;
    if (l === 'es') return `${S.es[0]} ${C.es[S.es[1]]}`;
    return `${it.shape[0].toUpperCase()}${it.shape.slice(1)} ${S.f ? C.f : C.m}`;
  };
  function svg(shape, fill, stroke = 'none', dash = '') {
    return `<svg viewBox="-4 -4 108 108" width="100%" height="100%"><g fill="${fill}" stroke="${stroke}" stroke-width="5" stroke-dasharray="${dash}" stroke-linejoin="round">${SHAPES[shape].el}</g></svg>`;
  }

  App.registerGame({
    id: 'forme', title: { fr: 'Formes et couleurs', it: 'Forme e Colori', de: 'Formen und Farben', en: 'Shapes and colours', es: 'Formas y colores' }, short: 'Forme', icon: '🔷',
    phrases: l => {
      const T = TX[l];
      const out = [...T.tut, T.putColor, T.put, T.lookColor, T.noFit, T.next, T.lookRow];
      Object.keys(SHAPES).forEach(shape => COLORS.forEach(color => out.push(name({ shape, color }, l))));
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
        App.addStars(2);
        pill.textContent = `⭐ ${done}/${ROUND}`;
        await App.praise();
        if (!alive) return;
        if (done >= ROUND) {
          await App.reward();
          if (!alive) return;
          done = 0; pill.textContent = `⭐ 0/${ROUND}`;
          if (lv < LEVELS.length - 1) { lv++; App.levelUp('forme', lv); }
        }
        next();
      }

      function next() {
        if (!alive) return;
        [...stage.children].forEach(c => c.remove());
        App.nextLang();
        if (done === ROUND - 1) sequence(); else puzzle();
      }

      /* colori ben distinguibili: al massimo uno tra rosso, rosa e arancione */
      const WARM = ['#ff5a5a', '#ff6fa8', '#ff9f40'];
      const distinct = () => { let warm = 0; return shuffle(COLORS).filter(c => !WARM.includes(c.c) || warm++ === 0); };

      /* --- incastri --- */
      function puzzle() {
        const L = LEVELS[Math.min(lv, LEVELS.length - 1)];
        const shapes = shuffle(Object.keys(SHAPES));
        let items;
        if (L.color) {
          const twin = shapes[0];
          const cols = distinct();
          items = [{ shape: twin, color: cols[0] }, { shape: twin, color: cols[1] }]
            .concat(shapes.slice(1, L.n - 1).map((s, i) => ({ shape: s, color: cols[i + 2] })));
        } else {
          const cols = distinct();
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
        const P = Math.floor(Math.max(56, Math.min(90, tray.height / rowsN - 8, tray.width / perRow - 8)));
        let left = items.length;
        const pieces = [];

        shuffle(items).forEach((it, i) => {
          const row = Math.floor(i / perRow), col = i % perRow;
          const inRow = Math.min(perRow, items.length - row * perRow);
          const hx = tray.left - S.left + (tray.width / inRow) * (col + .5) - P / 2;
          const hy = tray.top - S.top + (tray.height / rowsN) * (row + .5) - P / 2;
          const p = h('div', { class: 'piece', style: `left:${hx}px;top:${hy}px;width:${P}px;height:${P}px`, html: svg(it.shape, it.color.c, '#fff', '') });
          stage.append(p);
          pieces.push({ el: p, it });
          let ox = 0, oy = 0, dragging = false, pid = null;
          p.addEventListener('pointerdown', e => {
            if (p.dataset.done || dragging) return;
            pid = e.pointerId;
            e.preventDefault();
            try { p.setPointerCapture(e.pointerId); } catch (err) { /* dito non più attivo */ }
            p.classList.remove('back');
            p.classList.add('drag');
            const r = p.getBoundingClientRect();
            ox = e.clientX - r.left; oy = e.clientY - r.top;
            dragging = true;
            sfx.tap();
            say(name(it));
          });
          p.addEventListener('pointermove', e => {
            if (!dragging || e.pointerId !== pid) return;
            p.style.left = `${e.clientX - S.left - ox}px`;
            p.style.top = `${e.clientY - S.top - oy}px`;
          });
          const drop = e => {
            if (!dragging || (e && e.pointerId !== pid)) return;
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
              p.style.left = `${hr.left - S.left + (hr.width - P) / 2}px`;
              p.style.top = `${hr.top - S.top + (hr.height - P) / 2}px`;
              sfx.ding();
              App.track('logica', null, true);
              App.floatAt(hr.left + hr.width / 2, hr.top, '✨');
              left--;
              if (!left) setTimeout(() => alive && roundDone(), 500);
            } else {
              if (near) {
                sfx.boing();
                App.track('logica', null, false);
                say(L.color && near.ho.it.shape === it.shape ? tx().lookColor : tx().noFit);
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
        const steps = [{ text: tx().tut[0], icon: '✋', action: 'drag', at: () => (firstPiece() || {}).el, to: holeFor, cap: 'top' }];
        if (L.color) steps.push({ text: tx().tut[1], icon: '🎨', action: 'tap', at: holeFor, cap: 'top' });
        ask(L.color ? tx().putColor : tx().put,
          L.color ? 'forme-colori' : 'forme', steps);
      }

      /* --- sequenze --- */
      function sequence() {
        const pat = pick(PATTERNS[Math.min(lv, PATTERNS.length - 1)]);
        const kinds = [...new Set(pat)];
        const cols = distinct();
        const sameShape = lv <= 2 ? pick(Object.keys(SHAPES)) : null;
        const shp = shuffle(Object.keys(SHAPES));
        const unit = {};
        kinds.forEach((k, i) => { unit[k] = { shape: sameShape || shp[i], color: cols[i] }; });
        const len = Math.max(5, pat.length * 2 + 1);
        const seq = [...Array(len + 1).keys()].map(i => unit[pat[i % pat.length]]);
        const answer = seq.pop();
        const row = h('div', { class: 'seq-row' }, seq.map(u => h('div', { class: 'it', html: svg(u.shape, u.color.c) })), h('div', { class: 'q' }, '?'));
        const itemSize = Math.floor(Math.min(58, (stage.clientWidth - 24 - 6 * seq.length) / (seq.length + 1)));
        row.style.setProperty('--it', `${itemSize}px`);
        const wrong = [unit[kinds.find(k => unit[k] !== answer)] || null, { shape: answer.shape, color: cols[kinds.length] }, { shape: shp.find(s => s !== answer.shape), color: answer.color }]
          .filter(Boolean).filter(u => u !== answer).slice(0, 2);
        const choices = h('div', { class: 'seq-choices' });
        let locked = false;
        let first = true, okBtn = null;
        shuffle([answer].concat(wrong)).forEach(u => {
          const b = h('button', { html: svg(u.shape, u.color.c) });
          if (u === answer) okBtn = b;
          b.onclick = async () => {
            if (locked) return;
            if (first) { App.track('logica', null, u === answer); first = false; }
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
              say(tx().lookRow);
            }
          };
          choices.append(b);
        });
        stage.append(h('div', { class: 'prompt' }, tx().nextShow), row, choices);
        ask(tx().next, 'sequenze', [
          { text: tx().tut[2], icon: '👀', action: 'swipe', at: () => row.firstElementChild, to: () => row.querySelector('.q') },
          { text: tx().tut[3], icon: '❓', action: 'tap', at: () => okBtn, cap: 'top' },
        ]);
      }

      requestAnimationFrame(next);
      return () => { alive = false; };
    },
  });
})();
