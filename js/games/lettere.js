/* Pesca le Lettere — riconoscere le lettere e l'iniziale delle parole, poi comporre un nome. */
(() => {
  const { h, say, sfx, rint, pick, shuffle, wait } = App;
  const LETTER_NAME = {
    A: 'a', B: 'bi', C: 'ci', D: 'di', E: 'e', F: 'effe', G: 'gi', H: 'acca', I: 'i', J: 'i lunga', K: 'cappa',
    L: 'elle', M: 'emme', N: 'enne', O: 'o', P: 'pi', Q: 'cu', R: 'erre', S: 'esse', T: 'ti', U: 'u', V: 'vu',
    W: 'doppia vu', X: 'ics', Y: 'ipsilon', Z: 'zeta',
  };
  const WORDS = {
    A: [['Ape', '🐝'], ['Arancia', '🍊']], B: [['Balena', '🐳'], ['Banana', '🍌']], C: [['Casa', '🏠'], ['Cuore', '❤️']],
    D: [['Dado', '🎲'], ['Delfino', '🐬']], E: [['Elefante', '🐘'], ['Erba', '🌿']], F: [['Fiore', '🌸'], ['Fragola', '🍓']],
    G: [['Gatto', '🐱'], ['Gelato', '🍦']], I: [['Isola', '🏝️'], ['Igloo', '🧊']], L: [['Luna', '🌙'], ['Lena', '👧'], ['Leone', '🦁']],
    M: [['Mela', '🍎'], ['Mucca', '🐮']], N: [['Nave', '🚢'], ['Neve', '❄️']], O: [['Orso', '🐻'], ['Occhiali', '👓']],
    P: [['Pesce', '🐟'], ['Papà', '👨'], ['Palla', '⚽']], R: [['Rana', '🐸'], ['Razzo', '🚀']], S: [['Sole', '☀️'], ['Stella', '⭐']],
    T: [['Topo', '🐭'], ['Torta', '🎂']], U: [['Uva', '🍇'], ['Uovo', '🥚']], V: [['Volpe', '🦊'], ['Vulcano', '🌋']],
    Z: [['Zebra', '🦓'], ['Zucca', '🎃']],
  };
  const POOLS = [
    ['L', 'E', 'N', 'A'],
    ['L', 'E', 'N', 'A'],
    ['L', 'E', 'N', 'A', 'I', 'O', 'U', 'M', 'P'],
    Object.keys(WORDS),
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
    id: 'lettere', title: 'Pesca le Lettere', short: 'Lettere', icon: '🎣', cls: 'sea',
    start({ stage, addPill }) {
      let alive = true;
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
        const pool = POOLS[Math.min(lv, POOLS.length - 1)].slice();
        const fam = lv >= 2 ? familyWords() : [];
        fam.forEach(([n]) => { const L = norm(n)[0]; if (L && !pool.includes(L)) pool.push(L); });
        const T = pick(pool);
        const options = (WORDS[T] || []).concat(fam.filter(([n]) => norm(n)[0] === T));
        const [word, pic] = options.length ? pick(options) : [T, '🔤'];
        const count = Math.min(3 + lv, 6);
        const others = shuffle(Object.keys(WORDS).filter(x => x !== T));
        const pref = shuffle(pool.filter(x => x !== T));
        const letters = shuffle([T, T].concat(pref.concat(others).filter((x, i, a) => a.indexOf(x) === i).slice(0, count - 2)));

        prompt.innerHTML = '';
        prompt.append(h('span', { class: 'pic' }, pic), h('span', { class: 'word', html: `<b>${word[0]}</b>${word.slice(1)}` }));
        spawn(letters);
        say(`Pesca la ${LETTER_NAME[T]} di ${word}!`);

        onCatch = async f => {
          if (f.caught) return;
          if (f.L === T) {
            onCatch = null;
            catchAnim(f);
            sfx.ding();
            good++;
            pill.textContent = `🐟 ${good}/${ROUND}`;
            await App.praise();
            if (!alive) return;
            if (good >= ROUND) compose(); else question();
          } else {
            sfx.boing();
            f.boost = 1.2;
            say(`Io sono la ${LETTER_NAME[f.L]}!`);
          }
        };
      }

      /* bonus: comporre un nome lettera per lettera */
      function compose() {
        const names = [App.NAME].concat(lv >= 2 ? ['Papà'].concat(familyWords().map(w => w[0])) : []);
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
        const extra = shuffle(Object.keys(WORDS).filter(x => !uniq.includes(x))).slice(0, 2);
        spawn(shuffle(uniq.concat(extra)));
        say(`Adesso scriviamo ${shown}! Pesca la ${LETTER_NAME[word[0]]}!`);

        onCatch = async f => {
          if (f.caught) return;
          const need = word[idx];
          if (f.L !== need) {
            sfx.boing(); f.boost = 1.2;
            say(`Prima la ${LETTER_NAME[need]}!`);
            return;
          }
          sfx.ding();
          const slot = slots.children[idx];
          slot.textContent = need; slot.classList.add('on');
          idx++;
          mark();
          f.boost = 1.5;
          if (idx < word.length) {
            say(LETTER_NAME[word[idx]] === LETTER_NAME[need] ? `Ancora la ${LETTER_NAME[need]}!` : `Ora la ${LETTER_NAME[word[idx]]}!`);
            return;
          }
          onCatch = null;
          await say(`${[...word].map(L => LETTER_NAME[L]).join(', ')}. ${shown}! Hai scritto ${shown}!`, { rate: .85 });
          if (!alive) return;
          await App.reward();
          if (!alive) return;
          good = 0; pill.textContent = `🐟 0/${ROUND}`;
          if (lv < POOLS.length - 1) { lv++; App.setLevel('lettere', lv); }
          question();
        };
      }

      requestAnimationFrame(t => { last = t; question(); raf = requestAnimationFrame(loop); });
      return () => { alive = false; cancelAnimationFrame(raf); };
    },
  });
})();
