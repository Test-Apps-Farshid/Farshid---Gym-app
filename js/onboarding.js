/* =====================================================================
   ONBOARDING – eine Frage pro Bildschirm
   ===================================================================== */
window.OB = {};

OB.standard = () => ({
  geschlecht: "m", geburt: { t: 1, m: 1, j: 1990 }, groesse: 178, gewicht: 85, kf: 22, kfAvatar: 22, kfMethode: "avatar", navy: {},
  ziel: null, fokus: ["brust", "bizeps", "trizeps", "sv", "smi", "sh", "bauch", "seite"],
  level: "anfaenger", jahre: 1, durchgehend: false,
  arbeit: ["sitzend"], freizeit: "leicht", schmerzen: {},
  ort: "gym", geraete: Object.keys(T.GERAETE).filter(k => !T.GERAETE[k].immer),
  frequenz: null, split: null, tage: null, dauer: null, pauseErinnerung: null,
  ern: { form: "alles", allergien: [], nichtMag: "", mahlzeiten: 4, kochzeit: "mittel", kochen: "mittel", budget: "mittel",
    alkohol: "selten", suesses: "manchmal", wasser: 1.5, stress: "mittel", supps: [] },
  schlaf: 7, kcalAnpassung: 0, planSaat: 0
});

OB.SCHRITTE = [
  { id: "geschlecht", kat: "Dein Profil" }, { id: "geburt", kat: "Dein Profil" }, { id: "groesse", kat: "Dein Profil" },
  { id: "gewicht", kat: "Dein Profil" }, { id: "kf", kat: "Dein Profil" },
  { id: "ziel", kat: "Deine Ziele" }, { id: "fokus", kat: "Deine Ziele" }, { id: "level", kat: "Deine Ziele" }, { id: "erfahrung", kat: "Deine Ziele" },
  { id: "arbeit", kat: "Deine Bedürfnisse" }, { id: "freizeit", kat: "Deine Bedürfnisse" }, { id: "schmerzen", kat: "Deine Bedürfnisse" },
  { id: "ort", kat: "Deine Bedürfnisse" }, { id: "frequenz", kat: "Deine Bedürfnisse" }, { id: "split", kat: "Deine Bedürfnisse" },
  { id: "woche", kat: "Deine Bedürfnisse" }, { id: "pause", kat: "Deine Bedürfnisse" },
  { id: "ern_form", kat: "Deine Ernährung" }, { id: "ern_alltag", kat: "Deine Ernährung" }, { id: "ern_kochen", kat: "Deine Ernährung" },
  { id: "ern_gewohn", kat: "Deine Ernährung" }, { id: "ern_erholung", kat: "Deine Ernährung" }, { id: "ern_supps", kat: "Deine Ernährung" },
  { id: "zusammen", kat: "Zusammenfassung" }
];

OB.e = null;        // Entwurf
OB.i = 0;           // aktueller Schritt
OB.bearbeiten = false;

OB.start = (bearbeiten = false) => {
  OB.e = JSON.parse(JSON.stringify(S.d.profil || S.d.entwurf || OB.standard()));
  OB.bearbeiten = bearbeiten;
  OB.i = bearbeiten ? OB.SCHRITTE.length - 1 : (S.d.entwurfSchritt || 0);
  OB.zeigen();
};

OB.merken = () => { if (!OB.bearbeiten) { S.d.entwurf = OB.e; S.d.entwurfSchritt = OB.i; S.speichern(); } };

OB.zeigen = (richtung = 1) => {
  const s = OB.SCHRITTE[OB.i];
  const wurzel = U.$("#app");
  const fortschritt = (OB.i + 1) / OB.SCHRITTE.length;
  wurzel.className = "modus-ob";
  wurzel.innerHTML = `<div class="ob">
    <header class="ob-kopf">
      <button class="ob-zurueck" aria-label="Zurück" ${OB.i === 0 && !OB.bearbeiten ? "disabled" : ""}><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="ob-kat">${s.kat}</div><div class="ob-zaehler">${OB.i + 1}/${OB.SCHRITTE.length}</div>
    </header>
    <div class="ob-balken"><div style="width:${fortschritt * 100}%"></div></div>
    <main class="ob-inhalt ${richtung > 0 ? "rein-r" : "rein-l"}" id="ob-inhalt"></main>
    <footer class="ob-fuss"><button class="knopf weiter" id="ob-weiter">Weiter</button></footer></div>`;
  const inhalt = U.$("#ob-inhalt");
  OB.r[s.id](inhalt);
  U.$(".ob-zurueck").onclick = () => {
    if (OB.bearbeiten && OB.i !== OB.SCHRITTE.length - 1) { OB.i = OB.SCHRITTE.length - 1; return OB.zeigen(-1); }
    if (OB.bearbeiten && OB.i === OB.SCHRITTE.length - 1) return App.start();
    if (OB.i > 0) { OB.i--; OB.zeigen(-1); }
  };
  U.$("#ob-weiter").onclick = () => OB.weiter();
};

OB.weiter = () => {
  const s = OB.SCHRITTE[OB.i];
  if (OB.pruef[s.id] && !OB.pruef[s.id]()) return;
  if (s.id === "zusammen") return OB.fertig();
  if (OB.bearbeiten && s.id !== "zusammen") { OB.i = OB.SCHRITTE.length - 1; OB.zeigen(); return; }
  if (OB.i < OB.SCHRITTE.length - 1) { OB.i++; OB.merken(); OB.zeigen(1); }
};
OB.knopf = (text, aktiv = true) => { const k = U.$("#ob-weiter"); k.textContent = text; k.disabled = !aktiv; };

