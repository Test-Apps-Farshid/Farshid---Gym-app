/* =====================================================================
   ERNÄHRUNG – Tagespläne, Rezept-Skalierung, Einkaufsliste, Tracking
   ===================================================================== */
window.E = {};
window.LM = {};
LEBENSMITTEL.forEach(l => LM[l.id] = l);

/* Nährwerte einer Zutatenliste [[id, gramm], ...] */
E.naehrwerte = (zutaten) => zutaten.reduce((s, [id, g]) => {
  const l = LM[id]; if (!l) return s;
  const f = g / 100;
  s.kcal += l.kcal * f; s.p += l.p * f; s.k += l.k * f; s.f += l.f * f; return s;
}, { kcal: 0, p: 0, k: 0, f: 0 });

E.rund = (n) => ({ kcal: Math.round(n.kcal), p: Math.round(n.p), k: Math.round(n.k), f: Math.round(n.f) });

/* Passt ein Lebensmittel zur Ernährungsform, Allergien und Abneigungen? */
E.lmPasst = (l, ern) => {
  if (!l) return false;
  const form = ern.form || "alles";
  const fleisch = !l.tags.includes("vegetarisch") && !l.tags.includes("vegan");
  if (form === "vegan" && !l.tags.includes("vegan")) return false;
  if (form === "vegetarisch" && fleisch) return false;
  if (form === "pesce" && fleisch && !l.all.includes("fisch")) return false;
  if ((form === "halal" || form === "ohneschwein") && l.tags.includes("schwein")) return false;
  if (form === "halal" && l.tags.includes("alkohol")) return false;
  if ((ern.allergien || []).some(a => l.all.includes(a))) return false;
  const nicht = (ern.nichtMag || "").toLowerCase().split(/[,;]+/).map(s => s.trim()).filter(Boolean);
  if (nicht.some(n => l.name.toLowerCase().includes(n) || l.id.includes(n))) return false;
  return true;
};

E.rezeptPasst = (r, ern) => {
  if (!r.zutaten.every(([id]) => E.lmPasst(LM[id], ern))) return false;
  const maxZeit = { kurz: 15, mittel: 30, lang: 120 }[ern.kochzeit] || 30;
  if (r.zeit > maxZeit) return false;
  if (ern.budget === "niedrig" && r.kosten > 2) return false;
  if (ern.kochen === "anfaenger" && r.zeit > 30) return false;
  return true;
};

/* Mahlzeiten-Slots je Anzahl und Trainingstag */
E.slots = (anzahl, train) => {
  const basis = {
    3: [["fruehstueck", 0.3], ["mittag", 0.35], ["abend", 0.35]],
    4: [["fruehstueck", 0.25], ["mittag", 0.3], ["snack", 0.15], ["abend", 0.3]],
    5: [["fruehstueck", 0.22], ["snack", 0.12], ["mittag", 0.28], ["snack", 0.12], ["abend", 0.26]],
    6: [["fruehstueck", 0.2], ["snack", 0.1], ["mittag", 0.25], ["snack", 0.1], ["abend", 0.25], ["snack", 0.1]]
  }[anzahl] || null;
  const s = (basis || [["fruehstueck", 0.3], ["mittag", 0.35], ["abend", 0.35]]).map(x => x.slice());
  if (train) {
    // Trainingstag: ein Snack wird Pre-Workout, ein weiterer Post-Workout
    const i = s.findIndex(x => x[0] === "snack");
    if (i >= 0) s[i][0] = "pre"; else { s.splice(2, 0, ["pre", 0.12]); }
    const j = s.findIndex(x => x[0] === "snack");
    if (j >= 0) s[j][0] = "post"; else s.splice(s.length - 1, 0, ["post", 0.15]);
    const sum = s.reduce((a, x) => a + x[1], 0); s.forEach(x => x[1] /= sum);
  }
  return s;
};

