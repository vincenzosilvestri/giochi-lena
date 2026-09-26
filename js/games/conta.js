/* Conta con Lena / Compte avec Lena — numeri da 1 a 10: "quanti ne vedi?" e "toccane N". Bilingue FR/IT. */
(() => {
  const { h, say, sfx, rint, pick, shuffle, wait } = App;
  /* s/p = singolare/plurale, f = femminile (per lingua) */
  /* s/p = singolare/plurale, f = femminile, g = genere tedesco (m/f/n) */
  const THINGS = [
    { e: '🍎', it: { s: 'mela', p: 'mele', f: 1 }, fr: { s: 'pomme', p: 'pommes', f: 1 }, de: { s: 'Apfel', p: 'Äpfel', g: 'm' }, en: { s: 'apple', p: 'apples' }, es: { s: 'manzana', p: 'manzanas', f: 1 } },
    { e: '🍓', it: { s: 'fragola', p: 'fragole', f: 1 }, fr: { s: 'fraise', p: 'fraises', f: 1 }, de: { s: 'Erdbeere', p: 'Erdbeeren', g: 'f' }, en: { s: 'strawberry', p: 'strawberries' }, es: { s: 'fresa', p: 'fresas', f: 1 } },
    { e: '⭐', it: { s: 'stella', p: 'stelle', f: 1 }, fr: { s: 'étoile', p: 'étoiles', f: 1 }, de: { s: 'Stern', p: 'Sterne', g: 'm' }, en: { s: 'star', p: 'stars' }, es: { s: 'estrella', p: 'estrellas', f: 1 } },
    { e: '🐟', it: { s: 'pesce', p: 'pesci', f: 0 }, fr: { s: 'poisson', p: 'poissons', f: 0 }, de: { s: 'Fisch', p: 'Fische', g: 'm' }, en: { s: 'fish', p: 'fish' }, es: { s: 'pez', p: 'peces', f: 0 } },
    { e: '🎈', it: { s: 'palloncino', p: 'palloncini', f: 0 }, fr: { s: 'ballon', p: 'ballons', f: 0 }, de: { s: 'Luftballon', p: 'Luftballons', g: 'm' }, en: { s: 'balloon', p: 'balloons' }, es: { s: 'globo', p: 'globos', f: 0 } },
    { e: '🦋', it: { s: 'farfalla', p: 'farfalle', f: 1 }, fr: { s: 'papillon', p: 'papillons', f: 0 }, de: { s: 'Schmetterling', p: 'Schmetterlinge', g: 'm' }, en: { s: 'butterfly', p: 'butterflies' }, es: { s: 'mariposa', p: 'mariposas', f: 1 } },
    { e: '🌸', it: { s: 'fiore', p: 'fiori', f: 0 }, fr: { s: 'fleur', p: 'fleurs', f: 1 }, de: { s: 'Blume', p: 'Blumen', g: 'f' }, en: { s: 'flower', p: 'flowers' }, es: { s: 'flor', p: 'flores', f: 1 } },
    { e: '🍪', it: { s: 'biscotto', p: 'biscotti', f: 0 }, fr: { s: 'biscuit', p: 'biscuits', f: 0 }, de: { s: 'Keks', p: 'Kekse', g: 'm' }, en: { s: 'biscuit', p: 'biscuits' }, es: { s: 'galleta', p: 'galletas', f: 1 } },
    { e: '🐞', it: { s: 'coccinella', p: 'coccinelle', f: 1 }, fr: { s: 'coccinelle', p: 'coccinelles', f: 1 }, de: { s: 'Marienkäfer', p: 'Marienkäfer', g: 'm' }, en: { s: 'ladybird', p: 'ladybirds' }, es: { s: 'mariquita', p: 'mariquitas', f: 1 } },
    { e: '🚗', it: { s: 'macchinina', p: 'macchinine', f: 1 }, fr: { s: 'voiture', p: 'voitures', f: 1 }, de: { s: 'Auto', p: 'Autos', g: 'n' }, en: { s: 'car', p: 'cars' }, es: { s: 'coche', p: 'coches', f: 0 } },
    { e: '🐥', it: { s: 'pulcino', p: 'pulcini', f: 0 }, fr: { s: 'poussin', p: 'poussins', f: 0 }, de: { s: 'Küken', p: 'Küken', g: 'n' }, en: { s: 'chick', p: 'chicks' }, es: { s: 'pollito', p: 'pollitos', f: 0 } },
    { e: '🍌', it: { s: 'banana', p: 'banane', f: 1 }, fr: { s: 'banane', p: 'bananes', f: 1 }, de: { s: 'Banane', p: 'Bananen', g: 'f' }, en: { s: 'banana', p: 'bananas' }, es: { s: 'plátano', p: 'plátanos', f: 0 } },
  ];
  const MAX_BY_LEVEL = [5, 5, 6, 8, 10];
  const ROUND = 5;
  const DE_EIN = { m: 'einen', f: 'eine', n: 'ein' };
  const TX = {
    it: {
      how: w => `${w.f ? 'Quante' : 'Quanti'} ${w.p} vedi?`, howShort: w => (w.f ? 'Quante' : 'Quanti'),
      retry: w => `Riprova! Tocca ${w.f ? 'le' : 'i'} ${w.p} per contarl${w.f ? 'e' : 'i'}.`,
      touch1: w => `Tocca ${w.f ? 'una' : 'un'} ${w.s}!`, touchN: (n, w) => `Tocca ${n} ${w.p}!`, touchShort: 'Tocca',
      tut: ['Tocca le cose per contarle: uno, due, tre...', 'Poi tocca il numero giusto qui sotto!',
        'Guarda il numero: ti dice quante cose prendere.', 'Tocca le cose per metterle nel cestino!'],
    },
    fr: {
      how: w => `Combien ${/^[aeiouyéèêh]/i.test(w.p) ? "d'" : 'de '}${w.p} vois-tu ?`, howShort: () => 'Combien de',
      retry: w => `Essaie encore ! Touche les ${w.p} pour les compter.`,
      touch1: w => `Touche ${w.f ? 'une' : 'un'} ${w.s} !`, touchN: (n, w) => `Touche ${n} ${w.p} !`, touchShort: 'Touche',
      tut: ['Touche les objets pour les compter : un, deux, trois...', 'Puis touche le bon nombre en bas !',
        "Regarde le nombre : il te dit combien d'objets prendre.", 'Touche les objets pour les mettre dans le panier !'],
    },
    de: {
      how: w => `Wie viele ${w.p} siehst du?`, howShort: () => 'Wie viele',
      retry: w => `Versuch es nochmal! Tippe auf die ${w.p}, um sie zu zählen.`,
      touch1: w => `Tippe auf ${DE_EIN[w.g]} ${w.s}!`, touchN: (n, w) => `Tippe auf ${n} ${w.p}!`, touchShort: 'Tippe auf',
      tut: ['Tippe auf die Dinge, um sie zu zählen: eins, zwei, drei...', 'Dann tippe unten auf die richtige Zahl!',
        'Schau dir die Zahl an: Sie sagt dir, wie viele Dinge du nehmen sollst.', 'Tippe auf die Dinge, um sie in den Korb zu legen!'],
    },
    en: {
      how: w => `How many ${w.p} can you see?`, howShort: () => 'How many',
      retry: w => `Try again! Tap the ${w.p} to count them.`,
      touch1: w => `Tap one ${w.s}!`, touchN: (n, w) => `Tap ${n} ${w.p}!`, touchShort: 'Tap',
      tut: ['Tap the things to count them: one, two, three...', 'Then tap the right number below!',
        'Look at the number: it tells you how many things to take.', 'Tap the things to put them in the basket!'],
    },
    es: {
      how: w => `¿Cuánt${w.f ? 'as' : 'os'} ${w.p} ves?`, howShort: w => `¿Cuánt${w.f ? 'as' : 'os'}`,
      retry: w => `¡Inténtalo otra vez! Toca ${w.f ? 'las' : 'los'} ${w.p} para contar${w.f ? 'las' : 'los'}.`,
      touch1: w => `¡Toca ${w.f ? 'una' : 'un'} ${w.s}!`, touchN: (n, w) => `¡Toca ${n} ${w.p}!`, touchShort: 'Toca',
      tut: ['Toca las cosas para contarlas: uno, dos, tres...', '¡Luego toca el número correcto abajo!',
        'Mira el número: te dice cuántas cosas tomar.', '¡Toca las cosas para ponerlas en la cesta!'],
    },
  };
  /* addizioni e sottrazioni entro 10 (numeri detti come parole) */
  const N = (l, x) => App.NUM[l][x];
  const ARITH = {
    it: { q: (a, b, m) => `${N('it', a)} ${m ? 'meno' : 'più'} ${N('it', b)}?`, ans: (a, b, c, m) => `${N('it', a)} ${m ? 'meno' : 'più'} ${N('it', b)} fa ${N('it', c)}!`,
      tut: ['Guarda: alcune cose arrivano, altre vanno via. Contale!', 'Poi tocca il numero giusto!'] },
    fr: { q: (a, b, m) => `${N('fr', a)} ${m ? 'moins' : 'plus'} ${N('fr', b)} ?`, ans: (a, b, c, m) => `${N('fr', a)} ${m ? 'moins' : 'plus'} ${N('fr', b)}, ça fait ${N('fr', c)} !`,
      tut: ["Regarde : des objets arrivent, d'autres s'en vont. Compte-les !", 'Puis touche le bon nombre !'] },
    de: { q: (a, b, m) => `${N('de', a)} ${m ? 'minus' : 'plus'} ${N('de', b)}?`, ans: (a, b, c, m) => `${N('de', a)} ${m ? 'minus' : 'plus'} ${N('de', b)} ist ${N('de', c)}!`,
      tut: ['Schau: Manche Dinge kommen dazu, andere gehen weg. Zähl sie!', 'Dann tippe auf die richtige Zahl!'] },
    en: { q: (a, b, m) => `${N('en', a)} ${m ? 'take away' : 'plus'} ${N('en', b)}?`, ans: (a, b, c, m) => `${N('en', a)} ${m ? 'take away' : 'plus'} ${N('en', b)} ${m ? 'leaves' : 'makes'} ${N('en', c)}!`,
      tut: ['Look: some things arrive, some go away. Count them!', 'Then tap the right number!'] },
    es: { q: (a, b, m) => `¿${N('es', a)} ${m ? 'menos' : 'más'} ${N('es', b)}?`, ans: (a, b, c, m) => `¡${N('es', a)} ${m ? 'menos' : 'más'} ${N('es', b)} son ${N('es', c)}!`,
      tut: ['Mira: unas cosas llegan y otras se van. ¡Cuéntalas!', '¡Luego toca el número correcto!'] },
  };
  const tx = () => TX[App.lang];

  App.registerGame({
    id: 'conta', title: { fr: 'Compte avec Lena', it: 'Conta con Lena', de: 'Zähl mit Lena', en: 'Count with Lena', es: 'Cuenta con Lena' }, short: 'Conta', icon: '🔢',
    phrases: l => {
      const T = TX[l];
      const out = [...T.tut];
      for (let n = 1; n <= 10; n++) out.push(App.numWord(n, 0, l), App.numWord(n, 1, l));
      THINGS.forEach(th => {
        const w = th[l];
        out.push(T.how(w), T.retry(w), T.touch1(w));
        for (let n = 2; n <= 10; n++) out.push(T.touchN(n, w));
      });
      const A = ARITH[l];
      out.push(...A.tut);
      for (let a = 1; a <= 5; a++) for (let b = 1; b <= Math.min(5, 10 - a); b++) out.push(A.q(a, b, 0), A.ans(a, b, a + b, 0));
      for (let a = 3; a <= 7; a++) for (let b = 1; b < a; b++) out.push(A.q(a, b, 1), A.ans(a, b, a - b, 1));
      return out;
    },
    start({ stage, addPill, setHelp }) {
      let alive = true;
      let lv = App.level('conta');
      let good = 0;
      let lastQ = '';
      let lastSteps = [];
      /* dice la domanda, preceduta dal tutorial la prima volta */
      function ask(text, tutId, steps) {
        lastQ = text;
        lastSteps = steps;
        App.intro(tutId, steps).then(() => alive && say(text));
      }
      setHelp(() => App.tutorial(lastSteps).then(() => alive && say(lastQ)));
      const pill = addPill(`⭐ 0/${ROUND}`);
      const prompt = h('div', { class: 'prompt' });
      const field = h('div', { class: 'conta-field' });
      const answers = h('div', { class: 'conta-answers' });
      stage.append(prompt, field, answers);

      function place(cnt, th, onTap) {
        const r = field.getBoundingClientRect();
        const cols = cnt > 9 ? 4 : 3;
        const rows = Math.ceil(cnt / cols) + 1;
        const cw = r.width / cols, chh = r.height / rows;
        const size = Math.min(58, cw * .62, chh * .62);
        const cells = shuffle([...Array(cols * rows).keys()]).slice(0, cnt);
        return cells.map(c => {
          const x = (c % cols + .5 + (Math.random() - .5) * .3) * cw;
          const y = (Math.floor(c / cols) + .5 + (Math.random() - .5) * .3) * chh;
          const b = h('button', { class: 'conta-item', style: `left:${x}px;top:${y}px;font-size:${size}px;background:none` }, th.e);
          b.addEventListener('click', () => onTap(b));
          field.append(b);
          return b;
        });
      }

      async function success(x, y) {
        good++;
        pill.textContent = `⭐ ${good}/${ROUND}`;
        sfx.ding();
        App.addStars(1, x, y);
        await App.praise();
        if (!alive) return;
        if (good >= ROUND) {
          await App.reward();
          if (!alive) return;
          good = 0; pill.textContent = `⭐ 0/${ROUND}`;
          if (lv < MAX_BY_LEVEL.length - 1) { lv++; App.levelUp('conta', lv); }
        }
        await wait(300);
        next();
      }

      function askHowMany(th, max) {
        const w = th[App.lang], T = tx();
        const lo = lv === 1 ? 1 : 2;
        const n = App.adaptivePick([...Array(max - lo + 1).keys()].map(i => i + lo), 'numbers');
        prompt.innerHTML = '';
        prompt.append(`${T.howShort(w)} `, h('span', { class: 'pic' }, th.e), ' ?');
        let counted = 0;
        let first = true;
        const items = place(n, th, b => {
          if (b.classList.contains('done')) return;
          counted++;
          b.classList.add('done');
          b.append(h('span', { class: 'n' }, counted));
          sfx.tap();
          say(App.numWord(counted, w.f));
        });
        const opts = new Set([n]);
        /* dal livello 3 le risposte sbagliate sono vicine a quella giusta: non si indovina a colpo d'occhio */
        const near = [n - 2, n - 1, n + 1, n + 2].filter(v => v >= 1 && v <= Math.min(10, Math.max(max, 4) + 1));
        while (opts.size < 3) { const v = lv >= 3 && near.length ? pick(near) : rint(1, Math.max(max, 4)); if (v !== n) opts.add(v); }
        let locked = false;
        [...opts].sort((a, b) => a - b).forEach(v => {
          const b = h('button', {}, String(v));
          b.onclick = async () => {
            if (locked) return;
            if (first) { App.track('numeri', n, v === n); first = false; }
            if (v === n) {
              locked = true;
              b.classList.add('ok');
              const r = b.getBoundingClientRect();
              await success(r.left + r.width / 2, r.top);
            } else {
              sfx.boing();
              b.classList.add('shake');
              setTimeout(() => b.classList.add('gone'), 450);
              /* si riconta da capo */
              counted = 0;
              items.forEach(it => { it.classList.remove('done'); const nn = it.querySelector('.n'); if (nn) nn.remove(); });
              say(T.retry(w));
            }
          };
          answers.append(b);
        });
        ask(T.how(w), 'conta', [
          { text: T.tut[0], icon: '👆', action: 'tap', at: () => field.querySelector('.conta-item'), cap: 'top' },
          { text: T.tut[1], icon: '🔢', action: 'tap', at: () => answers.children[1], cap: 'top' },
        ]);
      }

      function touchN(th, max) {
        const w = th[App.lang], T = tx();
        const n = rint(2, max);
        const total = Math.min(n + rint(2, 4), 13);
        prompt.innerHTML = '';
        prompt.append(`${T.touchShort} `, h('b', { style: 'font-size:36px;color:var(--accent-dark)' }, n), ' ', h('span', { class: 'pic' }, th.e));
        const basket = h('div', { class: 'basket' }, '🧺 0');
        answers.append(basket);
        let got = 0;
        place(total, th, b => {
          if (got >= n || b.style.visibility === 'hidden') return;
          got++;
          const r = b.getBoundingClientRect();
          App.floatAt(r.left + r.width / 2, r.top + r.height / 2, th.e);
          b.style.visibility = 'hidden';
          basket.textContent = `🧺 ${got}`;
          sfx.pop();
          say(App.numWord(got, w.f));
          if (got === n) {
            App.track('numeri', n, true);
            const br = basket.getBoundingClientRect();
            setTimeout(() => alive && success(br.left + br.width / 2, br.top), 600);
          }
        });
        ask(n === 1 ? T.touch1(w) : T.touchN(n, w), 'conta2', [
          { text: T.tut[2], icon: '🔢', action: 'tap', at: () => prompt },
          { text: T.tut[3], icon: '🧺', action: 'tap', at: () => field.querySelector('.conta-item'), cap: 'top' },
        ]);
      }

      /* 3) "tre più due?" / "cinque meno due?": le cose arrivano o vanno via davanti ai suoi occhi */
      function arith(th) {
        const l = App.lang, A = ARITH[l];
        const minus = lv >= 4 && Math.random() < .5;
        let a, b, c;
        if (minus) { a = rint(3, 7); b = rint(1, a - 1); c = a - b; } else { a = rint(1, 5); b = rint(1, Math.min(5, 10 - a)); c = a + b; }
        prompt.innerHTML = '';
        prompt.append(h('span', { class: 'pic' }, th.e), h('b', { class: 'eq' }, `${a} ${minus ? '−' : '+'} ${b} = ?`));
        const items = place(minus ? a : a + b, th, () => {});
        if (!minus) items.slice(a).forEach((it, i) => { it.classList.add('arrive'); it.style.animationDelay = `${.9 + i * .25}s`; });
        else setTimeout(() => items.slice(0, b).forEach((it, i) => setTimeout(() => { it.classList.add('leave'); sfx.pop(); }, i * 250)), 1400);
        const opts = new Set([c]);
        while (opts.size < 3) { const v = rint(Math.max(0, c - 3), Math.min(10, c + 3)); if (v !== c) opts.add(v); }
        let first = true, locked = false;
        [...opts].sort((x, y) => x - y).forEach(v => {
          const btn = h('button', {}, String(v));
          btn.onclick = async () => {
            if (locked) return;
            if (first) { App.track('numeri', null, v === c); first = false; }
            if (v === c) {
              locked = true;
              btn.classList.add('ok');
              sfx.ding();
              await say(A.ans(a, b, c, minus), { lang: l });
              const r = btn.getBoundingClientRect();
              if (alive) success(r.left + r.width / 2, r.top);
            } else {
              sfx.boing();
              btn.classList.add('shake');
              setTimeout(() => btn.classList.add('gone'), 450);
              say(A.q(a, b, minus), { lang: l });
            }
          };
          answers.append(btn);
        });
        ask(A.q(a, b, minus), 'conta3', [
          { text: A.tut[0], icon: '➕', action: 'tap', at: () => field, cap: 'top' },
          { text: A.tut[1], icon: '🔢', action: 'tap', at: () => answers.children[1], cap: 'top' },
        ]);
      }

      function next() {
        if (!alive) return;
        App.nextLang();
        field.innerHTML = '';
        answers.innerHTML = '';
        const max = MAX_BY_LEVEL[Math.min(lv, MAX_BY_LEVEL.length - 1)];
        const th = pick(THINGS);
        const r = Math.random();
        if (lv >= 2 && r < .3) arith(th);
        else if (lv >= 2 && r < .65) touchN(th, max);
        else askHowMany(th, max);
      }

      requestAnimationFrame(next);
      return () => { alive = false; };
    },
  });
})();
