/* Memory — coppie di animali (con nome e verso) o di foto di famiglia. Bilingue FR/IT (una lingua per partita). */
(() => {
  const { h, say, sfx, shuffle, wait } = App;
  const ANIMALS = [
    { e: '🐮', it: ['Mucca', 'Muuu!'], fr: ['Vache', 'Meuh !'] },
    { e: '🐱', it: ['Gatto', 'Miao!'], fr: ['Chat', 'Miaou !'] },
    { e: '🐶', it: ['Cane', 'Bau bau!'], fr: ['Chien', 'Ouaf ouaf !'] },
    { e: '🐑', it: ['Pecora', 'Beee!'], fr: ['Mouton', 'Bêê !'] },
    { e: '🐷', it: ['Maiale', 'Oink oink!'], fr: ['Cochon', 'Groin groin !'] },
    { e: '🦆', it: ['Anatra', 'Qua qua!'], fr: ['Canard', 'Coin coin !'] },
    { e: '🐓', it: ['Gallo', 'Chicchirichì!'], fr: ['Coq', 'Cocorico !'] },
    { e: '🦁', it: ['Leone', 'Roaar!'], fr: ['Lion', 'Roaar !'] },
    { e: '🐴', it: ['Cavallo', 'Iiiiih!'], fr: ['Cheval', 'Hiii !'] },
    { e: '🐸', it: ['Rana', 'Cra cra!'], fr: ['Grenouille', 'Croâ croâ !'] },
    { e: '🐝', it: ['Ape', 'Bzzz!'], fr: ['Abeille', 'Bzzz !'] },
    { e: '🦉', it: ['Gufo', 'Uh uh!'], fr: ['Hibou', 'Hou hou !'] },
    { e: '🐘', it: ['Elefante', 'Pruuu!'], fr: ['Éléphant', 'Pouuu !'] },
    { e: '🐭', it: ['Topo', 'Squit squit!'], fr: ['Souris', 'Couic couic !'] },
  ];
  const PAIRS = [3, 3, 4, 6, 8];
  const COLS = { 3: 2, 4: 2, 6: 3, 8: 4 };
  const TX = {
    it: { tut: ['Tocca una carta per girarla.', 'Poi cerca quella uguale: se sono uguali restano girate!', 'Gira le carte e trova le coppie uguali!'],
      which: 'Vuoi giocare con gli animali o con la famiglia?', animals: 'Animali', family: 'Famiglia' },
    fr: { tut: ['Touche une carte pour la retourner.', 'Puis cherche la carte pareille : si elles sont pareilles, elles restent retournées !', 'Retourne les cartes et trouve les paires !'],
      which: 'Tu veux jouer avec les animaux ou avec la famille ?', animals: 'Animaux', family: 'Famille' },
  };
  const tx = () => TX[App.lang];
  const speakOf = (a, l) => `${a[l][0]}${l === 'fr' ? ' !' : '!'} ${a[l][1]}`;

  App.registerGame({
    id: 'memory', title: { fr: 'Memory des animaux', it: 'Memory degli Animali' }, short: 'Memory', icon: '🃏',
    phrases: l => [...TX[l].tut, TX[l].which, ...ANIMALS.map(a => speakOf(a, l))],
    start({ stage, addPill, setHelp }) {
      let alive = true;
      let lv = App.level('memory');
      let deck = 'animali';
      const steps = () => [
        { text: tx().tut[0], icon: '👆', action: 'tap', at: () => grid.children[0] },
        { text: tx().tut[1], icon: '🃏', action: 'tap', at: () => grid.children[grid.children.length - 1] },
      ];
      setHelp(() => App.tutorial(steps()));
      const pill = addPill('');
      const grid = h('div', { class: 'mem-grid' });

      function chooseDeck() {
        const photos = App.media.photos;
        App.nextLang();
        if (photos.length < 2) return board(true);
        const box = h('div', { class: 'choice-row' },
          h('button', { class: 'tile t1', onclick: () => { deck = 'animali'; box.remove(); sfx.pop(); board(true); } },
            h('div', { class: 'ico' }, '🐮🐷'), h('div', { class: 'lbl' }, tx().animals)),
          h('button', { class: 'tile t3', onclick: () => { deck = 'famiglia'; box.remove(); sfx.pop(); board(true); } },
            h('div', { class: 'ico' }, '👨‍👩‍👧'), h('div', { class: 'lbl' }, tx().family)));
        stage.append(box);
        say(tx().which);
      }

      function board(keepLang) {
        if (!alive) return;
        if (!keepLang) App.nextLang();
        const l = App.lang;
        stage.append(grid);
        grid.innerHTML = '';
        let pairs = PAIRS[Math.min(lv, PAIRS.length - 1)];
        let items;
        if (deck === 'famiglia') {
          const photos = shuffle(App.media.photos);
          pairs = Math.min(pairs, photos.length);
          items = photos.slice(0, pairs).map(p => ({ key: p.id, img: p.url, n: p.name, speak: p.name ? p.name + (l === 'fr' ? ' !' : '!') : '' }));
        } else {
          items = shuffle(ANIMALS).slice(0, pairs).map(a => ({ key: a.e, e: a.e, n: a[l][0], speak: speakOf(a, l) }));
        }
        const cards = shuffle(items.concat(items));
        const cols = COLS[pairs] || 2;
        const rows = Math.ceil(cards.length / cols);
        const r = grid.getBoundingClientRect();
        const gap = 10;
        const s = Math.floor(Math.min((r.width - gap * (cols - 1)) / cols, (r.height - gap * (rows - 1)) / rows));
        grid.style.gridTemplateColumns = `repeat(${cols}, ${s}px)`;
        grid.style.gridAutoRows = `${s}px`;

        let open = [];
        let found = 0;
        let busy = false;
        pill.textContent = `🃏 0/${pairs}`;

        cards.forEach(it => {
          const face = h('div', { class: 'face', style: `font-size:${s * .55}px` },
            it.img ? [h('img', { src: it.img, alt: '' }), it.n ? h('div', { class: 'cap' }, it.n) : null] : it.e);
          const c = h('button', { class: 'card', style: 'background:none;padding:0' },
            h('div', { class: 'in' }, h('div', { class: 'back', style: `font-size:${s * .4}px` }, App.char().e), face));
          c.onclick = async () => {
            if (busy || c.classList.contains('up')) return;
            c.classList.add('up');
            sfx.flip();
            if (it.speak) say(it.speak);
            open.push({ c, it });
            if (open.length < 2) return;
            busy = true;
            const [a, b] = open;
            open = [];
            if (a.it.key === b.it.key) {
              await wait(450);
              a.c.classList.add('match'); b.c.classList.add('match');
              sfx.ding();
              const rr = b.c.getBoundingClientRect();
              App.addStars(1, rr.left + rr.width / 2, rr.top);
              App.track(null, null, true);
              found++;
              pill.textContent = `🃏 ${found}/${pairs}`;
              busy = false;
              if (found === pairs) {
                await wait(500);
                await App.praise();
                if (!alive) return;
                await App.reward();
                if (!alive) return;
                if (lv < PAIRS.length - 1) { lv++; App.setLevel('memory', lv); }
                board(false);
              }
            } else {
              await wait(1200);
              a.c.classList.remove('up'); b.c.classList.remove('up');
              busy = false;
            }
          };
          grid.append(c);
        });
        App.intro('memory', steps()).then(ran => {
          if (!ran && alive && lv === 1 && deck === 'animali') say(tx().tut[2], { queue: true });
        });
      }

      requestAnimationFrame(chooseDeck);
      return () => { alive = false; };
    },
  });
})();
