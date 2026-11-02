# MAPS – Stadtkarte und Umlandkarte (v0.7.1)

## Was Thorsten zu v0.7 gesagt hat (02.11.2026)
> „Beide Karten sind nicht gut. Die Positionen sind nicht exakt und die Micro macro Karte fand ich besser. Wir haben sowohl die Stadtkarte als auch das Umland bereits in Hochauflösung. Das muss besser werden.“

**Folgerung für v0.7.1:** Die Karten im Spiel sind jetzt pixelgenaue Ausschnitte aus dem hochaufgelösten Micro-Macro-Poster. Sie werden nicht neu gezeichnet und nicht skaliert. Die Pins sind aus echten Koordinaten berechnet, mit derselben Projektion, mit der das Poster gerendert wurde.

## Quelle: Micro-Macro-Poster v12

| | |
|---|---|
| Datei (Build-Box) | `/workspace/sambuca-karte/v12/sambuca_karte_120x60cm_micromacro_300dpi_v12.png` |
| Größe | 14173 × 7086 px = 120 × 60 cm bei 300 dpi, 37 MB |
| SHA-256 | `a22a2af470b43a07d9e413156f475a469afb0b93d59f15d9d93b9ba31c330804` |
| Im Repo? | **Nein** (zu groß). Es lässt sich aber aus `source/map-poster/` neu erzeugen. |
| Daten | OpenStreetMap (© OpenStreetMap-Mitwirkende, ODbL), Abruf über Overpass am 27.10.2026 (Stadt 15:09, Region-Erweiterung 17:37 Europe/Berlin); Snapshots in `source/map-poster/osm/*.json`. Höhen: SRTM-1 (`dem/N37E012.hgt`, `N37E013.hgt`, 50 MB, nicht im Repo; frei bei USGS/NASA). |
| POIs | `source/map-poster/pois.py`, Recherche in `poi-research.md` |

### Poster neu erzeugen
```bash
cd source/map-poster
# OSM neu holen (optional, sonst die Snapshots verwenden):  ./fetch.sh q_town.txt town.json  usw.
cp osm/*.json . && mkdir -p v4 && mv region_ext.json v4/
# dem/N37E012.hgt und dem/N37E013.hgt (SRTM 1 Bogensekunde) bereitlegen
python3 restyle_v12.py mm 300 sambuca_karte_120x60cm_micromacro_300dpi_v12.png
```
`restyle_v12.py` führt `render_v12.py` unverändert aus (gleiche Geometrie) und färbt erst vor dem Speichern in den Micro-Macro-Stil um: Schwarz-Weiß mit gedämpften Akzenten, Schriften Archivo Black und Roboto Condensed aus `/usr/share/fonts/truetype/sand-box/google/`.
**Achtung:** Die Argumente (`mm 300 <out>`) stammen aus dem Skriptkopf (`STYLE, DPI, OUT = sys.argv[1:4]`). Die exakte Kommandozeile von v12 ist nicht protokolliert. Ob das Ergebnis byte-identisch ist, wurde nicht geprüft (Font-Rendering und Bibliotheksversionen); für das Spiel zählt der Hash oben.
Bibliotheken (venv): matplotlib 3.11.2, numpy 2.5.4, scipy 1.18.1, shapely 2.2.0, pyproj 3.8.0, Pillow 13.0.0.

## Ausschnitte im Spiel

`python3 source/tools/crop_maps.py <poster.png> maps` erzeugt aus dem Poster die beiden Karten. Das Ergebnis wurde geprüft: **byte-identisch** zu den Live-Dateien.

| Datei | Crop-Box im Poster (x0, y0, x1, y1) | Größe | Format | SHA-256 |
|---|---|---|---|---|
| `maps/stadt_v071.webp` | (4606, 1583, 9567, 5480) = Stadt-Inset | 4961 × 3897 | WebP q80, method 6 | `ecc69986…` |
| `maps/umland_v071.webp` | (0, 800, 4600, 3800) = Westteil der Region | 4600 × 3000 | WebP q80, method 6 | `1e1e3a55…` |

Der Pixelmaßstab bleibt 1:1, es wird weder skaliert noch nachgeschärft. In `f.tsx` stehen die Seitenverhältnisse als `MAPAR` (Stadt 4961/3897, Umland 4600/3000).

**Darstellung im Spiel (f.tsx):** Die Karten-Sheets sind scrollbar. Zoom geht von 1 bis 4 in Schritten von ×1,6, über Knöpfe (`data-zoom="in"/"out"`) oder Pinch. Startposition beim Öffnen: Stadt bei 75 % horizontal gescrollt (Corso/Zentrum), Umland bei 70 %. Die Pins sind absolut in % positioniert und skalieren mit dem Zoom mit.

## Projektion (identisch mit render_v12.py)
Umgesetzt in `source/tools/pins_v071.py`. Die Werte reproduzieren **alle** Pins in `PS`/`PU` (f.tsx) exakt.

- Equirektangulär lokal: Ursprung `LAT0 = 37.648`, `LON0 = 13.111`; km pro Grad: `KX = 111.32·cos(LAT0)`, `KY = 110.95`.
- Poster-Raster: `PPC = 7086/120` px/cm bei 150 dpi; Faktor auf 300 dpi `P2 = (14173/120)/PPC`.
- **Stadt-Inset:** Rechteck `INS = (39, 13.6, 81, 46.6)` cm, Maßstab `SI = 25.3` cm/km, Mittelpunkt 37.6489 / 13.10892.
- **Region:** Maßstab `S = 3.3` cm/km, Ursprung `SX = 39 − 1.4·S`, `SY = 36` cm. y wird von unten gemessen, deshalb `60 − y`.
- Prozent = (Pixel − Crop-Ursprung) / Crop-Größe × 100.

