/* =====================================================================
   FORTSCHRITT – Check-ins, Maße, Fotos, Kraft, Volumen, Streak,
   Abzeichen, Prognose
   ===================================================================== */
window.FS = {};
FS.kraftUe = null;

FS.ansicht = async (v) => {
  const p = App.p(), c = S.d.checkins, erst = c[0], letzt = c[c.length - 1];
  const prog = R.prognose({ ...p, gewicht: erst?.gewicht || p.gewicht, kf: erst?.kf || p.kf }, 12);
  const startDatum = erst?.datum || Date.now();
  const wochenSeit = (d) => Math.round((d - startDatum) / (7 * 864e5) * 10) / 10;
  const gewPunkte = c.map(x => ({ x: wochenSeit(x.datum), y: x.gewicht }));
  const progPunkte = prog.punkte.map(x => ({ x: x.woche, y: x.gewicht }));
  const band = prog.punkte.map(x => ({ x: x.woche, lo: x.gewicht - 0.4 - x.woche * 0.08, hi: x.gewicht + 0.4 + x.woche * 0.08 }));
  const ws = P.wochenStart();
  const vol = P.volumenProMuskel(S.d.log, ws, ws + 7 * 864e5);
  const volDaten = Object.keys(T.MUSKELN).filter(m => !T.MUSKELN[m].klein || vol[m] || p.fokus.includes(m)).map(m => ({ label: T.MUSKELN[m].name.split(" ")[0].slice(0, 6), wert: vol[m] || 0, klasse: p.fokus.includes(m) ? "fokus" : "" }));
  const kraftIds = Object.keys(S.d.kraft).filter(id => S.d.kraft[id].verlauf.length);
  if (!FS.kraftUe || !kraftIds.includes(FS.kraftUe)) FS.kraftUe = kraftIds[0] || null;
  const kv = FS.kraftUe ? S.d.kraft[FS.kraftUe].verlauf : [];
  const streak = FS.streak();
  const wl = S.d.log.filter(l => l.datum >= ws).length;

  v.innerHTML = `<header class="kopf"><div><p class="kopf-datum">${c.length} Check-ins · ${S.d.log.length} Trainings</p><h1 class="kopf-titel">Fortschritt</h1></div></header>
    <button class="knopf haupt voll" id="f-check">Wöchentliches Check-in</button>
    <section class="block"><div class="block-kopf"><h2>Gewicht</h2><b>${letzt ? U.zahl(letzt.gewicht, 1) + " kg" : "–"}</b></div>
      ${U.linie([{ punkte: progPunkte, gestrichelt: true, klasse: "prog" }, { punkte: gewPunkte, klasse: "ist" }], { band, xLabel: (x) => `W${Math.round(x)}` })}
      <div class="legende"><span class="l-ist">Gemessen</span><span class="l-prog">Prognose mit Zielkorridor</span></div></section>
    <section class="block"><div class="block-kopf"><h2>Wo Du in ein paar Wochen stehst</h2></div>
      <div class="prognose">${[4, 8, 12].map(w => { const pk = prog.punkte[w]; return `<div><small>In ${w} Wochen</small><b>${U.zahl(pk.gewicht, 1)} kg</b><span>${U.zahl(pk.kf, 1)} % Körperfett</span></div>`; }).join("")}</div>
      <p class="klein gedimmt">Pro Monat realistisch: ${prog.raten.fettMonat > 0 ? `−${U.zahl(prog.raten.fettMonat, 1)} kg Fett` : "kaum Fettverlust"}, +${U.zahl(prog.raten.muskelMonat, 1)} kg Muskeln. Keine Versprechen – Schlaf, Stress und Konsequenz machen den Unterschied.</p></section>
    <section class="block"><div class="block-kopf"><h2>Maße</h2></div>${FS.masseTabelle()}</section>
    ${c.some(x => x.taille) ? `<section class="block"><div class="block-kopf"><h2>Taille</h2></div>${U.linie([{ punkte: c.filter(x => x.taille).map(x => ({ x: wochenSeit(x.datum), y: x.taille })), klasse: "ist" }], { xLabel: (x) => `W${Math.round(x)}` })}</section>` : ""}
    <section class="block"><div class="block-kopf"><h2>Fortschrittsfotos</h2><label class="knopf klein zweit" for="f-foto">+ Foto</label><input type="file" id="f-foto" accept="image/*" hidden></div><div id="fotos" class="fotos"><p class="gedimmt klein">Lädt …</p></div></section>
    <section class="block"><div class="block-kopf"><h2>Kraft</h2></div>
      ${kraftIds.length ? `<select id="f-ue" class="auswahl">${kraftIds.map(id => `<option value="${id}" ${id === FS.kraftUe ? "selected" : ""}>${UEB[id].name}</option>`).join("")}</select>
      ${U.linie([{ punkte: kv.map((x, i) => ({ x: i + 1, y: U.kgAus(x.e1) })), klasse: "ist" }], { xLabel: (x) => "#" + x })}
      <p class="klein gedimmt">Geschätztes Maximum für eine Wiederholung. Bestwert: <b>${U.kg(Math.max(0, ...kv.map(x => x.e1)))}</b> · aktuelles Arbeitsgewicht: <b>${U.kg(S.d.kraft[FS.kraftUe].kg)}</b></p>` : `<p class="gedimmt klein">Nach Deinem ersten Training siehst Du hier Deine Kraftkurven.</p>`}</section>
    <section class="block"><div class="block-kopf"><h2>Sätze pro Muskel diese Woche</h2></div>${U.balken(volDaten, { h: 170 })}<p class="klein gedimmt">Goldene Balken = Fokus-Muskeln.</p></section>
    <section class="block ziele-raster">
      <div><b>${streak}</b><span>Wochen in Folge</span></div><div><b>${wl}/${S.d.plan.tage.length}</b><span>Wochenziel</span></div><div><b>${S.d.log.reduce((s, l) => s + (l.rekorde || 0), 0)}</b><span>Bestleistungen</span></div></section>
    <section class="block"><div class="block-kopf"><h2>Abzeichen</h2></div>
      <div class="abz-gitter">${T.ABZEICHEN.map(a => `<div class="abz ${S.d.abzeichen[a.id] ? "an" : ""}" title="${a.info}"><i>${a.sym}</i><b>${a.name}</b><small>${a.info}</small></div>`).join("")}</div></section>
    <section class="block"><div class="block-kopf"><h2>Letzte Trainings</h2></div>${S.d.log.slice(-8).reverse().map(l => `<div class="eintrag"><span><b>${l.name}</b><small>${U.datumKurz(l.datum)} · ${l.dauer} Min. · ${U.kg(l.volumen)}</small></span>${l.rekorde ? `<em class="tag">${l.rekorde} PR</em>` : ""}</div>`).join("") || '<p class="gedimmt klein">Noch keine Trainings.</p>'}</section>`;
  U.$("#f-check").onclick = () => FS.checkin();
  U.$("#f-ue")?.addEventListener("change", (e) => { FS.kraftUe = e.target.value; App.neu(); });
  U.$("#f-foto").onchange = async (e) => { const f = e.target.files[0]; if (!f) return; await S.fotoSpeichern({ id: "f" + Date.now(), datum: Date.now(), bild: await S.fotoVerkleinern(f) }); U.toast("Foto gespeichert (nur auf diesem Gerät)"); FS.fotos(); };
  FS.fotos();
};

