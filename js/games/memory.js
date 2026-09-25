/* Memory — coppie di animali (con nome e verso) o di foto di famiglia. */
(() => {
  const { h, say, sfx, shuffle, wait } = App;
  const ANIMALS = [
    { e: '🐮', n: 'Mucca', v: 'Muuu!' }, { e: '🐱', n: 'Gatto', v: 'Miao!' }, { e: '🐶', n: 'Cane', v: 'Bau bau!' },
    { e: '🐑', n: 'Pecora', v: 'Beee!' }, { e: '🐷', n: 'Maiale', v: 'Oink oink!' }, { e: '🦆', n: 'Anatra', v: 'Qua qua!' },
    { e: '🐓', n: 'Gallo', v: 'Chicchirichì!' }, { e: '🦁', n: 'Leone', v: 'Roaar!' }, { e: '🐴', n: 'Cavallo', v: 'Iiiiih!' },
    { e: '🐸', n: 'Rana', v: 'Cra cra!' }, { e: '🐝', n: 'Ape', v: 'Bzzz!' }, { e: '🦉', n: 'Gufo', v: 'Uh uh!' },
    { e: '🐘', n: 'Elefante', v: 'Pruuu!' }, { e: '🐭', n: 'Topo', v: 'Squit squit!' },
  ];
  const PAIRS = [3, 3, 4, 6, 8];
  const COLS = { 3: 2, 4: 2, 6: 3, 8: 4 };

  App.registerGame({
    id: 'memory', title: 'Memory degli Animali', short: 'Memory', icon: '🃏',
    start({ stage, addPill }) {
      let alive = true;
      let lv = App.level('memory');
      let deck = 'animali';
      const pill = addPill('');
      const grid = h('div', { class: 'mem-grid' });

      function chooseDeck() {
        const photos = App.media.photos;
        if (photos.length < 2) return board();
        const box = h('div', { class: 'choice-row' },
          h('button', { class: 'tile t1', onclick: () => { deck = 'animali'; box.remove(); sfx.pop(); board(); } },
            h('div', { class: 'ico' }, '🐮🐷'), h('div', { class: 'lbl' }, 'Animali')),
          h('button', { class: 'tile t3', onclick: () => { deck = 'famiglia'; box.remove(); sfx.pop(); board(); } },
            h('div', { class: 'ico' }, '👨‍👩‍👧'), h('div', { class: 'lbl' }, 'Famiglia')));
        stage.append(box);
        say('Vuoi giocare con gli animali o con la famiglia?');
      }

      function board() {
        if (!alive) return;
        stage.append(grid);
        grid.innerHTML = '';
        let pairs = PAIRS[Math.min(lv, PAIRS.length - 1)];
        let items;
        if (deck === 'famiglia') {
          const photos = shuffle(App.media.photos);
          pairs = Math.min(pairs, photos.length);
          items = photos.slice(0, pairs).map(p => ({ key: p.id, img: p.url, n: p.name, speak: p.name ? p.name + '!' : '' }));
        } else {
          items = shuffle(ANIMALS).slice(0, pairs).map(a => ({ key: a.e, e: a.e, n: a.n, speak: `${a.n}! ${a.v}` }));
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
                board();
              }
            } else {
              await wait(1200);
              a.c.classList.remove('up'); b.c.classList.remove('up');
              busy = false;
            }
          };
          grid.append(c);
        });
        if (lv === 1 && deck === 'animali') say('Gira le carte e trova le coppie uguali!', { queue: true });
      }

      requestAnimationFrame(chooseDeck);
      return () => { alive = false; };
    },
  });
})();
