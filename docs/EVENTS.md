# Ereignisse (v0.7.1)

Code: `source/game/evs.tsx` (Definitionen `EVS`), `src/d.tsx` (`rollEvents`, `DMG`, `later`). Die IDs `EV-<id>` sind identisch mit dem `id`-Feld im Code. Figuren → [CHARACTERS.md](CHARACTERS.md), Feste → [CALENDAR.md](CALENDAR.md).

## Wie Ereignisse gezogen werden (`rollEvents`, am Monatsanfang)

1. **Festmonat:** Alle Fest-Ereignisse des Monats (`FEST-<MM>.ids`) kommen dazu.
2. **Juli:** EV-vend1 kommt immer.
3. **Warteschlange:** Bis zu 2 fällige Folge-Ereignisse aus `g.queue` (SAVE-queue) kommen dazu. Sie werden mit `later(id, Monate)` aus einer Wahl heraus eingeplant.
4. **Zufall:** Im Großfest-Monat Mai (FEST-05) gibt es keine Zufallsereignisse. Sonst gilt: n = 2 mit 55 %, sonst 1, und in den übrigen Festmonaten 1 weniger.
5. **Ziehen pro Slot:**
   - Mit 40 % wird eine **Katastrophe** gezogen, sonst ein normales Ereignis.
   - Gezogen wird gleichverteilt aus den Ereignissen, die zum Monat (`m`) passen, im laufenden Jahr noch nicht vorkamen (`g.used`, SAVE-used) und deren `need(g)` erfüllt ist.
   - Zufallsquelle: `hr(seed, …)` (SAVE-seed). Ein Spielstand mit gleichem Seed ist deterministisch.
6. **Monatsende:** Erst wenn alle Ereignisse entschieden sind (`g.pick`, SAVE-pick), lässt sich der Monat beenden (`pendingEv`).

Die Spalte **≈ P/Jahr** wird analytisch aus diesen Regeln berechnet: P = 1 − Π(1 − p_Monat), ohne Folgeeffekte. Gerechnet ist ein Spieljahr bei erfüllter Vorbedingung. Das ist ein Näherungswert, keine Simulation.

## Katastrophen-Schaden (ECO-DMG, ECO-storm)

Der Grundschaden kommt aus dem Ereignistext. Er wird mit folgenden Faktoren multipliziert:
- Hagelnetz `fl.netz` ×0.4 bei Sturm/Hagel
- Drainage `fl.drain` ×0.3 bei Flut
- Gebet `fl.pray` ×0.6

**Rettungs-Minispiel:** Bei Sturm/Flut/Fliege gibt es MG-rescue-sturm, MG-rescue-flut bzw. MG-rescue-fliege. Schutz s = min(1, Treffer/Ziel).

**Spätherbst:** Sturm und Flut im Okt/Nov senken `g.yieldMod`. Scheitert die Rettung, kann dabei Gerät kaputtgehen (Sturm) oder es gehen 40 % der Oliven verloren (Flut).

Sandsäcke (`fl.sand`) senken den Schaden **nicht** → OI-001.

## Zufalls- und Folge-Ereignisse

