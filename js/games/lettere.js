/* Pesca le Lettere / Pêche les lettres — riconoscere le lettere e l'iniziale delle parole, poi comporre un nome. Bilingue FR/IT. */
(() => {
  const { h, say, sfx, rint, pick, shuffle } = App;
  const LETTER_NAME = {
    A: 'a', B: 'bi', C: 'ci', D: 'di', E: 'e', F: 'effe', G: 'gi', H: 'acca', I: 'i', J: 'i lunga', K: 'cappa',
    L: 'elle', M: 'emme', N: 'enne', O: 'o', P: 'pi', Q: 'cu', R: 'erre', S: 'esse', T: 'ti', U: 'u', V: 'vu',
    W: 'doppia vu', X: 'ics', Y: 'ipsilon', Z: 'zeta',
  };
  /* in italiano si dice il nome della lettera ("elle"), in francese la lettera stessa, letta dalla voce */
  const ln = (L, l) => (l === 'it' ? LETTER_NAME[L] : L);
  const WORDS = {
    it: {
      A: [['Ape', '🐝'], ['Arancia', '🍊']], B: [['Balena', '🐳'], ['Banana', '🍌']], C: [['Casa', '🏠'], ['Cuore', '❤️']],
      D: [['Dado', '🎲'], ['Delfino', '🐬']], E: [['Elefante', '🐘'], ['Erba', '🌿']], F: [['Fiore', '🌸'], ['Fragola', '🍓']],
      G: [['Gatto', '🐱'], ['Gelato', '🍦']], I: [['Isola', '🏝️'], ['Igloo', '🧊']], L: [['Luna', '🌙'], ['Lena', '👧'], ['Leone', '🦁']],
      M: [['Mela', '🍎'], ['Mucca', '🐮']], N: [['Nave', '🚢'], ['Neve', '❄️']], O: [['Orso', '🐻'], ['Occhiali', '👓']],
      P: [['Pesce', '🐟'], ['Papà', '👨'], ['Palla', '⚽']], R: [['Rana', '🐸'], ['Razzo', '🚀']], S: [['Sole', '☀️'], ['Stella', '⭐']],
      T: [['Topo', '🐭'], ['Torta', '🎂']], U: [['Uva', '🍇'], ['Uovo', '🥚']], V: [['Volpe', '🦊'], ['Vulcano', '🌋']],
      Z: [['Zebra', '🦓'], ['Zucca', '🎃']],
    },
    fr: {
      A: [['Abeille', '🐝'], ['Avion', '✈️']], B: [['Ballon', '🎈'], ['Baleine', '🐳']], C: [['Chat', '🐱'], ['Cœur', '❤️']],
      D: [['Dauphin', '🐬'], ['Dé', '🎲']], E: [['Escargot', '🐌'], ['Enveloppe', '✉️']], F: [['Fleur', '🌸'], ['Fraise', '🍓']],
      G: [['Gâteau', '🎂'], ['Girafe', '🦒']], I: [['Igloo', '🧊'], ['Iguane', '🦎']], L: [['Lune', '🌙'], ['Lena', '👧'], ['Lion', '🦁']],
      M: [['Maison', '🏠'], ['Mouton', '🐑']], N: [['Nuage', '☁️'], ['Nez', '👃']], O: [['Oiseau', '🐦'], ['Orange', '🍊']],
      P: [['Pomme', '🍎'], ['Papa', '👨'], ['Poisson', '🐟']], R: [['Renard', '🦊'], ['Robot', '🤖']], S: [['Soleil', '☀️'], ['Serpent', '🐍']],
      T: [['Tortue', '🐢'], ['Tomate', '🍅']], U: [['Usine', '🏭']], V: [['Vache', '🐮'], ['Vélo', '🚲']],
      Z: [['Zèbre', '🦓'], ['Zéro', '0️⃣']],
    },
    de: {
      A: [['Affe', '🐒'], ['Apfel', '🍎']], B: [['Ball', '⚽'], ['Banane', '🍌']], C: [['Clown', '🤡'], ['Computer', '💻']],
      D: [['Delfin', '🐬'], ['Dino', '🦕']], E: [['Elefant', '🐘'], ['Ente', '🦆']], F: [['Fisch', '🐟'], ['Frosch', '🐸']],
      G: [['Giraffe', '🦒'], ['Gurke', '🥒']], I: [['Igel', '🦔'], ['Insel', '🏝️']], L: [['Löwe', '🦁'], ['Lena', '👧'], ['Löffel', '🥄']],
      M: [['Maus', '🐭'], ['Mond', '🌙']], N: [['Nase', '👃'], ['Nashorn', '🦏']], O: [['Orange', '🍊'], ['Ohr', '👂']],
      P: [['Papa', '👨'], ['Pinguin', '🐧']], R: [['Rakete', '🚀'], ['Regenbogen', '🌈']], S: [['Sonne', '☀️'], ['Schaf', '🐑']],
      T: [['Tiger', '🐯'], ['Tomate', '🍅']], U: [['Uhr', '⏰'], ['Ufo', '🛸']], V: [['Vogel', '🐦'], ['Vulkan', '🌋']],
      Z: [['Zebra', '🦓'], ['Zug', '🚆']],
    },
    en: {
      A: [['Apple', '🍎'], ['Ant', '🐜']], B: [['Ball', '⚽'], ['Banana', '🍌']], C: [['Cat', '🐱'], ['Cake', '🎂']],
      D: [['Dog', '🐶'], ['Duck', '🦆']], E: [['Egg', '🥚'], ['Elephant', '🐘']], F: [['Fish', '🐟'], ['Frog', '🐸']],
      G: [['Giraffe', '🦒'], ['Grapes', '🍇']], I: [['Igloo', '🧊'], ['Ice cream', '🍦']], L: [['Lion', '🦁'], ['Lena', '👧'], ['Lemon', '🍋']],
      M: [['Moon', '🌙'], ['Mouse', '🐭']], N: [['Nose', '👃'], ['Nut', '🥜']], O: [['Owl', '🦉'], ['Orange', '🍊']],
      P: [['Pig', '🐷'], ['Penguin', '🐧']], R: [['Rabbit', '🐰'], ['Rainbow', '🌈']], S: [['Sun', '☀️'], ['Star', '⭐']],
      T: [['Tiger', '🐯'], ['Train', '🚆']], U: [['Umbrella', '☂️'], ['Unicorn', '🦄']], V: [['Van', '🚐'], ['Violin', '🎻']],
      Z: [['Zebra', '🦓']],
    },
    es: {
      A: [['Abeja', '🐝'], ['Avión', '✈️']], B: [['Ballena', '🐳'], ['Barco', '⛵']], C: [['Casa', '🏠'], ['Conejo', '🐰']],
      D: [['Dado', '🎲'], ['Delfín', '🐬']], E: [['Elefante', '🐘'], ['Estrella', '⭐']], F: [['Fresa', '🍓'], ['Flor', '🌸']],
      G: [['Gato', '🐱'], ['Globo', '🎈']], I: [['Iglú', '🧊'], ['Isla', '🏝️']], L: [['León', '🦁'], ['Lena', '👧'], ['Luna', '🌙']],
      M: [['Manzana', '🍎'], ['Mariposa', '🦋']], N: [['Nube', '☁️'], ['Nariz', '👃']], O: [['Oso', '🐻'], ['Oveja', '🐑']],
      P: [['Papá', '👨'], ['Pez', '🐟']], R: [['Ratón', '🐭'], ['Rana', '🐸']], S: [['Sol', '☀️'], ['Serpiente', '🐍']],
      T: [['Tortuga', '🐢'], ['Tren', '🚆']], U: [['Uva', '🍇'], ['Unicornio', '🦄']], V: [['Vaca', '🐮'], ['Volcán', '🌋']],
      Z: [['Zapato', '👟'], ['Zorro', '🦊']],
    },
  };
  const DAD = { it: 'Papà', fr: 'Papa', de: 'Papa', en: 'Daddy', es: 'Papá' };
  const TX = {
    it: {
      find: (L, w) => `Pesca la ${ln(L, 'it')} di ${w}!`, iam: L => `Io sono la ${ln(L, 'it')}!`,
      write: (n, L) => `Adesso scriviamo ${n}! Pesca la ${ln(L, 'it')}!`, first: L => `Prima la ${ln(L, 'it')}!`,
      now: L => `Ora la ${ln(L, 'it')}!`, again: L => `Ancora la ${ln(L, 'it')}!`,
      spelled: (w, n) => `${[...w].map(L => ln(L, 'it')).join(', ')}. ${n}! Hai scritto ${n}!`,
      tut: ['Ascolta la lettera: la vedi anche qui in alto.', 'Poi tocca il pesce con la lettera giusta!',
        'Scriviamo un nome! Le lettere vanno qui, in ordine.', 'Pesca le lettere una alla volta!'],
    },
    fr: {
      find: (L, w) => `Attrape le ${L} comme ${w} !`, iam: L => `Moi, je suis le ${L} !`,
      write: (n, L) => `On écrit ${n} ! Attrape le ${L} !`, first: L => `D'abord le ${L} !`,
      now: L => `Maintenant le ${L} !`, again: L => `Encore le ${L} !`,
      spelled: (w, n) => `${[...w].join(', ')}. ${n} ! Tu as écrit ${n} !`,
      tut: ['Écoute la lettre : tu la vois aussi ici, en haut.', 'Puis touche le poisson avec la bonne lettre !',
        'On écrit un prénom ! Les lettres vont ici, dans l\'ordre.', 'Attrape les lettres une par une !'],
    },
    de: {
      find: (L, w) => `Fang das ${L} wie ${w}!`, iam: L => `Ich bin das ${L}!`,
      write: (n, L) => `Wir schreiben ${n}! Fang das ${L}!`, first: L => `Zuerst das ${L}!`,
      now: L => `Jetzt das ${L}!`, again: L => `Noch einmal das ${L}!`,
      spelled: (w, n) => `${[...w].join(', ')}. ${n}! Du hast ${n} geschrieben!`,
      tut: ['Hör dir den Buchstaben an: Du siehst ihn auch hier oben.', 'Dann tippe auf den Fisch mit dem richtigen Buchstaben!',
        'Wir schreiben einen Namen! Die Buchstaben kommen hierhin, der Reihe nach.', 'Fang die Buchstaben einen nach dem anderen!'],
    },
    en: {
      find: (L, w) => `Catch the letter ${L}, like ${w}!`, iam: L => `I'm the letter ${L}!`,
      write: (n, L) => `Let's write ${n}! Catch the letter ${L}!`, first: L => `First the letter ${L}!`,
      now: L => `Now the letter ${L}!`, again: L => `The letter ${L} again!`,
      spelled: (w, n) => `${[...w].join(', ')}. ${n}! You wrote ${n}!`,
      tut: ['Listen to the letter: you can see it up here too.', 'Then tap the fish with the right letter!',
        "Let's write a name! The letters go here, in order.", 'Catch the letters one at a time!'],
    },
    es: {
      find: (L, w) => `¡Pesca la ${L} de ${w}!`, iam: L => `¡Yo soy la ${L}!`,
      write: (n, L) => `¡Vamos a escribir ${n}! ¡Pesca la ${L}!`, first: L => `¡Primero la ${L}!`,
      now: L => `¡Ahora la ${L}!`, again: L => `¡Otra vez la ${L}!`,
      spelled: (w, n) => `${[...w].join(', ')}. ¡${n}! ¡Has escrito ${n}!`,
      tut: ['Escucha la letra: también la ves aquí arriba.', '¡Luego toca el pez con la letra correcta!',
        '¡Vamos a escribir un nombre! Las letras van aquí, en orden.', '¡Pesca las letras una a una!'],
    },
  };
  const POOLS = [
    ['L', 'E', 'N', 'A'],
    ['L', 'E', 'N', 'A'],
    ['L', 'E', 'N', 'A', 'I', 'O', 'U', 'M', 'P'],
    Object.keys(WORDS.it),
  ];
  const FISH_COLORS = ['#ff7eb6', '#ffb341', '#7bd96b', '#b28dff', '#ff6b6b', '#4fd1c5', '#f6c945'];
  const ROUND = 6;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');

  function familyWords() {
    return App.media.photos.map(p => p.name).filter(Boolean).map(n => [n, '❤️']);
  }

  function fishSVG(color) {
    return `<svg class="body" viewBox="0 0 110 74" width="110" height="74">
      <polygon points="30,37 3,12 3,62" fill="${color}"/>
      <ellipse cx="62" cy="37" rx="46" ry="32" fill="${color}"/>
      <circle cx="90" cy="28" r="7" fill="#fff"/><circle cx="92" cy="28" r="3.5" fill="#333"/></svg>`;
  }

  App.registerGame({
    id: 'lettere', title: { fr: 'Pêche les lettres', it: 'Pesca le Lettere', de: 'Buchstaben angeln', en: 'Letter fishing', es: 'Pesca las letras' }, short: 'Lettere', icon: '🎣', cls: 'sea',
    phrases: l => {
      const T = TX[l];
      const out = [...T.tut];
      Object.entries(WORDS[l]).forEach(([L, list]) => list.forEach(([w]) => out.push(T.find(L, w))));
      Object.keys(LETTER_NAME).forEach(L => out.push(T.iam(L), T.first(L), T.now(L), T.again(L)));
      [App.NAME, DAD[l]].forEach(n => { const w = norm(n); out.push(T.write(n, w[0]), T.spelled(w, n)); });
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
      let lv = App.level('lettere');
      let good = 0;
      let fish = [];
      let raf = 0;
      let last = performance.now();
      let onCatch = null;
      const pill = addPill(`🐟 0/${ROUND}`);
      const prompt = h('div', { class: 'prompt' });
      stage.classList.add('sea');
      stage.append(prompt);
      for (let i = 0; i < 12; i++) {
        const s = rint(8, 22);
        stage.append(h('div', { class: 'bubble', style: `width:${s}px;height:${s}px;left:${rint(0, 100)}%;bottom:-30px;animation-duration:${rint(6, 14)}s;animation-delay:-${rint(0, 12)}s` }));
      }

      function spawn(letters) {
        fish.forEach(f => f.el.remove());
        const W = stage.clientWidth, H = stage.clientHeight;
        const top = H * .3, bottom = H * .88 - 74;
        const lanes = shuffle([...Array(letters.length).keys()]);
        fish = letters.map((L, i) => {
          const el = h('button', { class: 'fish', style: 'background:none;padding:0', html: fishSVG(pick(FISH_COLORS)) },
            h('span', { class: 'letter' }, L));
          const dir = Math.random() < .5 ? -1 : 1;
          const f = {
            el, L, dir,
            x: rint(0, Math.max(0, W - 110)),
            y: top + (bottom - top) * (lanes[i] / Math.max(1, letters.length - 1)),
            speed: rint(35, 60) + lv * 8, boost: 0, t: Math.random() * 6,
          };
          el.addEventListener('pointerdown', e => { e.preventDefault(); onCatch && onCatch(f); });
          stage.append(el);
          return f;
        });
      }

      function loop(now) {
        const dt = Math.min(.05, (now - last) / 1000);
        last = now;
        const W = stage.clientWidth;
        for (const f of fish) {
          if (f.caught) continue;
          f.t += dt;
          f.boost = Math.max(0, f.boost - dt);
          f.x += f.dir * f.speed * (f.boost ? 3 : 1) * dt;
          if (f.x > W + 20) f.x = -120;
          if (f.x < -130) f.x = W + 10;
          const yy = f.y + Math.sin(f.t * 2) * 8;
          f.el.style.transform = `translate(${f.x}px, ${yy}px)`;
          f.el.firstElementChild.style.transform = f.dir < 0 ? 'scaleX(-1)' : '';
          f.el.lastElementChild.style.marginLeft = f.dir < 0 ? '-12px' : '12px';
        }
        raf = requestAnimationFrame(loop);
      }

      function catchAnim(f) {
        f.caught = true;
        const r = prompt.getBoundingClientRect(), s = stage.getBoundingClientRect();
        f.el.classList.add('caught');
        f.el.style.transform = `translate(${r.left - s.left + r.width / 2 - 55}px, ${r.top - s.top}px) scale(.3)`;
        App.floatAt(r.left + r.width / 2, r.bottom, '✨');
      }

      /* domanda: trova la lettera iniziale */
      function question() {
        if (!alive) return;
        const l = App.nextLang(), T = TX[l];
        const pool = POOLS[Math.min(lv, POOLS.length - 1)].slice();
        const fam = lv >= 2 ? familyWords() : [];
        fam.forEach(([n]) => { const L = norm(n)[0]; if (L && !pool.includes(L)) pool.push(L); });
        const TL = pick(pool);
        const options = (WORDS[l][TL] || []).concat(fam.filter(([n]) => norm(n)[0] === TL));
        const [word, pic] = options.length ? pick(options) : [TL, '🔤'];
        const cnt = Math.min(3 + lv, 6);
        const others = shuffle(Object.keys(WORDS.it).filter(x => x !== TL));
        const pref = shuffle(pool.filter(x => x !== TL));
        const letters = shuffle([TL, TL].concat(pref.concat(others).filter((x, i, a) => a.indexOf(x) === i).slice(0, cnt - 2)));

        prompt.innerHTML = '';
        prompt.append(h('span', { class: 'pic' }, pic), h('span', { class: 'word', html: `<b>${word[0]}</b>${word.slice(1)}` }));
        spawn(letters);
        ask(T.find(TL, word), 'lettere', [
          { text: T.tut[0], icon: '👂', action: 'tap', at: () => prompt },
          { text: T.tut[1], icon: '🐟', action: 'tap', at: () => (fish.find(f => f.L === TL && !f.caught) || {}).el },
        ]);
        let first = true;

        onCatch = async f => {
          if (f.caught) return;
          if (first) { App.track('lettere', TL, f.L === TL); first = false; }
          if (f.L === TL) {
            onCatch = null;
            const fr = f.el.getBoundingClientRect();
            catchAnim(f);
            sfx.ding();
            App.addStars(1, fr.left + 55, fr.top);
            good++;
            pill.textContent = `🐟 ${good}/${ROUND}`;
            await App.praise();
            if (!alive) return;
            if (good >= ROUND) compose(); else question();
          } else {
            sfx.boing();
            f.boost = 1.2;
            say(T.iam(f.L));
          }
        };
      }

      /* bonus: comporre un nome lettera per lettera */
      function compose() {
        const l = App.nextLang(), T = TX[l];
        const names = [App.NAME].concat(lv >= 2 ? [DAD[l]].concat(familyWords().map(w => w[0])) : []);
        const shown = pick(names);
        const word = norm(shown);
        if (!word) return question();
        let idx = 0;
        const slots = h('div', { class: 'slots' }, [...word].map(() => h('i')));
        const mark = () => [...slots.children].forEach((s, i) => { s.classList.toggle('next', i === idx); });
        prompt.innerHTML = '';
        prompt.append(slots);
        mark();
        const uniq = [...new Set(word)];
        const extra = shuffle(Object.keys(WORDS.it).filter(x => !uniq.includes(x))).slice(0, 2);
        spawn(shuffle(uniq.concat(extra)));
        ask(T.write(shown, word[0]), 'compose', [
          { text: T.tut[2], icon: '✏️', action: 'tap', at: () => slots },
          { text: T.tut[3], icon: '🐟', action: 'tap', at: () => (fish.find(f => f.L === word[idx]) || {}).el },
        ]);

        onCatch = async f => {
          if (f.caught) return;
          const need = word[idx];
          if (f.L !== need) {
            sfx.boing(); f.boost = 1.2;
            say(T.first(need));
            return;
          }
          sfx.ding();
          const slot = slots.children[idx];
          slot.textContent = need; slot.classList.add('on');
          idx++;
          mark();
          f.boost = 1.5;
          if (idx < word.length) {
            say(word[idx] === need ? T.again(need) : T.now(word[idx]));
            return;
          }
          onCatch = null;
          const sr = slots.getBoundingClientRect();
          App.addStars(3, sr.left + sr.width / 2, sr.bottom);
          await say(T.spelled(word, shown), { rate: .85 });
          if (!alive) return;
          await App.reward();
          if (!alive) return;
          good = 0; pill.textContent = `🐟 0/${ROUND}`;
          if (lv < POOLS.length - 1) { lv++; App.levelUp('lettere', lv); }
          question();
        };
      }

      requestAnimationFrame(tt => { last = tt; question(); raf = requestAnimationFrame(loop); });
      return () => { alive = false; cancelAnimationFrame(raf); };
    },
  });
})();
