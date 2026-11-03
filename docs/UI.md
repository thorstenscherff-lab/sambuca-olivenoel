# Oberfläche (v0.7.1)

Optimiert für Telefon im Hochformat (Thorstens Vorgabe). Ein Desktop zeigt dieselbe schmale Spalte. Code: `source/game/src/f.tsx` (App, Tabs, Sheets), `src/e.tsx` (Sheets, Minispiele), `ui_old.tsx`.

## Aufbau
- **Kopfleiste:**
  - Monat/Jahr
  - Geld, Schulden
  - AP (ECO-AP)
  - ★, Öl/Oliven
- **Tabs:**
  - `buero`: Büro-Szene LOC-buero; die Ausbaustufe hängt von ECO-offStage ab
  - `stadt`: Karte Sambuca
  - `umland`: Karte Umland
  - `tal`: Karte Belice-Tal
- **Monat beenden:** Der Button ist gesperrt, solange Ereignisse offen sind (`pendingEv`). Er öffnet `UI-end`.
- **Fest-Splash:** erscheint in Festmonaten (CALENDAR.md).
- **Sheets:** Bottom-Sheets, die von unten hochfahren. Es ist immer höchstens eins offen.

## Sheets

<!-- BEGIN GENERATED:ui -->
| Sheet-ID |
|---|
| `UI-end` |
| `UI-kal` |
| `UI-log` |
| `UI-mg` |
| `UI-minor` |
| `UI-missions` |
| `UI-person` |
| `UI-pin` |
| `UI-regal` |
| `UI-report` |
| `UI-shop` |
| `UI-sindaco` |
| `UI-spot` |
| `UI-talk` |
| `UI-tel` |
| `UI-year` |
<!-- END GENERATED:ui -->

| Sheet | Inhalt / geöffnet von |
|---|---|
| UI-end | Monatsabschluss-Vorschau, Bestätigung |
| UI-kal | Kalender (HOT-buero-kal) |
| UI-log | Tagebuch (`g.log`) |
| UI-mg | Minispiel-Container (MG-harvest, MG-press, MG-haggle, MG-rescue-sturm/-flut/-fliege) |
| UI-minor | Kleiner Ort mit Begegnungen (MIN-*) |
| UI-missions | Monatsziele (GOAL-*) |
| UI-person | Figur: ♥, Perks, Gespräch MG-talk, Geschenk |
| UI-pin | Hain/Pin ohne eigene Szene: Pflege, Ernte, Kauf |
| UI-regal | Lager, Ölpreis-Verlauf (HOT-buero-regal, HOT-bar-zeitung, HOT-hain-regal) |
| UI-report | Monatsbericht |
| UI-shop | Laden (SHOP-*) |
| UI-sindaco | Audienz beim Sindaco (★ ≥ 50) |
| UI-talk | Gesprächs-Minispiel MG-talk |
| UI-tel | Telefon: Anrufe bei bekannten Figuren (HOT-buero-tel) |
| UI-year | Jahresbericht, Rivalen, Bestenliste |

## Sprache (v0.9.0)
Beim ersten Start erscheint vor dem Intro die **Sprachwahl** (🇩🇪 Deutsch · 🇬🇧 English · 🇮🇹 Italiano, Buttons `data-lang`). Die Wahl gilt für den ganzen Spielstand (`G.lang`, `sambuca5_lang`); danach erscheint keine Auswahl mehr. Übersetzt wird zur Laufzeit per DOM-Observer – Details in I18N.md.

## v0.8
- Schrift: Nunito 600–900 (`fonts/nunito-latin-600-900.woff2`, OFL). `.gta` hat Gewicht 900 und weichen Schatten, keine Outline.
- Farben: `C.pinkT` #ffa8d0 für Text auf Dunkel, `C.bad` #ff8f8f.
- Karte: bei Zoom < 1.6 glitzernde Icon-Pins (`sbGlint`), ab 1.6 beschriftete Pins.
- Spot-Sheet (`k:"spot"`) zeigt Beschreibung, Ergebnis und „wieder ab <Monat>“.
- Intro: Startbild `start`, Untertitel „v0.8“, Mogul-Ziel.


## v0.9.0
- **„🗺️ Karte“-Button in Szenen entfernt** (FB-42/OI-052). Szenen verlässt man über die Tabs **Stadt / Umland** (bzw. Town/Countryside, Paese/Campagna) in der unteren Leiste; ein Tab-Tipp schließt die Szene und zeigt die jeweilige Karte. Es gab keine Tastaturkürzel für „Karte“, daher entfällt nichts weiter. QA: kein Element mit Text „Karte“ in Szenen, Szenenwechsel per Tab funktioniert (`source/qa/qa9.js`).
- **Sprachwahl-Screen** vor dem Intro (siehe „Sprache“).
- **Personen-Sheet:** nicht erreichbare Figuren zeigen „Nicht interessiert an dir. Nötig: …“ (Monat, ★, Vitamin B); wer diesen Monat schon jemanden kennengelernt hat, sieht „Du hast diesen Monat schon jemanden kennengelernt …“ und das Kennenlernen bleibt gesperrt (Log: „🕰️ Eine neue Bekanntschaft pro Monat reicht – die Leute hier brauchen Zeit.“).
- **Ladenbesitzer** erscheinen an ihren Nebenorten (Begegnungs-Sheet mit Porträt) und haben eigene Perks.
- **Laden-Icons** liegen auf allen Zoomstufen pixelgenau auf den gezeichneten Läden (MAPS.md, „Pin-Verifikation v0.9.0“).