<!-- BEGIN GENERATED:events-random -->
| ID | Ereignis | Art | Monate | ≈ P/Jahr | Vorbedingung | Figur | Auslöser | Code |
|---|---|---|---|---|---|---|---|---|
| `EV-frost` | ❄️ Nachtfrost angesagt | Katastrophe | Jan, Feb, Dez | 42 % | – | – | Zufall | `source/game/evs.tsx:3-6` |
| `EV-hagel` | 🌩️ Hagel über dem Monte Genuardo | Katastrophe | Apr, Mai, Jun | 34 % | – | – | Zufall | `source/game/evs.tsx:7-10` |
| `EV-blogger` | 📸 Foodbloggerin aus Mailand | normal | ganzjährig | 38 % | – | – | Zufall | `source/game/evs.tsx:11-14` |
| `EV-kontrolle` | 🏛️ Kontrolle der Forstbehörde | normal | ganzjährig | 38 % | – | – | Zufall | `source/game/evs.tsx:15-18` |
| `EV-touristen` | 🚌 Reisebus aus Palermo | normal | Apr, Jun, Jul, Aug, Okt | 16 % | – | – | Zufall | `source/game/evs.tsx:19-22` |
| `EV-duerre` | ☀️ Dürre-Warnung | Katastrophe | Jun, Jul, Aug | 30 % | – | – | Zufall | `source/game/evs.tsx:23-25` |
| `EV-fliege` | 🪰 Olivenfliege im Anflug | Katastrophe | Jul, Aug, Sep | 26 % | – | – | Zufall | `source/game/evs.tsx:26-29` |
| `EV-wild` | 🐗 Wildschweine aus dem Bosco | Katastrophe | Sep, Okt, Nov | 30 % | – | – | Zufall | `source/game/evs.tsx:30-33` |
| `EV-cousin` | 🧑‍🦱 Cousin Peppe braucht Geld | normal | ganzjährig | 38 % | – | – | Zufall | `source/game/evs.tsx:34-37` |
| `EV-mailand` | 🚚 Großhändler aus Mailand | normal | Feb, Mär, Apr, Jun, Jul, Aug, Dez | 24 % | – | – | Zufall | `source/game/evs.tsx:38-40` |
| `EV-palermo` | 🎄 Weihnachtsmarkt in Palermo | normal | Dez | 2 % | – | – | Zufall | `source/game/evs.tsx:41-43` |
| `EV-novello` | 🫒 Olio-Novello-Hype | normal | Nov | 8 % | – | – | Zufall | `source/game/evs.tsx:44-47` |
| `EV-bluete` | 🌸 Traumwetter zur Blüte | normal | Mär, Apr, Mai | 6 % | – | – | Zufall | `source/game/evs.tsx:48-50` |
| `EV-scirocco` | 🌬️ Scirocco aus Afrika | Katastrophe | Jun, Jul, Aug | 30 % | – | – | Zufall | `source/game/evs.tsx:51-54` |
| `EV-brand` | 🔥 Incendio! Flächenbrand am Hang | Katastrophe | Jul, Aug | 17 % | – | – | Zufall | `source/game/evs.tsx:55-59` |
| `EV-diebe` | 🔦 Olivendiebe unterwegs | normal | Okt, Nov | 10 % | – | – | Zufall | `source/game/evs.tsx:60-64` |
| `EV-traktor` | 🚜 Der alte Fiat-Traktor streikt | normal | Jan, Feb, Mär, Apr | 16 % | – | – | Zufall | `source/game/evs.tsx:65-68` |
| `EV-zeitung` | 📰 Giornale di Sicilia will ein Interview | normal | ganzjährig | 38 % | – | – | Zufall | `source/game/evs.tsx:69-72` |
| `EV-rezept` | 🍪 Nonnas Geheimrezept | normal | Jan, Feb, Mär, Okt | 17 % | – | – | Zufall | `source/game/evs.tsx:73-75` |
| `EV-wette` | ⚽ Salvos Wette: Palermo gegen Catania | normal | ganzjährig | 38 % | – | – | Zufall | `source/game/evs.tsx:76-79` |
| `EV-studis` | 🎒 Freiwillige aus Erasmus | normal | Feb, Mär, Apr, Mai | 11 % | – | – | Zufall | `source/game/evs.tsx:80-82` |
| `EV-strom` | ⚡ Stromausfall im Frantoio | normal | Okt, Nov | 10 % | – | – | Zufall | `source/game/evs.tsx:83-85` |
| `EV-regen` | 🌧️ Dauerregen zur Ernte | Katastrophe | Okt, Nov | 22 % | – | – | Zufall | `source/game/evs.tsx:86-88` |
| `EV-japan` | 🗾 E-Mail aus Tokio | normal | ganzjährig | 38 % | – | – | Zufall | `source/game/evs.tsx:89-91` |
| `EV-hochzeit` | 💍 Hochzeit in der Matrice | normal | Jun, Jul, Sep | 13 % | – | – | Zufall | `source/game/evs.tsx:92-94` |
| `EV-kurs` | ✂️ Schnittkurs vom Meister | normal | Jan, Feb, Dez | 13 % | – | – | Zufall | `source/game/evs.tsx:95-97` |
| `EV-rai` | 📺 RAI-Sendung „Linea Verde“ | normal | Apr, Jun, Jul, Sep, Okt | 17 % | – | – | Zufall | `source/game/evs.tsx:98-100` |
| `EV-xylella` | 🦠 Xylella-Gerücht | Katastrophe | Mai, Jun, Jul | 26 % | – | – | Zufall | `source/game/evs.tsx:101-103` |
| `EV-hund` | 🐕 Ein streunender Hund | normal | ganzjährig | 38 % | – | – | Zufall | `source/game/evs.tsx:104-106` |
| `EV-imu` | 🧾 Bescheid vom Finanzamt | normal | Jun, Jul, Dez | 13 % | – | – | Zufall | `source/game/evs.tsx:107-109` |
| `EV-dop` | 🏅 Prüfer für DOP Val di Mazara | normal | Feb, Mär, Apr, Jul, Aug | 18 % | – | – | Zufall | `source/game/evs.tsx:110-112` |
| `EV-bank` | 🏦 Die Sicilbanca ruft an | normal | Mär, Apr, Jul, Aug | 13 % | – | – | Zufall | `source/game/evs.tsx:113-117` |
| `EV-turi1` | 🗣️ Turi redet schlecht über dein Öl | normal | Feb, Mär, Apr, Jun, Jul | 20 % | – | CH-turi | Zufall | `source/game/evs.tsx:118-121` |
| `EV-turi2` | 🔧 Sabotage am Bewässerungsschlauch | normal | – | – | – | CH-turi | Folge von EV-turi1 (+2 Mon.) | `source/game/evs.tsx:122-125` |
| `EV-turi3` | 🤝 Turi will gemeinsam mahlen | normal | – | – | – | CH-turi | Folge von EV-turi2 (+3 Mon.) | `source/game/evs.tsx:126-128` |
| `EV-klaus1` | 🏡 Klaus will ein Agriturismo | normal | Jan, Feb, Mär, Apr | 16 % | `g.met.includes("klaus")` | CH-klaus | Zufall | `source/game/evs.tsx:129-132` |
| `EV-klaus2` | 📐 Die Baugenehmigung hakt | normal | – | – | – | CH-sindaco | Folge von EV-klaus1 (+2 Mon.) | `source/game/evs.tsx:133-136` |
| `EV-klaus3` | 🎉 Eröffnung: Agriturismo Pandolfina | normal | – | – | – | CH-klaus | Folge von EV-klaus2 (+2 Mon.) | `source/game/evs.tsx:137-139` |
| `EV-export2` | 📦 Bestellung aus München | normal | – | – | – | CH-klaus | Folge von EV-ud4 (+3 Mon.), EV-calici (+2 Mon.) | `source/game/evs.tsx:140-143` |
| `EV-sindaco1` | 🗳️ Der Sindaco braucht Unterstützer | normal | Jan, Feb, Mär | 15 % | `g.met.includes("sindaco")` | CH-sindaco | Zufall | `source/game/evs.tsx:144-146` |
| `EV-sindaco2` | 💶 EU-Topf bewilligt! | normal | – | – | – | CH-sindaco | Folge von EV-sindaco1 (+3 Mon.) | `source/game/evs.tsx:147-149` |
| `EV-padre1` | ⛪ Das Dach der Matrice leckt | normal | Jan, Feb, Mär | 15 % | – | CH-padre | Zufall | `source/game/evs.tsx:150-154` |
| `EV-sturm` | 🌪️ Sturmwarnung über dem Belice | Katastrophe | Okt, Nov, Dez, Jan, Feb, Mär | 83 % | – | – | Zufall | `source/game/src/c.tsx:14-17` |
| `EV-flut` | 🌊 Starkregen: Der Belice tritt über die Ufer | Katastrophe | Nov, Dez, Jan, Feb | 51 % | – | – | Zufall | `source/game/src/c.tsx:18-21` |
| `EV-dolores1` | 🥂 Eine Amerikanerin kauft die Villa am Lago | normal | Apr, Mai, Jun, Jul | 12 % | `!g.met.includes("dolores")` | – | Zufall | `source/game/src/c.tsx:22-24` |
| `EV-wang1` | 📦 Container-Lieferung bei Signor Wang | normal | ganzjährig | 38 % | – | – | Zufall | `source/game/src/c.tsx:25-27` |
| `EV-carmela1` | 🍋 Es klopft: die Nachbarin | normal | ganzjährig | 38 % | `!g.met.includes("carmela")` | – | Folge von Spielstart (+1 Mon.); Zufall | `source/game/src/c.tsx:28-30` |
<!-- END GENERATED:events-random -->

