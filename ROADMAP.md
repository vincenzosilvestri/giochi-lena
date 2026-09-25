# Roadmap — Giochi di Lena
_Ricerca del 25/09/2026: concorrenti, pedagogia 5-6 anni, requisiti store. Stato di partenza: v10._

## Dove siamo
**Punti di forza** (rari anche nelle app famose):
- nessuna pubblicità e nessun acquisto;
- funziona offline;
- tutorial con la manina;
- voci neurali;
- pagella per genitori;
- timer con storia della buonanotte;
- nessun game over.

**La nicchia:** non esiste un'app di giochi per 3-6 anni che unisca **francese e italiano**.
- Gus on the Go ha app separate per lingua, poco contenuto e interfaccia in inglese.
- Didou non ha l'italiano.
- Lalilo, Okoo e Rai Yoyo sono in una lingua sola.
- Pubblico possibile: famiglie miste, Svizzera, Valle d'Aosta, italiani in Francia e francesi in Italia.

**Limiti attuali:**
- grafica fatta con le emoji di sistema, diversa da telefono a telefono;
- "Lena" scritta nel codice e in 81 frasi audio;
- menu genitori solo in italiano;
- voci edge-tts senza licenza commerciale;
- mancano coscienza fonologica, pre-scrittura e piccole addizioni.

## Fase A — Per Lena, subito (valore educativo alto, sforzo medio-basso)
1. ✅ (v13) **Suoni e sillabe** 🥁 (gioco nuovo) — battere le mani per ogni sillaba, trovare le rime, riconoscere il suono iniziale. Una lingua per partita. È il buco più grosso rispetto ai programmi di *grande section* (FR) e dell'ultimo anno dell'infanzia (IT).
2. ✅ (v13) **Scrivi con il dito** ✏️ (già proposto) — tracciare lettere, cifre e il proprio nome, con correzione gentile e scia di glitter.
3. ✅ (v15) **Conta +/−** — nel gioco dei numeri: aggiungere e togliere oggetti entro 10 ("3 mele, ne arrivano 2: quante sono?").
4. ✅ (v15) **Sopra, sotto, dentro, fuori** 🧸 — mini-gioco di orientamento nello spazio ("metti l'orsetto sotto il tavolo"), in FR e IT.
5. ✅ (v15, «una lingua per partita») **Lingua coerente** — opzione "una lingua per partita" (più prevedibile) accanto all'alternanza a ogni turno; opzione "storia della buonanotte sempre in italiano" per dare più spazio alla lingua meno parlata.
6. ✅ (v15) **Timer in stile 3-6-9-12** — preset "2 sessioni da 30 minuti", promemoria gentile di pausa.
7. **Momenti da fare insieme** 👨‍👧 — ogni tanto la voce propone "Chiedi a papà come si dice… in italiano!" o piccole attività reali (pilastro "socialmente interattivo" di Hirsh-Pasek).
8. ~~Livelli visibili e statistiche per abilità~~ ✅ fatto in v11.
9. **Difficoltà adattiva** — usare la pagella: lettere e numeri sbagliati ricompaiono più spesso, quelli saputi meno.

## Fase B — App "bellissima" (aspetto premium)
Cosa rende premium le app migliori (Khan Academy Kids, Pok Pok, Sago Mini):
- illustrazioni coerenti;
- micro-animazioni;
- suoni curati;
- voce calda;
- atmosfera **calma, non da slot machine**.

