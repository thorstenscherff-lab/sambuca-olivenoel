# CHANGELOG – Sambuca Olivenöl

Alle Zeiten sind Europe/Berlin. Das Feedback stammt von Thorsten Scherff und ist wörtlich oder sinngemäß aus dem Chat bzw. der Plaud-Aufnahme übernommen. Wo eine Rückmeldung nicht mehr vorliegt, steht das ausdrücklich dabei.
Commits in diesem Repo gibt es seit v0.5; v0.1–v0.4 entstanden als Canvas-App auf der Build-Box (`/workspace/sambuca-game/v01…v04`).

## v0.9.0 – 03.11.2026 (Branch wip/v0.9.0: f9382c4, 288c903, 1d2f54e, d452907, a8939ba, 135875f, c5aa5ec + Doku)
**Feedback:** Thorsten, Beta-Review 03.11.: Sprachwahl Deutsch/Englisch/Italienisch einmal am Anfang; Leute kennenlernen soll schwerer sein; manche nur über Vitamin B; Ladenbesitzer sollen Figuren werden. Nachgereicht: Laden-Icons müssen bei jedem Zoom genau auf den gezeichneten Läden liegen (prüfen und dokumentieren); „Karte“-Link entfernen, ohne etwas kaputtzumachen. Erfasst in Notion als FB-37…FB-42, danach gebaut.

**Änderungen:**
- **Sprachwahl DE/EN/IT (FB-37/OI-047, löst OI-005):** Sprachwahl-Screen vor dem Intro, `G.lang` + `sambuca5_lang`, Laufzeit-Übersetzung per DOM-Observer, Wörterbuch mit 1 387 Einträgen (maschinell + ca. 180 Handkorrekturen). Details: I18N.md.
- **Kennenlernen schwerer (FB-38/OI-048):** Gating je Figur (frühester Monat, Ansehen ★), höchstens eine neue Bekanntschaft pro Monat (`fl.metM`). Im 1. Monat erreichbar: Nonna, Carmela, Salvo, Nunzia.
- **Vitamin B (FB-39/OI-049):** 7 Figuren nur per Vorstellung (Padre, Klaus, Dolores, Sindaco, Lo Bue, Nino, Ragioniere); Vermittler-Perks `vb_*`, Vorstellung senkt die Gesprächs-Schwelle um eine Stufe.
- **Ladenbesitzer als Figuren (FB-40/OI-050):** 10 neue Figuren (Lin, Nunzia, Gaspare, Pippo, Lo Bue, Enzo, Peppe, Nino, Marta, Ragioniere) mit Porträts, Begegnungen und eigenen Perks → **23 Figuren**, Porträt-Sprite 23 Zellen.
- **Laden-Icons zoomfest (FB-41/OI-051):** Nebenorte vom Pin-Layout ausgenommen, 5 Stadt-Koordinaten neu kalibriert; gemessen 0 px Abweichung auf allen Zoomstufen (MAPS.md, „Pin-Verifikation v0.9.0“).
- **„🗺️ Karte“ entfernt (FB-42/OI-052):** Szenen verlässt man über die Tabs Stadt/Umland (UI.md).

**QA:** `source/qa/logic9.mjs` (Gating, Vitamin B, 23 Figuren) und `source/qa/qa9.js` (Sprachen, Reload, Karte-Button, Tabs, Pin-Deltas, Konsolenfehler) – alles grün, keine Konsolenfehler.

## v0.8.2 – 03.11.2026 (Commits 549ca92 Code, d8ff2be Doku)
**Feedback:** Thorsten, 03.11. 02:16: „Ja und deine Vorschläge umsetzen. Dann ist Schluss für heute und du kannst alles was noch nicht dokumentiert ist dokumentieren“. Gemeint sind die Geräte-Vorschläge aus MINIGAMES.md (v0.8.1). Sie wurden zuerst in Notion (FB-32…FB-36) und in OPEN_ISSUES/MINIGAMES dokumentiert und danach gebaut.

