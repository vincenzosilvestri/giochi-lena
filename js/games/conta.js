/* Conta con Lena / Compte avec Lena — numeri da 1 a 10: "quanti ne vedi?" e "toccane N". Bilingue FR/IT. */
(() => {
  const { h, say, sfx, rint, pick, shuffle, wait } = App;
  /* s/p = singolare/plurale, f = femminile (per lingua) */
  const THINGS = [
    { e: '🍎', it: { s: 'mela', p: 'mele', f: 1 }, fr: { s: 'pomme', p: 'pommes', f: 1 } },
    { e: '🍓', it: { s: 'fragola', p: 'fragole', f: 1 }, fr: { s: 'fraise', p: 'fraises', f: 1 } },
    { e: '⭐', it: { s: 'stella', p: 'stelle', f: 1 }, fr: { s: 'étoile', p: 'étoiles', f: 1 } },
    { e: '🐟', it: { s: 'pesce', p: 'pesci', f: 0 }, fr: { s: 'poisson', p: 'poissons', f: 0 } },
    { e: '🎈', it: { s: 'palloncino', p: 'palloncini', f: 0 }, fr: { s: 'ballon', p: 'ballons', f: 0 } },
    { e: '🦋', it: { s: 'farfalla', p: 'farfalle', f: 1 }, fr: { s: 'papillon', p: 'papillons', f: 0 } },
    { e: '🌸', it: { s: 'fiore', p: 'fiori', f: 0 }, fr: { s: 'fleur', p: 'fleurs', f: 1 } },
    { e: '🍪', it: { s: 'biscotto', p: 'biscotti', f: 0 }, fr: { s: 'biscuit', p: 'biscuits', f: 0 } },
    { e: '🐞', it: { s: 'coccinella', p: 'coccinelle', f: 1 }, fr: { s: 'coccinelle', p: 'coccinelles', f: 1 } },
    { e: '🚗', it: { s: 'macchinina', p: 'macchinine', f: 1 }, fr: { s: 'voiture', p: 'voitures', f: 1 } },
    { e: '🐥', it: { s: 'pulcino', p: 'pulcini', f: 0 }, fr: { s: 'poussin', p: 'poussins', f: 0 } },
    { e: '🍌', it: { s: 'banana', p: 'banane', f: 1 }, fr: { s: 'banane', p: 'bananes', f: 1 } },
  ];
  const MAX_BY_LEVEL = [5, 5, 6, 8, 10];
  const ROUND = 5;
  const TX = {
    it: {
      how: w => `${w.f ? 'Quante' : 'Quanti'} ${w.p} vedi?`, howShort: w => (w.f ? 'Quante' : 'Quanti'),
      retry: w => `Riprova! Tocca ${w.f ? 'le' : 'i'} ${w.p} per contarl${w.f ? 'e' : 'i'}.`,
      touch1: w => `Tocca ${w.f ? 'una' : 'un'} ${w.s}!`, touchN: (n, w) => `Tocca ${n} ${w.p}!`, touchShort: 'Tocca',
      tut: ['Tocca le cose per contarle: uno, due, tre...', 'Poi tocca il numero giusto qui sotto!',
        'Guarda il numero: ti dice quante cose prendere.', 'Tocca le cose per metterle nel cestino!'],
    },
    fr: {
      how: w => `Combien de ${w.p} vois-tu ?`, howShort: () => 'Combien de',
      retry: w => `Essaie encore ! Touche les ${w.p} pour les compter.`,
      touch1: w => `Touche ${w.f ? 'une' : 'un'} ${w.s} !`, touchN: (n, w) => `Touche ${n} ${w.p} !`, touchShort: 'Touche',
      tut: ['Touche les objets pour les compter : un, deux, trois...', 'Puis touche le bon nombre en bas !',
        "Regarde le nombre : il te dit combien d'objets prendre.", 'Touche les objets pour les mettre dans le panier !'],
    },
  };
  const tx = () => TX[App.lang];

  App.registerGame({
    id: 'conta', title: { fr: 'Compte avec Lena', it: 'Conta con Lena' }, short: 'Conta', icon: '🔢',
    phrases: l => {
      const T = TX[l], bang = l === 'fr' ? ' !' : '!';
      const out = [...T.tut];
      for (let n = 1; n <= 10; n++) out.push(App.numWord(n, 0, l), App.numWord(n, 1, l), App.numWord(n, 0, l) + bang, App.numWord(n, 1, l) + bang);
      THINGS.forEach(th => {
        const w = th[l];
        out.push(T.how(w), T.retry(w), T.touch1(w));
        for (let n = 2; n <= 10; n++) out.push(T.touchN(n, w));
      });
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
          if (lv < MAX_BY_LEVEL.length - 1) { lv++; App.setLevel('conta', lv); }
        }
        await wait(300);
        next();
      }

      function askHowMany(th, max) {
        const w = th[App.lang], T = tx();
        const n = rint(lv === 1 ? 1 : 2, max);
        prompt.innerHTML = '';
        prompt.append(`${T.howShort(w)} `, h('span', { class: 'pic' }, th.e), ' ?');
        let counted = 0;
        let first = true;
        place(n, th, b => {
          if (b.classList.contains('done')) return;
          counted++;
          b.classList.add('done');
          b.append(h('span', { class: 'n' }, counted));
          sfx.tap();
          say(App.numWord(counted, w.f));
        });
        const opts = new Set([n]);
        while (opts.size < 3) { const v = rint(1, Math.max(max, 4)); if (v !== n) opts.add(v); }
        let locked = false;
        [...opts].sort((a, b) => a - b).forEach(v => {
          const b = h('button', {}, String(v));
          b.onclick = async () => {
            if (locked) return;
            if (first) { App.track('numbers', n, v === n); first = false; }
            if (v === n) {
              locked = true;
              b.classList.add('ok');
              const r = b.getBoundingClientRect();
              await success(r.left + r.width / 2, r.top);
            } else {
              sfx.boing();
              b.classList.add('shake');
              setTimeout(() => b.classList.add('gone'), 450);
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
            App.track('numbers', n, true);
            const br = basket.getBoundingClientRect();
            setTimeout(() => alive && success(br.left + br.width / 2, br.top), 600);
          }
        });
        ask(n === 1 ? T.touch1(w) : T.touchN(n, w), 'conta2', [
          { text: T.tut[2], icon: '🔢', action: 'tap', at: () => prompt },
          { text: T.tut[3], icon: '🧺', action: 'tap', at: () => field.querySelector('.conta-item'), cap: 'top' },
        ]);
      }

      function next() {
        if (!alive) return;
        App.nextLang();
        field.innerHTML = '';
        answers.innerHTML = '';
        const max = MAX_BY_LEVEL[Math.min(lv, MAX_BY_LEVEL.length - 1)];
        const th = pick(THINGS);
        if (lv >= 2 && Math.random() < .5) touchN(th, max);
        else askHowMany(th, max);
      }

      requestAnimationFrame(next);
      return () => { alive = false; };
    },
  });
})();