## Fest-Ereignisse

<!-- BEGIN GENERATED:events-fest -->
| ID | Fest-Ereignis | Wann | Figur | Code |
|---|---|---|---|---|
| `EV-vend1` | 🍇 Die Weinlese ruft – deine Crew wackelt | fix jeden Juli (rollEvents) | CH-giusi | `source/game/evs.tsx:155-158` |
| `EV-vend2` | 🍷 Vendemmia-Chaos | Fest FEST-09 (Sep) | CH-giusi | `source/game/evs.tsx:159-163` |
| `EV-vend3` | ⏰ Kommt die Crew rechtzeitig zurück? | Fest FEST-10 (Okt) | – | `source/game/evs.tsx:164-167` |
| `EV-santa` | ✝️ Settimana Santa: Prozession des Cristo Morto | Fest FEST-04 (Apr) | CH-padre | `source/game/evs.tsx:171-174` |
| `EV-giorgio` | 🐎 San Giorgio: Feldsegnung am 23. April | Fest FEST-04 (Apr) | CH-padre | `source/game/evs.tsx:175-179` |
| `EV-ud1` | 🕯️ Udienza Tag 1: Pilgerweg vom Cellaro | Fest FEST-05 (Mai) | CH-padre | `source/game/evs.tsx:180-183` |
| `EV-ud2` | 🏇 Udienza Tag 4: Palio & Minna Fest | Fest FEST-05 (Mai) | CH-nonna | `source/game/evs.tsx:184-187` |
| `EV-ud3` | 💡 Udienza Tag 6: Sponsor der Luminarie | Fest FEST-05 (Mai) | CH-sindaco | `source/game/evs.tsx:188-191` |
| `EV-ud4` | 🥂 Udienza Tag 8: Empfang im Palazzo dell'Arpa | Fest FEST-05 (Mai) | CH-klaus | `source/game/evs.tsx:192-195` |
| `EV-ud5` | 🎆 Udienza Finale: La Nisciuta | Fest FEST-05 (Mai) | CH-padre | `source/game/evs.tsx:196-200` |
| `EV-vassalli` | 🍝 Festa dei Vassalli (5. August) | Fest FEST-08 (Aug) | CH-nonna | `source/game/evs.tsx:201-204` |
| `EV-calici` | 🌠 Calici di Stelle am Belvedere (10. August) | Fest FEST-08 (Aug) | CH-giusi | `source/game/evs.tsx:205-209` |
| `EV-fiera` | 🐂 Fiera del Bestiame (21.–22. Sept.) | Fest FEST-09 (Sep) | CH-turi | `source/game/evs.tsx:210-214` |
| `EV-zabut` | 🌟 Natale a Sambuca: Krippe in den Vicoli | Fest FEST-12 (Dez) | CH-chiara | `source/game/evs.tsx:215-218` |
<!-- END GENERATED:events-fest -->

## Alle Wahlmöglichkeiten

„nur wenn“ = Bedingung im Code (`ok`). Wahlen, deren Bedingung nicht erfüllt ist, werden ausgegraut.

<!-- BEGIN GENERATED:events-choices -->
#### EV-frost · ❄️ Nachtfrost angesagt

> −4 °C über dem Belice-Tal. Junge Triebe sind in Gefahr.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Vlies über die Bäume | 1 €/Baum, sicher | – | – |
| 2 | Feuertonnen mit Turi teilen | 200 €, Turi ♥+8, 20 %: −8 % | – | – |
| 3 | Risiko eingehen | 50 %: alle Haine −15 % | – | – |

