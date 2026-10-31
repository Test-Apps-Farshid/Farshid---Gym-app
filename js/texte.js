/* =====================================================================
   TEXTE UND KONSTANTEN – alles, was in der Oberfläche angezeigt wird
   und keine Logik ist. Hier kannst Du Bezeichnungen frei ändern.
   ===================================================================== */
window.T = {};

/* Muskelgruppen (Schlüssel → Anzeigename, Bereich für Splits) */
T.MUSKELN = {
  quad:    { name: "Beinstrecker",        bereich: "unten", seite: "vorn" },
  ham:     { name: "Beinbeuger",          bereich: "unten", seite: "hinten" },
  po:      { name: "Po",                  bereich: "unten", seite: "hinten" },
  wade:    { name: "Waden",               bereich: "unten", seite: "hinten", klein: true },
  add:     { name: "Adduktoren",          bereich: "unten", seite: "vorn", klein: true },
  bauch:   { name: "Bauch",               bereich: "core",  seite: "vorn" },
  seite:   { name: "Seitlicher Bauch",    bereich: "core",  seite: "vorn" },
  brust:   { name: "Brust",               bereich: "push",  seite: "vorn" },
  sv:      { name: "Vordere Schulter",    bereich: "push",  seite: "vorn" },
  smi:     { name: "Mittlere Schulter",   bereich: "push",  seite: "vorn" },
  sh:      { name: "Hintere Schulter",    bereich: "pull",  seite: "hinten" },
  rot:     { name: "Rotatorenmanschette", bereich: "pull",  seite: "hinten", klein: true },
  ob:      { name: "Oberer Rücken",       bereich: "pull",  seite: "hinten" },
  lat:     { name: "Latissimus",          bereich: "pull",  seite: "hinten" },
  ur:      { name: "Unterer Rücken",      bereich: "pull",  seite: "hinten", klein: true },
  nacken:  { name: "Nacken",              bereich: "pull",  seite: "hinten", klein: true },
  bizeps:  { name: "Bizeps",              bereich: "pull",  seite: "vorn" },
  trizeps: { name: "Trizeps",             bereich: "push",  seite: "hinten" },
  ua:      { name: "Unterarme",           bereich: "pull",  seite: "vorn", klein: true }
};

/* Geräte: Schlüssel → Name, Ort (gym = nur Studio, heim = oft zu Hause) */
T.GERAETE = {
  kg: { name: "Körpergewicht", immer: true },
  mt: { name: "Matte", immer: true },
  lh: { name: "Langhantel", heim: false },
  kh: { name: "Kurzhanteln", heim: true },
  sz: { name: "SZ-Stange", heim: false },
  kz: { name: "Kabelzug", heim: false },
  sm: { name: "Multipresse (Smith Machine)", heim: false },
  bp: { name: "Brustpresse", heim: false },
  lz: { name: "Latzug", heim: false },
  rm: { name: "Rudermaschine (sitzend)", heim: false },
  lp: { name: "Beinpresse / Hackenschmidt", heim: false },
  bs: { name: "Beinstrecker-Maschine", heim: false },
  bb: { name: "Beinbeuger-Maschine", heim: false },
  sp: { name: "Schulterpresse / Trizeps-Maschine", heim: false },
  bf: { name: "Butterfly / Reverse Butterfly", heim: false },
  kl: { name: "Klimmzugstange", heim: true },
  dp: { name: "Dip-Station", heim: false },
  bk: { name: "Hantelbank (verstellbar)", heim: true },
  wb: { name: "Widerstandsbänder", heim: true },
  bm: { name: "Bauchmaschine", heim: false },
  am: { name: "Adduktoren-/Abduktoren-Maschine", heim: false },
  wm: { name: "Wadenmaschine", heim: false },
  hx: { name: "Hyperextension-Bank", heim: false },
  lb: { name: "Laufband / Stepper", heim: false },
  eg: { name: "Fahrradergometer", heim: false },
  cr: { name: "Crosstrainer", heim: false },
  rg: { name: "Rudergerät (Cardio)", heim: false }
};

T.GELENKE = {
  nacken: "Nacken", schulter: "Schultern", ellbogen: "Ellbogen", handgelenk: "Handgelenke",
  ruecken: "Unterer Rücken", huefte: "Hüfte", knie: "Knie", knoechel: "Knöchel"
};