/* Hilfen für Auswahlkarten */
OB.karten = (optionen, gewaehlt, mehrfach, onWahl, extra = () => "") =>
  `<div class="wahl-liste">${optionen.map(o => {
    const an = mehrfach ? gewaehlt.includes(o.id) : gewaehlt === o.id;
    return `<button class="wahl ${an ? "an" : ""}" data-id="${o.id}" aria-pressed="${an}">
      ${o.sym ? `<span class="wahl-sym">${o.sym}</span>` : ""}
      <span class="wahl-text"><span class="wahl-titel">${o.name}${o.tag ? `<em class="tag">${o.tag}</em>` : ""}${o.warn ? `<span class="warn-sym" title="${U.esc(o.warn)}">!</span>` : ""}</span>${o.info ? `<span class="wahl-info">${o.info}</span>` : ""}</span>
      ${mehrfach ? `<span class="haken"></span>` : ""}${extra(o)}</button>`;
  }).join("")}</div>`;
OB.kartenBinden = (wurzel, mehrfach, liste, onWahl) => {
  U.$$(".wahl", wurzel).forEach(b => b.onclick = () => {
    const id = b.dataset.id;
    if (mehrfach) {
      const i = liste.indexOf(id); i >= 0 ? liste.splice(i, 1) : liste.push(id);
      b.classList.toggle("an"); b.setAttribute("aria-pressed", b.classList.contains("an"));
    } else {
      U.$$(".wahl", wurzel).forEach(x => { x.classList.remove("an"); x.setAttribute("aria-pressed", "false"); });
      b.classList.add("an"); b.setAttribute("aria-pressed", "true");
    }
    U.vib(8); onWahl && onWahl(id);
  });
};

OB.pruef = {
  ziel: () => !!OB.e.ziel,
  arbeit: () => OB.e.arbeit.length > 0 || (U.toast("Wähle mindestens eine Arbeitsposition."), false),
  fokus: () => true,
  zusammen: () => true
};

/* ---------- Bildschirme ---------- */
OB.r = {};

OB.r.geschlecht = (w) => {
  const male = () => {
    w.innerHTML = `<h1 class="ob-titel">Wähle Dein Geschlecht</h1><p class="ob-unter">Damit Grundumsatz und Körperfett richtig berechnet werden.</p>
      <div class="avatar-buehne">${U.avatar(OB.e.geschlecht, OB.e.kf, { id: "g" })}</div>
      <div class="segment zwei">${[["w", "Weiblich"], ["m", "Männlich"]].map(([k, n]) => `<button data-g="${k}" class="${OB.e.geschlecht === k ? "an" : ""}">${n}</button>`).join("")}</div>`;
    U.$$("[data-g]", w).forEach(b => b.onclick = () => { OB.e.geschlecht = b.dataset.g; U.vib(8); male(); });
  };
  male();
};

OB.r.geburt = (w) => {
  const g = OB.e.geburt;
  const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const jahre = []; for (let j = new Date().getFullYear() - 14; j >= 1940; j--) jahre.push(j);
  w.innerHTML = `<h1 class="ob-titel">Wann bist Du geboren?</h1><p class="ob-unter" id="alter-txt"></p>
    <div class="raeder drei"><div id="r-t"></div><div id="r-m"></div><div id="r-j"></div></div>`;
  const alterZeigen = () => U.$("#alter-txt").textContent = `Du bist ${R.alter(g)} Jahre alt.`;
  const tage = Array.from({ length: 31 }, (_, i) => i + 1);
  U.rad(U.$("#r-t", w), tage, g.t - 1, v => { g.t = v; alterZeigen(); });
  U.rad(U.$("#r-m", w), monate, g.m - 1, (v, i) => { g.m = i + 1; alterZeigen(); });
  U.rad(U.$("#r-j", w), jahre, Math.max(0, jahre.indexOf(g.j)), v => { g.j = v; alterZeigen(); });
  alterZeigen();
};

OB.r.groesse = (w) => {
  const werte = Array.from({ length: 81 }, (_, i) => 140 + i);
  w.innerHTML = `<h1 class="ob-titel">Wie groß bist Du?</h1><p class="ob-unter">Körpergröße in Zentimetern</p>
    <div class="gross-zahl"><span id="gz">${OB.e.groesse}</span> cm</div><div class="raeder eins"><div id="r-g"></div></div>`;
  U.rad(U.$("#r-g", w), werte, werte.indexOf(OB.e.groesse), v => { OB.e.groesse = v; U.$("#gz").textContent = v; }, v => `${v} cm`);
};

OB.r.gewicht = (w) => {
  const ganz = Array.from({ length: 171 }, (_, i) => 40 + i), nach = Array.from({ length: 10 }, (_, i) => i);
  let g = Math.floor(OB.e.gewicht), n = Math.round((OB.e.gewicht - g) * 10);
  w.innerHTML = `<h1 class="ob-titel">Wie viel wiegst Du?</h1><p class="ob-unter">Am besten morgens nach dem Aufstehen gewogen.</p>
    <div class="gross-zahl"><span id="gz">${U.zahl(OB.e.gewicht, 1)}</span> kg</div>
    <div class="raeder zwei-k"><div id="r-g"></div><div class="komma">,</div><div id="r-n"></div></div>`;
  const setz = () => { OB.e.gewicht = g + n / 10; U.$("#gz").textContent = U.zahl(OB.e.gewicht, 1); };
  U.rad(U.$("#r-g", w), ganz, ganz.indexOf(g), v => { g = v; setz(); });
  U.rad(U.$("#r-n", w), nach, n, v => { n = v; setz(); });
};

