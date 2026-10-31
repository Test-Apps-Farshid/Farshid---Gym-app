/* =====================================================================
   ÜBUNGSDATENBANK
   ---------------------------------------------------------------------
   Bilder: free-exercise-db (github.com/yuhonas/free-exercise-db),
   gemeinfrei (Unlicense). Pro Übung zwei Bilder: Start- und Endposition.
   Die App blendet beide im Wechsel ein und erzeugt so die Animation.

   NEUE ÜBUNG ERGÄNZEN – einfach ein Objekt anhängen:
   {
     id: "eindeutiger_name",          // nur Kleinbuchstaben und _
     name: "Anzeigename",
     muskel: "brust",                  // Hauptmuskel (Schlüssel siehe MUSKELN)
     sekundaer: ["trizeps"],           // weitere Muskeln
     geraet: ["kh","bk"],              // ALLE nötigen Geräte (siehe GERAETE)
     level: 1,                         // 1 leicht, 2 mittel, 3 schwer
     gelenke: { schulter: 2 },         // Belastung 1 gering, 2 hoch (Schmerzfilter)
     typ: "grund",                     // grund | isolation | core | cardio | dehnen
     bilder: ["img/uebungen/x_0.jpg","img/uebungen/x_1.jpg"], // leer = Platzhalter
     tipp: "Technikhinweis", fehler: "Häufiger Fehler"
   }
   ===================================================================== */
