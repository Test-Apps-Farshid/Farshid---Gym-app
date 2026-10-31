/* =====================================================================
   RECHNER – alle Formeln als eigene, gut lesbare Funktionen.
   Jede Funktion gibt neben dem Wert auch eine kurze Erklärung zurück,
   damit die App zeigen kann, wie der Wert zustande kommt.
   ===================================================================== */
window.R = {};

R.runden = (x, schritt = 1) => Math.round(x / schritt) * schritt;
R.klemmen = (x, a, b) => Math.min(b, Math.max(a, x));

/* Alter in Jahren aus Geburtsdatum {t,m,j} */
R.alter = (geb) => {
  const h = new Date(), g = new Date(geb.j, geb.m - 1, geb.t);
  let a = h.getFullYear() - g.getFullYear();
  if (h < new Date(h.getFullYear(), g.getMonth(), g.getDate())) a--;
  return a;
};

/* Körperfett nach US-Navy-Formel (Maße in cm) */
R.navyKF = (geschlecht, groesse, taille, hals, huefte) => {
  if (!taille || !hals || (geschlecht === "w" && !huefte)) return null;
  const log = Math.log10;
  let kf;
  if (geschlecht === "m") {
    if (taille - hals <= 0) return null;
    kf = 495 / (1.0324 - 0.19077 * log(taille - hals) + 0.15456 * log(groesse)) - 450;
  } else {
    if (taille + huefte - hals <= 0) return null;
    kf = 495 / (1.29579 - 0.35004 * log(taille + huefte - hals) + 0.221 * log(groesse)) - 450;
  }
  return R.klemmen(Math.round(kf * 10) / 10, 3, 60);
};

/* Fettfreie Masse */
R.magermasse = (gewicht, kf) => gewicht * (1 - kf / 100);

/* Grundumsatz: Mifflin-St-Jeor, oder Katch-McArdle wenn Körperfett bekannt */
R.grundumsatz = (p) => {
  const a = R.alter(p.geburt);
  const mifflin = 10 * p.gewicht + 6.25 * p.groesse - 5 * a + (p.geschlecht === "m" ? 5 : -161);
  if (p.kf) {
    const lbm = R.magermasse(p.gewicht, p.kf);
    const katch = 370 + 21.6 * lbm;
    return { wert: Math.round(katch), formel: "Katch-McArdle",
      erklaerung: `370 + 21,6 × ${lbm.toFixed(1)} kg fettfreie Masse (Mifflin-St-Jeor zum Vergleich: ${Math.round(mifflin)} kcal)` };
  }
  return { wert: Math.round(mifflin), formel: "Mifflin-St-Jeor",
    erklaerung: `10 × ${p.gewicht} kg + 6,25 × ${p.groesse} cm − 5 × ${a} Jahre ${p.geschlecht === "m" ? "+ 5" : "− 161"}` };
};

/* Alltagsfaktor aus Beruf und Freizeit (ohne Krafttraining) */
R.alltagsfaktor = (p) => {
  const arbeit = Math.max(0, ...(p.arbeit || []).map(k => T.ARBEIT[k]?.plus || 0));
  const frei = (T.FREIZEIT.find(f => f.id === p.freizeit) || T.FREIZEIT[1]).plus;
  return { wert: 1.2 + arbeit + frei, erklaerung: `1,2 Basis + ${arbeit.toFixed(2).replace(".", ",")} Beruf + ${frei.toFixed(2).replace(".", ",")} Freizeit` };
};

/* Energieverbrauch einer Krafteinheit (MET-Schätzung, netto 3,5 MET) */
R.trainingsKcal = (gewicht, minuten) => Math.round(3.5 * 3.5 * gewicht / 200 * minuten);

/* Gesamtumsatz an Trainings- und Ruhetagen sowie Wochenschnitt */
R.gesamtumsatz = (p) => {
  const bmr = R.grundumsatz(p), af = R.alltagsfaktor(p);
  const ruhe = Math.round(bmr.wert * af.wert);
  const trainKcal = R.trainingsKcal(p.gewicht, p.dauer);
  const train = ruhe + trainKcal;
  const schnitt = Math.round((train * p.frequenz + ruhe * (7 - p.frequenz)) / 7);
  return { bmr, af, ruhe, train, trainKcal, schnitt,
    erklaerung: `${bmr.wert} kcal Grundumsatz × ${af.wert.toFixed(2).replace(".", ",")} Alltag = ${ruhe} kcal. An Trainingstagen + ${trainKcal} kcal für ${p.dauer} Min. Krafttraining.` };
};

/* Sichere Untergrenze für die Kalorienzufuhr */
R.untergrenze = (p, bmr) => Math.max(p.geschlecht === "m" ? 1500 : 1200, Math.round(bmr * 0.95));

