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
| [CHANGELOG.md](CHANGELOG.md) | v0.1 bis v0.7.1 mit Feedback |
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