window.UEBUNGEN = [
{
"id": "bankdruecken_lh",
"name": "Bankdrücken Langhantel",
"muskel": "brust",
"sekundaer": [
"sv",
"trizeps"
],
"geraet": [
"lh",
"bk"
],
"level": 2,
"gelenke": {
"schulter": 2,
"ellbogen": 1,
"handgelenk": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/bankdruecken_lh_0.jpg",
"img/uebungen/bankdruecken_lh_1.jpg"
],
"quelle": "Barbell_Bench_Press_-_Medium_Grip",
"tipp": "Schulterblätter zusammen, Stange zur unteren Brust führen.",
"fehler": "Ellbogen 90° abgespreizt, Po hebt ab."
},
{
"id": "schraegbank_lh",
"name": "Schrägbankdrücken Langhantel",
"muskel": "brust",
"sekundaer": [
"sv",
"trizeps"
],
"geraet": [
"lh",
"bk"
],
"level": 2,
"gelenke": {
"schulter": 2,
"ellbogen": 1,
"handgelenk": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/schraegbank_lh_0.jpg",
"img/uebungen/schraegbank_lh_1.jpg"
],
"quelle": "Barbell_Incline_Bench_Press_-_Medium_Grip",
"tipp": "Bank 30°, Stange zum oberen Brustbereich.",
"fehler": "Bank zu steil – dann arbeitet nur die Schulter."
},
{
"id": "bankdruecken_kh",
"name": "Bankdrücken Kurzhanteln",
"muskel": "brust",
"sekundaer": [
"sv",
"trizeps"
],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/bankdruecken_kh_0.jpg",
"img/uebungen/bankdruecken_kh_1.jpg"
],
"quelle": "Dumbbell_Bench_Press",
"tipp": "Hanteln tief absenken, oben nicht zusammenschlagen.",
"fehler": "Hanteln zu weit außen, Schulter rollt nach vorn."
},
{
"id": "schraegbank_kh",
"name": "Schrägbankdrücken Kurzhanteln",
"muskel": "brust",
"sekundaer": [
"sv",
"trizeps"
],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/schraegbank_kh_0.jpg",
"img/uebungen/schraegbank_kh_1.jpg"
],
"quelle": "Incline_Dumbbell_Press",
"tipp": "Bank 30°, Ellbogen leicht zum Körper.",
"fehler": "Hohlkreuz statt fester Brust."
},
{
"id": "neutral_kh",
"name": "Kurzhantel-Drücken neutraler Griff",
"muskel": "brust",
"sekundaer": [
"trizeps",
"sv"
],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/neutral_kh_0.jpg",
"img/uebungen/neutral_kh_1.jpg"
],
"quelle": "Dumbbell_Bench_Press_with_Neutral_Grip",
"tipp": "Handflächen zueinander – schont die Schulter.",
"fehler": "Zu schnell absenken."
},
{
"id": "brustpresse",
"name": "Brustpresse Maschine",
"muskel": "brust",
"sekundaer": [
"sv",
"trizeps"
],
"geraet": [
"bp"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/brustpresse_0.jpg",
"img/uebungen/brustpresse_1.jpg"
],
"quelle": "Machine_Bench_Press",
"tipp": "Sitz so einstellen, dass Griffe auf Brusthöhe liegen.",
"fehler": "Schultern hochziehen."
},
{
"id": "brustpresse_schraeg",
"name": "Schrägbank-Brustpresse Maschine",
"muskel": "brust",
"sekundaer": [
"sv",
"trizeps"
],
"geraet": [
"bp"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/brustpresse_schraeg_0.jpg",
"img/uebungen/brustpresse_schraeg_1.jpg"
],
"quelle": "Leverage_Incline_Chest_Press",
"tipp": "Oberer Brustanteil, Brust raus.",
"fehler": "Rücken löst sich vom Polster."
},
{
"id": "smith_bank",
"name": "Bankdrücken Multipresse",
"muskel": "brust",
"sekundaer": [
"sv",
"trizeps"
],
"geraet": [
"sm",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/smith_bank_0.jpg",
"img/uebungen/smith_bank_1.jpg"
],
"quelle": "Smith_Machine_Bench_Press",
"tipp": "Bank so stellen, dass Stange auf untere Brust trifft.",
"fehler": "Bank falsch positioniert."
},
{
"id": "smith_schraeg",
"name": "Schrägbankdrücken Multipresse",
"muskel": "brust",
"sekundaer": [
"sv",
"trizeps"
],
"geraet": [
"sm",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/smith_schraeg_0.jpg",
"img/uebungen/smith_schraeg_1.jpg"
],
"quelle": "Smith_Machine_Incline_Bench_Press",
"tipp": "Kontrolliert ablassen, 1 Sek. Pause.",
"fehler": "Stange abprallen lassen."
},
{
"id": "butterfly",
"name": "Butterfly Maschine",
"muskel": "brust",
"sekundaer": [
"sv"
],
"geraet": [
"bf"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/butterfly_0.jpg",
"img/uebungen/butterfly_1.jpg"
],
"quelle": "Butterfly",
"tipp": "Leichte Beugung im Ellbogen, Brust zusammendrücken.",
"fehler": "Mit den Armen statt der Brust ziehen."
},
{
"id": "kabel_crossover",
"name": "Kabel-Crossover",
"muskel": "brust",
"sekundaer": [
"sv"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/kabel_crossover_0.jpg",
"img/uebungen/kabel_crossover_1.jpg"
],
"quelle": "Cable_Crossover",
"tipp": "Leicht nach vorn lehnen, Hände vor der Brust treffen.",
"fehler": "Zu viel Gewicht, Arme beugen sich stark."
},
{
"id": "kabel_crossover_tief",
"name": "Kabel-Crossover von unten",
"muskel": "brust",
"sekundaer": [
"sv"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/kabel_crossover_tief_0.jpg",
"img/uebungen/kabel_crossover_tief_1.jpg"
],
"quelle": "Low_Cable_Crossover",
"tipp": "Zieht von unten nach oben – betont die obere Brust.",
"fehler": "Hohlkreuz."
},
{
"id": "fliegende_kh",
"name": "Fliegende Kurzhanteln",
"muskel": "brust",
"sekundaer": [
"sv"
],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 2
},
"typ": "isolation",
"bilder": [
"img/uebungen/fliegende_kh_0.jpg",
"img/uebungen/fliegende_kh_1.jpg"
],
"quelle": "Dumbbell_Flyes",
"tipp": "Nur so tief, wie es in der Schulter angenehm ist.",
"fehler": "Zu tief absenken."
},
{
"id": "schraeg_fliegende",
"name": "Schrägbank-Fliegende",
"muskel": "brust",
"sekundaer": [
"sv"
],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 2
},
"typ": "isolation",
"bilder": [
"img/uebungen/schraeg_fliegende_0.jpg",
"img/uebungen/schraeg_fliegende_1.jpg"
],
"quelle": "Incline_Dumbbell_Flyes",
"tipp": "Bank 30°, langsamer Weg nach unten.",
"fehler": "Arme werden gestreckt."
},
{
"id": "liegestuetz",
"name": "Liegestütz",
"muskel": "brust",
"sekundaer": [
"trizeps",
"sv",
"bauch"
],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1,
"handgelenk": 2
},
"typ": "grund",
"bilder": [
"img/uebungen/liegestuetz_0.jpg",
"img/uebungen/liegestuetz_1.jpg"
],
"quelle": "Pushups",
"tipp": "Körper bildet eine Linie, Brust fast zum Boden.",
"fehler": "Hüfte hängt durch."
},
{
"id": "liegestuetz_erhoeht",
"name": "Liegestütz erhöht (Hände auf Bank)",
"muskel": "brust",
"sekundaer": [
"trizeps",
"sv"
],
"geraet": [
"kg",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1,
"handgelenk": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/liegestuetz_erhoeht_0.jpg",
"img/uebungen/liegestuetz_erhoeht_1.jpg"
],
"quelle": "Incline_Push-Up",
"tipp": "Leichtere Variante – je höher die Hände, desto leichter.",
"fehler": "Kopf nach vorn strecken."
},
{
"id": "liegestuetz_fuesse",
"name": "Liegestütz Füße erhöht",
"muskel": "brust",
"sekundaer": [
"sv",
"trizeps"
],
"geraet": [
"kg",
"bk"
],
"level": 2,
"gelenke": {
"schulter": 2,
"ellbogen": 1,
"handgelenk": 2
},
"typ": "grund",
"bilder": [
"img/uebungen/liegestuetz_fuesse_0.jpg",
"img/uebungen/liegestuetz_fuesse_1.jpg"
],
"quelle": "Decline_Push-Up",
"tipp": "Betont die obere Brust.",
"fehler": "Hüfte zu hoch."
},
{
"id": "dips_brust",
"name": "Dips (Brust)",
"muskel": "brust",
"sekundaer": [
"trizeps",
"sv"
],
"geraet": [
"dp"
],
"level": 3,
"gelenke": {
"schulter": 2,
"ellbogen": 2
},
"typ": "grund",
"bilder": [
"img/uebungen/dips_brust_0.jpg",
"img/uebungen/dips_brust_1.jpg"
],
"quelle": "Dips_-_Chest_Version",
"tipp": "Oberkörper nach vorn lehnen, nur bis 90°.",
"fehler": "Zu tief – belastet die Schulter."
},
{
"id": "band_brustpresse",
"name": "Brustpresse mit Band",
"muskel": "brust",
"sekundaer": [
"trizeps"
],
"geraet": [
"wb"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/band_brustpresse_0.jpg",
"img/uebungen/band_brustpresse_1.jpg"
],
"quelle": "Bench_Press_-_With_Bands",
"tipp": "Band hinter dem Rücken, nach vorn drücken.",
"fehler": "Band zu locker."
},
{
"id": "pullover_kh",
"name": "Kurzhantel-Pullover",
"muskel": "brust",
"sekundaer": [
"lat",
"trizeps"
],
"geraet": [
"kh",
"bk"
],
"level": 2,
"gelenke": {
"schulter": 2
},
"typ": "isolation",
"bilder": [
"img/uebungen/pullover_kh_0.jpg",
"img/uebungen/pullover_kh_1.jpg"
],
"quelle": "Straight-Arm_Dumbbell_Pullover",
"tipp": "Arme fast gestreckt, Rippen unten halten.",
"fehler": "Zu tief hinter den Kopf."
},
{
"id": "schulterdruecken_kh",
"name": "Schulterdrücken Kurzhanteln sitzend",
"muskel": "sv",
"sekundaer": [
"smi",
"trizeps"
],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/schulterdruecken_kh_0.jpg",
"img/uebungen/schulterdruecken_kh_1.jpg"
],
"quelle": "Dumbbell_Shoulder_Press",
"tipp": "Rücken angelehnt, Hanteln bis Ohrhöhe.",
"fehler": "Hohlkreuz beim Drücken."
},
{
"id": "schulterdruecken_lh",
"name": "Schulterdrücken Langhantel stehend",
"muskel": "sv",
"sekundaer": [
"smi",
"trizeps",
"bauch"
],
"geraet": [
"lh"
],
"level": 2,
"gelenke": {
"schulter": 2,
"ellbogen": 1,
"ruecken": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/schulterdruecken_lh_0.jpg",
"img/uebungen/schulterdruecken_lh_1.jpg"
],
"quelle": "Barbell_Shoulder_Press",
"tipp": "Po und Bauch fest, Kopf durch die Arme.",
"fehler": "Mit Schwung aus den Beinen."
},
{
"id": "schulterpresse",
"name": "Schulterpresse Maschine",
"muskel": "sv",
"sekundaer": [
"smi",
"trizeps"
],
"geraet": [
"sp"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/schulterpresse_0.jpg",
"img/uebungen/schulterpresse_1.jpg"
],
"quelle": "Machine_Shoulder_Military_Press",
"tipp": "Griffe auf Schulterhöhe starten.",
"fehler": "Nicht ganz absenken."
},
{
"id": "smith_schulter",
"name": "Schulterdrücken Multipresse",
"muskel": "sv",
"sekundaer": [
"smi",
"trizeps"
],
"geraet": [
"sm",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/smith_schulter_0.jpg",
"img/uebungen/smith_schulter_1.jpg"
],
"quelle": "Smith_Machine_Overhead_Shoulder_Press",
"tipp": "Stange vor dem Kopf führen.",
"fehler": "Hinter den Nacken drücken."
},
{
"id": "arnold",
"name": "Arnold-Press",
"muskel": "sv",
"sekundaer": [
"smi",
"trizeps"
],
"geraet": [
"kh",
"bk"
],
"level": 2,
"gelenke": {
"schulter": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/arnold_0.jpg",
"img/uebungen/arnold_1.jpg"
],
"quelle": "Arnold_Dumbbell_Press",
"tipp": "Drehen während des Drückens.",
"fehler": "Zu schwer, Bewegung wird hektisch."
},
{
"id": "band_schulter",
"name": "Schulterdrücken mit Band",
"muskel": "sv",
"sekundaer": [
"smi",
"trizeps"
],
"geraet": [
"wb"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/band_schulter_0.jpg",
"img/uebungen/band_schulter_1.jpg"
],
"quelle": "Shoulder_Press_-_With_Bands",
"tipp": "Auf das Band stellen, nach oben drücken.",
"fehler": "Ellbogen zu weit hinten."
},
{
"id": "frontheben_kh",
"name": "Frontheben Kurzhanteln",
"muskel": "sv",
"sekundaer": [
"smi"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/frontheben_kh_0.jpg",
"img/uebungen/frontheben_kh_1.jpg"
],
"quelle": "Front_Dumbbell_Raise",
"tipp": "Bis Augenhöhe, langsam ab.",
"fehler": "Schwung aus dem Rücken."
},
{
"id": "frontheben_kabel",
"name": "Frontheben Kabel",
"muskel": "sv",
"sekundaer": [
"smi"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/frontheben_kabel_0.jpg",
"img/uebungen/frontheben_kabel_1.jpg"
],
"quelle": "Front_Cable_Raise",
"tipp": "Gleichmäßige Spannung über den ganzen Weg.",
"fehler": "Zu hoch über Kopf."
},
{
"id": "seitheben_kh",
"name": "Seitheben Kurzhanteln",
"muskel": "smi",
"sekundaer": [
"sv"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/seitheben_kh_0.jpg",
"img/uebungen/seitheben_kh_1.jpg"
],
"quelle": "Side_Lateral_Raise",
"tipp": "Ellbogen führt, bis Schulterhöhe.",
"fehler": "Schultern hochziehen, schwingen."
},
{
"id": "seitheben_kabel",
"name": "Seitheben Kabel einarmig",
"muskel": "smi",
"sekundaer": [],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/seitheben_kabel_0.jpg",
"img/uebungen/seitheben_kabel_1.jpg"
],
"quelle": "Cable_Seated_Lateral_Raise",
"tipp": "Kabel hinter dem Körper, konstante Spannung.",
"fehler": "Oberkörper kippt weg."
},
{
"id": "seitheben_band",
"name": "Seitheben mit Band",
"muskel": "smi",
"sekundaer": [],
"geraet": [
"wb"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/seitheben_band_0.jpg",
"img/uebungen/seitheben_band_1.jpg"
],
"quelle": "Lateral_Raise_-_With_Bands",
"tipp": "Kurze, kontrollierte Bewegung.",
"fehler": "Band zu stramm."
},
{
"id": "seitheben_sitzend",
"name": "Seitheben sitzend",
"muskel": "smi",
"sekundaer": [],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/seitheben_sitzend_0.jpg",
"img/uebungen/seitheben_sitzend_1.jpg"
],
"quelle": "Seated_Side_Lateral_Raise",
"tipp": "Sitzend kein Schwung möglich – ideal für Technik.",
"fehler": "Hanteln über Schulterhöhe."
},
{
"id": "aufrechtes_rudern_kabel",
"name": "Aufrechtes Rudern Kabel (breit)",
"muskel": "smi",
"sekundaer": [
"nacken"
],
"geraet": [
"kz"
],
"level": 2,
"gelenke": {
"schulter": 2,
"handgelenk": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/aufrechtes_rudern_kabel_0.jpg",
"img/uebungen/aufrechtes_rudern_kabel_1.jpg"
],
"quelle": "Upright_Cable_Row",
"tipp": "Breiter Griff, nur bis Brusthöhe.",
"fehler": "Zu eng und zu hoch – reizt die Schulter."
},
{
"id": "reverse_butterfly",
"name": "Reverse Butterfly Maschine",
"muskel": "sh",
"sekundaer": [
"ob"
],
"geraet": [
"bf"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/reverse_butterfly_0.jpg",
"img/uebungen/reverse_butterfly_1.jpg"
],
"quelle": "Reverse_Machine_Flyes",
"tipp": "Arme weit, Schulterblätter nicht zu stark zusammen.",
"fehler": "Zu schwer, Bewegung zu kurz."
},
{
"id": "facepull",
"name": "Face Pulls",
"muskel": "sh",
"sekundaer": [
"rot",
"ob"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/facepull_0.jpg",
"img/uebungen/facepull_1.jpg"
],
"quelle": "Face_Pull",
"tipp": "Seil zum Gesicht, Daumen zeigen nach hinten.",
"fehler": "Mit dem unteren Rücken ziehen."
},
{
"id": "reverse_fly_kh",
"name": "Vorgebeugtes Seitheben",
"muskel": "sh",
"sekundaer": [
"ob"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ruecken": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/reverse_fly_kh_0.jpg",
"img/uebungen/reverse_fly_kh_1.jpg"
],
"quelle": "Seated_Bent-Over_Rear_Delt_Raise",
"tipp": "Sitzend vorgebeugt, Arme seitlich heben.",
"fehler": "Rücken rundet sich."
},
{
"id": "kabel_reverse",
"name": "Kabel Reverse Fly",
"muskel": "sh",
"sekundaer": [
"ob"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/kabel_reverse_0.jpg",
"img/uebungen/kabel_reverse_1.jpg"
],
"quelle": "Cable_Rear_Delt_Fly",
"tipp": "Kabel kreuzen, Arme seitlich nach hinten.",
"fehler": "Zu viel Bizeps."
},
{
"id": "band_pull_apart",
"name": "Band Pull-Aparts",
"muskel": "sh",
"sekundaer": [
"ob",
"rot"
],
"geraet": [
"wb"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/band_pull_apart_0.jpg",
"img/uebungen/band_pull_apart_1.jpg"
],
"quelle": "Back_Flyes_-_With_Bands",
"tipp": "Arme gestreckt, Band zur Brust auseinanderziehen.",
"fehler": "Schultern hochziehen."
},
{
"id": "aussenrotation",
"name": "Außenrotation am Kabel",
"muskel": "rot",
"sekundaer": [
"sh"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/aussenrotation_0.jpg",
"img/uebungen/aussenrotation_1.jpg"
],
"quelle": "Reverse_Flyes_With_External_Rotation",
"tipp": "Ellbogen am Körper, Unterarm nach außen drehen.",
"fehler": "Zu schwer – das ist Feinarbeit."
},
{
"id": "latzug_breit",
"name": "Latzug breit",
"muskel": "lat",
"sekundaer": [
"bizeps",
"ob"
],
"geraet": [
"lz"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/latzug_breit_0.jpg",
"img/uebungen/latzug_breit_1.jpg"
],
"quelle": "Wide-Grip_Lat_Pulldown",
"tipp": "Stange zur oberen Brust, Brust raus.",
"fehler": "Hinter den Nacken ziehen."
},
{
"id": "latzug_eng",
"name": "Latzug eng (V-Griff)",
"muskel": "lat",
"sekundaer": [
"bizeps"
],
"geraet": [
"lz"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/latzug_eng_0.jpg",
"img/uebungen/latzug_eng_1.jpg"
],
"quelle": "V-Bar_Pulldown",
"tipp": "Ellbogen nach unten zur Hüfte.",
"fehler": "Weit nach hinten lehnen."
},
{
"id": "latzug_unter",
"name": "Latzug Untergriff",
"muskel": "lat",
"sekundaer": [
"bizeps"
],
"geraet": [
"lz"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/latzug_unter_0.jpg",
"img/uebungen/latzug_unter_1.jpg"
],
"quelle": "Underhand_Cable_Pulldowns",
"tipp": "Schulterbreiter Untergriff.",
"fehler": "Nur mit den Armen ziehen."
},
{
"id": "klimmzug",
"name": "Klimmzüge",
"muskel": "lat",
"sekundaer": [
"bizeps",
"ob"
],
"geraet": [
"kl"
],
"level": 3,
"gelenke": {
"schulter": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/klimmzug_0.jpg",
"img/uebungen/klimmzug_1.jpg"
],
"quelle": "Pullups",
"tipp": "Aus dem Hang, Brust zur Stange.",
"fehler": "Mit Schwung (Kipping)."
},
{
"id": "chinup",
"name": "Klimmzüge Untergriff",
"muskel": "lat",
"sekundaer": [
"bizeps"
],
"geraet": [
"kl"
],
"level": 2,
"gelenke": {
"schulter": 1,
"ellbogen": 2
},
"typ": "grund",
"bilder": [
"img/uebungen/chinup_0.jpg",
"img/uebungen/chinup_1.jpg"
],
"quelle": "Chin-Up",
"tipp": "Kinn über die Stange, kontrolliert ab.",
"fehler": "Halbe Wiederholungen."
},
{
"id": "klimmzug_band",
"name": "Klimmzüge mit Band-Hilfe",
"muskel": "lat",
"sekundaer": [
"bizeps"
],
"geraet": [
"kl",
"wb"
],
"level": 1,
"gelenke": {
"schulter": 1,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/klimmzug_band_0.jpg",
"img/uebungen/klimmzug_band_1.jpg"
],
"quelle": "Band_Assisted_Pull-Up",
"tipp": "Band hilft im unteren Teil – dickeres Band = leichter.",
"fehler": "Zu schnell fallen lassen."
},
{
"id": "ueberzuege_kabel",
"name": "Überzüge am Kabel",
"muskel": "lat",
"sekundaer": [],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/ueberzuege_kabel_0.jpg",
"img/uebungen/ueberzuege_kabel_1.jpg"
],
"quelle": "Straight-Arm_Pulldown",
"tipp": "Arme gestreckt, Stange zum Oberschenkel.",
"fehler": "Ellbogen beugen."
},
{
"id": "kabelrudern",
"name": "Kabelrudern sitzend",
"muskel": "ob",
"sekundaer": [
"lat",
"bizeps",
"sh"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"ellbogen": 1,
"ruecken": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/kabelrudern_0.jpg",
"img/uebungen/kabelrudern_1.jpg"
],
"quelle": "Seated_Cable_Rows",
"tipp": "Aufrecht, Griff zum Bauchnabel.",
"fehler": "Mit dem Oberkörper schaukeln."
},
{
"id": "rudermaschine",
"name": "Rudern an der Maschine",
"muskel": "ob",
"sekundaer": [
"lat",
"bizeps"
],
"geraet": [
"rm"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/rudermaschine_0.jpg",
"img/uebungen/rudermaschine_1.jpg"
],
"quelle": "Leverage_Iso_Row",
"tipp": "Brust am Polster, Ellbogen nach hinten.",
"fehler": "Schultern nach vorn rollen."
},
{
"id": "rudern_kh",
"name": "Einarmiges Kurzhantelrudern",
"muskel": "ob",
"sekundaer": [
"lat",
"bizeps"
],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"ellbogen": 1,
"ruecken": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/rudern_kh_0.jpg",
"img/uebungen/rudern_kh_1.jpg"
],
"quelle": "One-Arm_Dumbbell_Row",
"tipp": "Knie und Hand auf der Bank, Hantel zur Hüfte.",
"fehler": "Oberkörper dreht auf."
},
{
"id": "rudern_lh",
"name": "Langhantelrudern vorgebeugt",
"muskel": "ob",
"sekundaer": [
"lat",
"bizeps",
"ur"
],
"geraet": [
"lh"
],
"level": 2,
"gelenke": {
"ruecken": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/rudern_lh_0.jpg",
"img/uebungen/rudern_lh_1.jpg"
],
"quelle": "Bent_Over_Barbell_Row",
"tipp": "Rücken gerade, 45° vorgebeugt.",
"fehler": "Rundrücken."
},
{
"id": "rudern_brustgestuetzt",
"name": "Brustgestütztes Rudern Kurzhanteln",
"muskel": "ob",
"sekundaer": [
"lat",
"sh"
],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/rudern_brustgestuetzt_0.jpg",
"img/uebungen/rudern_brustgestuetzt_1.jpg"
],
"quelle": "Dumbbell_Incline_Row",
"tipp": "Bauch auf Schrägbank – schont den unteren Rücken.",
"fehler": "Kopf in den Nacken."
},
{
"id": "tbar",
"name": "T-Bar-Rudern",
"muskel": "ob",
"sekundaer": [
"lat",
"bizeps"
],
"geraet": [
"lh"
],
"level": 2,
"gelenke": {
"ruecken": 2,
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/tbar_0.jpg",
"img/uebungen/tbar_1.jpg"
],
"quelle": "T-Bar_Row_with_Handle",
"tipp": "Brust raus, Griff zum Bauch.",
"fehler": "Zu aufrecht."
},
{
"id": "umgekehrtes_rudern",
"name": "Umgekehrtes Rudern (Körpergewicht)",
"muskel": "ob",
"sekundaer": [
"bizeps",
"sh"
],
"geraet": [
"kg",
"sm"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/umgekehrtes_rudern_0.jpg",
"img/uebungen/umgekehrtes_rudern_1.jpg"
],
"quelle": "Inverted_Row",
"tipp": "Unter einer Stange hängend, Brust zur Stange.",
"fehler": "Hüfte hängt."
},
{
"id": "band_rudern",
"name": "Rudern mit Band",
"muskel": "ob",
"sekundaer": [
"lat",
"bizeps"
],
"geraet": [
"wb"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/band_rudern_0.jpg",
"img/uebungen/band_rudern_1.jpg"
],
"quelle": "Seated_Cable_Rows",
"tipp": "Band um die Füße, Ellbogen nach hinten.",
"fehler": "Rücken rund."
},
{
"id": "shrugs_kh",
"name": "Schulterheben Kurzhanteln",
"muskel": "nacken",
"sekundaer": [
"ob"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"nacken": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/shrugs_kh_0.jpg",
"img/uebungen/shrugs_kh_1.jpg"
],
"quelle": "Dumbbell_Shrug",
"tipp": "Gerade nach oben, oben 1 Sek. halten.",
"fehler": "Schultern kreisen."
},
{
"id": "shrugs_lh",
"name": "Schulterheben Langhantel",
"muskel": "nacken",
"sekundaer": [
"ob"
],
"geraet": [
"lh"
],
"level": 1,
"gelenke": {
"nacken": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/shrugs_lh_0.jpg",
"img/uebungen/shrugs_lh_1.jpg"
],
"quelle": "Barbell_Shrug",
"tipp": "Arme bleiben gestreckt.",
"fehler": "Kopf nach vorn."
},
{
"id": "hyperext",
"name": "Hyperextensions",
"muskel": "ur",
"sekundaer": [
"po",
"ham"
],
"geraet": [
"hx"
],
"level": 1,
"gelenke": {
"ruecken": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/hyperext_0.jpg",
"img/uebungen/hyperext_1.jpg"
],
"quelle": "Hyperextensions_Back_Extensions",
"tipp": "Bis zur geraden Linie, nicht überstrecken.",
"fehler": "Ins Hohlkreuz gehen."
},
{
"id": "superman",
"name": "Superman am Boden",
"muskel": "ur",
"sekundaer": [
"po"
],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"ruecken": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/superman_0.jpg",
"img/uebungen/superman_1.jpg"
],
"quelle": "Hyperextensions_With_No_Hyperextension_Bench",
"tipp": "Arme und Beine leicht abheben, 2 Sek. halten.",
"fehler": "Kopf weit nach oben."
},
{
"id": "kreuzheben",
"name": "Kreuzheben",
"muskel": "ur",
"sekundaer": [
"po",
"ham",
"quad",
"ob"
],
"geraet": [
"lh"
],
"level": 3,
"gelenke": {
"ruecken": 2,
"huefte": 1,
"knie": 1,
"handgelenk": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/kreuzheben_0.jpg",
"img/uebungen/kreuzheben_1.jpg"
],
"quelle": "Barbell_Deadlift",
"tipp": "Stange nah am Körper, Rücken neutral.",
"fehler": "Rundrücken beim Heben."
},
{
"id": "rumaenisch",
"name": "Rumänisches Kreuzheben",
"muskel": "ham",
"sekundaer": [
"po",
"ur"
],
"geraet": [
"lh"
],
"level": 2,
"gelenke": {
"ruecken": 2,
"huefte": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/rumaenisch_0.jpg",
"img/uebungen/rumaenisch_1.jpg"
],
"quelle": "Romanian_Deadlift",
"tipp": "Hüfte nach hinten, Knie leicht gebeugt.",
"fehler": "Rücken rundet sich."
},
{
"id": "rumaenisch_kh",
"name": "Rumänisches Kreuzheben Kurzhanteln",
"muskel": "ham",
"sekundaer": [
"po",
"ur"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"ruecken": 1,
"huefte": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/rumaenisch_kh_0.jpg",
"img/uebungen/rumaenisch_kh_1.jpg"
],
"quelle": "Stiff-Legged_Dumbbell_Deadlift",
"tipp": "Hanteln an den Beinen entlang.",
"fehler": "Zu tief bei rundem Rücken."
},
{
"id": "beinbeuger_liegend",
"name": "Beinbeuger liegend",
"muskel": "ham",
"sekundaer": [
"wade"
],
"geraet": [
"bb"
],
"level": 1,
"gelenke": {
"knie": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/beinbeuger_liegend_0.jpg",
"img/uebungen/beinbeuger_liegend_1.jpg"
],
"quelle": "Lying_Leg_Curls",
"tipp": "Hüfte bleibt auf dem Polster.",
"fehler": "Po hebt ab."
},
{
"id": "beinbeuger_sitzend",
"name": "Beinbeuger sitzend",
"muskel": "ham",
"sekundaer": [],
"geraet": [
"bb"
],
"level": 1,
"gelenke": {
"knie": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/beinbeuger_sitzend_0.jpg",
"img/uebungen/beinbeuger_sitzend_1.jpg"
],
"quelle": "Seated_Leg_Curl",
"tipp": "Oberschenkelpolster fest.",
"fehler": "Zu schnell zurücklassen."
},
{
"id": "good_morning_band",
"name": "Good Morning mit Band",
"muskel": "ham",
"sekundaer": [
"po",
"ur"
],
"geraet": [
"wb"
],
"level": 1,
"gelenke": {
"ruecken": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/good_morning_band_0.jpg",
"img/uebungen/good_morning_band_1.jpg"
],
"quelle": "Band_Good_Morning",
"tipp": "Hüfte nach hinten schieben.",
"fehler": "Knie durchstrecken."
},
{
"id": "glute_ham_boden",
"name": "Nordic Curl (Boden)",
"muskel": "ham",
"sekundaer": [],
"geraet": [
"kg",
"mt"
],
"level": 3,
"gelenke": {
"knie": 2
},
"typ": "isolation",
"bilder": [
"img/uebungen/glute_ham_boden_0.jpg",
"img/uebungen/glute_ham_boden_1.jpg"
],
"quelle": "Floor_Glute-Ham_Raise",
"tipp": "Füße fixieren, langsam nach vorn sinken.",
"fehler": "Hüfte knickt ein."
},
{
"id": "kniebeuge_lh",
"name": "Kniebeuge Langhantel",
"muskel": "quad",
"sekundaer": [
"po",
"add",
"ur"
],
"geraet": [
"lh"
],
"level": 2,
"gelenke": {
"knie": 2,
"huefte": 1,
"ruecken": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/kniebeuge_lh_0.jpg",
"img/uebungen/kniebeuge_lh_1.jpg"
],
"quelle": "Barbell_Squat",
"tipp": "Knie folgen den Zehen, mindestens parallel.",
"fehler": "Fersen heben, Knie fallen nach innen."
},
{
"id": "frontkniebeuge",
"name": "Frontkniebeuge",
"muskel": "quad",
"sekundaer": [
"po",
"bauch"
],
"geraet": [
"lh"
],
"level": 3,
"gelenke": {
"knie": 2,
"handgelenk": 2
},
"typ": "grund",
"bilder": [
"img/uebungen/frontkniebeuge_0.jpg",
"img/uebungen/frontkniebeuge_1.jpg"
],
"quelle": "Front_Barbell_Squat",
"tipp": "Ellbogen hoch, Oberkörper aufrecht.",
"fehler": "Ellbogen sinken ab."
},
{
"id": "goblet",
"name": "Goblet Squat",
"muskel": "quad",
"sekundaer": [
"po",
"bauch"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"knie": 1,
"huefte": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/goblet_0.jpg",
"img/uebungen/goblet_1.jpg"
],
"quelle": "Goblet_Squat",
"tipp": "Hantel vor der Brust, tief und aufrecht.",
"fehler": "Rücken rundet unten."
},
{
"id": "smith_kniebeuge",
"name": "Kniebeuge Multipresse",
"muskel": "quad",
"sekundaer": [
"po"
],
"geraet": [
"sm"
],
"level": 1,
"gelenke": {
"knie": 2,
"huefte": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/smith_kniebeuge_0.jpg",
"img/uebungen/smith_kniebeuge_1.jpg"
],
"quelle": "Smith_Machine_Squat",
"tipp": "Füße leicht vor der Stange.",
"fehler": "Füße zu weit hinten."
},
{
"id": "beinpresse",
"name": "Beinpresse",
"muskel": "quad",
"sekundaer": [
"po",
"add"
],
"geraet": [
"lp"
],
"level": 1,
"gelenke": {
"knie": 1,
"huefte": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/beinpresse_0.jpg",
"img/uebungen/beinpresse_1.jpg"
],
"quelle": "Leg_Press",
"tipp": "Unterer Rücken bleibt am Polster.",
"fehler": "Knie durchdrücken."
},
{
"id": "hackenschmidt",
"name": "Hackenschmidt-Kniebeuge",
"muskel": "quad",
"sekundaer": [
"po"
],
"geraet": [
"lp"
],
"level": 2,
"gelenke": {
"knie": 2
},
"typ": "grund",
"bilder": [
"img/uebungen/hackenschmidt_0.jpg",
"img/uebungen/hackenschmidt_1.jpg"
],
"quelle": "Hack_Squat",
"tipp": "Kontrolliert tief.",
"fehler": "Fersen lösen sich."
},
{
"id": "beinstrecker",
"name": "Beinstrecker",
"muskel": "quad",
"sekundaer": [],
"geraet": [
"bs"
],
"level": 1,
"gelenke": {
"knie": 2
},
"typ": "isolation",
"bilder": [
"img/uebungen/beinstrecker_0.jpg",
"img/uebungen/beinstrecker_1.jpg"
],
"quelle": "Leg_Extensions",
"tipp": "Oben 1 Sek. halten.",
"fehler": "Schwung, Gewicht fällt zurück."
},
{
"id": "ausfallschritt_kh",
"name": "Ausfallschritte Kurzhanteln",
"muskel": "quad",
"sekundaer": [
"po",
"ham"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"knie": 2,
"knoechel": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/ausfallschritt_kh_0.jpg",
"img/uebungen/ausfallschritt_kh_1.jpg"
],
"quelle": "Dumbbell_Lunges",
"tipp": "Hinteres Knie Richtung Boden.",
"fehler": "Vorderes Knie weit über die Zehen."
},
{
"id": "ausfallschritt_rueck",
"name": "Ausfallschritt rückwärts",
"muskel": "quad",
"sekundaer": [
"po"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"knie": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/ausfallschritt_rueck_0.jpg",
"img/uebungen/ausfallschritt_rueck_1.jpg"
],
"quelle": "Dumbbell_Rear_Lunge",
"tipp": "Schritt nach hinten schont das Knie.",
"fehler": "Oberkörper kippt nach vorn."
},
{
"id": "bulgarian",
"name": "Bulgarische Kniebeuge",
"muskel": "quad",
"sekundaer": [
"po",
"add"
],
"geraet": [
"kh",
"bk"
],
"level": 2,
"gelenke": {
"knie": 2
},
"typ": "grund",
"bilder": [
"img/uebungen/bulgarian_0.jpg",
"img/uebungen/bulgarian_1.jpg"
],
"quelle": "Split_Squat_with_Dumbbells",
"tipp": "Hinterer Fuß auf der Bank.",
"fehler": "Stand zu kurz."
},
{
"id": "step_up",
"name": "Step-Ups",
"muskel": "quad",
"sekundaer": [
"po"
],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"knie": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/step_up_0.jpg",
"img/uebungen/step_up_1.jpg"
],
"quelle": "Dumbbell_Step_Ups",
"tipp": "Ganzer Fuß auf der Bank, aus dem vorderen Bein drücken.",
"fehler": "Mit dem hinteren Bein abstoßen."
},
{
"id": "kniebeuge_kg",
"name": "Kniebeuge mit Körpergewicht",
"muskel": "quad",
"sekundaer": [
"po"
],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {
"knie": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/kniebeuge_kg_0.jpg",
"img/uebungen/kniebeuge_kg_1.jpg"
],
"quelle": "Bodyweight_Squat",
"tipp": "Arme nach vorn, tief sitzen.",
"fehler": "Fersen heben ab."
},
{
"id": "ausfallschritt_kg",
"name": "Gehende Ausfallschritte",
"muskel": "quad",
"sekundaer": [
"po"
],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {
"knie": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/ausfallschritt_kg_0.jpg",
"img/uebungen/ausfallschritt_kg_1.jpg"
],
"quelle": "Bodyweight_Walking_Lunge",
"tipp": "Große Schritte, aufrecht.",
"fehler": "Knie knallt auf den Boden."
},
{
"id": "hip_thrust",
"name": "Hip Thrust Langhantel",
"muskel": "po",
"sekundaer": [
"ham"
],
"geraet": [
"lh",
"bk"
],
"level": 2,
"gelenke": {
"huefte": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/hip_thrust_0.jpg",
"img/uebungen/hip_thrust_1.jpg"
],
"quelle": "Barbell_Hip_Thrust",
"tipp": "Schultern auf der Bank, Kinn zur Brust.",
"fehler": "Hohlkreuz oben."
},
{
"id": "glute_bridge",
"name": "Glute Bridge",
"muskel": "po",
"sekundaer": [
"ham"
],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"huefte": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/glute_bridge_0.jpg",
"img/uebungen/glute_bridge_1.jpg"
],
"quelle": "Butt_Lift_Bridge",
"tipp": "Po fest, oben 2 Sek. halten.",
"fehler": "Aus dem Rücken drücken."
},
{
"id": "glute_bridge_einbein",
"name": "Einbeinige Glute Bridge",
"muskel": "po",
"sekundaer": [
"ham"
],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"huefte": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/glute_bridge_einbein_0.jpg",
"img/uebungen/glute_bridge_einbein_1.jpg"
],
"quelle": "Single_Leg_Glute_Bridge",
"tipp": "Becken bleibt gerade.",
"fehler": "Becken kippt seitlich."
},
{
"id": "kabel_kickback",
"name": "Kabel-Kickback",
"muskel": "po",
"sekundaer": [
"ham"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"huefte": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/kabel_kickback_0.jpg",
"img/uebungen/kabel_kickback_1.jpg"
],
"quelle": "One-Legged_Cable_Kickback",
"tipp": "Bein nach hinten, Rücken neutral.",
"fehler": "Ins Hohlkreuz drücken."
},
{
"id": "pull_through",
"name": "Cable Pull-Through",
"muskel": "po",
"sekundaer": [
"ham"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"huefte": 1,
"ruecken": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/pull_through_0.jpg",
"img/uebungen/pull_through_1.jpg"
],
"quelle": "Pull_Through",
"tipp": "Hüftstreckung, nicht Kniebeuge.",
"fehler": "Arme ziehen mit."
},
{
"id": "abduktor",
"name": "Abduktoren-Maschine",
"muskel": "po",
"sekundaer": [],
"geraet": [
"am"
],
"level": 1,
"gelenke": {
"huefte": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/abduktor_0.jpg",
"img/uebungen/abduktor_1.jpg"
],
"quelle": "Thigh_Abductor",
"tipp": "Leicht nach vorn lehnen trifft den Po besser.",
"fehler": "Gewicht knallt zurück."
},
{
"id": "adduktor",
"name": "Adduktoren-Maschine",
"muskel": "add",
"sekundaer": [],
"geraet": [
"am"
],
"level": 1,
"gelenke": {
"huefte": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/adduktor_0.jpg",
"img/uebungen/adduktor_1.jpg"
],
"quelle": "Thigh_Adductor",
"tipp": "Langsam öffnen.",
"fehler": "Zu weite Dehnung zu Beginn."
},
{
"id": "plie_squat",
"name": "Plié-Kniebeuge",
"muskel": "add",
"sekundaer": [
"quad",
"po"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"knie": 1,
"huefte": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/plie_squat_0.jpg",
"img/uebungen/plie_squat_1.jpg"
],
"quelle": "Plie_Dumbbell_Squat",
"tipp": "Weiter Stand, Zehen nach außen.",
"fehler": "Knie fallen nach innen."
},
{
"id": "seitliegend_add",
"name": "Seitliches Beinheben (Adduktoren)",
"muskel": "add",
"sekundaer": [],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"huefte": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/seitliegend_add_0.jpg",
"img/uebungen/seitliegend_add_1.jpg"
],
"quelle": "Side_Leg_Raises",
"tipp": "Unteres Bein heben, langsam.",
"fehler": "Mit Schwung."
},
{
"id": "waden_stehend",
"name": "Wadenheben stehend Maschine",
"muskel": "wade",
"sekundaer": [],
"geraet": [
"wm"
],
"level": 1,
"gelenke": {
"knoechel": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/waden_stehend_0.jpg",
"img/uebungen/waden_stehend_1.jpg"
],
"quelle": "Standing_Calf_Raises",
"tipp": "Volle Dehnung unten, oben halten.",
"fehler": "Wippen."
},
{
"id": "waden_sitzend",
"name": "Wadenheben sitzend",
"muskel": "wade",
"sekundaer": [],
"geraet": [
"wm"
],
"level": 1,
"gelenke": {
"knoechel": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/waden_sitzend_0.jpg",
"img/uebungen/waden_sitzend_1.jpg"
],
"quelle": "Seated_Calf_Raise",
"tipp": "Unten 1 Sek. dehnen.",
"fehler": "Halbe Bewegung."
},
{
"id": "waden_beinpresse",
"name": "Wadendrücken an der Beinpresse",
"muskel": "wade",
"sekundaer": [],
"geraet": [
"lp"
],
"level": 1,
"gelenke": {
"knoechel": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/waden_beinpresse_0.jpg",
"img/uebungen/waden_beinpresse_1.jpg"
],
"quelle": "Calf_Press_On_The_Leg_Press_Machine",
"tipp": "Nur Fußballen auf der Plattform.",
"fehler": "Knie beugen."
},
{
"id": "waden_kh",
"name": "Wadenheben mit Kurzhantel",
"muskel": "wade",
"sekundaer": [],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"knoechel": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/waden_kh_0.jpg",
"img/uebungen/waden_kh_1.jpg"
],
"quelle": "Standing_Dumbbell_Calf_Raise",
"tipp": "An der Wand festhalten, auf einer Stufe.",
"fehler": "Zu schnell."
},
{
"id": "waden_smith",
"name": "Wadenheben Multipresse",
"muskel": "wade",
"sekundaer": [],
"geraet": [
"sm"
],
"level": 1,
"gelenke": {
"knoechel": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/waden_smith_0.jpg",
"img/uebungen/waden_smith_1.jpg"
],
"quelle": "Smith_Machine_Calf_Raise",
"tipp": "Auf einer Erhöhung stehen.",
"fehler": "Knie gesperrt durchdrücken."
},
{
"id": "lh_curl",
"name": "Langhantel-Curls",
"muskel": "bizeps",
"sekundaer": [
"ua"
],
"geraet": [
"lh"
],
"level": 1,
"gelenke": {
"ellbogen": 1,
"handgelenk": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/lh_curl_0.jpg",
"img/uebungen/lh_curl_1.jpg"
],
"quelle": "Barbell_Curl",
"tipp": "Ellbogen bleiben am Körper.",
"fehler": "Schwung aus dem Rücken."
},
{
"id": "sz_curl",
"name": "SZ-Curls",
"muskel": "bizeps",
"sekundaer": [
"ua"
],
"geraet": [
"sz"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/sz_curl_0.jpg",
"img/uebungen/sz_curl_1.jpg"
],
"quelle": "EZ-Bar_Curl",
"tipp": "SZ-Stange schont das Handgelenk.",
"fehler": "Ellbogen wandern nach vorn."
},
{
"id": "kh_curl",
"name": "Kurzhantel-Curls",
"muskel": "bizeps",
"sekundaer": [
"ua"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/kh_curl_0.jpg",
"img/uebungen/kh_curl_1.jpg"
],
"quelle": "Dumbbell_Bicep_Curl",
"tipp": "Handfläche oben nach außen drehen.",
"fehler": "Pendeln."
},
{
"id": "hammer_curl",
"name": "Hammer-Curls",
"muskel": "bizeps",
"sekundaer": [
"ua"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/hammer_curl_0.jpg",
"img/uebungen/hammer_curl_1.jpg"
],
"quelle": "Hammer_Curls",
"tipp": "Daumen zeigt nach oben.",
"fehler": "Oberarm bewegt sich mit."
},
{
"id": "schraeg_curl",
"name": "Schrägbank-Curls",
"muskel": "bizeps",
"sekundaer": [],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"ellbogen": 1,
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/schraeg_curl_0.jpg",
"img/uebungen/schraeg_curl_1.jpg"
],
"quelle": "Incline_Dumbbell_Curl",
"tipp": "Arme hängen hinter dem Körper – große Dehnung.",
"fehler": "Schultern nach vorn."
},
{
"id": "konzentration",
"name": "Konzentrations-Curls",
"muskel": "bizeps",
"sekundaer": [],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/konzentration_0.jpg",
"img/uebungen/konzentration_1.jpg"
],
"quelle": "Concentration_Curls",
"tipp": "Ellbogen am Oberschenkel.",
"fehler": "Oberkörper hilft mit."
},
{
"id": "kabel_curl",
"name": "Kabel-Curls",
"muskel": "bizeps",
"sekundaer": [
"ua"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/kabel_curl_0.jpg",
"img/uebungen/kabel_curl_1.jpg"
],
"quelle": "Standing_Biceps_Cable_Curl",
"tipp": "Konstante Spannung.",
"fehler": "Ellbogen nach hinten."
},
{
"id": "scott_curl",
"name": "Scott-Curls (Preacher)",
"muskel": "bizeps",
"sekundaer": [],
"geraet": [
"sz",
"bk"
],
"level": 2,
"gelenke": {
"ellbogen": 2
},
"typ": "isolation",
"bilder": [
"img/uebungen/scott_curl_0.jpg",
"img/uebungen/scott_curl_1.jpg"
],
"quelle": "Preacher_Curl",
"tipp": "Nicht ganz durchstrecken.",
"fehler": "Unten fallen lassen."
},
{
"id": "spider_curl",
"name": "Spider-Curls",
"muskel": "bizeps",
"sekundaer": [],
"geraet": [
"kh",
"bk"
],
"level": 2,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/spider_curl_0.jpg",
"img/uebungen/spider_curl_1.jpg"
],
"quelle": "Spider_Curl",
"tipp": "Bauch auf Schrägbank, Arme hängen.",
"fehler": "Hochreißen."
},
{
"id": "band_curl",
"name": "Bizeps-Curls mit Band",
"muskel": "bizeps",
"sekundaer": [],
"geraet": [
"wb"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/band_curl_0.jpg",
"img/uebungen/band_curl_1.jpg"
],
"quelle": "Dumbbell_Bicep_Curl",
"tipp": "Auf das Band stellen.",
"fehler": "Band zu locker."
},
{
"id": "trizepsdruecken",
"name": "Trizepsdrücken am Kabel (Stange)",
"muskel": "trizeps",
"sekundaer": [],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/trizepsdruecken_0.jpg",
"img/uebungen/trizepsdruecken_1.jpg"
],
"quelle": "Triceps_Pushdown",
"tipp": "Ellbogen fest an der Seite.",
"fehler": "Ellbogen wandern nach vorn."
},
{
"id": "trizeps_seil",
"name": "Trizepsdrücken Seil",
"muskel": "trizeps",
"sekundaer": [],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/trizeps_seil_0.jpg",
"img/uebungen/trizeps_seil_1.jpg"
],
"quelle": "Triceps_Pushdown_-_Rope_Attachment",
"tipp": "Unten Seil auseinanderziehen.",
"fehler": "Oberkörper beugt sich weit."
},
{
"id": "ueberkopf_seil",
"name": "Überkopf-Trizepsstrecken Seil",
"muskel": "trizeps",
"sekundaer": [],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"ellbogen": 2,
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/ueberkopf_seil_0.jpg",
"img/uebungen/ueberkopf_seil_1.jpg"
],
"quelle": "Triceps_Overhead_Extension_with_Rope",
"tipp": "Lange Dehnung hinter dem Kopf.",
"fehler": "Ellbogen spreizen."
},
{
"id": "ueberkopf_kh",
"name": "Überkopf-Trizepsstrecken Kurzhantel",
"muskel": "trizeps",
"sekundaer": [],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"ellbogen": 2,
"schulter": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/ueberkopf_kh_0.jpg",
"img/uebungen/ueberkopf_kh_1.jpg"
],
"quelle": "Standing_Dumbbell_Triceps_Extension",
"tipp": "Ellbogen zeigen nach vorn-oben.",
"fehler": "Hohlkreuz."
},
{
"id": "skullcrusher",
"name": "SZ-Stirndrücken (Skullcrusher)",
"muskel": "trizeps",
"sekundaer": [],
"geraet": [
"sz",
"bk"
],
"level": 2,
"gelenke": {
"ellbogen": 2
},
"typ": "isolation",
"bilder": [
"img/uebungen/skullcrusher_0.jpg",
"img/uebungen/skullcrusher_1.jpg"
],
"quelle": "EZ-Bar_Skullcrusher",
"tipp": "Stange Richtung Stirn, Ellbogen fix.",
"fehler": "Zu schwer – Ellbogenstress."
},
{
"id": "kickback",
"name": "Trizeps-Kickbacks",
"muskel": "trizeps",
"sekundaer": [],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/kickback_0.jpg",
"img/uebungen/kickback_1.jpg"
],
"quelle": "Tricep_Dumbbell_Kickback",
"tipp": "Oberarm parallel zum Boden.",
"fehler": "Schwung."
},
{
"id": "dips_trizeps",
"name": "Dips (Trizeps)",
"muskel": "trizeps",
"sekundaer": [
"brust",
"sv"
],
"geraet": [
"dp"
],
"level": 2,
"gelenke": {
"schulter": 2,
"ellbogen": 2
},
"typ": "grund",
"bilder": [
"img/uebungen/dips_trizeps_0.jpg",
"img/uebungen/dips_trizeps_1.jpg"
],
"quelle": "Dips_-_Triceps_Version",
"tipp": "Oberkörper aufrecht.",
"fehler": "Zu tief."
},
{
"id": "bankdips",
"name": "Bank-Dips",
"muskel": "trizeps",
"sekundaer": [
"sv"
],
"geraet": [
"kg",
"bk"
],
"level": 1,
"gelenke": {
"schulter": 2,
"ellbogen": 1,
"handgelenk": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/bankdips_0.jpg",
"img/uebungen/bankdips_1.jpg"
],
"quelle": "Bench_Dips",
"tipp": "Po nah an der Bank.",
"fehler": "Schultern fallen nach vorn."
},
{
"id": "enges_bankdruecken",
"name": "Enges Bankdrücken",
"muskel": "trizeps",
"sekundaer": [
"brust",
"sv"
],
"geraet": [
"lh",
"bk"
],
"level": 2,
"gelenke": {
"ellbogen": 1,
"handgelenk": 1,
"schulter": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/enges_bankdruecken_0.jpg",
"img/uebungen/enges_bankdruecken_1.jpg"
],
"quelle": "Close-Grip_Barbell_Bench_Press",
"tipp": "Schulterbreiter Griff, Ellbogen am Körper.",
"fehler": "Griff zu eng."
},
{
"id": "trizepsmaschine",
"name": "Trizeps-Maschine",
"muskel": "trizeps",
"sekundaer": [],
"geraet": [
"sp"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/trizepsmaschine_0.jpg",
"img/uebungen/trizepsmaschine_1.jpg"
],
"quelle": "Machine_Triceps_Extension",
"tipp": "Ganze Bewegung, oben strecken.",
"fehler": "Schultern hochziehen."
},
{
"id": "diamant_ls",
"name": "Enge Liegestütz",
"muskel": "trizeps",
"sekundaer": [
"brust"
],
"geraet": [
"kg"
],
"level": 2,
"gelenke": {
"ellbogen": 1,
"handgelenk": 2
},
"typ": "grund",
"bilder": [
"img/uebungen/diamant_ls_0.jpg",
"img/uebungen/diamant_ls_1.jpg"
],
"quelle": "Close-Grip_Push-Up_off_of_a_Dumbbell",
"tipp": "Hände eng, Ellbogen nach hinten.",
"fehler": "Hüfte hängt."
},
{
"id": "band_trizeps",
"name": "Trizepsdrücken mit Band",
"muskel": "trizeps",
"sekundaer": [],
"geraet": [
"wb"
],
"level": 1,
"gelenke": {
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/band_trizeps_0.jpg",
"img/uebungen/band_trizeps_1.jpg"
],
"quelle": "Triceps_Pushdown",
"tipp": "Band oben befestigen.",
"fehler": "Ellbogen gehen mit."
},
{
"id": "handgelenk_curl",
"name": "Handgelenk-Curls",
"muskel": "ua",
"sekundaer": [],
"geraet": [
"kh",
"bk"
],
"level": 1,
"gelenke": {
"handgelenk": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/handgelenk_curl_0.jpg",
"img/uebungen/handgelenk_curl_1.jpg"
],
"quelle": "Palms-Up_Dumbbell_Wrist_Curl_Over_A_Bench",
"tipp": "Unterarm auf der Bank, nur Handgelenk bewegen.",
"fehler": "Zu schwer."
},
{
"id": "reverse_curl",
"name": "Reverse Curls",
"muskel": "ua",
"sekundaer": [
"bizeps"
],
"geraet": [
"sz"
],
"level": 1,
"gelenke": {
"handgelenk": 1,
"ellbogen": 1
},
"typ": "isolation",
"bilder": [
"img/uebungen/reverse_curl_0.jpg",
"img/uebungen/reverse_curl_1.jpg"
],
"quelle": "Reverse_Barbell_Curl",
"tipp": "Obergriff.",
"fehler": "Handgelenk knickt ab."
},
{
"id": "farmers",
"name": "Farmer's Walk",
"muskel": "ua",
"sekundaer": [
"nacken",
"bauch"
],
"geraet": [
"kh"
],
"level": 1,
"gelenke": {
"handgelenk": 1
},
"typ": "grund",
"bilder": [
"img/uebungen/farmers_0.jpg",
"img/uebungen/farmers_1.jpg"
],
"quelle": "Farmers_Walk",
"tipp": "Aufrecht gehen, Hanteln fest.",
"fehler": "Schultern hängen."
},
{
"id": "crunch",
"name": "Crunches",
"muskel": "bauch",
"sekundaer": [],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"nacken": 1
},
"typ": "core",
"bilder": [
"img/uebungen/crunch_0.jpg",
"img/uebungen/crunch_1.jpg"
],
"quelle": "Crunches",
"tipp": "Rippen zum Becken, Kopf entspannt.",
"fehler": "Am Kopf ziehen."
},
{
"id": "reverse_crunch",
"name": "Reverse Crunch",
"muskel": "bauch",
"sekundaer": [],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"ruecken": 1
},
"typ": "core",
"bilder": [
"img/uebungen/reverse_crunch_0.jpg",
"img/uebungen/reverse_crunch_1.jpg"
],
"quelle": "Reverse_Crunch",
"tipp": "Becken einrollen, nicht schwingen.",
"fehler": "Beine mit Schwung."
},
{
"id": "kabel_crunch",
"name": "Kabel-Crunch kniend",
"muskel": "bauch",
"sekundaer": [],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {
"ruecken": 1
},
"typ": "core",
"bilder": [
"img/uebungen/kabel_crunch_0.jpg",
"img/uebungen/kabel_crunch_1.jpg"
],
"quelle": "Cable_Crunch",
"tipp": "Rund einrollen, Hüfte bleibt.",
"fehler": "Mit Hüfte runterziehen."
},
{
"id": "bauchmaschine",
"name": "Bauchmaschine",
"muskel": "bauch",
"sekundaer": [],
"geraet": [
"bm"
],
"level": 1,
"gelenke": {
"ruecken": 1
},
"typ": "core",
"bilder": [
"img/uebungen/bauchmaschine_0.jpg",
"img/uebungen/bauchmaschine_1.jpg"
],
"quelle": "Ab_Crunch_Machine",
"tipp": "Ausatmen beim Einrollen.",
"fehler": "Arme ziehen."
},
{
"id": "beinheben_haengend",
"name": "Beinheben hängend",
"muskel": "bauch",
"sekundaer": [
"seite"
],
"geraet": [
"kl"
],
"level": 3,
"gelenke": {
"schulter": 1
},
"typ": "core",
"bilder": [
"img/uebungen/beinheben_haengend_0.jpg",
"img/uebungen/beinheben_haengend_1.jpg"
],
"quelle": "Hanging_Leg_Raise",
"tipp": "Becken einrollen.",
"fehler": "Pendeln."
},
{
"id": "knieheben_dip",
"name": "Knieheben am Dip-Barren",
"muskel": "bauch",
"sekundaer": [],
"geraet": [
"dp"
],
"level": 2,
"gelenke": {
"schulter": 1
},
"typ": "core",
"bilder": [
"img/uebungen/knieheben_dip_0.jpg",
"img/uebungen/knieheben_dip_1.jpg"
],
"quelle": "Knee_Hip_Raise_On_Parallel_Bars",
"tipp": "Rücken ans Polster, Knie zur Brust.",
"fehler": "Schwung."
},
{
"id": "beinheben_bank",
"name": "Beinheben liegend",
"muskel": "bauch",
"sekundaer": [],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"ruecken": 1
},
"typ": "core",
"bilder": [
"img/uebungen/beinheben_bank_0.jpg",
"img/uebungen/beinheben_bank_1.jpg"
],
"quelle": "Flat_Bench_Lying_Leg_Raise",
"tipp": "Unterer Rücken bleibt am Boden.",
"fehler": "Hohlkreuz."
},
{
"id": "plank",
"name": "Unterarmstütz (Plank)",
"muskel": "bauch",
"sekundaer": [
"seite"
],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "core",
"bilder": [
"img/uebungen/plank_0.jpg",
"img/uebungen/plank_1.jpg"
],
"quelle": "Plank",
"tipp": "Körper wie ein Brett, Po fest.",
"fehler": "Hüfte hängt oder zu hoch."
},
{
"id": "dead_bug",
"name": "Dead Bug",
"muskel": "bauch",
"sekundaer": [],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {},
"typ": "core",
"bilder": [
"img/uebungen/dead_bug_0.jpg",
"img/uebungen/dead_bug_1.jpg"
],
"quelle": "Dead_Bug",
"tipp": "Rücken am Boden, Arm und Bein gegengleich.",
"fehler": "Hohlkreuz."
},
{
"id": "seitstuetz",
"name": "Seitstütz",
"muskel": "seite",
"sekundaer": [
"bauch"
],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"schulter": 1
},
"typ": "core",
"bilder": [
"img/uebungen/seitstuetz_0.jpg",
"img/uebungen/seitstuetz_1.jpg"
],
"quelle": "Side_Bridge",
"tipp": "Hüfte hoch, gerade Linie.",
"fehler": "Hüfte sinkt."
},
{
"id": "russian_twist",
"name": "Russian Twist",
"muskel": "seite",
"sekundaer": [
"bauch"
],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"ruecken": 1
},
"typ": "core",
"bilder": [
"img/uebungen/russian_twist_0.jpg",
"img/uebungen/russian_twist_1.jpg"
],
"quelle": "Russian_Twist",
"tipp": "Aus dem Oberkörper drehen.",
"fehler": "Rundrücken, nur Arme bewegen."
},
{
"id": "pallof",
"name": "Pallof Press",
"muskel": "seite",
"sekundaer": [
"bauch"
],
"geraet": [
"kz"
],
"level": 1,
"gelenke": {},
"typ": "core",
"bilder": [
"img/uebungen/pallof_0.jpg",
"img/uebungen/pallof_1.jpg"
],
"quelle": "Pallof_Press",
"tipp": "Gegen die Drehung stabilisieren.",
"fehler": "Hüfte dreht mit."
},
{
"id": "seit_crunch",
"name": "Seitliche Crunches",
"muskel": "seite",
"sekundaer": [],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {
"nacken": 1
},
"typ": "core",
"bilder": [
"img/uebungen/seit_crunch_0.jpg",
"img/uebungen/seit_crunch_1.jpg"
],
"quelle": "Oblique_Crunches_-_On_The_Floor",
"tipp": "Schulter Richtung Hüfte.",
"fehler": "Am Kopf ziehen."
},
{
"id": "mountain_climber",
"name": "Mountain Climbers",
"muskel": "bauch",
"sekundaer": [
"quad"
],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {
"handgelenk": 1,
"schulter": 1
},
"typ": "core",
"bilder": [
"img/uebungen/mountain_climber_0.jpg",
"img/uebungen/mountain_climber_1.jpg"
],
"quelle": "Mountain_Climbers",
"tipp": "Hüfte tief, schnelle Knie.",
"fehler": "Hüfte springt hoch."
},
{
"id": "laufband",
"name": "Laufband (zügiges Gehen bergauf)",
"muskel": "cardio",
"sekundaer": [],
"geraet": [
"lb"
],
"level": 1,
"gelenke": {
"knie": 1,
"knoechel": 1
},
"typ": "cardio",
"bilder": [
"img/uebungen/laufband_0.jpg",
"img/uebungen/laufband_1.jpg"
],
"quelle": "Walking_Treadmill",
"tipp": "Steigung 6–10 %, nicht am Geländer festhalten.",
"fehler": "Festhalten."
},
{
"id": "laufband_lauf",
"name": "Laufband Joggen",
"muskel": "cardio",
"sekundaer": [],
"geraet": [
"lb"
],
"level": 2,
"gelenke": {
"knie": 2,
"knoechel": 2
},
"typ": "cardio",
"bilder": [
"img/uebungen/laufband_lauf_0.jpg",
"img/uebungen/laufband_lauf_1.jpg"
],
"quelle": "Jogging_Treadmill",
"tipp": "Lockeres Tempo, du kannst noch sprechen.",
"fehler": "Zu schnell starten."
},
{
"id": "ergometer",
"name": "Fahrradergometer",
"muskel": "cardio",
"sekundaer": [],
"geraet": [
"eg"
],
"level": 1,
"gelenke": {
"knie": 1
},
"typ": "cardio",
"bilder": [
"img/uebungen/ergometer_0.jpg",
"img/uebungen/ergometer_1.jpg"
],
"quelle": "Bicycling_Stationary",
"tipp": "Sattel auf Hüfthöhe.",
"fehler": "Sattel zu tief."
},
{
"id": "crosstrainer",
"name": "Crosstrainer",
"muskel": "cardio",
"sekundaer": [],
"geraet": [
"cr"
],
"level": 1,
"gelenke": {
"knie": 1
},
"typ": "cardio",
"bilder": [
"img/uebungen/crosstrainer_0.jpg",
"img/uebungen/crosstrainer_1.jpg"
],
"quelle": "Elliptical_Trainer",
"tipp": "Gelenkschonend, Arme mitnehmen.",
"fehler": "Nur Beine arbeiten."
},
{
"id": "rudergeraet",
"name": "Rudergerät",
"muskel": "cardio",
"sekundaer": [
"ob",
"quad"
],
"geraet": [
"rg"
],
"level": 2,
"gelenke": {
"ruecken": 1
},
"typ": "cardio",
"bilder": [
"img/uebungen/rudergeraet_0.jpg",
"img/uebungen/rudergeraet_1.jpg"
],
"quelle": "Rowing_Stationary",
"tipp": "Beine – Rücken – Arme.",
"fehler": "Nur mit den Armen."
},
{
"id": "stepper",
"name": "Stepper",
"muskel": "cardio",
"sekundaer": [
"po"
],
"geraet": [
"lb"
],
"level": 1,
"gelenke": {
"knie": 1
},
"typ": "cardio",
"bilder": [
"img/uebungen/stepper_0.jpg",
"img/uebungen/stepper_1.jpg"
],
"quelle": "Stairmaster",
"tipp": "Aufrecht, ganzer Fuß.",
"fehler": "Auf Geländer stützen."
},
{
"id": "seilspringen",
"name": "Seilspringen",
"muskel": "cardio",
"sekundaer": [
"wade"
],
"geraet": [
"kg"
],
"level": 2,
"gelenke": {
"knoechel": 2,
"knie": 1
},
"typ": "cardio",
"bilder": [
"img/uebungen/seilspringen_0.jpg",
"img/uebungen/seilspringen_1.jpg"
],
"quelle": "Rope_Jumping",
"tipp": "Kleine Sprünge auf dem Ballen.",
"fehler": "Zu hoch springen."
},
{
"id": "hampelmann",
"name": "Hampelmann (Jumping Jacks)",
"muskel": "cardio",
"sekundaer": [],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {
"knoechel": 1,
"knie": 1
},
"typ": "cardio",
"bilder": [
"img/uebungen/hampelmann_0.jpg",
"img/uebungen/hampelmann_1.jpg"
],
"quelle": "Star_Jump",
"tipp": "Lockerer Rhythmus.",
"fehler": "Harte Landung."
},
{
"id": "dehn_brust",
"name": "Brust- und Schulterdehnung",
"muskel": "brust",
"sekundaer": [
"sv"
],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/dehn_brust_0.jpg",
"img/uebungen/dehn_brust_1.jpg"
],
"quelle": "Chest_And_Front_Of_Shoulder_Stretch",
"tipp": "30 Sek. halten, ruhig atmen.",
"fehler": "Wippen."
},
{
"id": "dehn_lat",
"name": "Latissimus-Dehnung",
"muskel": "lat",
"sekundaer": [],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/dehn_lat_0.jpg",
"img/uebungen/dehn_lat_1.jpg"
],
"quelle": "Side-Lying_Floor_Stretch",
"tipp": "Seitlich lang machen.",
"fehler": "Ruckartig."
},
{
"id": "dehn_ham",
"name": "Beinbeuger-Dehnung",
"muskel": "ham",
"sekundaer": [],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/dehn_ham_0.jpg",
"img/uebungen/dehn_ham_1.jpg"
],
"quelle": "Hamstring_Stretch",
"tipp": "Bein gestreckt, Hüfte beugen.",
"fehler": "Rücken rund ziehen."
},
{
"id": "dehn_quad",
"name": "Oberschenkel-Dehnung",
"muskel": "quad",
"sekundaer": [],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/dehn_quad_0.jpg",
"img/uebungen/dehn_quad_1.jpg"
],
"quelle": "Quad_Stretch",
"tipp": "Ferse zum Po, Knie nach unten.",
"fehler": "Hohlkreuz."
},
{
"id": "dehn_huefte",
"name": "Hüftbeuger-Dehnung",
"muskel": "quad",
"sekundaer": [
"po"
],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/dehn_huefte_0.jpg",
"img/uebungen/dehn_huefte_1.jpg"
],
"quelle": "Intermediate_Hip_Flexor_and_Quad_Stretch",
"tipp": "Po anspannen, Hüfte nach vorn.",
"fehler": "Hohlkreuz."
},
{
"id": "dehn_trizeps",
"name": "Trizeps-Dehnung",
"muskel": "trizeps",
"sekundaer": [],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/dehn_trizeps_0.jpg",
"img/uebungen/dehn_trizeps_1.jpg"
],
"quelle": "Triceps_Stretch",
"tipp": "Ellbogen hinter den Kopf.",
"fehler": "Kopf nach vorn drücken."
},
{
"id": "dehn_wade",
"name": "Wadendehnung an der Wand",
"muskel": "wade",
"sekundaer": [],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/dehn_wade_0.jpg",
"img/uebungen/dehn_wade_1.jpg"
],
"quelle": "Calf_Stretch_Hands_Against_Wall",
"tipp": "Ferse bleibt am Boden.",
"fehler": "Hüfte dreht."
},
{
"id": "worlds_greatest",
"name": "World's Greatest Stretch (Aufwärmen)",
"muskel": "po",
"sekundaer": [
"ham",
"quad",
"ob"
],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/worlds_greatest_0.jpg",
"img/uebungen/worlds_greatest_1.jpg"
],
"quelle": "Worlds_Greatest_Stretch",
"tipp": "Ausfallschritt, Ellbogen zum Fuß, aufdrehen.",
"fehler": "Zu schnell."
},
{
"id": "katze_kuh",
"name": "Katze-Kuh (Wirbelsäule mobilisieren)",
"muskel": "ur",
"sekundaer": [],
"geraet": [
"kg",
"mt"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/katze_kuh_0.jpg",
"img/uebungen/katze_kuh_1.jpg"
],
"quelle": "Cat_Stretch",
"tipp": "Langsam rund und hohl.",
"fehler": "Gegen Schmerz arbeiten."
},
{
"id": "nacken_dehn",
"name": "Nackendehnung seitlich",
"muskel": "nacken",
"sekundaer": [],
"geraet": [
"kg"
],
"level": 1,
"gelenke": {},
"typ": "dehnen",
"bilder": [
"img/uebungen/nacken_dehn_0.jpg",
"img/uebungen/nacken_dehn_1.jpg"
],
"quelle": "Side_Neck_Stretch",
"tipp": "Ohr Richtung Schulter, sanft.",
"fehler": "Am Kopf ziehen."
}
];
