# STATO — Giochi di Lena
_Aggiornato: 26/09/2026_

## Obiettivo
PWA senza pubblicità con giochi educativi **multilingua** (1 o 2 lingue a scelta tra FR/IT/DE/EN/ES) per Lena (FR+IT, 5 anni il 18/01/2027, prima lingua francese), da telefono (Android papà, iPhone Mahault).
Online: https://vincenzosilvestri.github.io/giochi-lena/ — repo pubblico `vincenzosilvestri/giochi-lena` (GitHub Pages, main). Versione online: **v19**.

## Fatto finora
- 10 giochi (`js/games/`): **Sopra o sotto?** (v15: trascinare un giocattolo sopra/sotto/dentro/accanto), **Suoni e sillabe** (v13: batti le sillabe + rime, 5 lingue), **Scrivi con il dito** (v13: tracciato di lettere A-Z e cifre 0-9 nel verso giusto, livelli nome→vocali→tutto), Lena Salta (semaforo, strisce, treno con passaggio a livello, 4 mondi prato/neve/spiaggia/città di notte), Conta, Memory (animali/foto), Pesca le Lettere (+ comporre il nome), Forme e Colori, Colora (12 disegni, arcobaleno, 4 glitter, galleria), Le due lingue (Dov'è…, Memory FR↔IT, Quale lingua?).
- **v12 — Multilingua:** 5 lingue (fr, it, de, en-GB, es-ES); il genitore sceglie 1 o 2 lingue al primo avvio o nel menu papà («Lingue del bambino»); con 2 lingue alternanza o una sola; con 1 lingua «Le due lingue» è nascosto (`needs2`). Default FR+IT (Lena). Menu papà in italiano.
- Voci: 5038 frasi pre-generate con edge-tts (IT Isabella, FR Denise, DE Katja, EN Sonia, ES Elvira; 69 MB sul server) in `voice/`; `voice/index-<lingua>.json` per lingua: l'app scarica in sottofondo solo le voci delle lingue scelte (cache `lena-voice-1`). Fallback TTS del telefono per nomi delle foto.
- Premi: stelle ⭐ → Armadio (14 accessori sul personaggio), album 24 sticker + diploma.
- Menu papà (⚙️ premuto 1,5 s + PIN): timer nanna con storia della buonanotte (3 storie), lingua, Pagella (lettere/numeri, lingue, strada, tempo 7 giorni), voci registrate, foto, disegni, festa compleanno 18/01.
- **v11 — Livelli e statistiche:** badge 🏅 nei giochi con livelli (Conta 1-4, Lettere 1-3, Memory 1-4, Forme 1-4, Due lingue 1-3; Strada da record distanza), festa + voce al passaggio di livello. Storico giornaliero per abilità (`state.hist`, 200 giorni) e registro livelli (`state.levelLog`). Menu papà: tabella «Livelli e progressi» (livello, % giuste 7 giorni, tendenza vs settimana prima, 8 settimane, ultimi livelli). API: `App.track(skill, key, ok)`, `App.levelUp(game, n)`.
- **v14 — Grafica coerente:** tutte le emoji sono immagini incluse (Microsoft Fluent Emoji 3D, MIT, 219 immagini ~4 MB in `emoji/`, bandiere SVG fatte a mano); sostituzione automatica nel DOM (MutationObserver) e nel canvas di Salta (`App.emojiImage`). Strumenti: `tools/scan-emoji.mjs` + `tools/fetch_emoji.py`.
- **v15:** Conta +/− (addizioni entro 10 dal livello 2, sottrazioni dal 4, con voce «tre più due fa cinque»); mascotte = personaggio del bambino nei tutorial; pausa ogni 20/30 min (10 min di stop, preset 3-6-9-12 2×30); «Effetti calmi»; lingua «una per partita».
- **v16:** difficoltà adattiva (`App.adaptivePick`): lettere e numeri sbagliati più spesso ricompaiono di più.
- **v17 — Rifiniture:** musica di sottofondo generata (pentatonica, si abbassa quando parla la voce, «notturna» in storia/nanna, interruttore nel menu papà); caselle Home che entrano a cascata, stelle che saltano, transizioni morbide.
- **v18 — Revisione completa** (6 revisori in parallelo + test "mano scimmia" automatico su tutti i giochi in 3 configurazioni di lingua): ~70 correzioni. Principali: PIN creabile solo dopo una moltiplicazione (niente più prompt/confirm); lingua «una per partita» all'avvio; voce registrata interrotta che bloccava il gioco; musica che si rialzava sotto la voce; audio iOS ripreso al tocco; compleanno non perso/interrotto; nanna sbloccata il giorno dopo; doppi tocchi (PIN, armadio, storia, bandiere, stella di Colora); Salta: acqua durante invulnerabilità, salti in coda, farming delle stelle, aiuto in pausa, auto sulle strisce, lampeggio non premiato, campo centrato in orizzontale; Memory griglia con foto; Due lingue senza parole quasi uguali; Lettere pesci distanziati e parole con iniziali «pulite»; Forme sequenze su una riga; Sopra/sotto classificato sul piano vero; Scrivi 8/9/G/4 nel verso scolastico; Suoni rime in entrambi i versi. **Barra di aggiornamento** sulla schermata iniziale (messaggi dal service worker) e download voci. SW: cache solo risposte valide, emoji in cache separata.
- **v19 — 2° giro di revisione** (4 revisori + mano scimmia a 360×640): griglia 6 immagini di "Dov'è" che usciva dallo schermo; Memory conta l'errore solo se la carta uguale era già vista; Conta traccia di nuovo i numeri giusti; Salta: auto sulle strisce controllate in tutte le corsie, oggetti tagliati al campo, "rossi" contati per ciclo di semaforo, HUD compatto sui telefoni stretti; Sopra/sotto: frase neutra "Adesso è sopra" invece del complimento, voci che non si accavallano; Pesca: pesci della stessa corsia mai sovrapposti e senza scatto indietro, slot del nome che si stringono; Colora: niente tocchi durante il salvataggio, disegno non perso se la memoria non c'è; Forme: manina del tutorial sulla risposta giusta, colori ben distinti nelle sequenze; nucleo: barra voci solo se mancano file, musica bassa anche cambiando schermata mentre parla la voce, PIN (✕ annulla, niente doppia moltiplicazione, il vecchio PIN vale finché il nuovo non è confermato), microfono spento se si esce, nanna sbloccata anche con l'app aperta; SW: barra che sparisce anche se l'aggiornamento fallisce.
- Tutorial con manina 👆 + tasto ❓; glitter ovunque; app centrata su PC; aggiornamento automatico (SW `no-cache` + reload) e numero versione in basso.

## Prossimi passi
_Roadmap completa (ricerca concorrenti, pedagogia, store) in `ROADMAP.md`._
1. Raccogliere feedback e statistiche dall'uso reale (tabella «Livelli e progressi»).
2. **Piano store + monetizzazione** in `ROADMAP.md` Fase C (C1 obbligatori, C2 pubblicazione, C3 freemium con sblocco una tantum 6,99-9,99 €, C4 miglioramenti).
3. **Nome del bambino nelle voci (proposta, in attesa di ok):** libreria dei ~300 nomi più diffusi per lingua generati con la stessa voce + frasi spezzate [prefisso][nome][suffisso]; riserva: nome registrato dal genitore; opzione frasi senza nome.
4. Papà caricherà foto e voci registrate dal menu papà (restano in IndexedDB sul telefono).

## Decisioni / vincoli
- Vanilla JS/HTML/CSS, nessun build step. Giochi con `App.registerGame`, script elencati in `index.html`, `sw.js` (FILES) e `tools/build-catalog.mjs`.
- Ogni rilascio: bump `VERSION` in `js/app.js` **e** `lena-vN` in `sw.js`. Voci nella cache separata `VOICE_CACHE` (cambiarla solo se si cambia voce).
- Testi `{fr, it, de, en, es}` / `TX[lang]`; `App.excl()` per il punto esclamativo per lingua; `App.pair()` = lingue scelte; `App.nextLang()` a ogni turno. Ogni nuova frase va in `phrases(l)`, poi `node tools/build-catalog.mjs` + `python tools/gen_voice.py`. Hash voce IT senza prefisso, FR con prefisso "fr ".
- Pubblicare (commit + push) senza chiedere quando i test sono ok (autorizzato dall'utente).
- Samsung blocca l'installazione come app ("app non sicura"): usare il collegamento sulla Home.

## Aperto / da chiarire
- Verificato solo in Chrome headless, mai su telefono reale: voci (anche pronuncia FR di "le L"), glitter, registrazione voci, upload foto.
- Non verificati in automatico: blocco del treno e bonus strisce in Salta, modalità «Quale lingua?» e fine del Memory bilingue.

## Note di test
- Nel Chrome headless la Cache Storage dà «Unexpected internal error»: il service worker non si installa lì (limite dell'ambiente, non dell'app). La barra di aggiornamento si prova simulando i messaggi (`navigator.serviceWorker.dispatchEvent(new MessageEvent('message', {data:{type:'dl',done,total}}))`).
- `tools/drive.mjs`: `PORT=` per più Chrome in parallelo, passo `{"cdp": metodo, "params": {}}` per comandi DevTools.

## Come riprendere
Locale: `python -m http.server 8765` → http://localhost:8765. Test headless: `node tools/drive.mjs steps.json <cartella_output>` (CDP su Chrome; `?hoprow=N` per partire avanti in Salta). Codice: `js/app.js` (nucleo) + `js/games/*.js`.