T.LEVEL = [
  { id: "neuling",       name: "Neuling",       info: "Ich habe noch nie richtig trainiert", tacho: 0.08, faktor: 0.55, kap: 1 },
  { id: "wieder",        name: "Wiedereinstieg", info: "Früher trainiert, länger pausiert", tacho: 0.25, faktor: 0.75, kap: 2 },
  { id: "anfaenger",     name: "Anfänger",      info: "Unter einem Jahr regelmäßig", tacho: 0.38, faktor: 0.75, kap: 2 },
  { id: "durchschnitt",  name: "Durchschnitt",  info: "Gymratte – trainiere seit Jahren", tacho: 0.6, faktor: 1, kap: 3 },
  { id: "fortgeschritten", name: "Fortgeschritten", info: "Erster Wettkampf", tacho: 0.8, faktor: 1.25, kap: 3 },
  { id: "elite",         name: "Elite",         info: "Pro-Card-Besitzer", tacho: 0.96, faktor: 1.5, kap: 3 }
];

T.ZIELE = {
  recomp:  { name: "Rekomposition", info: "Fett abbauen und gleichzeitig Muskeln aufbauen" },
  abnehmen:{ name: "Abnehmen", info: "Vor allem Körperfett verlieren" },
  muskel:  { name: "Muskeln aufbauen", info: "Masse und Kraft zulegen" },
  halten:  { name: "Gewicht halten", info: "Form halten, fitter werden" }
};

T.ARBEIT = {
  sitzend: { name: "Sitzend (Bürojob)", plus: 0 },
  fahrend: { name: "Fahrend", plus: 0 },
  hebend: { name: "Hebend", plus: 0.15 },
  kniend: { name: "Kniend", plus: 0.05 },
  vorlehnend: { name: "Vorlehnend", plus: 0.05 },
  ueberkopf: { name: "Überkopf", plus: 0.1 },
  rotierend: { name: "Rotierend", plus: 0.08 },
  stehend: { name: "Stehend / Gehend", plus: 0.1 }
};

T.FREIZEIT = [
  { id: "inaktiv", name: "Inaktiv", info: "Kaum Bewegung neben dem Gym", plus: 0, schritte: -1500 },
  { id: "leicht", name: "Leicht aktiv", info: "Spaziergänge, Rad zur Arbeit", plus: 0.05, schritte: -500 },
  { id: "moderat", name: "Moderat aktiv", info: "2 bis 3 Tage Sport pro Woche", plus: 0.1, schritte: 0 },
  { id: "aktiv", name: "Aktiv", info: "Mindestens 3 Tage Sport", plus: 0.15, schritte: 500 },
  { id: "sehr", name: "Sehr aktiv", info: "Mehr als 3 Tage Sport", plus: 0.2, schritte: 1000 }
];

T.SPLITS = {
  ganz: { name: "Ganzkörper", info: "Jeder Muskel bei jedem Training. Ideal bei 2–3 Tagen und für Einsteiger." },
  ul:   { name: "Upper | Lower", info: "Oberkörper und Unterkörper im Wechsel. Ideal bei 4 Tagen." },
  pp:   { name: "Push | Pull", info: "Drücken (Brust, Schulter, Trizeps, Beinstrecker) und Ziehen (Rücken, Bizeps, Beinbeuger)." },
  ppl:  { name: "Push | Pull | Legs", info: "Drücken, Ziehen, Beine. Ideal bei 3 oder 6 Tagen." },
  bro:  { name: "Bro-Split", info: "Brust, Rücken, Schultern, Arme, Beine – je ein Tag. Nur bei 5 Tagen sinnvoll." }
};

/* Farben der Tagestypen in der Wochenplanung */
T.TAGFARBE = { oben: "gold", unten: "orange", push: "gold", pull: "amber", beine: "orange", ganz: "weiss",
  brust: "gold", ruecken: "amber", schulter: "gold", arme: "amber" };

