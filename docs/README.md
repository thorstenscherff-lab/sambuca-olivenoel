# Dokumentation – Sambuca Olivenöl

| Datei | Inhalt |
|---|---|
| [BUILD.md](BUILD.md) | Quelle → Build → Deploy, exakte Befehle und Tool-Versionen |
| [ASSETS.md](ASSETS.md) | alle Szenenbilder, Referenzfotos (Drive-IDs), Prompts, Datum |
| [MAPS.md](MAPS.md) | Kartenquelle, Auflösung, Verarbeitung, Projektion, alle Pins mit Sicherheit |
| [RULES.md](RULES.md) | Spielregeln und Schwellenwerte |
| [QA.md](QA.md) | Prüfablauf |
| [CHARACTERS.md](CHARACTERS.md) | alle 13 Figuren: Rolle, Orte, Schwierigkeit, Perks, Deals, Ereignisse, Porträts (sha256) |
| [EVENTS.md](EVENTS.md) | alle Ereignisse: Wahrscheinlichkeit, Bedingungen, Wahlen, Folgen |
| [MINIGAMES.md](MINIGAMES.md) | Minispiele: Auslöser, Ablauf, Steuerung, Werte |
| [ECONOMY.md](ECONOMY.md) | Formeln für Ernte, Preis, Löhne, Kredite, Score; Laden |
| [CALENDAR.md](CALENDAR.md) | Jahreslauf, Feste, Monatsziele |
| [LOCATIONS.md](LOCATIONS.md) | Szenen, Hotspots, Pins, kleine Orte, Begegnungen |
| [UI.md](UI.md) | Tabs und Sheets |
| [SAVEGAME.md](SAVEGAME.md) | Spielstand, localStorage, alle Felder |
| [OPEN_ISSUES.md](OPEN_ISSUES.md) | offene Punkte, Bugs, Balancing, Wünsche |
| [data/](data/) | `inventory.json` (Maschinen-Inventar), `ids.json` (ID → Code-Stelle), `reconcile.txt` (Abgleich) |
| [CHANGELOG.md](CHANGELOG.md) | v0.1 bis v0.8.2 mit Feedback |
| [BACKEND.md](BACKEND.md) | Live-Highscore (Supabase): Setup, RLS, Passwort-Reset, Grenzen |
| [prompts/generate_image_calls.jsonl](prompts/generate_image_calls.jsonl) | Originalaufrufe der Bildgenerierung (22 Stück) |

## IDs und Abgleich Code ⇄ Doku

Jedes Spielelement hat eine ID: `CH-` Figur, `EV-` Ereignis, `MG-` Minispiel, `LOC-` Szene, `HOT-` Hotspot, `PIN-` Karten-Pin, `MIN-` kleiner Ort, `SHOP-`, `PERK-`, `DEAL-`, `FEST-<MM>`, `GOAL-<MM>`, `UI-` Sheet, `SAVE-` Spielstand-Feld, `ECO-` Wirtschaftssymbol.

Tabellen zwischen `<!-- BEGIN GENERATED:… -->` und `<!-- END GENERATED:… -->` werden aus dem Code erzeugt. Diese Blöcke bitte nicht von Hand ändern.

```
python3 source/tools/export_inventory.py          # Blöcke + docs/data/* neu erzeugen
python3 source/tools/export_inventory.py --check  # Exit 1 bei fehlender/Phantom-ID oder veraltetem Block
python3 source/tools/export_characters.py         # nur Figuren
python3 source/tools/make_portrait_sprite.py      # Porträt-Sprite aus source/portraits/
```

Live: https://thorstenscherff-lab.github.io/sambuca-olivenoel/

## Stand (03.11.2026)
- Live: v0.8.2 auf https://thorstenscherff-lab.github.io/sambuca-olivenoel/ (main → GitHub Pages).
- Minispiele: Gespräch, Ernte (Tippen / Erntekamm, Crew), Rüttler-Ernte, Pressen (Frantoio / eigene Presse mit Thermometer), Feilschen, Rettung (Sturm mit/ohne Netze, Flut mit/ohne Sandsäcke/Drainage, Fliege).
- Live-Highscore über Supabase (BACKEND.md). Nächste Schritte: OPEN_ISSUES.md, Abschnitt „Nächste Schritte“.

## Review-Prozess (Konvention)
1. **Plaud:** Thorsten nimmt das Review auf. Verwendet wird nur das Transkript; die KI-Vorschläge von Plaud werden nicht übernommen. Der vorsignierte Download-Link wird nie geteilt.
2. **Notion:** Jeder Punkt bekommt eine Nummer FB-xx auf der Review-Seite (Status „in Arbeit“) **bevor** gebaut wird. Parallel: Zeile OI-xxx in OPEN_ISSUES.md und Regeln in der Fach-Doku.
3. **Bau:** Quelle ändern → `cd source && bash build.sh` (zweimal, gleicher sha256) → `python3 source/tools/export_inventory.py` und `--check` (rc = 0). Nach jedem gelungenen Zwischenschritt Commit und Push auf einen Branch `wip/<version>`.
4. **QA:** Puppeteer-Skript bei 390×844 (Touch), im Hintergrund, höchstens 120 s pro Lauf, Selektoren vorher gegen den Code geprüft. Screenshots je Variante unter `/workspace/sambuca-game/v08/qa/<thema>/`. Danach Merge auf main, Push, Live-QA gegen GitHub Pages (sha von app.js vergleichen).
5. **Status:** In Notion FB-xx auf „umgesetzt vX (Commit)“ setzen; CHANGELOG mit Feedback-Zitat und Commits.

Bekannte Abweichung: FB-29/FB-30 (v0.8.1) wurden erst nach dem Bau in Notion eingetragen (CHANGELOG v0.8.2, OI-044).

## Pin-/Icon-Methode (Karte, seit v0.8.1)
- Haupt-Orte sind auf jeder Zoomstufe runde, farbige Icons (`PIN_COL` in f.tsx; 46 px unter Zoom 1,6, sonst 50 px). Ab Zoom 1,6 steht der Name klein darunter. Ist jemand vor Ort, zeigt ein Personen-Badge die Anzahl.
- Überlappungen löst `layoutBoxes()` (f.tsx) deterministisch in Pixeln je Zoomstufe: Rechteck-Boxen inklusive Label, 4 px Abstand, höchstens 80 Iterationen. Verschobene Icons bekommen eine Führungslinie zum echten Punkt.
- Koordinaten und Prüftabelle je Pin und Zoomstufe: MAPS.md.
