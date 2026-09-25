/* Le due lingue — praticare insieme le 2 lingue scelte per il bambino:
   "Dov'è…?" (ascolta e trova), Memory bilingue (carta lingua A ↔ carta lingua B) e "Quale lingua hai sentito?".
   Nascosto se il bambino ha una sola lingua (needs2). */
(() => {
  const { h, say, sfx, pick, shuffle, wait } = App;
  /* per ogni lingua: [con articolo, parola sola] */
  const WORDS = [
    ['🐱', ['le chat', 'Chat'], ['il gatto', 'Gatto'], ['die Katze', 'Katze'], ['the cat', 'Cat'], ['el gato', 'Gato']],
    ['🐶', ['le chien', 'Chien'], ['il cane', 'Cane'], ['der Hund', 'Hund'], ['the dog', 'Dog'], ['el perro', 'Perro']],
    ['🐮', ['la vache', 'Vache'], ['la mucca', 'Mucca'], ['die Kuh', 'Kuh'], ['the cow', 'Cow'], ['la vaca', 'Vaca']],
    ['🐷', ['le cochon', 'Cochon'], ['il maiale', 'Maiale'], ['das Schwein', 'Schwein'], ['the pig', 'Pig'], ['el cerdo', 'Cerdo']],
    ['🐰', ['le lapin', 'Lapin'], ['il coniglio', 'Coniglio'], ['der Hase', 'Hase'], ['the rabbit', 'Rabbit'], ['el conejo', 'Conejo']],
    ['🐟', ['le poisson', 'Poisson'], ['il pesce', 'Pesce'], ['der Fisch', 'Fisch'], ['the fish', 'Fish'], ['el pez', 'Pez']],
    ['🐦', ["l'oiseau", 'Oiseau'], ["l'uccellino", 'Uccellino'], ['der Vogel', 'Vogel'], ['the bird', 'Bird'], ['el pájaro', 'Pájaro']],
    ['🐴', ['le cheval', 'Cheval'], ['il cavallo', 'Cavallo'], ['das Pferd', 'Pferd'], ['the horse', 'Horse'], ['el caballo', 'Caballo']],
    ['🍎', ['la pomme', 'Pomme'], ['la mela', 'Mela'], ['der Apfel', 'Apfel'], ['the apple', 'Apple'], ['la manzana', 'Manzana']],
    ['🍌', ['la banane', 'Banane'], ['la banana', 'Banana'], ['die Banane', 'Banane'], ['the banana', 'Banana'], ['el plátano', 'Plátano']],
    ['🍓', ['la fraise', 'Fraise'], ['la fragola', 'Fragola'], ['die Erdbeere', 'Erdbeere'], ['the strawberry', 'Strawberry'], ['la fresa', 'Fresa']],
    ['🎂', ['le gâteau', 'Gâteau'], ['la torta', 'Torta'], ['der Kuchen', 'Kuchen'], ['the cake', 'Cake'], ['la tarta', 'Tarta']],
    ['🍦', ['la glace', 'Glace'], ['il gelato', 'Gelato'], ['das Eis', 'Eis'], ['the ice cream', 'Ice cream'], ['el helado', 'Helado']],
    ['🍞', ['le pain', 'Pain'], ['il pane', 'Pane'], ['das Brot', 'Brot'], ['the bread', 'Bread'], ['el pan', 'Pan']],
    ['🧀', ['le fromage', 'Fromage'], ['il formaggio', 'Formaggio'], ['der Käse', 'Käse'], ['the cheese', 'Cheese'], ['el queso', 'Queso']],
    ['🥛', ['le lait', 'Lait'], ['il latte', 'Latte'], ['die Milch', 'Milch'], ['the milk', 'Milk'], ['la leche', 'Leche']],
    ['☀️', ['le soleil', 'Soleil'], ['il sole', 'Sole'], ['die Sonne', 'Sonne'], ['the sun', 'Sun'], ['el sol', 'Sol']],
    ['🌙', ['la lune', 'Lune'], ['la luna', 'Luna'], ['der Mond', 'Mond'], ['the moon', 'Moon'], ['la luna', 'Luna']],
    ['⭐', ["l'étoile", 'Étoile'], ['la stella', 'Stella'], ['der Stern', 'Stern'], ['the star', 'Star'], ['la estrella', 'Estrella']],
    ['🌸', ['la fleur', 'Fleur'], ['il fiore', 'Fiore'], ['die Blume', 'Blume'], ['the flower', 'Flower'], ['la flor', 'Flor']],
    ['🌳', ["l'arbre", 'Arbre'], ["l'albero", 'Albero'], ['der Baum', 'Baum'], ['the tree', 'Tree'], ['el árbol', 'Árbol']],
    ['🏠', ['la maison', 'Maison'], ['la casa', 'Casa'], ['das Haus', 'Haus'], ['the house', 'House'], ['la casa', 'Casa']],
    ['🚗', ['la voiture', 'Voiture'], ['la macchina', 'Macchina'], ['das Auto', 'Auto'], ['the car', 'Car'], ['el coche', 'Coche']],
    ['🎈', ['le ballon', 'Ballon'], ['il palloncino', 'Palloncino'], ['der Luftballon', 'Luftballon'], ['the balloon', 'Balloon'], ['el globo', 'Globo']],
    ['📖', ['le livre', 'Livre'], ['il libro', 'Libro'], ['das Buch', 'Buch'], ['the book', 'Book'], ['el libro', 'Libro']],
    ['👟', ['la chaussure', 'Chaussure'], ['la scarpa', 'Scarpa'], ['der Schuh', 'Schuh'], ['the shoe', 'Shoe'], ['el zapato', 'Zapato']],
    ['🎩', ['le chapeau', 'Chapeau'], ['il cappello', 'Cappello'], ['der Hut', 'Hut'], ['the hat', 'Hat'], ['el sombrero', 'Sombrero']],
    ['🛏️', ['le lit', 'Lit'], ['il letto', 'Letto'], ['das Bett', 'Bett'], ['the bed', 'Bed'], ['la cama', 'Cama']],
    ['☂️', ['le parapluie', 'Parapluie'], ["l'ombrello", 'Ombrello'], ['der Regenschirm', 'Regenschirm'], ['the umbrella', 'Umbrella'], ['el paraguas', 'Paraguas']],
    ['☁️', ['le nuage', 'Nuage'], ['la nuvola', 'Nuvola'], ['die Wolke', 'Wolke'], ['the cloud', 'Cloud'], ['la nube', 'Nube']],
  ].map(([e, fr, it, de, en, es]) => ({ e, fr, it, de, en, es }));
  const GREET = {
    fr: ['Bonjour !', 'Merci !', 'Bonne nuit !', "Je t'aime !", 'Au revoir !', 'Bon appétit !'],
    it: ['Buongiorno!', 'Grazie!', 'Buonanotte!', 'Ti voglio bene!', 'Arrivederci!', 'Buon appetito!'],
    de: ['Guten Morgen!', 'Danke!', 'Gute Nacht!', 'Ich hab dich lieb!', 'Tschüss!', 'Guten Appetit!'],
    en: ['Good morning!', 'Thank you!', 'Good night!', 'I love you!', 'Goodbye!', 'Enjoy your meal!'],
    es: ['¡Buenos días!', '¡Gracias!', '¡Buenas noches!', '¡Te quiero!', '¡Adiós!', '¡Buen provecho!'],
  };
  const TX = {
    fr: {
      where: w => `Où est ${w.fr[0]} ?`, word: w => `${w.fr[1]} !`, no: w => `Non, ça, c'est ${w.fr[0]} !`,
      wasLang: "Bravo ! C'était du français !", listen: 'Écoute bien…',
      tutFind: ['Écoute le mot…', 'Puis touche la bonne image !'],
      tutMem: ['Chaque langue a sa couleur de carte.', 'Trouve la même image dans les deux langues !'],
      tutWhich: ['Écoute bien : tu peux réécouter ici.', 'Puis touche le drapeau de la langue que tu as entendue !'],
    },
    it: {
      where: w => `Dov'è ${w.it[0]}?`, word: w => `${w.it[1]}!`, no: w => `No, hai toccato ${w.it[0]}!`,
      wasLang: 'Brava! Era italiano!', listen: 'Ascolta bene…',
      tutFind: ['Ascolta la parola…', "Poi tocca l'immagine giusta!"],
      tutMem: ['Ogni lingua ha il suo colore di carta.', 'Trova la stessa immagine nelle due lingue!'],
      tutWhich: ['Ascolta bene: puoi riascoltare qui.', 'Poi tocca la bandiera della lingua che hai sentito!'],
    },
    de: {
      where: w => `Wo ist ${w.de[0]}?`, word: w => `${w.de[1]}!`, no: w => `Nein, das ist ${w.de[0]}!`,
      wasLang: 'Super! Das war Deutsch!', listen: 'Hör gut zu…',
      tutFind: ['Hör dir das Wort an…', 'Dann tippe auf das richtige Bild!'],
      tutMem: ['Jede Sprache hat ihre eigene Kartenfarbe.', 'Finde das gleiche Bild in beiden Sprachen!'],
      tutWhich: ['Hör gut zu: Hier kannst du es nochmal hören.', 'Dann tippe auf die Flagge der Sprache, die du gehört hast!'],
    },
    en: {
      where: w => `Where is ${w.en[0]}?`, word: w => `${w.en[1]}!`, no: w => `No, that's ${w.en[0]}!`,
      wasLang: 'Well done! That was English!', listen: 'Listen carefully…',
      tutFind: ['Listen to the word…', 'Then tap the right picture!'],
      tutMem: ['Each language has its own card colour.', 'Find the same picture in both languages!'],
      tutWhich: ['Listen carefully: you can listen again here.', 'Then tap the flag of the language you heard!'],
    },
    es: {
      where: w => `¿Dónde está ${w.es[0]}?`, word: w => `¡${w.es[1]}!`, no: w => `¡No, eso es ${w.es[0]}!`,
      wasLang: '¡Muy bien! ¡Era español!', listen: 'Escucha bien…',
      tutFind: ['Escucha la palabra…', '¡Luego toca la imagen correcta!'],
      tutMem: ['Cada idioma tiene su propio color de carta.', '¡Encuentra la misma imagen en los dos idiomas!'],
      tutWhich: ['Escucha bien: aquí puedes volver a escucharlo.', '¡Luego toca la bandera del idioma que has oído!'],
    },
  };
  const ROUND = 6;
  /* parole uguali o quasi nelle due lingue (Luna/Luna, Gatto/Gato): non servono per "quale lingua?" */
  const plain = x => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function dist(a, b) {
    const d = [...Array(b.length + 1).keys()];
    for (let i = 1; i <= a.length; i++) {
      let prev = d[0]; d[0] = i;
      for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t; }
    }
    return d[b.length];
  }
  const tooSimilar = (w, A, B) => dist(plain(w[A][1]), plain(w[B][1])) <= 1;
  const flagBtn = l => h('button', { class: `flagbtn ${l}`, 'aria-label': l });

  App.registerGame({
    id: 'lingue', needs2: true, short: 'Lingue', icon: '🌍',
    title: { fr: 'Les deux langues', it: 'Le due lingue', de: 'Zwei Sprachen', en: 'Two languages', es: 'Los dos idiomas' },
    phrases: l => {
      const T = TX[l];
      const out = [T.wasLang, T.listen, ...T.tutFind, ...T.tutMem, ...T.tutWhich, ...GREET[l]];
      WORDS.forEach(w => out.push(T.where(w), T.word(w), T.no(w)));
      return out;
    },
    start({ stage, addPill, setHelp, hud }) {
      let alive = true;
      let good = 0;
      let turn = 0;
      let lv = App.level('lingue');
      let lastSteps = [];
      let replay = () => {};
      const [A, B] = App.pair();
      const pill = addPill(`⭐ 0/${ROUND}`);
      const flagPill = hud.querySelector('.flag-pill');
      stage.style.background = 'linear-gradient(180deg,#e8f1ff 0%,#fff 45%,#eafbef 100%)';
      setHelp(() => App.tutorial(lastSteps).then(() => alive && replay()));
      const tx = () => TX[App.lang];

      async function success(x, y) {
        good++;
        pill.textContent = `⭐ ${good}/${ROUND}`;
        App.addStars(1, x, y);
        if (good >= ROUND) {
          await wait(900);
          if (!alive) return;
          await App.reward();
          if (!alive) return;
          good = 0; pill.textContent = `⭐ 0/${ROUND}`;
          if (lv < 3) { lv++; App.levelUp('lingue', lv); }
        }
        await wait(700);
        next();
      }

      /* 1) Dov'è…? — ascolta e trova l'immagine */
      function find() {
        const l = App.nextLang(), T = TX[l];
        const opts = shuffle(WORDS).slice(0, lv >= 3 ? 6 : 4);
        const w = pick(opts);
        const q = T.where(w);
        const grid = h('div', { class: 'lng-grid' });
        const spk = h('button', { class: 'lng-spk', onclick: () => { sfx.tap(); say(q, { lang: l }); } }, '🔊');
        let first = true;
        opts.forEach(o => {
          const b = h('button', { class: 'lng-pic' }, o.e);
          b.onclick = async () => {
            if (first) { App.track('lingue', null, o === w); first = false; }
            if (o === w) {
              grid.querySelectorAll('button').forEach(x => { x.disabled = true; });
              b.classList.add('ok');
              sfx.ding();
              await say(T.word(w), { lang: l });
              if (!alive) return;
              const other = l === A ? B : A;
              await say(TX[other].word(w), { lang: other });
              if (!alive) return;
              await App.praise();
              const r = b.getBoundingClientRect();
              if (alive) success(r.left + r.width / 2, r.top);
            } else {
              sfx.boing();
              b.classList.add('shake');
              setTimeout(() => b.classList.remove('shake'), 500);
              say(T.no(o), { lang: l }).then(() => alive && say(q, { queue: true, lang: l }));
            }
          };
          grid.append(b);
        });
        stage.append(h('div', { class: 'prompt lng-prompt' }, spk, h('span', {}, '🔎')), grid);
        replay = () => say(q, { lang: l });
        lastSteps = [
          { text: T.tutFind[0], icon: '👂', action: 'tap', at: () => spk, cap: 'top' },
          { text: T.tutFind[1], icon: '👆', action: 'tap', at: () => grid.children[opts.indexOf(w)], cap: 'top' },
        ];
        App.intro('lingue-trova', lastSteps).then(() => alive && say(q, { lang: l }));
      }

      /* 2) Memory bilingue — carta nella lingua A + carta nella lingua B con la stessa immagine */
      function memory() {
        const T = tx();
        const pairs = shuffle(WORDS).slice(0, [3, 4, 5][lv - 1] || 5);
        const cards = shuffle(pairs.flatMap(w => [{ w, l: A }, { w, l: B }]));
        const grid = h('div', { class: 'lng-mem' });
        let open = [], busy = false, found = 0;
        cards.forEach(cd => {
          const c = h('button', { class: `card lng-card ${cd.l}`, style: 'background:none;padding:0' },
            h('div', { class: 'in' },
              h('div', { class: 'back' }, App.char().e),
              h('div', { class: 'face' }, h('span', { class: 'e' }, cd.w.e), h('span', { class: 'w' }, cd.w[cd.l][1]))));
          c.onclick = async () => {
            if (busy || c.classList.contains('up')) return;
            c.classList.add('up');
            sfx.flip();
            say(TX[cd.l].word(cd.w), { lang: cd.l });
            open.push({ c, cd });
            if (open.length < 2) return;
            busy = true;
            const [a, b] = open;
            open = [];
            if (a.cd.w === b.cd.w && a.cd.l !== b.cd.l) {
              await wait(700);
              a.c.classList.add('match'); b.c.classList.add('match');
              sfx.ding();
              /* il ponte: la parola nelle due lingue */
              await say(TX[A].word(a.cd.w), { lang: A });
              await say(TX[B].word(a.cd.w), { lang: B, queue: true });
              const r = b.c.getBoundingClientRect();
              App.addStars(1, r.left + r.width / 2, r.top);
              found++;
              busy = false;
              if (found === pairs.length) {
                await App.praise();
                if (alive) success(innerWidth / 2, innerHeight / 2);
              }
            } else {
              await wait(1300);
              a.c.classList.remove('up'); b.c.classList.remove('up');
              busy = false;
            }
          };
          grid.append(c);
        });
        stage.append(h('div', { class: 'prompt lng-prompt' }, h('span', { class: `flagdot ${A}` }), '↔', h('span', { class: `flagdot ${B}` })), grid);
        /* carte (3:4) il più grandi possibile senza uscire dallo schermo */
        const gr = grid.getBoundingClientRect();
        let best = { c: 3, w: 0 };
        for (let c = 3; c <= 5; c++) {
          const rw = Math.ceil(cards.length / c);
          const w0 = Math.min((gr.width - 10 * (c - 1)) / c, ((gr.height - 10 * (rw - 1)) / rw) * .75);
          if (w0 > best.w) best = { c, w: w0 };
        }
        grid.style.gridTemplateColumns = `repeat(${best.c}, ${Math.floor(best.w)}px)`;
        grid.style.justifyContent = 'center';
        replay = () => {};
        lastSteps = [
          { text: T.tutMem[0], icon: '🃏', action: 'tap', at: () => grid.querySelector(`.lng-card.${A}`), cap: 'top' },
          { text: T.tutMem[1], icon: '🔁', action: 'tap', at: () => grid.querySelector(`.lng-card.${B}`), cap: 'top' },
        ];
        App.intro('lingue-memory', lastSteps);
      }

      /* 3) Quale lingua? — lingua casuale (non alternata), bandierina in alto nascosta */
      let lastWhich = null;
      function which() {
        const l = lastWhich && Math.random() < .7 ? (lastWhich === A ? B : A) : pick([A, B]);
        lastWhich = l;
        App.lang = l;
        if (flagPill) flagPill.textContent = '❓';
        const w = pick(WORDS.filter(x => !tooSimilar(x, A, B)));
        const phrase = Math.random() < .35 ? pick(GREET[l]) : TX[l].word(w);
        const showE = GREET[l].includes(phrase) ? '💬' : w.e;
        const spk = h('button', { class: 'lng-spk big', onclick: () => { sfx.tap(); say(phrase, { lang: l }); } }, '🔊');
        let first = true, locked = false;
        const choose = async (lc, btn) => {
          if (locked) return;
          if (first) { App.track('lingue', null, lc === l); first = false; }
          if (lc === l) {
            locked = true;
            sfx.ding();
            btn.classList.add('ok');
            if (flagPill) flagPill.textContent = App.FLAG[l];
            await say(TX[l].wasLang, { lang: l });
            const r = btn.getBoundingClientRect();
            if (alive) success(r.left + r.width / 2, r.top);
          } else {
            sfx.boing();
            btn.classList.add('shake');
            setTimeout(() => btn.classList.remove('shake'), 500);
            say(TX[l].listen, { lang: l }).then(() => alive && say(phrase, { queue: true, lang: l }));
          }
        };
        const fa = flagBtn(A), fb = flagBtn(B);
        fa.onclick = () => choose(A, fa);
        fb.onclick = () => choose(B, fb);
        stage.append(h('div', { class: 'lng-which' }, spk, h('div', { class: 'lng-which-pic' }, showE), h('div', { class: 'lng-flags' }, fa, fb)));
        replay = () => { App.lang = l; say(phrase, { lang: l }); };
        /* spiegazioni in una lingua a caso: non devono suggerire la risposta */
        const tl = pick([A, B]);
        lastSteps = [
          { text: TX[tl].tutWhich[0], icon: '🔊', action: 'tap', at: () => spk, cap: 'top', before: () => { App.lang = tl; } },
          { text: TX[tl].tutWhich[1], icon: '🏳️', action: 'tap', at: () => fa, cap: 'top' },
        ];
        App.intro('lingue-quale', lastSteps).then(() => {
          App.lang = l;
          if (alive) say(phrase, { lang: l });
        });
      }

      function next() {
        if (!alive) return;
        [...stage.children].forEach(c => c.remove());
        const mode = turn % 4 === 1 ? 'memory' : turn % 4 === 3 ? 'which' : 'find';
        turn++;
        if (mode === 'find') find(); else if (mode === 'memory') { App.nextLang(); memory(); } else which();
      }

      requestAnimationFrame(next);
      return () => { alive = false; };
    },
  });
})();
