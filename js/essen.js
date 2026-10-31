/* =====================================================================
   ERNÄHRUNG – Tagesplan, Tracking, Wasser, Wochenplan, Einkaufsliste,
   Meal-Prep, Unterwegs, Getränke, Supplemente, Wochenabfrage
   ===================================================================== */
window.ES = {};
ES.tagIdx = null;   // angezeigter Wochentag (0 = Mo)

ES.tagDaten = (key) => S.d.essen[key] || (S.d.essen[key] = { eintraege: [], wasser: 0, gegessen: {} });
ES.summe = (t) => t.eintraege.reduce((s, e) => { s.kcal += e.kcal; s.p += e.p; s.k += e.k; s.f += e.f; return s; }, { kcal: 0, p: 0, k: 0, f: 0 });
ES.wasser = (ml) => { const t = ES.tagDaten(U.heuteKey()); t.wasser = Math.max(0, (t.wasser || 0) + ml); S.speichern(); U.vib(10); App.abzeichenPruefen(); };
ES.makroBalken = (name, ist, ziel) => `<div class="makro"><div class="makro-kopf"><span>${name}</span><b>${Math.round(ist)} / ${ziel} g</b></div>
  <div class="makro-bahn"><i style="width:${R.klemmen(ist / ziel * 100, 0, 100)}%" class="${ist > ziel * 1.1 ? "ueber" : ""}"></i></div></div>`;

/* Datum des angezeigten Wochentags in der aktuellen Woche */
ES.datumFuer = (wtag) => new Date(P.wochenStart() + wtag * 864e5);

/* Tagesplan inkl. getauschter Rezepte */
ES.plan = (wtag) => {
  const p = App.p(), plan = E.tagesplan(p, wtag, App.trainTage(), App.kal());
  const tausch = (S.d.tausch || {})[wtag] || {};
  plan.mahlzeiten = plan.mahlzeiten.map((m, i) => {
    if (!tausch[i] || m.leer) return m;
    const r = REZEPTE.find(x => x.id === tausch[i]); if (!r) return m;
    const anteil = m.n.kcal / plan.summe.kcal;
    return { typ: m.typ, ...E.skalieren(r, plan.kcal * anteil) };
  });
  plan.summe = plan.mahlzeiten.reduce((s, m) => { if (m.n) { s.kcal += m.n.kcal; s.p += m.n.p; s.k += m.n.k; s.f += m.n.f; } return s; }, { kcal: 0, p: 0, k: 0, f: 0 });
  return plan;
};