#### EV-hagel · 🌩️ Hagel über dem Monte Genuardo

> Schwarze Wolken ziehen auf. Eine Versicherung kostet 250 €.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Versichern (250 €) | kein Risiko | – | – |
| 2 | Padre Vito um ein Gebet bitten | gratis, Padre ♥+4, 35 %: −12 % | – | – |
| 3 | Ohne Versicherung | 50 %: alle Haine −12 % | – | – |

#### EV-blogger · 📸 Foodbloggerin aus Mailand

> Giulia (480.000 Follower) will dein Öl probieren – gute Qualität macht dich berühmt, schlechte blamiert dich.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | 10 l Probe schicken | ab Qualität 60 lohnt es | – | – |
| 2 | Führung durch die Vicoli Saraceni | 100 €, Chiara ♥+6, ★ +5 | – | – |
| 3 | Lieber nicht | ★ −1 | – | – |

#### EV-kontrolle · 🏛️ Kontrolle der Forstbehörde

> Ein Beamter will Katasterpläne, Pflanzenschutz-Register und Arbeitsverträge sehen.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Geometra bezahlen (400 €) | sauber, ★ +3 | – | – |
| 2 | Den Sindaco anrufen | Sindaco ♥ ≥ 50 nötig | – | – |
| 3 | Selbst durchwursteln | 50 %: 600 € Strafe | – | – |

#### EV-touristen · 🚌 Reisebus aus Palermo

> 45 Tourist:innen suchen ein „echtes Erlebnis“. Eine Verkostung im Hain bringt Spitzenpreise.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Verkostung (−150 €) | bis 60 l zu 160 % | – | – |
| 2 | Zu Nonna Pina schicken | Minni di Virgini, Nonna ♥+6, +120 € | – | – |
| 3 | Keine Zeit | nichts passiert | – | – |

#### EV-duerre · ☀️ Dürre-Warnung

> Seit sechs Wochen kein Regen. Ohne Wasser verlieren die Bäume ihre Früchte. (Tipp: Das 💧 Wasserrecht am Lago schützt dauerhaft.)

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Tankwagen bestellen | 1 €/Baum, alle geschützt | – | – |
| 2 | Auf Regen hoffen | 70 %: ungeschützte Haine −20 % · mit 💧 Wasserrecht kein Schaden | – | – |

#### EV-fliege · 🪰 Olivenfliege im Anflug

> Die Nachbarn melden Larven in den Früchten. Fallen helfen vorbeugend – oder du jagst sie selbst.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Kaolin spritzen | 1,50 €/Baum | – | – |
| 2 | 🎮 Fliegen jagen | Minispiel: Haine ohne Fallen bis −20 % | – | MG-rescue-fliege |
| 3 | Abwarten | Haine ohne Fallen −20 % | – | – |

#### EV-wild · 🐗 Wildschweine aus dem Bosco

> Nachts wühlt eine Rotte in den Hainen.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Zaun bauen (300 €) | sicher | – | – |
| 2 | Die Jäger von Adragna rufen | Wurst als Lohn, ★ +2, 30 %: −6 % | – | – |
| 3 | Riskieren | 60 %: alle Haine −10 % | – | – |

#### EV-cousin · 🧑‍🦱 Cousin Peppe braucht Geld

> „500 € – nur bis nächstes Jahr, giuro!“

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Leihen (500 €) | ★ +6 | – | – |
| 2 | Er soll bei der Ernte helfen | gratis, Crew-Chance | – | – |
| 3 | Ablehnen | ★ −3 | – | – |

#### EV-mailand · 🚚 Großhändler aus Mailand

> Ein Einkäufer will heute dein ganzes Öl – zu 120 % des Marktpreises.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Alles verkaufen (120 %) | sofort Geld | – | – |
| 2 | Ablehnen | nichts passiert | – | – |

#### EV-palermo · 🎄 Weihnachtsmarkt in Palermo

> Ein Stand an der Via Maqueda kostet 250 €.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Stand (250 €) | bis 120 l zu 170 %, ★ +5 | – | – |
| 2 | Zuhause bleiben | nichts passiert | – | – |

#### EV-novello · 🫒 Olio-Novello-Hype

> Alle wollen frisches, grünes Öl. Werbung bei Radio Sambuca kostet 200 €.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Radio-Jingle (200 €) | ★ +6 | – | – |
| 2 | Novello-Abend in Salvos Bar | bis 40 l zu 150 %, Salvo ♥+6 | – | – |
| 3 | Nichts tun | nichts passiert | – | – |

#### EV-bluete · 🌸 Traumwetter zur Blüte

> Die Bäume blühen wie seit Jahren nicht. Eine Extra-Düngung könnte das nutzen.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Extra-Dünger (1 €/Baum) | Ertrag +15 % | – | – |
| 2 | Einfach freuen | Ertrag +6 % | – | – |

#### EV-scirocco · 🌬️ Scirocco aus Afrika

> Heißer Wind mit rotem Sand. 42 °C im Schatten.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Nachts extra wässern | 0,80 €/Baum | – | – |
| 2 | Durchhalten | Haine ohne Bewässerung −10 % · mit 💧 Wasserrecht kein Schaden | – | – |

#### EV-brand · 🔥 Incendio! Flächenbrand am Hang

