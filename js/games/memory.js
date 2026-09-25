/* Memory — coppie di animali (con nome e verso) o di foto di famiglia. Bilingue FR/IT (una lingua per partita). */
(() => {
  const { h, say, sfx, shuffle, wait } = App;
  const ANIMALS = [
    { e: '🐮', it: ['Mucca', 'Muuu!'], fr: ['Vache', 'Meuh !'], de: ['Kuh', 'Muh!'], en: ['Cow', 'Moo!'], es: ['Vaca', '¡Muu!'] },
    { e: '🐱', it: ['Gatto', 'Miao!'], fr: ['Chat', 'Miaou !'], de: ['Katze', 'Miau!'], en: ['Cat', 'Meow!'], es: ['Gato', '¡Miau!'] },
    { e: '🐶', it: ['Cane', 'Bau bau!'], fr: ['Chien', 'Ouaf ouaf !'], de: ['Hund', 'Wau wau!'], en: ['Dog', 'Woof woof!'], es: ['Perro', '¡Guau guau!'] },
    { e: '🐑', it: ['Pecora', 'Beee!'], fr: ['Mouton', 'Bêê !'], de: ['Schaf', 'Mäh!'], en: ['Sheep', 'Baa!'], es: ['Oveja', '¡Bee!'] },
    { e: '🐷', it: ['Maiale', 'Oink oink!'], fr: ['Cochon', 'Groin groin !'], de: ['Schwein', 'Oink oink!'], en: ['Pig', 'Oink oink!'], es: ['Cerdo', '¡Oinc oinc!'] },
    { e: '🦆', it: ['Anatra', 'Qua qua!'], fr: ['Canard', 'Coin coin !'], de: ['Ente', 'Quak quak!'], en: ['Duck', 'Quack quack!'], es: ['Pato', '¡Cuac cuac!'] },
    { e: '🐓', it: ['Gallo', 'Chicchirichì!'], fr: ['Coq', 'Cocorico !'], de: ['Hahn', 'Kikeriki!'], en: ['Rooster', 'Cock-a-doodle-doo!'], es: ['Gallo', '¡Quiquiriquí!'] },
    { e: '🦁', it: ['Leone', 'Roaar!'], fr: ['Lion', 'Roaar !'], de: ['Löwe', 'Roaar!'], en: ['Lion', 'Roar!'], es: ['León', '¡Grrr!'] },
    { e: '🐴', it: ['Cavallo', 'Iiiiih!'], fr: ['Cheval', 'Hiii !'], de: ['Pferd', 'Wiehern!'], en: ['Horse', 'Neigh!'], es: ['Caballo', '¡Iiih!'] },
    { e: '🐸', it: ['Rana', 'Cra cra!'], fr: ['Grenouille', 'Croâ croâ !'], de: ['Frosch', 'Quak!'], en: ['Frog', 'Ribbit!'], es: ['Rana', '¡Croac!'] },
    { e: '🐝', it: ['Ape', 'Bzzz!'], fr: ['Abeille', 'Bzzz !'], de: ['Biene', 'Summ summ!'], en: ['Bee', 'Buzz!'], es: ['Abeja', '¡Bzzz!'] },
    { e: '🦉', it: ['Gufo', 'Uh uh!'], fr: ['Hibou', 'Hou hou !'], de: ['Eule', 'Huhu!'], en: ['Owl', 'Hoo hoo!'], es: ['Búho', '¡Uh uh!'] },
    { e: '🐘', it: ['Elefante', 'Pruuu!'], fr: ['Éléphant', 'Pouuu !'], de: ['Elefant', 'Törööö!'], en: ['Elephant', 'Toot!'], es: ['Elefante', '¡Pruuu!'] },
    { e: '🐭', it: ['Topo', 'Squit squit!'], fr: ['Souris', 'Couic couic !'], de: ['Maus', 'Piep piep!'], en: ['Mouse', 'Squeak squeak!'], es: ['Ratón', '¡Iic iic!'] },
  ];
  const PAIRS = [3, 3, 4, 6, 8];
  const COLS = { 3: 2, 4: 2, 6: 3, 8: 4 };
  const TX = {
    it: { tut: ['Tocca una carta per girarla.', 'Poi cerca quella uguale: se sono uguali restano girate!', 'Gira le carte e trova le coppie uguali!'],
      which: 'Vuoi giocare con gli animali o con la famiglia?', animals: 'Animali', family: 'Famiglia' },
    fr: { tut: ['Touche une carte pour la retourner.', 'Puis cherche la carte pareille : si elles sont pareilles, elles restent retournées !', 'Retourne les cartes et trouve les paires !'],
      which: 'Tu veux jouer avec les animaux ou avec la famille ?', animals: 'Animaux', family: 'Famille' },
    de: { tut: ['Tippe auf eine Karte, um sie umzudrehen.', 'Dann such die gleiche Karte: Wenn sie gleich sind, bleiben sie offen!', 'Dreh die Karten um und finde die Paare!'],
      which: 'Möchtest du mit den Tieren oder mit der Familie spielen?', animals: 'Tiere', family: 'Familie' },
    en: { tut: ['Tap a card to turn it over.', 'Then look for the matching card: if they match, they stay face up!', 'Turn over the cards and find the pairs!'],
      which: 'Do you want to play with the animals or with the family?', animals: 'Animals', family: 'Family' },
    es: { tut: ['Toca una carta para darle la vuelta.', 'Luego busca la carta igual: ¡si son iguales, se quedan boca arriba!', '¡Da la vuelta a las cartas y encuentra las parejas!'],
      which: '¿Quieres jugar con los animales o con la familia?', animals: 'Animales', family: 'Familia' },
  };
  const tx = () => TX[App.lang];
  const speakOf = (a, l) => `${App.excl(a[l][0], l)} ${a[l][1]}`;

  App.registerGame({
    id: 'memory', title: { fr: 'Memory des animaux', it: 'Memory degli Animali', de: 'Tier-Memory', en: 'Animal memory', es: 'Memoria de animales' }, short: 'Memory', icon: '🃏',
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
            h('div', { class: 'ico' }, '🫂'), h('div', { class: 'lbl' }, tx().family)));
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
          items = photos.slice(0, pairs).map(p => ({ key: p.id, img: p.url, n: p.name, speak: p.name ? App.excl(p.name, l) : '' }));
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
              App.track('memoria', null, true);
              found++;
              pill.textContent = `🃏 ${found}/${pairs}`;
              busy = false;
              if (found === pairs) {
                await wait(500);
                await App.praise();
                if (!alive) return;
                await App.reward();
                if (!alive) return;
                if (lv < PAIRS.length - 1) { lv++; App.levelUp('memory', lv); }
                board(false);
              }
            } else {
              App.track('memoria', null, false);
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
