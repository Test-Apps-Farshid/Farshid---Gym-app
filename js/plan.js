/* =====================================================================
   TRAININGSPLAN – Erstellung, Wochenlogik, Progression, Ersatzübungen
   ===================================================================== */
window.P = {};

/* Tagesvorlagen je Split. Reihenfolge = Reihenfolge im Training
   (Fokus-Muskeln werden später automatisch nach vorn sortiert). */
P.VORLAGEN = {
  ganz: [
    { name: "Ganzkörper A", typ: "ganz", m: ["quad", "brust", "lat", "smi", "ham", "trizeps", "bizeps", "bauch"] },
    { name: "Ganzkörper B", typ: "ganz", m: ["po", "brust", "ob", "sv", "quad", "sh", "bizeps", "trizeps", "seite"] },
    { name: "Ganzkörper C", typ: "ganz", m: ["ham", "sv", "lat", "brust", "smi", "trizeps", "bizeps", "bauch"] }
  ],
  ul: [
    { name: "Oberkörper A", typ: "oben", m: ["brust", "ob", "sv", "lat", "smi", "trizeps", "bizeps", "sh"] },
    { name: "Unterkörper A", typ: "unten", m: ["quad", "ham", "po", "wade", "add", "bauch", "seite"] },
    { name: "Oberkörper B", typ: "oben", m: ["brust", "lat", "smi", "ob", "sv", "bizeps", "trizeps", "rot"] },
    { name: "Unterkörper B", typ: "unten", m: ["ham", "quad", "po", "wade", "ur", "bauch", "ua"] }
  ],
  pp: [
    { name: "Push", typ: "push", m: ["brust", "quad", "sv", "smi", "trizeps", "wade", "bauch"] },
    { name: "Pull", typ: "pull", m: ["lat", "ham", "ob", "po", "sh", "bizeps", "seite", "ua"] }
  ],
  ppl: [
    { name: "Push", typ: "push", m: ["brust", "sv", "smi", "trizeps", "bauch"] },
    { name: "Pull", typ: "pull", m: ["lat", "ob", "sh", "bizeps", "nacken", "ua"] },
    { name: "Beine", typ: "beine", m: ["quad", "ham", "po", "wade", "add", "seite"] }
  ],
  bro: [
    { name: "Brust", typ: "brust", m: ["brust", "sv", "trizeps", "bauch"] },
    { name: "Rücken", typ: "ruecken", m: ["lat", "ob", "ur", "nacken", "sh"] },
    { name: "Schultern", typ: "schulter", m: ["smi", "sv", "sh", "rot", "seite"] },
    { name: "Arme", typ: "arme", m: ["bizeps", "trizeps", "ua", "bauch"] },
    { name: "Beine", typ: "beine", m: ["quad", "ham", "po", "wade", "add"] }
  ]
};

P.MASCHINEN = ["bp", "lz", "rm", "lp", "bs", "bb", "sp", "bf", "bm", "am", "wm", "sm", "kz"];
P.HALTEN = ["plank", "seitstuetz", "farmers"];  // Übungen in Sekunden

/* ---------- Filter ---------- */
P.verfuegbar = (u, p) => u.geraet.every(g => T.GERAETE[g]?.immer || (p.geraete || []).includes(g));

/* Schmerzfilter: leicht (1) meidet hohe Belastung, mittel (2) meidet auch
   mittlere Belastung, wenn es Alternativen gibt, stark (3) meidet jede Belastung */
P.schmerzOk = (u, p, streng = true) => {
  for (const [gelenk, stufe] of Object.entries(p.schmerzen || {})) {
    const last = u.gelenke[gelenk] || 0;
    if (!stufe || !last) continue;
    if (stufe >= 3) return false;
    if (stufe === 2 && (last >= 2 || streng)) return false;
    if (stufe === 1 && last >= 2) return false;
  }
  return true;
};

P.levelKap = (p) => (T.LEVEL.find(l => l.id === p.level) || T.LEVEL[2]).kap;

P.kandidaten = (muskel, p, typen) => {
  const kap = P.levelKap(p);
  let liste = UEBUNGEN.filter(u => u.muskel === muskel && typen.includes(u.typ) && P.verfuegbar(u, p) && u.level <= kap);
  let ok = liste.filter(u => P.schmerzOk(u, p, true));
  if (!ok.length) ok = liste.filter(u => P.schmerzOk(u, p, false));
  return ok;
};

