/* Suoni e sillabe — coscienza fonologica: contare le sillabe battendo le mani e trovare le rime. In 5 lingue. */
(() => {
  const { h, say, sfx, pick, shuffle, wait } = App;
  /* parole divise in sillabe (orali, come a scuola: in francese la "e" finale muta non conta) */
  const SYL = {
    it: [['☀️', 'so-le'], ['🏠', 'ca-sa'], ['🍎', 'me-la'], ['🐱', 'gat-to'], ['🌸', 'fio-re'], ['👑', 're'], ['🍵', 'tè'],
      ['🍌', 'ba-na-na'], ['🦋', 'far-fal-la'], ['🐘', 'e-le-fan-te'], ['🎈', 'pal-lon-ci-no'], ['🐢', 'tar-ta-ru-ga']],
    fr: [['🐱', 'chat'], ['🍎', 'pomme'], ['🏠', 'mai-son'], ['🐰', 'la-pin'], ['☀️', 'so-leil'], ['🍌', 'ba-nane'],
      ['🦋', 'pa-pi-llon'], ['🐘', 'é-lé-phant'], ['🐞', 'coc-ci-nelle'], ['🐊', 'cro-co-dile'], ['🚁', 'hé-li-cop-tère']],
    de: [['⚽', 'Ball'], ['🏠', 'Haus'], ['🍎', 'Ap-fel'], ['🐱', 'Kat-ze'], ['☀️', 'Son-ne'], ['🍌', 'Ba-na-ne'],
      ['🐘', 'E-le-fant'], ['🦋', 'Schmet-ter-ling'], ['🐊', 'Kro-ko-dil'], ['🚁', 'Hub-schrau-ber'], ['🍫', 'Scho-ko-la-de']],
    en: [['🐱', 'cat'], ['☀️', 'sun'], ['🏠', 'house'], ['🍎', 'ap-ple'], ['🐰', 'rab-bit'], ['🐒', 'mon-key'],
      ['🍌', 'ba-na-na'], ['🦋', 'but-ter-fly'], ['🐘', 'el-e-phant'], ['🐊', 'croc-o-dile'], ['🚁', 'hel-i-cop-ter'], ['🍉', 'wa-ter-mel-on']],
    es: [['☀️', 'sol'], ['🐟', 'pez'], ['🌸', 'flor'], ['🏠', 'ca-sa'], ['🐱', 'ga-to'], ['🌙', 'lu-na'], ['⚽', 'pe-lo-ta'],
      ['🍌', 'plá-ta-no'], ['🍎', 'man-za-na'], ['🦋', 'ma-ri-po-sa'], ['🐘', 'e-le-fan-te'], ['🐊', 'co-co-dri-lo']],
  };
  /* coppie di parole che fanno rima */
  const RHYME = {
    it: [[['🐱', 'gatto'], ['🍽️', 'piatto']], [['🐶', 'cane'], ['🍞', 'pane']], [['🌸', 'fiore'], ['❤️', 'cuore']],
      [['🎂', 'torta'], ['🚪', 'porta']], [['🚢', 'nave'], ['🔑', 'chiave']], [['🍎', 'mela'], ['🕯️', 'candela']]],
    fr: [[['⛵', 'bateau'], ['🎂', 'gâteau']], [['🐰', 'lapin'], ['🌲', 'sapin']], [['☀️', 'soleil'], ['🐝', 'abeille']],
      [['🐱', 'chat'], ['🐀', 'rat']], [['✋', 'main'], ['🍞', 'pain']], [['🐟', 'poisson'], ['🦔', 'hérisson']]],
    de: [[['🐭', 'Maus'], ['🏠', 'Haus']], [['🐰', 'Hase'], ['👃', 'Nase']], [['🐮', 'Kuh'], ['👟', 'Schuh']],
      [['🐱', 'Katze'], ['🐾', 'Tatze']], [['🦔', 'Igel'], ['🪞', 'Spiegel']]],
    en: [[['🐱', 'cat'], ['🎩', 'hat']], [['🐶', 'dog'], ['🐸', 'frog']], [['🐝', 'bee'], ['🌳', 'tree']],
      [['🌙', 'moon'], ['🥄', 'spoon']], [['🚗', 'car'], ['⭐', 'star']], [['🐭', 'mouse'], ['🏠', 'house']], [['🎂', 'cake'], ['🐍', 'snake']]],
    es: [[['🐱', 'gato'], ['🦆', 'pato']], [['🐭', 'ratón'], ['🚚', 'camión']], [['🐝', 'abeja'], ['🐑', 'oveja']],
      [['🌸', 'flor'], ['🚜', 'tractor']], [['☀️', 'sol'], ['🏮', 'farol']], [['🍐', 'pera'], ['🪜', 'escalera']]],
  };
  const word = s => s.replace(/-/g, '');
  const parts = s => s.split('-');
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const TX = {
    it: {
      howMany: w => `Quante sillabe ha ${w}? Batti le mani!`, syl: s => `${parts(s).join(', ')}!`,
      rhymeQ: w => `Cosa fa rima con ${w}?`, rhymeOk: (a, b) => `${cap(a)}, ${b}! Fanno rima!`,
      tutSyl: ['Tocca la parola: la senti divisa in sillabe.', 'Poi tocca quanti battiti di mani!'],
      tutRhyme: ['Ascolta la parola…', 'Tocca la cosa che fa rima: finisce con lo stesso suono!'],
    },
    fr: {
      howMany: w => `Combien de syllabes dans ${w} ? Tape dans tes mains !`, syl: s => `${parts(s).join(', ')} !`,
      rhymeQ: w => `Qu'est-ce qui rime avec ${w} ?`, rhymeOk: (a, b) => `${cap(a)}, ${b} ! Ça rime !`,
      tutSyl: ['Touche le mot : tu l\'entends coupé en syllabes.', 'Puis touche combien de fois tu tapes dans tes mains !'],
      tutRhyme: ['Écoute le mot…', 'Touche ce qui rime : ça finit avec le même son !'],
    },
    de: {
      howMany: w => `Wie viele Silben hat ${w}? Klatsch mit!`, syl: s => `${parts(s).join(', ')}!`,
      rhymeQ: w => `Was reimt sich auf ${w}?`, rhymeOk: (a, b) => `${a}, ${b}! Das reimt sich!`,
      tutSyl: ['Tippe auf das Wort: Du hörst es in Silben geteilt.', 'Dann tippe, wie oft du klatschst!'],
      tutRhyme: ['Hör dir das Wort an…', 'Tippe auf das, was sich reimt: Es endet mit dem gleichen Klang!'],
    },
    en: {
      howMany: w => `How many syllables in ${w}? Clap along!`, syl: s => `${parts(s).join(', ')}!`,
      rhymeQ: w => `What rhymes with ${w}?`, rhymeOk: (a, b) => `${cap(a)}, ${b}! They rhyme!`,
      tutSyl: ['Tap the word: you hear it split into syllables.', 'Then tap how many claps!'],
      tutRhyme: ['Listen to the word…', 'Tap the thing that rhymes: it ends with the same sound!'],
    },
    es: {
      howMany: w => `¿Cuántas sílabas tiene ${w}? ¡Da palmadas!`, syl: s => `¡${parts(s).join(', ')}!`,
      rhymeQ: w => `¿Qué rima con ${w}?`, rhymeOk: (a, b) => `¡${cap(a)}, ${b}! ¡Riman!`,
      tutSyl: ['Toca la palabra: la oyes dividida en sílabas.', '¡Luego toca cuántas palmadas!'],
      tutRhyme: ['Escucha la palabra…', '¡Toca lo que rima: termina con el mismo sonido!'],
    },
  };
  const ROUND = 6;
  const clapTone = () => App.sfx.tap();

  App.registerGame({
    id: 'suoni', short: 'Suoni', icon: '🥁',
    title: { fr: 'Sons et syllabes', it: 'Suoni e sillabe', de: 'Laute und Silben', en: 'Sounds and syllables', es: 'Sonidos y sílabas' },
    phrases: l => {
      const T = TX[l];
      const out = [...T.tutSyl, ...T.tutRhyme];
      SYL[l].forEach(([, s]) => out.push(T.howMany(word(s)), T.syl(s), App.excl(cap(word(s)), l)));
      RHYME[l].forEach(([a, b]) => out.push(T.rhymeQ(a[1]), T.rhymeOk(a[1], b[1]), App.excl(cap(a[1]), l), App.excl(cap(b[1]), l)));
      return out;
    },
    start({ stage, addPill, setHelp }) {
      let alive = true;
      let good = 0;
      let turn = 0;
      let lv = App.level('suoni');
      let lastSteps = [];
      let replay = () => {};
      const pill = addPill(`⭐ 0/${ROUND}`);
      stage.style.background = 'linear-gradient(180deg,#fff0e0 0%,#fff 55%)';
      setHelp(() => App.tutorial(lastSteps).then(() => alive && replay()));

      async function success(x, y) {
        good++;
        pill.textContent = `⭐ ${good}/${ROUND}`;
        App.addStars(1, x, y);
        await App.praise();
        if (!alive) return;
        if (good >= ROUND) {
          await App.reward();
          if (!alive) return;
          good = 0; pill.textContent = `⭐ 0/${ROUND}`;
          if (lv < 3) { lv++; App.levelUp('suoni', lv); }
        }
        await wait(500);
        next();
      }

      /* 1) batti le sillabe */
      function syllables() {
        const l = App.lang, T = TX[l];
        const maxSyl = lv >= 2 ? 4 : 3;
        const [e, s] = pick(SYL[l].filter(([, x]) => parts(x).length <= maxSyl));
        const w = word(s), n = parts(s).length;
        const chips = h('div', { class: 'syl-chips' }, parts(s).map(p => h('span', {}, p)));
        const card = h('button', { class: 'syl-card' }, h('div', { class: 'e' }, e), h('div', { class: 'w' }, w), chips);
        /* la parola viene detta sillaba per sillaba, con le sillabe che si accendono */
        async function spell() {
          sfx.tap();
          const ch = [...chips.children];
          say(T.syl(s), { lang: l, rate: .8 });
          for (let i = 0; i < ch.length; i++) {
            ch[i].classList.add('on'); clapTone();
            await wait(520);
          }
          await wait(400);
          ch.forEach(c => c.classList.remove('on'));
        }
        card.onclick = spell;
        const answers = h('div', { class: 'syl-answers' });
        let first = true;
        for (let k = 1; k <= maxSyl; k++) {
          const b = h('button', {}, h('b', {}, k), h('span', {}, '👏'.repeat(k)));
          b.onclick = async () => {
            if (first) { App.track('suoni', null, k === n); first = false; }
            if (k === n) {
              answers.querySelectorAll('button').forEach(x => { x.disabled = true; });
              b.classList.add('ok');
              sfx.ding();
              [...chips.children].forEach(c => c.classList.add('on'));
              await say(T.syl(s), { lang: l, rate: .8 });
              const r = b.getBoundingClientRect();
              if (alive) success(r.left + r.width / 2, r.top);
            } else {
              sfx.boing();
              b.classList.add('shake');
              setTimeout(() => b.classList.remove('shake'), 500);
              spell();
            }
          };
          answers.append(b);
        }
        stage.append(card, answers);
        replay = () => say(T.howMany(w), { lang: l });
        lastSteps = [
          { text: T.tutSyl[0], icon: '👂', action: 'tap', at: () => card, cap: 'top' },
          { text: T.tutSyl[1], icon: '👏', action: 'tap', at: () => answers.children[n - 1], cap: 'top' },
        ];
        App.intro('suoni-sillabe', lastSteps).then(() => alive && say(T.howMany(w), { lang: l }));
      }

      /* 2) rime */
      function rhymes() {
        const l = App.lang, T = TX[l];
        const pairs = shuffle(RHYME[l]);
        const [target, ok] = shuffle(pairs[0]);
        const nOpt = lv >= 2 ? 3 : 2;
        const others = pairs.slice(1).map(p => pick(p)).slice(0, nOpt - 1);
        const opts = shuffle([ok, ...others]);
        const tgt = h('button', { class: 'rhy-target', onclick: () => { sfx.tap(); say(App.excl(cap(target[1]), l), { lang: l }); } },
          h('span', { class: 'e' }, target[0]), h('span', { class: 'w' }, target[1]));
        const row = h('div', { class: 'rhy-opts' });
        let first = true;
        opts.forEach(o => {
          const b = h('button', { class: 'rhy-opt' }, h('span', { class: 'e' }, o[0]), h('span', { class: 'w' }, o[1]));
          b.onclick = async () => {
            if (first) { App.track('suoni', null, o === ok); first = false; }
            if (o === ok) {
              row.querySelectorAll('button').forEach(x => { x.disabled = true; });
              b.classList.add('ok');
              sfx.ding();
              await say(T.rhymeOk(target[1], ok[1]), { lang: l });
              const r = b.getBoundingClientRect();
              if (alive) success(r.left + r.width / 2, r.top);
            } else {
              sfx.boing();
              b.classList.add('shake');
              setTimeout(() => b.classList.remove('shake'), 500);
              say(App.excl(cap(o[1]), l), { lang: l }).then(() => alive && say(T.rhymeQ(target[1]), { lang: l, queue: true }));
            }
          };
          row.append(b);
        });
        stage.append(tgt, h('div', { class: 'rhy-eq' }, '🎵 = 🎵 ?'), row);
        replay = () => say(T.rhymeQ(target[1]), { lang: l });
        lastSteps = [
          { text: T.tutRhyme[0], icon: '👂', action: 'tap', at: () => tgt, cap: 'top' },
          { text: T.tutRhyme[1], icon: '🎵', action: 'tap', at: () => row.children[opts.indexOf(ok)], cap: 'top' },
        ];
        App.intro('suoni-rime', lastSteps).then(() => alive && say(T.rhymeQ(target[1]), { lang: l }));
      }

      function next() {
        if (!alive) return;
        [...stage.children].forEach(c => c.remove());
        App.nextLang();
        if (turn++ % 2 === 0) syllables(); else rhymes();
      }

      requestAnimationFrame(next);
      return () => { alive = false; };
    },
  });
})();