/* Rezept auf Zielkalorien skalieren (Faktor 0,6–1,8, auf 5 g gerundet) */
E.skalieren = (r, zielKcal) => {
  const n = E.naehrwerte(r.zutaten);
  const f = R.klemmen(zielKcal / n.kcal, 0.6, 1.8);
  const z = r.zutaten.map(([id, g]) => [id, Math.max(5, R.runden(g * f, 5))]);
  return { rezept: r.id, zutaten: z, n: E.rund(E.naehrwerte(z)) };
};

/* Tagesplan für einen bestimmten Wochentag (0 = Montag) */
E.tagesplan = (p, wtag, trainTage, kalorien) => {
  const train = trainTage.includes(wtag);
  const kcal = train ? kalorien.train : kalorien.ruhe;
  const makro = R.makros(p, kcal, train);
  const ern = p.ern || {};
  const slots = E.slots(ern.mahlzeiten || 4, train);
  const genutzt = new Set();
  const mahlzeiten = slots.map(([typ, anteil], i) => {
    let kand = REZEPTE.filter(r => r.mahlzeit.includes(typ) && E.rezeptPasst(r, ern));
    if (!kand.length) kand = REZEPTE.filter(r => r.mahlzeit.includes(typ === "pre" || typ === "post" ? "snack" : typ) && E.rezeptPasst(r, ern));
    if (!kand.length) kand = REZEPTE.filter(r => E.rezeptPasst(r, { ...ern, kochzeit: "lang", budget: "hoch", kochen: "gut" }) && r.mahlzeit.includes(typ));
    const frei = kand.filter(r => !genutzt.has(r.id));
    const liste = frei.length ? frei : kand;
    if (!liste.length) return { typ, leer: true, ziel: Math.round(kcal * anteil) };
    const r = liste[(wtag * 3 + i * 2 + (p.planSaat || 0)) % liste.length];
    genutzt.add(r.id);
    return { typ, ...E.skalieren(r, kcal * anteil) };
  });
  const summe = mahlzeiten.reduce((s, m) => { if (m.n) { s.kcal += m.n.kcal; s.p += m.n.p; s.k += m.n.k; s.f += m.n.f; } return s; }, { kcal: 0, p: 0, k: 0, f: 0 });
  return { wtag, train, kcal, makro, mahlzeiten, summe, wasser: R.wasserziel(p, train) };
};

E.wochenplan = (p, trainTage, kalorien) => [0, 1, 2, 3, 4, 5, 6].map(w => E.tagesplan(p, w, trainTage, kalorien));

/* Einkaufsliste aus dem Wochenplan */
E.einkaufsliste = (woche) => {
  const sum = {};
  woche.forEach(t => t.mahlzeiten.forEach(m => (m.zutaten || []).forEach(([id, g]) => sum[id] = (sum[id] || 0) + g)));
  const gruppe = (l) => l.tags.includes("vegan") ? (["brokkoli","spinat","paprika","tomate","gurke","zucchini","zwiebel","salat","tk_gemuese","banane","apfel","beeren","avocado","datteln"].includes(l.id) ? "Obst und Gemüse" : "Vorrat") :
    (l.all.includes("laktose") || l.id === "ei" || l.id === "eiklar") ? "Kühlregal" : "Fleisch und Fisch";
  return Object.entries(sum).map(([id, g]) => ({ id, name: LM[id].name, g: R.runden(g, 10), stk: LM[id].stk ? Math.ceil(g / LM[id].stk) : null, gruppe: gruppe(LM[id]) }))
    .sort((a, b) => a.gruppe.localeCompare(b.gruppe) || a.name.localeCompare(b.name));
};

/* Wöchentliche Ernährungsabfrage → Anpassung in kcal */
E.abfrageAnpassung = (a) => {
  let d = 0; const gruende = [];
  if (a.hunger === "stark" && a.plan !== "ja") { d += 100; gruende.push("starker Hunger"); }
  if (a.energie === "schlecht") { d += 100; gruende.push("wenig Energie im Training"); }
  if (a.hunger === "kaum" && a.energie === "gut" && a.plan === "ja") { d -= 50; gruende.push("kaum Hunger, gute Energie"); }
  return { delta: d, text: d === 0 ? "Alles im grünen Bereich – Kalorien bleiben." :
    `${d > 0 ? "+" : ""}${d} kcal pro Tag (${gruende.join(", ")}).` };
};