FS.masseTabelle = () => {
  const c = S.d.checkins; if (!c.length) return `<p class="gedimmt klein">Noch keine Maße.</p>`;
  const felder = [["gewicht", "Gewicht", "kg"], ["kf", "Körperfett", "%"], ["taille", "Taille", "cm"], ["huefte", "Hüfte", "cm"], ["brust", "Brust", "cm"], ["arm", "Arme", "cm"], ["schulter", "Schultern", "cm"]];
  const erst = (f) => c.find(x => x[f]), letzt = (f) => [...c].reverse().find(x => x[f]);
  return `<table class="masse"><thead><tr><th></th><th>Start</th><th>Aktuell</th><th>±</th></tr></thead><tbody>${felder.filter(([f]) => erst(f)).map(([f, n, e]) => {
    const a = erst(f)[f], b = letzt(f)[f], d = b - a;
    return `<tr><td>${n}</td><td>${U.zahl(a, 1)} ${e}</td><td>${U.zahl(b, 1)} ${e}</td><td class="${d < 0 ? "minus" : d > 0 ? "plus" : ""}">${d > 0 ? "+" : ""}${U.zahl(d, 1)}</td></tr>`; }).join("")}</tbody></table>`;
};

FS.fotos = async () => {
  const el = U.$("#fotos"); if (!el) return;
  let f = []; try { f = await S.fotos(); } catch (e) {}
  if (!f.length) { el.innerHTML = `<p class="gedimmt klein">Fotos bleiben nur auf diesem Gerät. Gleiches Licht, gleiche Pose – dann siehst Du den Unterschied.</p>`; return; }
  el.innerHTML = `${f.length >= 2 ? `<button class="knopf zweit voll" id="vgl">Vorher / Nachher vergleichen</button>` : ""}
    <div class="foto-raster">${f.slice().reverse().map(x => `<button class="foto" data-id="${x.id}"><img src="${x.bild}" alt="Foto vom ${U.datumKurz(x.datum)}"><span>${U.datumKurz(x.datum)}</span></button>`).join("")}</div>`;
  U.$("#vgl")?.addEventListener("click", () => FS.vergleich(f));
  U.$$(".foto", el).forEach(b => b.onclick = async () => {
    const x = f.find(y => y.id === b.dataset.id);
    const s = U.sheet(`<img src="${x.bild}" class="foto-gross" alt=""><p class="klein">${new Date(x.datum).toLocaleDateString("de-DE")}</p><button class="knopf zweit rot voll" id="fl">Foto löschen</button>`);
    U.$("#fl", s).onclick = async () => { await S.fotoLoeschen(x.id); s.zu(); FS.fotos(); };
  });
};

