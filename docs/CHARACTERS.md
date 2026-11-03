# Figuren – Sambuca Olivenöl (v0.9.0)

Alle Figuren sind **frei erfunden**. Ähnlichkeiten mit realen Personen aus Sambuca di Sicilia sind nicht beabsichtigt. Es liegen **keine echten Fotos** von Thorsten im Repo. Die Porträts wurden per Bildgenerierung erzeugt, Die Prompts der Porträts 0–12 sind verloren, die der Porträts 13–22 (v0.9.0) sind sinngemäß dokumentiert (siehe unten).

Querverweise: Figuren-IDs `CH-<id>`, Ereignisse → [EVENTS.md](EVENTS.md), Orte → [LOCATIONS.md](LOCATIONS.md), Gesprächs-Minispiel → [MINIGAMES.md](MINIGAMES.md#mg-talk), Perks/Deals → [ECONOMY.md](ECONOMY.md).

## Beziehungssystem (Code: `source/game/src/d.tsx`, `src/e.tsx`)

- **Kennenlernen:** Du sprichst eine Figur an einem ihrer Orte (`at`) an. Dann läuft MG-talk (6 Themenkarten, 3 Runden). Score s = Treffer/6. Bestanden ist das Gespräch bei s ≥ `MEETNEED[diff]` = [0, 0.30, 0.45, 0.60, 0.70, 0.80] (ECO-MEETNEED).
  - **Erfolg:** Die Figur kommt nach `g.met` (SAVE-met), und ♥ (`g.rel`, SAVE-rel) wird max(alt, 25) + 15·s.
  - **Misserfolg:** `fl.try_<id>` wird gesetzt, und du kannst es erst im nächsten Monat wieder versuchen.
- **Kontakt-Gating (v0.9.0, FB-38/OI-048):** Jede Figur kann Bedingungen haben (`Chr.from` = frühester absoluter Monat, `Chr.rep` = Mindest-Ansehen ★, `Chr.vb` = Vitamin B). `gateMiss(g,c)` (a.tsx) liefert die fehlenden Punkte, die das Personen-Sheet als „Nötig: …“ zeigt; `present()` blendet nicht erreichbare Figuren an ihren Orten aus. **Pro Monat höchstens eine neue Bekanntschaft** (`fl.metM` = absoluter Monat des letzten Kennenlernens).
- **Vitamin B (v0.9.0, FB-39/OI-049):** Figuren mit `vb: [vermittler, ♥]` sind nur nach einer Vorstellung erreichbar. Der Vermittler bekommt ab dieser ♥ automatisch den einmaligen Perk `vb_<id>` „🤝 Vitamin B: Stell mich … vor“ (c.tsx, nach PERKS). Er setzt `fl.intro_<id>` = absoluter Monat; danach ist die Figur erreichbar und die Gesprächs-Schwelle sinkt um eine Stufe (`MEETNEED[diff−1]`). Ketten: Nonna → Padre Vito → Sindaco · Salvo → Klaus → Dolores · Nonna → Dott.ssa Lo Bue · Ciccio → Nino · Rosalia → Ragioniere Mangiaracina.
- **Weitere Vorbedingungen:** `CH-dolores` braucht zusätzlich Ansehen ★ ≥ 20, `CH-sindaco` ★ ≥ 35. Für die Audienz im Rathaus (`UI-sindaco`, Hotspot `HOT-rathaus-sindaco`) braucht der Sindaco ★ ≥ 50.
- **Pflege:** einmal pro Monat ein Gespräch (`g.talked`, SAVE-talked) oder Geschenk (`acts`-Präfix `gift`).
- **Perks:** Ab einer bestimmten ♥ wird eine Aktion freigeschaltet. Ihr Takt ist einmalig, 1×/Monat oder 1×/Jahr (`acts`-Präfix `pk`). Manche Perks schließen einen Deal ab (`g.deals`).
- **Feste:** Zu jedem Fest sind Gäste eingetragen (80 % Anwesenheit, siehe [CALENDAR.md](CALENDAR.md)).
- **Porträt:** Sprite `IMG_P` mit 23 Zellen à 96×128 px (`PORT_N` in ui_old.tsx). Index `i` = Zelle.

## Zählung

<!-- BEGIN GENERATED:counts -->
| Inventar | Anzahl |
|---|---|
| Figuren | 23 |
| Ereignisse gesamt | 61 |
| · davon Zufall | 41 |
| · davon Katastrophen | 11 |
| · davon Fest-Ereignisse | 14 |
| · nur als Folge/fix | 6 |
| Wahlmöglichkeiten | 162 |
| Feste | 6 |
| Monatsziele | 12 |
| Perks | 30 |
| Deals | 11 |
| Szenen | 16 |
| Hotspots | 30 |
| Karten-Pins | 16 |
| Kleine Orte | 16 |
| Begegnungen | 32 |
| Laden-Artikel | 15 |
| Minispiele | 9 |
| Sheets (UI) | 16 |
| Spielstand-Felder G | 42 |
<!-- END GENERATED:counts -->

## Übersicht Gating & Ladenbesitzer (v0.9.0)

| Figur | Ort | Kontakt ab | Ansehen | Vitamin B | Was sie/er bringt (Perk) |
|---|---|---|---|---|---|
| Nonna Pina, Zia Carmela | – | von Anfang an bekannt | – | – | siehe Eintrag unten |
| Salvo | Bar | Monat 1 | – | – | siehe Eintrag unten |
| Nunzia (Panificio) | panif | Monat 1 | – | – | `focac` 15 l zu 135 %/Monat (♥ 45) |
| Signor Wang | Ferramenta | Monat 2 | – | – | siehe Eintrag unten |
| Signora Lin (Y&L Haushaltswaren) | casal | Monat 2 | – | – | `linsell` 10 l zu 150 %/Monat (♥ 40) |
| Pippo (Tabaccheria) | tabac, Bar | Monat 2 | – | – | `tabsell` 8 l zu 150 %/Monat (♥ 40) |
| Enzo (Edicola, Reporter) | edic, Bar | Monat 2 | – | – | `artikel` ★ +5 einmalig (♥ 40) |
| Signora Rosalia | Frantoio | Monat 3 | – | – | siehe Eintrag unten |
| Klaus Berger | – | Monat 3 | – | Salvo ♥ 45 | siehe Eintrag unten |
| Barbiere Gaspare | barb, Bar | Monat 3 | – | – | `rasur` Sindaco ♥ +8, sonst ★ +2/Jahr (♥ 50) |
| Peppe (Macelleria) | mac, Feste | Monat 3 | ★ 10 | – | `pecor` 20 l zu 130 %/Monat (♥ 50) |
| Marta (U Dog's Garden) | dogs | Monat 3 | – | – | `hund` Wachhund gratis, einmalig (♥ 45) |
| Zio Turi | – | Monat 4 | – | – | siehe Eintrag unten |
| Dott.ssa Lo Bue (Farmacia) | farm | Monat 4 | – | Nonna ♥ 60 | `crema` 30 l zu 170 %/Jahr, Qualität ≥ 50 (♥ 45) |
| Nino (Apicoltore) | imker | Monat 4 | – | Ciccio ♥ 45 | `voelker` Ertrag +5 %/Jahr (♥ 45) |
| Padre Vito | Chiesa | – | – | Nonna ♥ 55 | siehe Eintrag unten |
| Chiara Mulè | – | Monat 5 | ★ 15 | – | siehe Eintrag unten |
| Ragioniere Mangiaracina | Consorzio | Monat 5 | – | Rosalia ♥ 50 | `antrag` 800–1 500 € Förderung/Jahr (♥ 50) |
| Ciccio u Pasturi | – | Monat 6 | ★ 15 | – | siehe Eintrag unten |
| Giusi Ferrante | – | Monat 7 | ★ 20 | – | siehe Eintrag unten |
| Dolores Whitfield | – | – | ★ 20 | Klaus ♥ 50 | siehe Eintrag unten |
| Sindaco Totò Bonura | Municipio | – | ★ 35 | Padre ♥ 50 | siehe Eintrag unten |

„Monat n“ = n-ter Spielmonat im ersten Jahr (Code: `from` = n−1). Die maßgeblichen Werte stehen im generierten Teil unten unter „Kontakt (v0.9.0 Gating)“ und werden von `source/tools/export_characters.py` direkt aus `a.tsx` gelesen. Aussehen jeder Figur: siehe Porträt-Tabelle am Ende.

## Alle Figuren (aus dem Code erzeugt)

<!-- BEGIN GENERATED:characters -->
### Nonna Pina (`nonna`)

- **Rolle:** Deine Nonna · Minni di Virgini
- **Orte:** Chiesa Madre, Panificio, Santuario
- **Feste (Gast):** 3: SETTIMANA SANTA & SAN GIORGIO; 11: NATALE A SAMBUCA
- **Schwierigkeit:** 0 → Gesprächs-Score ≥ 0 %
- **Mag:** essen, familie · **mag nicht:** technik
- **Sprüche:** ♥ niedrig „Iss erst mal was, du bist ganz dünn!“ · mittel „Dein Nonno wäre stolz. Ein bisschen.“ · hoch „Die ganze Familie hilft dir. Basta!“
- **Aktionen (Perks):** 👪 Familien-Crew (ab ♥ 65, einmalig: Die Familie erntet mit – Crew gratis; `source/game/src/c.tsx:72`)
- **Deals:** `family` Familien-Crew (Nonna)
- **Ereignisse/Begegnungen:** Reisebus aus Palermo (`touristen`, `source/game/evs.tsx:19-22`); Nonnas Geheimrezept (`rezept`, `source/game/evs.tsx:73-75`); Settimana Santa: Prozession des Cristo Morto (`santa`, `source/game/evs.tsx:171-174`); Udienza Tag 4: Palio & Minna Fest (`ud2`, Hauptfigur, `source/game/evs.tsx:184-187`); Festa dei Vassalli (5. August) (`vassalli`, Hauptfigur, `source/game/evs.tsx:201-204`)
- **Begegnungen an kleinen Orten:** Panificio: „Frische Cuccidati für die Nonna?“ → Kaufen (6 €) (`source/game/src/c.tsx:124`); Apicoltore Nino: „Honig gegen Öl?“ → 5 l tauschen (`source/game/src/c.tsx:145`)
- **Kontakt (v0.9.0 Gating):** sofort (bzw. von Anfang an bekannt) · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:28` · Porträt-Index `i: 3`

### Salvo (`salvo`)

- **Rolle:** Bar del Corso · hört alles
- **Orte:** Bar del Corso, → Lido Boomerang
- **Feste (Gast):** –
- **Schwierigkeit:** 1 → Gesprächs-Score ≥ 30 %
- **Mag:** calcio, essen · **mag nicht:** politik
- **Sprüche:** ♥ niedrig „Un caffè? 1,20. Gerüchte kosten extra.“ · mittel „Setz dich. Ich hab was gehört …“ · hoch „Für dich: Insider-Tipps, gratis.“
- **Aktionen (Perks):** 📈 Insider-Tipp Ölpreis (ab ♥ 35, monatlich: Trend für nächsten Monat; `source/game/src/c.tsx:75`); ☕ Öl über die Bar verkaufen (ab ♥ 60, monatlich: bis 40 l zu 135 %; `source/game/src/c.tsx:76`)
- **Deals:** –
- **Ereignisse/Begegnungen:** Olio-Novello-Hype (`novello`, `source/game/evs.tsx:44-47`); Olivendiebe unterwegs (`diebe`, `source/game/evs.tsx:60-64`); Nonnas Geheimrezept (`rezept`, `source/game/evs.tsx:73-75`); Salvos Wette: Palermo gegen Catania (`wette`, `source/game/evs.tsx:76-79`); Turi redet schlecht über dein Öl (`turi1`, `source/game/evs.tsx:118-121`)
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab Januar Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:30` · Porträt-Index `i: 5`

### Zia Carmela (`carmela`)

- **Rolle:** Nachbarin · weiß alles zuerst
- **Orte:** Büro (zuhause), Panificio, Chiesa Madre, Feste, Santuario
- **Feste (Gast):** 3: SETTIMANA SANTA & SAN GIORGIO; 4: MADONNA DELL'UDIENZA; 7: VASSALLI & CALICI DI STELLE; 11: NATALE A SAMBUCA
- **Schwierigkeit:** 1 → Gesprächs-Score ≥ 30 %
- **Mag:** essen, kirche · **mag nicht:** geld
- **Sprüche:** ♥ niedrig „Ah, der Neue von nebenan!“ · mittel „Komm, ich hab Zitronen für dich.“ · hoch „Wenn ein Sturm kommt, sag ich dir’s vor dem Wetterbericht.“
- **Aktionen (Perks):** 🌦️ Wetter-Tratsch (ab ♥ 30, monatlich: verrät Katastrophen im nächsten Monat; `source/game/src/c.tsx:73`); 🍋 Zitronen-Öl (Agrumato) (ab ♥ 50, monatlich: 20 l Öl → 30 Fläschchen à 18 €; `source/game/src/c.tsx:74`)
- **Deals:** –
- **Ereignisse/Begegnungen:** Es klopft: die Nachbarin (`carmela1`, `source/game/src/c.tsx:28-30`)
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** sofort (bzw. von Anfang an bekannt) · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:29` · Porträt-Index `i: 9`

### Signora Lin (`lin`)

- **Rolle:** Y&L Haushaltswaren · Casalinghi
- **Orte:** Y&L Haushaltswaren
- **Feste (Gast):** –
- **Schwierigkeit:** 1 → Gesprächs-Score ≥ 30 %
- **Mag:** geld, familie · **mag nicht:** politik
- **Sprüche:** ♥ niedrig „Kleine Flaschen? Hab ich. Öl drin? Noch nicht.“ · mittel „Deine Fläschchen verkaufen sich besser als Plastikeimer!“ · hoch „Du kriegst das beste Regal am Eingang, Freund.“
- **Aktionen (Perks):** 🧴 Öl ins Ladenregal (ab ♥ 40, monatlich: bis 10 l zu 150 %; `source/game/src/c.tsx:89`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab Februar Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:42` · Porträt-Index `i: 13`

### Nunzia (`nunzia`)

- **Rolle:** Panificio · backt seit 4 Uhr früh
- **Orte:** Panificio
- **Feste (Gast):** –
- **Schwierigkeit:** 1 → Gesprächs-Score ≥ 30 %
- **Mag:** essen, familie · **mag nicht:** technik
- **Sprüche:** ♥ niedrig „Brot ist um sieben weg. Wer schläft, verliert.“ · mittel „Mit deinem Öl wird meine Focaccia berühmt.“ · hoch „Für dich: das erste Blech, immer.“
- **Aktionen (Perks):** 🥖 Öl für die Focaccia (ab ♥ 45, monatlich: bis 15 l zu 135 %; `source/game/src/c.tsx:90`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab Januar Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:43` · Porträt-Index `i: 14`

### Pippo (`pippo`)

- **Rolle:** Tabacchi & Lotto · weiß, wer verliert
- **Orte:** Tabacchi & Lotto, Bar del Corso
- **Feste (Gast):** –
- **Schwierigkeit:** 1 → Gesprächs-Score ≥ 30 %
- **Mag:** calcio, geld · **mag nicht:** kirche
- **Sprüche:** ♥ niedrig „Rubbellos? Heute ist dein Glückstag. Vielleicht.“ · mittel „Die Lastwagenfahrer fragen nach gutem Öl.“ · hoch „Mein Laden, dein Verkaufsstand.“
- **Aktionen (Perks):** 🎟️ Öl an die Lkw-Fahrer (ab ♥ 40, monatlich: bis 8 l zu 150 %; `source/game/src/c.tsx:92`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab Februar Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:45` · Porträt-Index `i: 16`

### Enzo (`enzo`)

- **Rolle:** Edicola · schreibt fürs Lokalblatt
- **Orte:** Edicola, Bar del Corso
- **Feste (Gast):** –
- **Schwierigkeit:** 1 → Gesprächs-Score ≥ 30 %
- **Mag:** politik, reisen · **mag nicht:** geld
- **Sprüche:** ♥ niedrig „Hast du eine Geschichte für mich?“ · mittel „Der Neue mit den Oliven – das liest man gern.“ · hoch „Titelseite. Morgen. Mit Foto.“
- **Aktionen (Perks):** 📰 Artikel im Lokalblatt (ab ♥ 40, einmalig: einmalig: ★ +5; `source/game/src/c.tsx:94`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab Februar Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:47` · Porträt-Index `i: 18`

### Marta (`marta`)

- **Rolle:** O-Dogs Garden · Hundepension
- **Orte:** O-Dogs Garden
- **Feste (Gast):** –
- **Schwierigkeit:** 1 → Gesprächs-Score ≥ 30 %
- **Mag:** familie, reisen · **mag nicht:** geld
- **Sprüche:** ♥ niedrig „Vorsicht, Bruno beißt nur Diebe.“ · mittel „Ein Hain braucht einen Hund. Glaub mir.“ · hoch „Meine Hunde passen auf dich auf. Gratis.“
- **Aktionen (Perks):** 🐕 Wachhund geschenkt (ab ♥ 45, einmalig: einmalig: Wachhund gratis (Schutz vor Olivendieben); `source/game/src/c.tsx:97`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab März Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:50` · Porträt-Index `i: 21`

### Padre Vito (`padre`)

- **Rolle:** Pfarrer · Chiesa Madre
- **Orte:** Chiesa Madre, Feste, Santuario
- **Feste (Gast):** 3: SETTIMANA SANTA & SAN GIORGIO; 4: MADONNA DELL'UDIENZA; 11: NATALE A SAMBUCA
- **Schwierigkeit:** 2 → Gesprächs-Score ≥ 45 %
- **Mag:** kirche, familie · **mag nicht:** geld
- **Sprüche:** ♥ niedrig „Ich sehe Sie selten bei der Messe.“ · mittel „Die Madonna segnet die Fleißigen.“ · hoch „Sie gehören jetzt zur Gemeinde.“
- **Aktionen (Perks):** ⛪ Feldsegen bestellen (ab ♥ 45, 1×/Jahr: 1×/Jahr: Haine +8 %, ★ +3; `source/game/src/c.tsx:70`)
- **Deals:** –
- **Ereignisse/Begegnungen:** Hagel über dem Monte Genuardo (`hagel`, `source/game/evs.tsx:7-10`); Hochzeit in der Matrice (`hochzeit`, `source/game/evs.tsx:92-94`); Sabotage am Bewässerungsschlauch (`turi2`, `source/game/evs.tsx:122-125`); Das Dach der Matrice leckt (`padre1`, Hauptfigur, `source/game/evs.tsx:150-154`); Settimana Santa: Prozession des Cristo Morto (`santa`, Hauptfigur, `source/game/evs.tsx:171-174`); San Giorgio: Feldsegnung am 23. April (`giorgio`, Hauptfigur, `source/game/evs.tsx:175-179`); Udienza Tag 1: Pilgerweg vom Cellaro (`ud1`, Hauptfigur, `source/game/evs.tsx:180-183`); Udienza Tag 6: Sponsor der Luminarie (`ud3`, `source/game/evs.tsx:188-191`); Udienza Finale: La Nisciuta (`ud5`, Hauptfigur, `source/game/evs.tsx:196-200`); Natale a Sambuca: Krippe in den Vicoli (`zabut`, `source/game/evs.tsx:215-218`)
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** Vitamin B: Vorstellung durch `nonna` ab ♥ 55 (Perk `vb_padre`; danach Gesprächs-Schwelle eine Stufe leichter) · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:34` · Porträt-Index `i: 1`

### Signora Rosalia (`rosalia`)

- **Rolle:** Frantoio · presst seit 30 Jahren
- **Orte:** Frantoio, Chiesa Madre, Feste, Santuario
- **Feste (Gast):** 3: SETTIMANA SANTA & SAN GIORGIO; 7: VASSALLI & CALICI DI STELLE; 9: RACCOLTA
- **Schwierigkeit:** 2 → Gesprächs-Score ≥ 45 %
- **Mag:** oliven, familie · **mag nicht:** politik
- **Sprüche:** ♥ niedrig „Hinten anstellen. Wie alle.“ · mittel „Deine Oliven sind besser geworden.“ · hoch „Für dich lass ich die Presse auch nachts laufen.“
- **Aktionen (Perks):** ⚙️ Mühlen-Deal (ab ♥ 55, einmalig: Mahlgebühr dauerhaft −50 %; `source/game/src/c.tsx:71`)
- **Deals:** `mill` Mühlen-Deal (Rosalia)
- **Ereignisse/Begegnungen:** Stromausfall im Frantoio (`strom`, `source/game/evs.tsx:83-85`); Turi will gemeinsam mahlen (`turi3`, `source/game/evs.tsx:126-128`); Fiera del Bestiame (21.–22. Sept.) (`fiera`, `source/game/evs.tsx:210-214`)
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab März Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:32` · Porträt-Index `i: 2`

### Signor Wang (`wang`)

- **Rolle:** Ferramenta Cinese · hat alles, billig
- **Orte:** Ferramenta Cinese, Bar del Corso, Sicilbanca
- **Feste (Gast):** 8: VENDEMMIA & FIERA
- **Schwierigkeit:** 2 → Gesprächs-Score ≥ 45 %
- **Mag:** technik, geld · **mag nicht:** wein
- **Sprüche:** ♥ niedrig „Spaten? 19 Euro! Hält … eine Weile.“ · mittel „Für Stammkunden: Großhandelspreis.“ · hoch „Freund! Ich bestelle dir direkt aus Ningbo.“
- **Aktionen (Perks):** 🚢 Direktimport aus Ningbo (ab ♥ 55, einmalig: neuer Rüttler für 700 € (hält); `source/game/src/c.tsx:77`)
- **Deals:** `ningbo` Direktimport (Wang)
- **Ereignisse/Begegnungen:** Container-Lieferung bei Signor Wang (`wang1`, `source/game/src/c.tsx:25-27`)
- **Begegnungen an kleinen Orten:** Ferramenta Cinese: „Ein Bauer reklamiert lautstark seinen kaputten Spaten.“ → Mitlachen (`source/game/src/c.tsx:118`); Ferramenta Cinese: „Wang zeigt dir ein Video vom Großhandel in Palermo.“ → Zuschauen (`source/game/src/c.tsx:120`)
- **Kontakt (v0.9.0 Gating):** ab Februar Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:31` · Porträt-Index `i: 11`

### Ciccio u Pasturi (`ciccio`)

- **Rolle:** Schäfer · Vorarbeiter der Erntehelfer
- **Orte:** Ciccios Weide, Bar del Corso, Feste, Belvedere, Dein Hain
- **Feste (Gast):** 3: SETTIMANA SANTA & SAN GIORGIO; 8: VENDEMMIA & FIERA; 9: RACCOLTA
- **Schwierigkeit:** 2 → Gesprächs-Score ≥ 45 %
- **Mag:** calcio, oliven · **mag nicht:** technik
- **Sprüche:** ♥ niedrig „Hm.“ · mittel „Meine Jungs pflücken schneller als jede Maschine.“ · hoch „Die Crew gehört dir. Auch zur Vendemmia.“
- **Aktionen (Perks):** 👷 Ciccios Crew anheuern (ab ♥ 40, 1×/Jahr: Erntehelfer, Lohn −25 %, Ertrag +10 %; `source/game/src/c.tsx:78`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** Macelleria: „Ciccio liefert gerade Lämmer ab.“ → Hallo sagen (`source/game/src/c.tsx:139`); Ciccios Weide: „Die Schafe könnten unter deinen Bäumen weiden.“ → Erlauben (`source/game/src/c.tsx:151`); Ciccios Weide: „Frische Ricotta, noch warm.“ → Probieren (3 €) (`source/game/src/c.tsx:152`)
- **Kontakt (v0.9.0 Gating):** ab Juni Jahr 1 · Ansehen ★ ≥ 15 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:33` · Porträt-Index `i: 12`

### Barbiere Gaspare (`gaspare`)

- **Rolle:** Barbiere · rasiert den Sindaco
- **Orte:** Barbiere Gaspare, Bar del Corso
- **Feste (Gast):** –
- **Schwierigkeit:** 2 → Gesprächs-Score ≥ 45 %
- **Mag:** politik, calcio · **mag nicht:** reisen
- **Sprüche:** ♥ niedrig „Kurz? Lang? Oder nur reden?“ · mittel „Der Sindaco sitzt jeden Donnerstag auf diesem Stuhl …“ · hoch „Ich hab dem Sindaco was Gutes über dich erzählt.“
- **Aktionen (Perks):** 💈 Ein gutes Wort beim Sindaco (ab ♥ 50, 1×/Jahr: 1×/Jahr: Sindaco ♥ +8 (wenn bekannt), sonst ★ +2; `source/game/src/c.tsx:91`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** Barbiere Gaspare: „Gaspare rasiert sonst den Sekretär des Sindaco.“ → Gutes Wort einlegen (50 €) (`source/game/src/c.tsx:130`)
- **Kontakt (v0.9.0 Gating):** ab März Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:44` · Porträt-Index `i: 15`

### Dott.ssa Lo Bue (`lobue`)

- **Rolle:** Farmacia · Kosmetik aus Olivenöl
- **Orte:** Farmacia
- **Feste (Gast):** –
- **Schwierigkeit:** 2 → Gesprächs-Score ≥ 45 %
- **Mag:** technik, familie · **mag nicht:** calcio
- **Sprüche:** ♥ niedrig „Ohne Termin? Wir sind keine Bar.“ · mittel „Polyphenole … Ihr Öl ist interessant.“ · hoch „Unsere Olivenöl-Creme trägt jetzt deinen Namen.“
- **Aktionen (Perks):** ⚕️ Olivenöl-Kosmetik (ab ♥ 45, 1×/Jahr: 1×/Jahr: bis 30 l zu 170 %; `source/game/src/c.tsx:93`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab April Jahr 1 · Vitamin B: Vorstellung durch `nonna` ab ♥ 60 (Perk `vb_lobue`; danach Gesprächs-Schwelle eine Stufe leichter) · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:46` · Porträt-Index `i: 17`

### Peppe (`peppe`)

- **Rolle:** Macelleria · Salsiccia-König
- **Orte:** Macelleria, Feste
- **Feste (Gast):** –
- **Schwierigkeit:** 2 → Gesprächs-Score ≥ 45 %
- **Mag:** essen, calcio · **mag nicht:** reisen
- **Sprüche:** ♥ niedrig „Fleisch oder Fragen? Fleisch geht schneller.“ · mittel „Mein Pecorino in deinem Öl … Madonna.“ · hoch „Meine Kundschaft kauft jetzt dein Öl mit.“
- **Aktionen (Perks):** 🥩 Öl für den Pecorino (ab ♥ 50, monatlich: bis 20 l zu 130 %; `source/game/src/c.tsx:95`)
- **Deals:** –
- **Ereignisse/Begegnungen:** Cousin Peppe braucht Geld (`cousin`, `source/game/evs.tsx:34-37`)
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab März Jahr 1 · Ansehen ★ ≥ 10 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:48` · Porträt-Index `i: 19`

### Nino (`nino`)

- **Rolle:** Apicoltore · Imker im Belice
- **Orte:** Apicoltore Nino
- **Feste (Gast):** –
- **Schwierigkeit:** 2 → Gesprächs-Score ≥ 45 %
- **Mag:** oliven, kirche · **mag nicht:** technik
- **Sprüche:** ♥ niedrig „Leise. Die Bienen mögen keine Hektik.“ · mittel „Deine Bäume blühen gut. Die Bienen wissen das.“ · hoch „Meine besten Völker stehen jetzt in deinem Hain.“
- **Aktionen (Perks):** 🐝 Bienenvölker in den Hain (ab ♥ 45, 1×/Jahr: 1×/Jahr: Ertrag +5 %; `source/game/src/c.tsx:96`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** Apicoltore Nino: „Nino will Bienenstöcke in deinen Hain stellen.“ → Einverstanden (`source/game/src/c.tsx:144`)
- **Kontakt (v0.9.0 Gating):** ab April Jahr 1 · Vitamin B: Vorstellung durch `ciccio` ab ♥ 45 (Perk `vb_nino`; danach Gesprächs-Schwelle eine Stufe leichter) · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:49` · Porträt-Index `i: 20`

### Giusi Ferrante (`giusi`)

- **Rolle:** Winzerin · Cantina am Lago
- **Orte:** Feudo Arancio, Feste, Sicilbanca, Hotel Don Giovanni
- **Feste (Gast):** 4: MADONNA DELL'UDIENZA; 7: VASSALLI & CALICI DI STELLE; 8: VENDEMMIA & FIERA
- **Schwierigkeit:** 3 → Gesprächs-Score ≥ 60 %
- **Mag:** wein, geld · **mag nicht:** calcio
- **Sprüche:** ♥ niedrig „Öl? Wein ist das Geschäft hier, caro.“ · mittel „Wein und Öl – zusammen unschlagbar.“ · hoch „Socio! Meine Leute sind deine Leute.“
- **Aktionen (Perks):** 🍷 Wein-Nebenlinie (ab ♥ 40, 1×/Jahr: 600 Flaschen, Verkauf ab Nov.; `source/game/src/c.tsx:79`); 🍾 Rosso Pandolfina verkaufen (ab ♥ 0, monatlich: 600 Flaschen à ~4 €; `source/game/src/c.tsx:80`); 🤝 Wein-Kooperation (ab ♥ 65, einmalig: Crew & Gerät teilen: Löhne −30 %; `source/game/src/c.tsx:81`)
- **Deals:** –
- **Ereignisse/Begegnungen:** Die Weinlese ruft – deine Crew wackelt (`vend1`, Hauptfigur, `source/game/evs.tsx:155-158`); Vendemmia-Chaos (`vend2`, Hauptfigur, `source/game/evs.tsx:159-163`); Udienza Tag 8: Empfang im Palazzo dell'Arpa (`ud4`, `source/game/evs.tsx:192-195`); Calici di Stelle am Belvedere (10. August) (`calici`, Hauptfigur, `source/game/evs.tsx:205-209`); Natale a Sambuca: Krippe in den Vicoli (`zabut`, `source/game/evs.tsx:215-218`)
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab Juli Jahr 1 · Ansehen ★ ≥ 20 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:36` · Porträt-Index `i: 4`

### Chiara Mulè (`chiara`)

- **Rolle:** Pro Loco · Tourismus
- **Orte:** Municipio, Bar del Corso, Feste, Teatro & Palazzo, → Lido Boomerang
- **Feste (Gast):** 4: MADONNA DELL'UDIENZA; 11: NATALE A SAMBUCA
- **Schwierigkeit:** 3 → Gesprächs-Score ≥ 60 %
- **Mag:** technik, reisen · **mag nicht:** geld
- **Sprüche:** ♥ niedrig „Hast du ein Instagram? Nein? Madonna …“ · mittel „Die Busse aus Palermo suchen echte Erlebnisse!“ · hoch „Du bist jetzt auf jeder Tour!“
- **Aktionen (Perks):** 🍞 Verkostung für Tourist:innen (ab ♥ 40, monatlich: Apr–Okt: bis 25 l zu 145 %, ★ +2; `source/game/src/c.tsx:82`); 🚌 Tourismus-Deal (ab ♥ 65, einmalig: Monatseinnahmen von der Pro Loco; `source/game/src/c.tsx:83`)
- **Deals:** `tour` Tourismus-Deal (Pro Loco)
- **Ereignisse/Begegnungen:** Foodbloggerin aus Mailand (`blogger`, `source/game/evs.tsx:11-14`); Reisebus aus Palermo (`touristen`, `source/game/evs.tsx:19-22`); RAI-Sendung „Linea Verde“ (`rai`, `source/game/evs.tsx:98-100`); EU-Topf bewilligt! (`sindaco2`, `source/game/evs.tsx:147-149`); Udienza Tag 1: Pilgerweg vom Cellaro (`ud1`, `source/game/evs.tsx:180-183`); Udienza Tag 8: Empfang im Palazzo dell'Arpa (`ud4`, `source/game/evs.tsx:192-195`); Natale a Sambuca: Krippe in den Vicoli (`zabut`, Hauptfigur, `source/game/evs.tsx:215-218`)
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab Mai Jahr 1 · Ansehen ★ ≥ 15 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:37` · Porträt-Index `i: 6`

### Klaus Berger (`klaus`)

- **Rolle:** Aussteiger aus München
- **Orte:** Bar del Corso, Lago Arancio, Feste, Hotel Don Giovanni, Belvedere (nur Monate [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
- **Feste (Gast):** 4: MADONNA DELL'UDIENZA; 7: VASSALLI & CALICI DI STELLE
- **Schwierigkeit:** 3 → Gesprächs-Score ≥ 60 %
- **Mag:** reisen, essen · **mag nicht:** calcio
- **Sprüche:** ♥ niedrig „Grüß Gott! Ich mach hier was mit Tourismus.“ · mittel „Mein Spezl in München hat ein Feinkostgeschäft …“ · hoch „Partner! Das wird das Agriturismo vom ganzen Belice!“
- **Aktionen (Perks):** 🇩🇪 Export nach München (ab ♥ 60, einmalig: alle Verkäufe +8 %; `source/game/src/c.tsx:84`)
- **Deals:** –
- **Ereignisse/Begegnungen:** Klaus will ein Agriturismo (`klaus1`, Hauptfigur, `source/game/evs.tsx:129-132`); Die Baugenehmigung hakt (`klaus2`, `source/game/evs.tsx:133-136`); Eröffnung: Agriturismo Pandolfina (`klaus3`, Hauptfigur, `source/game/evs.tsx:137-139`); Bestellung aus München (`export2`, Hauptfigur, `source/game/evs.tsx:140-143`); Udienza Tag 8: Empfang im Palazzo dell'Arpa (`ud4`, Hauptfigur, `source/game/evs.tsx:192-195`); Calici di Stelle am Belvedere (10. August) (`calici`, `source/game/evs.tsx:205-209`)
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab März Jahr 1 · Vitamin B: Vorstellung durch `salvo` ab ♥ 45 (Perk `vb_klaus`; danach Gesprächs-Schwelle eine Stufe leichter) · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:38` · Porträt-Index `i: 7`

### Zio Turi (`turi`)

- **Rolle:** Rivale vom Nachbarhang
- **Orte:** Bar del Corso, Feste, Torre di Pandolfina, Dein Hain
- **Feste (Gast):** 4: MADONNA DELL'UDIENZA; 7: VASSALLI & CALICI DI STELLE; 8: VENDEMMIA & FIERA
- **Schwierigkeit:** 3 → Gesprächs-Score ≥ 60 %
- **Mag:** oliven, calcio · **mag nicht:** reisen
- **Sprüche:** ♥ niedrig „Was schaust du? Das ist MEIN Hang.“ · mittel „Deine Bäume sehen besser aus als letztes Jahr.“ · hoch „Wir Bauern müssen zusammenhalten.“
- **Aktionen (Perks):** 🕊️ Waffenstillstand (ab ♥ 55, einmalig: keine Sabotage mehr, ★ +4; `source/game/src/c.tsx:85`)
- **Deals:** `coop` Mahl-Gemeinschaft (Turi), `truce` Waffenstillstand (Turi)
- **Ereignisse/Begegnungen:** Nachtfrost angesagt (`frost`, `source/game/evs.tsx:3-6`); Der alte Fiat-Traktor streikt (`traktor`, `source/game/evs.tsx:65-68`); Turi redet schlecht über dein Öl (`turi1`, Hauptfigur, `source/game/evs.tsx:118-121`); Sabotage am Bewässerungsschlauch (`turi2`, Hauptfigur, `source/game/evs.tsx:122-125`); Turi will gemeinsam mahlen (`turi3`, Hauptfigur, `source/game/evs.tsx:126-128`); San Giorgio: Feldsegnung am 23. April (`giorgio`, `source/game/evs.tsx:175-179`); Udienza Finale: La Nisciuta (`ud5`, `source/game/evs.tsx:196-200`); Festa dei Vassalli (5. August) (`vassalli`, `source/game/evs.tsx:201-204`); Fiera del Bestiame (21.–22. Sept.) (`fiera`, Hauptfigur, `source/game/evs.tsx:210-214`)
- **Begegnungen an kleinen Orten:** Panificio: „Schlange vor der Theke – alle reden über Zio Turi.“ → Zuhören (`source/game/src/c.tsx:123`)
- **Kontakt (v0.9.0 Gating):** ab April Jahr 1 · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:35` · Porträt-Index `i: 8`

### Ragioniere Mangiaracina (`ragio`)

- **Rolle:** Consorzio Agrario · Anträge & Stempel
- **Orte:** Consorzio Agrario
- **Feste (Gast):** –
- **Schwierigkeit:** 3 → Gesprächs-Score ≥ 60 %
- **Mag:** geld, oliven · **mag nicht:** reisen
- **Sprüche:** ♥ niedrig „Formular B-7. In dreifacher Ausfertigung.“ · mittel „Ihre Unterlagen sind … ungewöhnlich vollständig.“ · hoch „Für Sie fülle ich den Antrag persönlich aus.“
- **Aktionen (Perks):** 🧾 Förderantrag Consorzio (ab ♥ 50, 1×/Jahr: 1×/Jahr: 800–1.500 € Agrarförderung; `source/game/src/c.tsx:98`)
- **Deals:** –
- **Ereignisse/Begegnungen:** –
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** ab Mai Jahr 1 · Vitamin B: Vorstellung durch `rosalia` ab ♥ 50 (Perk `vb_ragio`; danach Gesprächs-Schwelle eine Stufe leichter) · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:51` · Porträt-Index `i: 22`

### Dolores Whitfield (`dolores`)

- **Rolle:** Reiche Amerikanerin · Villa am Lago
- **Orte:** Feste, Bar del Corso, Lago Arancio, Teatro & Palazzo, Hotel Don Giovanni, → Lido Boomerang (nur Monate [4, 5, 6, 7, 8])
- **Feste (Gast):** 4: MADONNA DELL'UDIENZA; 7: VASSALLI & CALICI DI STELLE
- **Schwierigkeit:** 4 → Gesprächs-Score ≥ 70 %
- **Mag:** reisen, wein · **mag nicht:** politik
- **Sprüche:** ♥ niedrig „Darling, I only drink champagne.“ · mittel „My friends at the Times would LOVE this place.“ · hoch „Honey, half of Texas will fly in for your oil!“
- **Aktionen (Perks):** 📰 US-Presse: Reportage in New York (ab ♥ 50, einmalig: 1.000 €: Preis +10 %, US-Tourist:innen zahlen monatlich; `source/game/src/c.tsx:86`); 🇺🇸 Container nach Texas (ab ♥ 70, 1×/Jahr: 1×/Jahr: bis 120 l zu 220 %; `source/game/src/c.tsx:87`)
- **Deals:** –
- **Ereignisse/Begegnungen:** Eine Amerikanerin kauft die Villa am Lago (`dolores1`, `source/game/src/c.tsx:22-24`)
- **Begegnungen an kleinen Orten:** –
- **Kontakt (v0.9.0 Gating):** Ansehen ★ ≥ 20 · Vitamin B: Vorstellung durch `klaus` ab ♥ 50 (Perk `vb_dolores`; danach Gesprächs-Schwelle eine Stufe leichter) · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:39` · Porträt-Index `i: 10`

### Sindaco Totò Bonura (`sindaco`)

- **Rolle:** Bürgermeister · Fördertöpfe
- **Orte:** Feste, Municipio
- **Feste (Gast):** 4: MADONNA DELL'UDIENZA; 11: NATALE A SAMBUCA
- **Schwierigkeit:** 5 → Gesprächs-Score ≥ 80 %
- **Mag:** politik, geld · **mag nicht:** technik
- **Sprüche:** ♥ niedrig „Und Sie sind …? Mein Sekretär macht Termine.“ · mittel „Ah, der Olivenmensch! Sambuca braucht Leute wie Sie.“ · hoch „Für Sie ist die Tür im Palazzo immer offen.“
- **Aktionen (Perks):** 🏛️ Fördertopf anzapfen (ab ♥ 50, 1×/Jahr: 1×/Jahr: 1.500–3.500 € PSR-Mittel; `source/game/src/c.tsx:68`); 🏅 DOP auf dem kurzen Dienstweg (ab ♥ 65, einmalig: DOP für 600 € statt 1.200 €; `source/game/src/c.tsx:69`)
- **Deals:** –
- **Ereignisse/Begegnungen:** Kontrolle der Forstbehörde (`kontrolle`, `source/game/evs.tsx:15-18`); Incendio! Flächenbrand am Hang (`brand`, `source/game/evs.tsx:55-59`); Giornale di Sicilia will ein Interview (`zeitung`, `source/game/evs.tsx:69-72`); Hochzeit in der Matrice (`hochzeit`, `source/game/evs.tsx:92-94`); Die Baugenehmigung hakt (`klaus2`, Hauptfigur, `source/game/evs.tsx:133-136`); Der Sindaco braucht Unterstützer (`sindaco1`, Hauptfigur, `source/game/evs.tsx:144-146`); EU-Topf bewilligt! (`sindaco2`, Hauptfigur, `source/game/evs.tsx:147-149`); Settimana Santa: Prozession des Cristo Morto (`santa`, `source/game/evs.tsx:171-174`); Udienza Tag 1: Pilgerweg vom Cellaro (`ud1`, `source/game/evs.tsx:180-183`); Udienza Tag 6: Sponsor der Luminarie (`ud3`, Hauptfigur, `source/game/evs.tsx:188-191`); Udienza Tag 8: Empfang im Palazzo dell'Arpa (`ud4`, `source/game/evs.tsx:192-195`)
- **Begegnungen an kleinen Orten:** Barbiere Gaspare: „Gaspare rasiert sonst den Sekretär des Sindaco.“ → Gutes Wort einlegen (50 €) (`source/game/src/c.tsx:130`)
- **Kontakt (v0.9.0 Gating):** Ansehen ★ ≥ 35 · Vitamin B: Vorstellung durch `padre` ab ♥ 50 (Perk `vb_sindaco`; danach Gesprächs-Schwelle eine Stufe leichter) · max. 1 neue Bekanntschaft/Monat
- **Definition:** `source/game/src/a.tsx:40` · Porträt-Index `i: 0`

<!-- END GENERATED:characters -->

## Perks

<!-- BEGIN GENERATED:perks -->
| ID | Figur | Aktion | Wirkung | ab ♥ | Takt | Code |
|---|---|---|---|---|---|---|
| `PERK-topf` | CH-sindaco | 🏛️ Fördertopf anzapfen | 1×/Jahr: 1.500–3.500 € PSR-Mittel | 50 | 1×/Jahr | `source/game/src/c.tsx:68` |
| `PERK-dopx` | CH-sindaco | 🏅 DOP auf dem kurzen Dienstweg | DOP für 600 € statt 1.200 € | 65 | einmalig | `source/game/src/c.tsx:69` |
| `PERK-segen` | CH-padre | ⛪ Feldsegen bestellen | 1×/Jahr: Haine +8 %, ★ +3 | 45 | 1×/Jahr | `source/game/src/c.tsx:70` |
| `PERK-mill` | CH-rosalia | ⚙️ Mühlen-Deal | Mahlgebühr dauerhaft −50 % | 55 | einmalig | `source/game/src/c.tsx:71` |
| `PERK-fam` | CH-nonna | 👪 Familien-Crew | Die Familie erntet mit – Crew gratis | 65 | einmalig | `source/game/src/c.tsx:72` |
| `PERK-tratsch` | CH-carmela | 🌦️ Wetter-Tratsch | verrät Katastrophen im nächsten Monat | 30 | 1×/Monat | `source/game/src/c.tsx:73` |
| `PERK-agrum` | CH-carmela | 🍋 Zitronen-Öl (Agrumato) | 20 l Öl → 30 Fläschchen à 18 € | 50 | 1×/Monat | `source/game/src/c.tsx:74` |
| `PERK-tipp` | CH-salvo | 📈 Insider-Tipp Ölpreis | Trend für nächsten Monat | 35 | 1×/Monat | `source/game/src/c.tsx:75` |
| `PERK-barsell` | CH-salvo | ☕ Öl über die Bar verkaufen | bis 40 l zu 135 % | 60 | 1×/Monat | `source/game/src/c.tsx:76` |
| `PERK-ningbo` | CH-wang | 🚢 Direktimport aus Ningbo | neuer Rüttler für 700 € (hält) | 55 | einmalig | `source/game/src/c.tsx:77` |
| `PERK-crew` | CH-ciccio | 👷 Ciccios Crew anheuern | Erntehelfer, Lohn −25 %, Ertrag +10 % | 40 | 1×/Jahr | `source/game/src/c.tsx:78` |
| `PERK-wein` | CH-giusi | 🍷 Wein-Nebenlinie | 600 Flaschen, Verkauf ab Nov. | 40 | 1×/Jahr | `source/game/src/c.tsx:79` |
| `PERK-winesell` | CH-giusi | 🍾 Rosso Pandolfina verkaufen | 600 Flaschen à ~4 € | 0 | 1×/Monat | `source/game/src/c.tsx:80` |
| `PERK-coopw` | CH-giusi | 🤝 Wein-Kooperation | Crew & Gerät teilen: Löhne −30 % | 65 | einmalig | `source/game/src/c.tsx:81` |
| `PERK-tast` | CH-chiara | 🍞 Verkostung für Tourist:innen | Apr–Okt: bis 25 l zu 145 %, ★ +2 | 40 | 1×/Monat | `source/game/src/c.tsx:82` |
| `PERK-tour` | CH-chiara | 🚌 Tourismus-Deal | Monatseinnahmen von der Pro Loco | 65 | einmalig | `source/game/src/c.tsx:83` |
| `PERK-exp` | CH-klaus | 🇩🇪 Export nach München | alle Verkäufe +8 % | 60 | einmalig | `source/game/src/c.tsx:84` |
| `PERK-truce` | CH-turi | 🕊️ Waffenstillstand | keine Sabotage mehr, ★ +4 | 55 | einmalig | `source/game/src/c.tsx:85` |
| `PERK-press` | CH-dolores | 📰 US-Presse: Reportage in New York | 1.000 €: Preis +10 %, US-Tourist:innen zahlen monatlich | 50 | einmalig | `source/game/src/c.tsx:86` |
| `PERK-texas` | CH-dolores | 🇺🇸 Container nach Texas | 1×/Jahr: bis 120 l zu 220 % | 70 | 1×/Jahr | `source/game/src/c.tsx:87` |
| `PERK-linsell` | CH-lin | 🧴 Öl ins Ladenregal | bis 10 l zu 150 % | 40 | 1×/Monat | `source/game/src/c.tsx:89` |
| `PERK-focac` | CH-nunzia | 🥖 Öl für die Focaccia | bis 15 l zu 135 % | 45 | 1×/Monat | `source/game/src/c.tsx:90` |
| `PERK-rasur` | CH-gaspare | 💈 Ein gutes Wort beim Sindaco | 1×/Jahr: Sindaco ♥ +8 (wenn bekannt), sonst ★ +2 | 50 | 1×/Jahr | `source/game/src/c.tsx:91` |
| `PERK-tabsell` | CH-pippo | 🎟️ Öl an die Lkw-Fahrer | bis 8 l zu 150 % | 40 | 1×/Monat | `source/game/src/c.tsx:92` |
| `PERK-crema` | CH-lobue | ⚕️ Olivenöl-Kosmetik | 1×/Jahr: bis 30 l zu 170 % | 45 | 1×/Jahr | `source/game/src/c.tsx:93` |
| `PERK-artikel` | CH-enzo | 📰 Artikel im Lokalblatt | einmalig: ★ +5 | 40 | einmalig | `source/game/src/c.tsx:94` |
| `PERK-pecor` | CH-peppe | 🥩 Öl für den Pecorino | bis 20 l zu 130 % | 50 | 1×/Monat | `source/game/src/c.tsx:95` |
| `PERK-voelker` | CH-nino | 🐝 Bienenvölker in den Hain | 1×/Jahr: Ertrag +5 % | 45 | 1×/Jahr | `source/game/src/c.tsx:96` |
| `PERK-hund` | CH-marta | 🐕 Wachhund geschenkt | einmalig: Wachhund gratis (Schutz vor Olivendieben) | 45 | einmalig | `source/game/src/c.tsx:97` |
| `PERK-antrag` | CH-ragio | 🧾 Förderantrag Consorzio | 1×/Jahr: 800–1.500 € Agrarförderung | 50 | 1×/Jahr | `source/game/src/c.tsx:98` |
<!-- END GENERATED:perks -->

## Deals

<!-- BEGIN GENERATED:deals -->
| ID | Deal (DEALN) |
|---|---|
| `DEAL-mill` | Mühlen-Deal (Rosalia) |
| `DEAL-coop` | Mahl-Gemeinschaft (Turi) |
| `DEAL-wine` | Wein-Kooperation (Giusi) |
| `DEAL-tour` | Tourismus-Deal (Pro Loco) |
| `DEAL-agri` | Agriturismo (Klaus) |
| `DEAL-export` | Export München (Klaus) |
| `DEAL-truce` | Waffenstillstand (Turi) |
| `DEAL-family` | Familien-Crew (Nonna) |
| `DEAL-us` | US-Presse (Dolores) |
| `DEAL-ciccio` | Ciccios Crew |
| `DEAL-ningbo` | Direktimport (Wang) |
<!-- END GENERATED:deals -->

## Porträts

**Herkunft:** Generiert am 02.11.2026 (Europe/Berlin) mit dem Bildwerkzeug der Arbeitsumgebung. Die Indizes 0–8 stammen aus Sitzung v0.4, die Indizes 9–12 aus Sitzung v0.5, die Indizes 13–22 (Ladenbesitzer, FB-40) aus Sitzung v0.9.0 am 03.11.2026 – deren Prompts sind sinngemäß festgehalten (unten und in `docs/prompts/generate_image_calls.jsonl`).

**Stil (alle Porträts):** illustrierter Comic-/Graphic-Novel-Look mit kräftigen Konturen. Hochformat 864×1152 px, Brustbild. Hintergrund ist ein violett-orange glühender Sonnenuntergang über den Dächern und Hügeln von Sambuca.

**Prompt (Porträts 0–12):** verloren – nachträglich beschrieben (rekonstruiert). **Porträts 13–22:** Prompt (sinngemäß, aus der Sitzung rekonstruiert) = Präfix + Subjekt + Suffix (siehe Tabelle), Referenzbilder `5-salvo.jpg` und `9-carmela.jpg`, Seitenverhältnis 3:4.

Präfix: `Character portrait 3:4, head and shoulders, in the exact art style of the reference portraits: bold GTA loading-screen comic illustration, thick black ink outlines, cel shading, saturated magenta-orange-purple sunset sky behind, Sicilian hill town silhouette (or countryside hills). Subject:`  
Suffix: `Fictional person. No text.`

**Dateien:**
- Master: `source/portraits/<i>-<id>.jpg`
- Sprite: `source/portraits/port_sprite.webp` (2208×128 = 23 Zellen, sha256 `f19ebf06d1346440bda814d48bd03a2f56177864a2ba1c09ad3812bf23edca5d`)
- Neubau des Sprites: `python3 source/tools/make_portrait_sprite.py`. Das Ergebnis ist visuell gleich, aber nicht byte-identisch (→ OI-012).

| i | Figur | Datei | sha256 | Beschreibung (rekonstruiert) |
|---|---|---|---|---|
| 0 | CH-sindaco | 0-sindaco.jpg | `8f3e6f5118b7ea400ee7d42d3ce46bdd78e0667ddb5ce7c8663846c03915282a` | Mann um 60, silbergraues Haar, dicker Schnurrbart, Zigarre. Dunkelblauer Anzug mit grün-weiß-roter Bürgermeisterschärpe. Dahinter Hügel und Altstadt. |
| 1 | CH-padre | 1-padre.jpg | `460ab39f67baf9b64183af32b128876b972ff21fe4995abcb188719940ef3a7c` | Priester um 40, Brille, kurzer Bart, schwarzer Talar mit Kollar, Rosenkranz in der Hand. Dahinter ein barocker Kirchturm. |
| 2 | CH-rosalia | 2-rosalia.jpg | `e503a306e04c9c3596c29e04a6ff1a3294e17d6041056214bb4a0387571a47bd` | Frau um 45, dunkle Locken, verschränkte Arme, olivgrüne Schürze über dunklem Hemd. Dahinter die Pressen und Tanks einer Ölmühle. |
| 3 | CH-nonna | 3-nonna.jpg | `e08eb43cba06afca8556bfd08eb2829dd24bdb6cf13f77e7d777394355cb98b7` | Alte Frau mit grauem Haar unter schwarzem Kopftuch, Schwarz gekleidet, lächelt. Hält ein Tablett mit Minne di Virgini. Gasse mit Laterne. |
| 4 | CH-giusi | 4-giusi.jpg | `24bd55cdaa0a485b0b610113bd9dad8ee370cfe09611dab7ee005f00b0d81810` | Frau um 35, schwarze Locken, offene weiße Bluse, hebt ein Glas Rotwein. Dahinter Weinberge. |
| 5 | CH-salvo | 5-salvo.jpg | `2f4165b44d3894e6cc93f4538c0d3ee62907d6bbb56be5277cad5a973b5ef496` | Mann um 40, Glatze, schwarzer Vollbart, zwinkert. Weißes Hemd, Espressotasse. Dahinter eine Bar-Markise und eine Palme. |
| 6 | CH-chiara | 6-chiara.jpg | `8218a26101a7e317e5fc6d49d842c0a8ca4e6fa56daf171e7852af7a394da0e4` | Junge Frau um 30, dunkler Bob, lacht, lila Bluse, Ausweis am Band, Smartphone in der Hand. Dahinter ein Steinbogen. |
| 7 | CH-klaus | 7-klaus.jpg | `572a780d90fe03c098e891de28219fe2a3288cbfc594cbfa4c60bdc344220e64` | Mann um 55, Strohhut, Sonnenbrille, breites Grinsen, Hawaiihemd mit Blumenmuster, Tablet unter dem Arm. Dahinter ein Garten. |
| 8 | CH-turi | 8-turi.jpg | `6281e700e3d26778f54b58ec4d0ad9eb70c236eaa3f48b173c799f9f8bee8685` | Mann um 50, Schiebermütze, Schnauzer, finsterer Blick, dunkle Lederjacke. Dahinter ein altes Auto. |
| 9 | CH-carmela | 9-carmela.jpg | `0d0ad2145d6da872f2207f2f159d8bd980a8266840c7cdc949c6f261621f84f2` | Rundliche Frau um 65, graue Locken, winkt, geblümte Schürze, Korb mit Zitronen. |
| 10 | CH-dolores | 10-dolores.jpg | `d668f7b648773f88de4d9503bb1992704fc99577365343d98ad7e7a63d99ee17` | Blonde Frau um 55, Sonnenbrille im Haar, Perlenkette, weißer Blazer, Glas Prosecco. |
| 11 | CH-wang | 11-wang.jpg | `69da178ef1db9d7fdfba017a608a34cd7b81816fd8457b9d7e3ae9a27e6e05ff` | Mann um 45, Brille, kurzes schwarzes Haar, freundlich. Graue Arbeitsweste über blauem Hemd, Spaten in der Hand. |
| 12 | CH-ciccio | 12-ciccio.jpg | `7e9da14f5c9e918578d5ffe1f2c8bfd0587eae52d44e5eb5e56ffacf39f63ccf` | Hagerer Hirte um 60, Schiebermütze, grauer Schnauzer, Weste, Hirtenstab über der Schulter. |
| 13 | CH-lin | 13-lin.jpg | `e0cdf721abe279b048c382eb108185de34ff762bf8bcd57958fe635e0edbd25a` | Prompt-Subjekt: Chinese-Italian woman about 40, black bob haircut, red cardigan, holding a small oil bottle, shelves of household goods behind her. |
| 14 | CH-nunzia | 14-nunzia.jpg | `cd396bd2515ba61333113e8f96a4cb874c5a6c1d29adafce3e82c8844a92fb48` | Prompt-Subjekt: plump baker woman about 50, flour on her cheeks, headscarf, holding a tray of focaccia and cuccidati, bread oven behind. |
| 15 | CH-gaspare | 15-gaspare.jpg | `9f3213471e42a745b0674a162a6ed27d65ca9134715df519a4c9479b6f561ed5` | Prompt-Subjekt: barber about 60, silver slicked-back hair, moustache, holding a straight razor and comb, barber pole behind. |
| 16 | CH-pippo | 16-pippo.jpg | `792a3d4299dc20ecf8bcebe1ff2d251620480ce31996020fd9cddfea8f092399` | Prompt-Subjekt: tabaccaio about 55, bald, glasses pushed up on his forehead, grey cardigan, holding scratch cards, lotto sign behind. |
| 17 | CH-lobue | 17-lobue.jpg | `735cd6902797dd4c7ed5f0c52005fb19543f0666f018486bcdf659de5b25f97a` | Prompt-Subjekt: pharmacist woman about 45, hair in a bun, green glasses, white lab coat, holding an amber jar, green pharmacy cross behind. |
| 18 | CH-enzo | 18-enzo.jpg | `bf6b84ef305ee665b3a1745827bf4c71e1e4ed0da147786759ab9c1ffc2dda07` | Prompt-Subjekt: newsstand owner and local reporter about 30, curly hair, denim shirt, pencil behind his ear, holding a newspaper, kiosk behind. |
| 19 | CH-peppe | 19-peppe.jpg | `226c3902febd3882c414a029fbda2e88dbab1a4467f08d695e214e040b7fe04e` | Prompt-Subjekt: burly butcher about 50, shaved head, black beard, apron, holding a cleaver and a coil of salsiccia. |
| 20 | CH-nino | 20-nino.jpg | `f20b46f1e87d02abe7f5d2c372b1f2d0efc2d07cd7726971f71b7b4c5236494a` | Prompt-Subjekt: beekeeper about 65, veil hat, holding a honeycomb frame, bees around him, hives behind. |
| 21 | CH-marta | 21-marta.jpg | `c479ab847e92d2902d25b14f4685986f7f5f6c9358b3491aeaa893051b4c0dd4` | Prompt-Subjekt: dog shelter owner woman about 35, ponytail, green fleece vest, two shepherd dogs at her side, kennel behind. |
| 22 | CH-ragio | 22-ragioniere.jpg | `f1fb343bcae7cce453d3fc81b7ed1c7c08afa5022f4a19cd0f65a02b091a2e04` | Prompt-Subjekt: cooperative accountant about 60, comb-over, brown suit, sleeve protectors, holding a ledger and a rubber stamp, tractor and grain sacks behind. |
