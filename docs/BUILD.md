# BUILD – von der Quelle bis zum Deploy

Stand: v0.7.1, 02.11.2026 (Europe/Berlin). Repo: `thorstenscherff-lab/sambuca-olivenoel`, Branch `main`.
Live: https://thorstenscherff-lab.github.io/sambuca-olivenoel/

## Kurzfassung

```bash
git clone https://github.com/thorstenscherff-lab/sambuca-olivenoel.git
cd sambuca-olivenoel
bash source/build.sh                 # npm ci + tsc + esbuild  ->  ./app.js
git add -A && git commit -m "vX.Y" && git push   # GitHub Pages deployt main/ (Root) automatisch
```

**Reproduzierbarkeit wurde geprüft:** Ein frischer Build aus diesem Repo (`source/build.sh` in einer leeren Kopie mit neuem `npm ci`) ergibt ein **byte-identisches** `app.js` (SHA-256 `f7224039b9d67e1e9d42004e803498e26325ce55169bdc649f7316741d7711d2`). Auch `source/tools/build_imgs.py` erzeugt `imgs.tsx` byte-identisch. `source/tools/crop_maps.py` erzeugt beide Karten-WebPs byte-identisch.

## Tool-Versionen (gemessen am 02.11.2026 auf der Build-Box)

| Tool | Version |
|---|---|
| Node.js | v20.19.2 |
| npm | 11.21.1 |
| esbuild | 0.28.2 (`source/harness/package-lock.json`) |
| TypeScript (tsc) | 7.0.2 |
| React / react-dom | 18.3.x (Lockfile) |
| @types/react | 18.3.31 |
| puppeteer-core (QA) | 24.43.1 |
| Google Chrome (QA) | 156.0.8078.47 |
| Python | 3.13.5 |
| Pillow | 13.0.0 |
| Poster-Pipeline (venv) | matplotlib 3.11.2, numpy 2.5.4, scipy 1.18.1, shapely 2.2.0, pyproj 3.8.0 |

Hinweis: npm 11 meldet bei `npm ci` „install-scripts“-Warnungen für esbuild. Der Build lief trotzdem durch und war byte-identisch.

## Aufbau des Repos

```
index.html                 Einstieg (lädt app.js), Titel „… v0.7.1“
manifest.webmanifest, icon.webp
app.js                     gebündeltes Spiel (Build-Artefakt, wird committet, weil Pages es direkt ausliefert)
maps/stadt_v071.webp       Stadtkarte 4961×3897 (siehe MAPS.md)
maps/umland_v071.webp      Umlandkarte 4600×3000
source/
  build.sh                 Build-Skript (siehe unten)
  game/imports.tsx         import-Zeile für "grok/canvas"
  game/imgs.tsx            Bilder als Base64-WebP (Szenen, Porträts, Festa) + Pfade der Karten
  game/src/a.tsx           Typen, Konstanten, Figuren (CHARS), Preise, Hilfsfunktionen
  game/src/c.tsx           Ereignisse (EVX), Feste (FEST), Monatsziele (GOALS), Perks, Nebenorte (MINOR), Laden (SHOP)
  game/evs.tsx             großer Ereigniskatalog (EVS)
  game/src/d.tsx           Spiellogik: newGame, act, endMonth, score, Highscore
  game/ui_old.tsx          Minispiele und Oberflächen-Bausteine aus v0.4
  game/src/e.tsx           Szenen (SCN), Büro-Stufen (offStage), Minispiele Talk/Rescue
  game/src/f.tsx           App, Karten (Pins PS/PU, Zoom), Sheets
  harness/                 main.jsx, shim/grok-canvas.js, types/, tsconfig.json, package(-lock).json
  scenes/01…16_*.jpg       generierte Szenenbilder in voller Auflösung (Master, siehe ASSETS.md)
  tools/build_imgs.py      Szenen-JPG -> imgs.tsx (Resize 450×800, WebP q70/q72)
  tools/crop_maps.py       Poster v12 (300 dpi) -> maps/*.webp (Crop 1:1, kein Skalieren)
  tools/pins_v071.py       Koordinaten -> Pin-Prozentwerte (identisch zu PS/PU in f.tsx)
  tools/proj_v2_150dpi.py  ältere Projektion (150-dpi-Crops, v0.2–v0.6), zur Nachvollziehbarkeit
  map-poster/              Skripte + OSM-Snapshots, aus denen das Micro-Macro-Poster v12 entstand
  qa/qamap.js, qa7.js, play7.js   Headless-QA (siehe QA.md)
docs/                      diese Dokumentation; docs/prompts/ = Original-Aufrufe der Bildgenerierung
```

## Schritt für Schritt

### 1. (Optional) Bilder neu einbetten
Nur nötig, wenn ein Szenenbild in `source/scenes/` ersetzt wurde:
```bash
python3 source/tools/build_imgs.py       # schreibt source/game/imgs.tsx
```
`build_imgs.py` ersetzt nur `IMG_F` und `IMG_SC`. `IMG_B` (altes Büro) und `IMG_P` (Figurenporträts, seit v0.5) bleiben unverändert. Die Master der Porträts liegen nur auf der Build-Box (`/workspace/sambuca-game/v05/img`, `v07/build/img`).

