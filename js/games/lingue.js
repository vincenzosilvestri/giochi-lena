/* Les deux langues / Le due lingue — praticare francese e italiano insieme:
   "Dov'è…?" (ascolta e trova), Memory bilingue (carta FR ↔ carta IT) e "Quale lingua hai sentito?". */
(() => {
  const { h, say, sfx, pick, shuffle, wait } = App;
  /* parola: [francese con articolo, parola sola] / [italiano con articolo, parola sola] */
  const WORDS = [
    ['🐱', ['le chat', 'Chat'], ['il gatto', 'Gatto']], ['🐶', ['le chien', 'Chien'], ['il cane', 'Cane']],
    ['🐮', ['la vache', 'Vache'], ['la mucca', 'Mucca']], ['🐷', ['le cochon', 'Cochon'], ['il maiale', 'Maiale']],
    ['🐰', ['le lapin', 'Lapin'], ['il coniglio', 'Coniglio']], ['🐟', ['le poisson', 'Poisson'], ['il pesce', 'Pesce']],
    ['🐦', ["l'oiseau", 'Oiseau'], ["l'uccellino", 'Uccellino']], ['🐴', ['le cheval', 'Cheval'], ['il cavallo', 'Cavallo']],
    ['🍎', ['la pomme', 'Pomme'], ['la mela', 'Mela']], ['🍌', ['la banane', 'Banane'], ['la banana', 'Banana']],
    ['🍓', ['la fraise', 'Fraise'], ['la fragola', 'Fragola']], ['🎂', ['le gâteau', 'Gâteau'], ['la torta', 'Torta']],
    ['🍦', ['la glace', 'Glace'], ['il gelato', 'Gelato']], ['🍞', ['le pain', 'Pain'], ['il pane', 'Pane']],
    ['🧀', ['le fromage', 'Fromage'], ['il formaggio', 'Formaggio']], ['🥛', ['le lait', 'Lait'], ['il latte', 'Latte']],
    ['☀️', ['le soleil', 'Soleil'], ['il sole', 'Sole']], ['🌙', ['la lune', 'Lune'], ['la luna', 'Luna']],
    ['⭐', ["l'étoile", 'Étoile'], ['la stella', 'Stella']], ['🌸', ['la fleur', 'Fleur'], ['il fiore', 'Fiore']],
    ['🌳', ["l'arbre", 'Arbre'], ["l'albero", 'Albero']], ['🏠', ['la maison', 'Maison'], ['la casa', 'Casa']],
    ['🚗', ['la voiture', 'Voiture'], ['la macchina', 'Macchina']], ['🎈', ['le ballon', 'Ballon'], ['il palloncino', 'Palloncino']],
    ['📖', ['le livre', 'Livre'], ['il libro', 'Libro']], ['👟', ['la chaussure', 'Chaussure'], ['la scarpa', 'Scarpa']],
    ['🎩', ['le chapeau', 'Chapeau'], ['il cappello', 'Cappello']], ['🛏️', ['le lit', 'Lit'], ['il letto', 'Letto']],
    ['☂️', ['le parapluie', 'Parapluie'], ["l'ombrello", 'Ombrello']], ['☁️', ['le nuage', 'Nuage'], ['la nuvola', 'Nuvola']],
  ].map(([e, fr, it]) => ({ e, fr, it }));
  const GREET = {
    fr: ['Bonjour !', 'Merci !', 'Bonne nuit !', "Je t'aime !", 'Au revoir !', 'Bon appétit !'],
    it: ['Buongiorno!', 'Grazie!', 'Buonanotte!', 'Ti voglio bene!', 'Arrivederci!', 'Buon appetito!'],
  };
  const TX = {
    fr: {
      where: w => `Où est ${w.fr[0]} ?`, word: w => `${w.fr[1]} !`, no: w => `Non, ça, c'est ${w.fr[0]} !`,
      wasLang: 'Bravo ! C\'était du français !', listen: 'Écoute bien…', which: 'Quelle langue as-tu entendue ?',
      tutFind: ['Écoute le mot…', "Puis touche la bonne image !"],
      tutMem: ['Les cartes bleues parlent français, les vertes parlent italien.', 'Trouve la même image dans les deux langues !'],
      tutWhich: ['Écoute bien : tu peux réécouter ici.', 'Puis touche le drapeau de la langue que tu as entendue !'],
    },
    it: {
      where: w => `Dov'è ${w.it[0]}?`, word: w => `${w.it[1]}!`, no: w => `No, qui c'è ${w.it[0]}!`,
      wasLang: 'Brava! Era italiano!', listen: 'Ascolta bene…', which: 'Che lingua hai sentito?',
      tutFind: ['Ascolta la parola…', "Poi tocca l'immagine giusta!"],
      tutMem: ['Le carte blu parlano francese, quelle verdi italiano.', 'Trova la stessa immagine nelle due lingue!'],
      tutWhich: ['Ascolta bene: puoi riascoltare qui.', 'Poi tocca la bandiera della lingua che hai sentito!'],
    },
  };
  const ROUND = 6;
  const flagBtn = (l, extra = {}) => h('button', Object.assign({ class: `flagbtn ${l}`, 'aria-label': l }, extra));

  App.registerGame({
    id: 'lingue', title: { fr: 'Les deux langues', it: 'Le due lingue' }, short: 'Lingue', icon: '🌍',
    phrases: l => {
      const T = TX[l];
      const out = [T.wasLang, T.listen, T.which, ...T.tutFind, ...T.tutMem, ...T.tutWhich, ...GREET[l]];
      WORDS.forEach(w => out.push(T.where(w), T.word(w), T.no(w)));
      return out;
    },
    start({ stage, addPill, setHelp, hud }) {
      let alive = true;
      let good = 0;
      let turn = 0;
      let lastSteps = [];
      let replay = () => {};
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
        }
        await wait(700);
        next();
      }

      /* 1) Dov'è…? — ascolta e trova l'immagine */
      function find() {
        const l = App.nextLang(), T = TX[l];
        const opts = shuffle(WORDS).slice(0, 4);
        const w = pick(opts);
        const q = T.where(w);
        const grid = h('div', { class: 'lng-grid' });
        const spk = h('button', { class: 'lng-spk', onclick: () => { sfx.tap(); say(q); } }, '🔊');
        let first = true;
        opts.forEach(o => {
          const b = h('button', { class: 'lng-pic' }, o.e);
          b.onclick = async () => {
            if (first) { App.track(null, null, o === w); first = false; }
            if (o === w) {
              grid.querySelectorAll('button').forEach(x => { x.disabled = true; });
              b.classList.add('ok');
              sfx.ding();
              await say(T.word(w));
              if (!alive) return;
              await App.praise();
              const r = b.getBoundingClientRect();
              if (alive) success(r.left + r.width / 2, r.top);
            } else {
              sfx.boing();
              b.classList.add('shake');
              setTimeout(() => b.classList.remove('shake'), 500);
              say(T.no(o)).then(() => alive && say(q, { queue: true }));
            }
          };
          grid.append(b);
        });
        stage.append(h('div', { class: 'prompt lng-prompt' }, spk, h('span', {}, '🔎')), grid);
        replay = () => say(q);
        lastSteps = [
          { text: T.tutFind[0], icon: '👂', action: 'tap', at: () => spk, cap: 'top' },
          { text: T.tutFind[1], icon: '👆', action: 'tap', at: () => grid.children[[...opts].indexOf(w)], cap: 'top' },
        ];
        App.intro('lingue-trova', lastSteps).then(() => alive && say(q));
      }

      /* 2) Memory bilingue — carta francese + carta italiana con la stessa immagine */
      function memory() {
        const T = tx();
        const pairs = shuffle(WORDS).slice(0, good >= 3 ? 4 : 3);
        const cards = shuffle(pairs.flatMap(w => [{ w, l: 'fr' }, { w, l: 'it' }]));
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
              App.track(null, null, true);
              /* il ponte: la parola nelle due lingue */
              await say(TX.fr.word(a.cd.w), { lang: 'fr' });
              await say(TX.it.word(a.cd.w), { lang: 'it', queue: true });
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
        stage.append(h('div', { class: 'prompt lng-prompt' }, h('span', { class: 'flagdot fr' }), '↔', h('span', { class: 'flagdot it' })), grid);
        replay = () => {};
        lastSteps = [
          { text: T.tutMem[0], icon: '🃏', action: 'tap', at: () => grid.querySelector('.lng-card.fr'), cap: 'top' },
          { text: T.tutMem[1], icon: '🔁', action: 'tap', at: () => grid.querySelector('.lng-card.it'), cap: 'top' },
        ];
        App.intro('lingue-memory', lastSteps);
      }

      /* 3) Quale lingua? — la lingua è casuale (non alternata) e la bandierina in alto si nasconde */
      function which() {
        const l = Math.random() < .5 ? 'fr' : 'it';
        App.lang = l;
        if (flagPill) flagPill.textContent = '❓';
        const w = pick(WORDS);
        const phrase = Math.random() < .35 ? pick(GREET[l]) : TX[l].word(w);
        const showE = GREET[l].includes(phrase) ? '💬' : w.e;
        const spk = h('button', { class: 'lng-spk big', onclick: () => { sfx.tap(); say(phrase, { lang: l }); } }, '🔊');
        const pic = h('div', { class: 'lng-which-pic' }, showE);
        let first = true;
        const choose = async (lc, btn) => {
          if (first) { App.track(null, null, lc === l); first = false; }
          if (lc === l) {
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
        const fr = flagBtn('fr'), it = flagBtn('it');
        fr.onclick = () => choose('fr', fr);
        it.onclick = () => choose('it', it);
        stage.append(h('div', { class: 'lng-which' }, spk, pic, h('div', { class: 'lng-flags' }, fr, it)));
        replay = () => say(phrase, { lang: l });
        /* spiegazioni in una lingua a caso: non devono suggerire la risposta */
        const tl = Math.random() < .5 ? 'fr' : 'it';
        lastSteps = [
          { text: TX[tl].tutWhich[0], icon: '🔊', action: 'tap', at: () => spk, cap: 'top', before: () => { App.lang = tl; } },
          { text: TX[tl].tutWhich[1], icon: '🏳️', action: 'tap', at: () => fr, cap: 'top' },
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
