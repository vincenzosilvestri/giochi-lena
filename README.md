# Giochi di Lena

Multilingua: il genitore sceglie 1 o 2 lingue tra 🇫🇷 francese, 🇮🇹 italiano, 🇩🇪 tedesco, 🇬🇧 inglese, 🇪🇸 spagnolo (primo avvio o menu papà). Con 2 lingue i giochi alternano un turno per lingua. Il telefono scarica solo le voci delle lingue scelte.

App web installabile (PWA), senza pubblicità, che funziona offline. Contiene 5 giochi educativi per bambini di 5 anni.

| Gioco | Cosa insegna |
|---|---|
| Lena Salta | Educazione stradale: si attraversa quando il semaforo è verde |
| Conta con Lena | Numeri da 1 a 10, contare e fermarsi |
| Memory degli Animali | Memoria, nomi e versi degli animali, foto di famiglia |
| Pesca le Lettere | Lettere, iniziali delle parole, comporre il proprio nome |
| Forme e Colori | Forme, colori, sequenze logiche |

Ci sono anche: album di 24 sticker con diploma finale, voce in italiano, timer della nanna e festa di compleanno il 18 gennaio.

## Area genitori
Tieni premuto l'ingranaggio ⚙️ in alto a destra per 1,5 secondi. Al primo accesso crei un PIN. Da lì puoi:
- impostare il timer;
- registrare le vostre voci;
- aggiungere foto con nome;
- cambiare personaggio;
- provare la festa di compleanno.

Voci e foto restano solo sul telefono dove le carichi. Non finiscono su GitHub.

## Installare sul telefono
- **Android (Chrome):** apri il link, menu ⋮, poi "Aggiungi a schermata Home" / "Installa app".
- **iPhone (Safari):** apri il link, tasto Condividi, poi "Aggiungi alla schermata Home".

## Aggiornare
Dopo ogni modifica cambia `VERSION` in `sw.js` (es. `lena-v2`). Poi fai commit e push.

## Provare in locale
`python -m http.server 8765`, poi apri http://localhost:8765

## Voce
Le frasi fisse sono file audio in `voice/`, generati con voci neurali (it-IT-IsabellaNeural, fr-FR-DeniseNeural, de-DE-KatjaNeural, en-GB-SoniaNeural, es-ES-ElviraNeural); `voice/index-<lingua>.json` elenca le voci di ogni lingua. Le frasi che non sono nel catalogo, come i nomi delle foto, usano la voce del telefono.

Se aggiungi o cambi una frase nel codice (ricordati di inserirla anche in `phrases()` del gioco):
```
node tools/build-catalog.mjs
python tools/gen_voice.py        # richiede: pip install edge-tts
```
Se cambi voce, rigenera tutto con `--force` e aggiorna `VOICE_CACHE` in `sw.js`.

## Tutorial
La prima volta che si apre la Home e ogni gioco parte un tutorial con la manina animata. Il tasto ❓ lo fa rivedere.

## Illustrazioni
Le emoji sono immagini incluse in `emoji/`: **Microsoft Fluent Emoji 3D** (licenza MIT, https://github.com/microsoft/fluentui-emoji); bandiere disegnate a mano in SVG. L'app sostituisce da sola ogni emoji scritta nel codice con la sua immagine.
Se aggiungi emoji nuove nel codice:
```
node tools/scan-emoji.mjs
python tools/fetch_emoji.py
```