OB.r.kf = (w) => {
  const e = OB.e;
  const text = (kf) => (T.KF_TEXT[e.geschlecht].find(([max]) => kf <= max) || [0, ""])[1];
  w.innerHTML = `<h1 class="ob-titel">Wie hoch ist Dein Körperfett?</h1>
    <div class="kf-buehne"><div class="avatar-buehne" id="kf-av">${U.avatar(e.geschlecht, e.kfAvatar, { id: "kf" })}</div>
    <div class="kf-wert"><span id="kf-zahl">${e.kfAvatar}</span><small>%</small><em class="tag">Schätzung</em></div></div>
    <input type="range" min="8" max="40" step="1" value="${e.kfAvatar}" class="regler" id="kf-r" aria-label="Körperfett in Prozent">
    <div class="regler-skala"><span>8 %</span><span>40 %</span></div>
    <p class="kf-text" id="kf-text">${text(e.kfAvatar)}</p>
    <button class="link-knopf" id="kf-genau">Genauer berechnen (Maßband)</button>
    <div id="kf-navy-info" class="hinweis klein"></div>`;
  const info = () => {
    const el = U.$("#kf-navy-info");
    if (e.navy.wert) el.innerHTML = `Maßband-Wert: <b>${U.zahl(e.navy.wert, 1)} %</b> · genutzt wird: <b>${e.kfMethode === "navy" ? "Maßband" : "Avatar-Schätzung"}</b>`;
    else el.innerHTML = "";
  };
  info();
  U.$("#kf-r").oninput = (ev) => {
    const v = +ev.target.value; e.kfAvatar = v; if (e.kfMethode !== "navy") e.kf = v;
    U.$("#kf-zahl").textContent = v; U.$("#kf-text").textContent = text(v);
    U.$("#kf-av").innerHTML = U.avatar(e.geschlecht, v, { id: "kf" });
  };
  U.$("#kf-genau").onclick = () => OB.navySheet(info);
};

OB.navySheet = (fertig) => {
  const e = OB.e, n = e.navy;
  const s = U.sheet(`<h3 class="sheet-titel">Mit dem Maßband messen</h3>
    <p class="klein">US-Navy-Formel. Locker stehen, ausatmen, Maßband waagerecht und ohne Druck.</p>
    <label class="feld"><span>Taille (cm) – auf Höhe des Bauchnabels</span><input type="number" inputmode="decimal" id="n-t" value="${n.taille || ""}"></label>
    <label class="feld"><span>Hals (cm) – unterhalb des Kehlkopfs</span><input type="number" inputmode="decimal" id="n-h" value="${n.hals || ""}"></label>
    <label class="feld"><span>Hüfte (cm) – breiteste Stelle am Po${e.geschlecht === "m" ? " (für Männer optional)" : ""}</span><input type="number" inputmode="decimal" id="n-hu" value="${n.huefte || ""}"></label>
    <div id="n-erg" class="vergleich"></div>
    <div class="knopfreihe"><button class="knopf zweit" id="n-av">Avatar-Wert nutzen</button><button class="knopf haupt" id="n-nv" disabled>Maßband-Wert nutzen</button></div>`);
  const rechnen = () => {
    const t = +U.$("#n-t", s).value, h = +U.$("#n-h", s).value, hu = +U.$("#n-hu", s).value;
    const kf = R.navyKF(e.geschlecht, e.groesse, t, h, hu);
    n.taille = t || null; n.hals = h || null; n.huefte = hu || null; n.wert = kf;
    U.$("#n-erg", s).innerHTML = kf ? `<div><small>Avatar-Schätzung</small><b>${e.kfAvatar} %</b></div><div><small>Maßband</small><b>${U.zahl(kf, 1)} %</b></div>
      <p class="klein">${Math.abs(kf - e.kfAvatar) > 5 ? "Die Werte liegen weit auseinander – das Maßband ist meist genauer." : "Die Werte passen gut zusammen."}</p>` : "";
    U.$("#n-nv", s).disabled = !kf;
  };
  U.$$("input", s).forEach(i => i.oninput = rechnen); rechnen();
  U.$("#n-av", s).onclick = () => { e.kfMethode = "avatar"; e.kf = e.kfAvatar; s.zu(); fertig(); };
  U.$("#n-nv", s).onclick = () => { e.kfMethode = "navy"; e.kf = Math.round(n.wert); s.zu(); fertig(); };
};

OB.r.ziel = (w) => {
  const e = OB.e, empf = R.empfZiel(e);
  if (!e.ziel) e.ziel = empf;
  const opt = Object.entries(T.ZIELE).map(([id, z]) => ({ id, name: z.name, info: z.info, tag: id === empf ? "Empfohlen" : "", warn: R.zielPasstNicht(e, id) }));
  w.innerHTML = `<h1 class="ob-titel">Was ist Dein Ziel?</h1><p class="ob-unter">Bei ${e.kf} % Körperfett empfehlen wir: ${T.ZIELE[empf].name}.</p>
    <div class="ziel-grafik" id="zg"></div>${OB.karten(opt, e.ziel, false)}<p class="hinweis klein" id="ziel-warn"></p>`;
  const grafik = (ziel) => {
    const kurven = { recomp: ["M10,70 C60,66 120,48 190,34", "M10,40 C60,46 120,62 190,72"], abnehmen: ["M10,60 C60,60 120,58 190,56", "M10,30 C60,42 120,62 190,76"],
      muskel: ["M10,72 C60,62 120,40 190,22", "M10,56 C60,54 120,52 190,50"], halten: ["M10,56 C60,54 120,50 190,48", "M10,46 C60,48 120,52 190,54"] }[ziel];
    U.$("#zg").innerHTML = `<svg viewBox="0 0 200 84" preserveAspectRatio="none"><path d="${kurven[0]}" class="zg-muskel"/><path d="${kurven[1]}" class="zg-fett"/>
      </svg><div class="zg-achse"><span>Heute</span><span>90 Tage</span></div>
      <div class="legende"><span class="l-muskel">Muskelmasse</span><span class="l-fett">Körperfett</span></div>`;
    U.$("#ziel-warn").textContent = R.zielPasstNicht(e, ziel) || "";
  };
  grafik(e.ziel);
  OB.kartenBinden(w, false, null, id => { e.ziel = id; grafik(id); });
};

