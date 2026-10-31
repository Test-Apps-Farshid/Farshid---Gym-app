/* =====================================================================
   APP – Navigation, Heute, Trainingsplan, Übungsbibliothek,
   Einstellungen, KI-Coach
   ===================================================================== */
window.App = {};
App.aktTab = "heute";

App.p = () => S.d.profil;
App.kal = () => R.kalorienziel(S.d.profil);
App.trainTage = () => (S.d.plan?.tage || []).map(t => t.wtag);
App.tagFuer = (wtag) => (S.d.plan?.tage || []).find(t => t.wtag === wtag);
App.woche = () => S.d.plan ? P.aktuelleWoche(S.d.plan) : 1;

App.ICONS = {
  heute: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  training: "M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12",
  essen: "M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 3c-2 2-3 4-3 7h3v11",
  fortschritt: "M4 19l5-6 4 3 7-9M15 7h5v5",
  mehr: "M5 12h.01M12 12h.01M19 12h.01"
};

App.start = () => {
  if (!S.d.profil) return OB.start();
  if (S.d.laufend) return TR.fortsetzen();
  const w = U.$("#app");
  w.className = "modus-app";
  w.innerHTML = `<main id="ansicht" class="ansicht"></main>
    <nav class="tabbar" aria-label="Hauptmenü">${[["heute", "Heute"], ["training", "Training"], ["essen", "Ernährung"], ["fortschritt", "Fortschritt"], ["mehr", "Mehr"]]
      .map(([k, n]) => `<button data-tab="${k}" class="${App.aktTab === k ? "an" : ""}"><svg viewBox="0 0 24 24"><path d="${App.ICONS[k]}"/></svg><span>${n}</span></button>`).join("")}</nav>`;
  U.$$(".tabbar button").forEach(b => b.onclick = () => App.tab(b.dataset.tab));
  App.tab(App.aktTab);
};

App.tab = (t) => {
  App.aktTab = t;
  U.$$(".tabbar button").forEach(b => b.classList.toggle("an", b.dataset.tab === t));
  const v = U.$("#ansicht"); if (!v) return;
  v.scrollTop = 0;
  ({ heute: App.heute, training: App.training, essen: ES.ansicht, fortschritt: FS.ansicht, mehr: App.mehr })[t](v);
};
App.neu = () => App.tab(App.aktTab);