FS.vergleich = (f) => {
  const a = f[0], b = f[f.length - 1];
  const s = U.sheet(`<h3 class="sheet-titel">Vorher / Nachher</h3><div class="vgl"><img src="${a.bild}" alt="Vorher"><div class="vgl-oben" id="vo"><img src="${b.bild}" alt="Nachher"></div><div class="vgl-griff" id="vg"></div></div>
    <input type="range" min="0" max="100" value="50" class="regler" id="vr" aria-label="Vergleich verschieben">
    <div class="regler-skala"><span>${U.datumKurz(a.datum)}</span><span>${U.datumKurz(b.datum)}</span></div>`, { klasse: "hoch" });
  const z = (v) => { U.$("#vo", s).style.clipPath = `inset(0 0 0 ${v}%)`; U.$("#vg", s).style.left = v + "%"; };
  U.$("#vr", s).oninput = (e) => z(+e.target.value); z(50);
};

FS.streak = () => {
  if (!S.d.plan) return 0;
  const soll = S.d.plan.tage.length; let n = 0;
  for (let w = 1; w < 60; w++) {
    const von = P.wochenStart() - w * 7 * 864e5, bis = von + 7 * 864e5;
    if (S.d.log.filter(l => l.datum >= von && l.datum < bis).length >= soll) n++; else break;
  }
  if (S.d.log.filter(l => l.datum >= P.wochenStart()).length >= soll) n++;
  return n;
};