/* ---------- Volumen ---------- */
P.wochenSaetze = (muskel, p) => {
  const basis = { neuling: 8, wieder: 9, anfaenger: 10, durchschnitt: 12, fortgeschritten: 14, elite: 16 }[p.level] || 10;
  const fokus = (p.fokus || []).includes(muskel);
  let s = basis;
  if (T.MUSKELN[muskel].klein) s = basis * 0.5;
  if (muskel === "bauch") s = basis * 0.8;
  if (muskel === "seite") s = basis * 0.6;
  if (fokus) s = Math.max(s, basis) * 1.4;
  return Math.round(s);
};

P.repBereich = (u, p) => {
  if (P.HALTEN.includes(u.id)) return { sek: true, lo: 30, hi: 45 };
  if (u.typ === "core") return { lo: 12, hi: 20 };
  if (u.typ === "isolation") return { lo: 10, hi: 15 };
  const einsteiger = ["neuling", "wieder", "anfaenger"].includes(p.level);
  return einsteiger || p.ziel === "abnehmen" ? { lo: 8, hi: 12 } : { lo: 6, hi: 10 };
};
P.pause = (u, p) => u.typ === "grund" ? (p.pauseGrund || 120) : u.typ === "isolation" ? (p.pauseIso || 75) : 45;
P.tempo = (u) => u.typ === "grund" ? "3-0-1" : u.typ === "isolation" ? "2-1-1" : "2-1-2";
P.minutenProSatz = (u, p) => (P.pause(u, p) + 45) / 60;

/* ---------- Mesozyklus ---------- */
P.mesoWochen = (p) => ["neuling", "wieder", "anfaenger"].includes(p.level) ? 8 : 10;
P.wocheInfo = (plan, woche) => {
  const n = plan.wochen, deload = woche === n;
  const anteil = woche / (n - 1);
  const rir = deload ? 4 : anteil < 0.3 ? 3 : anteil < 0.6 ? 2 : anteil < 0.85 ? "1–2" : 1;
  return { deload, rir, text: deload ? "Deload-Woche: weniger Sätze, leichter – Dein Körper erholt sich und wird stärker." :
    `Woche ${woche} von ${n}: höre ${rir} Wiederholung${rir === 1 ? "" : "en"} vor dem Muskelversagen auf.` };
};
P.aktuelleWoche = (plan) => {
  const tage = Math.floor((Date.now() - plan.start) / 864e5);
  return Math.min(plan.wochen, Math.max(1, Math.floor(tage / 7) + 1));
};

/* ---------- Plan erstellen ---------- */
P.erstellen = (p) => {
  const vorlagen = P.VORLAGEN[p.split] || P.VORLAGEN.ganz;
  // p.tage[i] = Wochentag für Vorlage i (Reihenfolge aus der Wochenplanung)
  const tage = (p.tage && p.tage.length === p.frequenz) ? p.tage.slice() : P.standardTage(p.frequenz);
  const folge = tage.map((wtag, i) => ({ wtag, vorlage: vorlagen[i % vorlagen.length], idx: i }));
  // Wie oft kommt ein Muskel pro Woche vor?
  const vorkommen = {};
  folge.forEach(f => f.vorlage.m.forEach(m => vorkommen[m] = (vorkommen[m] || 0) + 1));
  const genutzt = {};
  const tagePlan = folge.map(f => P.tagErstellen(f, p, vorkommen, genutzt)).sort((a, b) => a.wtag - b.wtag);
  return { start: P.wochenStart(), wochen: P.mesoWochen(p), split: p.split, tage: tagePlan, version: 1 };
};

P.standardTage = (n) => ({ 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 4, 5], 6: [0, 1, 2, 3, 4, 5] }[n] || [0, 2, 4]);
P.wochenStart = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };

