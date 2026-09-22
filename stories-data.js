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
];
