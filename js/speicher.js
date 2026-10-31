/* =====================================================================
   SPEICHER – alles bleibt lokal auf Deinem Gerät.
   Daten: localStorage (Schlüssel "formwerk"), Fotos: IndexedDB.
   Export/Import als JSON-Datei (Fotos werden mit exportiert).
   ===================================================================== */
window.S = {};
window.UEB = {};
UEBUNGEN.forEach(u => UEB[u.id] = u);

S.SCHLUESSEL = "formwerk";
S.VERSION = 1;

S.leer = () => ({
  version: S.VERSION,
  profil: null,          // Onboarding-Angaben
  plan: null,            // Trainingsplan
  kraft: {},             // Gewichte und Verlauf pro Übung
  log: [],               // abgeschlossene Trainings
  laufend: null,         // gerade laufendes Training
  essen: {},             // { "2026-10-31": { eintraege: [...], wasser: 1500, gegessen: {slotIndex:true} } }
  checkins: [],          // wöchentliche Check-ins
  abfragen: [],          // wöchentliche Ernährungs-Abfragen
  einkauf: {},           // abgehakte Einkaufsposten
  abzeichen: {},         // id → Datum
  einst: { einheit: "kg", ton: true, thema: "dunkel", apiKey: "", modell: "claude-sonnet-5-5", pauseErinnerung: true },
  coach: []              // Chatverlauf
});

S.d = null;
S.laden = () => {
  try { S.d = JSON.parse(localStorage.getItem(S.SCHLUESSEL)) || S.leer(); }
  catch (e) { S.d = S.leer(); }
  S.d = Object.assign(S.leer(), S.d);
  S.d.einst = Object.assign(S.leer().einst, S.d.einst);
  return S.d;
};
S.speichern = () => {
  try { localStorage.setItem(S.SCHLUESSEL, JSON.stringify(S.d)); }
  catch (e) { U.toast("Speicher voll. Exportiere Deine Daten und lösche alte Fotos."); }
};
/* Dauerhaften Speicher anfragen (verhindert Löschen durch den Browser) */
S.dauerhaft = async () => { try { if (navigator.storage?.persist) await navigator.storage.persist(); } catch (e) {} };

/* ---------- Fotos in IndexedDB ---------- */
S.db = () => new Promise((ok, fehler) => {
  const r = indexedDB.open("formwerk-fotos", 1);
  r.onupgradeneeded = () => r.result.createObjectStore("fotos", { keyPath: "id" });
  r.onsuccess = () => ok(r.result); r.onerror = () => fehler(r.error);
});
S.fotoSpeichern = async (foto) => { const db = await S.db(); return new Promise(ok => { const t = db.transaction("fotos", "readwrite"); t.objectStore("fotos").put(foto); t.oncomplete = ok; }); };
S.fotos = async () => { const db = await S.db(); return new Promise(ok => { const r = db.transaction("fotos").objectStore("fotos").getAll(); r.onsuccess = () => ok(r.result.sort((a, b) => a.datum - b.datum)); }); };
S.fotoLoeschen = async (id) => { const db = await S.db(); return new Promise(ok => { const t = db.transaction("fotos", "readwrite"); t.objectStore("fotos").delete(id); t.oncomplete = ok; }); };
S.fotosLeeren = async () => { const db = await S.db(); return new Promise(ok => { const t = db.transaction("fotos", "readwrite"); t.objectStore("fotos").clear(); t.oncomplete = ok; }); };

/* Foto verkleinern (spart Speicher) */
S.fotoVerkleinern = (datei) => new Promise((ok) => {
  const img = new Image();
  img.onload = () => {
    const max = 900, f = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = img.width * f; c.height = img.height * f;
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    ok(c.toDataURL("image/jpeg", 0.78)); URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(datei);
});

/* ---------- Export / Import ---------- */
S.exportieren = async () => {
  const daten = { app: "Formwerk", exportiert: new Date().toISOString(), daten: { ...S.d, einst: { ...S.d.einst, apiKey: "" } }, fotos: await S.fotos() };
  const blob = new Blob([JSON.stringify(daten)], { type: "application/json" });
  const name = `formwerk-sicherung-${U.datumKey(new Date())}.json`;
  // iOS: Teilen-Menü ist am zuverlässigsten ("In Dateien sichern")
  const datei = new File([blob], name, { type: "application/json" });
  if (navigator.canShare && navigator.canShare({ files: [datei] })) {
    try { await navigator.share({ files: [datei], title: name }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
};

S.importieren = async (datei) => {
  const text = await datei.text();
  const j = JSON.parse(text);
  if (!j.daten || j.app !== "Formwerk") throw new Error("Das ist keine Formwerk-Sicherung.");
  const key = S.d.einst.apiKey;
  S.d = Object.assign(S.leer(), j.daten);
  S.d.einst = Object.assign(S.leer().einst, j.daten.einst, { apiKey: key });
  S.speichern();
  await S.fotosLeeren();
  for (const f of j.fotos || []) await S.fotoSpeichern(f);
};

S.allesLoeschen = async () => {
  localStorage.removeItem(S.SCHLUESSEL);
  await S.fotosLeeren();
  S.d = S.leer();
};
