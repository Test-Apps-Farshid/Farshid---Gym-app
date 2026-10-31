/* =====================================================================
   TRAININGSMODUS – live im Gym: Übung für Übung, Pausentimer,
   Feedback nach jeder Übung, Abschlussfragen, Zusammenfassung
   ===================================================================== */
window.TR = {};
TR.l = () => S.d.laufend;
TR.sichern = () => S.speichern();

TR.starten = async (tag) => {
  if (!tag) return;
  U.audioAn();
  const plan = S.d.plan, woche = App.woche();
  const deload = P.wocheInfo(plan, woche).deload || plan.extraDeload === woche;
  S.d.laufend = {
    tagWtag: tag.wtag, name: tag.name, typ: tag.typ, start: Date.now(), woche, deload, phase: "warm", i: 0,
    aufwaermen: tag.aufwaermen, dehnen: tag.dehnen, cardio: tag.cardio,
    ue: tag.uebungen.map(e => {
      const u = UEB[e.id], k = S.d.kraft[e.id];
      const n = deload ? Math.max(1, Math.round(e.saetze * 0.6)) : e.saetze;
      let kg = k ? k.kg : (P.koerpergewicht(u) ? 0 : null);
      if (kg && deload) kg = R.runden(kg * 0.9, P.schritt(u) || 1);
      const wdh = k?.zielWdh || e.lo;
      return { ...e, saetze: n, s: Array.from({ length: n }, () => ({ kg, wdh, ok: false })), fb: null, schmerz: null, fertig: false };
    })
  };
  TR.sichern();
  const wach = await U.wachHalten();
  if (!wach && !S.d.wachHinweis) { S.d.wachHinweis = true; TR.sichern(); setTimeout(() => U.toast("Tipp: Stelle unter Einstellungen › Anzeige die Auto-Sperre hoch, damit der Bildschirm anbleibt."), 800); }
  TR.zeigen();
};

TR.fortsetzen = () => { U.wachHalten(); TR.zeigen(); };

TR.zeigen = () => {
  const l = TR.l(); if (!l) return App.start();
  const w = U.$("#app");
  w.className = "modus-tr";
  const nUe = l.ue.length;
  const pos = l.phase === "warm" ? 0 : l.phase === "ue" ? l.i + 1 : nUe + 1;
  w.innerHTML = `<div class="tr">
    <header class="tr-kopf"><button class="rund-knopf" id="tr-x" aria-label="Training beenden"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div class="tr-titel"><b>${l.name}</b><span id="tr-uhr">0:00</span></div>
      <button class="rund-knopf" id="tr-info" aria-label="Technik"><svg viewBox="0 0 24 24"><path d="M12 8h.01M11 12h1v5h1"/><circle cx="12" cy="12" r="9"/></svg></button></header>
    <div class="tr-fortschritt">${Array.from({ length: nUe + 2 }, (_, i) => `<i class="${i < pos ? "voll" : i === pos ? "jetzt" : ""}"></i>`).join("")}</div>
    <main class="tr-inhalt" id="tr-inhalt"></main></div>`;
  U.$("#tr-x").onclick = () => TR.abbrechen();
  U.$("#tr-info").onclick = () => { const e = l.ue[l.i]; if (l.phase === "ue" && e) App.uebungInfo(e.id); else U.toast("Technik-Infos gibt es bei jeder Übung."); };
  clearInterval(TR.uhr);
  TR.uhr = setInterval(() => { const el = U.$("#tr-uhr"); if (!el) return clearInterval(TR.uhr); const s = Math.floor((Date.now() - l.start) / 1000); el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }, 1000);
  const inhalt = U.$("#tr-inhalt");
  ({ warm: TR.warm, ue: TR.uebung, cardio: TR.cardio, dehnen: TR.dehnen, abschluss: TR.abschluss })[l.phase](inhalt);
  if (l.pauseEnde && l.pauseEnde > Date.now() - 3000) TR.pauseZeigen();
};

