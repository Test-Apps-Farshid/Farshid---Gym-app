/* =====================================================================
   UI-BAUSTEINE – Hilfsfunktionen, Scroll-Räder, Diagramme, Avatar,
   Muskelkarte, Ton, Benachrichtigungen, Bildschirm-wach-halten
   ===================================================================== */
window.U = {};

U.$ = (s, r = document) => r.querySelector(s);
U.$$ = (s, r = document) => [...r.querySelectorAll(s)];
U.esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
U.zahl = (x, d = 0) => Number(x).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
U.datumKey = (d) => { d = new Date(d); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
U.heuteKey = () => U.datumKey(new Date());
U.wtag = (d = new Date()) => (new Date(d).getDay() + 6) % 7; // 0 = Montag
U.TAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
U.TAGE_LANG = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
U.datumKurz = (d) => new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "short" });
U.vib = (muster) => { try { navigator.vibrate && navigator.vibrate(muster); } catch (e) {} };

/* Gewichte: intern immer kg, Anzeige je nach Einstellung */
U.lb = () => S.d?.einst?.einheit === "lb";
U.kg = (kg, ohneEinheit) => {
  if (kg === null || kg === undefined) return "–";
  const v = U.lb() ? kg * 2.2046 : kg;
  const t = U.zahl(v, v % 1 && !U.lb() ? 1 : 0);
  return ohneEinheit ? t : `${t} ${U.lb() ? "lb" : "kg"}`;
};
U.kgEin = (v) => U.lb() ? v / 2.2046 : v;
U.kgAus = (kg) => U.lb() ? Math.round(kg * 2.2046) : kg;

/* Kurze Meldung unten */
U.toast = (text) => {
  U.$$(".toast").forEach(x => x.remove());   // immer nur eine Meldung
  const t = document.createElement("div"); t.className = "toast"; t.textContent = text;
  document.body.appendChild(t); requestAnimationFrame(() => t.classList.add("an"));
  setTimeout(() => { t.classList.remove("an"); setTimeout(() => t.remove(), 300); }, 2600);
};

/* Unteres Blatt (Bottom Sheet) */
U.sheet = (html, { onClose, klasse = "" } = {}) => {
  const w = document.createElement("div"); w.className = "sheet-hg";
  w.innerHTML = `<div class="sheet ${klasse}" role="dialog" aria-modal="true"><div class="sheet-griff"></div>${html}</div>`;
  document.body.appendChild(w);
  requestAnimationFrame(() => w.classList.add("an"));
  const zu = () => { w.classList.remove("an"); setTimeout(() => w.remove(), 280); onClose && onClose(); };
  w.addEventListener("click", e => { if (e.target === w) zu(); });
  w.zu = zu;
  return w;
};

U.bestaetigen = (frage, jaText = "Ja", neinText = "Abbrechen") => new Promise(ok => {
  const s = U.sheet(`<h3 class="sheet-titel">${frage}</h3><div class="knopfreihe"><button class="knopf zweit" data-n>${neinText}</button><button class="knopf haupt" data-j>${jaText}</button></div>`,
    { onClose: () => ok(false) });
  U.$("[data-j]", s).onclick = () => { ok(true); s.zu(); };
  U.$("[data-n]", s).onclick = () => s.zu();
});