OB.r.fokus = (w) => {
  const e = OB.e; let seite = "vorn";
  const zeichnen = () => {
    w.innerHTML = `<h1 class="ob-titel">Welche Muskeln willst Du betonen?</h1><p class="ob-unter">Beliebig viele. Tippe auf die Chips oder direkt auf den Körper.</p>
      <div class="karte-buehne"><div class="avatar-buehne klein" id="mk">${U.muskelkarte(seite, e.fokus)}</div>
      <button class="knopf klein zweit" id="mk-dreh">${seite === "vorn" ? "Rückseite" : "Vorderseite"}</button></div>
      <div class="chips">${Object.entries(T.MUSKELN).map(([k, m]) => `<button class="chip ${e.fokus.includes(k) ? "an" : ""}" data-m="${k}">${m.name}</button>`).join("")}</div>
      <p class="klein gedimmt">${e.fokus.length} ausgewählt. Fokus-Muskeln bekommen mehr Sätze und stehen früher im Training.</p>`;
    U.$("#mk-dreh").onclick = () => { seite = seite === "vorn" ? "hinten" : "vorn"; zeichnen(); };
    const wechsel = (m) => { const i = e.fokus.indexOf(m); i >= 0 ? e.fokus.splice(i, 1) : e.fokus.push(m); U.vib(8); zeichnen(); };
    U.$$(".chip", w).forEach(c => c.onclick = () => wechsel(c.dataset.m));
    U.$$(".muskel", w).forEach(c => c.addEventListener("click", () => wechsel(c.dataset.m)));
  };
  zeichnen();
};

OB.r.level = (w) => {
  const opt = T.LEVEL.map(l => ({ id: l.id, name: l.name, info: l.info, sym: U.tacho(l.tacho) }));
  w.innerHTML = `<h1 class="ob-titel">Wie schätzt Du Dich ein?</h1>${OB.karten(opt, OB.e.level, false)}`;
  OB.kartenBinden(w, false, null, id => OB.e.level = id);
};

OB.r.erfahrung = (w) => {
  const e = OB.e;
  w.innerHTML = `<h1 class="ob-titel">Wie lange trainierst Du schon?</h1>
    <div class="gross-zahl"><span id="jz">${e.jahre}</span> <small>${e.jahre === 1 ? "Jahr" : "Jahre"}</small></div>
    <input type="range" min="0" max="20" value="${e.jahre}" class="regler" id="j-r" aria-label="Jahre Training"><div class="regler-skala"><span>0</span><span>20 Jahre</span></div>
    <label class="schalter-zeile"><span>Hast Du in den letzten 3 Monaten durchgehend trainiert?</span><input type="checkbox" id="j-d" ${e.durchgehend ? "checked" : ""} class="schalter"></label>`;
  U.$("#j-r").oninput = (ev) => { e.jahre = +ev.target.value; U.$("#jz").textContent = e.jahre; U.$("#jz").nextElementSibling.textContent = e.jahre === 1 ? "Jahr" : "Jahre"; };
  U.$("#j-d").onchange = (ev) => e.durchgehend = ev.target.checked;
};

OB.r.arbeit = (w) => {
  const opt = Object.entries(T.ARBEIT).map(([id, a]) => ({ id, name: a.name }));
  w.innerHTML = `<h1 class="ob-titel">Wie arbeitest Du?</h1><p class="ob-unter">Mehrfachauswahl. Fließt in Deinen Kalorienbedarf und die Übungsauswahl ein.</p>${OB.karten(opt, OB.e.arbeit, true)}`;
  OB.kartenBinden(w, true, OB.e.arbeit);
};

OB.r.freizeit = (w) => {
  w.innerHTML = `<h1 class="ob-titel">Wie aktiv bist Du neben dem Krafttraining?</h1>${OB.karten(T.FREIZEIT, OB.e.freizeit, false)}`;
  OB.kartenBinden(w, false, null, id => OB.e.freizeit = id);
};