### 2. (Optional) Karten neu schneiden
Nur nötig, wenn sich das Poster ändert:
```bash
python3 source/tools/crop_maps.py /pfad/sambuca_karte_120x60cm_micromacro_300dpi_v12.png maps
```
Das Original-Poster liegt nicht im Repo (37 MB). Pfad auf der Build-Box: `/workspace/sambuca-karte/v12/sambuca_karte_120x60cm_micromacro_300dpi_v12.png`, SHA-256 `a22a2af470b43a07d9e413156f475a469afb0b93d59f15d9d93b9ba31c330804`. Wie es entsteht, steht in MAPS.md.

### 3. Build
```bash
bash source/build.sh
```
Das Skript macht Folgendes:
1. `npm ci` in `source/harness` (nur, wenn `node_modules` fehlt).
2. Es verkettet die Quellen in **genau dieser Reihenfolge** zu `source/harness/game.tsx`: `imports.tsx, imgs.tsx, src/a.tsx, src/c.tsx, evs.tsx, src/d.tsx, ui_old.tsx, src/e.tsx, src/f.tsx`. Das Spiel ist ursprünglich eine Ein-Datei-Canvas-App, deshalb gibt es keine Module.
3. `npx tsc --noEmit -p .` (strict) muss ohne Ausgabe durchlaufen.
4. Dann folgt der Bundle-Schritt:
   `npx esbuild main.jsx --bundle --minify --alias:grok/canvas=./shim/grok-canvas.js --jsx=automatic --define:process.env.NODE_ENV='"production"' --outfile=../../app.js`
   `grok/canvas` wird dabei auf einen kleinen Shim gemappt, der React-Hooks re-exportiert.

### 4. Version hochzählen
Die Versionsnummer steht an vier Stellen (Stand v0.9.1): `index.html` (`<title>`), `manifest.webmanifest`, in `source/game/src/f.tsx` das Label „DAS ÖL DER MADONNA · v0.9.1“ und die Konstante `GAME_V`. Prüfen mit:
```bash
grep -rn "v0\.7\.1" index.html manifest.webmanifest source/game/src | head
```

### 5. Deploy
```bash
git -c user.name="thorstenscherff-lab" -c user.email="thorstenscherff-lab@users.noreply.github.com" commit -am "v0.x: …"
git push            # gh CLI ist als thorstenscherff-lab angemeldet
# warten, bis Pages ausgeliefert hat:
for i in $(seq 1 30); do curl -s "https://thorstenscherff-lab.github.io/sambuca-olivenoel/?nc=$RANDOM" | grep -o "v0\.7\.1" && break; sleep 10; done
curl -s -o /dev/null -w "%{http_code}\n" https://thorstenscherff-lab.github.io/sambuca-olivenoel/maps/stadt_v071.webp   # 200
```
Danach folgt die QA laut QA.md.

## Historische Build-Verzeichnisse (nur Build-Box)
v0.1–v0.4 waren eine Canvas-App (`/workspace/sambuca-game/v01…v04/game.canvas.tsx`, jeweils mit eigenem `build.sh`). Seit v0.5 liegt das Spiel in diesem GitHub-Pages-Repo. Arbeitsverzeichnis für v0.7/v0.7.1: `/workspace/sambuca-game/v07/build` mit Test-Harness `/workspace/sbtest`. Der Inhalt von `source/` ist eine 1:1-Kopie davon.

## v0.8
- `fonts/nunito-latin-600-900.woff2` wird in `index.html` per `@font-face` geladen und vorgeladen.
- Neue SC-Keys in `tools/build_imgs.py`: start, torre, hotel, santa, lido, santuario, vassalli, giorgio. Danach `python3 source/tools/build_imgs.py && bash source/build.sh`.
- Reproduzierbarkeit: Zwei Builds hintereinander ergeben dasselbe sha256 für `app.js`.


## v0.9.0
- `build.sh` verkettet jetzt: imports, **i18n_dict**, **i18n**, imgs, a, c, evs, d, ui_old, e, f → tsc → esbuild → `app.js`.
- Übersetzungen neu erzeugen: siehe I18N.md (Extractor mit `TS5=/tmp/ts5/node_modules/typescript`, Argos, `i18n_build.py`).
- Doku-Generatoren: `python3 source/tools/export_characters.py` (jetzt mit Gating-Zeile je Figur) und `python3 source/tools/export_inventory.py --check` (muss Exit 0 liefern).
- QA-Skripte: `source/qa/logic9.mjs` (Logik, bündelt game.tsx nach `/tmp/logic9.mjs`), `source/qa/qa9.js` (Browser, Server `python3 -m http.server 8099` im Repo-Root oder Live-URL), `source/qa/pincrops9.js` (Pin-Crops Zoom 4).

## v0.9.1
- Keine Änderung an `build.sh`. Nach jedem neuen deutschen Text: Extractor → `i18n_manual.json` ergänzen → `i18n_build.py` → Build → `i18nstatic.js` und `i18ncheck.js` müssen 0 melden (QA.md).