TR.abbrechen = () => {
  const s = U.sheet(`<h3 class="sheet-titel">Training beenden?</h3><div class="knopfreihe senkrecht">
    <button class="knopf haupt" id="ab-sp">Speichern und abschließen</button><button class="knopf zweit" id="ab-weiter">Weiter trainieren</button>
    <button class="knopf zweit rot" id="ab-weg">Verwerfen</button></div>`);
  U.$("#ab-weiter", s).onclick = () => s.zu();
  U.$("#ab-sp", s).onclick = () => { s.zu(); TR.l().phase = "abschluss"; TR.sichern(); TR.zeigen(); };
  U.$("#ab-weg", s).onclick = async () => { s.zu(); S.d.laufend = null; TR.sichern(); U.wachLoesen(); clearInterval(TR.uhr); App.start(); };
};

TR.weiterPhase = () => {
  const l = TR.l();
  if (l.phase === "warm") { l.phase = "ue"; l.i = 0; }
  else if (l.phase === "ue") {
    if (l.i < l.ue.length - 1) l.i++;
    else l.phase = l.cardio ? "cardio" : "dehnen";
  } else if (l.phase === "cardio") l.phase = "dehnen";
  else if (l.phase === "dehnen") l.phase = "abschluss";
  l.pauseEnde = null;
  TR.sichern(); TR.zeigen(); U.$("#tr-inhalt")?.scrollTo(0, 0);
};

/* ---------- Aufwärmen ---------- */
TR.warm = (w) => {
  const l = TR.l();
  w.innerHTML = `<h1 class="tr-h">Aufwärmen</h1><p class="tr-unter">5–8 Minuten. Danach bei der ersten Grundübung 1–2 leichte Aufwärmsätze.</p>
    <div class="liste-ue">${l.aufwaermen.map((id, i) => { const u = UEB[id]; return `<div class="lu"><div class="lu-bild">${U.uebungBild(u)}</div><div><b>${u.name}</b><span>${u.typ === "cardio" ? "5 Minuten locker" : "5 pro Seite, langsam"}</span></div></div>`; }).join("")}</div>
    <button class="knopf haupt voll gross tr-fuss" id="w-los">Los geht's</button>`;
  U.$("#w-los").onclick = () => { U.audioAn(); TR.weiterPhase(); };
};