OB.r.schmerzen = (w) => {
  const e = OB.e; let seite = "vorn";
  const zeichnen = () => {
    const liste = Object.entries(e.schmerzen).filter(([, s]) => s);
    const stark = liste.some(([, s]) => s === 3);
    w.innerHTML = `<h1 class="ob-titel">Hast Du Schmerzen oder Verletzungen?</h1><p class="ob-unter">Tippe auf die Stellen. Der Plan meidet oder ersetzt Übungen, die sie belasten.</p>
      <div class="karte-buehne"><div class="avatar-buehne klein">${U.schmerzkarte(seite, e.schmerzen)}</div>
      <button class="knopf klein zweit" id="sk-dreh">${seite === "vorn" ? "Rückseite" : "Vorderseite"}</button></div>
      <div class="schmerz-liste">${liste.length ? liste.map(([g, s]) => `<span class="chip an st${s}">${T.GELENKE[g]}: ${["", "leicht", "mittel", "stark"][s]}</span>`).join("") : '<span class="gedimmt">Keine Beschwerden ausgewählt.</span>'}</div>
      ${stark ? `<p class="hinweis warn">Bei starken Schmerzen hol Dir bitte ärztlichen Rat, bevor Du diese Stelle trainierst.</p>` : ""}`;
    U.$("#sk-dreh").onclick = () => { seite = seite === "vorn" ? "hinten" : "vorn"; zeichnen(); };
    U.$$(".sp", w).forEach(p => p.addEventListener("click", () => {
      const g = p.dataset.g;
      const s = U.sheet(`<h3 class="sheet-titel">${T.GELENKE[g]}</h3><div class="segment vier">${["Keine", "Leicht", "Mittel", "Stark"].map((n, i) => `<button data-s="${i}" class="${(e.schmerzen[g] || 0) === i ? "an" : ""}">${n}</button>`).join("")}</div>`);
      U.$$("[data-s]", s).forEach(b => b.onclick = () => { const v = +b.dataset.s; if (v) e.schmerzen[g] = v; else delete e.schmerzen[g]; s.zu(); zeichnen(); });
    }));
  };
  zeichnen();
};

OB.r.ort = (w) => {
  const e = OB.e;
  const opt = [{ id: "gym", name: "Im Gym", info: "Maschinen, freie Gewichte, Körpergewichtsübungen" }, { id: "heim", name: "Zu Hause", info: "Wenig oder kein Equipment" }];
  w.innerHTML = `<h1 class="ob-titel">Wo trainierst Du?</h1>${OB.karten(opt, e.ort, false)}
    <button class="link-knopf" id="eq">Equipment anpassen (${e.geraete.length} ausgewählt)</button>`;
  OB.kartenBinden(w, false, null, id => {
    e.ort = id;
    e.geraete = Object.keys(T.GERAETE).filter(k => !T.GERAETE[k].immer && (id === "gym" || T.GERAETE[k].heim));
    U.$("#eq").textContent = `Equipment anpassen (${e.geraete.length} ausgewählt)`;
  });
  U.$("#eq").onclick = () => OB.equipmentSheet(e, () => U.$("#eq").textContent = `Equipment anpassen (${e.geraete.length} ausgewählt)`);
};
OB.equipmentSheet = (e, fertig) => {
  const s = U.sheet(`<h3 class="sheet-titel">Dein Equipment</h3><p class="klein">Der Plan nutzt nur, was hier ausgewählt ist.</p>
    <div class="check-liste">${Object.entries(T.GERAETE).filter(([, g]) => !g.immer).map(([k, g]) => `<label class="check"><input type="checkbox" value="${k}" ${e.geraete.includes(k) ? "checked" : ""}>${U.geraetSymbol(k)}<span>${g.name}</span></label>`).join("")}</div>
    <button class="knopf haupt voll" id="eq-ok">Übernehmen</button>`, { klasse: "hoch" });
  U.$("#eq-ok", s).onclick = () => { e.geraete = U.$$("input:checked", s).map(i => i.value); s.zu(); fertig && fertig(); };
};

OB.r.frequenz = (w) => {
  const e = OB.e, empf = R.empfFrequenz(e);
  if (!e.frequenz) e.frequenz = empf;
  const opt = [2, 3, 4, 5, 6].map(n => ({ id: String(n), name: `${n} Trainings pro Woche`, tag: n === empf ? "Empfohlen" : "" }));
  w.innerHTML = `<h1 class="ob-titel">Wie oft willst Du trainieren?</h1><p class="ob-unter">Lieber realistisch als zu viel – Regelmäßigkeit bringt die Ergebnisse.</p>${OB.karten(opt, String(e.frequenz), false)}`;
  OB.kartenBinden(w, false, null, id => { e.frequenz = +id; e.split = null; e.tage = null; e.dauer = null; });
};

OB.r.split = (w) => {
  const e = OB.e, empf = R.empfSplit(e.frequenz, e.level);
  if (!e.split) e.split = empf;
  const opt = Object.entries(T.SPLITS).map(([id, s]) => ({ id, name: s.name, info: s.info, tag: id === empf ? "Empfohlen" : "",
    warn: id === "bro" && e.frequenz !== 5 ? "Ein Bro-Split braucht 5 Tage – sonst fehlen Muskelgruppen." : null }));
  w.innerHTML = `<h1 class="ob-titel">Welcher Trainingssplit?</h1><p class="ob-unter">Bei ${e.frequenz} Tagen empfehlen wir ${T.SPLITS[empf].name}.</p>${OB.karten(opt, e.split, false)}`;
  OB.kartenBinden(w, false, null, id => { e.split = id; e.tage = null; });
};