> Trockenes Gras, Scirocco, ein weggeworfener Zigarettenstummel: Über der Contrada steigt Rauch auf. Das Feuer läuft auf deine Haine zu.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Die Brandschneise hält | nur mit 🚜 Brandschneise (Consorzio, dieses Jahr gemäht): kein Schaden | – | – |
| 2 | Protezione Civile rufen | Sindaco ♥ ≥ 40: Löschflugzeug, nur −5 % Zustand | – | – |
| 3 | 🎮 Selbst löschen | Minispiel: bis −30 % Zustand, −10 % Bäume, Ertrag −10 % | – | MG-rescue-brand |
| 4 | Abwarten und beten | −30 % Zustand, −10 % Bäume, Ertrag −15 % | – | – |

#### EV-diebe · 🔦 Olivendiebe unterwegs

> In Contrada Misilifurmi fehlen über Nacht ganze Bäume voller Oliven.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Nachtwache (200 €) | sicher | – | – |
| 2 | Salvo hört sich um | Salvo ♥ ≥ 40, ★ +3 | – | – |
| 3 | Die Wachhunde aufpassen lassen | nur mit 🐕 Wachhund (O-Dogs Garden): sicher, gratis | – | – |
| 4 | Wird schon gutgehen | 40 %: Ertrag −15 % (mit 🐕 nur 10 %) | – | – |

#### EV-traktor · 🚜 Der alte Fiat-Traktor streikt

> Kupplung durch. Ohne Traktor wird jede Arbeit teurer.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Reparieren (450 €) | sicher | – | – |
| 2 | Turi um seinen bitten | gratis, Turi ♥ ≥ 35 | – | – |
| 3 | Ohne Traktor weiter | alle Haine −6 % | – | – |

#### EV-zeitung · 📰 Giornale di Sicilia will ein Interview

> „Junge Rückkehrer retten die Olivenhaine“ – du sollst das Titelgesicht sein.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Interview im Hain | ★ +6 | – | – |
| 2 | Den Sindaco mitbringen | ★ +4, Sindaco ♥+10 | – | – |
| 3 | Kein Interesse | nichts passiert | – | – |

#### EV-rezept · 🍪 Nonnas Geheimrezept

> Nonna Pina will Olivenöl-Kekse backen und in Salvos Bar verkaufen – mit deinem Öl.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | 20 l Öl beisteuern | +350 €, Nonna ♥+10, Salvo ♥+4 | – | – |
| 2 | Lieber nicht | Nonna ♥−6 | – | – |

#### EV-wette · ⚽ Salvos Wette: Palermo gegen Catania

> Die ganze Bar wettet aufs Derby. Salvo hält die Kasse.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | 200 € auf Palermo | 50 %: +400 € | – | – |
| 2 | Runde für alle ausgeben | 120 €, Salvo ♥+8, ★ +2 | – | – |
| 3 | Nicht wetten | nichts passiert | – | – |

#### EV-studis · 🎒 Freiwillige aus Erasmus

> Sechs Studierende aus Lyon wollen gegen Kost und Logis im Hain arbeiten.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Aufnehmen (250 € Essen) | alle Haine +8 % | – | – |
| 2 | Absagen | nichts passiert | – | – |

#### EV-strom · ⚡ Stromausfall im Frantoio

> Rosalias Presse steht. Die Oliven in den Kisten fangen an zu gären.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Generator mieten (300 €) | Rosalia ♥+12 | – | – |
| 2 | Warten | Qualität −8 | – | – |

#### EV-regen · 🌧️ Dauerregen zur Ernte

> Die Wege in die Contrade sind Matsch. Pflücken im Regen schadet den Früchten.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Warten, bis es trocknet | Ertrag −5 %, Qualität bleibt | – | – |
| 2 | Trotzdem pflücken | Qualität −6 | – | – |

#### EV-japan · 🗾 E-Mail aus Tokio

> Ein Feinkosthändler in Ginza sucht sizilianisches Premium-Öl. Nur Qualität ≥ 70.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | 50 l zu 200 % | Qualität ≥ 70 | – | – |
| 2 | Absagen | nichts passiert | – | – |

#### EV-hochzeit · 💍 Hochzeit in der Matrice

> Die Tochter des Apothekers heiratet. 300 Gäste – Gastgeschenk: kleine Ölflaschen.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | 40 l als Gastgeschenk | zu 140 %, ★ +4 | – | – |
| 2 | Hingehen & tanzen | 50 € Geschenk, Padre ♥+4, Sindaco ♥+4 | – | – |

#### EV-kurs · ✂️ Schnittkurs vom Meister

> Ein Agronom aus Castelvetrano zeigt, wie man Nocellara richtig schneidet.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Teilnehmen (200 €) | alle Haine +6 %, Ertrag +5 % | – | – |
| 2 | Kein Bedarf | nichts passiert | – | – |

#### EV-rai · 📺 RAI-Sendung „Linea Verde“

> Das Fernsehen dreht im Belice. Sie suchen einen Hain mit Postkartenblick.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Drehgenehmigung geben | ★ +10 bei Zustand ≥ 60, sonst −3 | – | – |
| 2 | An Chiara weiterreichen | Chiara ♥+8 | – | – |

#### EV-xylella · 🦠 Xylella-Gerücht

> In Salvos Bar heißt es, das Bakterium sei in der Provinz angekommen.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Labortest (300 €) | ★ +3, Ruhe | – | – |
| 2 | Gerücht ignorieren | ★ −2 | – | – |

#### EV-hund · 🐕 Ein streunender Hund

