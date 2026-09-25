/* Conta con Lena — numeri da 1 a 10: "quanti ne vedi?" e "toccane N". */
(() => {
  const { h, say, sfx, rint, pick, shuffle, wait } = App;
  const THINGS = [
    { e: '🍎', s: 'mela', p: 'mele', f: 1 }, { e: '🍓', s: 'fragola', p: 'fragole', f: 1 },
    { e: '⭐', s: 'stella', p: 'stelle', f: 1 }, { e: '🐟', s: 'pesce', p: 'pesci', f: 0 },
    { e: '🎈', s: 'palloncino', p: 'palloncini', f: 0 }, { e: '🦋', s: 'farfalla', p: 'farfalle', f: 1 },
    { e: '🌸', s: 'fiore', p: 'fiori', f: 0 }, { e: '🍪', s: 'biscotto', p: 'biscotti', f: 0 },
    { e: '🐞', s: 'coccinella', p: 'coccinelle', f: 1 }, { e: '🚗', s: 'macchinina', p: 'macchinine', f: 1 },
    { e: '🐥', s: 'pulcino', p: 'pulcini', f: 0 }, { e: '🍌', s: 'banana', p: 'banane', f: 1 },
  ];
  const NUM = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci'];
  const numWord = (n, fem) => (n === 1 ? (fem ? 'una' : 'uno') : NUM[n]);
  const MAX_BY_LEVEL = [5, 5, 6, 8, 10];
  const ROUND = 5;

  App.registerGame({
    id: 'conta', title: 'Conta con Lena', short: 'Conta', icon: '🔢',
    start({ stage, addPill }) {
      let alive = true;
      let lv = App.level('conta');
      let good = 0;
      const pill = addPill(`⭐ 0/${ROUND}`);
      const prompt = h('div', { class: 'prompt' });
      const field = h('div', { class: 'conta-field' });
      const answers = h('div', { class: 'conta-answers' });
      stage.append(prompt, field, answers);

      function place(count, t, onTap) {
        const r = field.getBoundingClientRect();
        const cols = count > 9 ? 4 : 3;
        const rows = Math.ceil(count / cols) + 1;
        const cw = r.width / cols, chh = r.height / rows;
        const size = Math.min(58, cw * .62, chh * .62);
        const cells = shuffle([...Array(cols * rows).keys()]).slice(0, count);
        return cells.map(c => {
          const x = (c % cols + .5 + (Math.random() - .5) * .3) * cw;
          const y = (Math.floor(c / cols) + .5 + (Math.random() - .5) * .3) * chh;
          const b = h('button', { class: 'conta-item', style: `left:${x}px;top:${y}px;font-size:${size}px;background:none` }, t.e);
          b.addEventListener('click', () => onTap(b));
          field.append(b);
          return b;
        });
      }

      async function success() {
        good++;
        pill.textContent = `⭐ ${good}/${ROUND}`;
        sfx.ding();
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

      function askHowMany(t, max) {
        const n = rint(lv === 1 ? 1 : 2, max);
        const q = t.f ? 'Quante' : 'Quanti';
        prompt.innerHTML = '';
        prompt.append(`${q} `, h('span', { class: 'pic' }, t.e), ' ?');
        let counted = 0;
        place(n, t, b => {
          if (b.classList.contains('done')) return;
          counted++;
          b.classList.add('done');
          b.append(h('span', { class: 'n' }, counted));
          sfx.tap();
          say(numWord(counted, t.f));
        });
        const opts = new Set([n]);
        while (opts.size < 3) { const v = rint(1, Math.max(max, 4)); if (v !== n) opts.add(v); }
        let locked = false;
        [...opts].sort((a, b) => a - b).forEach(v => {
          const b = h('button', {}, String(v));
          b.onclick = async () => {
            if (locked) return;
            if (v === n) {
              locked = true;
              b.classList.add('ok');
              const r = b.getBoundingClientRect();
              App.floatAt(r.left + r.width / 2, r.top, '⭐');
              await success();
            } else {
              sfx.boing();
              b.classList.add('shake');
              setTimeout(() => b.classList.add('gone'), 450);
              say(`Riprova! Tocca ${t.f ? 'le' : 'i'} ${t.p} per contarl${t.f ? 'e' : 'i'}.`);
            }
          };
          answers.append(b);
        });
        say(`${q} ${t.p} vedi?`);
      }

      function touchN(t, max) {
        const n = rint(2, max);
        const total = Math.min(n + rint(2, 4), 13);
        prompt.innerHTML = '';
        prompt.append('Tocca ', h('b', { style: 'font-size:36px;color:var(--accent-dark)' }, n), ' ', h('span', { class: 'pic' }, t.e));
        const basket = h('div', { class: 'basket' }, '🧺 0');
        answers.append(basket);
        let got = 0;
        place(total, t, b => {
          if (got >= n || b.style.visibility === 'hidden') return;
          got++;
          const r = b.getBoundingClientRect();
          App.floatAt(r.left + r.width / 2, r.top + r.height / 2, t.e);
          b.style.visibility = 'hidden';
          basket.textContent = `🧺 ${got}`;
          sfx.pop();
          say(numWord(got, t.f));
          if (got === n) setTimeout(() => alive && success(), 600);
        });
        say(n === 1 ? `Tocca ${t.f ? 'una' : 'un'} ${t.s}!` : `Tocca ${n} ${t.p}!`);
      }

      function next() {
        if (!alive) return;
        field.innerHTML = '';
        answers.innerHTML = '';
        const max = MAX_BY_LEVEL[Math.min(lv, MAX_BY_LEVEL.length - 1)];
        const t = pick(THINGS);
        if (lv >= 2 && Math.random() < .5) touchN(t, max);
        else askHowMany(t, max);
      }

      requestAnimationFrame(next);
      return () => { alive = false; };
    },
  });
})();