/* ---------- HEUTE ---------- */
App.heute = (v) => {
  const p = App.p(), plan = S.d.plan, woche = App.woche(), wi = P.wocheInfo(plan, woche);
  const wt = U.wtag(), tag = App.tagFuer(wt);
  const kal = App.kal(), train = !!tag;
  const zielK = train ? kal.train : kal.ruhe, mk = R.makros(p, zielK, train);
  const ess = ES.tagDaten(U.heuteKey()), summe = ES.summe(ess);
  const erledigtHeute = S.d.log.some(l => U.datumKey(l.datum) === U.heuteKey());
  const naechster = (() => { for (let i = 1; i <= 7; i++) { const t = App.tagFuer((wt + i) % 7); if (t) return { t, in: i }; } })();
  const letzterCheck = S.d.checkins[S.d.checkins.length - 1];
  const checkFaellig = !letzterCheck || Date.now() - letzterCheck.datum > 6.5 * 864e5;
  const letzteAbfrage = S.d.abfragen[S.d.abfragen.length - 1];
  const abfrageFaellig = S.d.log.length >= 2 && (!letzteAbfrage || Date.now() - letzteAbfrage.datum > 6.5 * 864e5);
  const hinweise = App.hinweise();
  const wochenLog = S.d.log.filter(l => l.datum >= P.wochenStart());
  const gruss = (() => { const h = new Date().getHours(); return h < 11 ? "Guten Morgen" : h < 18 ? "Hallo" : "Guten Abend"; })();

  v.innerHTML = `<header class="kopf"><div><p class="kopf-datum">${U.TAGE_LANG[wt]}, ${new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long" })}</p>
      <h1 class="kopf-titel">${gruss}</h1></div>${S.d.einst.apiKey ? `<button class="rund-knopf" id="coach-k" aria-label="Coach fragen"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg></button>` : ""}</header>
    <div class="wochenband ${wi.deload ? "deload" : ""}"><b>Woche ${woche}/${plan.wochen}</b><span>${wi.deload ? "Deload" : "RIR " + wi.rir}</span></div>
    ${hinweise}
    <section class="heute-karte ${train ? "f-" + T.TAGFARBE[tag.typ] : "ruhe"}">
      ${train ? `<p class="hk-label">${erledigtHeute ? "Erledigt" : "Heutiges Training"}</p><h2 class="hk-titel">${tag.name}</h2>
        <p class="hk-meta">${tag.dauer} Min. · ${tag.uebungen.length} Übungen${tag.cardio ? ` · ${tag.cardio.min} Min. Cardio` : ""}</p>
        <div class="chips klein">${[...new Set(tag.uebungen.map(e => e.muskel))].map(m => `<span class="chip">${T.MUSKELN[m].name}</span>`).join("")}</div>
        <button class="knopf haupt voll gross" id="start">${erledigtHeute ? "Noch einmal trainieren" : "Training starten"}</button>`
      : `<p class="hk-label">Ruhetag</p><h2 class="hk-titel">Erholen und bewegen</h2>
        <p class="hk-meta">Ziel heute: ${U.zahl(R.schrittziel(p))} Schritte. Muskeln wachsen in der Pause.</p>
        ${naechster ? `<p class="hk-meta">Nächstes Training: <b>${naechster.t.name}</b> ${naechster.in === 1 ? "morgen" : `am ${U.TAGE_LANG[naechster.t.wtag]}`}</p>` : ""}
        <button class="knopf zweit voll" id="start-trotzdem">Trotzdem trainieren</button>`}
    </section>
    <section class="block"><div class="block-kopf"><h2>Ernährung heute</h2><button class="link-knopf" data-tab="essen">Öffnen</button></div>
      <div class="heute-essen">${U.ring(summe.kcal, zielK, { gross: 128, dicke: 12, text: U.zahl(Math.max(0, zielK - summe.kcal)), unter: "kcal übrig" })}
        <div class="makro-liste">${ES.makroBalken("Eiweiß", summe.p, mk.protein)}${ES.makroBalken("Kohlenhydrate", summe.k, mk.kh)}${ES.makroBalken("Fett", summe.f, mk.fett)}</div></div>
      <div class="wasser-zeile"><div><b>${U.zahl((ess.wasser || 0) / 1000, 2).replace(/0$/, "")} / ${U.zahl(R.wasserziel(p, train) / 1000, 1)} l</b><span>Wasser</span></div>
        <div class="wasser-knoepfe"><button class="knopf klein zweit" data-w="250">+250 ml</button><button class="knopf klein zweit" data-w="500">+500 ml</button></div></div>
    </section>
    <section class="block ziele-raster">
      <div><b>${U.zahl(R.schrittziel(p))}</b><span>Schritte</span></div>
      <div><b>${R.schlafziel(p)}</b><span>Schlaf</span></div>
      <div><b>${wochenLog.length}/${plan.tage.length}</b><span>Trainings diese Woche</span></div>
    </section>
    <section class="block"><div class="woche-streifen">${U.TAGE.map((t, i) => {
      const pt = App.tagFuer(i), tagDatum = new Date(P.wochenStart() + i * 864e5);
      const done = S.d.log.some(l => U.datumKey(l.datum) === U.datumKey(tagDatum));
      return `<div class="ws-tag ${i === wt ? "heute" : ""} ${pt ? "f-" + T.TAGFARBE[pt.typ] : ""} ${done ? "fertig" : ""}"><span>${t}</span><i></i></div>`; }).join("")}</div></section>
    ${checkFaellig ? `<button class="aufgabe" id="checkin-k"><b>Wöchentliches Check-in</b><span>Gewicht, Maße, Foto – damit sich der Plan anpasst.</span></button>` : ""}
    ${abfrageFaellig ? `<button class="aufgabe" id="abfrage-k"><b>Kurze Ernährungs-Abfrage</b><span>Drei Fragen zu Hunger, Plan und Energie.</span></button>` : ""}`;

  U.$("#start")?.addEventListener("click", () => TR.starten(tag));
  U.$("#start-trotzdem")?.addEventListener("click", () => App.tagWaehlen());
  U.$("#coach-k")?.addEventListener("click", () => App.coach());
  U.$("#checkin-k")?.addEventListener("click", () => FS.checkin());
  U.$("#abfrage-k")?.addEventListener("click", () => ES.abfrage());
  U.$$("[data-tab]", v).forEach(b => b.onclick = () => App.tab(b.dataset.tab));
  U.$$("[data-w]", v).forEach(b => b.onclick = () => { ES.wasser(+b.dataset.w); App.neu(); });
  U.$$("[data-hinweis-weg]", v).forEach(b => b.onclick = () => { S.d.hinweisWeg = S.d.hinweisWeg || {}; S.d.hinweisWeg[b.dataset.hinweisWeg] = Date.now(); S.speichern(); App.neu(); });
  U.$$("[data-deload]", v).forEach(b => b.onclick = () => { S.d.plan.extraDeload = App.woche(); S.speichern(); U.toast("Diese Woche trainierst Du leichter."); App.neu(); });
};

