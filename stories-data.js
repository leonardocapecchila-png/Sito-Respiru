/**
 * Respiru Stories — dati.
 *
 * Per aggiungere una nuova storia, aggiungi un nuovo oggetto a questo array.
 * Il componente (script.js) genera automaticamente card e pannello di dettaglio.
 *
 * Campi obbligatori: id, category, company, headline, metric, preview, body.
 * Campi opzionali (omessi se non presenti, mai mostrati vuoti in UI):
 *   metricLabel, metricBefore, metricAfter, image, quote, restaurant, date, source, verifiedData.
 *
 * `body` è un array di blocchi tipizzati, resi in ordine nel pannello:
 *   { type: "lead", text }        -> frase di apertura, forte gerarchia
 *   { type: "paragraph", text }   -> paragrafo normale
 *   { type: "highlight", text }   -> frase evidenziata (citazione/insight)
 *   { type: "list", items: [] }   -> elenco puntato
 *   { type: "closing", text }     -> frase di chiusura / collegamento a Respiru
 */

const RESPIRU_STORIES = [
  {
    id: "01",
    category: "Micro-inefficienze",
    company: "American Airlines",
    headline: "Per un'oliva.",
    metric: "$40.000",
    metricLabel: "risparmio annuo stimato, secondo l'aneddoto",
    preview: "Un dettaglio apparentemente insignificante. Un risparmio che racconta qualcosa di molto più grande.",
    verifiedData: false,
    body: [
      { type: "lead", text: "Un'oliva in meno. Migliaia di volte." },
      {
        type: "paragraph",
        text: "Secondo un aneddoto aziendale ampiamente riportato, negli anni '80 American Airlines eliminò una singola oliva dalle insalate servite ai passeggeri di prima classe.",
      },
      {
        type: "paragraph",
        text: "Il risparmio attribuito alla decisione viene comunemente indicato in circa 40.000 dollari all'anno.",
      },
      {
        type: "highlight",
        text: "Non perché un'oliva costasse molto. Perché una piccola differenza, moltiplicata migliaia di volte, smette di essere piccola.",
      },
      { type: "paragraph", text: "Ora pensa a un ristorante." },
      {
        type: "list",
        items: [
          "Una porzione leggermente abbondante.",
          "Una scadenza dimenticata.",
          "Un ingrediente acquistato troppo presto.",
          "Uno spreco non registrato.",
          "Una ricetta con un food cost non aggiornato.",
        ],
      },
      {
        type: "highlight",
        text: "Presi singolarmente sembrano dettagli. Ripetuti ogni servizio, ogni giorno, diventano margine.",
      },
      { type: "closing", text: "Respiru nasce anche per rendere visibili questi dettagli." },
    ],
    source: {
      label: "Aneddoto aziendale ampiamente citato in libri e articoli di management; le cifre esatte variano a seconda della fonte e non risultano da un bilancio pubblico certificato.",
    },
  },
  {
    id: "02",
    category: "Magazzino & scorte",
    company: "Toyota",
    headline: "Zero magazzino in eccesso.",
    metric: "-75%",
    metricLabel: "di scorte immobilizzate rispetto al modello tradizionale",
    preview: "Un ingegnere ha inventato il modo di produrre senza accumulare magazzino. È diventato lo standard mondiale.",
    verifiedData: false,
    body: [
      { type: "lead", text: "Produrre solo quello che serve, quando serve." },
      {
        type: "paragraph",
        text: "Nel dopoguerra Toyota, come tutti i produttori dell'epoca, teneva enormi magazzini di componenti: capitale immobilizzato, pezzi che invecchiavano prima di essere usati, difetti scoperti troppo tardi.",
      },
      {
        type: "paragraph",
        text: "L'ingegnere Taiichi Ohno sviluppò il Toyota Production System, basato sul principio Just-in-Time: produrre esattamente ciò che serve, nella quantità giusta, nel momento giusto, coordinato in tempo reale dai cartellini kanban.",
      },
      {
        type: "highlight",
        text: "Il risultato più citato: oltre il 75% in meno di scorte immobilizzate rispetto ai modelli tradizionali, e tempi di produzione ridotti da settimane a giorni.",
      },
      { type: "paragraph", text: "Ora pensa al magazzino di un ristorante." },
      {
        type: "list",
        items: [
          "Ingredienti ordinati a sensazione, non in base ai consumi reali.",
          "Scorte che si accumulano finché non scadono.",
          "Nessuno che sa, in tempo reale, cosa sta davvero finendo.",
        ],
      },
      {
        type: "highlight",
        text: "Il principio è lo stesso: sapere cosa serve, quando serve, invece di accumulare e sperare.",
      },
      {
        type: "closing",
        text: "È lo stesso principio dietro il magazzino automatico di Respiru: aggiornato mentre lavori, non ricostruito a fine settimana.",
      },
    ],
    source: {
      label: "Il Toyota Production System e il principio Just-in-Time sono ampiamente documentati nella letteratura di management (\"Lean Manufacturing\"); le cifre di riduzione delle scorte sono quelle più comunemente citate in analisi di settore.",
    },
  },
  {
    id: "03",
    category: "Sprechi alimentari",
    company: "LeanPath",
    headline: "Lo spreco che si vede, si riduce.",
    metric: "-51%",
    metricLabel: "di spreco alimentare in un anno, in una mensa Harvard",
    preview: "Pesare, fotografare, capire cosa si butta. Un'università ha dimezzato lo spreco in dodici mesi.",
    verifiedData: false,
    body: [
      { type: "lead", text: "Quello che non misuri, non lo controlli." },
      {
        type: "paragraph",
        text: "Le grandi cucine collettive — mense, hotel, ospedali — sprecano tipicamente tra il 4% e il 10% del cibo acquistato. Il problema è quasi sempre lo stesso: nessuno lo misura davvero, quindi nessuno lo vede.",
      },
      {
        type: "paragraph",
        text: "LeanPath ha sviluppato un sistema di pesatura e fotografia automatica degli scarti in cucina, collegato a un'analisi che mostra a chef e manager quali piatti e ingredienti si sprecano di più, e perché.",
      },
      {
        type: "highlight",
        text: "Harvard University, in un solo punto di ristorazione, ha ridotto lo spreco alimentare del 51% in un anno, con un risparmio dichiarato di circa 140.000 dollari.",
      },
      { type: "paragraph", text: "Ora pensa alla cucina di un ristorante." },
      {
        type: "list",
        items: [
          "Una porzione preparata in più, ogni giorno.",
          "Un ingrediente scaduto perché nessuno lo aveva più sotto controllo.",
          "Un piatto che, guardando i numeri, spreca più di quanto renda.",
        ],
      },
      {
        type: "highlight",
        text: "Il principio non cambia: rendere visibile lo spreco è già metà del lavoro per ridurlo.",
      },
      {
        type: "closing",
        text: "È lo stesso motivo per cui Respiru tiene sprechi e scorte nella stessa vista, non in un controllo separato.",
      },
    ],
    source: {
      label: "Cifre dichiarate pubblicamente da LeanPath e dai relativi case study, incluso quello con Harvard University; i risultati individuali possono variare.",
    },
  },
  {
    id: "04",
    category: "Sprechi alimentari",
    company: "Sweetgreen",
    headline: "Le posate che nessuno chiede.",
    metric: "1M+",
    metricLabel: "kit di posate monouso risparmiati al mese, secondo l'azienda",
    preview: "La maggior parte di chi ordina a casa ha già le posate. Bastava chiederlo prima di includerle.",
    verifiedData: false,
    body: [
      { type: "lead", text: "Un default sbagliato, ripetuto milioni di volte." },
      {
        type: "paragraph",
        text: "Per anni, gli ordini di delivery e take-away hanno incluso automaticamente un kit completo — posate, tovaglioli, bustine di salsa — anche quando il cliente ordinava a casa propria, dove queste cose di solito ci sono già.",
      },
      {
        type: "paragraph",
        text: "Catene come Sweetgreen e Chipotle hanno cambiato il default: il kit si aggiunge solo se il cliente lo richiede esplicitamente al checkout, invece di essere incluso in automatico.",
      },
      {
        type: "highlight",
        text: "Sweetgreen ha dichiarato di eliminare così oltre un milione di kit di posate monouso al mese.",
      },
      { type: "paragraph", text: "Ora pensa a un menu, a un ordine, a una ricetta." },
      {
        type: "list",
        items: [
          "Una guarnizione aggiunta per abitudine, non per ricetta.",
          "Una dose di condimento sempre più abbondante di quella segnata.",
          "Un default impostato una volta, mai più ricontrollato.",
        ],
      },
      {
        type: "highlight",
        text: "Il costo non è mai in una singola scelta. È nella scelta ripetuta, senza controllo, migliaia di volte.",
      },
      {
        type: "closing",
        text: "Respiru tiene ricette e costi allineati, così i default restano quelli giusti anche quando nessuno li ricontrolla a mano.",
      },
    ],
    source: {
      label: "Cifra dichiarata pubblicamente da Sweetgreen in comunicazioni aziendali sulla policy \"opt-in\" per le posate monouso.",
    },
  },
];
