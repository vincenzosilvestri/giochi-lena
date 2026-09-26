/* Il mio cucciolo — prendersi cura di un animaletto: capire di cosa ha bisogno (nuvoletta = emozioni e bisogni),
   dargli la pappa (contare, colori), fargli il bagnetto, curare la bua, giocare a palla (colori) e metterlo a nanna.
   Niente sensi di colpa: il cucciolo non si ammala e non si rattrista se il bambino non gioca. In 5 lingue. */
(() => {
  const { h, say, sfx, pick, shuffle, wait, rint } = App;

  const PETS = [
    { id: 'gatto', e: '🐱', n: { it: 'Il gattino', fr: 'Le chaton', de: 'Das Kätzchen', en: 'The kitten', es: 'El gatito' }, v: { it: 'Miao miao!', fr: 'Miaou !', de: 'Miau!', en: 'Meow!', es: '¡Miau!' } },
    { id: 'cane', e: '🐶', n: { it: 'Il cagnolino', fr: 'Le chiot', de: 'Der Welpe', en: 'The puppy', es: 'El perrito' }, v: { it: 'Bau bau!', fr: 'Ouaf ouaf !', de: 'Wau wau!', en: 'Woof woof!', es: '¡Guau guau!' } },
    { id: 'coniglio', e: '🐰', n: { it: 'Il coniglietto', fr: 'Le lapin', de: 'Das Häschen', en: 'The bunny', es: 'El conejito' }, v: { it: 'Snif snif!', fr: 'Snif snif !', de: 'Schnupper schnupper!', en: 'Sniff sniff!', es: '¡Snif snif!' } },
    { id: 'unicorno', e: '🦄', n: { it: "L'unicorno", fr: 'La licorne', de: 'Das Einhorn', en: 'The unicorn', es: 'El unicornio' }, v: { it: 'Iiih iiih!', fr: 'Hiii hiii !', de: 'Wieher!', en: 'Neigh!', es: '¡Jiii jiii!' } },
    { id: 'panda', e: '🐼', n: { it: 'Il panda', fr: 'Le panda', de: 'Der Panda', en: 'The panda', es: 'El panda' }, v: { it: 'Gnam gnam!', fr: 'Miam miam !', de: 'Mampf mampf!', en: 'Nom nom!', es: '¡Ñam ñam!' } },
    { id: 'pulcino', e: '🐥', n: { it: 'Il pulcino', fr: 'Le poussin', de: 'Das Küken', en: 'The chick', es: 'El pollito' }, v: { it: 'Pio pio!', fr: 'Piou piou !', de: 'Piep piep!', en: 'Cheep cheep!', es: '¡Pío pío!' } },
    { id: 'volpe', e: '🦊', n: { it: 'La volpe', fr: 'Le renard', de: 'Der Fuchs', en: 'The fox', es: 'El zorro' }, v: { it: 'Yip yip!', fr: 'Yap yap !', de: 'Kläff kläff!', en: 'Yip yip!', es: '¡Yip yip!' } },
    { id: 'tigre', e: '🐯', n: { it: 'Il tigrotto', fr: 'Le bébé tigre', de: 'Das Tigerbaby', en: 'The tiger cub', es: 'El tigrito' }, v: { it: 'Grrr… roar!', fr: 'Grrr… raaah !', de: 'Grrr… roar!', en: 'Grrr… roar!', es: '¡Grrr… roar!' } },
  ];
  /* cibi: plurale per le richieste "Voglio tre carote", genere (it/fr/es) per contare "Una! Due!" */
  const FOOD = [
    { id: 'mela', e: '🍎', c: 'red', f: { it: 1, fr: 1, es: 1 }, n: { it: 'mele', fr: 'pommes', de: 'Äpfel', en: 'apples', es: 'manzanas' } },
    { id: 'fragola', e: '🍓', c: 'red', f: { it: 1, fr: 1, es: 1 }, n: { it: 'fragole', fr: 'fraises', de: 'Erdbeeren', en: 'strawberries', es: 'fresas' } },
    { id: 'carota', e: '🥕', c: 'orange', f: { it: 1, fr: 1, es: 1 }, n: { it: 'carote', fr: 'carottes', de: 'Karotten', en: 'carrots', es: 'zanahorias' } },
    { id: 'banana', e: '🍌', c: 'yellow', f: { it: 1, fr: 1, es: 0 }, n: { it: 'banane', fr: 'bananes', de: 'Bananen', en: 'bananas', es: 'plátanos' } },
    { id: 'broccolo', e: '🥦', c: 'green', f: { it: 0, fr: 0, es: 0 }, n: { it: 'broccoli', fr: 'brocolis', de: 'Brokkoli', en: 'broccoli', es: 'brócolis' } },
    { id: 'mirtillo', e: '🫐', c: 'blue', f: { it: 0, fr: 1, es: 0 }, n: { it: 'mirtilli', fr: 'myrtilles', de: 'Blaubeeren', en: 'blueberries', es: 'arándanos' } },
  ];
  const SOMETHING = {
    it: { red: 'qualcosa di rosso', orange: 'qualcosa di arancione', yellow: 'qualcosa di giallo', green: 'qualcosa di verde', blue: 'qualcosa di blu' },
    fr: { red: 'quelque chose de rouge', orange: "quelque chose d'orange", yellow: 'quelque chose de jaune', green: 'quelque chose de vert', blue: 'quelque chose de bleu' },
    de: { red: 'etwas Rotes', orange: 'etwas Oranges', yellow: 'etwas Gelbes', green: 'etwas Grünes', blue: 'etwas Blaues' },
    en: { red: 'something red', orange: 'something orange', yellow: 'something yellow', green: 'something green', blue: 'something blue' },
    es: { red: 'algo rojo', orange: 'algo naranja', yellow: 'algo amarillo', green: 'algo verde', blue: 'algo azul' },
  };
  const WANT_N = {
    it: (n, f) => `Voglio ${App.NUM.it[n]} ${f.n.it}!`, fr: (n, f) => `Je veux ${App.NUM.fr[n]} ${f.n.fr} !`,
    de: (n, f) => `Ich möchte ${App.NUM.de[n]} ${f.n.de}!`, en: (n, f) => `I want ${App.NUM.en[n]} ${f.n.en}!`, es: (n, f) => `¡Quiero ${App.NUM.es[n]} ${f.n.es}!`,
  };
  const WANT_C = {
    it: c => `Ho voglia di ${SOMETHING.it[c]}!`, fr: c => `J'ai envie de ${SOMETHING.fr[c]} !`, de: c => `Ich möchte ${SOMETHING.de[c]}!`,
    en: c => `I'd like ${SOMETHING.en[c]}!`, es: c => `¡Quiero ${SOMETHING.es[c]}!`,
  };
  const BALL = { red: '#ff5a5a', blue: '#4a8cff', yellow: '#ffd23f', green: '#4cd06b' };
  const BALLQ = {
    it: { red: 'Lanciami la palla rossa!', blue: 'Lanciami la palla blu!', yellow: 'Lanciami la palla gialla!', green: 'Lanciami la palla verde!' },
    fr: { red: 'Lance-moi la balle rouge !', blue: 'Lance-moi la balle bleue !', yellow: 'Lance-moi la balle jaune !', green: 'Lance-moi la balle verte !' },
    de: { red: 'Wirf mir den roten Ball!', blue: 'Wirf mir den blauen Ball!', yellow: 'Wirf mir den gelben Ball!', green: 'Wirf mir den grünen Ball!' },
    en: { red: 'Throw me the red ball!', blue: 'Throw me the blue ball!', yellow: 'Throw me the yellow ball!', green: 'Throw me the green ball!' },
    es: { red: '¡Lánzame la pelota roja!', blue: '¡Lánzame la pelota azul!', yellow: '¡Lánzame la pelota amarilla!', green: '¡Lánzame la pelota verde!' },
  };
  /* regali: in testa, al collo, nella cameretta */
  const PITEMS = [
    { id: 'fiocco', e: '🎀', slot: 'head', price: 5, n: { it: 'Il fiocco', fr: 'Le nœud', de: 'Die Schleife', en: 'The bow', es: 'El lazo' } },
    { id: 'fiore', e: '🌸', slot: 'head', price: 5, n: { it: 'Il fiore', fr: 'La fleur', de: 'Die Blume', en: 'The flower', es: 'La flor' } },
    { id: 'cilindro', e: '🎩', slot: 'head', price: 12, n: { it: 'Il cappello magico', fr: 'Le chapeau magique', de: 'Der Zauberhut', en: 'The magic hat', es: 'El sombrero mágico' } },
    { id: 'corona', e: '👑', slot: 'head', price: 15, n: { it: 'La corona', fr: 'La couronne', de: 'Die Krone', en: 'The crown', es: 'La corona' } },
    { id: 'campanello', e: '🔔', slot: 'neck', price: 6, n: { it: 'Il campanellino', fr: 'La clochette', de: 'Das Glöckchen', en: 'The little bell', es: 'El cascabel' } },
    { id: 'sciarpa', e: '🧣', slot: 'neck', price: 10, n: { it: 'La sciarpa', fr: "L'écharpe", de: 'Der Schal', en: 'The scarf', es: 'La bufanda' } },
    { id: 'cesta', e: '🧺', slot: 'room', price: 10, n: { it: 'La cuccia', fr: 'Le panier pour dormir', de: 'Das Körbchen', en: 'The cosy basket', es: 'La camita' } },
    { id: 'orsetto', e: '🧸', slot: 'room', price: 8, n: { it: "L'orsetto", fr: "L'ourson", de: 'Der Teddy', en: 'The teddy bear', es: 'El osito' } },
    { id: 'pianta', e: '🪴', slot: 'room', price: 6, n: { it: 'La pianta', fr: 'La plante', de: 'Die Pflanze', en: 'The plant', es: 'La planta' } },
    { id: 'palloncino', e: '🎈', slot: 'room', price: 6, n: { it: 'Il palloncino', fr: 'Le ballon', de: 'Der Luftballon', en: 'The balloon', es: 'El globo' } },
    { id: 'arcobaleno', e: '🌈', slot: 'room', price: 20, n: { it: "L'arcobaleno", fr: "L'arc-en-ciel", de: 'Der Regenbogen', en: 'The rainbow', es: 'El arcoíris' } },
  ];
  const NEEDS = { eat: '🍎', bath: '🛁', hurt: '🩹', play: '⚽', walk: '🌳', teeth: '🪥', sleep: '🌙' };
  const TX = {
    it: {
      need: { eat: 'Ho fame!', bath: 'Ho bisogno di un bagnetto!', hurt: 'Ahi! Ho la bua!', play: 'Mi annoio… giochiamo?', sleep: 'Ho sonno…' },
      look: 'Guarda la nuvoletta!', notThis: 'Questo no, grazie!', full: 'Pancia piena! Grazie!',
      rub: 'Strofina via le macchie!', clean: 'Che profumo! Adesso è tutto pulito!',
      plaster: 'Metti il cerotto sulla bua!', kiss: 'Mi dai un bacino?', better: 'Grazie! Non fa più male!',
      caught: 'Presa!', noBall: 'Non è quella!', playDone: 'Che bello giocare con te!',
      lamp: 'Spegni la luce!', night: "Buonanotte! Sogni d'oro!", wake: 'Buongiorno! Giochiamo ancora?',
      love: ['Ti voglio bene!', 'Che belle coccole!', 'Hi hi, mi fai il solletico!'],
      choose: 'Scegli il tuo cucciolo!', hello: 'Ciao! Ti prendi cura di me?', shop: 'Regali per il tuo cucciolo!',
      tut: ['Il tuo cucciolo ti dice cosa gli serve: guarda la nuvoletta!', 'Poi tocca il pulsante giusto!'],
      tutFood: 'Trascina il cibo fino alla bocca!', tutBall: 'Tocca la palla giusta!',
    },
    fr: {
      need: { eat: "J'ai faim !", bath: "J'ai besoin d'un bain !", hurt: "Aïe ! J'ai bobo !", play: 'Je m\'ennuie… on joue ?', sleep: "J'ai sommeil…" },
      look: 'Regarde la bulle !', notThis: 'Pas ça, merci !', full: 'Le ventre plein ! Merci !',
      rub: 'Frotte pour enlever les taches !', clean: 'Ça sent bon ! Tout propre !',
      plaster: 'Mets le pansement sur le bobo !', kiss: 'Tu me fais un bisou ?', better: 'Merci ! Ça ne fait plus mal !',
      caught: 'Attrapée !', noBall: "Ce n'est pas celle-là !", playDone: "C'est trop bien de jouer avec toi !",
      lamp: 'Éteins la lumière !', night: 'Bonne nuit ! Fais de beaux rêves !', wake: 'Bonjour ! On joue encore ?',
      love: ["Je t'aime fort !", 'Des câlins, youpi !', 'Hi hi, ça chatouille !'],
      choose: 'Choisis ton petit animal !', hello: 'Coucou ! Tu prends soin de moi ?', shop: 'Des cadeaux pour ton animal !',
      tut: ['Ton petit animal te dit ce dont il a besoin : regarde la bulle !', 'Puis touche le bon bouton !'],
      tutFood: "Fais glisser la nourriture jusqu'à sa bouche !", tutBall: 'Touche la bonne balle !',
    },
    de: {
      need: { eat: 'Ich habe Hunger!', bath: 'Ich brauche ein Bad!', hurt: 'Aua! Das tut weh!', play: 'Mir ist langweilig… spielen wir?', sleep: 'Ich bin müde…' },
      look: 'Schau in die Sprechblase!', notThis: 'Das nicht, danke!', full: 'Mein Bauch ist voll! Danke!',
      rub: 'Reib die Flecken weg!', clean: 'Das riecht gut! Ganz sauber!',
      plaster: 'Kleb das Pflaster auf das Aua!', kiss: 'Gibst du mir ein Küsschen?', better: 'Danke! Es tut nicht mehr weh!',
      caught: 'Gefangen!', noBall: 'Nicht der!', playDone: 'Mit dir spielen ist toll!',
      lamp: 'Mach das Licht aus!', night: 'Gute Nacht! Träum süß!', wake: 'Guten Morgen! Spielen wir weiter?',
      love: ['Ich hab dich lieb!', 'Kuscheln ist schön!', 'Hihi, das kitzelt!'],
      choose: 'Such dir dein Tier aus!', hello: 'Hallo! Kümmerst du dich um mich?', shop: 'Geschenke für dein Tier!',
      tut: ['Dein Tier sagt dir, was es braucht: Schau in die Sprechblase!', 'Dann tippe auf den richtigen Knopf!'],
      tutFood: 'Zieh das Essen zum Mund!', tutBall: 'Tippe auf den richtigen Ball!',
    },
    en: {
      need: { eat: "I'm hungry!", bath: 'I need a bath!', hurt: 'Ouch! It hurts!', play: "I'm bored… shall we play?", sleep: "I'm sleepy…" },
      look: 'Look at the bubble!', notThis: 'Not that one, thank you!', full: 'My tummy is full! Thank you!',
      rub: 'Rub the spots away!', clean: 'Smells lovely! All clean!',
      plaster: 'Put the plaster on the sore spot!', kiss: 'Will you give me a kiss?', better: "Thank you! It doesn't hurt any more!",
      caught: 'Caught it!', noBall: 'Not that one!', playDone: 'I love playing with you!',
      lamp: 'Turn off the light!', night: 'Good night! Sweet dreams!', wake: 'Good morning! Shall we play again?',
      love: ['I love you!', 'I love cuddles!', 'Hee hee, that tickles!'],
      choose: 'Choose your pet!', hello: 'Hi! Will you take care of me?', shop: 'Presents for your pet!',
      tut: ['Your pet tells you what it needs: look at the bubble!', 'Then tap the right button!'],
      tutFood: 'Drag the food to its mouth!', tutBall: 'Tap the right ball!',
    },
    es: {
      need: { eat: '¡Tengo hambre!', bath: '¡Necesito un baño!', hurt: '¡Ay! ¡Me duele!', play: 'Me aburro… ¿jugamos?', sleep: 'Tengo sueño…' },
      look: '¡Mira la burbuja!', notThis: '¡Eso no, gracias!', full: '¡Tripita llena! ¡Gracias!',
      rub: '¡Frota para quitar las manchas!', clean: '¡Qué bien huele! ¡Todo limpio!',
      plaster: '¡Pon la tirita en la herida!', kiss: '¿Me das un besito?', better: '¡Gracias! ¡Ya no me duele!',
      caught: '¡Atrapada!', noBall: '¡Esa no!', playDone: '¡Qué divertido jugar contigo!',
      lamp: '¡Apaga la luz!', night: '¡Buenas noches! ¡Dulces sueños!', wake: '¡Buenos días! ¿Jugamos otra vez?',
      love: ['¡Te quiero mucho!', '¡Qué mimos tan bonitos!', '¡Ji ji, me haces cosquillas!'],
      choose: '¡Elige tu mascota!', hello: '¡Hola! ¿Me cuidas?', shop: '¡Regalos para tu mascota!',
      tut: ['Tu mascota te dice lo que necesita: ¡mira la burbuja!', '¡Luego toca el botón correcto!'],
      tutFood: '¡Arrastra la comida hasta su boca!', tutBall: '¡Toca la pelota correcta!',
    },
  };

  /* v21: passeggiata (destra/sinistra, natura, sacchetto) e denti prima della nanna */
  const NATURE = [
    { e: '🌸', n: { it: 'Un fiore', fr: 'Une fleur', de: 'Eine Blume', en: 'A flower', es: 'Una flor' } },
    { e: '🦋', n: { it: 'Una farfalla', fr: 'Un papillon', de: 'Ein Schmetterling', en: 'A butterfly', es: 'Una mariposa' } },
    { e: '🐦', n: { it: 'Un uccellino', fr: 'Un oiseau', de: 'Ein Vogel', en: 'A bird', es: 'Un pajarito' } },
    { e: '🍄', n: { it: 'Un fungo', fr: 'Un champignon', de: 'Ein Pilz', en: 'A mushroom', es: 'Una seta' } },
    { e: '🐌', n: { it: 'Una lumaca', fr: 'Un escargot', de: 'Eine Schnecke', en: 'A snail', es: 'Un caracol' } },
    { e: '🐞', n: { it: 'Una coccinella', fr: 'Une coccinelle', de: 'Ein Marienkäfer', en: 'A ladybird', es: 'Una mariquita' } },
    { e: '🐿️', n: { it: 'Uno scoiattolo', fr: 'Un écureuil', de: 'Ein Eichhörnchen', en: 'A squirrel', es: 'Una ardilla' } },
    { e: '🍂', n: { it: 'Una foglia', fr: 'Une feuille', de: 'Ein Blatt', en: 'A leaf', es: 'Una hoja' } },
  ];
  const LOOK = {
    it: t => `Guarda! ${t.n.it}!`, fr: t => `Regarde ! ${t.n.fr} !`, de: t => `Schau mal! ${t.n.de}!`, en: t => `Look! ${t.n.en}!`, es: t => `¡Mira! ¡${t.n.es}!`,
  };
  const TX2 = {
    it: { need: { walk: 'Andiamo a fare una passeggiata?', teeth: 'Prima della nanna… devo lavarmi i denti!' },
      turn: { left: 'Gira a sinistra!', right: 'Gira a destra!' }, side: { left: 'Questa è la sinistra!', right: 'Questa è la destra!' },
      poo: 'Oops! Serve il sacchetto!', pooDone: 'Grazie! Il parco resta pulito!', walkDone: 'Che bella passeggiata! Torniamo a casa.',
      brush: 'Spazzola i denti, su e giù!', rinse: 'Adesso sciacqua!', teethDone: 'Denti bianchi e brillanti!',
      tutWalk: 'Tocca la strada giusta!', tutBag: 'Trascina il sacchetto sulla cacca!' },
    fr: { need: { walk: 'On va se promener ?', teeth: 'Avant de dormir… je dois me brosser les dents !' },
      turn: { left: 'Tourne à gauche !', right: 'Tourne à droite !' }, side: { left: "Ça, c'est la gauche !", right: "Ça, c'est la droite !" },
      poo: 'Oups ! Il faut le petit sac !', pooDone: 'Merci ! Le parc reste propre !', walkDone: 'Quelle belle promenade ! On rentre à la maison.',
      brush: 'Brosse les dents, de haut en bas !', rinse: 'Maintenant, rince !', teethDone: 'Des dents toutes blanches et brillantes !',
      tutWalk: 'Touche le bon chemin !', tutBag: 'Fais glisser le sac sur le caca !' },
    de: { need: { walk: 'Gehen wir spazieren?', teeth: 'Vor dem Schlafen… muss ich Zähne putzen!' },
      turn: { left: 'Geh nach links!', right: 'Geh nach rechts!' }, side: { left: 'Das ist links!', right: 'Das ist rechts!' },
      poo: 'Hoppla! Wir brauchen das Tütchen!', pooDone: 'Danke! Der Park bleibt sauber!', walkDone: 'Was für ein schöner Spaziergang! Wir gehen nach Hause.',
      brush: 'Putz die Zähne, rauf und runter!', rinse: 'Jetzt ausspülen!', teethDone: 'Blitzblanke weiße Zähne!',
      tutWalk: 'Tippe auf den richtigen Weg!', tutBag: 'Zieh das Tütchen auf das Häufchen!' },
    en: { need: { walk: 'Shall we go for a walk?', teeth: 'Before bed… I need to brush my teeth!' },
      turn: { left: 'Turn left!', right: 'Turn right!' }, side: { left: 'This way is left!', right: 'This way is right!' },
      poo: 'Oops! We need the little bag!', pooDone: 'Thank you! The park stays clean!', walkDone: "What a lovely walk! Let's go home.",
      brush: 'Brush the teeth, up and down!', rinse: 'Now rinse!', teethDone: 'Shiny white teeth!',
      tutWalk: 'Tap the right path!', tutBag: 'Drag the bag onto the poo!' },
    es: { need: { walk: '¿Vamos de paseo?', teeth: 'Antes de dormir… ¡tengo que lavarme los dientes!' },
      turn: { left: '¡Gira a la izquierda!', right: '¡Gira a la derecha!' }, side: { left: '¡Esta es la izquierda!', right: '¡Esta es la derecha!' },
      poo: '¡Uy! ¡Hace falta la bolsita!', pooDone: '¡Gracias! ¡El parque queda limpio!', walkDone: '¡Qué paseo tan bonito! Volvemos a casa.',
      brush: '¡Cepilla los dientes, arriba y abajo!', rinse: '¡Ahora enjuaga!', teethDone: '¡Dientes blancos y brillantes!',
      tutWalk: '¡Toca el camino correcto!', tutBag: '¡Arrastra la bolsita a la caca!' },
  };
  Object.keys(TX2).forEach(l => { const { need, ...rest } = TX2[l]; Object.assign(TX[l].need, need); Object.assign(TX[l], rest); });
  const MUD = [[.3, .34], [.64, .3], [.24, .6], [.72, .58], [.48, .8], [.5, .48]];
  const BUA = [[.28, .42], [.7, .42], [.5, .24], [.36, .72], [.64, .74]];
  const countWord = (n, f, l) => App.excl(App.numWord(n, !!(f.f[l]), l), l);

  App.registerGame({
    id: 'cucciolo', short: 'Cucciolo', icon: '🐾',
    title: { fr: 'Mon petit animal', it: 'Il mio cucciolo', de: 'Mein kleines Tier', en: 'My little pet', es: 'Mi mascota' },
    phrases: l => {
      const T = TX[l];
      const out = [...Object.values(T.need), T.look, T.notThis, T.full, T.rub, T.clean, T.plaster, T.kiss, T.better, T.caught, T.noBall,
        T.playDone, T.lamp, T.night, T.wake, ...T.love, T.choose, T.hello, T.shop, ...T.tut, T.tutFood, T.tutBall,
        T.poo, T.pooDone, T.walkDone, T.brush, T.rinse, T.teethDone, T.tutWalk, T.tutBag, ...Object.values(T.turn), ...Object.values(T.side),
        ...NATURE.map(t => LOOK[l](t)),
        ...Object.values(BALLQ[l]), ...Object.keys(SOMETHING[l]).map(c => WANT_C[l](c))];
      FOOD.forEach(f => { for (let n = 1; n <= 5; n++) { if (n > 1) out.push(WANT_N[l](n, f)); out.push(countWord(n, f, l)); } });
      PETS.forEach(p => out.push(App.excl(p.n[l], l), p.v[l]));
      PITEMS.forEach(it => out.push(App.excl(it.n[l], l), `${App.excl(it.n[l], l)} ${App.t('buyQ')}`));
      return out;
    },
    start({ stage, addPill, setHelp }) {
      const st = App.state;
      st.pet = Object.assign({ a: null, owned: [], head: null, neck: null, room: [], sessions: 0 }, st.pet || {});
      const P = st.pet;
      let alive = true, lv = App.level('cucciolo');
      let mode = 'idle', cur = null, needs = [], l = App.lang, T = TX[l], steps = [], lastSay = null;
      const timers = new Set();
      const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms); timers.add(id); return id; };
      const speak = (txt, o = {}) => { lastSay = txt; return say(txt, { lang: l, ...o }); };
      const starPill = addPill(`⭐ ${st.stars}`);
      starPill.classList.add('stars-pill');

      /* ---------- cameretta ---------- */
      const room = h('div', { class: 'pc-room' });
      const win = h('div', { class: 'pc-win' }, h('span', {}, '☀️'));
      const deco = h('div', { class: 'pc-deco' });
      const body = h('span', { class: 'pc-body' });
      const headEl = h('span', { class: 'pc-head' }), neckEl = h('span', { class: 'pc-neck' }), bedEl = h('span', { class: 'pc-bed' });
      const spots = h('div', { class: 'pc-spots' });
      const bubble = h('div', { class: 'pc-bubble' });
      const pet = h('div', { class: 'pc-pet' }, bedEl, body, spots, neckEl, headEl, bubble);
      const bar = h('div', { class: 'pc-bar' });
      const night = h('div', { class: 'pc-night' });
      const side = h('div', { class: 'pc-side' },
        h('button', { class: 'icon-btn', 'aria-label': 'Regali', onclick: () => { if (mode === 'idle') shop(); } }, '🛍️'),
        h('button', { class: 'icon-btn', 'aria-label': 'Cambia animale', onclick: () => { if (mode === 'idle') choose(false); } }, '🔄'));
      room.append(h('div', { class: 'pc-wall' }), h('div', { class: 'pc-floor' }), win, deco, pet, night, bar, side);
      stage.append(room);

      function draw() {
        const a = PETS.find(p => p.id === P.a) || PETS[0];
        body.textContent = a.e;
        body.className = `pc-body a-${a.id}`;   // ogni animale ha il suo modo di muoversi
        const it = id => PITEMS.find(x => x.id === id);
        headEl.textContent = P.head ? it(P.head).e : '';
        neckEl.textContent = P.neck ? it(P.neck).e : '';
        bedEl.textContent = P.room.includes('cesta') ? '🧺' : '';
        deco.innerHTML = '';
        P.room.filter(id => id !== 'cesta').forEach(id => deco.append(h('span', { class: `pc-d pc-d-${id}` }, it(id).e)));
      }
      const petNow = () => PETS.find(p => p.id === P.a) || PETS[0];
      const petRect = () => pet.getBoundingClientRect();
      /* l'unicorno ogni tanto fa brillare il corno */
      const sparkle = setInterval(() => {
        if (!alive || P.a !== 'unicorno' || (mode !== 'idle' && mode !== 'busy')) return;
        const r = petRect(); App.glitter(r.left + r.width * .3, r.top + r.height * .08, 7);
      }, 4200);
      timers.add(sparkle);
      const mouthPt = () => { const r = petRect(); return { x: r.left + r.width / 2, y: r.top + r.height * .68 }; };
      function anim(cls, ms = 600) { pet.classList.remove(cls); void pet.offsetWidth; pet.classList.add(cls); later(() => pet.classList.remove(cls), ms); }
      function hearts(n = 4) {
        const r = petRect();
        for (let i = 0; i < n; i++) later(() => App.floatAt(r.left + r.width * (.2 + Math.random() * .6), r.top + r.height * (.1 + Math.random() * .4), pick(['💖', '💕', '💗'])), i * 140);
        sfx.star();
      }
      function setBubble(e) {
        bubble.textContent = e || '';
        bubble.classList.toggle('on', !!e);
      }

      /* coccole: toccare il cucciolo quando non si sta facendo altro */
      let lastLove = 0;
      pet.addEventListener('pointerdown', () => {
        if (mode === 'kiss') { kissDone && kissDone(); return; }
        if ((mode !== 'idle' && mode !== 'asleep') || Date.now() - lastLove < 1800) return;
        lastLove = Date.now();
        anim('trick', 900);
        if (mode === 'asleep') { App.floatAt(petRect().left + petRect().width / 2, petRect().top, '💤'); return; }
        hearts(3);
        speak(Math.random() < .5 ? petNow().v[l] : pick(T.love));
      });

      /* ---------- trascinare (cibo, cerotto) ---------- */
      function drag(el, onDrop) {
        let pid = null, x0 = 0, y0 = 0;
        el.addEventListener('pointerdown', e => {
          if (pid !== null) return;
          pid = e.pointerId; e.preventDefault();
          try { el.setPointerCapture(pid); } catch (err) { /* dito non più attivo */ }
          x0 = e.clientX; y0 = e.clientY;
          el.classList.add('drag'); el.style.transition = 'none';
          sfx.tap();
        });
        el.addEventListener('pointermove', e => {
          if (e.pointerId !== pid) return;
          el.style.transform = `translate(${e.clientX - x0}px, ${e.clientY - y0}px) scale(1.15)`;
        });
        const up = e => {
          if (e.pointerId !== pid) return;
          pid = null;
          el.classList.remove('drag');
          const r = el.getBoundingClientRect();
          if (!onDrop(r.left + r.width / 2, r.top + r.height / 2)) { el.style.transition = 'transform .35s ease'; el.style.transform = ''; }
        };
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
      }
      const onPet = (x, y, pad = .12) => { const r = petRect(), px = r.width * pad; return x > r.left - px && x < r.right + px && y > r.top - px && y < r.bottom + px; };
      function gulp(el) {
        el.style.transition = 'transform .25s ease, opacity .25s ease';
        el.style.transform += ' scale(.2)'; el.style.opacity = '0';
        later(() => el.remove(), 260);
        anim('chomp', 450); sfx.pop(); later(() => sfx.pop(), 160);
      }

      /* ---------- bisogni ---------- */
      function newSession() {
        needs = shuffle(['eat', 'bath', 'hurt', 'play', 'walk']).slice(0, 3).concat('teeth', 'sleep');   // i denti sempre prima della nanna
        nextNeed();
      }
      let firstTap = true;
      function nextNeed() {
        if (!alive) return;
        cur = needs.shift();
        l = App.nextLang(); T = TX[l];
        mode = 'idle'; firstTap = true;
        spots.innerHTML = '';
        if (cur === 'bath') shuffle(MUD).slice(0, 5).forEach(([x, y]) => spots.append(h('i', { class: 'pc-mud', style: `left:${x * 100}%;top:${y * 100}%` })));
        if (cur === 'hurt') { const [x, y] = pick(BUA); spots.append(h('i', { class: 'pc-bua', style: `left:${x * 100}%;top:${y * 100}%` })); }
        pet.classList.toggle('sleepy', cur === 'sleep');
        setBubble(NEEDS[cur]);
        careBar();
        steps = [
          { text: T.tut[0], icon: '💭', action: 'tap', at: () => bubble, cap: 'top' },
          { text: T.tut[1], icon: '👆', action: 'tap', at: () => bar.querySelector(`[data-k="${cur}"]`) || bar, cap: 'top' },
        ];
        App.intro('cucciolo', steps).then(() => alive && speak(T.need[cur]));
      }
      function careBar() {
        bar.innerHTML = '';
        Object.entries(NEEDS).forEach(([k, e]) => bar.append(h('button', { class: 'pc-btn', 'data-k': k, onclick: () => care(k) }, e)));
      }
      async function care(k) {
        if (mode !== 'idle' || !cur) return;
        if (firstTap) { firstTap = false; App.track('cura', null, k === cur); }
        if (k !== cur) {
          sfx.boing(); anim('shake');
          speak(T.look).then(() => alive && mode === 'idle' && speak(T.need[cur], { queue: true }));
          return;
        }
        sfx.pop();
        mode = 'busy';
        setBubble('');
        const done = await { eat: feed, bath, hurt, play, walk, teeth, sleep }[cur]();
        if (!alive || done === false) return;
        if (cur !== 'sleep') {
          const r = petRect();
          App.addStars(1, r.left + r.width / 2, r.top);
          hearts(5); anim('happy', 700);
          await wait(1200);
          nextNeed();
        }
      }

      /* ---------- pappa: contare o riconoscere il colore ---------- */
      function feed() {
        return new Promise(res => {
          const colorMode = lv >= 2 && Math.random() < .45;
          const target = pick(FOOD);
          const n = colorMode ? 1 : rint(2, lv >= 2 ? 5 : 3);
          const q = colorMode ? WANT_C[l](target.c) : WANT_N[l](n, target);
          let items;
          if (colorMode) {
            const others = shuffle(FOOD.filter(f => f.c !== target.c));
            items = [target, ...others.slice(0, lv >= 3 ? 5 : 3)];
          } else {
            const others = FOOD.filter(f => f !== target);
            items = [...Array(Math.min(6, n + 1)).fill(target), ...shuffle(others).slice(0, lv >= 3 ? 3 : 2)];
          }
          bar.innerHTML = '';
          const tray = h('div', { class: 'pc-tray' });
          bar.append(tray);
          let got = 0, firstDrop = true, over = false;
          const pill = h('div', { class: 'pc-count' });
          const updPill = () => { pill.textContent = colorMode ? '' : `${target.e} ${got}/${n}`; pill.classList.toggle('on', !colorMode); };
          room.append(pill); updPill();
          shuffle(items).forEach(f => {
            const el = h('div', { class: 'pc-food' }, f.e);
            tray.append(el);
            drag(el, (x, y) => {
              if (over || !onPet(x, y)) return false;
              const ok = colorMode ? f.c === target.c : f === target;
              if (colorMode && firstDrop) { firstDrop = false; App.track('colori', null, ok); }
              if (!ok) { sfx.boing(); anim('shake'); speak(T.notThis).then(() => alive && !over && speak(q, { queue: true })); return false; }
              gulp(el);
              got++; updPill();
              if (colorMode || got >= n) {
                over = true;
                if (!colorMode) App.track('numeri', n, true);
                (colorMode ? Promise.resolve() : speak(countWord(got, f, l))).then(() => alive && speak(T.full, { queue: !colorMode }))
                  .then(() => { pill.remove(); res(true); });
              } else speak(countWord(got, f, l));
              return true;
            });
          });
          const firstTarget = () => [...tray.children].find((el, i) => el.textContent === target.e || el.querySelector(`img[alt="${target.e}"]`)) || tray.firstChild;
          steps = [{ text: T.tutFood, icon: target.e, action: 'drag', at: firstTarget, to: mouthPt, cap: 'top' }];
          later(() => App.intro('cucciolo_pappa', steps).then(() => alive && speak(q)), 350);
        });
      }

      /* ---------- bagnetto: strofinare via le macchie ---------- */
      function bath() {
        return new Promise(res => {
          bar.innerHTML = '';
          const sponge = h('div', { class: 'pc-sponge' }, '🧽');
          room.append(sponge);
          const S = () => stage.getBoundingClientRect();
          const put = (x, y) => { const s = S(); sponge.style.left = `${x - s.left}px`; sponge.style.top = `${y - s.top}px`; };
          const r0 = petRect(); put(r0.left + r0.width / 2, r0.bottom + 40);
          let pid = null, lastBub = 0, finished = false;
          const scrub = e => {
            put(e.clientX, e.clientY);
            spots.querySelectorAll('.pc-mud').forEach(m => {
              const r = m.getBoundingClientRect();
              if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) > Math.max(34, r.width * .8)) return;
              const o = (m._o ?? 1) - .09;
              m._o = o; m.style.opacity = Math.max(0, o);
              if (o <= 0) { m.remove(); sfx.pop(); }
            });
            if (Date.now() - lastBub > 140 && onPet(e.clientX, e.clientY, 0)) { lastBub = Date.now(); App.floatAt(e.clientX + rint(-20, 20), e.clientY - 10, '🫧'); }
            if (!finished && !spots.querySelector('.pc-mud')) {
              finished = true; cleanup();
              sponge.remove(); sfx.splash();
              const r = petRect();
              for (let i = 0; i < 6; i++) later(() => App.floatAt(r.left + r.width * Math.random(), r.top + r.height * .3 * Math.random(), '💧'), i * 90);
              App.glitter(r.left + r.width / 2, r.top + r.height / 2, 16);
              speak(T.clean).then(() => res(true));
            }
          };
          const down = e => { if (pid !== null) return; pid = e.pointerId; e.preventDefault(); scrub(e); };
          const move = e => { if (e.pointerId === pid) scrub(e); };
          const up = e => { if (e.pointerId === pid) pid = null; };
          stage.addEventListener('pointerdown', down); stage.addEventListener('pointermove', move);
          stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
          function cleanup() {
            stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointermove', move);
            stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up);
          }
          const side0 = () => { const r = petRect(); return { x: r.left + r.width * .2, y: r.top + r.height * .5 }; };
          const side1 = () => { const r = petRect(); return { x: r.left + r.width * .8, y: r.top + r.height * .55 }; };
          steps = [{ text: T.rub, icon: '🧽', action: 'swipe', at: side0, to: side1, cap: 'top' }];
          App.intro('cucciolo_bagno', steps).then(() => alive && !finished && speak(T.rub));
        });
      }

      /* ---------- dottore: cerotto sulla bua, poi un bacino ---------- */
      let kissDone = null;
      function hurt() {
        return new Promise(res => {
          bar.innerHTML = '';
          const plaster = h('div', { class: 'pc-food' }, '🩹');
          bar.append(h('div', { class: 'pc-tray' }, plaster));
          const bua = spots.querySelector('.pc-bua');
          const buaPt = () => { const r = bua.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
          drag(plaster, (x, y) => {
            const b = buaPt();
            if (Math.hypot(x - b.x, y - b.y) > Math.max(60, petRect().width * .22)) return false;
            plaster.remove();
            spots.append(h('i', { class: 'pc-plaster', style: `left:${bua.style.left};top:${bua.style.top}` }, '🩹'));
            bua.remove(); sfx.pop();
            mode = 'kiss';
            kissDone = () => {
              kissDone = null; mode = 'busy';
              hearts(6);
              speak(T.better).then(() => res(true));
            };
            speak(T.kiss);
            return true;
          });
          steps = [{ text: T.plaster, icon: '🩹', action: 'drag', at: () => plaster, to: buaPt, cap: 'top' }];
          App.intro('cucciolo_dottore', steps).then(() => alive && speak(T.plaster));
        });
      }

      /* ---------- palla: riconoscere i colori ---------- */
      function play() {
        return new Promise(res => {
          let round = 0;
          const one = () => {
            if (!alive) return;
            bar.innerHTML = '';
            const cols = shuffle(Object.keys(BALL)).slice(0, lv >= 2 ? 4 : 3);
            const want = pick(cols);
            const q = BALLQ[l][want];
            let first = true, busy = false, okBall = null;
            const row = h('div', { class: 'pc-tray' });
            cols.forEach(c => {
              const b = h('div', { class: 'pc-ball', style: `--c:${BALL[c]}` });
              if (c === want) okBall = b;
              b.addEventListener('pointerdown', e => {
                e.preventDefault();
                if (busy) return;
                if (first) { first = false; App.track('colori', null, c === want); }
                if (c !== want) {
                  sfx.boing(); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
                  speak(T.noBall).then(() => alive && !busy && speak(q, { queue: true }));
                  return;
                }
                busy = true;
                const r = b.getBoundingClientRect(), m = mouthPt();
                b.style.transition = 'transform .5s cubic-bezier(.3,.6,.4,1)';
                b.style.transform = `translate(${m.x - (r.left + r.width / 2)}px, ${m.y - 30 - (r.top + r.height / 2)}px) scale(.7)`;
                sfx.hop();
                later(() => { anim('jump', 600); sfx.ding(); b.remove(); }, 500);
                later(() => speak(T.caught).then(() => {
                  if (!alive) return;
                  if (++round >= 3) speak(T.playDone).then(() => res(true));
                  else one();
                }), 650);
              });
              row.append(b);
            });
            bar.append(row);
            steps = [{ text: T.tutBall, icon: '⚽', action: 'tap', at: () => okBall, cap: 'top' }];
            if (round === 0) App.intro('cucciolo_palla', steps).then(() => alive && speak(q));
            else speak(q);
          };
          one();
        });
      }

      /* ---------- passeggiata: incroci (destra/sinistra), natura, sacchetto per i bisognini ---------- */
      function walk() {
        return new Promise(res => {
          bar.innerHTML = '';
          const scene = h('div', { class: 'pw-scene' });
          room.append(scene);
          const J = lv >= 2 ? 3 : 2, pooAt = rint(0, J - 1), things = shuffle(NATURE);
          const walker = h('div', { class: 'pw-pet' }, h('span', { class: `pc-body a-${petNow().id}` }, petNow().e));
          const moveTo = (x, y, ms = 1100) => new Promise(ok => {
            walker.style.transition = `left ${ms}ms ease-in-out, top ${ms}ms ease-in-out`;
            walker.style.left = `${x}%`; walker.style.top = `${y}%`;
            walker.classList.add('walking');
            later(() => { walker.classList.remove('walking'); ok(); }, ms);
          });
          const DECO = [[10, 64], [16, 86], [90, 64], [84, 86], [12, 28], [34, 24], [66, 26], [88, 30]];
          function poo() {
            return new Promise(ok => {
              const pp = h('div', { class: 'pw-poo', style: `left:${50 + pick([-1, 1]) * 14}%;top:76%` }, '💩');
              const bag = h('div', { class: 'pc-food' }, '🛍️');
              const tray = h('div', { class: 'pw-tray' }, bag);
              scene.append(pp, tray);
              const ppPt = () => { const r = pp.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
              drag(bag, (x, y) => {
                const p = ppPt();
                if (Math.hypot(x - p.x, y - p.y) > 75) return false;
                tray.remove(); pp.classList.add('gone'); sfx.pop();
                App.glitter(p.x, p.y, 12);
                speak(T.pooDone).then(() => { pp.remove(); ok(); });
                return true;
              });
              steps = [{ text: T.tutBag, icon: '🛍️', action: 'drag', at: () => bag, to: ppPt, cap: 'top' }];
              anim('shake');
              speak(T.poo).then(() => alive && pp.isConnected && App.intro('cucciolo_sacchetto', steps));
            });
          }
          let s = 0;
          async function leg() {
            if (!alive) return;
            scene.innerHTML = '';
            scene.classList.remove('fade');
            const deco = h('div', { class: 'pw-deco' });
            shuffle(DECO).slice(0, 6).forEach(([x, y]) => deco.append(h('span', { style: `left:${x}%;top:${y}%` }, pick(['🌳', '🌳', '🌲', '🌷', '🌼']))));
            const thing = things[s % things.length], tside = pick([-1, 1]);
            const th = h('button', { class: 'pw-thing', style: `left:${50 + tside * 23}%;top:64%` }, thing.e);
            th.onclick = () => { const r = th.getBoundingClientRect(); App.glitter(r.left + r.width / 2, r.top + r.height / 2, 10); speak(LOOK[l](thing)); };
            const want = pick(['left', 'right']);
            const arrows = ['left', 'right'].map(d => h('button', { class: `pw-arrow pw-${d}`, 'aria-label': d }, d === 'left' ? '⬅️' : '➡️'));
            scene.append(h('i', { class: 'pw-v' }), h('i', { class: 'pw-h' }), deco, th, walker, ...arrows);
            walker.style.transition = 'none'; walker.style.left = '50%'; walker.style.top = '96%';
            await wait(60);
            await moveTo(50, 72);
            if (!alive) return;
            th.classList.add('on'); sfx.ding();
            await speak(LOOK[l](thing));
            if (!alive) return;
            await wait(400);
            if (s === pooAt) { await poo(); if (!alive) return; }
            await moveTo(50, 47);
            if (!alive) return;
            arrows.forEach(a => a.classList.add('on'));
            const q = T.turn[want];
            const d = await new Promise(ok => {
              let first = true;
              arrows.forEach((a, i) => { a.onclick = () => {
                const dd = i ? 'right' : 'left';
                if (first) { first = false; App.track('spazio', null, dd === want); }
                if (dd !== want) {
                  sfx.boing(); a.classList.remove('no'); void a.offsetWidth; a.classList.add('no');
                  speak(T.side[dd]).then(() => alive && speak(q, { queue: true }));
                  return;
                }
                arrows.forEach(x => { x.onclick = null; });
                sfx.ding(); ok(dd);
              }; });
              steps = [{ text: T.tutWalk, icon: want === 'left' ? '⬅️' : '➡️', action: 'tap', at: () => arrows[want === 'left' ? 0 : 1], cap: 'top' }];
              App.intro('cucciolo_passeggiata', steps).then(() => alive && speak(q));
            });
            if (!alive) return;
            arrows.forEach(a => a.classList.remove('on'));
            await moveTo(d === 'left' ? -14 : 114, 47, 1300);
            if (!alive) return;
            s++;
            scene.classList.add('fade');
            await wait(450);
            if (s < J) return leg();
            scene.remove();
            anim('jump', 600);
            await speak(T.walkDone);
            res(true);
          }
          leg();
        });
      }

      /* ---------- denti: spazzolino su e giù, poi sciacquo ---------- */
      function teeth() {
        return new Promise(res => {
          bar.innerHTML = '';
          const scene = h('div', { class: 'pt-scene' });
          const mouth = h('div', { class: 'pt-mouth' });
          [0, 1].forEach(k => { const row = h('div', { class: 'pt-row' + (k ? ' low' : '') }); for (let i = 0; i < 5; i++) row.append(h('i', { class: 'pt-tooth' })); mouth.append(row); });
          const brush = h('div', { class: 'pt-brush' }, '🪥');
          scene.append(h('div', { class: 'pt-face' }, h('span', { class: `pc-body a-${petNow().id}` }, petNow().e)), mouth, brush);
          room.append(scene);
          shuffle([...mouth.querySelectorAll('.pt-tooth')]).slice(0, lv >= 2 ? 7 : 5).forEach(t => t.append(h('b', { class: 'pt-dirt' })));
          const put = (x, y) => { const s0 = scene.getBoundingClientRect(); brush.style.left = `${x - s0.left}px`; brush.style.top = `${y - s0.top}px`; };
          let pid = null, lastBub = 0, finished = false;
          const scrub = e => {
            put(e.clientX, e.clientY);
            mouth.querySelectorAll('.pt-dirt').forEach(m => {
              const r = m.getBoundingClientRect();
              if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) > Math.max(32, r.width)) return;
              const o = (m._o ?? 1) - .1;
              m._o = o; m.style.opacity = Math.max(0, o);
              if (o <= 0) { m.remove(); sfx.pop(); }
            });
            if (Date.now() - lastBub > 150) { lastBub = Date.now(); App.floatAt(e.clientX + rint(-18, 18), e.clientY - 12, '🫧'); }
            if (finished || mouth.querySelector('.pt-dirt')) return;
            finished = true;
            brush.remove();
            const cup = h('button', { class: 'big-btn pt-cup' }, '🥛');
            scene.append(cup);
            speak(T.rinse);
            cup.onclick = () => {
              cup.remove(); sfx.splash();
              const r = mouth.getBoundingClientRect();
              for (let i = 0; i < 7; i++) later(() => App.floatAt(r.left + r.width * Math.random(), r.top + r.height * Math.random(), '💧'), i * 80);
              mouth.classList.add('shine');
              App.glitter(r.left + r.width / 2, r.top + r.height / 2, 18);
              speak(T.teethDone).then(() => { if (!alive) return; scene.classList.add('fade'); later(() => { scene.remove(); res(true); }, 450); });
            };
          };
          scene.addEventListener('pointerdown', e => { if (pid !== null || finished) return; pid = e.pointerId; e.preventDefault(); scrub(e); });
          scene.addEventListener('pointermove', e => { if (e.pointerId === pid && !finished) scrub(e); });
          const up = e => { if (e.pointerId === pid) pid = null; };
          scene.addEventListener('pointerup', up); scene.addEventListener('pointercancel', up);
          later(() => { const r = mouth.getBoundingClientRect(); put(r.right - 30, r.bottom + 40); }, 30);
          const a0 = () => { const r = mouth.getBoundingClientRect(); return { x: r.left + r.width * .2, y: r.top + r.height * .3 }; };
          const a1 = () => { const r = mouth.getBoundingClientRect(); return { x: r.left + r.width * .8, y: r.top + r.height * .7 }; };
          steps = [{ text: T.brush, icon: '🪥', action: 'swipe', at: a0, to: a1, cap: 'top' }];
          later(() => App.intro('cucciolo_denti', steps).then(() => alive && !finished && speak(T.brush)), 80);
        });
      }

      /* ---------- nanna: spegnere la luce, poi di nuovo giorno ---------- */
      function sleep() {
        return new Promise(() => {
          bar.innerHTML = '';
          const lamp = h('button', { class: 'pc-lamp', 'aria-label': 'Luce' }, '💡');
          room.append(lamp);
          lamp.onclick = async () => {
            if (mode !== 'busy') return;
            mode = 'asleep';
            sfx.tap();
            lamp.classList.add('off');
            room.classList.add('dark');
            win.firstChild.textContent = '🌙';
            pet.classList.remove('sleepy'); pet.classList.add('asleep');
            const zz = setInterval(() => { if (!alive) return clearInterval(zz); const r = petRect(); App.floatAt(r.left + r.width * .7, r.top + r.height * .15, '💤'); }, 1400);
            timers.add(zz);
            await speak(T.night);
            if (!alive) return;
            P.sessions++;
            App.save();
            const r = petRect();
            App.addStars(3, r.left + r.width / 2, r.top);
            const want = Math.min(3, 1 + Math.floor(P.sessions / 2));
            if (want > lv) { lv = want; App.levelUp('cucciolo', lv); }
            if (P.sessions % 2 === 0) { await wait(900); if (!alive) return; await App.reward(); if (!alive) return; }
            lamp.remove();
            const wake = h('button', { class: 'big-btn pc-wake' }, '☀️');
            room.append(wake);
            wake.onclick = () => {
              wake.remove(); clearInterval(zz); timers.delete(zz);
              room.classList.remove('dark'); win.firstChild.textContent = '☀️';
              pet.classList.remove('asleep'); anim('jump', 600); sfx.win();
              speak(petNow().v[l]).then(() => alive && speak(T.wake)).then(() => alive && newSession());
            };
          };
          steps = [{ text: T.lamp, icon: '💡', action: 'tap', at: () => lamp, cap: 'top' }];
          App.intro('cucciolo_nanna', steps).then(() => alive && mode === 'busy' && speak(T.lamp));
        });
      }

      /* ---------- scegliere l'animale ---------- */
      function choose(first) {
        mode = 'choose';
        const l0 = App.lang, T0 = TX[l0];
        const grid = h('div', { class: 'pc-grid' });
        const ov = h('div', { class: 'pc-choose' }, h('h2', {}, T0.choose), grid);
        PETS.forEach(p => grid.append(h('button', {
          class: 'pc-pick' + (p.id === P.a ? ' sel' : ''), onclick: () => {
            if (ov.dataset.done) return;
            ov.dataset.done = '1';
            P.a = p.id; App.save(); draw();
            sfx.win(); App.confetti(40);
            say(App.excl(p.n[l0], l0), { lang: l0 }).then(() => {
              if (!alive) return;
              ov.remove(); anim('jump', 600);
              return say(p.v[l0], { lang: l0 }).then(() => alive && say(T0.hello, { lang: l0 }));
            }).then(() => {
              if (!alive) return;
              if (first) newSession();
              else { mode = 'idle'; speak(T.need[cur]); }
            });
          },
        }, p.e)));
        room.append(ov);
        steps = [];
        say(T0.choose, { lang: l0 });
      }

      /* ---------- regali per il cucciolo ---------- */
      function shop() {
        const l0 = App.lang;
        const grid = h('div', { class: 'ward-grid pc-shop' });
        const close = App.modal([h('h2', { style: 'font-size:22px' }, `🛍️ ${TX[l0].shop}`), grid,
          h('div', { class: 'row' }, h('button', { class: 'big-btn', onclick: () => close() }, '✔️'))]);
        say(TX[l0].shop, { lang: l0 });
        const fill = () => {
          grid.innerHTML = '';
          PITEMS.forEach(it => {
            const own = P.owned.includes(it.id);
            const worn = it.slot === 'room' ? P.room.includes(it.id) : P[it.slot] === it.id;
            grid.append(h('button', {
              class: 'ward-item' + (own ? ' own' : '') + (worn ? ' worn' : ''), onclick: () => pickItem(it),
            }, h('span', { class: 'e' }, it.e), own ? (worn ? h('span', { class: 'tag' }, '✔') : null) : h('span', { class: 'price' }, `⭐${it.price}`)));
          });
        };
        const wear = (it, on) => {
          if (it.slot === 'room') P.room = on ? [...new Set([...P.room, it.id])] : P.room.filter(x => x !== it.id);
          else P[it.slot] = on ? it.id : null;
        };
        let calm = 0;
        function pickItem(it) {
          if (Date.now() < calm) return;
          const name = App.excl(it.n[App.lang]);
          if (P.owned.includes(it.id)) {
            const on = !(it.slot === 'room' ? P.room.includes(it.id) : P[it.slot] === it.id);
            wear(it, on); App.save(); draw(); fill(); sfx.pop();
            if (on) say(name);
            return;
          }
          if (st.stars < it.price) { sfx.boing(); say(App.t('missing', it.price - st.stars)); return; }
          say(`${name} ${App.t('buyQ')}`);
          const c2 = App.modal([h('div', { class: 'big' }, it.e), h('h2', {}, `⭐ ${it.price}`), h('div', { class: 'row' },
            h('button', {
              class: 'big-btn', style: 'background:#4cd06b;box-shadow:0 8px 0 #2f9a4a', onclick: () => {
                c2(); calm = Date.now() + 500;
                if (P.owned.includes(it.id) || st.stars < it.price) return;
                st.stars -= it.price; P.owned.push(it.id); wear(it, true); App.save();
                document.querySelectorAll('.stars-pill').forEach(p => { p.textContent = `⭐ ${st.stars}`; });
                sfx.win(); App.confetti(60); say(App.t('bought'));
                draw(); fill();
              },
            }, '✔️'),
            h('button', { class: 'big-btn', style: 'background:#ff6b6b;box-shadow:0 8px 0 #c94444', onclick: () => c2() }, '✖️'))]);
        }
        fill();
      }

      setHelp(() => App.tutorial(steps.length ? steps : [{ text: TX[App.lang].tut[1], icon: '👆', action: 'tap', at: () => bar, cap: 'top' }])
        .then(() => alive && lastSay && say(lastSay, { lang: l })));
      draw();
      careBar();
      requestAnimationFrame(() => { if (!alive) return; if (!P.a) choose(true); else newSession(); });
      return () => { alive = false; timers.forEach(id => { clearTimeout(id); clearInterval(id); }); };
    },
  });
})();