ES.ansicht = (v) => {
  const p = App.p();
  if (ES.tagIdx === null) ES.tagIdx = U.wtag();
  const wt = ES.tagIdx, datum = ES.datumFuer(wt), key = U.datumKey(datum), istHeute = key === U.heuteKey();
  const plan = ES.plan(wt), t = ES.tagDaten(key), sum = ES.summe(t);
  const mk = plan.makro;
  v.innerHTML = `<header class="kopf"><div><p class="kopf-datum">${plan.train ? "Trainingstag" : "Ruhetag"} · ${plan.kcal} kcal</p><h1 class="kopf-titel">Ernährung</h1></div>
      <button class="rund-knopf" id="e-info" aria-label="So wird gerechnet"><svg viewBox="0 0 24 24"><path d="M12 8h.01M11 12h1v5h1"/><circle cx="12" cy="12" r="9"/></svg></button></header>
    <div class="tage-wahl">${U.TAGE.map((d, i) => `<button class="${i === wt ? "an" : ""} ${App.trainTage().includes(i) ? "train" : ""}" data-d="${i}"><span>${d}</span><small>${ES.datumFuer(i).getDate()}</small></button>`).join("")}</div>
    <section class="block essen-kopf">${U.ring(sum.kcal, plan.kcal, { gross: 150, dicke: 13, text: U.zahl(sum.kcal), unter: `von ${U.zahl(plan.kcal)} kcal` })}
      <div class="makro-liste">${ES.makroBalken("Eiweiß", sum.p, mk.protein)}${ES.makroBalken("Kohlenhydrate", sum.k, mk.kh)}${ES.makroBalken("Fett", sum.f, mk.fett)}</div></section>
    <section class="block wasser"><div class="block-kopf"><h2>Wasser</h2><b>${U.zahl((t.wasser || 0) / 1000, 2).replace(/0$/, "")} / ${U.zahl(plan.wasser / 1000, 1)} l</b></div>
      <div class="glaeser">${Array.from({ length: Math.ceil(plan.wasser / 250) }, (_, i) => `<i class="${(t.wasser || 0) >= (i + 1) * 250 ? "voll" : ""}"></i>`).join("")}</div>
      <div class="knopfreihe">${istHeute ? `<button class="knopf zweit" data-w="-250">−250 ml</button><button class="knopf zweit" data-w="250">+250 ml</button><button class="knopf zweit" data-w="500">+500 ml</button>` : `<span class="klein gedimmt">Wasser trägst Du am jeweiligen Tag ein.</span>`}</div></section>
    <section class="mahlzeiten">${plan.mahlzeiten.map((m, i) => ES.mahlzeitHtml(m, i, t)).join("")}</section>
    <section class="block"><div class="block-kopf"><h2>Gegessen</h2><button class="knopf klein haupt" id="e-add">+ Erfassen</button></div>
      ${t.eintraege.length ? `<div class="eintraege">${t.eintraege.map((e, i) => `<div class="eintrag"><span><b>${U.esc(e.name)}</b><small>${e.g ? e.g + " g · " : ""}${Math.round(e.p)} E · ${Math.round(e.k)} K · ${Math.round(e.f)} F</small></span><b>${Math.round(e.kcal)}</b><button class="x-knopf" data-del="${i}" aria-label="Löschen">×</button></div>`).join("")}</div>` : `<p class="gedimmt klein">Hake eine Planmahlzeit ab oder erfasse, was Du gegessen hast.</p>`}</section>
    <div class="knopf-gitter">
      <button class="knopf zweit" id="e-woche">Wochenplan</button><button class="knopf zweit" id="e-einkauf">Einkaufsliste</button>
      <button class="knopf zweit" id="e-prep">Meal-Prep</button><button class="knopf zweit" id="e-unterwegs">Unterwegs</button>
      <button class="knopf zweit" id="e-trinken">Getränke</button><button class="knopf zweit" id="e-supps">Supplemente</button>
      <button class="knopf zweit breit" id="e-abfrage">Wöchentliche Ernährungs-Abfrage</button></div>`;

  U.$$("[data-d]", v).forEach(b => b.onclick = () => { ES.tagIdx = +b.dataset.d; App.neu(); });
  U.$$("[data-w]", v).forEach(b => b.onclick = () => { ES.wasser(+b.dataset.w); App.neu(); });
  U.$$("[data-del]", v).forEach(b => b.onclick = () => {
    const e = t.eintraege[+b.dataset.del]; if (e.slot !== undefined) delete t.gegessen[e.slot];
    t.eintraege.splice(+b.dataset.del, 1); S.speichern(); App.neu(); });
  U.$$(".mahlzeit", v).forEach(el => {
    const i = +el.dataset.i, m = plan.mahlzeiten[i];
    U.$("[data-gegessen]", el)?.addEventListener("click", () => {
      if (t.gegessen[i]) { t.eintraege = t.eintraege.filter(e => e.slot !== i); delete t.gegessen[i]; }
      else { t.gegessen[i] = true; t.eintraege.push({ name: REZEPTE.find(r => r.id === m.rezept).name, kcal: m.n.kcal, p: m.n.p, k: m.n.k, f: m.n.f, slot: i }); U.vib(15); }
      S.speichern(); App.neu();
    });
    U.$("[data-tausch]", el)?.addEventListener("click", () => ES.tauschen(wt, i, m));
    U.$("[data-rezept]", el)?.addEventListener("click", () => ES.rezept(m));
  });
  U.$("#e-add").onclick = () => ES.erfassen(key);
  U.$("#e-info").onclick = () => { const k = App.kal(); U.sheet(`<h3 class="sheet-titel">So wird gerechnet</h3>
    <div class="info-block"><h4>Grundumsatz: ${k.gesamt.bmr.wert} kcal (${k.gesamt.bmr.formel})</h4><p>${k.gesamt.bmr.erklaerung}</p></div>
    <div class="info-block"><h4>Gesamtumsatz: ${k.gesamt.schnitt} kcal im Wochenschnitt</h4><p>${k.gesamt.erklaerung}</p></div>
    <div class="info-block"><h4>Ziel: ${k.ziel} kcal (Training ${k.train}, Ruhe ${k.ruhe})</h4><p>${k.erklaerung}</p></div>
    <div class="info-block"><h4>Makros</h4><p>${mk.erklaerung}</p></div>
    <div class="info-block"><h4>Wasser: ${U.zahl(plan.wasser / 1000, 2)} l</h4><p>35 ml pro kg Körpergewicht${plan.train ? " + 0,5 l am Trainingstag" : ""}.</p></div>`); };
  U.$("#e-woche").onclick = () => ES.woche();
  U.$("#e-einkauf").onclick = () => ES.einkauf();
  U.$("#e-prep").onclick = () => ES.mealprep();
  U.$("#e-unterwegs").onclick = () => U.sheet(`<h3 class="sheet-titel">Unterwegs und im Restaurant</h3>${UNTERWEGS.map(u => `<div class="info-block"><h4>${u.ort}</h4><p>${u.tipp}</p></div>`).join("")}
    <p class="klein gedimmt">Faustregel: Handfläche Eiweiß, Faust Beilage, zwei Hände Gemüse, Daumen Fett.</p>`, { klasse: "hoch" });
  U.$("#e-trinken").onclick = () => ES.trinken();
  U.$("#e-supps").onclick = () => ES.supps();
  U.$("#e-abfrage").onclick = () => ES.abfrage();
};

