# STATO — Giochi di Lena
_Aggiornato: 25/09/2026_

## Obiettivo
PWA senza pubblicità con giochi educativi **multilingua** (1 o 2 lingue a scelta tra FR/IT/DE/EN/ES) per Lena (FR+IT, 5 anni il 18/01/2027, prima lingua francese), da telefono (Android papà, iPhone Mahault).
Online: https://vincenzosilvestri.github.io/giochi-lena/ — repo pubblico `vincenzosilvestri/giochi-lena` (GitHub Pages, main). Versione online: **v13**.

## Fatto finora
- 9 giochi (`js/games/`): **Suoni e sillabe** (v13: batti le sillabe + rime, 5 lingue), **Scrivi con il dito** (v13: tracciato di lettere A-Z e cifre 0-9 nel verso giusto, livelli nome→vocali→tutto), Lena Salta (semaforo, strisce, treno con passaggio a livello, 4 mondi prato/neve/spiaggia/città di notte), Conta, Memory (animali/foto), Pesca le Lettere (+ comporre il nome), Forme e Colori, Colora (12 disegni, arcobaleno, 4 glitter, galleria), Le due lingue (Dov'è…, Memory FR↔IT, Quale lingua?).
- **v12 — Multilingua:** 5 lingue (fr, it, de, en-GB, es-ES); il genitore sceglie 1 o 2 lingue al primo avvio o nel menu papà («Lingue del bambino»); con 2 lingue alternanza o una sola; con 1 lingua «Le due lingue» è nascosto (`needs2`). Default FR+IT (Lena). Menu papà in italiano.
- Voci: 4304 frasi pre-generate con edge-tts (IT Isabella, FR Denise, DE Katja, EN Sonia, ES Elvira; 69 MB sul server) in `voice/`; `voice/index-<lingua>.json` per lingua: l'app scarica in sottofondo solo le voci delle lingue scelte (cache `lena-voice-1`). Fallback TTS del telefono per nomi delle foto.
- Premi: stelle ⭐ → Armadio (14 accessori sul personaggio), album 24 sticker + diploma.
- Menu papà (⚙️ premuto 1,5 s + PIN): timer nanna con storia della buonanotte (3 storie), lingua, Pagella (lettere/numeri, lingue, strada, tempo 7 giorni), voci registrate, foto, disegni, festa compleanno 18/01.
- **v11 — Livelli e statistiche:** badge 🏅 nei giochi con livelli (Conta 1-4, Lettere 1-3, Memory 1-4, Forme 1-4, Due lingue 1-3; Strada da record distanza), festa + voce al passaggio di livello. Storico giornaliero per abilità (`state.hist`, 200 giorni) e registro livelli (`state.levelLog`). Menu papà: tabella «Livelli e progressi» (livello, % giuste 7 giorni, tendenza vs settimana prima, 8 settimane, ultimi livelli). API: `App.track(skill, key, ok)`, `App.levelUp(game, n)`.
- Tutorial con manina 👆 + tasto ❓; glitter ovunque; app centrata su PC; aggiornamento automatico (SW `no-cache` + reload) e numero versione in basso.

## Prossimi passi
_Roadmap completa (ricerca concorrenti, pedagogia, store) in `ROADMAP.md`._
1. Raccogliere feedback e statistiche dall'uso reale (tabella «Livelli e progressi»).
2. Prossimo (ROADMAP): set di illustrazioni incluso (Twemoji/Noto) → mascotte, Conta +/−, sopra/sotto, lingua per partita, timer 2×30 → preparazione store (profili, voci Azure, Android TWA).
3. Papà caricherà foto e voci registrate dal menu papà (restano in IndexedDB sul telefono).

## Decisioni / vincoli
- Vanilla JS/HTML/CSS, nessun build step. Giochi con `App.registerGame`, script elencati in `index.html`, `sw.js` (FILES) e `tools/build-catalog.mjs`.
- Ogni rilascio: bump `VERSION` in `js/app.js` **e** `lena-vN` in `sw.js`. Voci nella cache separata `VOICE_CACHE` (cambiarla solo se si cambia voce).
- Testi `{fr, it, de, en, es}` / `TX[lang]`; `App.excl()` per il punto esclamativo per lingua; `App.pair()` = lingue scelte; `App.nextLang()` a ogni turno. Ogni nuova frase va in `phrases(l)`, poi `node tools/build-catalog.mjs` + `python tools/gen_voice.py`. Hash voce IT senza prefisso, FR con prefisso "fr ".
- Pubblicare (commit + push) senza chiedere quando i test sono ok (autorizzato dall'utente).
- Samsung blocca l'installazione come app ("app non sicura"): usare il collegamento sulla Home.

## Aperto / da chiarire
- Verificato solo in Chrome headless, mai su telefono reale: voci (anche pronuncia FR di "le L"), glitter, registrazione voci, upload foto.
- Non verificati in automatico: blocco del treno e bonus strisce in Salta, modalità «Quale lingua?» e fine del Memory bilingue.

## Come riprendere
Locale: `python -m http.server 8765` → http://localhost:8765. Test headless: `node tools/drive.mjs steps.json <cartella_output>` (CDP su Chrome; `?hoprow=N` per partire avanti in Salta). Codice: `js/app.js` (nucleo) + `js/games/*.js`.