/* ---------- Scroll-Rad (iOS-artig, mit scroll-snap) ---------- */
U.rad = (wurzel, werte, start, onWechsel, format = (v) => v) => {
  const H = 44;
  wurzel.classList.add("rad");
  wurzel.innerHTML = `<div class="rad-auswahl"></div><div class="rad-scroll">${'<div class="rad-pad"></div>'}${werte.map((v, i) => `<div class="rad-item" data-i="${i}">${format(v)}</div>`).join("")}<div class="rad-pad"></div></div>`;
  const sc = U.$(".rad-scroll", wurzel);
  let idx = Math.max(0, start);
  const markieren = () => U.$$(".rad-item", sc).forEach((el, i) => el.classList.toggle("akt", i === idx));
  requestAnimationFrame(() => { sc.scrollTop = idx * H; markieren(); });
  let timer;
  sc.addEventListener("scroll", () => {
    const i = R.klemmen(Math.round(sc.scrollTop / H), 0, werte.length - 1);
    if (i !== idx) { idx = i; markieren(); U.vib(4); onWechsel(werte[idx], idx); }
    clearTimeout(timer); timer = setTimeout(() => { if (Math.abs(sc.scrollTop - idx * H) > 1) sc.scrollTo({ top: idx * H, behavior: "smooth" }); }, 120);
  }, { passive: true });
  sc.addEventListener("click", e => { const it = e.target.closest(".rad-item"); if (it) sc.scrollTo({ top: +it.dataset.i * H, behavior: "smooth" }); });
  return { setze: (i) => { idx = i; sc.scrollTop = i * H; markieren(); } };
};

/* ---------- Diagramme (reines SVG, keine Bibliothek) ---------- */
U.linie = (reihen, { h = 170, yEinheit = "", band = null, xLabel = (x) => x, nachkomma = 1 } = {}) => {
  const W = 340, pad = { l: 34, r: 10, t: 12, b: 22 };
  const alle = reihen.flatMap(r => r.punkte).concat(band ? band.flatMap(b => [{ x: b.x, y: b.lo }, { x: b.x, y: b.hi }]) : []);
  if (!alle.length) return `<div class="leer-diagramm">Noch keine Daten</div>`;
  let x0 = Math.min(...alle.map(p => p.x)), x1 = Math.max(...alle.map(p => p.x));
  let y0 = Math.min(...alle.map(p => p.y)), y1 = Math.max(...alle.map(p => p.y));
  if (x0 === x1) x1 = x0 + 1;
  const sp = (y1 - y0) || Math.abs(y1) * 0.1 || 1; y0 -= sp * 0.15; y1 += sp * 0.15;
  const X = (x) => pad.l + (x - x0) / (x1 - x0) * (W - pad.l - pad.r);
  const Y = (y) => pad.t + (1 - (y - y0) / (y1 - y0)) * (h - pad.t - pad.b);
  let s = `<svg class="diagramm" viewBox="0 0 ${W} ${h}" role="img">`;
  for (let i = 0; i <= 3; i++) {
    const yv = y0 + (y1 - y0) * i / 3, yy = Y(yv);
    s += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${yy}" y2="${yy}" class="raster"/><text x="${pad.l - 5}" y="${yy + 3}" class="achse" text-anchor="end">${U.zahl(yv, nachkomma)}</text>`;
  }
  if (band && band.length > 1) {
    const ob = band.map(b => `${X(b.x)},${Y(b.hi)}`).join(" "), un = band.slice().reverse().map(b => `${X(b.x)},${Y(b.lo)}`).join(" ");
    s += `<polygon points="${ob} ${un}" class="band"/>`;
  }
  reihen.forEach((r, ri) => {
    if (!r.punkte.length) return;
    const d = r.punkte.map((p, i) => `${i ? "L" : "M"}${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(" ");
    s += `<path d="${d}" class="reihe ${r.klasse || "r" + ri}" ${r.gestrichelt ? 'stroke-dasharray="5 5"' : ""}/>`;
    if (!r.gestrichelt) r.punkte.forEach(p => s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="3.2" class="punkt ${r.klasse || "r" + ri}"/>`);
  });
  const xs = [...new Set(alle.map(p => p.x))].sort((a, b) => a - b);
  const schritt = Math.ceil(xs.length / 5);
  xs.forEach((x, i) => { if (i % schritt === 0 || i === xs.length - 1) s += `<text x="${X(x)}" y="${h - 5}" class="achse" text-anchor="middle">${xLabel(x)}</text>`; });
  return s + `</svg>`;
};