ES.mahlzeitHtml = (m, i, t) => {
  if (m.leer) return `<div class="mahlzeit leer"><p class="ml-typ">${T.MAHLZEITEN[m.typ]}</p><p class="gedimmt">Kein passendes Rezept für Deine Vorgaben. Ca. ${m.ziel} kcal frei wählen.</p></div>`;
  const r = REZEPTE.find(x => x.id === m.rezept);
  return `<div class="mahlzeit ${t.gegessen[i] ? "gegessen" : ""} typ-${m.typ}" data-i="${i}">
    <div class="ml-kopf"><p class="ml-typ">${T.MAHLZEITEN[m.typ]}${m.typ === "pre" ? " · 60–120 Min. vorher" : ""}</p>
      <button class="ml-check" data-gegessen aria-label="Als gegessen markieren"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></button></div>
    <button class="ml-name" data-rezept>${r.name}</button>
    <p class="ml-werte"><b>${m.n.kcal} kcal</b> · ${m.n.p} g Eiweiß · ${m.n.k} g KH · ${m.n.f} g Fett · ${r.zeit} Min.</p>
    <div class="ml-aktionen"><button class="link-knopf" data-rezept>Rezept</button><button class="link-knopf" data-tausch>Tauschen</button></div></div>`;
};

ES.rezept = (m) => {
  const r = REZEPTE.find(x => x.id === m.rezept);
  U.sheet(`<h3 class="sheet-titel">${r.name}</h3><p class="klein">${r.zeit} Min.${r.prep ? " · gut vorzukochen" : ""} · ${"€".repeat(r.kosten)}</p>
    <div class="makro-chips"><span><b>${m.n.kcal}</b> kcal</span><span><b>${m.n.p}</b> g Eiweiß</span><span><b>${m.n.k}</b> g KH</span><span><b>${m.n.f}</b> g Fett</span></div>
    <h4 class="sheet-unter">Zutaten (für Dein Ziel berechnet)</h4>
    <ul class="zutaten">${m.zutaten.map(([id, g]) => `<li><span>${LM[id].name}</span><b>${g} g${LM[id].stk ? ` (≈ ${U.zahl(g / LM[id].stk, g / LM[id].stk < 2 ? 1 : 0)} Stk.)` : ""}</b></li>`).join("")}</ul>
    <h4 class="sheet-unter">Zubereitung</h4><p>${r.schritte}</p>`, { klasse: "hoch" });
};

