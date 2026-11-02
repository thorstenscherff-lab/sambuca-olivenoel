# Orte (v0.7.1)

Navigation über 4 Tabs (UI.md):
- **buero:** Büro
- **stadt:** Stadtplan Sambuca
- **umland:** Umland
- **tal:** Valle del Belice

Auf den Karten führen **Pins** (`PIN-*`) entweder zu einer illustrierten **Szene** (`LOC-*`) mit **Hotspots** (`HOT-<szene>-<hotspot>`) oder in das Sheet `UI-pin`. **Kleine Orte** (`MIN-*`) öffnen `UI-minor` mit Begegnungen. Kartenquellen und Pin-Koordinaten stehen in [MAPS.md](MAPS.md), Szenenbilder in [ASSETS.md](ASSETS.md).

## Szenen und Hotspots

<!-- BEGIN GENERATED:scenes -->
| ID | Szene | Untertitel | venue | Hotspots | Stammgäste (at) | Code |
|---|---|---|---|---|---|---|
| `LOC-buero` | DEIN BÜRO | Casa in der Via Delfino | buero | HOT-buero-pc (Computer · Aufträge), HOT-buero-tel (Telefon), HOT-buero-regal (Lager & Haine), HOT-buero-kal (Kalender), HOT-buero-fenster (Zur Stadt), HOT-buero-tuer (Raus aufs Land) | CH-carmela | `source/game/src/e.tsx:81` |
| `LOC-rathaus` | MUNICIPIO | Rathaus von Sambuca | muni | HOT-rathaus-schalter (Schalter · Anträge), HOT-rathaus-sindaco (Büro des Sindaco), HOT-rathaus-aushang (Aushang) | CH-chiara, CH-sindaco | `source/game/src/e.tsx:82` |
| `LOC-bar` | BAR DEL CORSO | Corso Umberto I · Pasticceria | bar | HOT-bar-caffe (Caffè & Gerüchte (2 €)), HOT-bar-wette (Calcio-Wette (50 €)), HOT-bar-zeitung (Ölpreis) | CH-salvo, CH-wang, CH-ciccio, CH-turi, CH-chiara, CH-klaus, CH-dolores | `source/game/src/e.tsx:84` |
| `LOC-banca` | BANCA | Corso Umberto I · Kredit zu 1 % | banca | HOT-banca-pin-banca (Kreditschalter) | – | `source/game/src/e.tsx:86` |
| `LOC-teatro` | PALAZZO & TEATRO | Don Calogero · Haine von Erben | palazzo | HOT-teatro-pin-palazzo (Don Calogero sprechen) | – | `source/game/src/e.tsx:87` |
| `LOC-belv` | BELVEDERE | Blick über das Belice-Tal | belv | HOT-belv-pin-belv (Ausblick) | – | `source/game/src/e.tsx:88` |
| `LOC-feudo` | FEUDO ARANCIO | Weingut · Großkunde | feudo | HOT-feudo-pin-feudo (Zum Gutshaus) | CH-giusi | `source/game/src/e.tsx:89` |
| `LOC-frantoio` | FRANTOIO | Die Ölmühle | frantoio | HOT-frantoio-pin-frantoio (Mühle) | CH-rosalia | `source/game/src/e.tsx:90` |
| `LOC-hain` | DEIN HAIN | Olivenbäume unter der Stadt | hain | HOT-hain-regal (Haine verwalten) | – | `source/game/src/e.tsx:91` |
| `LOC-lago` | LAGO ARANCIO | Wasser · Villen | lago | HOT-lago-pin-lago (Am Steg) | CH-klaus, CH-dolores | `source/game/src/e.tsx:92` |
| `LOC-ruine` | TORRE & ADRANONE | Zio Turis Hang | torre | HOT-ruine-pin-torre (Ruinen) | CH-turi | `source/game/src/e.tsx:93` |
| `LOC-chiesa` | CHIESA MADRE | Madonna dell'Udienza | chiesa | HOT-chiesa-kerze (Kerze (5 €)), HOT-chiesa-spende (Opferstock (150 €)), HOT-chiesa-beichte (Beichtstuhl), HOT-chiesa-altar (Madonna) | CH-nonna, CH-carmela, CH-rosalia, CH-padre | `source/game/src/e.tsx:94` |
| `LOC-fest` | FESTA | – | fest | HOT-fest-prog (Festprogramm) | CH-carmela, CH-rosalia, CH-ciccio, CH-padre, CH-turi, CH-giusi, CH-chiara, CH-klaus, CH-dolores, CH-sindaco | `source/game/src/e.tsx:96` |
<!-- END GENERATED:scenes -->