U.balken = (daten, { h = 150, max = null, ziel = null } = {}) => {
  const W = 340, pad = { l: 8, r: 8, t: 14, b: 34 };
  const m = max || Math.max(1, ...daten.map(d => d.wert), ziel || 0);
  const bw = (W - pad.l - pad.r) / daten.length;
  let s = `<svg class="diagramm" viewBox="0 0 ${W} ${h}">`;
  daten.forEach((d, i) => {
    const bh = d.wert / m * (h - pad.t - pad.b), x = pad.l + i * bw + bw * 0.18;
    s += `<rect x="${x}" y="${h - pad.b - bh}" width="${bw * 0.64}" height="${Math.max(1, bh)}" rx="4" class="balken ${d.klasse || ""}"/>`;
    s += `<text x="${x + bw * 0.32}" y="${h - pad.b - bh - 4}" class="achse" text-anchor="middle">${d.wert}</text>`;
    s += `<text x="${x + bw * 0.32}" y="${h - pad.b + 13}" class="achse klein" text-anchor="middle">${U.esc(d.label)}</text>`;
  });
  if (ziel) { const y = h - pad.b - ziel / m * (h - pad.t - pad.b); s += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}" class="ziellinie"/>`; }
  return s + `</svg>`;
};

U.ring = (wert, ziel, { gross = 150, dicke = 14, text = "", unter = "", klasse = "" } = {}) => {
  const r = (gross - dicke) / 2, u = 2 * Math.PI * r, a = R.klemmen(wert / (ziel || 1), 0, 1);
  const ueber = wert > ziel * 1.05;
  return `<svg class="ring ${klasse}" viewBox="0 0 ${gross} ${gross}" width="${gross}" height="${gross}">
    <circle cx="${gross / 2}" cy="${gross / 2}" r="${r}" class="ring-hg" stroke-width="${dicke}"/>
    <circle cx="${gross / 2}" cy="${gross / 2}" r="${r}" class="ring-vg ${ueber ? "ueber" : ""}" stroke-width="${dicke}"
      stroke-dasharray="${u}" stroke-dashoffset="${u * (1 - a)}" transform="rotate(-90 ${gross / 2} ${gross / 2})"/>
    <text x="50%" y="48%" text-anchor="middle" class="ring-zahl">${text}</text>
    <text x="50%" y="64%" text-anchor="middle" class="ring-unter">${unter}</text></svg>`;
};

/* ---------- Körper-Avatar (stilisiert, ändert sich mit Körperfett) ---------- */
U.koerperMasse = (g, kf) => {
  kf = R.klemmen(kf, 5, 45);
  if (g === "w") return { s: 41, c: 36 + kf * 0.18, w: 21 + kf * 0.62, h: 38 + kf * 0.55, arm: 17 + kf * 0.24, bein: 30 + kf * 0.5, kf };
  return { s: 50 + (kf < 20 ? (20 - kf) * 0.2 : 0), c: 43 + kf * 0.22, w: 26 + kf * 0.78, h: 33 + kf * 0.42, arm: 20 + kf * 0.26, bein: 31 + kf * 0.45, kf };
};

