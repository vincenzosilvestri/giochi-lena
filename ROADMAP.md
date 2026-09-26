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
9. ✅ (v16) **Difficoltà adattiva** — usare la pagella: lettere e numeri sbagliati ricompaiono più spesso, quelli saputi meno.

## Fase B — App "bellissima" (aspetto premium)
Cosa rende premium le app migliori (Khan Academy Kids, Pok Pok, Sago Mini):
- illustrazioni coerenti;
- micro-animazioni;
- suoni curati;
- voce calda;
- atmosfera **calma, non da slot machine**.

1. ✅ (v14, Fluent Emoji 3D) **Un solo set di illustrazioni incluso nell'app** — sostituire le emoji di sistema con Twemoji (CC-BY) o Noto Emoji (OFL): stesso aspetto su Android e iPhone, licenza chiara. Primo passo facile e ad alto impatto.
2. ✅ (v15, il personaggio del bambino parla nei tutorial) **Mascotte bilingue** — un personaggio guida (es. una volpe o un gufo) che sostituisce la manina nei tutorial, con animazioni quando è ferma (respira, sbatte le palpebre).
3. ✅ (v17, musica generata) **Suoni e musica** — effetti più morbidi (campionati, non bip sintetici), musica di sottofondo leggera disattivabile.
4. ✅ (v17) **Transizioni e animazioni** fra le schermate, per esempio il personaggio che saltella in Home.
5. ✅ (v15) **Interruttore "effetti calmi"** nel menu genitori — meno glitter e coriandoli per i momenti tranquilli (le famiglie apprezzano la calma).
6. **Mappa del mondo** 🗺️ (sforzo alto) — una mappa con isole al posto della griglia di giochi: dà un filo narrativo come Toca o Khan Kids.
7. **Gioco libero** — una scena esplorabile senza obiettivi (la casa del personaggio con l'armadio), da affiancare ai quiz.

## Fase C — Verso gli store (piano v19, 26/09/2026)
0. ~~Lingue a scelta (1 o 2 tra FR/IT/DE/EN/ES)~~ ✅ fatto in v12.

**C1. Obbligatori prima di pubblicare** (senza questi lo store rifiuta o è rischioso)
1. **Nome del bambino** — decisione dell'utente in sospeso: libreria di ~300 nomi per lingua + frasi spezzate, oppure nome registrato dal genitore, oppure frasi senza nome. Oggi 81 frasi dicono "Lena".
2. **Profili bambino** — nome, età, lingue, personaggio; più profili per famiglia (statistiche separate).
3. **Voci con licenza commerciale** — rigenerare le stesse voci con Azure Neural TTS ufficiale (edge-tts non è licenziato per uso commerciale). Circa 5.000 frasi: rientra nel piano gratuito.
4. **Privacy e sicurezza** — informativa pubblica (nessun dato esce dal telefono), pulsante "cancella tutti i dati", cancello genitori su ogni link esterno, nessun tracciamento/analytics. Moduli *Data safety* (Google) e *Privacy nutrition label* (Apple).
5. **Menu genitori in FR/IT/EN/DE/ES** (oggi solo italiano) e testi store nelle 5 lingue.
6. **Nome, icona, brand, screenshot** — nome da store neutro (l'app "di Lena" resta la nostra), 6-8 screenshot per telefono e tablet, video breve.
7. **Accessibilità** — aria-label su tutti i pulsanti, contrasto, test con lettore schermo (richiesto per *Teacher Approved*).
8. **Test su telefoni veri** — Android economico, iPhone, tablet: voci, glitter, microfono, foto, prestazioni di Salta.

**C2. Pubblicazione**
1. **Android** — Trusted Web Activity con Bubblewrap (25 $ una tantum), programma *Families* (età ≤5), poi richiesta *Teacher Approved*.
2. **iOS** — Capacitor con funzioni native (archivio nativo, notifica "è ora di nanna"), 99 $/anno; Apple rifiuta i siti impacchettati (linea guida 4.2). Dopo Android.
3. **Web** — la PWA resta disponibile (dimostrazione e canale di vendita diretto).

**C3. Monetizzazione (consigliata)**
- **Freemium con sblocco una tantum**: 3 giochi gratis (Salta, Conta, Colora) + tutto il resto con un solo acquisto a **6,99-9,99 €** (eventuale "famiglia a vita" ~11,99 €). Niente abbonamento come default (le famiglie lo odiano per le app per bambini), niente pubblicità, niente valute virtuali.
- Acquisto sempre **dietro il cancello genitori** (moltiplicazione) — obbligatorio nelle categorie bambini.
- Pagamenti: Google Play Billing obbligatorio nella versione Play (anche TWA); StoreKit su iOS. Commissione 15% (Google fino a 1 M$, Apple Small Business Program). Web: Stripe con codice di sblocco, commissione ~1,5-3%.
- IVA: gestita dagli store come rivenditori; per il canale web va gestita a parte (Stripe Tax / OSS).
- Conversione tipica gratis→pagante 2-5%: servono volumi, quindi puntare su nicchia **bilingue**.
- Canali: comunità di famiglie espatriate/bilingui (CH, DE, ES, BE, Canada), scuole materne bilingui (licenza classe B2B), ASO: "app bilingue enfants", "bilingual kids app", "zweisprachige Kinder-App", "app bilingue bambini".
- Extra futuri (solo acquisti una tantum): pacchetti lingua aggiuntivi (PT, NL), pacchetti stagionali di disegni/sticker.
- Da verificare prima di pubblicare: nuove tariffe Apple UE 2026, regole Families di Google aggiornate.

**C4. Miglioramenti prima del lancio (valore percepito)**
- Mappa del mondo o scena di gioco libero (B6-B7) al posto della griglia.
- 2-3 giochi in più dalla coda (Pianoforte magico, Puzzle, Labirinti).
- Pagella esportabile (PDF) per il genitore.
- Salta: "tic-tic" durante il lampeggio, premio pazienza; Colora: zone più grandi sui disegni fitti.

## Proposte in coda (non ancora prioritarie)
Pianoforte magico (+ ripeti la melodia), Puzzle 4-9 pezzi con disegni e foto, Labirinti col dito, Primo inglese, pacchetti stagionali di sticker (Natale, Halloween).
- ~~Il mio cucciolo~~ ✅ v20. Prossime scene: **passeggiata** (destra/sinistra agli incroci, parole della natura, semaforo, sacchetto per i bisognini), **lavare i denti** prima della nanna (routine), spazzolata come variante del bagnetto; poi prototipo 3D (three.js + modelli CC0) col solo cane.
- **Impara a cucinare** 👩‍🍳 (proposta utente, 26/09/2026) — ricette semplici illustrate (pizza, macedonia, torta, panino): leggere la ricetta a figure, contare gli ingredienti ("3 pomodori"), versare mezzo/tutto, sequenze (prima-poi-alla fine), mescolare col dito, forno con timer da guardare; vocabolario del cibo nelle due lingue; sicurezza in cucina (il forno scotta, chiedi a un grande). Si collega al cucciolo (cucinare la sua pappa).

## Ordine consigliato
1. Fase A1-A2 (Suoni e sillabe, Scrivi con il dito) — sono le lacune educative più grandi.
2. Fase B1 (set di illustrazioni incluso) — l'app cambia volto con poco sforzo.
3. Fase A3-A8 a piccoli passi, insieme alla mascotte (B2).
4. Fase C quando l'app convince voi e Lena: profili, voci Azure, poi Android.

_Nota: parte delle fonti è stata sintetizzata da strumenti automatici. Prima di pubblicare, verificare direttamente le pagine ufficiali di Apple e Google e i programmi ministeriali._
_Fonti principali: Apple Kids apps, Google Play Families Policy, Bubblewrap, edge-tts discussion #261, Hirsh-Pasek 2015 / NAEYC, 3-6-9-12.org, SIP 2025-26, AAP, Éduscol, Indicazioni Nazionali 2012, recensioni Screenwise/Common Sense su Khan Kids, Lingokids, Sago, Pok Pok._