Spot-Aktionen (Hotspots mit Kosten):

Alle Spot-Aktionen gehen **einmal pro Monat** (`acts`-Präfix `sp_`). Code: `source/game/src/d.tsx:127-139`.

| Hotspot | Kosten | Wirkung |
|---|---|---|
| HOT-bar-caffe | 2 € | Gerücht: zeigt die Symbole der Zufallsereignisse des nächsten Monats (Vorschau über `rollEvents`) |
| HOT-bar-wette | 50 €, 1 AP | 45 % Chance auf +110 € |
| HOT-chiesa-kerze | 5 € | ★ +1, `fl.pray`: nächste Katastrophe ×0.6 |
| HOT-chiesa-spende | 150 € | ★ +3, ♥ Padre +3 |
| HOT-chiesa-beichte | 1 AP | ★ +1 |
| HOT-rathaus-aushang | – | Hinweis auf das Fest im nächsten Monat |

HOT-bar-zeitung („Ölpreis“) öffnet `UI-regal` (→ OI-003). HOT-chiesa-altar und HOT-fest-prog sind Info-Hotspots.

## Karten-Pins

<!-- BEGIN GENERATED:pins -->
| ID | Karte | Label | Rolle | öffnet | Code |
|---|---|---|---|---|---|
| `PIN-casa` | Stadt | Casa (Via Delfino) | Dein Büro | LOC-buero | `source/game/src/f.tsx:3` |
| `PIN-banca` | Stadt | Sicilbanca | Kredit | LOC-banca | `source/game/src/f.tsx:4` |
| `PIN-muni` | Stadt | Municipio | Rathaus | LOC-rathaus | `source/game/src/f.tsx:5` |
| `PIN-palazzo` | Stadt | Teatro & Palazzo | Don Calogero · Haine | LOC-teatro | `source/game/src/f.tsx:6` |
| `PIN-caffe` | Stadt | Bar del Corso | Leute & Gerüchte | LOC-bar | `source/game/src/f.tsx:7` |
| `PIN-chiesa` | Stadt | Chiesa Madre | Gemeinde | LOC-chiesa | `source/game/src/f.tsx:8` |
| `PIN-belv` | Stadt | Belvedere | Ausblick | LOC-belv | `source/game/src/f.tsx:9` |
| `PIN-torre` | Umland | Torre di Pandolfina | Turis Hang | LOC-ruine | `source/game/src/f.tsx:12` |
| `PIN-frantoio` | Umland | Frantoio | Ölmühle | LOC-frantoio | `source/game/src/f.tsx:13` |
| `PIN-hain` | Umland | Dein Hain | Olivenbäume | LOC-hain | `source/game/src/f.tsx:14` |
| `PIN-feudo` | Umland | Feudo Arancio | Großkunde | LOC-feudo | `source/game/src/f.tsx:15` |
| `PIN-lago` | Umland | Lago Arancio | Wasser · Villen | LOC-lago | `source/game/src/f.tsx:16` |
| `PIN-sambuca` | Umland | Sambuca | Zur Stadt | Sheet „pin“ | `source/game/src/f.tsx:17` |
<!-- END GENERATED:pins -->

## Hain-Standorte (Start-Angebote)

`lago` Hain am Lago Arancio, `adranone` Alte Bäume am Stadtrand, `misili` Contrada Misilifurmi, `adragna` Terrassen bei Adragna, `batia` Contrada Batia, `genuardo` Hang am Monte Genuardo, `torreh` Hain unter der Torre, `giov` Uliveto Giovinco.

Die Angebote liegen in `g.offers`. Rivalen schnappen sie sich zum Termin `until` (ECONOMY.md).

## Kleine Orte und Begegnungen

<!-- BEGIN GENERATED:minors -->
#### MIN-ferr · 🔧 Ferramenta Cinese (Stadt)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Ein Bauer reklamiert lautstark seinen kaputten Spaten. | Mitlachen | Wang ♥+3 | – | `source/game/src/c.tsx:87` |
| Restposten: Fliegenfallen, Kiste zu 40 €. | Kiste kaufen (40 €) | nächste Fallen −50 % | – | `source/game/src/c.tsx:88` |
| Wang zeigt dir ein Video vom Großhandel in Palermo. | Zuschauen | Wang ♥+4 | – | `source/game/src/c.tsx:89` |