1. ✅ (v14, Fluent Emoji 3D) **Un solo set di illustrazioni incluso nell'app** — sostituire le emoji di sistema con Twemoji (CC-BY) o Noto Emoji (OFL): stesso aspetto su Android e iPhone, licenza chiara. Primo passo facile e ad alto impatto.
2. ✅ (v15, il personaggio del bambino parla nei tutorial) **Mascotte bilingue** — un personaggio guida (es. una volpe o un gufo) che sostituisce la manina nei tutorial, con animazioni quando è ferma (respira, sbatte le palpebre).
3. **Suoni e musica** — effetti più morbidi (campionati, non bip sintetici), musica di sottofondo leggera disattivabile.
4. **Transizioni e animazioni** fra le schermate, per esempio il personaggio che saltella in Home.
5. ✅ (v15) **Interruttore "effetti calmi"** nel menu genitori — meno glitter e coriandoli per i momenti tranquilli (le famiglie apprezzano la calma).
6. **Mappa del mondo** 🗺️ (sforzo alto) — una mappa con isole al posto della griglia di giochi: dà un filo narrativo come Toca o Khan Kids.
7. **Gioco libero** — una scena esplorabile senza obiettivi (la casa del personaggio con l'armadio), da affiancare ai quiz.

## Fase C — Verso gli store
0. ~~Lingue a scelta (1 o 2 tra FR/IT/DE/EN/ES)~~ ✅ fatto in v12.
1. **Profili bambino** — nome, data di nascita, lingue (poi anche altre coppie, per esempio FR/EN o IT/EN: l'architettura con `LANGS` lo permette). Più profili per famiglia.
2. **Frasi audio senza nome** — riscrivere le 81 frasi con "Lena" in forma neutra; il nome solo scritto, o registrato dal genitore.
3. **Voci con licenza** — generare le stesse voci (Isabella, Denise) tramite **Azure Neural TTS** ufficiale: circa 100.000 caratteri, rientra nel piano gratuito da 500.000 al mese. Serve una API key Azure.
4. **Menu genitori in FR/IT/EN**, informativa privacy pubblica (i dati restano sul telefono; microfono e foto usati solo in locale), cancello genitori su ogni link esterno.
5. **Android** — Trusted Web Activity con Bubblewrap/PWABuilder (circa 25 $ una tantum), categoria *Families* per età ≤5, modulo *Data safety*, poi richiesta *Teacher Approved*.
6. **iOS** — Apple rifiuta i siti impacchettati (linea guida 4.2): serve Capacitor con funzioni native vere (notifiche, archivio nativo). Circa 99 $ l'anno. Da fare dopo Android.
7. **Modello economico** — le famiglie odiano gli abbonamenti per bambini: meglio **gratis** oppure **pagamento unico** (tipo Endless Alphabet, 8,99 $), acquisti sempre dietro il cancello genitori. Da comunicare nello store: "senza pubblicità, senza dark pattern, offline".
8. **Nome e brand** — scegliere un nome da store (l'app resta "di Lena" per noi), icona e screenshot curati.

## Proposte in coda (non ancora prioritarie)
Pianoforte magico (+ ripeti la melodia), Il mio cucciolo (accudire), Puzzle 4-9 pezzi con disegni e foto, Labirinti col dito, Primo inglese, pacchetti stagionali di sticker (Natale, Halloween).

## Ordine consigliato
1. Fase A1-A2 (Suoni e sillabe, Scrivi con il dito) — sono le lacune educative più grandi.
2. Fase B1 (set di illustrazioni incluso) — l'app cambia volto con poco sforzo.
3. Fase A3-A8 a piccoli passi, insieme alla mascotte (B2).
4. Fase C quando l'app convince voi e Lena: profili, voci Azure, poi Android.

_Nota: parte delle fonti è stata sintetizzata da strumenti automatici. Prima di pubblicare, verificare direttamente le pagine ufficiali di Apple e Google e i programmi ministeriali._
_Fonti principali: Apple Kids apps, Google Play Families Policy, Bubblewrap, edge-tts discussion #261, Hirsh-Pasek 2015 / NAEYC, 3-6-9-12.org, SIP 2025-26, AAP, Éduscol, Indicazioni Nazionali 2012, recensioni Screenwise/Common Sense su Khan Kids, Lingokids, Sago, Pok Pok._