> Ein Mischling folgt dir seit Tagen durch die Vicoli. Alle nennen ihn Peppino.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Adoptieren (60 €) | ★ +2, Wachhund | – | – |
| 2 | Weiterlaufen | nichts passiert | – | – |

#### EV-imu · 🧾 Bescheid vom Finanzamt

> Grundsteuer auf deine Haine: 380 €. Oder Einspruch?

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Zahlen (380 €) | sauber | – | – |
| 2 | Einspruch | 50 %: 0 € · 50 %: 600 € | – | – |

#### EV-dop · 🏅 Prüfer für DOP Val di Mazara

> Mit dem DOP-Siegel bekommt dein Öl dauerhaft 8 % mehr.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Zertifizieren (1.000 €) | +8 % Preis, ★ +3 | – | – |
| 2 | Später | nichts passiert | – | – |

#### EV-bank · 🏦 Die Sicilbanca ruft an

> Direttore Mangiapane bietet einen Kredit zu Sonderzinsen – oder will eine Spende fürs Fest.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | 5.000 € Kredit nehmen | 1 % Zins/Monat | – | – |
| 2 | Spende fürs Fest (150 €) | ★ +3 | – | – |
| 3 | Auflegen | nichts passiert | – | – |

#### EV-turi1 · 🗣️ Turi redet schlecht über dein Öl

> Salvo flüstert: „Turi erzählt in der Bar, dein Öl sei gepanscht.“

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Ihn öffentlich zur Rede stellen | ★ +3, Turi ♥−15, Fortsetzung … | – | – |
| 2 | Auf einen Caffè einladen | Turi ♥+12, Salvo ♥+3 | – | – |
| 3 | Ignorieren | ★ −3, Fortsetzung … | – | – |

Folge-Ereignisse: EV-turi2

#### EV-turi2 · 🔧 Sabotage am Bewässerungsschlauch

> Jemand hat deinen Schlauch zerschnitten. Reifenspuren führen zu Turis Hang.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Carabinieri rufen | Turi ♥−10, ★ +2 | – | – |
| 2 | Padre Vito vermitteln lassen | Padre ♥ ≥ 40, Turi ♥+20 | – | – |
| 3 | Selbst flicken (150 €) | still bleiben | – | – |

Folge-Ereignisse: EV-turi3

#### EV-turi3 · 🤝 Turi will gemeinsam mahlen

> „Mahlen wir zusammen bei Rosalia, dann zahlt jeder die Hälfte.“

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Einschlagen | Mahlgebühr −50 % | – | – |
| 2 | Ablehnen | nichts passiert | – | – |

#### EV-klaus1 · 🏡 Klaus will ein Agriturismo

> „Dein alter Casale in Pandolfina – daraus mach ma a Agriturismo! Du die Oliven, ich die Gäste.“

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Partner werden (1.000 € Einlage) | Fortsetzung in 2 Monaten | – | – |
| 2 | Erst mal nur Kaffee | Klaus ♥+5 | – | – |
| 3 | Kein Interesse | nichts passiert | – | – |

Folge-Ereignisse: EV-klaus2

#### EV-klaus2 · 📐 Die Baugenehmigung hakt

> Das Bauamt im Palazzo dell'Arpa blockiert den Umbau. Klaus ist verzweifelt.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Mit dem Sindaco reden | Sindaco ♥ ≥ 50 | – | – |
| 2 | Geometra einschalten (600 €) | sicher | – | – |
| 3 | Aufgeben | Einlage verloren | – | – |

Folge-Ereignisse: EV-klaus3

#### EV-klaus3 · 🎉 Eröffnung: Agriturismo Pandolfina

> Lichterketten, Caponata, die Banda spielt. Die ersten Gäste aus Deutschland sind da.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Mit Öl-Verkostung eröffnen | +250 €/Monat, ★ +6 | – | – |
| 2 | Stille Teilhaberschaft | +200 €/Monat | – | – |

#### EV-export2 · 📦 Bestellung aus München

> Klaus' Spezl will dein Öl für sein Feinkostgeschäft am Viktualienmarkt.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | 150 l zu 160 % | Qualität ≥ 55 | – | – |
| 2 | 50 l zu 150 % | kleine Menge | – | – |
| 3 | Kein Öl übrig | nichts passiert | – | – |

#### EV-sindaco1 · 🗳️ Der Sindaco braucht Unterstützer

> Für einen EU-Antrag „Strada dell'Olio Terre Sicane“ braucht er Betriebe, die mitmachen.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Unterschreiben & mitplanen | Sindaco ♥+15, Fortsetzung … | – | – |
| 2 | Politik? Nein danke | nichts passiert | – | – |

Folge-Ereignisse: EV-sindaco2

#### EV-sindaco2 · 💶 EU-Topf bewilligt!

> Die Strada dell'Olio kommt. Wer mitgemacht hat, bekommt Geld für Schilder & Verkostungen.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Geld abholen | +1.800 €, ★ +4 | – | – |
| 2 | In die Strada investieren | Tourismus-Deal, ★ +6 | – | – |

#### EV-padre1 · ⛪ Das Dach der Matrice leckt

> Padre Vito sammelt für die Reparatur der Chiesa Madre – rechtzeitig vor der Madonna dell'Udienza.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Großzügig spenden (500 €) | Padre ♥+20, Ehre im Mai … | – | – |
| 2 | Kleine Spende (100 €) | Padre ♥+6 | – | – |
| 3 | Nichts geben | nichts passiert | – | – |

#### EV-vend1 · 🍇 Die Weinlese ruft – deine Crew wackelt