T.ERNAEHRUNGSFORM = {
  alles: "Alles", vegetarisch: "Vegetarisch", vegan: "Vegan", halal: "Halal", pesce: "Pescetarisch", ohneschwein: "Ohne Schweinefleisch"
};
T.ALLERGENE = { gluten: "Gluten", laktose: "Laktose", ei: "Ei", nuss: "Nüsse", erdnuss: "Erdnüsse", soja: "Soja", fisch: "Fisch / Meeresfrüchte", sesam: "Sesam" };
T.SUPPS = { whey: "Whey-Protein", kreatin: "Kreatin", koffein: "Koffein", omega3: "Omega-3", vitd: "Vitamin D", keine: "Keine" };

T.MAHLZEITEN = { fruehstueck: "Frühstück", mittag: "Mittagessen", abend: "Abendessen", snack: "Snack", pre: "Vor dem Training", post: "Nach dem Training" };

/* Beschreibungen zum Körperfett (männlich / weiblich, Obergrenze in %) */
T.KF_TEXT = {
  m: [
    [9, "Sehr definiert – Bauchmuskeln und Venen deutlich sichtbar. Schwer dauerhaft zu halten."],
    [13, "Athletisch – Bauchmuskeln sichtbar, klare Konturen an Schultern und Armen."],
    [17, "Fit – Umrisse der Bauchmuskeln bei gutem Licht, flacher Bauch."],
    [21, "Normal – Deine Bauchmuskeln werden von einer dünnen Fettschicht verdeckt."],
    [26, "Weich – Deine Bauchmuskeln werden von einer Fettschicht verdeckt, leichte Hüftpolster."],
    [32, "Erhöht – deutlicher Bauchansatz, Taille breiter als die Brust."],
    [99, "Hoch – viel Fett an Bauch, Hüfte und Brust. Fettabbau hat jetzt Priorität."]
  ],
  w: [
    [16, "Sehr definiert – Bauchmuskeln sichtbar, sehr wenig Unterhautfett. Schwer zu halten."],
    [20, "Athletisch – straffe Konturen, Bauch flach mit leichter Definition."],
    [25, "Fit – flacher Bauch, leichte Rundungen an Hüfte und Oberschenkeln."],
    [30, "Normal – Deine Bauchmuskeln werden von einer Fettschicht verdeckt."],
    [35, "Weich – Fettpolster an Bauch, Hüfte und Oberschenkeln."],
    [40, "Erhöht – deutliche Polster, Taille wenig ausgeprägt."],
    [99, "Hoch – Fettabbau hat jetzt Priorität."]
  ]
};

T.SPRUECHE = [
  "Stark. Genau so baust Du den Körper, den Du willst.",
  "Wieder eine Einheit auf dem Konto. Die summieren sich.",
  "Kein Training ist verschwendet. Heute hast Du geliefert.",
  "Disziplin schlägt Motivation. Du hast es bewiesen.",
  "Erholung ist jetzt Teil des Plans: essen, trinken, schlafen.",
  "Kleine Schritte, jede Woche. So entsteht Definition."
];

T.ABZEICHEN = [
  { id: "erstes", name: "Erste Einheit", info: "Dein erstes Training abgeschlossen", sym: "1" },
  { id: "fuenf", name: "Fünf geschafft", info: "5 Trainings absolviert", sym: "5" },
  { id: "zwanzig", name: "Dranbleiber", info: "20 Trainings absolviert", sym: "20" },
  { id: "fuenfzig", name: "Eisern", info: "50 Trainings absolviert", sym: "50" },
  { id: "woche", name: "Volle Woche", info: "Alle geplanten Trainings einer Woche geschafft", sym: "W" },
  { id: "rekord", name: "Neuer Rekord", info: "Erste Bestleistung", sym: "PR" },
  { id: "checkin4", name: "Vier Check-ins", info: "Vier Wochen lang eingecheckt", sym: "4" },
  { id: "minus2", name: "Minus 2 kg", info: "2 kg leichter als zu Beginn", sym: "−2" },
  { id: "taille", name: "Taille schmaler", info: "Taille 3 cm schmaler als zu Beginn", sym: "cm" },
  { id: "wasser", name: "Gut versorgt", info: "7 Tage Wasserziel erreicht", sym: "H₂O" }
];

T.HINWEIS = "Diese App ersetzt keine ärztliche oder professionelle Beratung. Bei Schmerzen, Schwindel oder Vorerkrankungen sprich bitte mit einer Ärztin oder einem Arzt.";
