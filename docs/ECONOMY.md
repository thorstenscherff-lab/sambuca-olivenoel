# Wirtschaft (v0.7.1)

Code: `source/game/src/a.tsx` (Konstanten, Preis), `src/d.tsx` (`endMonth`, Score). Alle Beträge in €. „J“ = Spieljahr (`g.y`, ab 1; Kalenderjahr = ECO-YEAR0 2027 + J − 1).

## Ressourcen
- **Aktionspunkte (ECO-AP):** 7 pro Monat, + `fl.apb` (Bonus). Gespeichert in SAVE-ap.
- **Geld / Schulden:** SAVE-money, SAVE-debt.
- **Ware:**
  - Oliven (SAVE-olives, kg)
  - Öl (SAVE-oil, l) mit Qualität SAVE-q (0–100)
  - Wein (SAVE-wine)
- **Ansehen ★:** SAVE-rep (0–100).
- **Status:**
  - Bio (SAVE-bio, +10 Qualität, Preis ×1.1)
  - DOP (SAVE-dop, ×1.08)
  - Wasser (SAVE-water)
  - Gerät (SAVE-gear)
  - Spaten (SAVE-spade)
  - Erntecrew (SAVE-crew)

## Pflege (ECO-CARE, ECO-SEASON, ECO-careCost)

| Pflege | Saison (Monate) | €/Baum | Zustand + | Wirkung |
|---|---|---|---|---|
| Baumschnitt | Dez, Jan, Feb | 3 | 15 | Ernte +20 % |
| Düngung | Mär–Mai | 2 | 8 | Ernte +15 % |
| Bewässerung | Jun–Aug | 1.5 | 0 | Zustand gegen Dürre |
| Fliegenfallen | Jun–Sep | 2 | 0 | Schutz bei EV-fliege |

Jede Pflege kostet 1 AP und geht einmal pro Hain und Jahr. **ECO-careCost** = €/Baum × Bäume. Für Schnitt und Düngung ohne Spaten gilt ×1.25; jede Nutzung verbraucht 1 Spaten-Ladung. Fallen kosten ×0.5 mit `fl.trapdisc`. Der Zustand eines Hains ist auf 100 begrenzt. Ernte im Okt/Nov, Haine kaufen in allen Monaten außer Sep–Nov (`SEASON.buy`).

## Ernte und Pressung
- **Ernte (kg)** = Bäume × 20 × Zustand% × (1 + 0.2 Schnitt + 0.15 Dünger) × `yieldMod` × f(MG-harvest) × 1.1 (Crew) × 1.15 (Gerät).
- **Erntekosten (ECO-pickCost):** 3 €/Baum, 1.5 mit Gerät, 0 mit Crew. Der Billig-Rüttler (`fl.cheap`) bricht mit 35 % Wahrscheinlichkeit.
- **Mühlengebühr (ECO-millFee):** 20 % der Oliven, 10 % mit DEAL-mill oder DEAL-coop. Kannst du nicht zahlen, behält die Mühle 25 % des Öls.
- **Ölausbeute:** 12–17 % × f(MG-press). Die Qualität wird nach Menge mit dem Altbestand gemischt, dazu +10 bei Bio und + `fl.early`.
- **Verfall:** Ungepresste Oliven verlieren 20 % pro Monat, Bäume 2 % Zustand pro Monat.

## Preis
- **ECO-price:** g.price × 1.1 (Bio) × 1.08 (DOP) × 1.1 (DEAL-us) × (1 + rep/400)
- **ECO-unit** (€/l) = price × (0.8 + q/250)
- **ECO-nextPrice:** Preisentwicklung über `hr(seed)`, begrenzt, mit Sprüngen (Spanien-Ernte, Billigöl). Verlauf in SAVE-hist.
- **ECO-sellAt:** Verkauf von l Litern × unit × Faktor (Händler/Perk, z. B. Bar 135 %, MG-haggle 90–150 %).

## Löhne und Crew (ECO-wage)
- **Lohn:** 600, im Aug/Sep 950, ab Okt 1150.
  - × 0.7 mit DEAL-wine
  - × 0.75 mit DEAL-ciccio
- **Bereitschaft:** In den Monaten Jun–Okt (Index 6–10) kostet die Crew 30 % des Lohns.
- **November:** Die Crew wird entlassen, außer mit DEAL-family.