/* ---------- Eine Übung ---------- */
TR.uebung = (w) => {
  const l = TR.l(), e = l.ue[l.i], u = UEB[e.id], k = S.d.kraft[e.id];
  const koerper = P.koerpergewicht(u), schritt = P.schritt(u) || 1;
  const wi = P.wocheInfo(S.d.plan, l.woche);
  const brauchtEinstufung = !k && !koerper && e.s.every(s => s.kg === null);
  const naechste = l.ue[l.i + 1];
  w.innerHTML = `
    <div class="tr-bild">${U.uebungBild(u, true)}</div>
    <div class="tr-ue-kopf"><p class="tr-nr">Übung ${l.i + 1} von ${l.ue.length}</p><h1 class="tr-h">${u.name}</h1>
      <div class="chips klein"><span class="chip an">${T.MUSKELN[u.muskel].name}</span>${u.geraet.filter(g => g !== "mt").map(g => `<span class="chip geraet">${U.geraetSymbol(g)}${T.GERAETE[g].name}</span>`).join("")}</div></div>
    <div class="tr-vorgabe">
      <div><b>${e.saetze}</b><span>Sätze</span></div><div><b>${e.lo}–${e.hi}</b><span>${e.sek ? "Sekunden" : "Wdh."}</span></div>
      <div><b>${e.pause}s</b><span>Pause</span></div><div><b>${e.tempo}</b><span>Tempo</span></div><div><b>${l.deload ? 4 : wi.rir}</b><span>RIR</span></div></div>
    ${brauchtEinstufung ? TR.einstufungHtml(u, e) : ""}
    <div class="saetze" id="saetze">${e.s.map((s, i) => TR.satzHtml(e, s, i, koerper)).join("")}</div>
    <div class="tr-aktionen"><button class="knopf klein zweit" id="satz-plus">+ Satz</button><button class="knopf klein zweit" id="ue-ersetzen">Übung ersetzen</button><button class="knopf klein zweit" id="ue-tipp">Technik</button></div>
    <p class="tr-tipp"><b>Tipp:</b> ${u.tipp}</p>
    ${naechste ? `<p class="klein gedimmt">Danach: ${UEB[naechste.id].name}</p>` : ""}
    <div class="tr-fuss zwei">${l.i > 0 ? `<button class="knopf zweit" id="ue-zurueck">Zurück</button>` : `<span></span>`}
      <button class="knopf haupt" id="ue-fertig">${e.s.every(s => s.ok) ? "Weiter" : "Übung beenden"}</button></div>`;

  if (brauchtEinstufung) TR.einstufungBinden(u, e);
  U.$$(".satz", w).forEach(z => {
    const i = +z.dataset.i, s = e.s[i];
    const setzKg = (d) => { s.kg = Math.max(0, R.runden((s.kg || 0) + d, U.lb() ? 0.4536 : 0.5)); TR.sichern(); U.$(".kg-wert", z).textContent = U.kg(s.kg, true); };
    U.$("[data-kg='-']", z)?.addEventListener("click", () => setzKg(-schritt));
    U.$("[data-kg='+']", z)?.addEventListener("click", () => setzKg(schritt));
    U.$(".kg-wert", z)?.addEventListener("click", () => {
      const v = prompt(`Gewicht in ${U.lb() ? "lb" : "kg"}`, U.kgAus(s.kg || 0));
      if (v !== null && !isNaN(parseFloat(v.replace(",", ".")))) { s.kg = U.kgEin(parseFloat(v.replace(",", "."))); TR.sichern(); TR.zeigen(); }
    });
    U.$("[data-w='-']", z).onclick = () => { s.wdh = Math.max(0, s.wdh - (e.sek ? 5 : 1)); TR.sichern(); U.$(".wdh-wert", z).textContent = s.wdh; };
    U.$("[data-w='+']", z).onclick = () => { s.wdh += e.sek ? 5 : 1; TR.sichern(); U.$(".wdh-wert", z).textContent = s.wdh; };
    U.$(".satz-ok", z).onclick = () => {
      U.audioAn();
      if (!koerper && (s.kg === null || s.kg === undefined)) return U.toast("Trag zuerst ein Gewicht ein.");
      s.ok = !s.ok; U.vib(s.ok ? 20 : 8);
      // Übernahme des Gewichts in die folgenden Sätze, wenn diese noch leer sind
      if (s.ok) e.s.forEach((x, j) => { if (j > i && !x.ok && (x.kg === null || x.kg === undefined)) x.kg = s.kg; });
      TR.sichern();
      const alle = e.s.every(x => x.ok);
      if (s.ok && !alle) { l.pauseEnde = Date.now() + e.pause * 1000; l.pauseFuer = u.name; l.pauseGemeldet = false; TR.sichern(); TR.zeigen(); TR.pauseZeigen(); }
      else if (alle) { TR.zeigen(); TR.feedback(); }
      else TR.zeigen();
    };
  });
  U.$("#satz-plus").onclick = () => { const letzt = e.s[e.s.length - 1]; e.s.push({ kg: letzt?.kg ?? null, wdh: letzt?.wdh || e.lo, ok: false }); e.saetze = e.s.length; TR.sichern(); TR.zeigen(); };
  U.$("#ue-ersetzen").onclick = () => App.ersetzenSheet({ uebungen: [e] }, e.uid, (neu) => {
    const kk = S.d.kraft[neu.id];
    e.s.forEach(s => { s.kg = kk ? kk.kg : (P.koerpergewicht(neu) ? 0 : null); s.wdh = kk?.zielWdh || e.lo; s.ok = false; });
    TR.sichern(); TR.zeigen();
  }, true);
  U.$("#ue-tipp").onclick = () => App.uebungInfo(e.id);
  U.$("#ue-zurueck")?.addEventListener("click", () => { l.i--; TR.sichern(); TR.zeigen(); });
  U.$("#ue-fertig").onclick = () => {
    if (e.fertig) return TR.weiterPhase();
    if (!e.s.some(s => s.ok)) {
      const s = U.sheet(`<h3 class="sheet-titel">Übung auslassen?</h3><div class="knopfreihe senkrecht"><button class="knopf zweit" id="ul">Auslassen</button><button class="knopf haupt" id="ub">Zurück zur Übung</button></div>`);
      U.$("#ub", s).onclick = () => s.zu();
      U.$("#ul", s).onclick = () => { s.zu(); e.fertig = true; e.uebersprungen = true; TR.weiterPhase(); };
      return;
    }
    TR.feedback();
  };
};