/* Wöchentliches Check-in */
FS.checkin = () => {
  const p = App.p(), letzt = S.d.checkins[S.d.checkins.length - 1] || {};
  const feld = (id, n, wert, info = "") => `<label class="feld"><span>${n}${info ? ` <small>${info}</small>` : ""}</span><input type="number" inputmode="decimal" step="0.1" id="c-${id}" value="${wert ?? ""}"></label>`;
  const s = U.sheet(`<h3 class="sheet-titel">Wöchentliches Check-in</h3><p class="klein gedimmt">Morgens, nüchtern, nach der Toilette – immer unter gleichen Bedingungen.</p>
    ${feld("gewicht", "Gewicht (kg)", letzt.gewicht)}
    <div class="feld-raster">${feld("taille", "Taille (cm)", letzt.taille, "Nabelhöhe")}${feld("huefte", "Hüfte (cm)", letzt.huefte)}${feld("brust", "Brust (cm)", letzt.brust)}
    ${feld("arm", "Arm (cm)", letzt.arm, "angespannt")}${feld("schulter", "Schultern (cm)", letzt.schulter)}${feld("hals", "Hals (cm)", letzt.hals, "für Körperfett")}</div>
    <h4 class="sheet-unter">Wie fühlst Du Dich?</h4><div class="segment vier" id="c-st">${["Mies", "Okay", "Gut", "Top"].map((n, i) => `<button data-v="${i}">${n}</button>`).join("")}</div>
    <label class="schalter-zeile"><span>Schwindel, Kreislaufprobleme oder anhaltende Schmerzen?</span><input type="checkbox" class="schalter" id="c-sw"></label>
    <label class="knopf zweit voll" for="c-foto">Fortschrittsfoto hinzufügen</label><input type="file" id="c-foto" accept="image/*" hidden><p class="klein" id="c-fi"></p>
    <button class="knopf haupt voll" id="c-ok">Speichern und auswerten</button>`, { klasse: "voll" });
  let stimmung = null, foto = null;
  U.$$("#c-st button", s).forEach(b => b.onclick = () => { stimmung = +b.dataset.v; U.$$("#c-st button", s).forEach(x => x.classList.toggle("an", x === b)); });
  U.$("#c-foto", s).onchange = async (e) => { const f = e.target.files[0]; if (f) { foto = await S.fotoVerkleinern(f); U.$("#c-fi", s).textContent = "Foto ausgewählt"; } };
  U.$("#c-ok", s).onclick = async () => {
    const w = (id) => { const v = parseFloat(U.$("#c-" + id, s).value.replace(",", ".")); return isNaN(v) ? null : v; };
    const c = { datum: Date.now(), gewicht: w("gewicht"), taille: w("taille"), huefte: w("huefte"), brust: w("brust"), arm: w("arm"), schulter: w("schulter"), hals: w("hals"), stimmung, schwindel: U.$("#c-sw", s).checked };
    if (!c.gewicht) return U.toast("Bitte mindestens das Gewicht eintragen.");
    const navy = R.navyKF(p.geschlecht, p.groesse, c.taille, c.hals, c.huefte);
    c.kf = navy ? Math.round(navy * 10) / 10 : (letzt.kf ? Math.round(letzt.kf + (c.gewicht - letzt.gewicht) * 0.6 / c.gewicht * 100 * 10) / 10 : p.kf);
    S.d.checkins.push(c);
    if (foto) await S.fotoSpeichern({ id: "f" + Date.now(), datum: Date.now(), bild: foto });
    // Profil aktualisieren → Kalorien passen sich an das neue Gewicht an
    p.gewicht = c.gewicht; if (navy) { p.kf = Math.round(navy); p.kfMethode = "navy"; }
    const erg = E.checkinAuswertung(p, S.d.checkins);
    p.kcalAnpassung = R.klemmen((p.kcalAnpassung || 0) + erg.delta, -500, 500);
    if (c.schwindel) { if (S.d.hinweisWeg) delete S.d.hinweisWeg.schwindel; }
    const neu = App.abzeichenPruefen();
    S.speichern(); s.zu();
    U.sheet(`<h3 class="sheet-titel">Auswertung</h3><p class="hinweis ${erg.stufe === "warn" ? "warn" : ""}">${erg.text}</p>
      ${erg.delta ? `<p class="klein">Neues Tagesziel: <b>${App.kal().ziel} kcal</b> im Schnitt.</p>` : ""}
      ${c.schwindel ? `<p class="hinweis warn">Du hast Schwindel oder anhaltende Schmerzen angegeben. Iss heute ausreichend, trink genug und lass es ärztlich abklären, wenn es nicht besser wird.</p>` : ""}
      ${neu.length ? `<div class="zf-abz">${neu.map(a => `<div class="abz an"><i>${a.sym}</i><b>${a.name}</b></div>`).join("")}</div>` : ""}`);
    App.neu();
  };
};