**Änderungen:**
- **Windnetze (FB-32/OI-039):** Mit `fl.netz` zeigt die Sturm-Rettung ein Netz-Overlay; 🪢 Netz-Seile zählen doppelt, Ziel 10 statt 14.
- **Erntekamm + Bodennetze (FB-33/OI-040):** neues Gerät `SHOP-kamm` (Ferramenta, 120 € × Rabatt). Das Handpflücken wird zum Wisch-Spiel über 3 Äste, mit Bodennetz; Deckel 40 statt 30 Oliven.
- **Crew (FB-34/OI-041):** Mit Crew zählt das Ernte-Spiel +1 Olive je Sekunde („👷 +n“), dafür dauert die Runde 6 s statt 8 s.
- **Eigene Mini-Presse (FB-35/OI-042):** neues Gerät `SHOP-presse` (Consorzio, 4 500 €). Das Press-Spiel zeigt ein Thermometer; alle drei Gänge ≤ 27 °C = „❄️ KALTGEPRESST“, +8 Qualität.
- **Sandsäcke/Drainage (FB-36/OI-043):** Flut-Rettung mit Sandsäcken Ziel 10, mit Drainage Ziel 8 und länger sichtbare Lecks.
- **Spaten:** unverändert (kein Minispiel).
- **Version:** v0.8.2 (Titel, Manifest, Startbild, `GAME_V` für den Highscore).

**Zwischenfall:** Gegen 02:30 wurde die Build-Box zurückgesetzt. Die erste, noch nicht committete Umsetzung ging verloren und wurde aus dem Repo-Stand v0.8.1 neu gebaut. Neue Regel: nach jedem Zwischenschritt sofort committen und auf den Branch `wip/v0.8.2` pushen; main erst nach dem QA (OI-044).

**Prozessfehler (nachgetragen):** In v0.8.1 wurden FB-29 und FB-30 erst nach der Umsetzung in Notion eingetragen. Die Konvention „erst Notion + Doku, dann Bau“ wurde dabei verletzt. Ab v0.8.2 wird sie eingehalten (siehe README.md, Review-Prozess).

**QA:** 390×844, lokal und live (app.js sha256 d9eacbf8…b20d7), Screenshots in `/workspace/sambuca-game/v08/qa/geraete/` (lokal) und mit Präfix `live_` (live); je Variante Spiel + Ergebnis, Messwerte in MINIGAMES.md.

## v0.8.1 – 03.11.2026 (Commits 9886f11, 5584f95)
**Feedback:** Thorsten, 03.11. 01:57: „Ich finde die Icons für die Haupt-Orte besser als die Sprechblasen. Lass uns das auf allen Zoomstufen machen. Vielleicht kann ein kleines Personen-Icon dran, wenn jemand da ist.“ (FB-29/OI-036). Nachtrag: „Die Icons von Bar del Corso und Bank liegen übereinander“ – alle Pins prüfen, nahe Orte mit Führungslinie auflösen (FB-30/OI-037). Supabase für den Live-Highscore von Thorsten freigegeben (FB-19/OI-007).

**Änderungen:**
- **Karten-Icons (FB-29/OI-036):** Sprechblasen entfallen. Jeder Haupt-Ort ist auf jeder Zoomstufe ein buntes rundes Icon (Farbe je Ort, `PIN_COL` in f.tsx; 46 px bei Zoom < 1,6, 50 px ab 1,6). Ab Zoom ≥ 1,6 steht der Ortsname klein (11 px, dunkler Hintergrund) unter dem Icon. Sind Personen anwesend (`present()`), sitzt oben rechts ein weißes Badge 👤 bzw. 👤n; `aria-label` nennt die Zahl.
- **Überlappung (FB-30/OI-037):** neue Funktion `layoutBoxes()` (f.tsx): deterministische Kollisionsauflösung in Pixeln je Zoomstufe für Haupt-Orte, Minor-Läden, eigene Haine und Angebote (Rechteck-Boxen inkl. Label, 4 px Abstand, max. 80 Iterationen, Ränder geklemmt). Die echte Koordinate bleibt als weißer Punkt; ist ein Icon > 8 px versetzt, verbindet eine gestrichelte Führungslinie Punkt und Icon. Live geprüft: 0 Überlappungen auf allen 4 Zoomstufen beider Karten; Prüftabelle in MAPS.md.
- **Live-Highscore (FB-19/OI-007):** Supabase REST per `fetch` (kein SDK), Tabelle `public.highscores` (SQL in `supabase/001_highscores.sql`). Top 20 auf Startbild, Tal, Jahresbilanz und Karriere-Ende; Eintragen mit Name in Jahresbilanz und Karriere-Ende (einmal je Spiel+Jahr). Offline: Hinweis, lokale Liste bleibt. Details in BACKEND.md.
- **Rüttler-Ernte (FB-31/OI-038):** Mit Rüttler (`g.gear`) startet statt Handpflücken das neue Minispiel MiniShaker: je Baum Netz unter die geneigte Krone legen, Rüttler-Zange am Stamm ansetzen (Rindenring 30–55 %), Intensität halten und im Grün loslassen (überdreht = Astbruch). Billig-Rüttler steigt schneller (schwerer). Ertrag ×0,80–1,40, je Astbruch −0,05. Ohne Rüttler bleibt MG-harvest. Vorschläge für andere Geräte in MINIGAMES.md (nicht umgesetzt).
- **Schutzliste:** Chip „🚜 Brandschneise (noch n Mon.)“ bzw. „keine Brandschneise“ im Regal.
- **fl.apb geprüft:** `startMonth()` setzt `ap = AP + fl.apb` und danach `apb = 0`. Test: apb = 2 im Juni → Juli 9 ⏳ (7 + 2). Fix: Wärmesalbe addiert jetzt (`apb += 2`) statt zu überschreiben (Strandtag + Salbe im selben Monat gingen sonst verloren).
- **Version:** v0.8.1 (Titel, Manifest, Startbild).