OB.r.woche = (w) => {
  const e = OB.e;
  if (!e.tage || e.tage.length !== e.frequenz) e.tage = P.standardTage(e.frequenz);
  if (!e.dauer) e.dauer = R.empfDauer(e);
  const empfD = R.empfDauer(e);
  const vorl = P.VORLAGEN[e.split];
  let auswahl = null;
  const zeichnen = () => {
    const typ = {}; e.tage.forEach((t, i) => typ[t] = vorl[i % vorl.length]);
    w.innerHTML = `<h1 class="ob-titel">Deine Trainingswoche</h1><p class="ob-unter">Tippe zwei Tage nacheinander an, um sie zu tauschen.</p>
      <div class="kapseln">${U.TAGE.map((t, i) => `<button class="kapsel ${typ[i] ? "f-" + T.TAGFARBE[typ[i].typ] : "frei"} ${auswahl === i ? "gewaehlt" : ""}" data-t="${i}">
        <span class="k-tag">${t}</span><span class="k-typ">${typ[i] ? typ[i].name.replace("körper", ".") : "Ruhe"}</span></button>`).join("")}</div>
      <p class="klein gedimmt">${auswahl === null ? "Gold = Oberkörper/Push, Orange = Unterkörper/Beine, Bernstein = Pull." : `${U.TAGE_LANG[auswahl]} gewählt – jetzt den Zieltag antippen.`}</p>
      <h2 class="ob-zwischentitel">Dauer der Einheit</h2>
      <div class="gross-zahl"><span id="dz">${e.dauer}</span> <small>Min.</small></div>
      <div class="regler-wrap"><input type="range" min="30" max="120" step="5" value="${e.dauer}" class="regler" id="d-r" aria-label="Dauer in Minuten">
      <div class="regler-marke" style="left:${(empfD - 30) / 90 * 100}%"><span>Empfohlen</span></div></div>
      <div class="regler-skala"><span>30</span><span>120 Min.</span></div>`;
    U.$$(".kapsel", w).forEach(k => k.onclick = () => {
      const t = +k.dataset.t;
      if (auswahl === null) { auswahl = t; U.vib(8); }
      else if (auswahl === t) auswahl = null;
      else {
        const ia = e.tage.indexOf(auswahl), ib = e.tage.indexOf(t);
        if (ia >= 0 && ib >= 0) { e.tage[ia] = t; e.tage[ib] = auswahl; }   // zwei Trainings tauschen
        else if (ia >= 0) e.tage[ia] = t;                                    // Training auf Ruhetag verschieben
        else if (ib >= 0) e.tage[ib] = auswahl;
        auswahl = null; U.vib([8, 40, 8]);
      }
      zeichnen();
    });
    U.$("#d-r").oninput = (ev) => { e.dauer = +ev.target.value; U.$("#dz").textContent = e.dauer; };
  };
  zeichnen();
};