TR.satzHtml = (e, s, i, koerper) => `<div class="satz ${s.ok ? "ok" : ""}" data-i="${i}">
  <span class="satz-nr">${i + 1}</span>
  ${koerper ? `<div class="satz-feld kg-leer"><span>Körpergewicht</span></div>` :
    `<div class="satz-feld"><button data-kg="-" aria-label="Weniger Gewicht">−</button><div><b class="kg-wert">${s.kg === null || s.kg === undefined ? "–" : U.kg(s.kg, true)}</b><small>${U.lb() ? "lb" : "kg"}</small></div><button data-kg="+" aria-label="Mehr Gewicht">+</button></div>`}
  <div class="satz-feld"><button data-w="-" aria-label="Weniger">−</button><div><b class="wdh-wert">${s.wdh}</b><small>${e.sek ? "Sek." : "Wdh."}</small></div><button data-w="+" aria-label="Mehr">+</button></div>
  <button class="satz-ok" aria-label="Satz abhaken"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></button></div>`;

/* Einstufungssatz beim ersten Mal */
TR.einstufungHtml = (u, e) => {
  const hint = P.startHinweis(u, App.p()) || 10;
  return `<div class="einstufung" id="einst"><b>Einstufungssatz</b><p>Wähle ein Gewicht, mit dem Du <b>10 Wiederholungen sauber</b> schaffst – nicht bis zum Versagen. Daraus berechnet die App Dein Arbeitsgewicht.</p>
    <div class="satz-feld gross"><button data-e="-">−</button><div><b id="e-kg">${U.kg(hint, true)}</b><small>${U.lb() ? "lb" : "kg"} × 10</small></div><button data-e="+">+</button></div>
    <p class="klein gedimmt">Startvorschlag: ca. ${U.kg(hint)} – bitte vorsichtig herantasten.</p>
    <button class="knopf haupt voll" id="e-ok">Arbeitsgewicht berechnen</button></div>`;
};
TR.einstufungBinden = (u, e) => {
  let kg = P.startHinweis(u, App.p()) || 10; const st = P.schritt(u) || 1;
  const z = () => U.$("#e-kg").textContent = U.kg(kg, true);
  U.$("[data-e='-']").onclick = () => { kg = Math.max(st, kg - st); z(); };
  U.$("[data-e='+']").onclick = () => { kg += st; z(); };
  U.$("#e-ok").onclick = () => {
    const arbeit = P.ausEinstufung(u, e, kg);
    S.d.kraft[u.id] = { kg: arbeit, zielWdh: e.lo, verlauf: [], einstufung: kg };
    e.s.forEach(s => { if (!s.ok) { s.kg = arbeit; s.wdh = e.lo; } });
    TR.sichern(); U.toast(`Arbeitsgewicht: ${U.kg(arbeit)} für ${e.lo}–${e.hi} Wdh.`); TR.zeigen();
  };
};