/* Hinweise und Warnungen auf der Startseite */
App.hinweise = () => {
  const weg = S.d.hinweisWeg || {}, h = [];
  const letzte = S.d.log.slice(-3);
  const stark = letzte.flatMap(l => l.uebungen.filter(e => e.schmerz === "stark").map(e => e.schmerzStelle)).filter(Boolean);
  if (stark.length && !weg.schmerz) h.push(["schmerz", "warn", `Du hast starke Schmerzen gemeldet (${[...new Set(stark)].map(g => T.GELENKE[g] || g).join(", ")}). Bitte lass das ärztlich abklären. Belastende Übungen sind aus dem Plan genommen.`]);
  const muede = letzte.filter(l => l.energie === "niedrig" && (l.schlaf === "schlecht" || l.kater === "stark")).length;
  if (muede >= 2 && !weg.muede && S.d.plan.extraDeload !== App.woche())
    h.push(["muede", "info", `Wenig Energie, schlechter Schlaf oder starker Muskelkater in mehreren Einheiten. Eine leichtere Woche hilft. <button class="link-knopf" data-deload>Diese Woche leichter</button>`]);
  const schwindel = (S.d.checkins.slice(-1)[0] || {}).schwindel;
  if (schwindel && !weg.schwindel) h.push(["schwindel", "warn", "Du hast Schwindel angegeben. Iss heute auf Erhaltungsniveau, trink ausreichend und sprich mit einer Ärztin oder einem Arzt, wenn es anhält."]);
  return h.map(([id, st, t]) => `<div class="hinweis ${st}"><span>${t}</span><button class="x-knopf" data-hinweis-weg="${id}" aria-label="Ausblenden">×</button></div>`).join("");
};

App.tagWaehlen = () => {
  const s = U.sheet(`<h3 class="sheet-titel">Welches Training?</h3><div class="wahl-liste">${S.d.plan.tage.map((t, i) => `<button class="wahl" data-i="${i}"><span class="wahl-text"><span class="wahl-titel">${t.name}</span><span class="wahl-info">${U.TAGE_LANG[t.wtag]} · ${t.dauer} Min.</span></span></button>`).join("")}</div>`);
  U.$$("[data-i]", s).forEach(b => b.onclick = () => { s.zu(); TR.starten(S.d.plan.tage[+b.dataset.i]); });
};

/* ---------- TRAININGSPLAN ---------- */
App.training = (v) => {
  const p = App.p(), plan = S.d.plan, woche = App.woche(), wi = P.wocheInfo(plan, woche);
  const deload = wi.deload || plan.extraDeload === woche;
  v.innerHTML = `<header class="kopf"><div><p class="kopf-datum">${T.SPLITS[plan.split].name} · ${plan.wochen} Wochen</p><h1 class="kopf-titel">Dein Plan</h1></div></header>
    <div class="meso">${Array.from({ length: plan.wochen }, (_, i) => `<span class="${i + 1 < woche ? "vorbei" : i + 1 === woche ? "jetzt" : ""} ${i + 1 === plan.wochen ? "dl" : ""}">${i + 1}</span>`).join("")}</div>
    <p class="hinweis klein">${deload && !wi.deload ? "Leichtere Woche auf Deinen Wunsch: weniger Sätze, mehr Reserve." : wi.text}</p>
    <div class="plan-tage">${plan.tage.map((t, ti) => `<details class="plan-tag f-${T.TAGFARBE[t.typ]}" ${t.wtag === U.wtag() ? "open" : ""}>
      <summary><span class="pt-tag">${U.TAGE[t.wtag]}</span><span class="pt-name">${t.name}</span><span class="pt-dauer">${t.dauer} Min.</span></summary>
      <div class="pt-inhalt">
        <p class="pt-abschnitt">Aufwärmen: ${t.aufwaermen.map(id => UEB[id].name).join(", ")}</p>
        ${t.uebungen.map(e => { const u = UEB[e.id], k = S.d.kraft[e.id];
          return `<div class="pt-ue" data-t="${ti}" data-uid="${e.uid}"><div class="pt-bild">${U.uebungBild(u)}</div>
          <div class="pt-text"><b>${u.name}</b><span>${deload ? P.saetzeInWoche(e, plan, plan.wochen) : e.saetze} × ${e.sek ? `${e.lo}–${e.hi} s` : `${e.lo}–${e.hi}`} · ${e.pause} s Pause · ${k ? U.kg(k.kg) : P.koerpergewicht(u) ? "Körpergewicht" : "Einstufung"}</span></div>
          <button class="mini-knopf" data-ersetzen aria-label="Übung ersetzen"><svg viewBox="0 0 24 24"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg></button></div>`; }).join("")}
        ${t.cardio ? `<p class="pt-abschnitt">Cardio-Finisher: ${UEB[t.cardio.id].name}, ${t.cardio.min} Min.</p>` : ""}
        <p class="pt-abschnitt">Dehnen: ${t.dehnen.map(id => UEB[id].name).join(", ")}</p>
        <button class="knopf zweit voll" data-start="${ti}">Dieses Training starten</button>
      </div></details>`).join("")}</div>
    <div class="knopf-gitter">
      <button class="knopf zweit" id="tage-k">Tage verschieben</button>
      <button class="knopf zweit" id="dauer-k">Dauer ändern</button>
      <button class="knopf zweit" id="bib-k">Übungsbibliothek</button>
      <button class="knopf zweit" id="neu-k">Plan neu würfeln</button>
    </div>`;
  U.$$("[data-start]", v).forEach(b => b.onclick = () => TR.starten(plan.tage[+b.dataset.start]));
  U.$$(".pt-ue", v).forEach(z => {
    z.querySelector("[data-ersetzen]").onclick = (ev) => { ev.stopPropagation(); App.ersetzenSheet(plan.tage[+z.dataset.t], z.dataset.uid, () => App.neu()); };
    z.querySelector(".pt-text").onclick = () => App.uebungInfo(plan.tage[+z.dataset.t].uebungen.find(e => e.uid === z.dataset.uid).id);
  });
  U.$("#tage-k").onclick = () => App.tageSheet();
  U.$("#dauer-k").onclick = () => App.dauerSheet();
  U.$("#bib-k").onclick = () => App.bibliothek();
  U.$("#neu-k").onclick = async () => {
    if (!await U.bestaetigen("Neue Übungsauswahl erzeugen? Deine Gewichte bleiben gespeichert.", "Neu würfeln")) return;
    p.planSaat = (p.planSaat || 0) + 1; App.planNeu(true); U.toast("Neuer Plan erstellt"); App.neu();
  };
};

