/* Sopra o sotto? — orientamento nello spazio: trascinare un giocattolo sopra, sotto, dentro o accanto a un oggetto. In 5 lingue. */
(() => {
  const { h, say, sfx, pick, shuffle, wait } = App;
  const OBJ = [
    { e: '🧸', it: "l'orsetto", fr: "l'ourson", de: 'den Teddy', en: 'the teddy', es: 'el osito' },
    { e: '⚽', it: 'la palla', fr: 'le ballon', de: 'den Ball', en: 'the ball', es: 'la pelota' },
    { e: '🐱', it: 'il gatto', fr: 'le chat', de: 'die Katze', en: 'the cat', es: 'el gato' },
  ];
  /* it: the / a (preposizione articolata), fr: the / de, de: accusativo, es: de */
  /* surf = altezza (in frazione dell'immagine) del piano su cui si appoggia: sedile, materasso */
  const REF = [
    { id: 'sedia', e: '🪑', surf: .52, pos: ['on', 'under', 'next'], it: ['la sedia', 'alla sedia'], fr: ['la chaise', 'de la chaise'], de: 'den Stuhl', en: 'the chair', es: 'de la silla' },
    { id: 'letto', e: '🛏️', surf: .5, pos: ['on', 'under', 'next'], it: ['il letto', 'al letto'], fr: ['le lit', 'du lit'], de: 'das Bett', en: 'the bed', es: 'de la cama' },
    { id: 'scatola', e: '📦', surf: .2, pos: ['in', 'on', 'next'], box: true, it: ['la scatola', 'alla scatola'], fr: ['la boîte', 'de la boîte'], de: 'die Kiste', en: 'the box', es: 'de la caja' },
    { id: 'cestino', e: '🧺', surf: .25, pos: ['in', 'next'], box: true, it: ['il cestino', 'al cestino'], fr: ['le panier', 'du panier'], de: 'den Korb', en: 'the basket', es: 'del cesto' },
  ];
  const PUT = {
    it: (o, r, p) => `Metti ${o.it} ${{ on: 'sopra ' + r.it[0], under: 'sotto ' + r.it[0], in: 'dentro ' + r.it[0], next: 'accanto ' + r.it[1] }[p]}!`,
    fr: (o, r, p) => `Mets ${o.fr} ${{ on: 'sur ' + r.fr[0], under: 'sous ' + r.fr[0], in: 'dans ' + r.fr[0], next: 'à côté ' + r.fr[1] }[p]} !`,
    de: (o, r, p) => `Leg ${o.de} ${{ on: 'auf', under: 'unter', in: 'in', next: 'neben' }[p]} ${r.de}!`,
    en: (o, r, p) => `Put ${o.en} ${{ on: 'on', under: 'under', in: 'in', next: 'next to' }[p]} ${r.en}!`,
    es: (o, r, p) => `¡Pon ${o.es} ${{ on: 'encima', under: 'debajo', in: 'dentro', next: 'al lado' }[p]} ${r.es}!`,
  };
  const TX = {
    it: { pos: { on: 'Sopra!', under: 'Sotto!', in: 'Dentro!', next: 'Accanto!' }, no: 'Non proprio! Ascolta di nuovo.',
      tut: ['Ascolta dove mettere il giocattolo…', 'Trascinalo con il dito nel posto giusto!'] },
    fr: { pos: { on: 'Dessus !', under: 'Dessous !', in: 'Dedans !', next: 'À côté !' }, no: 'Pas tout à fait ! Écoute encore.',
      tut: ['Écoute où mettre le jouet…', 'Fais-le glisser avec ton doigt à la bonne place !'] },
    de: { pos: { on: 'Obendrauf!', under: 'Darunter!', in: 'Hinein!', next: 'Daneben!' }, no: 'Nicht ganz! Hör nochmal zu.',
      tut: ['Hör zu, wohin das Spielzeug soll…', 'Zieh es mit dem Finger an die richtige Stelle!'] },
    en: { pos: { on: 'On top!', under: 'Under!', in: 'Inside!', next: 'Next to it!' }, no: 'Not quite! Listen again.',
      tut: ['Listen to where the toy goes…', 'Drag it with your finger to the right place!'] },
    es: { pos: { on: '¡Encima!', under: '¡Debajo!', in: '¡Dentro!', next: '¡Al lado!' }, no: '¡Casi! Escucha otra vez.',
      tut: ['Escucha dónde poner el juguete…', '¡Arrástralo con el dedo al sitio correcto!'] },
  };
  const LEVEL_POS = [null, ['on', 'under'], ['on', 'under', 'in'], ['on', 'under', 'in', 'next']];
  const ROUND = 5;

  App.registerGame({
    id: 'spazio', short: 'Spazio', icon: '🧸',
    title: { fr: 'Dessus ou dessous ?', it: 'Sopra o sotto?', de: 'Oben oder unten?', en: 'On or under?', es: '¿Encima o debajo?' },
    phrases: l => {
      const T = TX[l];
      const out = [T.no, ...T.tut, ...Object.values(T.pos)];
      OBJ.forEach(o => REF.forEach(r => r.pos.forEach(p => out.push(PUT[l](o, r, p)))));
      return out;
    },
    start({ stage, addPill, setHelp }) {
      let alive = true;
      let lv = App.level('spazio');
      let good = 0;
      let lastQ = '', lastL = 'it';
      let lastSteps = [];
      const pill = addPill(`⭐ 0/${ROUND}`);
      stage.style.background = 'linear-gradient(180deg,#fff7e6 0%,#fff 62%,#f1e4d0 62%,#e9d6bb 100%)';
      setHelp(() => App.tutorial(lastSteps).then(() => alive && say(lastQ, { lang: lastL })));

      function round() {
        if (!alive) return;
        [...stage.children].forEach(c => c.remove());
        const l = App.nextLang(), T = TX[l];
        const allowed = LEVEL_POS[Math.min(lv, 3)];
        const choices = [];
        REF.filter(r => lv > 1 || r.id === 'sedia').forEach(r => r.pos.forEach(p => { if (allowed.includes(p)) choices.push([r, p]); }));
        const [ref, pos] = pick(choices);
        const obj = pick(OBJ);
        const q = PUT[l](obj, ref, pos);
        lastQ = q; lastL = l;
        const refEl = h('div', { class: 'sp-ref' }, ref.e);
        const toy = h('div', { class: 'sp-toy' }, obj.e);
        const promptEl = h('button', { class: 'prompt sp-prompt', onclick: () => { sfx.tap(); say(q, { lang: l }); } }, '🔊 ', h('span', {}, obj.e), ' ➜ ', h('span', {}, ref.e));
        stage.append(promptEl, refEl, toy);
        let S = stage.getBoundingClientRect();
        const homeAt = () => { S = stage.getBoundingClientRect(); return { x: S.width * .16, y: S.height * .8 }; };
        const placeToy = (x, y) => { toy.style.left = `${x}px`; toy.style.top = `${y}px`; };
        const goHome = () => { const hp = homeAt(); placeToy(hp.x, hp.y); };
        goHome();

        /* dove si trova il giocattolo rispetto all'oggetto */
        function where() {
          const R = refEl.getBoundingClientRect(), t = toy.getBoundingClientRect();
          const w = R.width, hh = R.height;
          const L = R.left + w * .15, Rr = R.right - w * .15, Top = R.top, Bot = R.bottom;
          const surfY = Top + hh * ref.surf;
          const cx = t.left + t.width / 2, cy = t.top + t.height / 2;
          const inX = cx > L && cx < Rr;
          if (ref.box && inX && cy > surfY && cy < Bot + t.height * .2) return 'in';
          if (inX && cy <= surfY + hh * .08 && cy > Top - hh * .9) return 'on';
          if (!ref.box && inX && cy > surfY + hh * .08 && cy < Bot + t.height * .7) return 'under';
          if (!inX && Math.abs(cx - (L + Rr) / 2) < w * 1.3 && cy > surfY - t.height * .3 && cy < Bot + t.height * .7) return 'next';
          return null;
        }
        function snap(p) {
          const R = refEl.getBoundingClientRect(), t = toy.getBoundingClientRect();
          const cx = R.left + R.width / 2 - S.left, tw = t.width, th = t.height;
          const spots = {
            on: [cx - tw / 2, R.top - S.top + R.height * ref.surf - th * .85],
            under: [cx - tw / 2, R.bottom - S.top - th * .8],
            in: [cx - tw / 2, R.top - S.top + R.height * ref.surf - th * .45],
            next: [R.right - S.left + 4, R.bottom - S.top - th],
          };
          toy.classList.add('back');
          toy.classList.toggle('behind', p === 'in');
          toy.classList.toggle('small', p === 'under');
          placeToy(...spots[p]);
        }

        let ox = 0, oy = 0, dragging = false, first = true, done = false, pid = null;
        toy.addEventListener('pointerdown', e => {
          if (done || dragging) return;
          pid = e.pointerId;
          e.preventDefault();
          try { toy.setPointerCapture(e.pointerId); } catch (err) { /* dito non più attivo */ }
          const r = toy.getBoundingClientRect();
          ox = e.clientX - r.left; oy = e.clientY - r.top;
          dragging = true;
          toy.classList.remove('back', 'behind', 'small');
          toy.classList.add('drag');
          sfx.tap();
        });
        toy.addEventListener('pointermove', e => {
          if (!dragging || e.pointerId !== pid) return;
          placeToy(e.clientX - S.left - ox, e.clientY - S.top - oy);
        });
        const drop = async e => {
          if (!dragging || (e && e.pointerId !== pid)) return;
          dragging = false;
          toy.classList.remove('drag');
          const w = where();
          if (!w) { toy.classList.add('back'); goHome(); return; }
          if (first) { App.track('spazio', null, w === pos); first = false; }
          if (w === pos) {
            done = true;
            snap(pos);
            sfx.ding();
            const r = toy.getBoundingClientRect();
            App.glitter(r.left + r.width / 2, r.top + r.height / 2, 14);
            await say(T.pos[pos], { lang: l });
            if (!alive) return;
            App.addStars(1, r.left + r.width / 2, r.top);
            await App.praise();
            if (!alive) return;
            good++;
            pill.textContent = `⭐ ${good}/${ROUND}`;
            if (good >= ROUND) {
              await App.reward();
              if (!alive) return;
              good = 0; pill.textContent = `⭐ 0/${ROUND}`;
              if (lv < 3) { lv++; App.levelUp('spazio', lv); }
            }
            await wait(300);
            round();
          } else {
            sfx.boing();
            say(T.pos[w], { lang: l }).then(() => alive && say(T.no, { lang: l, queue: true })).then(() => alive && say(q, { lang: l, queue: true }));
            setTimeout(() => { if (!alive || done) return; toy.classList.add('back'); goHome(); }, 900);
          }
        };
        toy.addEventListener('pointerup', drop);
        toy.addEventListener('pointercancel', drop);

        const target = () => {
          const R = refEl.getBoundingClientRect();
          const cx = R.left + R.width / 2;
          return { on: { x: cx, y: R.top + R.height * .05 }, under: { x: cx, y: R.bottom - 20 }, in: { x: cx, y: R.top + R.height * .55 }, next: { x: R.right + 40, y: R.bottom - 40 } }[pos];
        };
        lastSteps = [
          { text: T.tut[0], icon: '👂', action: 'tap', at: () => promptEl, cap: 'top' },
          { text: T.tut[1], icon: '✋', action: 'drag', at: () => toy, to: target, cap: 'top' },
        ];
        App.intro('spazio', lastSteps).then(() => alive && say(q, { lang: l }));
      }

      requestAnimationFrame(round);
      return () => { alive = false; };
    },
  });
})();