P.tagErstellen = (f, p, vorkommen, genutzt) => {
  const fokus = p.fokus || [];
  // Fokus-Muskeln nach vorn (Core bleibt am Ende)
  const ms = f.vorlage.m.slice().sort((a, b) => {
    const ca = T.MUSKELN[a].bereich === "core", cb = T.MUSKELN[b].bereich === "core";
    if (ca !== cb) return ca ? 1 : -1;
    const fa = fokus.includes(a) && !T.MUSKELN[a].klein, fb = fokus.includes(b) && !T.MUSKELN[b].klein;
    if (fa !== fb) return fa ? -1 : 1;
    return f.vorlage.m.indexOf(a) - f.vorlage.m.indexOf(b);
  });
  let uebungen = [];
  const amTag = new Set();
  ms.forEach(m => {
    let saetze = Math.max(2, Math.round(P.wochenSaetze(m, p) / vorkommen[m]));
    const typen = T.MUSKELN[m].bereich === "core" ? ["core"] : ["grund", "isolation"];
    const kand = P.kandidaten(m, p, typen);
    if (!kand.length) return;
    const anzahl = saetze > 5 ? 2 : 1;
    for (let i = 0; i < anzahl && saetze > 0; i++) {
      const s = anzahl === 2 ? (i === 0 ? Math.ceil(saetze / 2) : Math.floor(saetze / 2)) : Math.min(saetze, 4);
      const u = P.waehle(kand, p, i === 0 ? "grund" : "isolation", amTag, genutzt, f.idx);
      if (!u) break;
      amTag.add(u.id); genutzt[u.id] = (genutzt[u.id] || 0) + 1;
      uebungen.push(P.eintrag(u, p, Math.min(4, Math.max(2, s)), m));
    }
  });
  // Höchstens ca. eine Übung pro 9 Minuten: zweite Übungen eines Muskels zusammenlegen
  const maxUe = Math.max(5, Math.round(p.dauer / 9));
  for (let schutz2 = 30; uebungen.length > maxUe && schutz2--;) {
    const zweit = [...uebungen].reverse().find((e, _, arr) => uebungen.filter(x => x.muskel === e.muskel).length > 1 && !fokus.includes(e.muskel))
      || [...uebungen].reverse().find(e => uebungen.filter(x => x.muskel === e.muskel).length > 1);
    if (zweit) {
      const erst = uebungen.find(x => x.muskel === zweit.muskel && x !== zweit);
      erst.saetze = Math.min(4, erst.saetze + Math.ceil(zweit.saetze / 2));
      uebungen = uebungen.filter(x => x !== zweit);
    } else {
      const weg = [...uebungen].reverse().find(e => !fokus.includes(e.muskel) && T.MUSKELN[e.muskel].klein)
        || [...uebungen].reverse().find(e => !fokus.includes(e.muskel)) || uebungen[uebungen.length - 1];
      uebungen = uebungen.filter(x => x !== weg);
    }
  }
  // Zeitbudget einhalten
  const fixzeit = 7 + 5; // Aufwärmen + Dehnen
  const dauer = () => uebungen.reduce((s, e) => s + e.saetze * P.minutenProSatz(UEB[e.id], p), fixzeit);
  let schutz = 60;
  while (dauer() > p.dauer && schutz--) {
    // erst Nicht-Fokus-Übungen kürzen, von hinten
    const kandidat = [...uebungen].reverse().find(e => !fokus.includes(e.muskel) && e.saetze > 2)
      || [...uebungen].reverse().find(e => e.saetze > 2);
    if (kandidat) kandidat.saetze--;
    else {
      const weg = [...uebungen].reverse().find(e => !fokus.includes(e.muskel)) || uebungen[uebungen.length - 1];
      uebungen = uebungen.filter(e => e !== weg);
    }
  }
  // Cardio-Finisher, wenn Zeit bleibt und Fettabbau Ziel ist
  let cardio = null;
  const rest = p.dauer - dauer();
  if (rest >= 8 && p.ziel !== "muskel") {
    const c = UEBUNGEN.filter(u => u.typ === "cardio" && P.verfuegbar(u, p) && P.schmerzOk(u, p, true));
    const wahl = c.find(u => ["crosstrainer", "ergometer", "laufband"].includes(u.id)) || c[0];
    if (wahl) cardio = { id: wahl.id, min: Math.min(20, R.runden(rest, 5)) };
  }
  // Aufwärmen und Dehnen
  const warm = [];
  const cw = UEBUNGEN.filter(u => u.typ === "cardio" && P.verfuegbar(u, p) && P.schmerzOk(u, p, true) && u.level === 1);
  if (cw.length) warm.push(cw[f.idx % cw.length].id);
  warm.push("worlds_greatest");
  if (f.vorlage.m.some(m => ["lat", "ob", "ur"].includes(m))) warm.push("katze_kuh");
  const dehn = [];
  const dehnMap = { brust: "dehn_brust", lat: "dehn_lat", ham: "dehn_ham", quad: "dehn_huefte", trizeps: "dehn_trizeps", wade: "dehn_wade", nacken: "nacken_dehn", sv: "dehn_brust" };
  f.vorlage.m.forEach(m => { const d = dehnMap[m]; if (d && !dehn.includes(d) && dehn.length < 3) dehn.push(d); });
  if (!dehn.length) dehn.push("dehn_huefte");
  return { wtag: f.wtag, name: f.vorlage.name, typ: f.vorlage.typ, uebungen, aufwaermen: warm, dehnen: dehn, cardio,
    dauer: Math.round(dauer() + (cardio ? cardio.min : 0)) };
};

