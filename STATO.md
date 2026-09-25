# STATO — Giochi di Lena
_Aggiornato: 25/09/2026 (sera)_

## Obiettivo
PWA senza pubblicità con giochi educativi per Lena (5 anni il 18/01/2027), da usare dal telefono (Android papà, iPhone Mahault).
Online: https://vincenzosilvestri.github.io/giochi-lena/ — repo pubblico `vincenzosilvestri/giochi-lena` (GitHub Pages, branch main).

## Fatto finora
- 6 giochi: Lena Salta (semaforo: stop col rosso ✋, ✅ e contatore 🚦 col verde, sticker ogni 8), Conta, Memory (animali/foto famiglia), Pesca le Lettere (+ comporre il nome), Forme e Colori (incastri + sequenze), Colora con Lena (12 disegni SVG a zone, arcobaleno, 4 glitter, sfide, galleria).
- Album 24 sticker + diploma, personaggio e colore a scelta, timer nanna con PIN, festa compleanno il 18 gennaio.
- Menu papà: tieni premuto ⚙️ 1,5 s → PIN. Voci registrate, foto con nome, timer, galleria disegni (⬇️ condividi), prova festa.
- Voce: 559 frasi pre-generate con it-IT-IsabellaNeural (edge-tts) in `voice/`; fallback TTS del telefono per le frasi fuori catalogo.
- Tutorial con manina 👆 alla prima apertura di Home e giochi, tasto ❓ per rivederlo.
- Glitter: scia a ogni tocco, titolo luccicante, sticker lucidi. Su PC l'app è centrata (max 440px).
- Aggiornamento automatico: SW network-first con `cache: 'no-cache'`, ricarica su controllerchange. Nota versione sulla schermata iniziale (ora **v8**).
- Bug fixato: in Salta il personaggio spariva tornando indietro.
- **v8 — bilingue FR/IT** (francese di Francia, voce fr-FR-DeniseNeural; alternanza un turno FR e uno IT, bandierina nel gioco; menu papà: Alternanza / Solo FR / Solo IT). 1285 frasi audio (~25 MB).
- **v8 — arricchimenti:** Armadio (stelle ⭐ guadagnate nei giochi → 14 accessori per testa/occhi/mano/aura), Salta con 4 mondi (prato, neve, spiaggia, città di notte), treno con passaggio a livello, strisce pedonali (bonus), Pagella nel menu papà (lettere/numeri, lingue, strada, tempo 7 giorni), Storia della buonanotte (3 storie) allo scadere del timer.

## Prossimi passi
1. Feedback dall'uso reale di v8 (bilingue, armadio, mondi/treno in Salta, pagella, storia).
2. **Proposte in coda (giochi nuovi):**
   - **Gioco delle due lingue** (richiesto dall'utente): praticare FR e IT insieme, es. Memory bilingue (pomme ↔ mela), "senti la parola in una lingua, trova l'immagine", "quale lingua hai sentito? 🇫🇷/🇮🇹".
   - Scrivi con il dito (tracciare le lettere, consigliato), Pianoforte magico (+ ripeti la melodia), Il mio cucciolo (nutrire, lavare, nanna), Puzzle 4-9 pezzi con disegni e foto, Labirinti col dito, Primo inglese.
4. Papà caricherà foto di famiglia e voci registrate dal menu papà (restano in IndexedDB sul telefono).

## Decisioni / vincoli
- Vanilla JS/HTML/CSS, nessun build step. Giochi registrati con `App.registerGame` in `js/games/*.js`.
- Ogni rilascio: bump `VERSION` in `js/app.js` (numero mostrato) **e** in `sw.js` (`lena-vN`). Le voci stanno nella cache separata `VOICE_CACHE`.
- Ogni testo è `{fr, it}` (o TX[lang] nei giochi); `App.nextLang()` a ogni nuovo turno. Ogni nuova frase va in `phrases(l)` del gioco, poi `node tools/build-catalog.mjs` + `python tools/gen_voice.py`. Hash voce IT senza prefisso, FR con prefisso "fr ".
- Test Salta da un punto avanzato: `?hoprow=N` nell'URL.
- Pubblicare (commit + push) senza chiedere quando i test sono ok (autorizzato dall'utente).
- Samsung blocca l'installazione come app ("app non sicura", probabile Blocco automatico): usare il collegamento sulla Home.

## Aperto / da chiarire
- Voce e glitter non ancora sentiti/visti da Claude su un telefono reale: verifica fatta solo in Chrome headless.
- Mai testate su telefono le registrazioni vocali (MediaRecorder) e l'upload foto.

## Come riprendere
Test in locale: `python -m http.server 8765` e apri http://localhost:8765. Test headless: script CDP `drive.mjs` (era nella scratchpad, da ricreare se serve). Codice: `js/app.js` (nucleo) + `js/games/`.