/* ---------- Pausentimer ---------- */
TR.pauseZeigen = () => {
  const l = TR.l(); if (!l.pauseEnde) return;
  U.$(".pause")?.remove();
  const e = l.ue[l.i], gesamt = (e?.pause || 90) * 1000;
  const o = document.createElement("div"); o.className = "pause";
  o.innerHTML = `<div class="pause-karte"><p>Pause</p><div class="pause-ring" id="pr"></div>
    <div class="knopfreihe"><button class="knopf zweit" id="p-m">−15 s</button><button class="knopf zweit" id="p-p">+15 s</button></div>
    <button class="knopf haupt voll" id="p-weg">Weiter</button>
    <p class="klein gedimmt">Nächster Satz: ${e ? `${U.kg(e.s.find(s => !s.ok)?.kg ?? 0)} × ${e.s.find(s => !s.ok)?.wdh ?? ""}` : ""}</p></div>`;
  U.$(".modus-tr").appendChild(o);
  requestAnimationFrame(() => o.classList.add("an"));
  const schliessen = () => { clearInterval(TR.pt); l.pauseEnde = null; TR.sichern(); o.classList.remove("an"); setTimeout(() => o.remove(), 250); };
  U.$("#p-m", o).onclick = () => { l.pauseEnde -= 15000; TR.sichern(); tick(); };
  U.$("#p-p", o).onclick = () => { l.pauseEnde += 15000; TR.sichern(); tick(); };
  U.$("#p-weg", o).onclick = schliessen;
  const tick = () => {
    const rest = l.pauseEnde - Date.now();
    const s = Math.max(0, Math.ceil(rest / 1000));
    U.$("#pr", o).innerHTML = U.ring(Math.max(0, rest), gesamt, { gross: 220, dicke: 10, text: rest > 0 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "Los!", unter: rest > 0 ? "verbleibend" : "Weiter geht's", klasse: "pause-r" });
    if (rest <= 0 && !l.pauseGemeldet) {
      l.pauseGemeldet = true; TR.sichern();
      U.melden("Weiter geht's!", `Deine Pause für die Übung ${l.pauseFuer || ""} ist vorbei.`);
      setTimeout(schliessen, 1800);
    }
  };
  clearInterval(TR.pt); tick(); TR.pt = setInterval(tick, 250);
};
// Nach Rückkehr aus dem Hintergrund (iOS pausiert Timer) sofort prüfen
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && S.d?.laufend?.pauseEnde && U.$(".modus-tr") && !U.$(".pause")) TR.pauseZeigen(); });

/* ---------- Feedback nach jeder Übung ---------- */
TR.feedback = () => {
  const l = TR.l(), e = l.ue[l.i], u = UEB[e.id];
  let fb = e.fb, sz = e.schmerz || "nein", stelle = e.schmerzStelle || null;
  const s = U.sheet(`<h3 class="sheet-titel">Wie war die Übung?</h3>
    <div class="fb-gitter">${[["leicht", "Zu leicht"], ["richtig", "Genau richtig"], ["hart", "Sehr hart"], ["nicht", "Nicht geschafft"]].map(([k, n]) => `<button class="fb ${fb === k ? "an" : ""}" data-fb="${k}">${n}</button>`).join("")}</div>
    <h4 class="sheet-unter">Schmerz oder Unwohlsein?</h4>
    <div class="segment drei" id="sz">${[["nein", "Nein"], ["leicht", "Leicht"], ["stark", "Stark"]].map(([k, n]) => `<button data-sz="${k}" class="${sz === k ? "an" : ""}">${n}</button>`).join("")}</div>
    <div id="stelle" class="chips ${sz === "stark" ? "" : "versteckt"}">${Object.entries(T.GELENKE).map(([k, n]) => `<button class="chip ${stelle === k ? "an" : ""}" data-st="${k}">${n}</button>`).join("")}</div>
    <p class="hinweis warn ${sz === "stark" ? "" : "versteckt"}" id="sz-hin">Hör bei starken Schmerzen auf. Die App ersetzt die Übung künftig. Bitte lass das ärztlich abklären.</p>
    <button class="knopf haupt voll" id="fb-ok" ${fb ? "" : "disabled"}>Weiter</button>`);
  U.$$("[data-fb]", s).forEach(b => b.onclick = () => { fb = b.dataset.fb; U.$$("[data-fb]", s).forEach(x => x.classList.toggle("an", x === b)); U.$("#fb-ok", s).disabled = false; U.vib(10); });
  U.$$("[data-sz]", s).forEach(b => b.onclick = () => {
    sz = b.dataset.sz; U.$$("[data-sz]", s).forEach(x => x.classList.toggle("an", x === b));
    U.$("#stelle", s).classList.toggle("versteckt", sz !== "stark"); U.$("#sz-hin", s).classList.toggle("versteckt", sz !== "stark");
  });
  U.$$("[data-st]", s).forEach(b => b.onclick = () => { stelle = b.dataset.st; U.$$("[data-st]", s).forEach(x => x.classList.toggle("an", x === b)); });
  U.$("#fb-ok", s).onclick = () => {
    e.fb = fb; e.schmerz = sz; e.schmerzStelle = sz === "stark" ? (stelle || Object.keys(u.gelenke)[0] || null) : null;
    const erg = P.progression(u, e, S.d.kraft, e.s, fb);
    e.rekord = erg.rekord; e.fertig = true;
    if (sz === "stark" && e.schmerzStelle) TR.schmerzAnpassen(e);
    else if (sz === "leicht") U.toast("Notiert. Achte auf saubere Technik – bei Wiederholung ersetzt die App die Übung.");
    TR.sichern(); s.zu();
    if (erg.rekord) U.toast("Neue Bestleistung!"); else if (erg.text) U.toast(erg.text);
    TR.weiterPhase();
  };
};

