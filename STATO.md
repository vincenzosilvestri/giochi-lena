# STATO — Giochi di Lena
_Aggiornato: 26/09/2026_

## Obiettivo
PWA senza pubblicità con giochi educativi **multilingua** (1 o 2 lingue a scelta tra FR/IT/DE/EN/ES) per Lena (FR+IT, 5 anni il 18/01/2027, prima lingua francese), da telefono (Android papà, iPhone Mahault). Obiettivo successivo: pubblicarla sugli store.
Online: https://vincenzosilvestri.github.io/giochi-lena/ — repo pubblico `vincenzosilvestri/giochi-lena` (GitHub Pages, main). Versione online: **v20**.

## Fatto finora
- 11 giochi (`js/games/`): **Il mio cucciolo** (v20), Lena Salta (semafori, strisce, treno, 4 mondi), Conta (+/−), Memory (animali/foto), Pesca le Lettere (+ comporre il nome), Forme e Colori (incastri + sequenze), Colora (12 disegni, glitter, galleria), Suoni e sillabe, Scrivi con il dito, Sopra o sotto?, Le due lingue (solo con 2 lingue).
- Multilingua (v12): 5 lingue, 1 o 2 scelte dal genitore, alternanza / una sola / una per partita. Menu papà solo in italiano.
- Voci: 5058 frasi pre-generate con edge-tts (IT Isabella, FR Denise, DE Katja, EN Sonia, ES Elvira) in `voice/`; l'app scarica solo le lingue scelte (cache `lena-voice-1`); fallback TTS del telefono (nomi delle foto).
- Grafica: 226 immagini Microsoft Fluent Emoji 3D (MIT) in `emoji/` + bandiere SVG, sostituzione automatica nel DOM e nel canvas.
- Premi: stelle → Armadio (14 accessori), album 24 sticker + diploma, glitter ovunque.
- Livelli e statistiche (v11): badge 🏅, storico per abilità, tabella «Livelli e progressi» nel menu papà; difficoltà adattiva (v16).
- Menu papà (⚙️ 1,5 s + PIN, PIN creato dopo una moltiplicazione): nanna + storia, pausa 20/30 min, effetti calmi, musica, lingue, pagella, voci registrate, foto, disegni, compleanno 18/01.
- Musica generata, transizioni, tutorial con mascotte (v15-v17). Barra di aggiornamento sulla schermata iniziale (v18).
- **v18 e v19 — due giri di revisione completa** (revisori in parallelo + test "mano scimmia" su tutti i giochi, 3 configurazioni di lingua, 360×640): ~70 + ~35 correzioni. v19: griglia "Dov'è" a 6 immagini, pesci sovrapposti/scatto, Colora durante il salvataggio, manina di Forme sulla risposta giusta, Salta (strisce in tutte le corsie, HUD stretto), PIN (✕, cambio sicuro), barra voci solo se mancano file, musica sotto la voce, microfono, lingua fissa nei tutorial.
- **v20 — Il mio cucciolo** (`js/games/cucciolo.js`): 8 animali (emoji Fluent) con movimento e verso propri; bisogni nella nuvoletta (pappa, bagnetto, bua, palla, nanna) → pulsante giusto (abilità «Cura ed emozioni»); pappa = contare 2-5 o riconoscere il colore; bagnetto strofinando; cerotto + bacino; palla del colore giusto; nanna con lampada e risveglio; regali con le stelle (testa, collo, cameretta); livelli 1-3 ogni 2 giornate. Home a 11 giochi con Armadio come barra larga.
- **Piano store + monetizzazione** scritto in `ROADMAP.md` Fase C (C1 obbligatori, C2 pubblicazione, C3 monetizzazione, C4 miglioramenti).

## Prossimi passi
1. **Decisione utente — nome del bambino nelle voci** (81 frasi dicono "Lena"): (a) libreria ~300 nomi per lingua + frasi spezzate [prefisso][nome][suffisso], (b) nome registrato dal genitore, (c) frasi senza nome. È il primo blocco per lo store.
2. Store C1: profili bambino, voci Azure con licenza, privacy + "cancella tutti i dati", menu genitori in 5 lingue, nome/icona/screenshot, accessibilità, test su telefoni veri.
3. Store C2: Android TWA con Bubblewrap (25 $) → poi iOS con Capacitor (99 $/anno).
4. Monetizzazione proposta: 3 giochi gratis (Salta, Conta, Colora) + sblocco unico 6,99-9,99 €, dietro il cancello genitori; Play Billing / StoreKit; Stripe per il web. Da confermare con l'utente.
5. Intanto: feedback e statistiche dall'uso reale di Lena.
6. **Cucciolo più realistico** (proposta): 3D con three.js + modelli animati CC0 (Quaternius copre volpe, cani, cavallo; gatto/coniglio/panda/pulcino/tigre da trovare o comprare) e versi veri (Freesound CC0: cane, gatto; altri da verificare). Nuove scene proposte: passeggiata, spazzolata.

## Decisioni / vincoli
- Vanilla JS/HTML/CSS, nessun build step. Giochi con `App.registerGame`, elencati in `index.html`, `sw.js` (FILES) e `tools/build-catalog.mjs`.
- Ogni rilascio: bump `VERSION` in `js/app.js` **e** `lena-vN` in `sw.js`. `VOICE_CACHE`/`EMOJI_CACHE` separate (cambiarle solo se cambiano voci/immagini).
- Testi `{fr, it, de, en, es}`; ogni frase parlata deve stare in `phrases(l)`, poi `node tools/build-catalog.mjs` + `python tools/gen_voice.py`. Nuove emoji: `node tools/scan-emoji.mjs` + `python tools/fetch_emoji.py`.
- Pubblicare (commit + push) senza chiedere quando i test sono ok (autorizzato dall'utente).
- Niente abbonamenti né pubblicità; acquisti solo dietro cancello genitori.
- Samsung blocca l'installazione come app ("app non sicura"): usare il collegamento sulla Home.

## Aperto / da chiarire
- Mai verificato su telefono reale: pronuncia voci, glitter, registrazione voci, upload foto (l'utente ha confermato solo la barra di aggiornamento).
- Non verificati in automatico: blocco del treno in Salta, «Quale lingua?», fine del Memory bilingue.
- Frasi con i nomi delle foto di famiglia in Pesca le Lettere usano il TTS del telefono (accettato).

## Come riprendere
Locale: `python -m http.server 8765` → http://localhost:8765. Test headless: `node tools/drive.mjs steps.json <cartella_output>` (usare `PORT=` diverso per ogni Chrome in parallelo, altrimenti si collegano allo stesso; `W`/`H` per la dimensione). Nel Chrome headless il service worker non si installa (Cache Storage in errore): la barra di aggiornamento si prova simulando i messaggi `{type:'dl',done,total}`. Codice: `js/app.js` (nucleo) + `js/games/*.js`; piano in `ROADMAP.md`.