ES.tauschen = (wt, i, m) => {
  const ern = App.p().ern;
  const kand = REZEPTE.filter(r => r.mahlzeit.includes(m.typ) && E.rezeptPasst(r, ern) && r.id !== m.rezept);
  const s = U.sheet(`<h3 class="sheet-titel">${T.MAHLZEITEN[m.typ]} tauschen</h3><div class="wahl-liste">${kand.length ? kand.map(r => { const n = E.rund(E.naehrwerte(E.skalieren(r, m.n.kcal).zutaten));
    return `<button class="wahl" data-r="${r.id}"><span class="wahl-text"><span class="wahl-titel">${r.name}</span><span class="wahl-info">${n.kcal} kcal · ${n.p} g Eiweiß · ${r.zeit} Min.</span></span></button>`; }).join("") : `<p class="gedimmt">Keine weiteren passenden Rezepte.</p>`}</div>`, { klasse: "hoch" });
  U.$$("[data-r]", s).forEach(b => b.onclick = () => {
    S.d.tausch = S.d.tausch || {}; S.d.tausch[wt] = S.d.tausch[wt] || {}; S.d.tausch[wt][i] = b.dataset.r;
    S.speichern(); s.zu(); App.neu();
  });
};

/* Lebensmittel erfassen */
ES.erfassen = (key) => {
  const t = ES.tagDaten(key);
  const s = U.sheet(`<h3 class="sheet-titel">Essen erfassen</h3><input type="search" class="suche" id="ls" placeholder="Lebensmittel suchen">
    <div id="ll" class="lm-liste"></div>
    <details class="eigen"><summary>Eigene Eingabe</summary>
      <label class="feld"><span>Name</span><input id="en" type="text"></label>
      <div class="feld-raster"><label class="feld"><span>kcal</span><input id="ek" type="number" inputmode="decimal"></label><label class="feld"><span>Eiweiß g</span><input id="ep" type="number" inputmode="decimal"></label>
      <label class="feld"><span>KH g</span><input id="ekh" type="number" inputmode="decimal"></label><label class="feld"><span>Fett g</span><input id="ef" type="number" inputmode="decimal"></label></div>
      <button class="knopf haupt voll" id="eok">Hinzufügen</button></details>`, { klasse: "voll" });
  const liste = (q = "") => {
    const f = q.toLowerCase();
    const l = LEBENSMITTEL.filter(x => !f || x.name.toLowerCase().includes(f)).slice(0, 40);
    U.$("#ll", s).innerHTML = l.map(x => `<button class="lm" data-id="${x.id}"><span><b>${x.name}</b><small>${x.kcal} kcal · ${x.p} E · ${x.k} K · ${x.f} F je 100 g</small></span></button>`).join("");
    U.$$(".lm", s).forEach(b => b.onclick = () => ES.menge(LM[b.dataset.id], (e) => { t.eintraege.push(e); S.speichern(); s.zu(); App.neu(); }));
  };
  liste(); U.$("#ls", s).oninput = (e) => liste(e.target.value);
  U.$("#eok", s).onclick = () => {
    const n = U.$("#en", s).value.trim(), k = +U.$("#ek", s).value || 0;
    if (!n || !k) return U.toast("Name und Kalorien angeben.");
    t.eintraege.push({ name: n, kcal: k, p: +U.$("#ep", s).value || 0, k: +U.$("#ekh", s).value || 0, f: +U.$("#ef", s).value || 0 });
    S.speichern(); s.zu(); App.neu();
  };
};
ES.menge = (l, fertig) => {
  let g = l.stk || 100;
  const s = U.sheet(`<h3 class="sheet-titel">${l.name}</h3><div class="gross-zahl"><span id="mg">${g}</span> <small>g</small></div>
    <input type="range" min="5" max="600" step="5" value="${g}" class="regler" id="mr">
    <div class="chips klein">${[50, 100, 150, 200, 250].map(x => `<button class="chip" data-g="${x}">${x} g</button>`).join("")}${l.stk ? `<button class="chip" data-g="${l.stk}">1 Stück</button>` : ""}</div>
    <p id="mn" class="ml-werte"></p><button class="knopf haupt voll" id="mok">Hinzufügen</button>`);
  const z = () => { U.$("#mg", s).textContent = g; U.$("#mr", s).value = g; const n = E.rund(E.naehrwerte([[l.id, g]])); U.$("#mn", s).innerHTML = `<b>${n.kcal} kcal</b> · ${n.p} g Eiweiß · ${n.k} g KH · ${n.f} g Fett`; };
  U.$("#mr", s).oninput = (e) => { g = +e.target.value; z(); };
  U.$$("[data-g]", s).forEach(b => b.onclick = () => { g = +b.dataset.g; z(); });
  U.$("#mok", s).onclick = () => { const n = E.naehrwerte([[l.id, g]]); s.zu(); fertig({ name: l.name, g, kcal: n.kcal, p: n.p, k: n.k, f: n.f }); };
  z();
};

