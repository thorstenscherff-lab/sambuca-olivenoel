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

## Sprache
Nur Deutsch, alle Texte stehen fest im Code → OI-005.