## Monatsabschluss (ECO-endMonth)
- **Fixkosten:** 100 + Pachten + 1 % der Schulden + 2 % Dispozins auf negativen Kontostand.
- **Deal-Einnahmen:**
  - DEAL-tour 220 (bzw. 80)
  - DEAL-us 300 (bzw. 60)
  - DEAL-agri `fl.agri` bzw. 250
- **Pleite:** unter −8000 € → `g.over` (SAVE-over). Sonst endet das Spiel nur über „In Rente gehen“ (`retire`).
- **Kredit:** 5000 € pro Schritt, Obergrenze 15000 + 5000 × (J − 1), 1 % pro Monat.
- **Monatsziele:** Belohnung × (1 + 0.25 × (J − 1)), siehe [CALENDAR.md](CALENDAR.md).

## Konkurrenz (ECO-RIV, ECO-rivalPts, ECO-mkOffers)

| Rivale | Start-Punkte |
|---|---|
| Zio Turi Ciaccio | 6500 |
| Cooperativa Rocca | 8500 |
| Baronessa Inglese | 10500 |

Die Rivalen wachsen monatlich um ±5 % (seed) und legen im Nov/Dez Sprünge hin. Sie schnappen dir Hain-Angebote (`g.offers`, SAVE-offers) zum Termin `until` weg. ECO-mkOffers erzeugt 2 neue Angebote pro Jahr. ECO-disc gibt Rabatte, z. B. durch Fallen-Rabatt `fl.trapdisc`.

## Punkte und Titel (ECO-score, ECO-titel, ECO-hsPut)
- **Score** = Geld − Schulden + eigene Haine (Bäume × 45 × Zustand) + Öl × unit × 0.9 + Oliven × 0.8 + Wein × 3 + Deals × 400 + Gerät 600.
- **Titel:** Schwellen bei 11k / 20k / 35k / 60k.
- **Bestenliste:** lokal, Top 20 (`sambuca5_hs`, siehe SAVEGAME.md).
- **Büro-Ausbaustufe (ECO-offStage):**
  - Stufe 2 ab Vermögen (Geld − Schulden) ≥ 15k oder ★ ≥ 20
  - Stufe 3 ab ≥ 60k oder ★ ≥ 45
  - Stufe 4 ab ≥ 200k oder ★ ≥ 70

## Laden

<!-- BEGIN GENERATED:shop -->
| ID | Artikel | Wirkung | Preis | Ort | Code |
|---|---|---|---|---|---|
| `SHOP-spade1` | 🪓 Billig-Spaten | 3 Einsätze, Pflege ohne Spaten +25 % | 19 × Wang-Rabatt € | MIN-ferr | `source/game/src/c.tsx:162` |
| `SHOP-netz1` | 🕸️ Billig-Windnetze | Sturmschutz für 1 Sturm | 180 × Wang-Rabatt € | MIN-ferr | `source/game/src/c.tsx:163` |
| `SHOP-sand` | 🧱 Sandsäcke | Flutschaden-Puffer (1×) | 60 × Wang-Rabatt € | MIN-ferr | `source/game/src/c.tsx:164` |
| `SHOP-kamm` | 🪮 Erntekamm + Bodennetze | Ernte-Minispiel: wischen statt tippen, mehr Oliven (Deckel 40) | 120 × Wang-Rabatt € | MIN-ferr | `source/game/src/c.tsx:165` |
| `SHOP-gear1` | 🔩 Billig-Rüttler | Ernte +15 %, aber 35 % Bruch pro Ernte | 850 × Wang-Rabatt € | MIN-ferr | `source/game/src/c.tsx:166` |
| `SHOP-spade2` | ⛏️ Profi-Spaten | 12 Einsätze | 89 € | MIN-consorzio | `source/game/src/c.tsx:167` |
| `SHOP-netz2` | 🛡️ Windschutznetze | hält 3 Stürme | 450 € | MIN-consorzio | `source/game/src/c.tsx:168` |
| `SHOP-drain` | 🚧 Drainagegräben | Flutschaden dauerhaft −70 % | 900 € | MIN-consorzio | `source/game/src/c.tsx:169` |
| `SHOP-presse` | 🏭 Eigene Mini-Presse | Press-Minispiel mit Thermometer: alle Gänge ≤ 27 °C = kaltgepresst (+8 Qualität) | 4500 € | MIN-consorzio | `source/game/src/c.tsx:170` |
| `SHOP-gear2` | 🔧 Rüttler (neu) | Ernte +15 %, Lohn halbiert | 1800 € | MIN-consorzio | `source/game/src/c.tsx:171` |
| `SHOP-bio` | 🌿 Bio-Zertifikat beantragen | Preis +10 %, Qualität +10 | 800 € | PIN-muni | `source/game/src/c.tsx:172` |
| `SHOP-dop` | 🏅 DOP Val di Mazara | Preis +8 % dauerhaft | 1200 € | PIN-muni | `source/game/src/c.tsx:173` |
| `SHOP-schneise` | 🚜 Brandschneise mähen | Schutz vor Flächenbrand für 12 Monate: Gras und Gestrüpp um alle Haine wird gemäht (100 € + 0,40 €/Baum) | 100 + trees(g) * 0.4) € | MIN-consorzio | `source/game/src/c.tsx:174` |
| `SHOP-dog` | 🐕 Wachhund adoptieren | Schutz vor Olivendieben: im Ereignis „Olivendiebe“ gibt es die sichere Option „Wachhunde“, Risiko sonst nur 10 % statt 40 % | 350 € | MIN-dogs | `source/game/src/c.tsx:175` |
| `SHOP-water` | 💧 Wasserrecht am Lago | Wirkung: alle Haine gelten dauerhaft als bewässert (💧, keine Bewässerungs-Kosten), Dürre & Hitzewelle ohne Schaden, erfüllt das Juni-Ziel | 1500 € | PIN-lago | `source/game/src/c.tsx:176` |
<!-- END GENERATED:shop -->