/* Plan neu berechnen (Start der Woche bleibt erhalten) */
App.planNeu = (variation) => {
  const p = App.p(), alt = S.d.plan;
  if (variation) {   // Kandidaten-Reihenfolge leicht variieren
    const orig = P.waehle;
    P.waehle = (kand, pp, bev, amTag, genutzt, versatz) => orig(kand, pp, bev, amTag, genutzt, versatz + (p.planSaat || 0) * 7);
    S.d.plan = P.erstellen(p); P.waehle = orig;
  } else S.d.plan = P.erstellen(p);
  if (alt) { S.d.plan.start = alt.start; S.d.plan.extraDeload = alt.extraDeload; }
  S.speichern();
};

App.ersetzenSheet = (tag, uid, fertig, imTraining) => {
  const e = tag.uebungen.find(x => x.uid === uid) || tag;
  const alt = P.alternativen(e.id, App.p());
  const s = U.sheet(`<h3 class="sheet-titel">${UEB[e.id].name} ersetzen</h3><p class="klein">Alternativen für ${T.MUSKELN[UEB[e.id].muskel].name} mit Deinem Equipment.</p>
    <div class="alt-liste">${alt.length ? alt.map(u => `<button class="alt" data-id="${u.id}"><div class="alt-bild">${U.uebungBild(u)}</div><span><b>${u.name}</b><small>${u.geraet.filter(g => g !== "mt").map(g => T.GERAETE[g].name).join(", ")}</small></span></button>`).join("") : `<p class="gedimmt">Keine passende Alternative mit Deinem Equipment.</p>`}</div>
    ${imTraining ? "" : `<label class="schalter-zeile"><span>Dauerhaft im Plan ersetzen</span><input type="checkbox" class="schalter" id="dauerhaft" checked></label>`}`, { klasse: "hoch" });
  U.$$(".alt", s).forEach(b => b.onclick = () => {
    const neu = UEB[b.dataset.id], r = P.repBereich(neu, App.p());
    Object.assign(e, { id: neu.id, lo: r.lo, hi: r.hi, sek: !!r.sek, pause: P.pause(neu, App.p()), tempo: P.tempo(neu) });
    S.speichern(); s.zu(); U.toast(`Ersetzt durch ${neu.name}`); fertig && fertig(neu);
  });
};

App.tageSheet = () => {
  const p = App.p(), plan = S.d.plan; let auswahl = null;
  const s = U.sheet(`<h3 class="sheet-titel">Tage verschieben</h3><p class="klein">Tippe zwei Tage nacheinander an, um sie zu tauschen.</p><div class="kapseln" id="ks"></div>`);
  const zeichnen = () => {
    U.$("#ks", s).innerHTML = U.TAGE.map((t, i) => { const pt = plan.tage.find(x => x.wtag === i);
      return `<button class="kapsel ${pt ? "f-" + T.TAGFARBE[pt.typ] : "frei"} ${auswahl === i ? "gewaehlt" : ""}" data-t="${i}"><span class="k-tag">${t}</span><span class="k-typ">${pt ? pt.name.replace("körper", ".") : "Ruhe"}</span></button>`; }).join("");
    U.$$(".kapsel", s).forEach(k => k.onclick = () => {
      const t = +k.dataset.t;
      if (auswahl === null) auswahl = t;
      else if (auswahl !== t) {
        const a = plan.tage.find(x => x.wtag === auswahl), b = plan.tage.find(x => x.wtag === t);
        if (a) a.wtag = t; if (b) b.wtag = auswahl;
        plan.tage.sort((x, y) => x.wtag - y.wtag);
        p.tage = plan.tage.map(x => x.wtag);
        S.speichern(); auswahl = null; U.vib([8, 40, 8]); App.neu();
      } else auswahl = null;
      zeichnen();
    });
  };
  zeichnen();
};

