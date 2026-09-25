# STATO — Giochi di Lena
_Aggiornato: 25/09/2026_

## Obiettivo
PWA senza pubblicità con giochi educativi **bilingui FR/IT** per Lena (5 anni il 18/01/2027, prima lingua francese), da telefono (Android papà, iPhone Mahault).
Online: https://vincenzosilvestri.github.io/giochi-lena/ — repo pubblico `vincenzosilvestri/giochi-lena` (GitHub Pages, main). Versione online: **v9**.

## Fatto finora
- 7 giochi (`js/games/`): Lena Salta (semaforo, strisce, treno con passaggio a livello, 4 mondi prato/neve/spiaggia/città di notte), Conta, Memory (animali/foto), Pesca le Lettere (+ comporre il nome), Forme e Colori, Colora (12 disegni, arcobaleno, 4 glitter, galleria), Le due lingue (Dov'è…, Memory FR↔IT, Quale lingua?).
- Bilingue: alternanza un turno FR e uno IT con bandierina; menu papà: Alternanza / Solo FR / Solo IT. Menu papà in italiano.
- Voci: 1497 frasi pre-generate con edge-tts (IT Isabella, FR Denise, ~28 MB) in `voice/`; fallback TTS del telefono per nomi delle foto.
- Premi: stelle ⭐ → Armadio (14 accessori sul personaggio), album 24 sticker + diploma.
- Menu papà (⚙️ premuto 1,5 s + PIN): timer nanna con storia della buonanotte (3 storie), lingua, Pagella (lettere/numeri, lingue, strada, tempo 7 giorni), voci registrate, foto, disegni, festa compleanno 18/01.
- Tutorial con manina 👆 + tasto ❓; glitter ovunque; app centrata su PC; aggiornamento automatico (SW `no-cache` + reload) e numero versione in basso.

## Prossimi passi
_Roadmap completa (ricerca concorrenti, pedagogia, store) in `ROADMAP.md`._
1. Raccogliere feedback dall'uso reale di v8-v9 e sistemare.
2. Proposte in coda: Scrivi con il dito (tracciare lettere, consigliato), Pianoforte magico (+ ripeti la melodia), Il mio cucciolo, Puzzle 4-9 pezzi con disegni/foto, Labirinti col dito, Primo inglese.
3. Papà caricherà foto e voci registrate dal menu papà (restano in IndexedDB sul telefono).

## Decisioni / vincoli
- Vanilla JS/HTML/CSS, nessun build step. Giochi con `App.registerGame`, script elencati in `index.html`, `sw.js` (FILES) e `tools/build-catalog.mjs`.
- Ogni rilascio: bump `VERSION` in `js/app.js` **e** `lena-vN` in `sw.js`. Voci nella cache separata `VOICE_CACHE` (cambiarla solo se si cambia voce).
- Testi `{fr, it}` / `TX[lang]`; `App.nextLang()` a ogni turno. Ogni nuova frase va in `phrases(l)`, poi `node tools/build-catalog.mjs` + `python tools/gen_voice.py`. Hash voce IT senza prefisso, FR con prefisso "fr ".
- Pubblicare (commit + push) senza chiedere quando i test sono ok (autorizzato dall'utente).
- Samsung blocca l'installazione come app ("app non sicura"): usare il collegamento sulla Home.

## Aperto / da chiarire
- Verificato solo in Chrome headless, mai su telefono reale: voci (anche pronuncia FR di "le L"), glitter, registrazione voci, upload foto.
- Non verificati in automatico: blocco del treno e bonus strisce in Salta, modalità «Quale lingua?» e fine del Memory bilingue.

## Come riprendere
Locale: `python -m http.server 8765` → http://localhost:8765. Test headless: `node tools/drive.mjs steps.json <cartella_output>` (CDP su Chrome; `?hoprow=N` per partire avanti in Salta). Codice: `js/app.js` (nucleo) + `js/games/*.js`.
