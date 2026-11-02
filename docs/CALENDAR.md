# Kalender (v0.7.1)

Ein Zug ist ein Monat. Das Spiel beginnt im Januar 2027 (ECO-YEAR0), Spieljahr 1. Monatsindex `g.m` = 0 (Jan) bis 11 (Dez). Die IDs `FEST-<MM>` und `GOAL-<MM>` zählen ab 1.

## Jahreslauf
| Monat | Pflege/Saison | Feste | Besonderes |
|---|---|---|---|
| Jan | Schnitt, Haine kaufen | – | EV-carmela1 kommt 1 Monat nach Spielstart |
| Feb | Schnitt | – | |
| Mär | Düngung | – | |
| Apr | Düngung | FEST-04 | |
| Mai | Düngung | FEST-05 (Großfest, keine Zufallsereignisse) | |
| Jun | Bewässerung, Fallen | – | Crew-Bereitschaft ab hier (30 %) |
| Jul | Bewässerung, Fallen | – | EV-vend1 fix |
| Aug | Bewässerung, Fallen | FEST-08 | Lohn 950 |
| Sep | Fallen; keine Hainkäufe | FEST-09 | Lohn 950 |
| Okt | **Ernte**, Pressen | FEST-10 | Lohn 1150; Sturm/Flut senken die Ernte |
| Nov | **Ernte**, Pressen | – | Crew wird entlassen (außer DEAL-family) |
| Dez | Schnitt | FEST-12 | Jahresbericht `UI-year`. Beim Wechsel ins neue Jahr werden `g.used`, Ziele, Stats und `yieldMod` zurückgesetzt (`src/d.tsx:181`) |

Monatsablauf: Ereignisse (EVENTS.md) → Aktionen mit AP → „Monat beenden“ (`UI-end`, ECO-endMonth) → Bericht `UI-report`.

## Feste

In Festmonaten erscheint der Fest-Splash und die Szene LOC-fest.

<!-- BEGIN GENERATED:fest -->
| ID | Monat | Fest | Untertitel | Großfest | Ereignisse | Gäste (80 %) | Code |
|---|---|---|---|---|---|---|---|
| `FEST-04` | Apr | SETTIMANA SANTA & SAN GIORGIO | Karwoche · Feldsegnung am 23. April | nein (−1 Zufallsereignis) | EV-santa, EV-giorgio | CH-padre, CH-nonna, CH-carmela, CH-rosalia, CH-ciccio | `source/game/src/c.tsx:35` |
| `FEST-05` | Mai | MADONNA DELL'UDIENZA | 10 Tage Festa · 3. Sonntag im Mai · Pilgerweg, Palio, Luminarie, Nisciuta | ja (keine Zufallsereignisse) | EV-ud1, EV-ud2, EV-ud3, EV-ud4, EV-ud5 | CH-sindaco, CH-padre, CH-dolores, CH-chiara, CH-klaus, CH-giusi, CH-turi, CH-carmela | `source/game/src/c.tsx:36` |
| `FEST-08` | Aug | VASSALLI & CALICI DI STELLE | Pasta col Macco · Wein unter Sternschnuppen | nein (−1 Zufallsereignis) | EV-vassalli, EV-calici | CH-giusi, CH-dolores, CH-klaus, CH-turi, CH-carmela, CH-rosalia | `source/game/src/c.tsx:37` |
| `FEST-09` | Sep | VENDEMMIA & FIERA | Weinlese · Viehmarkt 21.–22. Sept. | nein (−1 Zufallsereignis) | EV-fiera, EV-vend2 | CH-ciccio, CH-turi, CH-giusi, CH-wang | `source/game/src/c.tsx:38` |
| `FEST-10` | Okt | RACCOLTA | Olivenernte beginnt | nein (−1 Zufallsereignis) | EV-vend3 | CH-ciccio, CH-rosalia | `source/game/src/c.tsx:39` |
| `FEST-12` | Dez | NATALE A SAMBUCA | Krippe, Zampognari, Weihnachtsmarkt | nein (−1 Zufallsereignis) | EV-zabut | CH-chiara, CH-padre, CH-carmela, CH-sindaco, CH-nonna | `source/game/src/c.tsx:40` |
<!-- END GENERATED:fest -->

## Monatsziele

Die Ziele werden in `UI-missions` angezeigt. Erledigt werden sie in `g.goalDone` (SAVE-goalDone). Die Belohnung wächst um 25 % pro Spieljahr.

<!-- BEGIN GENERATED:goals -->
| ID | Monat | Monatsziel | Prüfung | Belohnung J1 | ★ | Code |
|---|---|---|---|---|---|---|
| `GOAL-01` | Jan | Schneide mindestens einen Hain | `g.groves.some((x) => x.prune)` | 200 € | 2 | `source/game/src/c.tsx:43` |
| `GOAL-02` | Feb | Plaudere mit 2 Leuten | `g.talked.length >= 2` | 250 € | 2 | `source/game/src/c.tsx:44` |
| `GOAL-03` | Mär | Dünge alle deine Haine | `g.groves.every((x) => x.fert)` | 300 € | 3 | `source/game/src/c.tsx:45` |
| `GOAL-04` | Apr | Lerne jemanden Neues kennen | `g.fl["metM"] === abs(g)` | 300 € | 3 | `source/game/src/c.tsx:46` |
| `GOAL-05` | Mai | Udienza: Ansehen 30 erreichen | `g.rep >= 30` | 400 € | 0 | `source/game/src/c.tsx:47` |
| `GOAL-06` | Jun | Bewässerung oder Wasserrecht | `g.water \|\| g.groves.some((x) => x.irr)` | 300 € | 2 | `source/game/src/c.tsx:48` |
| `GOAL-07` | Jul | Fliegenfallen in allen Hainen | `g.groves.every((x) => x.traps)` | 350 € | 2 | `source/game/src/c.tsx:49` |
| `GOAL-08` | Aug | Ernte-Crew sichern | `g.crew > 0` | 300 € | 2 | `source/game/src/c.tsx:50` |
| `GOAL-09` | Sep | Alle Haine mindestens 60 % Zustand | `g.groves.every((x) => x.cond >= 60)` | 400 € | 3 | `source/game/src/c.tsx:51` |
| `GOAL-10` | Okt | Ernte 2.000 kg Oliven (Jahr) | `g.stats.harvest >= 2000` | 400 € | 3 | `source/game/src/c.tsx:52` |
| `GOAL-11` | Nov | Öl mit Qualität ≥ 70 im Lager | `g.oil > 0 && g.q >= 70` | 450 € | 4 | `source/game/src/c.tsx:53` |
| `GOAL-12` | Dez | Mindestens 2 Partner-Deals | `g.deals.length >= 2` | 600 € | 4 | `source/game/src/c.tsx:54` |
<!-- END GENERATED:goals -->
