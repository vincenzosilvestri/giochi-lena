/* Colora con Lena / Colorie avec Lena — disegni a zone: scegli un colore e tocca una zona per riempirla. Bilingue FR/IT. */
(() => {
  const { h, say, sfx, pick, wait } = App;

  /* glitter: fondo sfumato con puntini e stelline brillanti */
  const GLITTERS = [
    { id: 'gloro', n: 'Glitter oro', bg: ['#f7c21a', '#ffe27a', '#e0a100'], dot: '#fffbe0' },
    { id: 'glrosa', n: 'Glitter rosa', bg: ['#ff5fae', '#ffb3dd', '#e0358e'], dot: '#ffffff' },
    { id: 'glarg', n: 'Glitter argento', bg: ['#b8c0cc', '#eef2f7', '#8e98a8'], dot: '#ffffff' },
    { id: 'glviola', n: 'Glitter viola', bg: ['#9b5cff', '#d8b8ff', '#7a3de0'], dot: '#ffffff' },
  ];
  const glitterDef = g => `<linearGradient id="${g.id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g.bg[0]}"/><stop offset=".5" stop-color="${g.bg[1]}"/><stop offset="1" stop-color="${g.bg[2]}"/></linearGradient>` +
    `<pattern id="${g.id}" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="url(#${g.id}bg)"/>` +
    `<g stroke="none" fill="${g.dot}"><circle cx="5" cy="6" r="2.2"/><circle cx="22" cy="4" r="1.5"/><circle cx="30" cy="20" r="2.4"/>` +
    `<circle cx="12" cy="26" r="1.8"/><circle cx="26" cy="32" r="1.4"/><circle cx="17" cy="15" r="1.2"/>` +
    `<path d="M8 14 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5z"/>` +
    `<path d="M28 8 l1 2.5 2.5 1 -2.5 1 -1 2.5 -1 -2.5 -2.5 -1 2.5 -1z"/></g></pattern>`;
  const PAL = [
    { c: '#ff4d4d', n: 'Rosso' }, { c: '#ff9f40', n: 'Arancione' }, { c: '#ffd23f', n: 'Giallo' },
    { c: '#4cd06b', n: 'Verde' }, { c: '#3fb8ff', n: 'Azzurro' }, { c: '#4a6cff', n: 'Blu' },
    { c: '#9b5cff', n: 'Viola' }, { c: '#ff7eb6', n: 'Rosa' }, { c: '#9a6a3a', n: 'Marrone' },
    { c: '#9aa0a6', n: 'Grigio' }, { c: '#2b2b2b', n: 'Nero' }, { c: '#ffffff', n: 'Bianco' },
    { c: 'url(#rb)', n: 'Arcobaleno magico', rb: true },
    ...GLITTERS.map(g => ({ c: `url(#${g.id})`, n: g.n, gl: g })),
  ];
  const RB = ['#ff4d4d', '#ff9f40', '#ffd23f', '#4cd06b', '#3fb8ff', '#4a6cff', '#9b5cff'];
  const DEFS = `<defs><linearGradient id="rb" x1="0" y1="0" x2="0" y2="1">${RB.map((c, i) =>
    `<stop offset="${(i / RB.length * 100).toFixed(1)}%" stop-color="${c}"/><stop offset="${((i + 1) / RB.length * 100).toFixed(1)}%" stop-color="${c}"/>`).join('')}</linearGradient>` +
    GLITTERS.map(glitterDef).join('') + '</defs>';

  /* r = zona colorabile (q/c = sfida "colora q di c"), d = linea di dettaglio, k = dettaglio nero */
  const r = (tag, a, q, c) => `<${tag} class="r" fill="#ffffff" ${a}${q ? ` data-q="${q}" data-c="${c}"` : ''}/>`;
  const d = (tag, a) => `<${tag} class="d" fill="none" pointer-events="none" ${a}/>`;
  const k = (tag, a) => `<${tag} class="k" fill="#2b2b2b" pointer-events="none" ${a}/>`;
  const mir = s => s.replace('/>', ' transform="matrix(-1 0 0 1 300 0)"/>');
  const sky = q => r('rect', 'x="2" y="2" width="296" height="296" rx="18"', q || 'il cielo', 'Azzurro');
  const cloud = (x, y, s = 1) => r('path', `d="M${x} ${y} A${22 * s} ${22 * s} 0 0 1 ${x + 5 * s} ${y - 40 * s} A${30 * s} ${30 * s} 0 0 1 ${x + 60 * s} ${y - 55 * s} A${26 * s} ${26 * s} 0 0 1 ${x + 105 * s} ${y - 30 * s} A${18 * s} ${18 * s} 0 0 1 ${x + 100 * s} ${y} Z"`);
  const face = (cx, cy, sp = 14) => k('circle', `cx="${cx - sp}" cy="${cy}" r="5"`) + k('circle', `cx="${cx + sp}" cy="${cy}" r="5"`) +
    d('path', `d="M${cx - 12} ${cy + 14} Q${cx} ${cy + 26} ${cx + 12} ${cy + 14}"`);

  const DRAWINGS = [
    {
      id: 'sole', name: 'Il sole', svg: () => {
        let rays = '';
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4, p = (ang, rr) => `${(95 + rr * Math.cos(ang)).toFixed(1)},${(95 + rr * Math.sin(ang)).toFixed(1)}`;
          rays += r('polygon', `points="${p(a - .18, 50)} ${p(a, 80)} ${p(a + .18, 50)}"`);
        }
        return sky() + r('path', 'd="M2 230 Q75 205 150 225 T298 220 V280 Q298 298 280 298 H20 Q2 298 2 280Z"', 'il prato', 'Verde') +
          rays + r('circle', 'cx="95" cy="95" r="44"', 'il sole', 'Giallo') + face(95, 90) + cloud(175, 185);
      },
    },
    {
      id: 'casa', name: 'La casa', svg: () => sky() + r('rect', 'x="2" y="240" width="296" height="58" rx="10"', 'il prato', 'Verde') +
        r('circle', 'cx="45" cy="50" r="24"', 'il sole', 'Giallo') + r('rect', 'x="185" y="55" width="28" height="55"') +
        r('polygon', 'points="45,132 150,48 255,132"', 'il tetto', 'Rosso') + r('rect', 'x="68" y="130" width="164" height="112"') +
        r('rect', 'x="132" y="172" width="40" height="70" rx="5"', 'la porta', 'Marrone') + k('circle', 'cx="163" cy="210" r="4"') +
        r('rect', 'x="84" y="150" width="36" height="36"') + d('path', 'd="M102 150 V186 M84 168 H120"') +
        r('rect', 'x="184" y="150" width="36" height="36"') + d('path', 'd="M202 150 V186 M184 168 H220"'),
    },
    {
      id: 'fiore', name: 'Il fiore', svg: () => {
        let pet = '';
        for (let i = 0; i < 6; i++) {
          const a = i * Math.PI / 3;
          pet += r('circle', `cx="${(150 + 40 * Math.cos(a)).toFixed(1)}" cy="${(100 + 40 * Math.sin(a)).toFixed(1)}" r="27"`);
        }
        return sky() + r('rect', 'x="145" y="125" width="10" height="100"', 'lo stelo', 'Verde') +
          r('path', 'd="M150 195 Q110 170 98 198 Q125 214 150 195Z"') + r('path', 'd="M150 170 Q190 145 202 173 Q175 190 150 170Z"') +
          r('polygon', 'points="112,232 188,232 178,292 122,292"', 'il vaso', 'Marrone') + r('rect', 'x="102" y="220" width="96" height="16" rx="4"') +
          pet + r('circle', 'cx="150" cy="100" r="24"', 'il centro del fiore', 'Giallo') + face(150, 96, 9);
      },
    },
    {
      id: 'farfalla', name: 'La farfalla', svg: () => {
        const up = r('path', 'd="M150 140 C100 55 35 60 48 122 C55 152 112 152 150 150Z"');
        const lo = r('path', 'd="M150 155 C110 160 68 190 88 226 C108 252 140 212 150 176Z"');
        return sky() + up + mir(up) + lo + mir(lo) +
          r('circle', 'cx="95" cy="112" r="15"') + r('circle', 'cx="205" cy="112" r="15"') +
          r('circle', 'cx="104" cy="206" r="10"') + r('circle', 'cx="196" cy="206" r="10"') +
          d('path', 'd="M145 90 Q134 60 118 54 M155 90 Q166 60 182 54"') + k('circle', 'cx="118" cy="54" r="5"') + k('circle', 'cx="182" cy="54" r="5"') +
          r('ellipse', 'cx="150" cy="165" rx="11" ry="55"', 'il corpo della farfalla', 'Nero') + r('circle', 'cx="150" cy="100" r="15"');
      },
    },
    {
      id: 'pesce', name: 'Il pesce', svg: () => sky('il mare') +
        r('path', 'd="M2 268 Q150 248 298 272 V280 Q298 298 280 298 H20 Q2 298 2 280Z"', 'la sabbia', 'Giallo') +
        r('path', 'd="M40 290 Q18 245 44 215 Q60 250 56 290Z"', "l'alga", 'Verde') + r('path', 'd="M70 290 Q58 238 86 208 Q96 250 90 290Z"') +
        r('polygon', 'points="212,150 276,102 276,198"') + r('path', 'd="M112 108 Q150 55 196 104Z"') +
        r('ellipse', 'cx="140" cy="150" rx="86" ry="56"', 'il pesce', 'Arancione') +
        r('path', 'd="M150 96 Q134 150 150 204 L172 200 Q156 150 172 100Z"') +
        r('circle', 'cx="90" cy="135" r="13"') + k('circle', 'cx="92" cy="136" r="5"') + d('path', 'd="M58 160 Q66 166 74 158"') +
        r('circle', 'cx="60" cy="80" r="11"') + r('circle', 'cx="44" cy="50" r="8"') + r('circle', 'cx="68" cy="28" r="6"'),
    },
    {
      id: 'gatto', name: 'Il gatto', svg: () => sky() +
        r('path', 'd="M208 245 Q275 232 262 170 Q256 150 244 160 Q256 220 204 224Z"', 'la coda', 'Grigio') +
        r('ellipse', 'cx="150" cy="222" rx="72" ry="60"') + r('ellipse', 'cx="118" cy="278" rx="22" ry="13"') + r('ellipse', 'cx="182" cy="278" rx="22" ry="13"') +
        r('polygon', 'points="93,100 103,38 142,78"') + r('polygon', 'points="207,100 197,38 158,78"') +
        r('circle', 'cx="150" cy="122" r="62"', 'il gatto', 'Arancione') +
        r('ellipse', 'cx="126" cy="112" rx="10" ry="13"') + r('ellipse', 'cx="174" cy="112" rx="10" ry="13"') +
        k('ellipse', 'cx="126" cy="114" rx="4" ry="8"') + k('ellipse', 'cx="174" cy="114" rx="4" ry="8"') +
        r('polygon', 'points="142,134 158,134 150,144"', 'il naso', 'Rosa') +
        d('path', 'd="M150 144 Q142 154 132 149 M150 144 Q158 154 168 149 M110 138 H70 M110 146 L72 158 M190 138 H230 M190 146 L228 158"'),
    },
    {
      id: 'unicorno', name: "L'unicorno", svg: () => sky() +
        r('circle', 'cx="97" cy="112" r="28"', 'la criniera', 'Viola') + r('circle', 'cx="86" cy="156" r="28"') + r('circle', 'cx="96" cy="200" r="28"') +
        r('polygon', 'points="108,92 116,38 146,76"') + r('polygon', 'points="192,92 184,38 154,76"') +
        r('ellipse', 'cx="150" cy="145" rx="56" ry="66"') +
        r('ellipse', 'cx="150" cy="196" rx="42" ry="30"', 'il muso', 'Rosa') +
        r('path', 'd="M128 86 Q150 58 172 86 Q150 98 128 86Z"') +
        r('polygon', 'points="137,80 163,80 150,12"', 'il corno', 'Giallo') + d('path', 'd="M140 64 L160 57 M144 44 L157 40"') +
        k('circle', 'cx="128" cy="138" r="7"') + k('circle', 'cx="172" cy="138" r="7"') +
        k('ellipse', 'cx="138" cy="196" rx="4" ry="6"') + k('ellipse', 'cx="162" cy="196" rx="4" ry="6"') +
        r('circle', 'cx="118" cy="166" r="9"') + r('circle', 'cx="182" cy="166" r="9"'),
    },
    {
      id: 'macchina', name: 'La macchina', svg: () => sky() +
        r('rect', 'x="2" y="232" width="296" height="66" rx="10"', 'la strada', 'Grigio') +
        r('rect', 'x="30" y="262" width="50" height="8" rx="3"') + r('rect', 'x="125" y="262" width="50" height="8" rx="3"') + r('rect', 'x="220" y="262" width="50" height="8" rx="3"') +
        r('path', 'd="M30 205 L30 168 Q34 150 60 148 L95 148 L125 104 L202 104 L236 148 L260 150 Q276 155 276 176 L276 205Z"', 'la macchina', 'Rosso') +
        r('polygon', 'points="104,144 130,114 160,114 160,144"', 'il finestrino', 'Azzurro') + r('polygon', 'points="170,144 170,114 198,114 222,144"') +
        d('path', 'd="M150 168 H170"') +
        r('circle', 'cx="85" cy="206" r="28"', 'la ruota', 'Nero') + r('circle', 'cx="221" cy="206" r="28"') +
        r('circle', 'cx="85" cy="206" r="12"') + r('circle', 'cx="221" cy="206" r="12"') +
        r('circle', 'cx="264" cy="170" r="8"', 'il faro', 'Giallo'),
    },
    {
      id: 'torta', name: 'La torta', svg: () => {
        let glaze = 'M55 198';
        for (let x = 55; x < 245; x += 38) glaze += ` Q${x + 9.5} 218 ${x + 19} 198 Q${x + 28.5} 218 ${x + 38} 198`;
        let candles = '';
        [100, 125, 150, 175, 200].forEach(x => {
          candles += r('rect', `x="${x - 5}" y="92" width="10" height="40" rx="3"`) +
            r('path', `d="M${x} 58 Q${x + 11} 76 ${x} 86 Q${x - 11} 76 ${x} 58Z"`, x === 150 ? 'la fiammella' : '', 'Arancione');
        });
        return sky() + r('ellipse', 'cx="150" cy="266" rx="122" ry="18"', 'il piatto', 'Grigio') +
          r('rect', 'x="55" y="188" width="190" height="72" rx="10"') + r('path', `d="${glaze} V188 H55Z"`, 'la glassa', 'Rosa') +
          r('rect', 'x="80" y="130" width="140" height="62" rx="10"') + candles;
      },
    },
    {
      id: 'arcobaleno', name: "L'arcobaleno", svg: () => {
        let bands = '';
        for (let i = 0; i < 7; i++) {
          const R = 135 - i * 10, q = R - 10;
          bands += r('path', `d="M${150 - R} 225 A${R} ${R} 0 0 1 ${150 + R} 225 L${150 + q} 225 A${q} ${q} 0 0 0 ${150 - q} 225Z"`,
            i === 0 ? "la prima striscia dell'arcobaleno" : '', 'Rosso');
        }
        return sky() + bands + cloud(8, 250, .8) + cloud(212, 250, .8) + r('circle', 'cx="258" cy="48" r="24"', 'il sole', 'Giallo');
      },
    },
    {
      id: 'gelato', name: 'Il gelato', svg: () => sky() +
        r('polygon', 'points="104,160 196,160 150,288"', 'il cono', 'Marrone') +
        d('path', 'd="M117 192 H183 M127 222 H173 M138 252 H162 M126 172 L166 248 M174 172 L134 248"') +
        r('circle', 'cx="118" cy="146" r="35"', 'il gelato', 'Rosa') + r('circle', 'cx="182" cy="146" r="35"') +
        r('circle', 'cx="150" cy="100" r="38"') + d('path', 'd="M150 50 Q156 32 170 26"') +
        r('circle', 'cx="150" cy="58" r="13"', 'la ciliegina', 'Rosso'),
    },
    {
      id: 'coniglio', name: 'Il coniglietto', svg: () => sky() +
        r('path', 'd="M2 250 Q150 232 298 252 V280 Q298 298 280 298 H20 Q2 298 2 280Z"', 'il prato', 'Verde') +
        r('ellipse', 'cx="126" cy="70" rx="17" ry="46"') + r('ellipse', 'cx="174" cy="70" rx="17" ry="46"') +
        r('ellipse', 'cx="126" cy="72" rx="7" ry="32"', "l'orecchio", 'Rosa') + r('ellipse', 'cx="174" cy="72" rx="7" ry="32"') +
        r('ellipse', 'cx="150" cy="222" rx="56" ry="54"') + r('ellipse', 'cx="150" cy="232" rx="30" ry="34"') +
        r('circle', 'cx="150" cy="140" r="50"') +
        k('circle', 'cx="132" cy="132" r="6"') + k('circle', 'cx="168" cy="132" r="6"') +
        r('ellipse', 'cx="150" cy="152" rx="8" ry="6"', 'il naso', 'Rosa') +
        d('path', 'd="M150 158 Q142 168 134 164 M150 158 Q158 168 166 164 M118 152 H86 M182 152 H214"') +
        r('polygon', 'points="224,250 250,250 237,296"', 'la carota', 'Arancione') +
        r('path', 'd="M237 250 Q226 228 232 222 Q240 236 237 250Z"') + r('path', 'd="M237 250 Q250 226 258 230 Q250 244 237 250Z"'),
    },
  ];

  /* traduzioni francesi: nomi dei colori, dei disegni e delle zone delle sfide */
  const PAL_FR = {
    Rosso: 'Rouge', Arancione: 'Orange', Giallo: 'Jaune', Verde: 'Vert', Azzurro: 'Bleu clair', Blu: 'Bleu', Viola: 'Violet',
    Rosa: 'Rose', Marrone: 'Marron', Grigio: 'Gris', Nero: 'Noir', Bianco: 'Blanc', 'Arcobaleno magico': 'Arc-en-ciel magique',
    'Glitter oro': 'Paillettes dorées', 'Glitter rosa': 'Paillettes roses', 'Glitter argento': 'Paillettes argentées', 'Glitter viola': 'Paillettes violettes',
  };
  const DR_FR = {
    sole: 'Le soleil', casa: 'La maison', fiore: 'La fleur', farfalla: 'Le papillon', pesce: 'Le poisson', gatto: 'Le chat',
    unicorno: 'La licorne', macchina: 'La voiture', torta: 'Le gâteau', arcobaleno: "L'arc-en-ciel", gelato: 'La glace', coniglio: 'Le petit lapin',
  };
  const Q_FR = {
    'il cielo': 'le ciel', 'il prato': "l'herbe", 'il sole': 'le soleil', 'il tetto': 'le toit', 'la porta': 'la porte', 'lo stelo': 'la tige',
    'il vaso': 'le pot', 'il centro del fiore': 'le cœur de la fleur', 'il corpo della farfalla': 'le corps du papillon', 'il mare': 'la mer',
    'la sabbia': 'le sable', "l'alga": "l'algue", 'il pesce': 'le poisson', 'la coda': 'la queue', 'il gatto': 'le chat', 'il naso': 'le nez',
    'la criniera': 'la crinière', 'il muso': 'le museau', 'il corno': 'la corne', 'la strada': 'la route', 'la macchina': 'la voiture',
    'il finestrino': 'la vitre', 'la ruota': 'la roue', 'il faro': 'le phare', 'il piatto': "l'assiette", 'la glassa': 'le glaçage',
    'la fiammella': 'la flamme', "la prima striscia dell'arcobaleno": "la première bande de l'arc-en-ciel", 'il cono': 'le cornet',
    'il gelato': 'la glace', 'la ciliegina': 'la cerise', "l'orecchio": "l'oreille", 'la carota': 'la carotte',
  };
  const TX = {
    it: {
      tut: ['Scegli un colore qui sotto.', 'Poi tocca il disegno per colorarlo!', 'Quando hai finito, tocca la stella!'],
      choose: 'Scegli un disegno da colorare!', chooseShow: 'Scegli un disegno! 🖍️', galBtn: '🖼️ La mia galleria', galTitle: '🖼️ La galleria di Lena',
      colorBtn: '🖍️ Colora', more: 'Colora ancora un pochino!', exact: 'Esatto! Bravissima!', saved: "Che bel disegno! L'ho messo nella tua galleria.",
      gal: 'Ecco la tua galleria!', galEmpty: 'Ancora nessun disegno: coloriamone uno!', restart: 'Vuoi ricominciare?', done: 'Finito! ⭐',
      ch: (q, c) => `Colora ${q} di ${c.toLowerCase()}!`,
    },
    fr: {
      tut: ['Choisis une couleur ici en bas.', 'Puis touche le dessin pour le colorier !', "Quand tu as fini, touche l'étoile !"],
      choose: 'Choisis un dessin à colorier !', chooseShow: 'Choisis un dessin ! 🖍️', galBtn: '🖼️ Ma galerie', galTitle: '🖼️ La galerie de Lena',
      colorBtn: '🖍️ Colorier', more: 'Colorie encore un petit peu !', exact: 'Exactement ! Bravo !', saved: 'Quel beau dessin ! Je le mets dans ta galerie.',
      gal: 'Voici ta galerie !', galEmpty: 'Pas encore de dessin : colorions-en un !', restart: 'Tu veux recommencer ?', done: 'Fini ! ⭐',
      ch: (q, c) => `Colorie ${Q_FR[q] || q} en ${(PAL_FR[c] || c).toLowerCase()} !`,
    },
  };
  const tx = () => TX[App.lang];
  const pn = (p, l = App.lang) => (l === 'fr' ? PAL_FR[p.n] || p.n : p.n);
  const dn = (dr, l = App.lang) => (l === 'fr' ? DR_FR[dr.id] : dr.name);
  const bang = (l = App.lang) => (l === 'fr' ? ' !' : '!');
  const svgOf = dr => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">${DEFS}` +
    `<g stroke="#2b2b2b" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">${dr.svg()}</g></svg>`;

  function toPng(svgEl) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = c.height = 600;
        const g = c.getContext('2d');
        g.fillStyle = '#fff';
        g.fillRect(0, 0, 600, 600);
        g.drawImage(img, 0, 0, 600, 600);
        c.toBlob(b => res(b), 'image/png');
      };
      img.onerror = () => res(null);
      const s = new XMLSerializer().serializeToString(svgEl);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    });
  }

  App.registerGame({
    id: 'colora', title: { fr: 'Colorie avec Lena', it: 'Colora con Lena' }, short: 'Colora', icon: '🖍️',
    phrases: l => {
      const T = TX[l];
      const out = [...T.tut, T.choose, T.more, T.exact, T.saved, T.gal, T.galEmpty, T.restart];
      PAL.forEach(p => out.push(pn(p, l) + bang(l)));
      DRAWINGS.forEach(dr => {
        out.push(dn(dr, l) + bang(l));
        const tmp = dr.svg().matchAll(/data-q="([^"]+)" data-c="([^"]+)"/g);
        for (const m of tmp) out.push(T.ch(m[1].replace(/&#39;/g, "'"), m[2]));
      });
      return out;
    },
    start({ stage, addPill, setHelp }) {
      let alive = true;
      let lastSteps = [];
      stage.style.background = 'linear-gradient(180deg,#fff5e6 0%,#fff 60%)';
      const st = App.state;
      st.paint = st.paint || {};
      setHelp(() => App.tutorial(lastSteps));
      const pill = addPill('');
      pill.style.display = 'none';

      /* ---------- scelta del disegno ---------- */
      function picker() {
        if (!alive) return;
        stage.innerHTML = '';
        pill.style.display = 'none';
        const grid = h('div', { class: 'col-picker' });
        DRAWINGS.forEach(dr => {
          const started = st.paint[dr.id] && st.paint[dr.id].some(f => f !== '#ffffff');
          const b = h('button', { class: 'col-thumb', html: svgOf(dr) });
          if (started) {
            const svg = b.querySelector('svg');
            svg.querySelectorAll('.r').forEach((el, i) => { if (st.paint[dr.id][i]) el.setAttribute('fill', st.paint[dr.id][i]); });
          }
          b.onclick = () => { sfx.pop(); color(dr); };
          grid.append(b);
        });
        stage.append(h('div', { class: 'prompt' }, tx().chooseShow),
          h('button', { class: 'soft-btn col-gal-btn', onclick: gallery }, tx().galBtn), grid);
        say(tx().choose);
      }

      function gallery() {
        sfx.pop();
        stage.innerHTML = '';
        const list = App.media.drawings;
        const grid = h('div', { class: 'col-picker' }, list.slice().reverse().map(dw => h('button', {
          class: 'col-thumb', onclick: () => {
            const close = App.modal([h('img', { src: dw.url, style: 'width:100%;border-radius:18px' }),
              h('div', { class: 'row', style: 'margin-top:14px' }, h('button', { class: 'big-btn', onclick: () => close() }, '👍'))]);
          },
        }, h('img', { src: dw.url, alt: '', style: 'width:100%;height:100%;object-fit:cover;border-radius:14px' }))));
        stage.append(h('div', { class: 'prompt' }, tx().galTitle),
          h('button', { class: 'soft-btn col-gal-btn', onclick: () => { sfx.pop(); picker(); } }, tx().colorBtn), grid);
        say(list.length ? tx().gal : tx().galEmpty);
      }

      /* ---------- colorare ---------- */
      function color(dr) {
        stage.innerHTML = '';
        App.nextLang();
        say(dn(dr) + bang());
        let cur = PAL[0];
        const undo = [];
        const board = h('div', { class: 'col-board', html: svgOf(dr) });
        const svg = board.querySelector('svg');
        const regions = [...svg.querySelectorAll('.r')];
        const saved = st.paint[dr.id] || [];
        regions.forEach((el, i) => { if (saved[i]) el.setAttribute('fill', saved[i]); });
        const persist = () => { st.paint[dr.id] = regions.map(el => el.getAttribute('fill')); App.save(); };

        let challenge = null;
        const cands = regions.filter(el => el.dataset.q && el.getAttribute('fill') === '#ffffff');
        if (cands.length && Math.random() < .6) {
          const el = pick(cands);
          challenge = { el, c: PAL.find(p => p.n === el.dataset.c) };
        }

        const pal = h('div', { class: 'col-pal' });
        const swatches = PAL.map(p => {
          const b = h('button', {
            class: 'col-sw' + (p.gl ? ' glitter-sw' : '') + (p === cur ? ' sel' : ''), 'aria-label': p.n,
            style: p.rb ? `background:linear-gradient(180deg,${RB.join(',')})` : p.gl ? `--g1:${p.gl.bg[0]};--g2:${p.gl.bg[1]};--g3:${p.gl.bg[2]}` : `background:${p.c}`,
            onclick: () => {
              cur = p; sfx.tap(); say(pn(p) + bang());
              swatches.forEach(s => s.classList.toggle('sel', s === b));
            },
          });
          pal.append(b);
          return b;
        });

        svg.addEventListener('click', e => {
          const el = e.target.closest('.r');
          if (!el) return;
          const before = el.getAttribute('fill');
          if (before === cur.c) return;
          undo.push([el, before]);
          el.setAttribute('fill', cur.c);
          sfx.pop();
          persist();
          if (cur.gl) { const rr = el.getBoundingClientRect(); App.glitter(rr.left + rr.width / 2, rr.top + rr.height / 2, 16); }
          if (challenge && el === challenge.el && cur === challenge.c) {
            challenge = null;
            sfx.ding();
            App.floatAt(e.clientX, e.clientY, '⭐');
            say(tx().exact);
            App.addStars(1, e.clientX, e.clientY);
            App.track('colori', null, true);
          }
        });

        const tools = h('div', { class: 'col-tools' },
          h('button', { class: 'icon-btn', 'aria-label': 'Annulla', onclick: () => {
            const u = undo.pop();
            if (!u) return;
            u[0].setAttribute('fill', u[1]); sfx.tap(); persist();
          } }, '↩️'),
          h('button', { class: 'icon-btn', 'aria-label': 'Ricomincia', onclick: () => {
            say(tx().restart);
            const close = App.modal([h('div', { class: 'big' }, '🗑️'), h('div', { class: 'row' },
              h('button', { class: 'big-btn', style: 'background:#4cd06b;box-shadow:0 8px 0 #2f9a4a', onclick: () => {
                close(); regions.forEach(el => el.setAttribute('fill', '#ffffff')); undo.length = 0; persist(); sfx.boing();
              } }, '✔️'),
              h('button', { class: 'big-btn', style: 'background:#ff6b6b;box-shadow:0 8px 0 #c94444', onclick: () => close() }, '✖️'))]);
          } }, '🗑️'),
          h('button', { class: 'icon-btn', 'aria-label': 'Disegni', onclick: () => { sfx.pop(); picker(); } }, '🎨'),
          h('button', { class: 'big-btn col-done', onclick: finish }, tx().done));

        async function finish() {
          const colored = regions.filter(el => el.getAttribute('fill') !== '#ffffff').length;
          if (colored < 3) { sfx.boing(); say(tx().more); return; }
          const blob = await toPng(svg);
          if (blob) await App.saveDrawing(blob, dr.name);
          delete st.paint[dr.id];
          st.colorDone = (st.colorDone || 0) + 1;
          App.save();
          App.confetti(90); sfx.win();
          const dr0 = tools.querySelector('.col-done').getBoundingClientRect();
          App.addStars(3, dr0.left + dr0.width / 2, dr0.top);
          await say(tx().saved);
          if (!alive) return;
          if (st.colorDone % 2 === 0) { await App.reward(); if (!alive) return; }
          picker();
        }

        stage.append(board, tools, pal);
        lastSteps = [
          { text: tx().tut[0], icon: '🎨', action: 'tap', at: () => swatches[2], cap: 'top' },
          { text: tx().tut[1], icon: '👆', action: 'tap', at: () => regions[Math.min(3, regions.length - 1)], cap: 'top' },
          { text: tx().tut[2], icon: '⭐', action: 'tap', at: () => tools.querySelector('.col-done'), cap: 'top' },
        ];
        App.intro('colora', lastSteps).then(async ran => {
          if (!alive || !challenge) return;
          if (!ran) await wait(1200);
          if (alive && challenge) say(tx().ch(challenge.el.dataset.q, challenge.c.n));
        });
      }

      requestAnimationFrame(picker);
      return () => { alive = false; };
    },
  });
})();
