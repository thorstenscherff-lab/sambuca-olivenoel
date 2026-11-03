# Minispiele (v0.7.1)

Alle Minispiele laufen im Sheet `UI-mg` bzw. `UI-talk`. Steuerung: Tippen, also Telefon zuerst. Jedes Minispiel lässt sich überspringen, dann gilt ein fester Standardwert.

<!-- BEGIN GENERATED:minigames -->
| ID | Komponente | Code |
|---|---|---|
| `MG-talk` | MiniTalk | `source/game/src/e.tsx:2` |
| `MG-harvest` | MiniHarvest | `source/game/ui_old.tsx:28` |
| `MG-harvest-shaker` | MiniShaker | `source/game/src/f.tsx:366` |
| `MG-press` | MiniPress | `source/game/ui_old.tsx:64` |
| `MG-haggle` | MiniHaggle | `source/game/ui_old.tsx:91` |
| `MG-rescue-sturm` | MiniRescue kind="sturm" | `source/game/src/e.tsx:46` |
| `MG-rescue-flut` | MiniRescue kind="flut" | `source/game/src/e.tsx:47` |
| `MG-rescue-brand` | MiniRescue kind="brand" | `source/game/src/e.tsx:48` |
| `MG-rescue-fliege` | MiniRescue kind="fliege" | `source/game/src/e.tsx:49` |
<!-- END GENERATED:minigames -->

## MG-talk – Gespräch (Kennenlernen, Plaudern, Telefonat)
- **Auslöser:** Im Sheet `UI-person` hat das Minispiel drei Modi:
  - `meet`: Kennenlernen, nur wenn die Figur noch nicht in `g.met` ist und in diesem Monat kein `fl.try_<id>` gesetzt ist
  - `chat`: Plaudern, einmal pro Monat
  - `call`: Telefonat über `UI-tel`, ♥-Gewinn ×0.6
- **Ablauf:** 3 Runden. Die Figur sagt einen Hinweissatz, und du wählst schnell eines von 3 Themen:
  - 1 Lieblingsthema (zufällig eines der beiden „mag“) = 2 Punkte
  - das Reizthema = 0 Punkte
  - 1 neutrales Thema = 1 Punkt
  - Zeitlimit pro Runde RT = max(2.8 s, 6.2 s − diff · 0.6 s). Bei Zeitablauf gibt es 0 Punkte („peinliche Stille“).
- **Ergebnis:** s = Punkte/6. Kennenlernen gelingt bei s ≥ `MEETNEED[diff]` (ECO-MEETNEED: 0/30/45/60/70/80 %).
- **Belohnung:** Kennenlernen mit ♥ = max(alt, 25) + 15·s. Bei Misserfolg: nächsten Monat erneut.
- **Zufall:** `Math.random()`, nicht seed-gebunden → OI-011.
- **Code:** `source/game/src/e.tsx:2` (MiniTalk), `src/d.tsx:108`.

## MG-harvest – Ernte
- **Auslöser:** Ernte eines Hains im Okt/Nov (`SEASON.harvest`).
- **Ablauf:** 8 s. Alle 0.3 s erscheint eine Olive und lebt 1.4 s. 12 % davon sind golden und zählen ×3.
- **Steuerung:** Oliven antippen.
- **Ergebnis:** f = 0.7 + min(n, 30)/30 · 0.6, also 0.7–1.3. Überspringen ergibt f = 0.85.
- **Wirkung:** Erntemenge × f (Formel siehe ECONOMY.md).
- **Code:** `source/game/ui_old.tsx:25` (MiniHarvest).