P.waehle = (kand, p, bevorzugt, amTag, genutzt, versatz) => {
  const einsteiger = ["neuling", "wieder", "anfaenger"].includes(p.level);
  const schmerz = Object.keys(p.schmerzen || {}).length > 0;
  const bewertet = kand.filter(u => !amTag.has(u.id)).map((u, i) => {
    let s = 0;
    if (u.typ === bevorzugt) s += 10;
    if (einsteiger && u.geraet.some(g => P.MASCHINEN.includes(g))) s += 3;
    if (einsteiger && u.level === 1) s += 2;
    if (!einsteiger && u.geraet.some(g => ["lh", "kh"].includes(g)) && u.typ === "grund") s += 2;
    if (schmerz) s -= Object.values(u.gelenke).reduce((a, b) => a + b, 0);
    s -= (genutzt[u.id] || 0) * 6;                       // Abwechslung zwischen Tagen
    s += ((i + versatz * 3) % kand.length) * 0.15;        // stabile Variation
    return { u, s };
  }).sort((a, b) => b.s - a.s);
  return bewertet[0]?.u;
};

P.eintrag = (u, p, saetze, muskel) => {
  const r = P.repBereich(u, p);
  return { uid: Math.random().toString(36).slice(2, 9), id: u.id, muskel: muskel || u.muskel, saetze,
    lo: r.lo, hi: r.hi, sek: !!r.sek, pause: P.pause(u, p), tempo: P.tempo(u) };
};

/* Sätze in der aktuellen Woche (Deload reduziert) */
P.saetzeInWoche = (e, plan, woche) => P.wocheInfo(plan, woche).deload ? Math.max(1, Math.round(e.saetze * 0.6)) : e.saetze;

/* ---------- Ersatzübungen ---------- */
P.alternativen = (id, p, gelenkMeiden) => {
  const u = UEB[id];
  return UEBUNGEN.filter(x => x.id !== id && x.muskel === u.muskel && P.verfuegbar(x, p) && x.typ !== "dehnen" && x.typ !== "cardio"
      && P.schmerzOk(x, p, false) && (!gelenkMeiden || !(x.gelenke[gelenkMeiden] > 0)))
    .sort((a, b) => (b.typ === u.typ) - (a.typ === u.typ) || a.level - b.level);
};

/* ---------- Gewichte ---------- */
P.schritt = (u) => {
  if (u.geraet.includes("kh")) return 2;
  if (u.geraet.includes("lp")) return 5;
  if (u.geraet.every(g => g === "kg" || g === "mt" || g === "bk")) return 0;
  return 2.5;
};
P.koerpergewicht = (u) => P.schritt(u) === 0 || u.geraet.includes("wb");

/* Grober Startvorschlag, bevor ein Einstufungssatz gemacht wurde */
P.startHinweis = (u, p) => {
  if (P.koerpergewicht(u)) return null;
  const lv = (T.LEVEL.find(l => l.id === p.level) || T.LEVEL[2]).faktor * (p.geschlecht === "m" ? 1 : 0.6);
  const bw = p.gewicht;
  let f;
  const g = u.geraet;
  if (u.typ === "grund") f = g.includes("kh") ? 0.13 : g.includes("lp") ? 1.0 : (u.muskel === "quad" || u.muskel === "ham" || u.muskel === "ur" || u.muskel === "po") ? 0.6 : 0.45;
  else if (u.typ === "core") f = 0.25;
  else f = g.includes("kh") ? 0.07 : 0.15;
  const s = P.schritt(u) || 1;
  return Math.max(s, R.runden(bw * f * lv, s));
};