**QA:** 390×844, Screenshots in `/workspace/sambuca-game/v08/qa/icons/` (Zoomstufen, je Pin, mit/ohne Person, FB-08/14/15/19/21/23/26, apb, FB-31 Handpflücken vs. Rüttler).

## v0.8 – 03.11.2026 (Commit 5aa5423)
**Feedback:** Thorsten hat v0.7.1 in einer Plaud-Aufnahme reviewt. Auftrag: „Ich hab ein review gemacht. Bitte aus Plaud holen und eine neue Version bauen. Idealerweise erst in notion dokumentieren und dann umsetzen“. Die 28 Punkte (FB-01…FB-28) stehen auf der Notion-Seite „Review v0.7.1 → v0.8“ und in OPEN_ISSUES (OI-016…OI-034). Plaud-KI-Vorschläge wurden nicht als Punkte übernommen.
Nachtrag 03.11. 01:24: Thorsten hat sechs Fest- und Ortsfotos in Google Drive gelegt. Sie wurden als Referenz im Spielstil nachgezeichnet (siehe ASSETS.md, Abschnitt v0.8).

**Änderungen:**
- **Start (FB-01/02):** neues Startbild mit verwildertem Olivenhain (`17_start_hain.jpg`). Das Ziel heißt jetzt „Werde der größte Olivenöl-Mogul Sambucas“.
- **Lesbarkeit (FB-03):** eingebettete Schrift Nunito 600–900 (OFL, `fonts/`, selbst gehostet). Kein Impact und keine Outline mehr. Pink- und Rottexte wurden auf helle Kontrastfarben gesetzt (`C.pinkT`, `C.bad`).
- **Lager-Sheet (FB-04):** Status mit Abstand, Ausrüstung als Chips.
- **Karten-Icons (FB-05/16):** Nebenorte sitzen auf den nummerierten Poster-Icons (`px` in MINORS). Neu sind Y&L Haushaltswaren und O-Dogs Garden. Der Imker wurde vom Tierheim-Icon wegverschoben.
- **Kirche (FB-07):** Chiesa Madre heißt jetzt „Hauptkirche · Padre Vito“. Die Madonna dell'Udienza hat eine eigene Szene im Santuario.
- **Spot-Feedback (FB-08/09/11):** Jeder Spot öffnet ein Sheet mit Beschreibung, Ergebnis und „wieder ab <Monat>“. Die Wette zeigt Quote und Einsatz (45 %, Gewinn 110 €).
- **Gespräche (FB-10):** MiniTalk zieht Antworten ohne Wiederholung.
- **Pandolfina (FB-12/13):** kein doppelter Pin mehr über „Dein Hain“. Die Turm-Szene „Torre di Pandolfina“ hat ein eigenes Bild (v2 nach Drive-Foto).
- **Haine (FB-14):** 7 Startangebote, davon 2 im Besitz von Turi und Giusi (ab Monat 12, ★ ≥ 40), plus 3 neue Angebote pro Jahr.
- **Neue Orte (FB-15/17/18):** Hotel Don Giovanni mit Pool-Deal und Aperitivo, O-Dogs Garden mit Wachhund (350 €, Diebstahlrisiko 10 %) und Lido Bumerang mit Strandtag (+AP) und Lido-Deal Jun–Sep (Bild v2 nach Drive-Foto).
- **Aufträge (FB-20):** Karten ohne Rahmen, mit Schatten.
- **Event-Folgen (FB-21):** Neue Spiele bevorzugen Ereignisse, die zuletzt nicht kamen (`localStorage sambuca5_seen`). Nachbarmonate werden zu 50 % mitgemischt.
- **Carmela (FB-22):** ist im selben Monat sofort im Büro anzutreffen.
- **Wetter-Tipp (FB-23):** Die Prophezeiung bleibt im Personen-Sheet stehen, mit Schutz-Hinweis je Katastrophe.
- **Feste (FB-25):** eigene Fest-Bilder. April (Settimana Santa & San Giorgio) nutzt `24_fest_giorgio.jpg`, August (Vassalli & Calici) `23_fest_vassalli.jpg`. Die Udienza behält `08_festa.jpg`. Die Event-Karten `santa`, `giorgio`, `vassalli` und `calici` haben ein Bildbanner.
- **Wasserrecht (FB-26):** Die Wirkung ist im Ziel, im Shop und in den Dürre- und Scirocco-Texten erklärt.
- **Karte (FB-27):** Bei Zoom < 1.6 erscheinen nur glitzernde Icons, ab 1.6 Pins mit Beschriftung.
- **Büro (FB-28):** Upgrades werden gekauft: 50.000 €, 100.000 € und 500.000 € (je ★ +3). Die Alternative 250k ist notiert.
- **Brand (Zusatzpunkt, OI-035):** neues Katastrophen-Ereignis `brand` im Juli und August. Schutz bietet die Brandschneise (`SHOP-schneise` im Consorzio, 100 € + 0,40 €/Baum, gilt 12 Monate) oder ein Anruf bei der Protezione Civile über den Sindaco (♥ ≥ 40, −5 %). Das Minispiel „FEUER!“ (MiniRescue `brand`, 15 Treffer) kostet je nach Erfolg bis −30 % Zustand, −10 % Bäume (`burn()`) und −10 % Ertrag. Wer nichts tut, verliert −30 % Zustand, −10 % Bäume und −15 % Ertrag. Wetter-Tratsch nennt den Schutz.
- Der Speicherstand bleibt v5 und ist kompatibel.