/* Wochenplan */
ES.woche = () => {
  U.sheet(`<h3 class="sheet-titel">Wochenplan</h3>${U.TAGE_LANG.map((d, i) => { const pl = ES.plan(i);
    return `<details class="wp-tag" ${i === U.wtag() ? "open" : ""}><summary><b>${d}</b><span>${pl.train ? "Training" : "Ruhetag"} · ${pl.summe.kcal} kcal · ${pl.summe.p} g E</span></summary>
      ${pl.mahlzeiten.map(m => m.leer ? "" : `<p class="wp-m"><small>${T.MAHLZEITEN[m.typ]}</small>${REZEPTE.find(r => r.id === m.rezept).name} <i>${m.n.kcal} kcal</i></p>`).join("")}</details>`; }).join("")}`, { klasse: "voll" });
};

/* Einkaufsliste */
ES.einkauf = () => {
  const liste = E.einkaufsliste([0, 1, 2, 3, 4, 5, 6].map(i => ES.plan(i)));
  const woche = U.datumKey(P.wochenStart());
  S.d.einkauf = S.d.einkauf[woche] ? S.d.einkauf : { [woche]: {} };
  const ab = S.d.einkauf[woche];
  const gruppen = [...new Set(liste.map(l => l.gruppe))];
  const s = U.sheet(`<h3 class="sheet-titel">Einkaufsliste dieser Woche</h3><p class="klein gedimmt">Automatisch aus Deinem Wochenplan. Abhaken beim Einkaufen.</p>
    ${gruppen.map(g => `<h4 class="sheet-unter">${g}</h4><div class="check-liste">${liste.filter(l => l.gruppe === g).map(l => `<label class="check ${ab[l.id] ? "ab" : ""}"><input type="checkbox" data-id="${l.id}" ${ab[l.id] ? "checked" : ""}><span>${l.name}</span><b>${l.g >= 1000 ? U.zahl(l.g / 1000, 1) + " kg" : l.g + " g"}${l.stk ? ` · ${l.stk} Stk.` : ""}</b></label>`).join("")}</div>`).join("")}
    <button class="knopf zweit voll" id="ek-teilen">Liste teilen</button>`, { klasse: "voll" });
  U.$$("input[data-id]", s).forEach(c => c.onchange = () => { ab[c.dataset.id] = c.checked; c.closest(".check").classList.toggle("ab", c.checked); S.speichern(); });
  U.$("#ek-teilen", s).onclick = async () => {
    const text = "Einkaufsliste\n" + liste.filter(l => !ab[l.id]).map(l => `- ${l.name}: ${l.g} g`).join("\n");
    try { if (navigator.share) await navigator.share({ text }); else { await navigator.clipboard.writeText(text); U.toast("In die Zwischenablage kopiert"); } } catch (e) {}
  };
};

/* Meal-Prep */
ES.mealprep = () => {
  const ern = App.p().ern;
  const r = REZEPTE.filter(x => x.prep && E.rezeptPasst(x, { ...ern, kochzeit: "lang" }));
  U.sheet(`<h3 class="sheet-titel">Meal-Prep</h3><p>Sonntag 60–90 Minuten kochen, dann hast Du bis Mittwoch fertige Mahlzeiten. Mittwochabend eine zweite, kleine Runde.</p>
    <div class="info-block"><h4>Basis vorkochen</h4><p>Reis oder Quinoa für 3 Tage, Hähnchen oder Tofu in einer großen Pfanne, ein Blech Ofengemüse, 6–8 Eier hart kochen.</p></div>
    <div class="info-block"><h4>Haltbarkeit</h4><p>Gekochtes in luftdichten Boxen 3–4 Tage im Kühlschrank. Reis schnell abkühlen lassen. Was später gegessen wird, einfrieren.</p></div>
    <h4 class="sheet-unter">Gut vorzukochen</h4>${r.map(x => `<p class="wp-m">${x.name} <i>${x.zeit} Min.</i></p>`).join("") || '<p class="gedimmt">Keine passenden Rezepte.</p>'}`, { klasse: "hoch" });
};

