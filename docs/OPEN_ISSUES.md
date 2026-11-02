# Offene Punkte (Stand 02.11.2026, Spiel v0.7.1)

**Priorität:** hoch / mittel / niedrig. **Status:** offen, in Doku behoben, Wunsch. Die Quellen sind Code-Audit (A) oder Thorstens Feedback (F, siehe CHANGELOG).

| ID | Priorität | Status | Art | Beschreibung | Bezug |
|---|---|---|---|---|---|
| OI-001 | hoch | offen | Bug | Sandsäcke (`fl.sand`) werden gekauft bzw. gewählt, verringern den Katastrophenschaden in ECO-DMG aber nicht (nur Text). | EVENTS.md, ECO-DMG (A) |
| OI-002 | mittel | in Doku behoben | Doku | RULES nannte für den Sindaco ★ 50 als Kennenlern-Schwelle. Laut Code gilt ★ 35 zum Kennenlernen und ★ 50 für die Audienz (`UI-sindaco`). | CH-sindaco (A) |
| OI-003 | niedrig | offen | UX | Hotspot HOT-bar-zeitung („Ölpreis“) öffnet das Lager-Sheet UI-regal statt einer eigenen Preisansicht. | LOCATIONS.md (A) |
| OI-004 | mittel | offen | Inhalt | Die Szenen LOC-banca, LOC-teatro (palazzo), LOC-belv und LOC-hain haben keine Stammgäste, dort trifft man niemanden. | LOCATIONS.md (A) |
| OI-005 | hoch | Wunsch | Feature | **Sprachwahl DE / EN / IT.** Alle Texte stehen fest im Code (Deutsch). Nötig: Texte in Sprachdateien auslagern (Ereignisse, Figuren, UI) und einen Umschalter im Büro. Umfang: ca. 60 Ereignisse, 157 Wahlen, 27 Begegnungen, 13 Figuren. | UI.md (F) |
| OI-006 | mittel | Wunsch | Feature | **App:** heute eine Web-Seite (GitHub Pages) mit Manifest und Icon (zum Home-Bildschirm hinzufügbar). Es fehlt ein Service Worker für Offline-Betrieb. Danach optional ein Store-Wrapper (Capacitor). | (F v0.2) |
| OI-007 | hoch | Wunsch | Feature | **Asynchroner Wettbewerb:** Die Bestenliste ist nur lokal (`sambuca5_hs`). Der Seed-/Share-Code aus v0.3 ist entfallen. Vorschlag: gemeinsamer Monats-Seed für alle, Ergebnis per Code oder Link teilen, optional ein kleiner Server für eine globale Liste. | SAVEGAME.md (F v0.2) |
| OI-008 | hoch | teilweise | Feature | **Telefon-Fokus:** Das Layout ist für Hochformat gebaut. Offen sind Tests auf echten Geräten (iOS Safari, Android Chrome), die Mindestgröße der Tipp-Ziele auf den Karten und Querformat-Sperre bzw. -Hinweis. | UI.md, QA.md (F) |
| OI-009 | hoch | offen | Balancing | **Dynamik lässt nach 1–2 Monaten nach.** Gründe: pro Monat nur 1–2 Zufallsereignisse; jedes Ereignis kommt nur einmal pro Jahr (`g.used`), danach wiederholt sich der Pool im Folgejahr gleich; die Wintermonate haben wenig zu tun; es fehlen mittelfristige Ziele über die Monatsziele hinaus. Ideen: Ereignisketten pro Figur ausbauen, Jahresziele/Aufträge, Rivalen-Aktionen sichtbar machen, Wintermonate mit Vermarktung füllen. | EVENTS.md, CALENDAR.md (F v0.2 + A) |
| OI-010 | mittel | offen | Balancing | Das Spiel ist endlos und endet nur durch Pleite oder „Rente“. Es gibt kein Spielziel, keine Rundenlänge und keine Siegbedingung gegen die Rivalen. | ECONOMY.md (A) |
| OI-011 | mittel | offen | Reproduzierbarkeit | Die Minispiele (MG-*) nutzen `Math.random()` statt `hr(seed)`. Gleicher Seed bedeutet daher nicht gleiches Spiel (wichtig für OI-007). | MINIGAMES.md (A) |
| OI-012 | niedrig | offen | Reproduzierbarkeit | Die Porträt-Prompts sind verloren (rekonstruiert beschrieben). Das Sprite wurde ohne Skript erzeugt; `make_portrait_sprite.py` trifft es nur visuell (mittlere Abweichung ≈ 8/255). | CHARACTERS.md (A) |
| OI-013 | niedrig | offen | Doku | Die Ereignis-Wahrscheinlichkeiten sind analytisch genähert. Ein Simulator (z. B. 10 000 Spieljahre mit Seed) fehlt. | EVENTS.md (A) |
| OI-014 | mittel | offen | Technik | Es gibt keine Spielstand-Migration. Bei einer Versionsänderung von `G.v` geht der alte Stand verloren. | SAVEGAME.md (A) |
| OI-015 | niedrig | offen | Balancing | EV-sturm ist mit ≈ 83 %/Jahr sehr häufig, weil der Katastrophen-Pool im Spätherbst klein ist. Prüfen, ob das gewollt ist. | EVENTS.md (A) |