## MG-harvest-shaker – Rüttler-Ernte (v0.8.1, FB-31/OI-038)
- **Feedback:** Thorsten 03.11. 02:07: Mit gekauftem Rüttler soll nicht nur der Ertrag steigen, auch das Ernte-Minispiel muss anders sein – dem Gerät entsprechend (Rüttler am Stamm ansetzen, Timing/Intensität treffen ohne Äste zu beschädigen, Netze positionieren).
- **Auslöser:** Ernte eines Hains, wenn `g.gear` (Billig-Rüttler `gear1` oder Rüttler neu `gear2`/`ningbo`). Ohne Rüttler bleibt MG-harvest (Handpflücken).
- **Optik:** Erdboden statt Laub, ein Baum mit Stamm und Krone, grünes Netz am Boden, Rüttler-Zange am Stamm, Intensitäts-Anzeige; die Krone wackelt beim Rütteln, Oliven fallen ins Netz oder daneben.
- **Ablauf:** 3 Bäume, je Baum drei Schritte:
  1. **Netz legen:** die Krone neigt sich zufällig (links/mitte/rechts, sichtbar). Netz unter die Fallseite legen (3 Knöpfe). Treffer = 1,0, Nachbarfeld = 0,6, gegenüber = 0,25.
  2. **Ansetzen:** Stamm antippen. Ideal-Band 30–55 % Stammhöhe (Rindenring) = 1,0; darunter (Wurzelanlauf) 0,7; darüber (Äste) 0,55 und Astbruch-Risiko.
  3. **Rütteln:** Knopf gedrückt halten, die Intensität steigt (~0,6 s bis zum Grün); im grünen Bereich (55–80 %) loslassen = 1,0; zu schwach < 55 % = Anteil; überdreht > 80 % = **Astbruch** (0,4 und Hinweis). Bei 100 % bricht der Ast automatisch.
- **Ergebnis:** s je Baum = Netz × Ansetzen × Intensität; f = 0,8 + Ø s · 0,6, also 0,80–1,40 (Handpflücken 0,70–1,30). Jeder Astbruch zieht 0,05 ab (min. 0,7). Überspringen: ×0,85. Der Geräte-Bonus +15 % (ECONOMY) gilt zusätzlich unverändert.
- **Code:** `MiniShaker` in `source/game/src/f.tsx`; Auswahl im Ernte-Sheet `sheet.t === "h"`. Test-Hooks: `data-net="0|1|2"`, `data-trunk`, `data-shake`, `data-lean`.
- **QA:** `/workspace/sambuca-game/v08/qa/icons/FB-31_*.png` (Handpflücken vs. Rüttler).

### Vorschläge – weitere Geräte (freigegeben 03.11. 02:16, umgesetzt in v0.8.2, siehe unten)
- **Windschutznetze (`netz1`/`netz2`):** in MiniRescue „sturm“ schon wirksam als Schaden ×0,4; Vorschlag: im Sturm-Rettungsspiel liegen Netze schon gespannt → weniger fliegende Teile, dafür „Netz nachspannen“-Ziele.
- **Erntenetze / Erntekamm (gibt es noch nicht im Shop):** Vorschlag neues Gerät „Erntekamm + Bodennetze“ (Ferramenta, ~120 €): Handpflücken-Spiel wird zum Wisch-Spiel (über Zweige wischen statt einzeln tippen), Oliven landen gesammelt im Netz.
- **Crew (`crew`):** Vorschlag: im Ernte-Spiel pflücken 1–2 Helfer automatisch mit (Zusatz-Oliven), Spiel dafür kürzer.
- **Spaten (`spade`):** betrifft Pflege, kein Minispiel – keine Änderung.
- **Presse/Frantoio-Vertrag:** Vorschlag: eigene Presse ändert MG-press (Temperatur „kaltgepresst ≤ 27 °C“ als zweite Anzeige).
- **Drainage/Sandsäcke:** Vorschlag: im Flut-Rettungsspiel liegen Sandsäcke schon, Ziel kleiner.

## MG-press – Pressen
- **Auslöser:** Oliven pressen in der Ölmühle (PIN-frantoio / LOC-frantoio).
- **Ablauf:** 3 Runden. Eine Nadel pendelt, und du musst in der grünen Zone stoppen.
  - Zonenbreiten 26/18/12 %
  - Geschwindigkeiten .07/.095/.12
  - Zonenmitte zufällig
- **Ergebnis:**
  - Qualität q = 40 + Ø · 60
  - Ausbeute-Faktor f = 0.9 + Ø · 0.25
  - Überspringen („Rosalia macht das“): q 55, f 1.0
- **Code:** `source/game/ui_old.tsx:56` (MiniPress).