ES.trinken = () => U.sheet(`<h3 class="sheet-titel">Getränke</h3>
  <div class="info-block"><h4>Vor dem Training</h4><p>2–3 Stunden vorher ca. 0,5 l, kurz davor ein Glas.</p></div>
  <div class="info-block"><h4>Während</h4><p>Alle 15–20 Minuten ein paar Schlucke (150–250 ml). Bei langen, schweißtreibenden Einheiten eine Prise Salz oder Elektrolyte.</p></div>
  <div class="info-block"><h4>Danach</h4><p>Etwa 0,5 l in der ersten Stunde, mehr wenn Du stark geschwitzt hast.</p></div>
  <div class="info-block"><h4>Kaffee</h4><p>Schwarz oder mit etwas Milch völlig in Ordnung. Nach 14 Uhr besser keinen – Schlaf ist Dein wichtigstes Regenerationsmittel.</p></div>
  <div class="info-block"><h4>Zucker</h4><p>Softdrinks und Säfte liefern Kalorien ohne Sättigung. Zero-Varianten oder Wasser mit Zitrone sind die einfache Lösung.</p></div>
  <div class="info-block warnfarbe"><h4>Alkohol</h4><p>Bremst Fettabbau und Regeneration. Wenn, dann selten und an Ruhetagen – und die Kalorien einrechnen.</p></div>`, { klasse: "hoch" });

ES.supps = () => {
  const gew = App.p().ern.supps;
  U.sheet(`<h3 class="sheet-titel">Supplemente</h3><p class="klein">Alles optional – eine gute Ernährung ist die Basis. Bei Medikamenten oder Vorerkrankungen vorher ärztlich abklären.</p>
    ${Object.entries(T.SUPPS).filter(([k]) => k !== "keine").map(([k, n]) => `<div class="info-block ${gew.includes(k) ? "markiert" : ""}"><h4>${n}${gew.includes(k) ? " · Dein Wunsch" : ""}</h4><p>${E.SUPP_INFO[k]}</p></div>`).join("")}`, { klasse: "hoch" });
};

/* Wöchentliche Ernährungsabfrage */
ES.abfrage = () => {
  const a = {};
  const frage = (f, t, opt) => `<h4 class="sheet-unter">${t}</h4><div class="segment drei" data-f="${f}">${opt.map(([k, n]) => `<button data-v="${k}">${n}</button>`).join("")}</div>`;
  const s = U.sheet(`<h3 class="sheet-titel">Deine Ernährungswoche</h3>
    ${frage("hunger", "Wie war Dein Hunger?", [["kaum", "Kaum"], ["normal", "Normal"], ["stark", "Stark"]])}
    ${frage("plan", "Hast Du den Plan eingehalten?", [["ja", "Ja"], ["meist", "Meistens"], ["kaum", "Kaum"]])}
    ${frage("energie", "Energie im Training?", [["gut", "Gut"], ["okay", "Okay"], ["schlecht", "Schlecht"]])}
    <button class="knopf haupt voll" id="ab-ok" disabled>Auswerten</button>`);
  U.$$("[data-f]", s).forEach(sg => U.$$("button", sg).forEach(b => b.onclick = () => {
    a[sg.dataset.f] = b.dataset.v; U.$$("button", sg).forEach(x => x.classList.toggle("an", x === b));
    U.$("#ab-ok", s).disabled = Object.keys(a).length < 3;
  }));
  U.$("#ab-ok", s).onclick = () => {
    const erg = E.abfrageAnpassung(a);
    App.p().kcalAnpassung = R.klemmen((App.p().kcalAnpassung || 0) + erg.delta, -500, 500);
    S.d.abfragen.push({ datum: Date.now(), ...a, delta: erg.delta });
    S.speichern(); s.zu();
    U.sheet(`<h3 class="sheet-titel">Ergebnis</h3><p>${erg.text}</p>${a.plan === "kaum" ? `<p class="klein">Tipp: Tausche Mahlzeiten, die Dir nicht schmecken, oder reduziere auf weniger Mahlzeiten pro Tag – Hauptsache, es passt in Deinen Alltag.</p>` : ""}`);
    App.neu();
  };
};