/* Gewicht aus Einstufungssatz: kg für 10 saubere Wiederholungen */
P.ausEinstufung = (u, e, kg10) => {
  const s = P.schritt(u) || 1;
  const e1 = R.e1rm(kg10, 10);
  return Math.max(s, R.runden(R.gewichtFuerWdh(e1, e.hi + 2), s));
};

/* Vorschlag für die nächste Einheit aus dem Verlauf */
P.vorschlag = (id, kraft) => {
  const k = kraft[id];
  if (!k) return null;
  return { kg: k.kg, wdh: k.zielWdh };
};

/* Doppelte Progression nach einer Übung.
   feedback: leicht | richtig | hart | nicht */
P.progression = (u, e, kraft, saetze, feedback) => {
  const k = kraft[u.id] || (kraft[u.id] = { kg: saetze[0]?.kg || 0, zielWdh: e.lo, verlauf: [] });
  const gemacht = saetze.filter(s => s.ok);
  const s = P.schritt(u);
  const alleOben = gemacht.length >= e.saetze && gemacht.every(x => x.wdh >= e.hi);
  const meistUnten = gemacht.filter(x => x.wdh < e.lo).length > gemacht.length / 2;
  const kgGenutzt = gemacht.length ? Math.max(...gemacht.map(x => x.kg || 0)) : k.kg;
  let kg = kgGenutzt, ziel = Math.min(e.hi, Math.max(e.lo, (gemacht.length ? Math.min(...gemacht.map(x => x.wdh)) : e.lo) + 1));
  let text = "";
  if (s === 0) { // Körpergewicht: Wiederholungen steigern
    if (feedback === "leicht" || alleOben) { ziel = e.hi + 2; text = "Mehr Wiederholungen beim nächsten Mal."; }
    else if (feedback === "nicht") { ziel = e.lo; text = "Gleiche Variante, Fokus auf saubere Technik."; }
  } else if (feedback === "nicht" || meistUnten) {
    kg = Math.max(s, R.runden(kgGenutzt * 0.9, s)); ziel = e.lo; text = `Nächstes Mal ${U.kg(kg)} – erst sauber, dann wieder steigern.`;
  } else if (feedback === "leicht") {
    kg = kgGenutzt + 2 * s; ziel = e.lo; text = `Zu leicht – nächstes Mal ${U.kg(kg)}.`;
  } else if (alleOben && feedback !== "hart") {
    kg = kgGenutzt + s; ziel = e.lo; text = `Alle Sätze im oberen Bereich – nächstes Mal ${U.kg(kg)}.`;
  } else if (feedback === "hart") {
    text = `Gewicht bleibt bei ${U.kg(kg)}. Ziel: ${ziel} Wiederholungen.`;
  } else {
    text = `Gewicht bleibt, nächstes Ziel: ${ziel} Wiederholungen pro Satz.`;
  }
  // Bestleistung?
  const e1 = gemacht.length ? Math.max(...gemacht.map(x => R.e1rm(x.kg || 0, x.wdh))) : 0;
  const altBest = Math.max(0, ...k.verlauf.map(v => v.e1 || 0));
  const rekord = s !== 0 && e1 > altBest && k.verlauf.length > 0;
  k.verlauf.push({ datum: Date.now(), saetze: gemacht.map(x => ({ kg: x.kg, wdh: x.wdh })), fb: feedback, e1: Math.round(e1 * 10) / 10 });
  if (k.verlauf.length > 60) k.verlauf.shift();
  k.kg = kg; k.zielWdh = ziel;
  return { text, rekord };
};

/* Volumen pro Muskel (Sätze) in einem Zeitraum aus dem Trainingslog */
P.volumenProMuskel = (log, von, bis) => {
  const v = {};
  log.filter(l => l.datum >= von && l.datum < bis).forEach(l => l.uebungen.forEach(e => {
    const n = e.saetze.filter(s => s.ok).length;
    v[e.muskel] = (v[e.muskel] || 0) + n;
  }));
  return v;
};