> Die Cantine am Lago Arancio zahlen Lesehelfern 30 % mehr. Deine Leute überlegen zu wechseln – und im Oktober fehlen sie dir für die Oliven.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Lohn erhöhen (+400 €) | Crew bleibt sicher | – | – |
| 2 | Crew mit Giusi teilen | Giusi ♥ ≥ 40: Sept. Wein, Okt. Oliven | – | – |
| 3 | Gehen lassen | keine Crew mehr | – | – |

#### EV-vend2 · 🍷 Vendemmia-Chaos

> Die Lese ist spät dran. Giusi braucht deinen Rüttler und zwei Hände – sonst platzen die Trauben.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Selbst mitlesen (3 Tage) | Giusi ♥+15, Haine −4 % | – | – |
| 2 | Gerät verleihen | Rüttler nötig, +300 € | – | – |
| 3 | Wein-Nebenlinie starten (1.200 €) | eigene Etiketten, Verkauf ab Nov. | – | – |
| 4 | Nicht meine Baustelle | nichts passiert | – | – |

#### EV-vend3 · ⏰ Kommt die Crew rechtzeitig zurück?

> Die Weinlese zieht sich. Deine Oliven sind reif – jeder Tag Warten kostet Qualität.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Bonus zahlen, sofort zurück | 350 € | – | – |
| 2 | Abwarten | Glückssache | – | – |
| 3 | Früh ernten, Novello-Qualität | Ertrag −10 %, Qualität +6 | – | – |

#### EV-santa · ✝️ Settimana Santa: Prozession des Cristo Morto

> Karfreitag. Die Banda Gian Matteo Rinaldo spielt Trauermärsche, die Addolorata zieht durch den Corso Umberto. Ganz Sambuca ist auf der Straße.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Mit der Confraternita mitgehen | Padre ♥+12, ★ +4 | – | – |
| 2 | Die Banda sponsern (300 €) | ★ +7, Sindaco ♥+6 | – | – |
| 3 | Ostergebäck mit Nonna verkaufen | +220 €, Nonna ♥+6 | – | – |

#### EV-giorgio · 🐎 San Giorgio: Feldsegnung am 23. April

> Der Heilige reitet für die Bauern. Nach der Segnung gibt’s die Zabbinata – frische Ricotta für alle.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Haine segnen lassen | alle Haine +6 %, Padre ♥+5 | – | – |
| 2 | Zabbinata mit Turi teilen | Turi ♥+10 | – | – |
| 3 | Öl-Stand am Sagrato | bis 40 l zu 140 % | – | – |

#### EV-ud1 · 🕯️ Udienza Tag 1: Pilgerweg vom Cellaro

> Die Festwoche beginnt: Tausende pilgern nachts vom Cellaro hinauf zum Santuario del Carmine. Die Luminarie gehen an.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Mitpilgern neben Padre Vito | Padre ♥+10, ★ +4 | – | – |
| 2 | Wasser & Öl-Brot für Pilger (200 €) | ★ +8, Chiara ♥+6 | – | – |
| 3 | Mit dem Sindaco im Auto vorfahren | Sindaco ♥+10, ★ −2 | – | – |

#### EV-ud2 · 🏇 Udienza Tag 4: Palio & Minna Fest

> Der Palio jagt durch die Straßen, auf der Piazza duftet es nach Minni di Virgini. Bester Verkaufstag des Jahres.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Großer Stand am Corso (350 €) | bis 150 l zu 165 %, ★ +6 | – | – |
| 2 | Gemeinschaftsstand mit Nonna | bis 60 l zu 150 %, Nonna ♥+10 | – | – |
| 3 | Auf ein Pferd im Palio setzen | 150 €: 30 % → +600 € | – | – |

#### EV-ud3 · 💡 Udienza Tag 6: Sponsor der Luminarie

> Das Festkomitee sucht Sponsoren für die Lichterbögen über dem Corso – dein Name würde eine Woche lang leuchten.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Hauptsponsor (1.200 €) | ★ +15, Sindaco ♥+12, Padre ♥+8 | – | – |
| 2 | Ein Lichterbogen (400 €) | ★ +6, Sindaco ♥+5 | – | – |
| 3 | Nur zuschauen | gratis | – | – |

#### EV-ud4 · 🥂 Udienza Tag 8: Empfang im Palazzo dell'Arpa

> Der Sindaco lädt Honoratioren, Winzer und Gäste aus dem Ausland. Wer hier die richtigen Hände schüttelt, macht das Geschäft des Jahres.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Klaus & seinen Münchner Spezl treffen | Klaus ♥+15, Export-Anfrage folgt | – | – |
| 2 | Mit Giusi über Wein & Öl reden | Giusi ♥+15 | – | – |
| 3 | Chiara: Tourismus-Deal sofort | Chiara ♥ ≥ 45 | – | – |

Folge-Ereignisse: EV-export2

#### EV-ud5 · 🎆 Udienza Finale: La Nisciuta

> Mitternacht. Die Madonna verlässt auf dem Fercolo von 1817 das Santuario. Glocken, Tränen, Feuerwerk über dem Lago Arancio. Ganz Sambuca schaut, wer heute in der ersten Reihe steht.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Den Fercolo mittragen | Padre ♥ ≥ 60 oder Dach-Spende · ★ +14 | – | – |
| 2 | Nachtverkauf am Belvedere | bis 80 l zu 150 % | – | – |
| 3 | Feuerwerk mit allen in Salvos Bar | 100 €, alle ♥+3 | – | – |

