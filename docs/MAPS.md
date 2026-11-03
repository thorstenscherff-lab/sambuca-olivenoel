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

## v0.8
- Nebenorte haben echte Poster-Positionen (`px`): panif, ferr, tabac, barb, farm, edic, mac, casal, dogs. Der Imker liegt bei [84.5, 62] (ungefähr) und nicht mehr auf dem Tierheim.
- Neue Pins: Santuario, Hotel und Lido (Wegweiser am Rand, weil der Lido außerhalb der Karte liegt). Angebote im Besitz von NPCs zeigen 🔒. Neben „Dein Hain“ gibt es keinen zweiten Hain-Pin mehr.

## Icon-Prüftabelle v0.8.1 (FB-29/FB-30 · OI-036/OI-037)

Gemessen live (https://thorstenscherff-lab.github.io/sambuca-olivenoel/, 390×844, Skript `/workspace/sbtest/icons.js`, Rohdaten `/workspace/sambuca-game/v08/qa/icons/layout.json`). Koordinate = `data-ax/ay` in % der Kartenfläche; Anker = echter Punkt in px innerhalb der skalierten Karte; Icon = Mittelpunkt des Icons in px; Abweichung = Abstand Icon↔Anker in px (> 8 px ⇒ gestrichelte Führungslinie). Überlappungen (Icon- und Label-Rechtecke): **0 auf allen 8 Stufen**. Screenshots je Pin: `qa/icons/pins/<s|u>_<id>.png`, je Zoom: `qa/icons/<s|u>_zoom<z>.png`.

### Stadt · Zoom 1 (Karte 914×718 px, Überlappungen: 0)

| Pin | Koordinate % | Anker px | Icon px | Abweichung px | Führungslinie | Personen | Screenshot |
|---|---|---|---|---|---|---|---|
| minor:casal | 56.4 / 31.4 | 516 / 225 | 516 / 225 | 0.0 | – | 0 | – |
| minor:ferr | 38.8 / 49.1 | 355 / 352 | 355 / 352 | 0.0 | – | 0 | – |
| minor:panif | 75.3 / 21.3 | 688 / 153 | 688 / 153 | 0.0 | – | 0 | – |
| minor:tabac | 61.8 / 62.8 | 565 / 451 | 581 / 467 | 23.3 | ja | 0 | – |
| minor:barb | 52.9 / 71.4 | 484 / 513 | 484 / 513 | 0.0 | – | 0 | – |
| minor:farm | 66.2 / 55.3 | 605 / 397 | 605 / 383 | 13.7 | ja | 0 | – |
| minor:edic | 38.9 / 56.3 | 356 / 405 | 356 / 405 | 0.0 | – | 0 | – |
| minor:mac | 42.5 / 88.2 | 389 / 633 | 389 / 633 | 0.0 | – | 0 | – |
| casa | 69.6 / 38.9 | 637 / 280 | 636 / 280 | 0.0 | – | 0 | pins/s_casa.png |
| banca | 58.9 / 63.8 | 538 / 458 | 532 / 439 | 19.4 | ja | 2 👤 | pins/s_banca.png |
| muni | 71.5 / 49.8 | 654 / 358 | 654 / 358 | 0.0 | – | 1 👤 | pins/s_muni.png |
| palazzo | 47.9 / 81.5 | 438 / 585 | 438 / 585 | 0.0 | – | 1 👤 | pins/s_palazzo.png |
| caffe | 59.5 / 65.6 | 544 / 471 | 539 / 489 | 19.0 | ja | 3 👤 | pins/s_caffe.png |
| chiesa | 83.0 / 36.4 | 759 / 261 | 759 / 261 | 0.0 | – | 3 👤 | pins/s_chiesa.png |
| belv | 89.5 / 33.6 | 818 / 241 | 818 / 241 | 0.0 | – | 0 | pins/s_belv.png |
| santuario | 65.6 / 59.4 | 599 / 427 | 599 / 425 | 1.6 | – | 3 👤 | pins/s_santuario.png |

### Stadt · Zoom 1.6 (Karte 1462×1149 px, Überlappungen: 0)

| Pin | Koordinate % | Anker px | Icon px | Abweichung px | Führungslinie | Personen | Screenshot |
|---|---|---|---|---|---|---|---|
| minor:casal | 56.4 / 31.4 | 825 / 361 | 825 / 361 | 0.0 | – | 0 | – |
| minor:ferr | 38.8 / 49.1 | 567 / 564 | 567 / 564 | 0.0 | – | 0 | – |
| minor:panif | 75.3 / 21.3 | 1100 / 245 | 1100 / 245 | 0.0 | – | 0 | – |
| minor:tabac | 61.8 / 62.8 | 903 / 722 | 909 / 714 | 9.7 | ja | 0 | – |
| minor:barb | 52.9 / 71.4 | 774 / 821 | 774 / 820 | 0.0 | – | 0 | – |
| minor:farm | 66.2 / 55.3 | 968 / 635 | 968 / 635 | 0.0 | – | 0 | – |
| minor:edic | 38.9 / 56.3 | 569 / 647 | 569 / 647 | 0.0 | – | 0 | – |
| minor:mac | 42.5 / 88.2 | 621 / 1014 | 621 / 1014 | 0.0 | – | 0 | – |
| casa | 69.6 / 38.9 | 1018 / 447 | 1018 / 447 | 0.0 | – | 0 | pins/s_casa.png |
| banca | 58.9 / 63.8 | 860 / 733 | 850 / 708 | 26.4 | ja | 2 👤 | pins/s_banca.png |
| muni | 71.5 / 49.8 | 1045 / 573 | 1045 / 573 | 0.0 | – | 1 👤 | pins/s_muni.png |
| palazzo | 47.9 / 81.5 | 700 / 937 | 700 / 937 | 0.0 | – | 1 👤 | pins/s_palazzo.png |
| caffe | 59.5 / 65.6 | 870 / 753 | 870 / 782 | 28.9 | ja | 3 👤 | pins/s_caffe.png |
| chiesa | 83.0 / 36.4 | 1214 / 418 | 1214 / 418 | 0.0 | – | 3 👤 | pins/s_chiesa.png |
| belv | 89.5 / 33.6 | 1309 / 386 | 1309 / 386 | 0.0 | – | 0 | pins/s_belv.png |
| santuario | 65.6 / 59.4 | 958 / 683 | 965 / 683 | 6.5 | – | 3 👤 | pins/s_santuario.png |

### Stadt · Zoom 2.56 (Karte 2340×1838 px, Überlappungen: 0)

| Pin | Koordinate % | Anker px | Icon px | Abweichung px | Führungslinie | Personen | Screenshot |
|---|---|---|---|---|---|---|---|
| minor:casal | 56.4 / 31.4 | 1320 / 577 | 1320 / 577 | 0.0 | – | 0 | – |
| minor:ferr | 38.8 / 49.1 | 908 / 902 | 908 / 902 | 0.0 | – | 0 | – |
| minor:panif | 75.3 / 21.3 | 1761 / 392 | 1761 / 392 | 0.0 | – | 0 | – |
| minor:tabac | 61.8 / 62.8 | 1446 / 1154 | 1446 / 1154 | 0.0 | – | 0 | – |
| minor:barb | 52.9 / 71.4 | 1239 / 1313 | 1239 / 1313 | 0.0 | – | 0 | – |
| minor:farm | 66.2 / 55.3 | 1549 / 1016 | 1549 / 1016 | 0.0 | – | 0 | – |
| minor:edic | 38.9 / 56.3 | 911 / 1036 | 911 / 1036 | 0.0 | – | 0 | – |
| minor:mac | 42.5 / 88.2 | 995 / 1622 | 995 / 1622 | 0.0 | – | 0 | – |
| casa | 69.6 / 38.9 | 1630 / 716 | 1630 / 716 | 0.0 | – | 0 | pins/s_casa.png |
| banca | 58.9 / 63.8 | 1377 / 1172 | 1377 / 1152 | 20.5 | ja | 2 👤 | pins/s_banca.png |
| muni | 71.5 / 49.8 | 1673 / 916 | 1673 / 916 | 0.0 | – | 1 👤 | pins/s_muni.png |
| palazzo | 47.9 / 81.5 | 1120 / 1498 | 1120 / 1498 | 0.0 | – | 1 👤 | pins/s_palazzo.png |
| caffe | 59.5 / 65.6 | 1392 / 1205 | 1392 / 1226 | 20.4 | ja | 3 👤 | pins/s_caffe.png |
| chiesa | 83.0 / 36.4 | 1943 / 669 | 1943 / 669 | 0.0 | – | 3 👤 | pins/s_chiesa.png |
| belv | 89.5 / 33.6 | 2095 / 617 | 2095 / 617 | 0.0 | – | 0 | pins/s_belv.png |
| santuario | 65.6 / 59.4 | 1534 / 1093 | 1534 / 1092 | 0.0 | – | 3 👤 | pins/s_santuario.png |

### Stadt · Zoom 4 (Karte 3656×2872 px, Überlappungen: 0)

| Pin | Koordinate % | Anker px | Icon px | Abweichung px | Führungslinie | Personen | Screenshot |
|---|---|---|---|---|---|---|---|
| minor:casal | 56.4 / 31.4 | 2063 / 901 | 2063 / 901 | 0.0 | – | 0 | – |
| minor:ferr | 38.8 / 49.1 | 1418 / 1409 | 1418 / 1409 | 0.0 | – | 0 | – |
| minor:panif | 75.3 / 21.3 | 2752 / 613 | 2752 / 613 | 0.0 | – | 0 | – |
| minor:tabac | 61.8 / 62.8 | 2259 / 1804 | 2259 / 1804 | 0.0 | – | 0 | – |
| minor:barb | 52.9 / 71.4 | 1935 / 2051 | 1935 / 2051 | 0.0 | – | 0 | – |
| minor:farm | 66.2 / 55.3 | 2420 / 1587 | 2420 / 1587 | 0.0 | – | 0 | – |
| minor:edic | 38.9 / 56.3 | 1423 / 1618 | 1423 / 1618 | 0.0 | – | 0 | – |
| minor:mac | 42.5 / 88.2 | 1554 / 2534 | 1554 / 2534 | 0.0 | – | 0 | – |
| casa | 69.6 / 38.9 | 2546 / 1118 | 2546 / 1118 | 0.0 | – | 0 | pins/s_casa.png |
| banca | 58.9 / 63.8 | 2152 / 1831 | 2152 / 1820 | 11.2 | ja | 2 👤 | pins/s_banca.png |
| muni | 71.5 / 49.8 | 2614 / 1431 | 2614 / 1431 | 0.0 | – | 1 👤 | pins/s_muni.png |
| palazzo | 47.9 / 81.5 | 1750 / 2341 | 1750 / 2341 | 0.0 | – | 1 👤 | pins/s_palazzo.png |
| caffe | 59.5 / 65.6 | 2175 / 1883 | 2175 / 1894 | 11.1 | ja | 3 👤 | pins/s_caffe.png |
| chiesa | 83.0 / 36.4 | 3035 / 1045 | 3035 / 1045 | 0.0 | – | 3 👤 | pins/s_chiesa.png |
| belv | 89.5 / 33.6 | 3274 / 964 | 3274 / 964 | 0.0 | – | 0 | pins/s_belv.png |
| santuario | 65.6 / 59.4 | 2397 / 1707 | 2397 / 1707 | 0.0 | – | 3 👤 | pins/s_santuario.png |

### Umland · Zoom 1 (Karte 1101×718 px, Überlappungen: 0)

| Pin | Koordinate % | Anker px | Icon px | Abweichung px | Führungslinie | Personen | Screenshot |
|---|---|---|---|---|---|---|---|
| minor:dogs | 76.0 / 76.7 | 837 / 551 | 835 / 551 | 1.7 | – | 0 | – |
| minor:masseria | 65.3 / 69.6 | 719 / 500 | 719 / 500 | 0.0 | – | 0 | – |
| minor:imker | 84.5 / 62.0 | 930 / 445 | 930 / 445 | 0.0 | – | 0 | – |
| minor:pozzo | 46.3 / 27.5 | 510 / 197 | 510 / 197 | 0.0 | – | 0 | – |
| minor:kapelle | 60.5 / 34.6 | 666 / 248 | 666 / 248 | 0.0 | – | 0 | – |
| minor:schaefer | 11.9 / 32.3 | 131 / 232 | 131 / 232 | 0.0 | – | 0 | – |
| minor:consorzio | 78.3 / 60.4 | 862 / 434 | 862 / 434 | 0.0 | – | 0 | – |
| minor:bosco | 19.8 / 19.5 | 218 / 140 | 218 / 140 | 0.0 | – | 0 | – |
| torre | 69.5 / 20.9 | 765 / 150 | 766 / 150 | 1.0 | – | 0 | pins/u_torre.png |
| frantoio | 82.3 / 53.4 | 906 / 383 | 906 / 383 | 0.0 | – | 1 👤 | pins/u_frantoio.png |
| hain | 76.0 / 21.7 | 837 / 156 | 837 / 156 | 0.0 | – | 1 👤 | pins/u_hain.png |
| feudo | 18.1 / 60.9 | 199 / 437 | 196 / 437 | 2.5 | – | 1 👤 | pins/u_feudo.png |
| lago | 54.7 / 84.5 | 603 / 607 | 603 / 607 | 0.0 | – | 0 | pins/u_lago.png |
| sambuca | 88.3 / 68.2 | 972 / 490 | 972 / 490 | 0.0 | – | 0 | pins/u_sambuca.png |
| hotel | 64.9 / 39.9 | 714 / 286 | 714 / 286 | 0.0 | – | 2 👤 | pins/u_hotel.png |
| lido | 7.5 / 73.9 | 83 / 530 | 83 / 530 | 0.0 | – | 2 👤 | pins/u_lido.png |
| o:lago | 32.7 / 75.1 | 360 / 539 | 360 / 539 | 0.0 | – | 0 | pins/u_o_lago.png |
| o:adranone | 79.3 / 80.2 | 873 / 576 | 874 / 576 | 1.3 | – | 0 | pins/u_o_adranone.png |
| o:misili | 35.7 / 39.2 | 393 / 281 | 393 / 281 | 0.0 | – | 0 | pins/u_o_misili.png |
| o:batia | 27.8 / 23.8 | 306 / 171 | 306 / 171 | 0.0 | – | 0 | pins/u_o_batia.png |
| o:adragna | 54.5 / 53.7 | 600 / 386 | 600 / 386 | 0.0 | – | 0 | pins/u_o_adragna.png |
| o:turih | 65.4 / 20.4 | 720 / 146 | 719 / 146 | 1.4 | – | 0 | pins/u_o_turih.png |
| o:giusih | 21.8 / 63.1 | 240 / 453 | 243 / 453 | 3.3 | – | 0 | pins/u_o_giusih.png |

### Umland · Zoom 1.6 (Karte 1761×1149 px, Überlappungen: 0)

| Pin | Koordinate % | Anker px | Icon px | Abweichung px | Führungslinie | Personen | Screenshot |
|---|---|---|---|---|---|---|---|
| minor:dogs | 76.0 / 76.7 | 1339 / 881 | 1339 / 881 | 0.0 | – | 0 | – |
| minor:masseria | 65.3 / 69.6 | 1150 / 800 | 1150 / 800 | 0.0 | – | 0 | – |
| minor:imker | 84.5 / 62.0 | 1488 / 712 | 1488 / 712 | 0.0 | – | 0 | – |
| minor:pozzo | 46.3 / 27.5 | 815 / 315 | 815 / 315 | 0.0 | – | 0 | – |
| minor:kapelle | 60.5 / 34.6 | 1065 / 397 | 1065 / 397 | 0.0 | – | 0 | – |
| minor:schaefer | 11.9 / 32.3 | 209 / 371 | 209 / 371 | 0.0 | – | 0 | – |
| minor:consorzio | 78.3 / 60.4 | 1379 / 694 | 1379 / 694 | 0.0 | – | 0 | – |
| minor:bosco | 19.8 / 19.5 | 349 / 224 | 349 / 224 | 0.0 | – | 0 | – |
| torre | 69.5 / 20.9 | 1224 / 240 | 1224 / 266 | 26.1 | ja | 0 | pins/u_torre.png |
| frantoio | 82.3 / 53.4 | 1449 / 614 | 1449 / 614 | 0.0 | – | 1 👤 | pins/u_frantoio.png |
| hain | 76.0 / 21.7 | 1339 / 250 | 1339 / 250 | 0.0 | – | 1 👤 | pins/u_hain.png |
| feudo | 18.1 / 60.9 | 318 / 700 | 318 / 681 | 18.6 | ja | 1 👤 | pins/u_feudo.png |
| lago | 54.7 / 84.5 | 964 / 971 | 964 / 971 | 0.0 | – | 0 | pins/u_lago.png |
| sambuca | 88.3 / 68.2 | 1555 / 784 | 1555 / 784 | 0.0 | – | 0 | pins/u_sambuca.png |
| hotel | 64.9 / 39.9 | 1142 / 458 | 1142 / 458 | 0.0 | – | 2 👤 | pins/u_hotel.png |
| lido | 7.5 / 73.9 | 132 / 849 | 132 / 849 | 0.0 | – | 2 👤 | pins/u_lido.png |
| o:lago | 32.7 / 75.1 | 576 / 863 | 576 / 863 | 0.5 | – | 0 | pins/u_o_lago.png |
| o:adranone | 79.3 / 80.2 | 1397 / 922 | 1397 / 922 | 0.5 | – | 0 | pins/u_o_adranone.png |
| o:misili | 35.7 / 39.2 | 628 / 450 | 628 / 451 | 0.5 | – | 0 | pins/u_o_misili.png |
| o:batia | 27.8 / 23.8 | 489 / 273 | 489 / 274 | 0.5 | – | 0 | pins/u_o_batia.png |
| o:adragna | 54.5 / 53.7 | 960 / 617 | 960 / 618 | 0.5 | – | 0 | pins/u_o_adragna.png |
| o:turih | 65.4 / 20.4 | 1152 / 234 | 1152 / 200 | 34.3 | ja | 0 | pins/u_o_turih.png |
| o:giusih | 21.8 / 63.1 | 384 / 725 | 384 / 751 | 25.4 | ja | 0 | pins/u_o_giusih.png |

### Umland · Zoom 2.56 (Karte 2818×1838 px, Überlappungen: 0)

| Pin | Koordinate % | Anker px | Icon px | Abweichung px | Führungslinie | Personen | Screenshot |
|---|---|---|---|---|---|---|---|
| minor:dogs | 76.0 / 76.7 | 2143 / 1410 | 2143 / 1410 | 0.0 | – | 0 | – |
| minor:masseria | 65.3 / 69.6 | 1841 / 1280 | 1841 / 1280 | 0.0 | – | 0 | – |
| minor:imker | 84.5 / 62.0 | 2381 / 1140 | 2381 / 1140 | 0.0 | – | 0 | – |
| minor:pozzo | 46.3 / 27.5 | 1305 / 505 | 1305 / 505 | 0.0 | – | 0 | – |
| minor:kapelle | 60.5 / 34.6 | 1704 / 635 | 1704 / 635 | 0.0 | – | 0 | – |
| minor:schaefer | 11.9 / 32.3 | 335 / 594 | 335 / 594 | 0.0 | – | 0 | – |
| minor:consorzio | 78.3 / 60.4 | 2207 / 1110 | 2207 / 1110 | 0.0 | – | 0 | – |
| minor:bosco | 19.8 / 19.5 | 559 / 358 | 559 / 358 | 0.0 | – | 0 | – |
| torre | 69.5 / 20.9 | 1958 / 384 | 1973 / 384 | 14.7 | ja | 0 | pins/u_torre.png |
| frantoio | 82.3 / 53.4 | 2319 / 982 | 2319 / 982 | 0.0 | – | 1 👤 | pins/u_frantoio.png |
| hain | 76.0 / 21.7 | 2142 / 400 | 2142 / 400 | 0.0 | – | 1 👤 | pins/u_hain.png |
| feudo | 18.1 / 60.9 | 509 / 1119 | 499 / 1119 | 10.1 | ja | 1 👤 | pins/u_feudo.png |
| lago | 54.7 / 84.5 | 1543 / 1554 | 1543 / 1554 | 0.0 | – | 0 | pins/u_lago.png |
| sambuca | 88.3 / 68.2 | 2488 / 1254 | 2488 / 1254 | 0.0 | – | 0 | pins/u_sambuca.png |
| hotel | 64.9 / 39.9 | 1828 / 733 | 1828 / 733 | 0.0 | – | 2 👤 | pins/u_hotel.png |
| lido | 7.5 / 73.9 | 211 / 1358 | 211 / 1358 | 0.0 | – | 2 👤 | pins/u_lido.png |
| o:lago | 32.7 / 75.1 | 922 / 1380 | 922 / 1381 | 0.5 | – | 0 | pins/u_o_lago.png |
| o:adranone | 79.3 / 80.2 | 2235 / 1475 | 2235 / 1475 | 0.5 | – | 0 | pins/u_o_adranone.png |
| o:misili | 35.7 / 39.2 | 1006 / 720 | 1006 / 720 | 0.5 | – | 0 | pins/u_o_misili.png |
| o:batia | 27.8 / 23.8 | 782 / 437 | 782 / 437 | 0.5 | – | 0 | pins/u_o_batia.png |
| o:adragna | 54.5 / 53.7 | 1536 / 987 | 1536 / 988 | 0.5 | – | 0 | pins/u_o_adragna.png |
| o:turih | 65.4 / 20.4 | 1844 / 374 | 1824 / 375 | 19.7 | ja | 0 | pins/u_o_turih.png |
| o:giusih | 21.8 / 63.1 | 615 / 1160 | 628 / 1161 | 13.5 | ja | 0 | pins/u_o_giusih.png |

### Umland · Zoom 4 (Karte 4404×2872 px, Überlappungen: 0)

| Pin | Koordinate % | Anker px | Icon px | Abweichung px | Führungslinie | Personen | Screenshot |
|---|---|---|---|---|---|---|---|
| minor:dogs | 76.0 / 76.7 | 3348 / 2203 | 3348 / 2203 | 0.0 | – | 0 | – |
| minor:masseria | 65.3 / 69.6 | 2877 / 1999 | 2877 / 1999 | 0.0 | – | 0 | – |
| minor:imker | 84.5 / 62.0 | 3721 / 1781 | 3721 / 1781 | 0.0 | – | 0 | – |
| minor:pozzo | 46.3 / 27.5 | 2039 / 788 | 2039 / 788 | 0.0 | – | 0 | – |
| minor:kapelle | 60.5 / 34.6 | 2663 / 992 | 2663 / 992 | 0.0 | – | 0 | – |
| minor:schaefer | 11.9 / 32.3 | 524 / 928 | 524 / 928 | 0.0 | – | 0 | – |
| minor:consorzio | 78.3 / 60.4 | 3449 / 1734 | 3449 / 1734 | 0.0 | – | 0 | – |
| minor:bosco | 19.8 / 19.5 | 873 / 560 | 873 / 560 | 0.0 | – | 0 | – |
| torre | 69.5 / 20.9 | 3060 / 600 | 3060 / 600 | 0.0 | – | 0 | pins/u_torre.png |
| frantoio | 82.3 / 53.4 | 3624 / 1534 | 3624 / 1534 | 0.0 | – | 1 👤 | pins/u_frantoio.png |
| hain | 76.0 / 21.7 | 3348 / 624 | 3348 / 624 | 0.0 | – | 1 👤 | pins/u_hain.png |
| feudo | 18.1 / 60.9 | 796 / 1749 | 796 / 1749 | 0.0 | – | 1 👤 | pins/u_feudo.png |
| lago | 54.7 / 84.5 | 2411 / 2428 | 2411 / 2428 | 0.0 | – | 0 | pins/u_lago.png |
| sambuca | 88.3 / 68.2 | 3889 / 1959 | 3889 / 1959 | 0.0 | – | 0 | pins/u_sambuca.png |
| hotel | 64.9 / 39.9 | 2857 / 1145 | 2857 / 1145 | 0.0 | – | 2 👤 | pins/u_hotel.png |
| lido | 7.5 / 73.9 | 330 / 2122 | 330 / 2122 | 0.0 | – | 2 👤 | pins/u_lido.png |
| o:lago | 32.7 / 75.1 | 1441 / 2157 | 1441 / 2157 | 0.5 | – | 0 | pins/u_o_lago.png |
| o:adranone | 79.3 / 80.2 | 3493 / 2304 | 3493 / 2305 | 0.5 | – | 0 | pins/u_o_adranone.png |
| o:misili | 35.7 / 39.2 | 1572 / 1125 | 1572 / 1125 | 0.5 | – | 0 | pins/u_o_misili.png |
| o:batia | 27.8 / 23.8 | 1222 / 683 | 1222 / 683 | 0.5 | – | 0 | pins/u_o_batia.png |
| o:adragna | 54.5 / 53.7 | 2401 / 1543 | 2401 / 1543 | 0.5 | – | 0 | pins/u_o_adragna.png |
| o:turih | 65.4 / 20.4 | 2881 / 585 | 2881 / 585 | 0.5 | – | 0 | pins/u_o_turih.png |
| o:giusih | 21.8 / 63.1 | 960 / 1813 | 960 / 1813 | 0.5 | – | 0 | pins/u_o_giusih.png |


## Pin-Verifikation v0.9.0 (FB-41/OI-051)
**Ursachen der Drift:** (1) Das Pin-Layout verschob auch die Laden-Icons (Nebenorte) beim Entzerren – seit v0.9.0 haben Nebenorte `m: 0` und werden nie verschoben. (2) Fünf Stadt-Koordinaten (`MINOR[].px` in `src/c.tsx`) lagen bis zu 62 px (bei Zoom 4) neben dem gezeichneten Laden; bei kleinem Zoom unsichtbar, beim Hineinzoomen wirkte das wie Drift. Neu kalibriert am Poster (Zoom 4, Crops):

| Laden | alt (x %, y %) | neu (x %, y %) |
|---|---|---|
| barb (Barbiere) | 52.94, 71.41 | 52.39, 70.89 |
| casal (Y&L Haushaltswaren) | 56.43, 31.38 | 56.84, 30.44 |
| farm (Farmacia) | 66.19, 55.27 | 65.92, 54.92 |
| ferr (Ferramenta) | 38.79, 49.06 | 37.29, 48.71 |
| tabac (Tabaccheria) | 61.79, 62.8 | 61.52, 61.83 |

panif, mac, edic (Stadt) und alle Umland-Nebenorte (dogs u. a.) waren korrekt bzw. haben kein gezeichnetes Icon.

**Messung** (`source/qa/qa9.js`, Playwright, 390×844): Für jede Zoomstufe wird die Bildschirmposition jedes Laden-Icons mit der aus `px` × Kartengröße berechneten Soll-Position verglichen.

| Karte | Zoom | Kartenbreite px | max. Abweichung Laden-Icons |
|---|---|---|---|
| Stadt | 1 / 1.6 / 2.6 / 4 | 914 / 1462 / 2340 / 3656 | 0 px |
| Umland | 1 / 1.6 / 2.6 / 4 | 1101 / 1761 / 2818 / 4404 | 0 px |

Haupt-Pins (Orte) dürfen bewusst bis ca. 37 px vom Anker abweichen: Das Layout entzerrt sie und zeichnet eine Führungslinie zum Anker; das Label verschiebt den Mittelpunkt um ca. 10 px.

**Belege:** `docs/qa/v0.9.0/pins_stadt_z4_vorher_a.png`, `…_vorher_b.png`, `pins_stadt_z4_nach_kalibrierung.png`, `pins_umland_z4_a.png`, `…_b.png`, `10_pins_stadt_z0_casal.png`, `10_pins_stadt_z3_casal.png`. Neu messen: `node source/qa/qa9.js` (Server im Repo-Root), Crops: `node source/qa/pincrops9.js`.