/* Kalorienziel je nach Ziel – mit Sicherheitsgrenzen */
R.kalorienziel = (p) => {
  const g = R.gesamtumsatz(p);
  const kf = p.kf || (p.geschlecht === "m" ? 20 : 28);
  const hoch = p.geschlecht === "m" ? kf > 25 : kf > 33;
  const niedrig = p.geschlecht === "m" ? kf < 12 : kf < 20;
  let prozent = 0, text = "";
  switch (p.ziel) {
    case "abnehmen": prozent = hoch ? -25 : niedrig ? -15 : -20; text = "moderates Defizit für Fettabbau"; break;
    case "recomp":   prozent = hoch ? -15 : niedrig ? -5 : -10; text = "leichtes Defizit nahe Erhaltung"; break;
    case "muskel":   prozent = hoch ? 3 : 8; text = "leichter Überschuss für Muskelaufbau"; break;
    default:         prozent = 0; text = "Erhaltungsbedarf";
  }
  let ziel = Math.round(g.schnitt * (1 + prozent / 100));
  // Höchstens ca. 1 % Körpergewicht pro Woche abnehmen (7700 kcal ≈ 1 kg Fett)
  const maxDefizit = Math.round(p.gewicht * 0.01 * 7700 / 7);
  if (g.schnitt - ziel > maxDefizit) ziel = g.schnitt - maxDefizit;
  ziel += p.kcalAnpassung || 0;              // Anpassungen aus Check-ins
  const grenze = R.untergrenze(p, g.bmr.wert);
  let begrenzt = false;
  if (ziel < grenze) { ziel = grenze; begrenzt = true; }
  ziel = R.runden(ziel, 10);
  // Trainingstage etwas mehr, Ruhetage etwas weniger – Wochenschnitt bleibt gleich
  const n = p.frequenz;
  const train = R.runden(ziel * (1 + 0.1 * (7 - n) / 7), 10);
  const ruhe = R.runden((7 * ziel - n * train) / (7 - n), 10);
  return { ziel, train, ruhe: Math.max(ruhe, grenze), prozent, begrenzt, grenze, gesamt: g,
    erklaerung: `Wochenschnitt ${g.schnitt} kcal ${prozent >= 0 ? "+" : "−"} ${Math.abs(prozent)} % (${text})` +
      (p.kcalAnpassung ? `, ${p.kcalAnpassung > 0 ? "+" : ""}${p.kcalAnpassung} kcal aus Deinen Check-ins` : "") +
      (begrenzt ? `. Auf die sichere Untergrenze von ${grenze} kcal angehoben.` : ".") };
};

/* Makros für einen Tag (train = true/false) */
R.makros = (p, kcal, train) => {
  const kf = p.kf || (p.geschlecht === "m" ? 20 : 28);
  const proKg = { abnehmen: 2.2, recomp: 2.2, muskel: 2.0, halten: 1.8 }[p.ziel] || 2;
  // Bei viel Körperfett auf "bereinigtes Gewicht" rechnen, sonst wird es unnötig viel
  const lbm = R.magermasse(p.gewicht, kf);
  const basis = Math.min(p.gewicht, lbm / (p.geschlecht === "m" ? 0.82 : 0.75));
  const protein = R.runden(proKg * basis, 5);
  const fettKg = train ? 0.7 : 0.9;
  let fett = R.runden(Math.max(0.6 * p.gewicht, fettKg * basis), 5);
  let kh = Math.round((kcal - protein * 4 - fett * 9) / 4);
  if (kh < 50) { fett = R.runden(Math.max(0.6 * p.gewicht, (kcal - protein * 4 - 200) / 9), 5); kh = Math.max(50, Math.round((kcal - protein * 4 - fett * 9) / 4)); }
  return { kcal, protein, fett, kh: R.runden(kh, 5),
    erklaerung: `Eiweiß ${proKg.toFixed(1).replace(".", ",")} g × ${basis.toFixed(0)} kg, Fett mind. 0,6 g/kg, Rest Kohlenhydrate${train ? " (mehr am Trainingstag)" : ""}` };
};

/* Wasser-, Schritt- und Schlafziel */
R.wasserziel = (p, train) => R.runden(p.gewicht * 35 + (train ? 500 : 0), 250);
R.schrittziel = (p) => {
  const basis = { abnehmen: 10000, recomp: 9000, muskel: 7000, halten: 8000 }[p.ziel] || 8000;
  const f = (T.FREIZEIT.find(x => x.id === p.freizeit) || {}).schritte || 0;
  return R.runden(basis + f, 500);
};
R.schlafziel = (p) => (p.ziel === "muskel" || p.ziel === "recomp") ? "7,5–9 Std." : "7–9 Std.";

/* Realistische Monatsraten (kg) für Fettverlust und Muskelzuwachs */
R.raten = (p) => {
  const kz = R.kalorienziel(p);
  const defizitTag = kz.gesamt.schnitt - kz.ziel;
  const lv = T.LEVEL.find(l => l.id === p.level) || T.LEVEL[2];
  const muskelBasis = { neuling: 0.9, wieder: 1.0, anfaenger: 0.7, durchschnitt: 0.35, fortgeschritten: 0.2, elite: 0.1 }[lv.id];
  const zielF = { recomp: 0.55, abnehmen: 0.3, muskel: 1, halten: 0.4 }[p.ziel] || 0.5;
  const muskel = muskelBasis * zielF * (p.geschlecht === "m" ? 1 : 0.55) * (defizitTag > 500 && lv.id !== "neuling" ? 0.6 : 1);
  const fett = Math.max(-0.4, defizitTag * 30 / 7700); // pro Monat, negativ = Fettaufbau
  return { fettMonat: Math.round(fett * 10) / 10, muskelMonat: Math.round(muskel * 10) / 10, defizitTag };
};

