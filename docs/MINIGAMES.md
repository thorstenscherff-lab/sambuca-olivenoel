# Minispiele (v0.7.1)

Alle Minispiele laufen im Sheet `UI-mg` bzw. `UI-talk`. Steuerung: Tippen, also Telefon zuerst. Jedes Minispiel lässt sich überspringen, dann gilt ein fester Standardwert.

<!-- BEGIN GENERATED:minigames -->
| ID | Komponente | Code |
|---|---|---|
| `MG-talk` | MiniTalk | `source/game/src/e.tsx:2` |
| `MG-harvest` | MiniHarvest | `source/game/ui_old.tsx:27` |
| `MG-press` | MiniPress | `source/game/ui_old.tsx:58` |
| `MG-haggle` | MiniHaggle | `source/game/ui_old.tsx:80` |
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
