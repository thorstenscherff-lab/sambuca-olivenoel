# RULES – Spielregeln und Schwellenwerte (v0.7.1)

Quelle der Wahrheit sind `source/game/src/a.tsx`, `c.tsx`, `d.tsx`, `e.tsx` und `f.tsx`. Diese Seite fasst den Stand vom 02.11.2026 zusammen. Wer eine Zahl ändert, ändert sie im Code **und** hier.
Monate sind 0-basiert (0 = Januar).

## Start
- Bargeld 6.000 €, 150 l Öl (Qualität 55), Marktpreis 8,50 €/l, Ruf 10, Jahr 2027.
- Geerbter Hain „Parzelle Pandolfina“: 120 Bäume, Zustand 40.
- 7 Aktionspunkte (AP) pro Monat.
- Hain-Angebote bei Don Calogero:

| Hain | Bäume | Kauf | Pacht/Monat |
|---|---|---|---|
| Lago | 200 | 6.300 € | 140 € |
| Adranone | 80 | 3.100 € | 70 € |
| Misilifurmi | 150 | 3.700 € | 95 € |

## Jahreszeiten und Pflege
| Arbeit | Monate | Kosten |
|---|---|---|
| Schnitt | 11, 0, 1 | 3 €/Baum |
| Dünger | 2–4 | 2 €/Baum |
| Bewässerung | 5–7 | 1,50 €/Baum |
| Fliegenfallen | 5–8 | 2 €/Baum |
| Ernte | 9–10 | Pflücken 3 €/Baum, mit Ausrüstung 1,50 €, mit Crew 0 € |

Schnitt und Dünger kosten ohne Spaten 25 % mehr.

## Ernte
`kg = Bäume × 20 × Zustand/100 × (1 + 0,2·geschnitten + 0,15·gedüngt) × yieldMod × Minispiel-Faktor × 1,1 (Crew) × 1,15 (Ausrüstung)`

## Mühle
- Ölausbeute: 12–17 %.
- Gebühr: 20 % des kg-Werts, mit Mühlen- oder Coop-Deal 10 %.
- Ohne Geld behält die Mühle 25 % des Öls.

## Preis
- Verkaufspreis = Markt × 1,1 (Bio) × 1,08 (DOP) × 1,1 (US-Deal) × (1 + Ruf/400) × (0,8 + Qualität/250).
- Monatliche Drift: Faktor 0,95–1,05. Mit 9 % Wahrscheinlichkeit ×1,28 (Hausse), mit 9 % ×0,78 (Einbruch).

## Kredite
- 5.000 € pro Stück, 1 % Zinsen pro Monat.
- Limit: 15.000 € + 5.000 € × (Jahr − 1).

## Monatsende
- Fixkosten: 100 € + Pachten + 1 % der Schulden + 2 % eines negativen Kontostands.
- Jeder Hain verliert 2 Zustandspunkte.
- 20 % der ungepressten Oliven verderben.
- Deal-Einnahmen: Tour 220 €/80 €, US 300 €/60 €, Agri 250 €.
- **Bankrott** unter −8.000 €.
- 12 Monatsziele (GOALS), Belohnung +25 % pro Jahr.
- 1–2 Zufallsereignisse pro Monat, jedes mit 40 % Wahrscheinlichkeit eine Katastrophe:
  - Sturm: Netz oder Gebet mindern den Schaden.
  - Flut: Drainage mindert den Schaden.
  - Bei jeder Katastrophe hat man drei Möglichkeiten: Rettungs-Minispiel, bezahlte Hilfe oder nichts tun.

## Jahreswertung
- Vermögen = Bargeld − Schulden + eigene Haine (Bäume × 45 × Zustand/100) + Ölwert.
- Titel ab 11k, 20k, 35k und 60k €.
- Highscore lokal unter `localStorage["sambuca5_hs"]`.

## Büro-Stufen (offStage)
| Stufe | Bedingung | Szene |
|---|---|---|
| 4 Padrino | Vermögen ≥ 200.000 € **oder** Ruf ≥ 70 | `04_buero4_padrino` |
| 3 Erfolg | ≥ 60.000 € oder Ruf ≥ 45 | `03_buero3_erfolg` |
| 2 Bescheiden | ≥ 15.000 € oder Ruf ≥ 20 | `02_buero2_bescheiden` |
| 1 Start | sonst | `01_buero1_start` |

## Kontakte (fiktive Figuren)
Kontakte muss man sich erarbeiten. Je höher die Schwierigkeit, desto mehr verlangt das Gesprächs-Minispiel: `MEETNEED = [0, .3, .45, .6, .7, .8]` je Schwierigkeit 0–5.

| Schwierigkeit | Figuren |
|---|---|
| 0 | Nonna Pina |
| 1 | Carmela, Salvo |
| 2 | Wang, Rosalia, Ciccio, Padre Vito |
| 3 | Turi, Giusi, Chiara, Klaus |
| 4 | Dolores (Kennenlernen erst ab Ruf ≥ 20) |
| 5 | Sindaco Bonura (Kennenlernen ab Ruf ≥ 35; Audienz im Rathaus `UI-sindaco` ab Ruf ≥ 50) |

## Feste (FEST)
| Monat | Fest |
|---|---|
| 3 | Settimana Santa / San Giorgio |
| 4 | Madonna dell'Udienza (große Festa, Szene `08_festa`) |
| 7 | Vassalli / Calici |
| 8 | Vendemmia / Fiera |
| 9 | Raccolta |
| 11 | Natale |

## Rivalen
Zio Turi Ciaccio, Cooperativa Rocca und Baronessa Inglese.

## Plattform
Nur Smartphone im Hochformat. Alle Spieltexte sind auf Deutsch.

Details mit allen Werten und Code-Stellen: [ECONOMY.md](ECONOMY.md), [EVENTS.md](EVENTS.md), [CHARACTERS.md](CHARACTERS.md), [CALENDAR.md](CALENDAR.md). Monate in dieser Datei zählen ab 0 (= Jan), IDs der Form `FEST-<MM>` und `GOAL-<MM>` ab 1.