/* Prognose Woche für Woche: Gewicht, Körperfett, Korridor */
R.prognose = (p, wochen = 12) => {
  const r = R.raten(p);
  const kf0 = p.kf || (p.geschlecht === "m" ? 20 : 28);
  let fettKg = p.gewicht * kf0 / 100, mager = p.gewicht - fettKg;
  const pkte = [];
  for (let w = 0; w <= wochen; w++) {
    const gew = fettKg + mager;
    pkte.push({ woche: w, gewicht: Math.round(gew * 10) / 10, kf: Math.round(fettKg / gew * 1000) / 10,
      fett: Math.round(fettKg * 10) / 10, mager: Math.round(mager * 10) / 10 });
    const abkling = Math.pow(0.985, w);               // Fortschritt wird langsamer
    fettKg = Math.max(gew * 0.05, fettKg - r.fettMonat / 4.33 * abkling);
    mager += r.muskelMonat / 4.33 * Math.pow(0.97, w);
  }
  return { punkte: pkte, raten: r };
};

/* Sicherheitsprüfung – liefert Warnungen; "block" = Plan nicht erlauben */
R.sicherheit = (p) => {
  const w = [];
  const bmi = p.gewicht / Math.pow(p.groesse / 100, 2);
  const kf = p.kf || 20;
  const minKF = p.geschlecht === "m" ? 8 : 15;
  if ((p.ziel === "abnehmen" || p.ziel === "recomp") && kf <= minKF)
    w.push({ stufe: "block", text: `Mit ${kf} % Körperfett ist weiterer Fettabbau gesundheitlich riskant. Wähle "Gewicht halten" oder "Muskeln aufbauen".` });
  if (p.ziel === "abnehmen" && bmi < 18.5)
    w.push({ stufe: "block", text: `Dein BMI liegt bei ${bmi.toFixed(1).replace(".", ",")}. Abnehmen ist hier nicht sinnvoll – bitte ärztlich abklären.` });
  if (R.alter(p.geburt) < 16) w.push({ stufe: "warn", text: "Unter 16 Jahren bitte nur mit Begleitung durch Trainer oder Ärztin trainieren." });
  const stark = Object.entries(p.schmerzen || {}).filter(([, s]) => s === 3).map(([k]) => T.GELENKE[k]);
  if (stark.length) w.push({ stufe: "warn", text: `Starke Schmerzen (${stark.join(", ")}): Lass das bitte ärztlich abklären. Der Plan lässt belastende Übungen weg.` });
  if ((p.schlaf || 7) < 6) w.push({ stufe: "info", text: "Unter 6 Stunden Schlaf bremsen Fettabbau und Muskelaufbau spürbar." });
  return w;
};

/* Empfehlungen für Onboarding-Vorauswahl */
R.empfZiel = (p) => {
  const kf = p.kf || 20;
  if (p.geschlecht === "m") return kf > 25 ? "abnehmen" : kf > 14 ? "recomp" : "muskel";
  return kf > 33 ? "abnehmen" : kf > 22 ? "recomp" : "muskel";
};
R.zielPasstNicht = (p, ziel) => {
  const kf = p.kf || 20, m = p.geschlecht === "m";
  if (ziel === "muskel" && kf > (m ? 22 : 32)) return "Bei Deinem Körperfett baust Du mit Überschuss vor allem Fett mit auf.";
  if ((ziel === "abnehmen") && kf < (m ? 11 : 19)) return "Du bist schon schlank – weiteres Abnehmen kostet eher Muskeln.";
  return null;
};
R.empfFrequenz = (p) => {
  const lv = p.level;
  if (lv === "neuling") return 3;
  if (lv === "wieder" || lv === "anfaenger") return 3;
  return p.ziel === "muskel" || p.ziel === "recomp" ? 4 : 4;
};
R.empfSplit = (freq, lv) => {
  if (freq <= 3) return (lv === "durchschnitt" || lv === "fortgeschritten" || lv === "elite") && freq === 3 ? "ppl" : "ganz";
  if (freq === 4) return "ul";
  if (freq === 5) return lv === "neuling" || lv === "anfaenger" ? "ul" : "ppl";
  return "ppl";
};
R.empfDauer = (p) => (p.level === "neuling" ? 50 : p.frequenz >= 5 ? 60 : 70);

/* Kraft: geschätztes 1-Wiederholungs-Maximum (Epley) */
R.e1rm = (kg, wdh) => wdh <= 1 ? kg : kg * (1 + wdh / 30);
R.gewichtFuerWdh = (e1rm, wdh) => e1rm / (1 + wdh / 30);