## MG-haggle – Feilschen
- **Auslöser:** Verkauf an Händler/Angebote.
- **Ablauf:** Die Nadel läuft zwischen 90 und 150 % des Preises, du tippst zum Bieten.
  - Grenze = 1.12 + rep/500 + ♥(giusi)/600
  - Liegt das Gebot über der Grenze, gilt es als Fehlversuch.
  - Nach 3 Fehlversuchen gibt es 90 %. Überspringen ergibt 100 %.
- **Code:** `source/game/ui_old.tsx:78` (MiniHaggle).

## MG-rescue-sturm / MG-rescue-flut / MG-rescue-fliege – Rettung
- **Auslöser:** Wahl „retten“ bei EV-sturm, EV-flut, EV-fliege (Spalte „Minispiel“ in EVENTS.md).
- **Ablauf:** 8 s, Ziele antippen. Das Ziel liegt bei 14 Treffern (Sturm/Flut) bzw. 16 (Fliege).
- **Ergebnis:** Schutz s = min(1, Treffer/Ziel). Der Schaden sinkt um s (siehe ECO-DMG).
- **Code:** `src/e.tsx:47` (MiniRescue), `src/d.tsx` (`MGK`).

## v0.8
- MiniRescue hat die Variante `brand` („FEUER!“): Flammen 🔥 antippen, Ziel 15 Treffer in 8 s. Schutz s = Treffer/15.
- MiniTalk zieht Antworten ohne Wiederholung (FB-10).

## Geräte-Varianten v0.8.2 (FB-32…FB-36 · OI-039…OI-043)
Freigegeben von Thorsten am 03.11.2026 02:16. Die Geräte ändern nur das Minispiel; die Schadens- und Ertragsformeln in ECONOMY.md bleiben gleich.

| Flag | Minispiel | Änderung | Wirkung |
|---|---|---|---|
| `fl.netz` (SHOP-netz1/netz2) | MG-rescue-sturm | grünes Netz-Overlay (`data-gear="netz"`), Teile 🪜📦🛞🪣🪢 | 🪢 zählt 2, Ziel 10 statt 14 |
| `fl.kamm` (SHOP-kamm, neu) | MG-harvest | Wisch-Spiel: Finger über 3 Äste ziehen (pointermove + elementFromPoint), Bodennetz (`data-gear="bodennetz"`) | Oliven alle 0,2 s, 1,8 s sichtbar, Deckel 40 statt 30 |
| `crew > 0` | MG-harvest | Zähler „👷 +n“ (`data-gear="crew"`) | +1 Olive je Sekunde, Runde 6 s statt 8 s |
| `fl.presse` (SHOP-presse, neu) | MG-press | Thermometer (`data-gear="presse"`): 22 °C beim Start, +1 °C je 10 Ticks (0,3 s) | alle 3 STOPP ≤ 27 °C → „❄️ KALTGEPRESST“, Qualität +8 (max. 100); sonst „🔥 zu warm: max. …“ |
| `fl.sand` (SHOP-sand) | MG-rescue-flut | Sandsack-Leiste (`data-gear="sand"`) | Ziel 10 statt 14 |
| `fl.drain` (SHOP-drain) | MG-rescue-flut | Drainage-Leiste (`data-gear="drain"`), hat Vorrang vor Sand | Ziel 8, Lecks 16 statt 13 Ticks |
| `spade` | – | keine Änderung (Pflege, kein Minispiel) | – |

Reihenfolge: Das Rettungsspiel läuft vor `storm()`. Deshalb sind `netz`/`sand` noch gesetzt, wenn das Spiel startet; `storm()` verbraucht sie danach wie bisher.

QA 390×844 (Skript `/workspace/sbtest/geraete.js`, je Teil ≤ 120 s): Screenshots in `/workspace/sambuca-game/v08/qa/geraete/`. Messwerte bei gleicher Eingabe (9 Treffer): Sturm ohne Netze 64 %, mit Netzen 100 %; Flut ohne 64 %, Sandsäcke 90 %, Drainage 100 %. Presse: Frantoio ohne Anzeige; eigene Presse schnell = kaltgepresst (+8), langsam = zu warm (41,7 °C).