/* Starker Schmerz: Gelenk markieren und Übung im Plan ersetzen */
TR.schmerzAnpassen = (e) => {
  const p = App.p(), g = e.schmerzStelle;
  p.schmerzen[g] = Math.max(p.schmerzen[g] || 0, 2);
  const alt = P.alternativen(e.id, p, g)[0];
  if (alt) {
    S.d.plan.tage.forEach(t => t.uebungen.forEach(x => { if (x.id === e.id) { const r = P.repBereich(alt, p); Object.assign(x, { id: alt.id, lo: r.lo, hi: r.hi, sek: !!r.sek, pause: P.pause(alt, p), tempo: P.tempo(alt) }); } }));
    U.toast(`Künftig: ${alt.name} statt ${UEB[e.id].name}`);
  }
  if (S.d.hinweisWeg) delete S.d.hinweisWeg.schmerz;
};

/* ---------- Cardio-Finisher ---------- */
TR.cardio = (w) => {
  const l = TR.l(), c = l.cardio, u = UEB[c.id];
  if (!l.cardioEnde) { l.cardioDauer = c.min * 60000; }
  w.innerHTML = `<div class="tr-bild">${U.uebungBild(u, true)}</div><h1 class="tr-h">Cardio: ${u.name}</h1>
    <p class="tr-unter">${c.min} Minuten in moderatem Tempo – Du kannst noch sprechen, aber nicht singen. ${u.tipp}</p>
    <div id="cr" class="zentriert"></div>
    <div class="tr-fuss zwei"><button class="knopf zweit" id="c-weg">Auslassen</button><button class="knopf haupt" id="c-start">${l.cardioEnde ? "Fertig" : "Timer starten"}</button></div>`;
  const tick = () => {
    const rest = l.cardioEnde ? l.cardioEnde - Date.now() : l.cardioDauer, s = Math.max(0, Math.ceil(rest / 1000));
    const el = U.$("#cr"); if (!el) return clearInterval(TR.ct);
    el.innerHTML = U.ring(l.cardioDauer - Math.max(0, rest), l.cardioDauer, { gross: 200, dicke: 10, text: `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`, unter: rest > 0 ? "Minuten" : "Geschafft" });
    if (l.cardioEnde && rest <= 0 && !l.cardioGemeldet) { l.cardioGemeldet = true; TR.sichern(); U.melden("Cardio geschafft", "Jetzt noch kurz dehnen."); }
  };
  clearInterval(TR.ct); tick(); if (l.cardioEnde) TR.ct = setInterval(tick, 500);
  U.$("#c-start").onclick = () => {
    if (!l.cardioEnde) { l.cardioEnde = Date.now() + l.cardioDauer; TR.sichern(); TR.zeigen(); }
    else { l.cardioMin = Math.round(Math.min(l.cardioDauer, Date.now() - (l.cardioEnde - l.cardioDauer)) / 60000); clearInterval(TR.ct); TR.weiterPhase(); }
  };
  U.$("#c-weg").onclick = () => { l.cardioMin = 0; clearInterval(TR.ct); TR.weiterPhase(); };
};