#### EV-vassalli · 🍝 Festa dei Vassalli (5. August)

> Pasta col Macco für das ganze Viertel. Die Tische stehen mitten in den Vicoli Saraceni.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Öl für die Riesenpfanne spenden (15 l) | ★ +6, Nonna ♥+8 | – | – |
| 2 | Mit Turi am Tisch sitzen | Turi ♥+10 | – | – |
| 3 | Zu heiß heute | nichts passiert | – | – |

#### EV-calici · 🌠 Calici di Stelle am Belvedere (10. August)

> Sternschnuppennacht der Strada del Vino Terre Sicane. Winzer schenken aus, das Tal glitzert. Wen sprichst du an?

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Giusi – Wein-Kooperation | Giusi ♥ ≥ 50: DEAL, sonst ♥+12 | – | – |
| 2 | Klaus – Export & Gäste | Klaus ♥+12, Export-Anfrage | – | – |
| 3 | Öl-Wein-Pairing-Stand (200 €) | bis 60 l zu 160 % | – | – |

Folge-Ereignisse: EV-export2

#### EV-fiera · 🐂 Fiera del Bestiame (21.–22. Sept.)

> Der große Viehmarkt: Maultiere, Traktoren, Netze, Rüttler – und alle Bauern des Tals an einem Ort.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Gebrauchten Rüttler kaufen (1.200 €) | Ernte +15 %, Lohnkosten −50 % | – | – |
| 2 | Erntehelfer anwerben | Lohn zum Messepreis (500 €) | – | – |
| 3 | Bauern-Netzwerk: Turi & Cooperativa | Turi ♥+8, ★ +3 | – | – |

#### EV-zabut · 🌟 Natale a Sambuca: Krippe in den Vicoli

> Lebende Krippe in den Gassen, Zampognari, Weihnachtsmarkt auf der Piazza. Die Pro Loco sucht Stände.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Stand mit Geschenk-Kisten | bis 80 l zu 160 % | – | – |
| 2 | Rosso Pandolfina verkaufen | Wein-Nebenlinie | – | – |
| 3 | Hirte in der Krippe spielen | ★ +5, Padre ♥+6 | – | – |

#### EV-sturm · 🌪️ Sturmwarnung über dem Belice

> Böen bis 100 km/h. Leitern, Kisten, Netze und der Rüttler liegen noch draußen im Hain!

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | 🎮 Alles in Sicherheit bringen | Minispiel: je mehr du rettest, desto weniger Schaden | – | MG-rescue-sturm |
| 2 | Helfer bezahlen (350 €) | Schaden −70 % | – | – |
| 3 | Fenster zu und hoffen | voller Schaden | – | – |

#### EV-flut · 🌊 Starkregen: Der Belice tritt über die Ufer

> Seit drei Tagen schüttet es. Die unteren Terrassen laufen voll, Erde rutscht ab.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | 🎮 Sandsäcke schleppen | Minispiel: Dämme stopfen | – | MG-rescue-flut |
| 2 | Bagger aus Adragna (500 €) | Schaden −80 % | – | – |
| 3 | Abwarten | voller Schaden | – | – |

#### EV-dolores1 · 🥂 Eine Amerikanerin kauft die Villa am Lago

> Ganz Sambuca redet über Dolores Whitfield aus Texas. Sie soll Journalisten kennen. Man sieht sie im Sommer auf Festen und abends in der Bar.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Eine Flasche Öl an die Villa schicken (5 l) | sie erinnert sich an dich | – | – |
| 2 | Abwarten | nichts passiert | – | – |

#### EV-wang1 · 📦 Container-Lieferung bei Signor Wang

> In der Ferramenta Cinese stapeln sich neue Kartons: Netze, Spaten, Pumpen – alles „fast wie Original“.

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Billig-Netze sichern (180 €) | Sturmschutz für 1 Sturm | – | – |
| 2 | Kein Bedarf | nichts passiert | – | – |

#### EV-carmela1 · 🍋 Es klopft: die Nachbarin

> Eine ältere Dame mit einem Korb Zitronen steht vor deiner Tür. „Ich bin Carmela. Von nebenan.“

| # | Wahl | Folge (Spieltext) | nur wenn | Minispiel |
|---|---|---|---|---|
| 1 | Reinbitten (Plaudern im Büro) | Sie ist im Büro – tippe sie an | – | – |
| 2 | Keine Zeit | nichts passiert | – | – |

<!-- END GENERATED:events-choices -->

## v0.8
- `rollEvents` mischt Ereignisse aus Nachbarmonaten zu 50 % mit. Ereignisse aus `g.prev` (letztes Jahr bzw. letztes Spiel, `localStorage sambuca5_seen`) werden nachrangig gezogen.
- `diebe` hat eine Hund-Option, das Risiko liegt dann bei 10 %. `duerre` und `scirocco` nennen das Wasserrecht.
- `carmela1` setzt `fl.carmelaHere`, damit Carmela sofort anzutreffen ist (±1 Monat).
- Event-Karten haben keinen Rahmen mehr, nur einen Schatten. `santa`, `giorgio`, `vassalli` und `calici` zeigen ein Fest-Bildbanner (`EV_IMG`).
- **EV-brand** (v0.8, OI-035): Flächenbrand im Juli/August, Katastrophe. Optionen: Schneise hält / Protezione Civile / Minispiel `brand` / abwarten. Folgen: Zustand, Bäume (`burn`), Ertrag.