Kleinere Orte (MINOR: Läden, Bars, Händler), Hain-Angebote und Rivalen-Haine lagen in v0.7 noch als Prozentwerte auf der alten Karte. Sie wurden linear umgerechnet (`cvXY` in f.tsx):
- Stadt: `x' = x·0.75267 + 24.7128`, `y' = y·0.53888 + 15.8327`
- Umland: `x' = x·0.9913`, `y' = y·0.85533 + 6.6667`

Die Koeffizienten stammen aus dem Abgleich der alten 150-dpi-Projektion (`tools/proj_v2_150dpi.py`) mit der neuen. Diese Punkte sind nur so genau wie in v0.7 (Nebenorte, keine Hauptpins).

## Pins: Koordinate, Position, Prüfung, Sicherheit

### Stadtkarte (PS)
| Pin | Ort im Spiel | Koordinate (WGS84) | Position x/y % | Quelle / Prüfung | Sicherheit |
|---|---|---|---|---|---|
| casa | Büro/Zuhause | 37.65020, 13.11262 | 69.64 / 38.94 | OSM-Weg w238048681 (Mitte Via Delfino) | hoch (Straße exakt, Hausnummer fiktiv) |
| banca | Banca | 37.647281, 13.110587 | 58.85 / 63.77 | OSM-ATM n6939549811, Corso Umberto I 111 | hoch |
| muni | Municipio | 37.64892, 13.11297 | 71.50 / 49.83 | OSM w238427483; Overlay-Prüfung auf dem Poster | hoch |
| palazzo | Teatro L'Idea / Palazzo | 37.645196, 13.108519 | 47.87 / 81.51 | OSM w1076653697 (Teatro L'Idea) | hoch für das Teatro; **Palazzo Panitteri liegt woanders** (Szene vereint beide) |
| caffe | Bar del Corso | 37.64707, 13.11071 | 59.50 / 65.57 | restaurantguru-Koordinate + Adresse Corso Umberto I 138 | **unsicher, ca. 10–20 m** |
| chiesa | Chiesa Madre | 37.65050, 13.11514 | 83.02 / 36.39 | OSM w238096302; Overlay-Prüfung | hoch |
| belv | Belvedere | 37.65083, 13.11637 | 89.55 / 33.58 | OSM n9872620649 | hoch |

### Umlandkarte (PU)
| Pin | Ort | Koordinate | Position x/y % | Quelle / Prüfung | Sicherheit |
|---|---|---|---|---|---|
| torre | Torre di Pandolfina | 37.68056, 13.08583 | 69.48 / 20.89 | Koordinate der Contrada aus it.wikipedia | **ungefähr (Contrada, nicht der Turm selbst)** |
| hain | eigener Hain „Parzelle Pandolfina“ | 37.679965, 13.094593 | 76.02 / 21.74 | Koordinate von Thorsten | hoch |
| frantoio | Frantoio | 37.658, 13.103 | 82.30 / 53.41 | OSM w734431826, gerundet | mittel bis hoch (±50 m) |
| feudo | Feudo Arancio | 37.6528, 13.0170 | 18.07 / 60.90 | OSM r17475838, gerundet | mittel bis hoch |
| lago | Lago Arancio | 37.6364, 13.0661 | 54.74 / 84.54 | Seemitte (pois.py LANDMARKS) | **symbolisch (Seemitte)** |
| sambuca | Stadt (zurück) | 37.6477395, 13.1110313 | 88.30 / 68.20 | OSM n67253952 (place=town) | hoch |

Die Overlay-Prüfbilder (Pin über OSM-Geometrie auf dem Poster) wurden nur auf der Build-Box erzeugt: `/tmp/ov_chiesa.png`, `/tmp/ov_corso.png`.

### Offene Punkte
- Bar del Corso: Die genaue Hausfront ist nicht in OSM erfasst; vor Ort prüfen.
- Torre di Pandolfina: Für den Turm selbst gibt es keine verifizierte Koordinate.
- Bei Zoom 1 überlappen sich das Hain-Icon und die Hain-Angebote leicht (Umland, Bereich Torre).
- Teatro und Palazzo teilen sich einen Pin.
- Das 37-MB-Poster liegt nicht im Repo, nur Pfad und Hash. Wer reproduzieren will, braucht die Build-Box oder einen Neu-Render (siehe oben).

## QA-Screenshots der Karten (Build-Box)
`/workspace/sambuca-game/v07/qa/maps/`: `01_stadt_z1`, `02_stadt_z1.6_corso`, `03_stadt_z2.6_bar_banca`, `04_stadt_z2.6_casa_municipio`, `05_stadt_z2.6_chiesa_belvedere`, `06_stadt_z2.6_teatro`, `07_stadt_z4_corso_detail`, `10_umland_z1`, `11_umland_z1_west_feudo`, `12_umland_z1.6_torre_hain`, `13_umland_z2.6_torre_hain`, `14_umland_z2.6_frantoio_sambuca`, `15_umland_z2.6_lago`, `16_umland_z2.6_feudo` (jeweils `.png`, 390×844 bei DPR 3).
Diese Screenshots stammen aus dem Spiel. Sie sind nicht im Repo, weil sie nur die Karten zeigen, die ohnehin unter `maps/` liegen.

## Ältere Kartenstände
- v0.2–v0.6: gezeichnete Spielkarten (`designs/v2/maps.py`), Pins über `proj.py` (150 dpi) – ungenau, deshalb in v0.7.1 ersetzt.
- v0.7: dieselben Karten, nur nachgeschärft. Thorsten fand sie nicht gut (siehe oben).