App.dauerSheet = () => {
  const p = App.p();
  const s = U.sheet(`<h3 class="sheet-titel">Dauer pro Einheit</h3><div class="gross-zahl"><span id="dz">${p.dauer}</span> <small>Min.</small></div>
    <input type="range" min="30" max="120" step="5" value="${p.dauer}" class="regler" id="dr"><button class="knopf haupt voll" id="dok">Plan anpassen</button>`);
  U.$("#dr", s).oninput = (e) => U.$("#dz", s).textContent = e.target.value;
  U.$("#dok", s).onclick = () => { p.dauer = +U.$("#dr", s).value; App.planNeu(); s.zu(); U.toast("Plan angepasst"); App.neu(); };
};

/* ---------- Übungsbibliothek und Details ---------- */
App.bibliothek = () => {
  let filter = "", muskel = "";
  const s = U.sheet(`<h3 class="sheet-titel">Übungsbibliothek</h3><input type="search" class="suche" placeholder="Übung suchen" id="bs">
    <div class="chips scroll" id="bm"><button class="chip an" data-m="">Alle</button>${Object.entries(T.MUSKELN).map(([k, m]) => `<button class="chip" data-m="${k}">${m.name}</button>`).join("")}<button class="chip" data-m="cardio">Cardio</button></div>
    <div id="bl" class="bib-liste"></div>`, { klasse: "voll" });
  const liste = () => {
    const f = filter.toLowerCase();
    const l = UEBUNGEN.filter(u => (!muskel || u.muskel === muskel) && (!f || u.name.toLowerCase().includes(f)));
    U.$("#bl", s).innerHTML = `<p class="klein gedimmt">${l.length} Übungen</p>` + l.map(u => `<button class="alt" data-id="${u.id}"><div class="alt-bild">${U.uebungBild(u)}</div>
      <span><b>${u.name}</b><small>${T.MUSKELN[u.muskel]?.name || "Cardio"} · ${["", "leicht", "mittel", "schwer"][u.level]}${P.verfuegbar(u, App.p()) ? "" : " · Gerät fehlt"}</small></span></button>`).join("");
    U.$$(".alt", s).forEach(b => b.onclick = () => App.uebungInfo(b.dataset.id));
  };
  U.$("#bs", s).oninput = (e) => { filter = e.target.value; liste(); };
  U.$$("#bm .chip", s).forEach(c => c.onclick = () => { muskel = c.dataset.m; U.$$("#bm .chip", s).forEach(x => x.classList.toggle("an", x === c)); liste(); });
  liste();
};

App.uebungInfo = (id) => {
  const u = UEB[id]; if (!u) return;
  const k = S.d.kraft[id];
  const gel = Object.entries(u.gelenke).map(([g, l]) => `${T.GELENKE[g]} (${l === 2 ? "hoch" : "gering"})`).join(", ");
  U.sheet(`${U.uebungBild(u, true)}<h3 class="sheet-titel">${u.name}</h3>
    <div class="chips klein"><span class="chip an">${T.MUSKELN[u.muskel]?.name || "Cardio"}</span>${u.sekundaer.map(m => `<span class="chip">${T.MUSKELN[m]?.name || m}</span>`).join("")}</div>
    <div class="geraete-zeile">${u.geraet.filter(g => g !== "mt").map(g => `<span>${U.geraetSymbol(g)}${T.GERAETE[g].name}</span>`).join("")}</div>
    <div class="info-block"><h4>So geht's</h4><p>${u.tipp}</p></div>
    <div class="info-block warnfarbe"><h4>Häufiger Fehler</h4><p>${u.fehler}</p></div>
    <p class="klein gedimmt">Schwierigkeit: ${["", "leicht", "mittel", "schwer"][u.level]}${gel ? ` · Gelenkbelastung: ${gel}` : ""}</p>
    ${k ? `<p class="klein">Aktuell: <b>${U.kg(k.kg)}</b>, Bestwert (geschätztes Maximum): <b>${U.kg(Math.max(0, ...k.verlauf.map(v => v.e1 || 0)))}</b></p>` : ""}
    <p class="quelle">Bild: free-exercise-db (gemeinfrei)</p>`, { klasse: "hoch" });
};