/* ---------- Dehnen ---------- */
TR.dehnen = (w) => {
  const l = TR.l();
  w.innerHTML = `<h1 class="tr-h">Dehnen</h1><p class="tr-unter">Je 30 Sekunden halten, ruhig atmen, nicht wippen.</p>
    <div class="liste-ue">${l.dehnen.map(id => { const u = UEB[id]; return `<div class="lu"><div class="lu-bild">${U.uebungBild(u)}</div><div><b>${u.name}</b><span>${u.tipp}</span></div><button class="knopf klein zweit" data-d>30 s</button></div>`; }).join("")}</div>
    <button class="knopf haupt voll gross tr-fuss" id="d-ok">Training abschließen</button>`;
  U.$$("[data-d]", w).forEach(b => b.onclick = () => {
    let s = 30; b.disabled = true;
    const t = setInterval(() => { s--; b.textContent = s > 0 ? `${s} s` : "Fertig"; if (s <= 0) { clearInterval(t); U.vib(60); U.piep([[660, 0.15]]); } }, 1000);
  });
  U.$("#d-ok").onclick = () => TR.weiterPhase();
};

/* ---------- Abschlussfragen ---------- */
TR.abschluss = (w) => {
  const l = TR.l();
  const offen = l.ue.filter(e => !e.fertig || e.uebersprungen || e.s.some(s => !s.ok));
  l.komplett = l.komplett ?? (offen.length === 0 ? "ja" : "nein");
  l.gruende = l.gruende || {};
  const seg = (feld, opt) => `<div class="segment drei" data-f="${feld}">${opt.map(([k, n]) => `<button data-v="${k}" class="${l[feld] === k ? "an" : ""}">${n}</button>`).join("")}</div>`;
  w.innerHTML = `<h1 class="tr-h">Fast geschafft</h1>
    <h2 class="tr-frage">Hast Du das komplette Training geschafft?</h2>${seg("komplett", [["ja", "Ja"], ["nein", "Nein"]]).replace("drei", "zwei")}
    <div id="offen" class="${l.komplett === "nein" ? "" : "versteckt"}">
      <p class="klein">Was hat gefehlt – und warum?</p>
      ${(offen.length ? offen : l.ue).map(e => `<div class="grund-zeile" data-uid="${e.uid}"><b>${UEB[e.id].name}</b><div class="chips klein">${[["zeit", "Keine Zeit"], ["geraet", "Gerät besetzt"], ["schmerz", "Schmerzen"], ["muede", "Zu müde"], ["anderes", "Anderes"]].map(([k, n]) => `<button class="chip ${l.gruende[e.uid] === k ? "an" : ""}" data-g="${k}">${n}</button>`).join("")}</div></div>`).join("")}
    </div>
    <h2 class="tr-frage">Energielevel</h2>${seg("energie", [["hoch", "Hoch"], ["mittel", "Mittel"], ["niedrig", "Niedrig"]])}
    <h2 class="tr-frage">Muskelkater (vom letzten Training)</h2>${seg("kater", [["keiner", "Keiner"], ["leicht", "Leicht"], ["stark", "Stark"]])}
    <h2 class="tr-frage">Schlaf letzte Nacht</h2>${seg("schlaf", [["gut", "Gut"], ["okay", "Okay"], ["schlecht", "Schlecht"]])}
    <button class="knopf haupt voll gross tr-fuss" id="a-ok">Zusammenfassung ansehen</button>`;
  U.$$("[data-f]", w).forEach(sg => U.$$("button", sg).forEach(b => b.onclick = () => {
    l[sg.dataset.f] = b.dataset.v; U.$$("button", sg).forEach(x => x.classList.toggle("an", x === b));
    if (sg.dataset.f === "komplett") U.$("#offen").classList.toggle("versteckt", b.dataset.v !== "nein");
    TR.sichern();
  }));
  U.$$(".grund-zeile", w).forEach(z => U.$$("[data-g]", z).forEach(c => c.onclick = () => { l.gruende[z.dataset.uid] = c.dataset.g; U.$$("[data-g]", z).forEach(x => x.classList.toggle("an", x === c)); TR.sichern(); }));
  U.$("#a-ok").onclick = () => {
    if (!l.energie || !l.kater || !l.schlaf) return U.toast("Beantworte bitte noch die drei kurzen Fragen.");
    TR.speichernUndZusammenfassen();
  };
};