**Offen:** FB-06 (Begegnungen in jeder Szene) ist nur teilweise umgesetzt. FB-19 (Live-Highscore) braucht ein Backend und die Freigabe eines Dienstes. FB-24 bleibt ohne Änderung, weil der Kalender bereits stimmt.

## Doku-Audit – 02.11.2026 (keine Versionsänderung, Spiel bleibt v0.7.1)
**Feedback:** „Was ist mit den Personen in Spiel? Sind die auch dokumentiert?“ Daraus wurde ein vollständiges Audit des Spiels.

**Änderungen (nur Doku und Werkzeuge, kein Spielcode):**
- Neue Doku: CHARACTERS, EVENTS, MINIGAMES, ECONOMY, CALENDAR, LOCATIONS, UI, SAVEGAME, OPEN_ISSUES.
- ID-System für alle Spielelemente. Die Tabellen werden aus dem Code erzeugt (`source/tools/export_inventory.py`, Prüfung mit `--check`).
- Porträt-Master (13) und Sprite liegen in `source/portraits/` mit sha256. Die Prompts sind verloren und wurden rekonstruiert beschrieben. Dazu kommt `make_portrait_sprite.py`.
- RULES: Schwelle für den Sindaco korrigiert (Kennenlernen ★ 35, Audienz ★ 50), Dolores ★ 20 ergänzt.

## v0.7.1 – 02.11.2026 (Commit 3d729c4) + Doku
**Feedback zu v0.7:** „Die Bilder sind gut und können so bleiben. Beide Karten sind nicht gut. Die Positionen sind nicht exakt und die Micro macro Karte fand ich besser. Wir haben sowohl die Stadtkarte als auch das Umland bereits in Hochauflösung. Das muss besser werden.“
**Änderungen:**
- Stadt- und Umlandkarte sind jetzt 1:1-Ausschnitte aus dem Micro-Macro-Poster v12 bei 300 dpi (4961×3897 bzw. 4600×3000), als externe WebP-Dateien (`maps/`).
- Zoom 1–4 (Knöpfe und Pinch), sinnvolle Startposition beim Öffnen.
- Die Pins werden aus WGS84-Koordinaten mit der Poster-Projektion berechnet und sind auf OSM-Objekte bzw. Adressen geprüft (MAPS.md).
- Nebenorte und Hain-Angebote wurden linear auf die neuen Karten umgerechnet.
- Die Bilder blieben unverändert.