/* ---------- MEHR: Einstellungen ---------- */
App.mehr = (v) => {
  const e = S.d.einst, p = App.p();
  v.innerHTML = `<header class="kopf"><div><h1 class="kopf-titel">Mehr</h1></div></header>
    <button class="coach-banner" id="coach-o"><b>Frag Deinen Coach</b><span>${e.apiKey ? "KI-Coach mit Deinem Profil und Plan" : "Optional: mit eigenem Claude-API-Schlüssel"}</span></button>
    <section class="liste-block"><h2>Profil und Plan</h2>
      <button class="zeile" id="m-profil"><span>Profil und Ziele ändern</span><small>Plan wird neu berechnet</small></button>
      <button class="zeile" id="m-eq"><span>Equipment</span><small>${p.geraete.length} Geräte</small></button>
      <button class="zeile" id="m-schmerz"><span>Schmerzen und Verletzungen</span><small>${Object.keys(p.schmerzen).length || "Keine"}</small></button>
      <button class="zeile" id="m-bib"><span>Übungsbibliothek</span><small>${UEBUNGEN.length} Übungen</small></button></section>
    <section class="liste-block"><h2>Training</h2>
      <label class="zeile"><span>Einheit für Gewichte</span><select id="m-einheit"><option value="kg" ${e.einheit === "kg" ? "selected" : ""}>Kilogramm</option><option value="lb" ${e.einheit === "lb" ? "selected" : ""}>Pfund</option></select></label>
      <label class="zeile"><span>Ton bei Pausenende</span><input type="checkbox" class="schalter" id="m-ton" ${e.ton ? "checked" : ""}></label>
      <label class="zeile"><span>Pausen-Erinnerung</span><input type="checkbox" class="schalter" id="m-erin" ${e.pauseErinnerung ? "checked" : ""}></label>
      <label class="zeile"><span>Pause Grundübungen</span><select id="m-pg">${[60, 90, 120, 150, 180].map(s => `<option ${(p.pauseGrund || 120) === s ? "selected" : ""} value="${s}">${s} s</option>`).join("")}</select></label>
      <label class="zeile"><span>Pause Isolationsübungen</span><select id="m-pi">${[45, 60, 75, 90].map(s => `<option ${(p.pauseIso || 75) === s ? "selected" : ""} value="${s}">${s} s</option>`).join("")}</select></label></section>
    <section class="liste-block"><h2>Darstellung</h2>
      <label class="zeile"><span>Helles Design</span><input type="checkbox" class="schalter" id="m-hell" ${e.thema === "hell" ? "checked" : ""}></label></section>
    <section class="liste-block"><h2>KI-Coach (optional)</h2>
      <label class="zeile senk"><span>Claude-API-Schlüssel</span><input type="password" id="m-key" value="${U.esc(e.apiKey)}" placeholder="sk-ant-…" autocomplete="off"></label>
      <label class="zeile senk"><span>Modell</span><input type="text" id="m-modell" value="${U.esc(e.modell)}"></label>
      <p class="klein gedimmt pad">Der Schlüssel bleibt nur auf diesem Gerät und wird ausschließlich an die Anthropic-API gesendet, wenn Du den Coach nutzt. Er wird nicht exportiert.</p></section>
    <section class="liste-block"><h2>Daten</h2>
      <button class="zeile" id="m-export"><span>Daten exportieren</span><small>JSON-Datei inkl. Fotos</small></button>
      <label class="zeile" for="m-import"><span>Daten importieren</span><small>Sicherung laden</small></label><input type="file" id="m-import" accept="application/json,.json" hidden>
      <button class="zeile rot" id="m-loeschen"><span>Alle Daten löschen</span></button></section>
    <section class="liste-block"><h2>Hilfe</h2>
      <button class="zeile" id="m-install"><span>App auf dem iPhone installieren</span></button></section>
    <p class="klein gedimmt pad">${T.HINWEIS}</p>
    <p class="klein gedimmt pad">Formwerk · Version ${window.APP_VERSION} · Übungsbilder: free-exercise-db (gemeinfrei)</p>`;
  U.$("#coach-o").onclick = () => App.coach();
  U.$("#m-profil").onclick = () => OB.start(true);
  U.$("#m-eq").onclick = () => OB.equipmentSheet(p, () => { App.planNeu(); U.toast("Plan an Equipment angepasst"); App.neu(); });
  U.$("#m-schmerz").onclick = () => { OB.start(true); OB.i = OB.SCHRITTE.findIndex(s => s.id === "schmerzen"); OB.zeigen(); };
  U.$("#m-bib").onclick = () => App.bibliothek();
  U.$("#m-einheit").onchange = (ev) => { e.einheit = ev.target.value; S.speichern(); };
  U.$("#m-ton").onchange = (ev) => { e.ton = ev.target.checked; S.speichern(); U.audioAn(); U.piep([[880, 0.1]]); };
  U.$("#m-erin").onchange = async (ev) => { e.pauseErinnerung = ev.target.checked; if (e.pauseErinnerung) await U.erlaubnisAnfragen(); S.speichern(); };
  U.$("#m-pg").onchange = (ev) => { p.pauseGrund = +ev.target.value; App.pausenSetzen(); };
  U.$("#m-pi").onchange = (ev) => { p.pauseIso = +ev.target.value; App.pausenSetzen(); };
  U.$("#m-hell").onchange = (ev) => { e.thema = ev.target.checked ? "hell" : "dunkel"; App.thema(); S.speichern(); };
  U.$("#m-key").onchange = (ev) => { e.apiKey = ev.target.value.trim(); S.speichern(); U.toast(e.apiKey ? "Schlüssel gespeichert" : "Schlüssel entfernt"); };
  U.$("#m-modell").onchange = (ev) => { e.modell = ev.target.value.trim() || "claude-sonnet-5-5"; S.speichern(); };
  U.$("#m-export").onclick = () => S.exportieren();
  U.$("#m-import").onchange = async (ev) => {
    const f = ev.target.files[0]; if (!f) return;
    if (!await U.bestaetigen("Sicherung laden? Die aktuellen Daten auf diesem Gerät werden ersetzt.", "Laden")) return;
    try { await S.importieren(f); U.toast("Daten geladen"); App.thema(); App.start(); } catch (err) { U.toast(err.message || "Datei konnte nicht gelesen werden."); }
  };
  U.$("#m-loeschen").onclick = async () => {
    if (!await U.bestaetigen("Wirklich alle Daten löschen? Das lässt sich nicht rückgängig machen. Exportiere vorher eine Sicherung.", "Alles löschen")) return;
    await S.allesLoeschen(); location.reload();
  };
  U.$("#m-install").onclick = () => App.installHilfe();
};