OB.r.pause = (w) => {
  const e = OB.e;
  const ios = U.istIOS(), inst = U.istInstalliert();
  w.innerHTML = `<h1 class="ob-titel">Erinnerung, wenn die Pause vorbei ist?</h1>
    <div class="benachrichtigung-demo"><div class="bd-kopf"><span class="bd-icon"></span>Formwerk<span>jetzt</span></div>
    <b>Weiter geht's!</b><p>Deine Pause für die Übung Bankdrücken ist vorbei.</p></div>
    <p class="ob-unter">Ton, Bildschirm-Blitz und – wo möglich – Vibration und Mitteilung.</p>
    ${ios && !inst ? `<p class="hinweis klein">Auf dem iPhone funktionieren Mitteilungen erst, wenn die App über „Zum Home-Bildschirm" installiert ist (ab iOS 16.4). Den Ton bekommst Du immer.</p>` : ""}
    ${ios ? `<p class="hinweis klein">Hinweis: iOS hält Web-Apps im Hintergrund an. Lass die App während des Trainings offen – der Bildschirm bleibt dafür an.</p>` : ""}
    <div class="knopfreihe senkrecht"><button class="knopf zweit" id="p-spaeter">Vielleicht später</button><button class="knopf haupt" id="p-ja">Erinnere mich!</button></div>`;
  U.$("#ob-weiter").style.display = "none";
  U.$("#p-spaeter").onclick = () => { e.pauseErinnerung = false; S.d.einst.pauseErinnerung = false; OB.weiter(); };
  U.$("#p-ja").onclick = async () => { U.audioAn(); e.pauseErinnerung = true; S.d.einst.pauseErinnerung = true; await U.erlaubnisAnfragen(); U.piep([[880, 0.1]]); OB.weiter(); };
};

OB.r.ern_form = (w) => {
  const n = OB.e.ern;
  const opt = Object.entries(T.ERNAEHRUNGSFORM).map(([id, name]) => ({ id, name }));
  w.innerHTML = `<h1 class="ob-titel">Wie ernährst Du Dich?</h1>${OB.karten(opt, n.form, false)}
    <h2 class="ob-zwischentitel">Allergien und Unverträglichkeiten</h2>
    <div class="chips" id="all">${Object.entries(T.ALLERGENE).map(([k, a]) => `<button class="chip ${n.allergien.includes(k) ? "an" : ""}" data-a="${k}">${a}</button>`).join("")}</div>`;
  OB.kartenBinden(U.$(".wahl-liste", w), false, null, id => n.form = id);
  U.$$("[data-a]", w).forEach(c => c.onclick = () => { const i = n.allergien.indexOf(c.dataset.a); i >= 0 ? n.allergien.splice(i, 1) : n.allergien.push(c.dataset.a); c.classList.toggle("an"); });
};

OB.r.ern_alltag = (w) => {
  const n = OB.e.ern;
  w.innerHTML = `<h1 class="ob-titel">Was magst Du nicht?</h1>
    <label class="feld"><span>Lebensmittel, die Du nicht magst (mit Komma trennen)</span><input type="text" id="nm" value="${U.esc(n.nichtMag)}" placeholder="z. B. Thunfisch, Pilze, Quark"></label>
    <h2 class="ob-zwischentitel">Mahlzeiten pro Tag</h2>
    <div class="segment vier">${[3, 4, 5, 6].map(z => `<button data-z="${z}" class="${n.mahlzeiten === z ? "an" : ""}">${z}</button>`).join("")}</div>
    <p class="klein gedimmt">An Trainingstagen werden zwei davon zu Mahlzeiten vor und nach dem Training.</p>`;
  U.$("#nm").oninput = (ev) => n.nichtMag = ev.target.value;
  U.$$("[data-z]", w).forEach(b => b.onclick = () => { n.mahlzeiten = +b.dataset.z; U.$$("[data-z]", w).forEach(x => x.classList.toggle("an", x === b)); });
};

OB.seg = (w, feld, obj, optionen) => {
  const html = `<div class="segment ${optionen.length === 3 ? "drei" : "vier"}" data-feld="${feld}">${optionen.map(([k, n]) => `<button data-v="${k}" class="${obj[feld] === k ? "an" : ""}">${n}</button>`).join("")}</div>`;
  return html;
};
OB.segBinden = (w, obj) => U.$$("[data-feld]", w).forEach(seg => U.$$("button", seg).forEach(b => b.onclick = () => {
  const v = b.dataset.v; obj[seg.dataset.feld] = isNaN(+v) ? v : +v; U.$$("button", seg).forEach(x => x.classList.toggle("an", x === b));
}));

OB.r.ern_kochen = (w) => {
  const n = OB.e.ern;
  w.innerHTML = `<h1 class="ob-titel">Kochen und Budget</h1>
    <h2 class="ob-zwischentitel">Wie viel Zeit hast Du zum Kochen?</h2>${OB.seg(w, "kochzeit", n, [["kurz", "Bis 15 Min."], ["mittel", "Bis 30 Min."], ["lang", "Gern länger"]])}
    <h2 class="ob-zwischentitel">Deine Kochkenntnisse</h2>${OB.seg(w, "kochen", n, [["anfaenger", "Einsteiger"], ["mittel", "Solide"], ["gut", "Gut"]])}
    <h2 class="ob-zwischentitel">Budget für Lebensmittel</h2>${OB.seg(w, "budget", n, [["niedrig", "Niedrig"], ["mittel", "Mittel"], ["hoch", "Hoch"]])}`;
  OB.segBinden(w, n);
};

OB.r.ern_gewohn = (w) => {
  const n = OB.e.ern;
  w.innerHTML = `<h1 class="ob-titel">Deine Gewohnheiten</h1>
    <h2 class="ob-zwischentitel">Alkohol im Alltag</h2>${OB.seg(w, "alkohol", n, [["nie", "Nie"], ["selten", "Selten"], ["woche", "Wöchentlich"], ["oft", "Mehrmals pro Woche"]])}
    <h2 class="ob-zwischentitel">Süßes im Alltag</h2>${OB.seg(w, "suesses", n, [["selten", "Selten"], ["manchmal", "Manchmal"], ["taeglich", "Täglich"]])}
    <h2 class="ob-zwischentitel">Wie viel hast Du heute getrunken?</h2>
    <div class="gross-zahl"><span id="wz">${U.zahl(n.wasser, 1)}</span> <small>Liter</small></div>
    <input type="range" min="0" max="4" step="0.25" value="${n.wasser}" class="regler" id="w-r" aria-label="Wasser in Litern">`;
  OB.segBinden(w, n);
  U.$("#w-r").oninput = (ev) => { n.wasser = +ev.target.value; U.$("#wz").textContent = U.zahl(n.wasser, 2).replace(/,?0+$/, "") || "0"; };
};

OB.r.ern_erholung = (w) => {
  const e = OB.e, n = e.ern;
  w.innerHTML = `<h1 class="ob-titel">Schlaf und Stress</h1>
    <h2 class="ob-zwischentitel">Wie viel schläfst Du pro Nacht?</h2>
    <div class="gross-zahl"><span id="sz">${U.zahl(e.schlaf, 1)}</span> <small>Stunden</small></div>
    <input type="range" min="4" max="10" step="0.5" value="${e.schlaf}" class="regler" id="s-r" aria-label="Schlaf in Stunden">
    <h2 class="ob-zwischentitel">Dein Stresslevel</h2>${OB.seg(w, "stress", n, [["niedrig", "Niedrig"], ["mittel", "Mittel"], ["hoch", "Hoch"]])}`;
  OB.segBinden(w, n);
  U.$("#s-r").oninput = (ev) => { e.schlaf = +ev.target.value; U.$("#sz").textContent = U.zahl(e.schlaf, 1); };
};

OB.r.ern_supps = (w) => {
  const n = OB.e.ern;
  const opt = Object.entries(T.SUPPS).map(([id, name]) => ({ id, name }));
  w.innerHTML = `<h1 class="ob-titel">Supplemente</h1><p class="ob-unter">Freiwillig. Die App gibt nur sachliche Hinweise – nichts davon ist Pflicht.</p>${OB.karten(opt, n.supps, true)}`;
  OB.kartenBinden(w, true, n.supps, id => {
    if (id === "keine" && n.supps.includes("keine")) { n.supps.splice(0, n.supps.length, "keine"); U.$$(".wahl", w).forEach(b => b.classList.toggle("an", b.dataset.id === "keine")); }
    else if (id !== "keine") { const i = n.supps.indexOf("keine"); if (i >= 0) { n.supps.splice(i, 1); U.$('.wahl[data-id="keine"]', w).classList.remove("an"); } }
  });
};

OB.r.zusammen = (w) => {
  const e = OB.e;
  const warn = R.sicherheit(e);
  const block = warn.some(x => x.stufe === "block");
  const zeile = (titel, wert, schritt) => `<div class="zs-zeile"><span>${titel}</span><b>${wert}</b><button class="link-knopf" data-s="${schritt}">Ändern</button></div>`;
  const i = (id) => OB.SCHRITTE.findIndex(s => s.id === id);
  w.innerHTML = `<h1 class="ob-titel">Deine Angaben</h1>
    ${warn.map(x => `<p class="hinweis ${x.stufe === "block" ? "warn" : x.stufe === "warn" ? "warn" : ""}">${x.text}</p>`).join("")}
    <section class="zs"><h2>Profil</h2>
      ${zeile("Geschlecht", e.geschlecht === "m" ? "Männlich" : "Weiblich", i("geschlecht"))}
      ${zeile("Alter", R.alter(e.geburt) + " Jahre", i("geburt"))}
      ${zeile("Größe", e.groesse + " cm", i("groesse"))}
      ${zeile("Gewicht", U.zahl(e.gewicht, 1) + " kg", i("gewicht"))}
      ${zeile("Körperfett", e.kf + " % (" + (e.kfMethode === "navy" ? "Maßband" : "Schätzung") + ")", i("kf"))}</section>
    <section class="zs"><h2>Ziele</h2>
      ${zeile("Ziel", T.ZIELE[e.ziel].name, i("ziel"))}
      ${zeile("Fokus", e.fokus.map(m => T.MUSKELN[m].name).join(", ") || "–", i("fokus"))}
      ${zeile("Einschätzung", T.LEVEL.find(l => l.id === e.level).name, i("level"))}
      ${zeile("Erfahrung", e.jahre + " Jahre" + (e.durchgehend ? ", durchgehend" : ""), i("erfahrung"))}</section>
    <section class="zs"><h2>Bedürfnisse</h2>
      ${zeile("Arbeit", e.arbeit.map(a => T.ARBEIT[a].name).join(", "), i("arbeit"))}
      ${zeile("Freizeit", T.FREIZEIT.find(f => f.id === e.freizeit).name, i("freizeit"))}
      ${zeile("Beschwerden", Object.keys(e.schmerzen).map(g => T.GELENKE[g]).join(", ") || "Keine", i("schmerzen"))}
      ${zeile("Ort", (e.ort === "gym" ? "Gym" : "Zu Hause") + `, ${e.geraete.length} Geräte`, i("ort"))}
      ${zeile("Training", `${e.frequenz}× pro Woche, ${T.SPLITS[e.split].name}`, i("frequenz"))}
      ${zeile("Tage", e.tage.slice().sort((a, b) => a - b).map(t => U.TAGE[t]).join(", ") + `, ${e.dauer} Min.`, i("woche"))}</section>
    <section class="zs"><h2>Ernährung</h2>
      ${zeile("Form", T.ERNAEHRUNGSFORM[e.ern.form] + (e.ern.allergien.length ? ", ohne " + e.ern.allergien.map(a => T.ALLERGENE[a]).join(", ") : ""), i("ern_form"))}
      ${zeile("Mahlzeiten", e.ern.mahlzeiten + " pro Tag", i("ern_alltag"))}
      ${zeile("Schlaf", U.zahl(e.schlaf, 1) + " Std., Stress " + e.ern.stress, i("ern_erholung"))}
      ${zeile("Supplemente", e.ern.supps.map(s => T.SUPPS[s]).join(", ") || "Keine Angabe", i("ern_supps"))}</section>
    <p class="klein gedimmt">${T.HINWEIS}</p>`;
  U.$$("[data-s]", w).forEach(b => b.onclick = () => { OB.bearbeiten = true; OB.i = +b.dataset.s; OB.zeigen(1); });
  OB.knopf(S.d.profil ? "Plan neu berechnen" : "Meinen Plan erstellen", !block);
};

OB.fertig = () => {
  const e = OB.e;
  const lade = document.createElement("div"); lade.className = "lade";
  lade.innerHTML = `<div class="lade-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="lr-hg"/><circle cx="60" cy="60" r="52" class="lr-vg"/></svg><span id="lade-pz">0 %</span></div>
    <h2>Dein Plan wird berechnet …</h2><p id="lade-txt">Grundumsatz berechnen</p>`;
  document.body.appendChild(lade);
  const texte = ["Grundumsatz berechnen", "Kalorien und Makros festlegen", "Übungen nach Equipment und Beschwerden filtern", "Fokus-Muskeln priorisieren", "Mesozyklus mit Deload planen", "Ernährungsplan zusammenstellen", "Fertig"];
  let k = 0;
  const t0 = performance.now(), dauer = 3200;
  const schritt = (t) => {
    const a = Math.min(1, (t - t0) / dauer);
    U.$("#lade-pz").textContent = Math.round(a * 100) + " %";
    const ki = Math.min(texte.length - 1, Math.floor(a * texte.length));
    if (ki !== k) { k = ki; U.$("#lade-txt").textContent = texte[k]; }
    if (a < 1) requestAnimationFrame(schritt);
    else {
      const altesProfil = S.d.profil;
      S.d.profil = e;
      const plan = P.erstellen(e);
      // Beim Neuberechnen Start und laufende Woche behalten
      if (S.d.plan && altesProfil) { plan.start = S.d.plan.start; }
      S.d.plan = plan;
      if (!altesProfil) { S.d.checkins.push({ datum: Date.now(), gewicht: e.gewicht, kf: e.kf, taille: e.navy.taille || null, huefte: e.navy.huefte || null, start: true }); }
      delete S.d.entwurf; delete S.d.entwurfSchritt;
      S.speichern(); S.dauerhaft();
      lade.classList.add("weg"); setTimeout(() => lade.remove(), 400);
      App.start(); App.tab("heute");
    }
  };
  requestAnimationFrame(schritt);
};