**Danach (Auftrag „Alles muss reproduzierbar bleiben … sehr ausführlich dokumentieren“):**
- `docs/` und `source/` sind jetzt im Repo, mit Quellen, Build-Skript, Werkzeugen, Prompts und Szenen-Mastern.
- Der Build wurde aus dem Repo byte-identisch reproduziert.

## v0.7 – 02.11.2026 (Commit 60480a2)
**Auftrag/Feedback:** Thorsten schickte eigene Fotos aus Sambuca (p01–p21) als Vorlagen für die Szenen.
**Änderungen:**
- 16 neue Szenen (ASSETS.md).
- Vier Büro-Stufen, die mit Vermögen bzw. Ruf wachsen.
- Bar del Corso ersetzt die Bar Navarro.
- Neue Szene Banca, mit Pin am Corso.
- Lesbare Schrift auf dem Festa-Bild.
- Karten nachgeschärft.

Die echten Fotos sind nur Referenz; sie sind weder eingebettet noch im Repo.

## v0.6 – 02.11.2026 (Commit 675a8f1)
**Auftrag:** echte Ortsansichten von Sambuca im Spielstil.
**Änderungen:**
- Büro, Bar und Festa neu generiert, mit Web-Fotos von Sambuca als Referenz (Prompts #0–#2 in `docs/prompts/`).
- Favicon und Manifest.

## v0.5 – 02.11.2026 (Commit 0747358) – erster GitHub-Pages-Deploy
**Feedback (Plaud-Aufnahme 02.11.2026, 20:19), sinngemäß:**
- Vollbild-Szenen statt Listen, mit anklickbaren Hotspots.
- Kontakte muss man sich erarbeiten.
- Gespräche als Minispiel.
- Mehrere Jahre spielen.
- Highscore statt Szenario-Codes.
- Ereignisse komplett zufällig.
- Kleine Läden anklickbar machen.

**Änderungen:**
- Alles oben Genannte umgesetzt: Szenen-Engine, Talk-Minispiel, Schwierigkeitsstufen der Kontakte, Mehrjahresmodus mit Jahreswertung und Titeln, lokaler Highscore, Zufallsereignisse mit Katastrophen- und Rettungsminispiel, Nebenorte (MINOR) und Laden.
- Veröffentlichung auf GitHub Pages (freigegeben von Thorsten).

## v0.4 – 02.11.2026
**Änderungen:**
- QA-Runde und Ausbau der Events und Feste.
- Fakten zu Sambuca (`sambuca_facts.md` auf der Build-Box).
- Minispiele aus dieser Version leben in `ui_old.tsx` weiter.

**Feedback:** im Protokoll nur teilweise erhalten. Thorsten wünschte sich danach Vollbild-Szenen, echte Feste, Kontakte auf Festen und in der Kirche und viele Ereignisse (siehe v0.5).

## Look-and-Feel-Runde (zwischen v0.3 und v0.4)
- 4 Mockups (`/workspace/sambuca-game/lookfeel/`); Thorsten bevorzugte den Poster-Stil.
- Suche nach der Micro-Macro-Karte (Poster-Pipeline, MAPS.md).
- Inventar aller 24 Screens (`screens/screens.md`).

## v0.3
**Änderungen:**
- Mobile-Feinschliff, Ereignisse, Minispiele.
- Szenarien mit Seed und Share-Code.
- Spielstand in localStorage.

## v0.2
**Änderungen:** erste gezeichnete Karten (Stadt und Umland) und Bürobilder als WebP.
**Feedback:**
- Es soll eine App mit asynchronem Wettbewerb werden.
- Fokus auf das Smartphone.
- Die Dynamik lässt nach ein bis zwei Monaten nach.

## v0.1
**Änderungen:** erster spielbarer Prototyp (Büro, Stadt/Bank, Palazzo, Umland-Kauf, Ernte, Mühle, Verkauf, Monatsbericht, Bilanz). Screenshots auf der Build-Box unter `v01/`.
**Feedback:** nicht im Protokoll erhalten.