App.pausenSetzen = () => {
  const p = App.p();
  S.d.plan.tage.forEach(t => t.uebungen.forEach(e => e.pause = P.pause(UEB[e.id], p)));
  S.speichern(); U.toast("Pausenzeiten übernommen");
};

App.thema = () => document.documentElement.dataset.thema = S.d.einst.thema;

App.installHilfe = () => U.sheet(`<h3 class="sheet-titel">Auf dem iPhone installieren</h3>
  <ol class="schritte"><li>Öffne die Adresse der App in <b>Safari</b>.</li><li>Tippe unten auf <b>Teilen</b> (Quadrat mit Pfeil nach oben).</li>
  <li>Wähle <b>Zum Home-Bildschirm</b> und tippe auf <b>Hinzufügen</b>.</li><li>Starte Formwerk ab jetzt über das Symbol – im Vollbild und auch ohne Internet.</li></ol>
  <p class="klein">Wichtig: Die installierte App hat ihren eigenen Speicher. Daten aus dem Safari-Tab werden nicht übernommen – exportiere sie vorher und importiere sie in der App.</p>
  ${U.istInstalliert() ? `<p class="hinweis">Du nutzt die App bereits installiert.</p>` : ""}`);

/* ---------- KI-COACH ---------- */
App.coachKontext = () => {
  const p = App.p(), kal = App.kal(), plan = S.d.plan, w = App.woche();
  const heute = App.tagFuer(U.wtag());
  const kraft = Object.entries(S.d.kraft).slice(0, 25).map(([id, k]) => `${UEB[id]?.name}: ${k.kg} kg`).join("; ");
  const check = S.d.checkins.slice(-4).map(c => `${U.datumKurz(c.datum)}: ${c.gewicht} kg${c.taille ? ", Taille " + c.taille + " cm" : ""}`).join("; ");
  return `Du bist ein erfahrener, ehrlicher Fitness- und Ernährungscoach in der App "Formwerk". Antworte auf Deutsch, duze den Nutzer, kurz und konkret.
Gib keine medizinischen Diagnosen; bei Schmerzen, Schwindel oder Krankheit verweise auf ärztlichen Rat. Empfiehl keine extremen Diäten (nie unter ${kal.grenze} kcal).
Wenn Du Übungen ersetzt, nutze nur dieses Equipment: ${p.geraete.map(g => T.GERAETE[g].name).join(", ")}, Körpergewicht.
PROFIL: ${p.geschlecht === "m" ? "männlich" : "weiblich"}, ${R.alter(p.geburt)} Jahre, ${p.groesse} cm, ${p.gewicht} kg, ca. ${p.kf} % Körperfett. Ziel: ${T.ZIELE[p.ziel].name}. Fokus: ${p.fokus.map(m => T.MUSKELN[m].name).join(", ")}.
Level: ${T.LEVEL.find(l => l.id === p.level).name}. Beschwerden: ${Object.entries(p.schmerzen).map(([g, s]) => T.GELENKE[g] + " " + ["", "leicht", "mittel", "stark"][s]).join(", ") || "keine"}.
Ernährung: ${T.ERNAEHRUNGSFORM[p.ern.form]}, Allergien: ${p.ern.allergien.map(a => T.ALLERGENE[a]).join(", ") || "keine"}, mag nicht: ${p.ern.nichtMag || "–"}.
ZIELE: ${kal.train} kcal an Trainingstagen, ${kal.ruhe} kcal an Ruhetagen, Eiweiß ${R.makros(p, kal.ziel, false).protein} g.
PLAN: ${T.SPLITS[plan.split].name}, ${p.frequenz}×/Woche, ${p.dauer} Min., Woche ${w}/${plan.wochen}. Heute: ${heute ? heute.name + " – " + heute.uebungen.map(e => UEB[e.id].name).join(", ") : "Ruhetag"}.
KRAFT: ${kraft || "noch keine Daten"}. CHECK-INS: ${check || "keine"}. Trainings bisher: ${S.d.log.length}.`;
};