/* Wöchentliches Check-in → Bewertung und Anpassung */
E.checkinAuswertung = (p, checkins) => {
  if (checkins.length < 2) return { text: "Erstes Check-in gespeichert. Ab nächster Woche bekommst Du eine Auswertung.", delta: 0, stufe: "ok" };
  const neu = checkins[checkins.length - 1], alt = checkins[checkins.length - 2];
  const tage = (neu.datum - alt.datum) / 864e5;
  if (tage < 5) return { text: "Gespeichert. Für eine Auswertung braucht es mindestens 5 Tage Abstand zum letzten Check-in – Gewicht schwankt täglich.", delta: 0, stufe: "ok" };
  const proWoche = (neu.gewicht - alt.gewicht) / tage * 7;
  const prozent = proWoche / alt.gewicht * 100;
  const taille = neu.taille && alt.taille ? neu.taille - alt.taille : null;
  let text, delta = 0, stufe = "ok";
  const t = (x) => x.toFixed(1).replace(".", ",");
  if (p.ziel === "abnehmen") {
    if (prozent < -1.2) { text = `Fettabbau zu schnell (${t(proWoche)} kg/Woche). Erhöhe die Kalorien – so schützt Du Deine Muskeln.`; delta = 150; stufe = "warn"; }
    else if (prozent > -0.25) { text = `Stagnation (${t(proWoche)} kg/Woche). Kalorien leicht gesenkt, Schritte im Blick behalten.`; delta = -120; stufe = "info"; }
    else text = `Du liegst im Plan: ${t(proWoche)} kg pro Woche.`;
  } else if (p.ziel === "recomp") {
    if (prozent < -0.8) { text = `Du nimmst schneller ab als nötig (${t(proWoche)} kg/Woche). Etwas mehr essen.`; delta = 100; stufe = "warn"; }
    else if (prozent > 0.4 && (taille === null || taille > 0)) { text = "Gewicht und Taille steigen – Kalorien leicht gesenkt."; delta = -100; stufe = "info"; }
    else text = taille !== null && taille < 0 ? `Läuft: Taille ${t(taille)} cm bei stabilem Gewicht. Genau so soll Rekomposition aussehen.` : `Du liegst im Plan (${t(proWoche)} kg/Woche).`;
  } else if (p.ziel === "muskel") {
    if (prozent > 0.6) { text = `Zunahme zu schnell (${t(proWoche)} kg/Woche) – das wäre vor allem Fett. Kalorien gesenkt.`; delta = -120; stufe = "warn"; }
    else if (prozent < 0.1) { text = "Keine Zunahme – Kalorien leicht erhöht."; delta = 120; stufe = "info"; }
    else text = `Du liegst im Plan: +${t(proWoche)} kg pro Woche.`;
  } else {
    if (Math.abs(prozent) > 0.5) { delta = prozent > 0 ? -100 : 100; text = "Gewicht schwankt mehr als gewollt – Kalorien angepasst."; stufe = "info"; }
    else text = "Gewicht stabil. Weiter so.";
  }
  return { text, delta, stufe, proWoche };
};

/* Supplement-Hinweise – sachlich, optional */
E.SUPP_INFO = {
  whey: "Praktisch, um das Eiweißziel zu erreichen. Kein Muss – Quark, Skyr oder Fleisch leisten dasselbe.",
  kreatin: "3–5 g täglich, Zeitpunkt egal. Gut untersucht für Kraft und Muskelaufbau. Ausreichend trinken.",
  koffein: "Optional vor dem Training (z. B. ein Kaffee). Nicht nach dem frühen Nachmittag – Schlaf geht vor.",
  omega3: "Sinnvoll, wenn Du selten fettigen Fisch isst.",
  vitd: "Im Winter in Deutschland oft niedrig. Am besten den Wert beim Arzt messen lassen.",
  keine: "Völlig in Ordnung – Supplemente sind keine Pflicht."
};