#### MIN-panif · 🥖 Panificio (Stadt)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Die Bäckerin braucht Öl für ihre Focaccia. | 10 l verkaufen (130 %) | – | ja | `source/game/src/c.tsx:91` |
| Schlange vor der Theke – alle reden über Zio Turi. | Zuhören | ★ +1 | – | `source/game/src/c.tsx:92` |
| Frische Cuccidati für die Nonna? | Kaufen (6 €) | Nonna ♥+4 | – | `source/game/src/c.tsx:93` |

#### MIN-tabac · 🎟️ Tabacchi & Lotto (Stadt)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Gratta e Vinci, das Los zu 5 €. | Rubbeln (5 €) | 10 %: 250 € | – | `source/game/src/c.tsx:95` |
| Der Tabaccaio sucht ein Geschenk für seine Schwiegermutter. | 5 l Öl verkaufen (150 %) | – | ja | `source/game/src/c.tsx:96` |

#### MIN-barb · 💈 Barbiere Gaspare (Stadt)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Haarschnitt 12 € – und der komplette Dorfklatsch. | Schneiden lassen (12 €) | ★ +2 | – | `source/game/src/c.tsx:98` |
| Gaspare rasiert sonst den Sekretär des Sindaco. | Gutes Wort einlegen (50 €) | Sindaco ♥+6 (auch unbekannt) | – | `source/game/src/c.tsx:99` |

#### MIN-farm · ⚕️ Farmacia (Stadt)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Dein Rücken nach der Arbeit im Hain … | Wärmesalbe (15 €) | +2 ⏳ nächsten Monat | – | `source/game/src/c.tsx:101` |
| Die Apothekerin fragt nach Öl für Naturkosmetik. | 15 l verkaufen (140 %) | – | ja | `source/game/src/c.tsx:102` |

#### MIN-edic · 📰 Edicola (Stadt)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Giornale di Sicilia: Ölpreis-Prognose. | Zeitung (2 €) | Preis-Trend | – | `source/game/src/c.tsx:104` |
| Kleinanzeigen im Lokalblatt. | Inserat schalten (150 €) | ★ +3 | – | `source/game/src/c.tsx:105` |

#### MIN-mac · 🥩 Macelleria (Stadt)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Der Metzger braucht Öl für seine Salsiccia. | 15 l verkaufen (125 %) | – | ja | `source/game/src/c.tsx:107` |
| Ciccio liefert gerade Lämmer ab. | Hallo sagen | Ciccio ♥+4 (auch unbekannt) | – | `source/game/src/c.tsx:108` |

#### MIN-masseria · 🏚️ Masseria abbandonata (Umland)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Im Schuppen stehen alte Ölkrüge. | Durchsuchen | Glückssache | – | `source/game/src/c.tsx:110` |
| Jugendliche aus Sambuca feiern hier. | Mitfeiern | ★ +1 | – | `source/game/src/c.tsx:111` |

#### MIN-imker · 🐝 Apicoltore Nino (Umland)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Nino will Bienenstöcke in deinen Hain stellen. | Einverstanden | Ertrag +4 % (dieses Jahr) | ja | `source/game/src/c.tsx:113` |
| Honig gegen Öl? | 5 l tauschen | Nonna ♥+5 | ja | `source/game/src/c.tsx:114` |

#### MIN-pozzo · ⛲ Brunnen (Umland)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Kühles Quellwasser. | Kanister schleppen | Sommer: Haine +3 % | – | `source/game/src/c.tsx:116` |

#### MIN-kapelle · 🕯️ Cappella di Adragna (Umland)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Ein Votivbild der Madonna, Kerzenstummel. | Kerze anzünden | nächste Katastrophe −40 % | – | `source/game/src/c.tsx:118` |

#### MIN-schaefer · 🐑 Ciccios Weide (Umland)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Die Schafe könnten unter deinen Bäumen weiden. | Erlauben | Haine +3 % | – | `source/game/src/c.tsx:120` |
| Frische Ricotta, noch warm. | Probieren (3 €) | Ciccio ♥+3 | – | `source/game/src/c.tsx:121` |

#### MIN-consorzio · 🧰 Consorzio Agrario (Umland)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Agronom-Beratung am Tresen. | Beraten lassen (60 €) | Haine +4 % | – | `source/game/src/c.tsx:123` |

#### MIN-bosco · 🌲 Bosco della Resinata (Umland)

| Begegnung | Aktion | Folge | Bedingung | Code |
|---|---|---|---|---|
| Pilzsaison im Wald. | Pilze sammeln | ~40 € | – | `source/game/src/c.tsx:125` |
| Die Jäger von Adragna. | Wurst teilen | ★ +2 | – | `source/game/src/c.tsx:126` |
<!-- END GENERATED:minors -->
