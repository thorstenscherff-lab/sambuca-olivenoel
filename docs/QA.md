# QA – Prüfablauf vor und nach jedem Deploy

Alle Skripte liegen in `source/qa/`. Sie laufen mit puppeteer-core 24.43.1 und dem System-Chrome `/usr/bin/google-chrome` (156.0.8078.47), headless. Gerät: **390 × 844 CSS-px, isMobile, hasTouch; DPR 3 bei qamap.js, DPR 2 bei qa7.js und play7.js** (Smartphone hochkant; andere Formate sind nicht Ziel).

Vorbereitung: `cd source/harness && npm ci` (puppeteer-core ist dort Dependency). Die Skripte aus diesem Ordner starten, damit `require('puppeteer-core')` gefunden wird, also z. B. `node ../qa/qamap.js …`.

## 1. Statisch (vor dem Commit)
1. `bash source/build.sh` → `tsc` ohne Fehler, `app.js` entsteht.
2. Versionsnummer an allen vier Stellen prüfen (siehe BUILD.md).
3. Lokal ansehen: `cd <repo> && python3 -m http.server 8080`, dann die Skripte gegen `http://localhost:8080/` laufen lassen.

## 2. Nach dem Push (live)
1. Warten, bis Pages ausgeliefert hat (curl-Schleife in BUILD.md). Prüfen, dass `maps/*.webp` mit HTTP 200 kommen.
2. **Szenen-Tour** – `node ../qa/qa7.js <url> <ausgabeordner>`: öffnet jede Szene (Büro, Rathaus, Bar, Chiesa, Feudo, Frantoio, Hain, Belvedere, Lago, Teatro, Ruine, Banca) und speichert Screenshots. Prüfen: Bild geladen, Hotspots sichtbar, keine Konsolenfehler.
3. **Karten** – `node ../qa/qamap.js <url> <ausgabeordner>`: Stadt und Umland bei Zoom 1, 1.6, 2.6 und 4, an Corso, Casa/Municipio, Chiesa/Belvedere, Teatro, Torre/Hain, Frantoio/Sambuca, Lago und Feudo. Jeden Pin mit der Tabelle in MAPS.md vergleichen: Liegt das Icon auf dem richtigen Gebäude bzw. der richtigen Straße?
4. **Spieldurchlauf** – `node ../qa/play7.js` (URL fest auf die Live-Seite): 15 Monate automatisch spielen (Pflege, Ernte, Mühle, Verkauf, Monatsende, Jahreswechsel). Prüfen: kein Absturz, Jahreswertung erscheint, Büro-Stufe wechselt, Highscore wird gespeichert. Ausgabe nach `/workspace/sambuca-game/v07/qa/jahr2/` (Pfad im Skript anpassen).
5. Konsolen- und Seitenfehler (`pageerror`) müssen leer sein.

## 3. Abnahme
Thorsten testet auf dem eigenen Telefon. Sein Feedback wird in CHANGELOG.md wörtlich bzw. sinngemäß festgehalten.

## Ergebnisse v0.7.1 (02.11.2026)
- Build und Typecheck sind sauber. `app.js`, `imgs.tsx` und die Karten wurden aus dem Repo byte-identisch reproduziert.
- Karten-Screenshots: `/workspace/sambuca-game/v07/qa/maps/` (14 Bilder, Liste in MAPS.md).
- Offen: siehe „Offene Punkte“ in MAPS.md.