/* Glatte, konisch zulaufende Gliedmaße aus Punkten [x, y, Breite] */
U.glied = (pk) => {
  const L = [], Rr = [];
  pk.forEach((p, i) => {
    const a = pk[Math.max(0, i - 1)], b = pk[Math.min(pk.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const nx = -dy * p[2] / 2, ny = dx * p[2] / 2;
    L.push([p[0] + nx, p[1] + ny]); Rr.push([p[0] - nx, p[1] - ny]);
  });
  const glatt = (pts) => pts.map((p, i) => i === 0 ? `${p[0].toFixed(1)},${p[1].toFixed(1)}` :
    `Q${pts[i - 1][0].toFixed(1)},${pts[i - 1][1].toFixed(1)} ${((p[0] + pts[i - 1][0]) / 2).toFixed(1)},${((p[1] + pts[i - 1][1]) / 2).toFixed(1)}`).join(" ");
  const r = Rr.reverse(), e1 = L[L.length - 1], s1 = r[0];
  return `M${glatt(L)} L${e1[0].toFixed(1)},${e1[1].toFixed(1)} Q${((e1[0] + s1[0]) / 2).toFixed(1)},${(e1[1] + 6).toFixed(1)} ${s1[0].toFixed(1)},${s1[1].toFixed(1)} L${glatt(r).replace(/^/, "")} Z`;
};

U.avatar = (g, kf, { overlay = "", id = "av", klein = false } = {}) => {
  const m = U.koerperMasse(g, kf);
  const cx = 100;
  const torso = `M${cx - m.s},98 C${cx - m.s - 2},112 ${cx - m.c},122 ${cx - m.c},140 C${cx - m.c},168 ${cx - m.w},184 ${cx - m.w},204
    C${cx - m.w},222 ${cx - m.h},230 ${cx - m.h},250 C${cx - m.h + 2},262 ${cx - 12},272 ${cx},270 C${cx + 12},272 ${cx + m.h - 2},262 ${cx + m.h},250
    C${cx + m.h},230 ${cx + m.w},222 ${cx + m.w},204 C${cx + m.w},184 ${cx + m.c},168 ${cx + m.c},140 C${cx + m.c},122 ${cx + m.s + 2},112 ${cx + m.s},98
    C${cx + 30},86 ${cx + 12},86 ${cx},86 C${cx - 12},86 ${cx - 30},86 ${cx - m.s},98Z`;
  const arm = (seite) => {
    const x0 = cx + seite * (m.s - 2), a = m.arm;
    const ex = cx + seite * (m.s + 10 + m.kf * 0.14), hx = cx + seite * (m.s + 15 + m.kf * 0.12);
    return `<path d="${U.glied([[x0, 100, a * 1.25], [x0 + seite * a * 0.35, 130, a * 1.05], [ex, 184, a * 0.72], [(ex + hx) / 2, 212, a * 0.82], [hx, 250, a * 0.52]])}" class="haut"/>
      <ellipse cx="${hx + seite * 1}" cy="262" rx="${a * 0.36}" ry="${a * 0.62}" class="haut"/>`;
  };
  const bein = (seite) => {
    const b = m.bein, hx = cx + seite * (m.h * 0.5), kx = cx + seite * (m.h * 0.36 + 3), fx = cx + seite * (m.h * 0.3 + 4);
    return `<path d="${U.glied([[hx, 246, b * 1.15], [hx + seite * 1, 290, b * 0.92], [kx, 338, b * 0.55], [kx + seite * 1, 358, b * 0.62], [fx, 398, b * 0.34]])}" class="haut"/>
      <ellipse cx="${fx + seite * 4}" cy="410" rx="${b * 0.3 + 2}" ry="6" class="haut"/>`;
  };
  // Sichtbarkeit von Definition (Bauchmuskeln, Brustlinie)
  const def = g === "m" ? R.klemmen((24 - m.kf) / 14, 0, 0.85) : R.klemmen((30 - m.kf) / 14, 0, 0.6);
  const bauch = R.klemmen((m.kf - (g === "m" ? 20 : 28)) / 18, 0, 1);
  let deko = "";
  if (g === "m") {
    deko += `<path d="M${cx - m.c + 8},150 Q${cx - 18},${160 + bauch * 6} ${cx - 3},150 M${cx + m.c - 8},150 Q${cx + 18},${160 + bauch * 6} ${cx + 3},150" class="kontur" opacity="${0.35 + def * 0.5}"/>`;
  } else {
    deko += `<ellipse cx="${cx - 15}" cy="146" rx="${13 + m.kf * 0.12}" ry="${11 + m.kf * 0.1}" class="haut hell"/><ellipse cx="${cx + 15}" cy="146" rx="${13 + m.kf * 0.12}" ry="${11 + m.kf * 0.1}" class="haut hell"/>`;
  }
  for (let r = 0; r < 3; r++) for (let s of [-1, 1])
    deko += `<rect x="${cx + (s < 0 ? -15 : 2)}" y="${168 + r * 19}" width="13" height="15" rx="5" class="sixpack" opacity="${def * (r === 2 ? 0.75 : 1)}"/>`;
  deko += `<line x1="${cx}" y1="160" x2="${cx}" y2="${226}" class="kontur" opacity="${def * 0.8}"/>`;
  if (bauch > 0) deko += `<ellipse cx="${cx}" cy="${212}" rx="${m.w - 6}" ry="${16 + bauch * 12}" class="bauchwoelbung" opacity="${0.1 + bauch * 0.3}"/>`;
  deko += `<ellipse cx="${cx}" cy="${222 + bauch * 6}" rx="2.2" ry="3" class="nabel"/>`;
  const groesse = klein ? 'width="120"' : "";
  return `<svg class="avatar" viewBox="0 0 200 425" ${groesse} aria-label="Körper-Avatar">
    <defs><linearGradient id="${id}-h" x1="0" x2="1"><stop offset="0" stop-color="var(--haut-1)"/><stop offset=".5" stop-color="var(--haut-2)"/><stop offset="1" stop-color="var(--haut-1)"/></linearGradient></defs>
    <g style="--hautfill:url(#${id}-h)">
      ${bein(-1)}${bein(1)}${arm(-1)}${arm(1)}
      <rect x="${cx - 9}" y="66" width="18" height="26" rx="6" class="haut"/>
      <ellipse cx="${cx}" cy="48" rx="19" ry="24" class="haut"/>
      <path d="${torso}" class="haut rumpf"/>
      ${deko}
      ${g === "m" ? "" : `<path d="M${cx - m.h + 6},252 Q${cx},266 ${cx + m.h - 6},252" class="kontur" opacity=".35"/>`}
    </g>${overlay}</svg>`;
};

/* ---------- Muskelkarte (Vorder- und Rückseite, antippbar) ---------- */
U.MUSKEL_FORMEN = {
  vorn: {
    brust: ["e,82,140,15,12,-10", "e,118,140,15,12,10"],
    sv: ["e,60,110,7,10,20", "e,140,110,7,10,-20"],
    smi: ["e,47,108,8,11,10", "e,153,108,8,11,-10"],
    bizeps: ["e,43,150,8,19,14", "e,157,150,8,19,-14"],
    ua: ["e,35,218,7,20,8", "e,165,218,7,20,-8"],
    bauch: ["r,86,162,28,62,8"],
    seite: ["e,74,200,6,20,6", "e,126,200,6,20,-6"],
    quad: ["e,83,296,11,34,4", "e,117,296,11,34,-4"],
    add: ["e,94,282,5,20,-8", "e,106,282,5,20,8"]
  },
  hinten: {
    nacken: ["p,100,74 82,98 118,98"],
    ob: ["r,80,100,40,32,8"],
    sh: ["e,49,108,8,10,0", "e,151,108,8,10,0"],
    rot: ["e,74,124,7,6,0", "e,126,124,7,6,0"],
    lat: ["e,74,160,10,26,12", "e,126,160,10,26,-12"],
    ur: ["r,88,192,24,30,8"],
    trizeps: ["e,43,150,8,19,14", "e,157,150,8,19,-14"],
    ua: ["e,35,218,7,20,8", "e,165,218,7,20,-8"],
    po: ["e,86,248,14,13,0", "e,114,248,14,13,0"],
    ham: ["e,83,300,10,30,4", "e,117,300,10,30,-4"],
    wade: ["e,83,366,9,20,2", "e,117,366,9,20,-2"]
  }
};

U.muskelkarte = (seite, aktiv = []) => {
  const formen = U.MUSKEL_FORMEN[seite];
  let o = "";
  for (const [m, liste] of Object.entries(formen)) {
    liste.forEach(f => {
      const t = f.split(",");
      const cls = `muskel ${aktiv.includes(m) ? "an" : ""}`;
      if (t[0] === "e") o += `<ellipse data-m="${m}" class="${cls}" cx="${t[1]}" cy="${t[2]}" rx="${t[3]}" ry="${t[4]}" transform="rotate(${t[5]} ${t[1]} ${t[2]})"/>`;
      if (t[0] === "r") o += `<rect data-m="${m}" class="${cls}" x="${t[1]}" y="${t[2]}" width="${t[3]}" height="${t[4]}" rx="${t[5]}"/>`;
      if (t[0] === "p") o += `<polygon data-m="${m}" class="${cls}" points="${f.slice(2).replace(/,/g, " ").replace(/(\d+) (\d+)/g, "$1,$2")}"/>`;
    });
  }
  return U.avatar("m", 16, { overlay: `<g class="karte">${o}</g>`, id: "mk" + seite });
};

/* Schmerzpunkte */
U.SCHMERZ_PUNKTE = {
  vorn: [["nacken", 100, 80], ["schulter", 54, 100], ["schulter", 146, 100], ["ellbogen", 37, 184], ["ellbogen", 163, 184],
    ["handgelenk", 32, 252], ["handgelenk", 168, 252], ["huefte", 72, 246], ["huefte", 128, 246], ["knie", 83, 338], ["knie", 117, 338], ["knoechel", 86, 400], ["knoechel", 114, 400]],
  hinten: [["nacken", 100, 82], ["schulter", 54, 102], ["schulter", 146, 102], ["ellbogen", 37, 184], ["ellbogen", 163, 184],
    ["ruecken", 100, 205], ["huefte", 80, 244], ["huefte", 120, 244], ["knie", 83, 338], ["knie", 117, 338], ["knoechel", 86, 400], ["knoechel", 114, 400]]
};
U.schmerzkarte = (seite, schmerzen) => {
  const p = U.SCHMERZ_PUNKTE[seite].map(([g, x, y]) => {
    const st = schmerzen[g] || 0;
    return `<g class="sp st${st}" data-g="${g}"><circle cx="${x}" cy="${y}" r="15" class="sp-treffer"/><circle cx="${x}" cy="${y}" r="${st ? 9 : 6}" class="sp-punkt"/></g>`;
  }).join("");
  return U.avatar("m", 16, { overlay: `<g class="karte">${p}</g>`, id: "sk" + seite });
};

/* Tacho-Symbol für die Selbsteinschätzung */
U.tacho = (a) => {
  const w = -120 + a * 240, r = 16;
  const rad = (w - 90) * Math.PI / 180;
  return `<svg viewBox="0 0 44 30" class="tacho"><path d="M6,26 A16,16 0 0 1 38,26" class="tacho-hg"/><path d="M6,26 A16,16 0 0 1 38,26" class="tacho-vg" stroke-dasharray="${50 * a} 60"/>
    <line x1="22" y1="26" x2="${22 + Math.cos(rad) * r * 0.85}" y2="${26 + Math.sin(rad) * r * 0.85}" class="tacho-nadel"/><circle cx="22" cy="26" r="2.5" class="tacho-mitte"/></svg>`;
};

/* Platzhalter, wenn ein Übungsbild fehlt */
U.platzhalter = (muskel) => `<div class="platzhalter"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" class="ph-kreis"/><path d="M14 24h20M18 18v12M30 18v12M12 21v6M36 21v6" class="ph-hantel"/></svg><span>${U.esc(T.MUSKELN[muskel]?.name || "")}</span></div>`;

/* Übungsanimation: wechselt zwischen Start- und Endbild */
U.uebungBild = (u, gross) => {
  if (!u.bilder || !u.bilder.length) return U.platzhalter(u.muskel);
  return `<div class="ue-bild ${gross ? "gross" : ""}" data-muskel="${u.muskel}">
    <img src="${u.bilder[0]}" alt="${U.esc(u.name)} – Start" loading="lazy" onerror="this.closest('.ue-bild').outerHTML=U.platzhalter(this.closest('.ue-bild').dataset.muskel)">
    ${u.bilder[1] ? `<img src="${u.bilder[1]}" alt="${U.esc(u.name)} – Ende" class="ue-b2" loading="lazy">` : ""}</div>`;
};

/* Kleine Geräte-Symbole */
U.geraetSymbol = (g) => {
  const pfade = {
    lh: "M4 24h40M10 16v16M14 18v12M38 16v16M34 18v12", kh: "M12 24h24M10 18v12M14 16v16M38 18v12M34 16v16",
    kz: "M24 6v26M18 6h12M24 32l-6 10M24 32l6 10M16 42h16", bk: "M6 28h36M10 28v12M38 28v12M14 22h22",
    kg: "M24 10a4 4 0 1 0 0 .1M24 16v14M16 22h16M24 30l-7 12M24 30l7 12", wb: "M10 24c8-12 20 12 28 0M10 24a3 3 0 1 0 0 .1M38 24a3 3 0 1 0 0 .1",
    kl: "M6 10h36M14 10v6M34 10v6M24 16v6a4 4 0 1 0 0 .1"
  };
  const d = pfade[g] || "M8 12h32v24H8zM14 20h20M14 28h12";
  return `<svg viewBox="0 0 48 48" class="geraet-sym" aria-hidden="true"><path d="${d}"/></svg>`;
};

/* ---------- Ton, Vibration, Benachrichtigung, Wake Lock ---------- */
U.audio = null;
U.audioAn = () => { // muss in einer Nutzeraktion aufgerufen werden (iOS)
  try {
    if (!U.audio) U.audio = new (window.AudioContext || window.webkitAudioContext)();
    if (U.audio.state === "suspended") U.audio.resume();
  } catch (e) {}
};
U.piep = (folge = [[880, 0.12], [0, 0.08], [880, 0.12], [0, 0.08], [1320, 0.28]]) => {
  if (!S.d.einst.ton || !U.audio) return;
  try {
    // iOS 17+: kurz "transient", damit Musik nur kurz leiser wird statt zu stoppen
    if (navigator.audioSession) navigator.audioSession.type = "transient";
    let t = U.audio.currentTime + 0.02;
    folge.forEach(([f, d]) => {
      if (f) { const o = U.audio.createOscillator(), g = U.audio.createGain(); o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(U.audio.destination); o.start(t); o.stop(t + d + 0.02); }
      t += d;
    });
    setTimeout(() => { if (navigator.audioSession) navigator.audioSession.type = "auto"; }, 1500);
  } catch (e) {}
};
U.blitz = () => { document.body.classList.add("blitz"); setTimeout(() => document.body.classList.remove("blitz"), 900); };

U.melden = async (titel, text) => {
  U.vib([200, 100, 200]); U.blitz(); U.piep();
  if (!S.d.einst.pauseErinnerung || !("Notification" in window) || Notification.permission !== "granted") return;
  if (document.visibilityState === "visible") return; // sichtbar: Ton und Blitz reichen
  try { const reg = await navigator.serviceWorker?.ready; reg && reg.showNotification(titel, { body: text, icon: "icons/icon-192.png", tag: "pause" }); } catch (e) {}
};
U.erlaubnisAnfragen = async () => {
  if (!("Notification" in window)) return "nicht";
  try { return await Notification.requestPermission(); } catch (e) { return "nicht"; }
};

U.wach = null;
U.wachHalten = async () => {
  try { if ("wakeLock" in navigator) { U.wach = await navigator.wakeLock.request("screen"); return true; } } catch (e) {}
  return false;
};
U.wachLoesen = () => { try { U.wach && U.wach.release(); } catch (e) {} U.wach = null; };
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && S.d?.laufend && !U.wach) U.wachHalten(); });

U.istIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
U.istInstalliert = () => window.navigator.standalone === true || matchMedia("(display-mode: standalone)").matches;