TR.speichernUndZusammenfassen = () => {
  const l = TR.l(), p = App.p();
  const dauer = Math.max(1, Math.round((Date.now() - l.start) / 60000));
  let volumen = 0, rekorde = 0;
  l.ue.forEach(e => { e.s.filter(s => s.ok).forEach(s => volumen += (s.kg || 0) * (e.sek ? 0 : s.wdh)); if (e.rekord) rekorde++; });
  const kcal = R.trainingsKcal(p.gewicht, dauer - (l.cardioMin || 0)) + Math.round((l.cardioMin || 0) * 0.11 * p.gewicht);
  const eintrag = { datum: l.start, name: l.name, typ: l.typ, dauer, volumen: Math.round(volumen), rekorde, kcal,
    komplett: l.komplett, energie: l.energie, kater: l.kater, schlaf: l.schlaf, deload: l.deload,
    uebungen: l.ue.map(e => ({ id: e.id, muskel: e.muskel, saetze: e.s, fb: e.fb, schmerz: e.schmerz, schmerzStelle: e.schmerzStelle, rekord: !!e.rekord, grund: l.gruende?.[e.uid] || null })) };
  S.d.log.push(eintrag);
  // Anpassung: wiederholt "keine Zeit" → Einheiten kürzer planen
  const zeitProbleme = S.d.log.slice(-3).filter(x => x.uebungen.some(u => u.grund === "zeit")).length;
  let anpassung = "";
  if (zeitProbleme >= 2 && p.dauer > 35) { p.dauer -= 10; App.planNeu(); anpassung = `Dir fehlte mehrfach die Zeit – Deine Einheiten sind jetzt auf ${p.dauer} Minuten geplant.`; S.d.log.slice(-3).forEach(x => x.uebungen.forEach(u => { if (u.grund === "zeit") u.grund = "zeit-ok"; })); }
  const neueAbz = App.abzeichenPruefen();
  S.d.laufend = null; TR.sichern(); U.wachLoesen(); clearInterval(TR.uhr);
  TR.zusammenfassung(eintrag, neueAbz, anpassung);
};

TR.zusammenfassung = (e, abz, anpassung) => {
  const w = U.$("#app"); w.className = "modus-tr";
  const spruch = T.SPRUECHE[S.d.log.length % T.SPRUECHE.length];
  w.innerHTML = `<div class="tr zusammenfassung"><div class="zf-kopf"><p>Training abgeschlossen</p><h1>${e.name}</h1></div>
    <div class="zf-raster"><div><b>${e.dauer}</b><span>Minuten</span></div><div><b>${U.kg(e.volumen, true)}</b><span>Volumen (${U.lb() ? "lb" : "kg"})</span></div>
      <div><b>${e.rekorde}</b><span>Bestleistungen</span></div><div><b>~${e.kcal}</b><span>kcal (Schätzung)</span></div></div>
    ${e.rekorde ? `<div class="zf-rekorde"><b>Neue Bestleistungen</b>${e.uebungen.filter(u => u.rekord).map(u => `<span>${UEB[u.id].name}</span>`).join("")}</div>` : ""}
    ${abz.length ? `<div class="zf-abz">${abz.map(a => `<div class="abz an"><i>${a.sym}</i><b>${a.name}</b></div>`).join("")}</div>` : ""}
    ${anpassung ? `<p class="hinweis">${anpassung}</p>` : ""}
    <p class="zf-spruch">${spruch}</p>
    <p class="klein gedimmt">Jetzt: Eiweißreiche Mahlzeit, ausreichend trinken, gut schlafen.</p>
    <button class="knopf haupt voll gross" id="zf-ok">Fertig</button></div>`;
  U.vib([30, 60, 30]); U.piep([[660, 0.1], [0, 0.05], [880, 0.1], [0, 0.05], [1100, 0.25]]);
  U.$("#zf-ok").onclick = () => { App.aktTab = "heute"; App.start(); };
};
