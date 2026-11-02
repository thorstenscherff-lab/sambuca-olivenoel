# CHANGELOG – Sambuca Olivenöl

Alle Zeiten sind Europe/Berlin. Das Feedback stammt von Thorsten Scherff und ist wörtlich oder sinngemäß aus dem Chat bzw. der Plaud-Aufnahme übernommen. Wo eine Rückmeldung nicht mehr vorliegt, steht das ausdrücklich dabei.
Commits in diesem Repo gibt es seit v0.5; v0.1–v0.4 entstanden als Canvas-App auf der Build-Box (`/workspace/sambuca-game/v01…v04`).

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