App.coach = () => {
  const e = S.d.einst;
  if (!e.apiKey) {
    const s = U.sheet(`<h3 class="sheet-titel">KI-Coach einrichten</h3><p>Der Coach läuft über die Claude-API von Anthropic. Du brauchst dafür einen eigenen API-Schlüssel (console.anthropic.com). Die Nutzung kostet je nach Umfang ein paar Cent.</p>
      <p class="klein gedimmt">Ohne Schlüssel funktioniert die App vollständig – der Coach ist nur eine Zusatzfunktion.</p>
      <label class="feld"><span>API-Schlüssel</span><input type="password" id="ck" placeholder="sk-ant-…" autocomplete="off"></label>
      <button class="knopf haupt voll" id="cok">Speichern</button>`);
    U.$("#cok", s).onclick = () => { e.apiKey = U.$("#ck", s).value.trim(); S.speichern(); s.zu(); if (e.apiKey) App.coach(); };
    return;
  }
  const s = U.sheet(`<div class="coach"><h3 class="sheet-titel">Dein Coach</h3><div class="chat" id="chat"></div>
    <div class="chat-vorschlaege">${["Erklär mir die heutige erste Übung", "Ersatz für Bankdrücken – Schulter zwickt", "Was esse ich vor dem Training?", "Warum stagniert mein Gewicht?"].map(t => `<button class="chip">${t}</button>`).join("")}</div>
    <div class="chat-eingabe"><textarea id="ce" rows="1" placeholder="Frag etwas …"></textarea><button class="knopf haupt" id="cs" aria-label="Senden">Senden</button></div>
    <button class="link-knopf klein" id="cl">Verlauf löschen</button></div>`, { klasse: "voll" });
  const chat = U.$("#chat", s);
  const zeichnen = () => {
    chat.innerHTML = S.d.coach.length ? S.d.coach.map(m => `<div class="msg ${m.role}">${App.md(m.content)}</div>`).join("") : `<p class="gedimmt">Der Coach kennt Dein Profil, Deinen Plan und Deine Fortschritte.</p>`;
    chat.scrollTop = chat.scrollHeight;
  };
  zeichnen();
  const senden = async (text) => {
    text = text.trim(); if (!text) return;
    S.d.coach.push({ role: "user", content: text }); zeichnen();
    U.$("#ce", s).value = "";
    chat.insertAdjacentHTML("beforeend", `<div class="msg assistant tippt"><i></i><i></i><i></i></div>`); chat.scrollTop = chat.scrollHeight;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": e.apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: e.modell, max_tokens: 1000, system: App.coachKontext(), messages: S.d.coach.slice(-16) })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message || `Fehler ${r.status}`);
      S.d.coach.push({ role: "assistant", content: j.content.filter(c => c.type === "text").map(c => c.text).join("\n") });
    } catch (err) {
      S.d.coach.pop();
      U.toast(navigator.onLine ? `Coach nicht erreichbar: ${err.message}` : "Keine Internetverbindung – der Coach braucht Internet.");
    }
    S.speichern(); zeichnen();
  };
  U.$("#cs", s).onclick = () => senden(U.$("#ce", s).value);
  U.$$(".chat-vorschlaege .chip", s).forEach(c => c.onclick = () => senden(c.textContent));
  U.$("#cl", s).onclick = () => { S.d.coach = []; S.speichern(); zeichnen(); };
};
/* Minimales Markdown für Coach-Antworten */
App.md = (t) => U.esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/^[-•] (.+)$/gm, "<span class='li'>$1</span>").replace(/\n/g, "<br>");

/* ---------- Abzeichen ---------- */
App.abzeichenPruefen = () => {
  const a = S.d.abzeichen, neu = [];
  const geb = (id) => { if (!a[id]) { a[id] = Date.now(); neu.push(T.ABZEICHEN.find(x => x.id === id)); } };
  const n = S.d.log.length;
  if (n >= 1) geb("erstes"); if (n >= 5) geb("fuenf"); if (n >= 20) geb("zwanzig"); if (n >= 50) geb("fuenfzig");
  if (S.d.log.some(l => l.rekorde > 0)) geb("rekord");
  const wl = S.d.log.filter(l => l.datum >= P.wochenStart());
  if (S.d.plan && wl.length >= S.d.plan.tage.length) geb("woche");
  if (S.d.checkins.filter(c => !c.start).length >= 4) geb("checkin4");
  const c0 = S.d.checkins[0], c1 = S.d.checkins[S.d.checkins.length - 1];
  if (c0 && c1 && c0.gewicht - c1.gewicht >= 2) geb("minus2");
  if (c0?.taille && c1?.taille && c0.taille - c1.taille >= 3) geb("taille");
  let tageWasser = 0; for (let i = 0; i < 7; i++) { const k = U.datumKey(Date.now() - i * 864e5); if ((S.d.essen[k]?.wasser || 0) >= R.wasserziel(App.p(), false)) tageWasser++; }
  if (tageWasser >= 7) geb("wasser");
  S.speichern();
  return neu;
};