## Alle Wirtschafts-Symbole im Code

<!-- BEGIN GENERATED:eco -->
| ID | Code |
|---|---|
| `ECO-AP` | `source/game/src/a.tsx:17` |
| `ECO-CARE` | `source/game/src/a.tsx:15` |
| `ECO-SEASON` | `source/game/src/a.tsx:14` |
| `ECO-RIV` | `source/game/src/a.tsx:18` |
| `ECO-YEAR0` | `source/game/src/a.tsx:21` |
| `ECO-price` | `source/game/src/a.tsx:92` |
| `ECO-unit` | `source/game/src/a.tsx:93` |
| `ECO-wage` | `source/game/src/a.tsx:94` |
| `ECO-sellAt` | `source/game/src/a.tsx:95` |
| `ECO-millFee` | `source/game/src/d.tsx:56` |
| `ECO-pickCost` | `source/game/src/d.tsx:57` |
| `ECO-careCost` | `source/game/src/d.tsx:59` |
| `ECO-nextPrice` | `source/game/src/c.tsx:66` |
| `ECO-endMonth` | `source/game/src/d.tsx:178` |
| `ECO-score` | `source/game/src/d.tsx:212` |
| `ECO-titel` | `source/game/src/d.tsx:217` |
| `ECO-rivalPts` | `source/game/src/d.tsx:51` |
| `ECO-mkOffers` | `source/game/src/d.tsx:23` |
| `ECO-disc` | `source/game/src/c.tsx:160` |
| `ECO-DMG` | `source/game/src/c.tsx:2` |
| `ECO-storm` | `source/game/src/c.tsx:3` |
| `ECO-offStage` | `source/game/src/e.tsx:90` |
| `ECO-hsPut` | `source/game/src/d.tsx:229` |
| `ECO-MEETNEED` | `source/game/src/d.tsx:74` |
<!-- END GENERATED:eco -->

## v0.8
- **Büro:** Upgrades werden gekauft (`OFFICE_COST`): Stufe 2 kostet 50.000 €, Stufe 3 100.000 €, Stufe 4 500.000 €, je ★ +3. Die Stufe steht in `fl.office`.
- **Haine:** 5 kaufbare Startangebote und 2 im Besitz von NPCs (`turih` Turi 9.500 €, `giusih` Giusi 14.500 €; kaufbar ab Monat 12 und ★ ≥ 40). Dazu kommen 3 neue Angebote pro Jahr. Angebote im Besitz von NPCs laufen nicht ab.
- **Wette:** `BET` hat 45 % Gewinnchance, Gewinn 110 €.
- **Wachhund:** 350 € (`fl.dog`). Das Diebstahlrisiko sinkt auf 10 %.
- **Wasserrecht:** Die Wirkung ist im Text erklärt (Schutz bei Dürre und Scirocco).
- **SHOP-schneise** (Consorzio): 100 € + 0,40 €/Baum, setzt `fl.schneise = abs(g)` und schützt 12 Monate vor `brand`.
