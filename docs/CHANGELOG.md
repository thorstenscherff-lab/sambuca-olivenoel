# CHANGELOG – Sambuca Olivenöl

Alle Zeiten sind Europe/Berlin. Das Feedback stammt von Thorsten Scherff und ist wörtlich oder sinngemäß aus dem Chat bzw. der Plaud-Aufnahme übernommen. Wo eine Rückmeldung nicht mehr vorliegt, steht das ausdrücklich dabei.
Commits in diesem Repo gibt es seit v0.5; v0.1–v0.4 entstanden als Canvas-App auf der Build-Box (`/workspace/sambuca-game/v01…v04`).

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
