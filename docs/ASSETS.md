# ASSETS – Bilder, Referenzen, Prompts

Alle Szenenbilder sind **KI-generiert** (Grok-Bot-Werkzeug `GenerateImage`, Seitenverhältnis 9:16, comicartiger „GTA-Poster“-Stil). Thorstens echte Fotos dienten **nur als Referenz** für den Bildaufbau. Sie sind **nicht** eingebettet und liegen **nicht** in diesem öffentlichen Repo. Alle Figuren sind fiktiv.

## Woher die Referenzfotos kommen

Thorsten hat die Fotos am 02.11.2026 zwischen 21:32 und 21:38 (Europe/Berlin) in Google Drive bereitgestellt, das Bankfoto `p20_bank` kam nach 21:46. Sie wurden auf die Build-Box geladen (`/workspace/sambuca-game/v07/ref/p*.jpg`) und für die Generierung verkleinert (`s_p*.jpg`). Die Nummerierung p01–p21 folgt der Reihenfolge im Auftrag.

| Nr. | Drive-Datei-ID |
|---|---|
| p01 | `13z9tc30j5Oo3vudDg97utbQb36uSHp1m (abgeleitet aus Reihenfolge)` |
| p02 | `1JegT9fQ29nphsENcbulSnzTMpOtXq5u3 (abgeleitet aus Reihenfolge)` |
| p03 | `1ZT_2HgbVQbx9ea6ADpMW85G7kuyFMZwU` |
| p04 | `1EsbS_2-OMHaGOYMWtQLFgULIUOvRMH0a (IMG_20261018_114219527.jpg)` |
| p05 | `1kmKZvUL9LdgmEjup39Hc0uVkZzBh0SZR (IMG_20261025_150019684~2.jpg)` |
| p06 | `1MjPs2IfIjGQufv_15S0FuDWmeanpOZJx` |
| p07 | `1rR6-XqvuQP1xGNydVCQsibMa9HekcUET` |
| p08 | `1-_bC34fzvNs2OBW7Ufn7MzlaxWHQhxt5` |
| p09 | `1gjXC8S1BfN8WVFLcZeQGzTKigwLKf22L` |
| p10 | `1o3wjgKk7zBq3rbzg3Mdcg4xiZvTgC4Y9` |
| p11 | `1LGah6_n-iz7aDF1tLxO9kW2Z8CFAVYpY` |
| p12 | `1kd36PM4xrCzghkNKX3efwbcj8rVgWCYa` |
| p13 | `1nftaxNR1N7hptbOccGUk2DM26q_oFG1M` |
| p14 | `1goO726Hul6skTelSH4RoX74yjcrobuff` |
| p15 | `1Gk5pwAnJeZ1b0IdlnyDEbTHz8FRS-4Fb` |
| p16 | `1XNNdSBsDsNKFMknUh0qKgGmXZMZtVlRT` |
| p17 | `13pEQrGPjcCXHpe0l7LYR1i1dcx_42auj` |
| p18 | `1SwFq6ffTC6uzmK8mHtI1gox3e1xcD8ai` |
| p19 | `1aM_nGQM32BalRzLCiSUW0qqtnkObi3_C` |
| p20_bank | `1WOXUmAsRp40SuYf0jfqFYEVqWCpPdTXm` |
| p21 | `1yQ7SYtkC1TzvzSQ_-cjILg43_1ZIGdmc` |

Bei p01 und p02 steht die Drive-ID nicht in den Dateien. Sie wurde aus der Reihenfolge der IDs im Auftrag abgeleitet und ist deshalb als *abgeleitet* markiert.

## Szenenbilder (Stand v0.7.1)

Master: `source/scenes/<datei>.jpg` (volle Auflösung). Im Spiel: `source/game/imgs.tsx`, als WebP 450×800 (q70, Festa q72) mit `source/tools/build_imgs.py`. Alle Dateien sind vom 02.11.2026; die Zeit ist der Dateistempel auf der Build-Box (Europe/Berlin). Die Prompt-Nr. bezieht sich auf die Zeile (0-basiert) in [`prompts/generate_image_calls.jsonl`](prompts/generate_image_calls.jsonl).

| Datei | Spiel-Key | Zweck | Prompt-Nr. | Referenzen | Datum | SHA-256 (12) |
|---|---|---|---|---|---|---|
| `01_buero1_start.jpg` | `buero1` | Büro Stufe 1 (Start) | #7 | `s_p09.jpg` → Drive `1gjXC8S1BfN8WVFLcZeQGzTKigwLKf22L`<br>`s_p18.jpg` → Drive `1SwFq6ffTC6uzmK8mHtI1gox3e1xcD8ai`<br>`cur_buero.png` (eigenes Spielbild/Stilreferenz, kein Foto von Thorsten) | 02.11.2026 21:45 | `b3073f2b60da` |
| `02_buero2_bescheiden.jpg` | `buero2` | Büro Stufe 2 | #8 | `s_p18.jpg` → Drive `1SwFq6ffTC6uzmK8mHtI1gox3e1xcD8ai`<br>`cur_buero.png` (eigenes Spielbild/Stilreferenz, kein Foto von Thorsten) | 02.11.2026 21:45 | `72d60c33054b` |
| `03_buero3_erfolg.jpg` | `buero3` | Büro Stufe 3 | #9 | `s_p02.jpg` → Drive `1JegT9fQ29nphsENcbulSnzTMpOtXq5u3 (abgeleitet aus Reihenfolge)`<br>`s_p13.jpg` → Drive `1nftaxNR1N7hptbOccGUk2DM26q_oFG1M` | 02.11.2026 21:45 | `258b47ae89cb` |
| `04_buero4_padrino.jpg` | `buero4` | Büro Stufe 4 | #10 | `s_p06.jpg` → Drive `1MjPs2IfIjGQufv_15S0FuDWmeanpOZJx` | 02.11.2026 21:45 | `3c8ec3209964` |
| `05_rathaus.jpg` | `rathaus` | Municipio | #11 | `s_p13.jpg` → Drive `1nftaxNR1N7hptbOccGUk2DM26q_oFG1M`<br>`s_p17.jpg` → Drive `13pEQrGPjcCXHpe0l7LYR1i1dcx_42auj` | 02.11.2026 21:45 | `fe31ca3e2a6c` |
| `06_bar_del_corso.jpg` | `bar` | Bar del Corso (ersetzt „Bar Navarro“, Prompt #12) | #4 | `s_p01.jpg` → Drive `13z9tc30j5Oo3vudDg97utbQb36uSHp1m (abgeleitet aus Reihenfolge)`<br>`05_rathaus.jpg` (eigenes Spielbild/Stilreferenz, kein Foto von Thorsten) | 02.11.2026 21:55 | `f23a062bb137` |
| `07_chiesa.jpg` | `chiesa` | Chiesa Madre | #13 | `s_p19.jpg` → Drive `1aM_nGQM32BalRzLCiSUW0qqtnkObi3_C`<br>`s_p12.jpg` → Drive `1kd36PM4xrCzghkNKX3efwbcj8rVgWCYa` | 02.11.2026 21:45 | `64416ca6d995` |
| `08_festa.jpg` | `IMG_F` | Festa; danach Schrift-Korrektur mit Prompt #5 (Referenz: 08_festa selbst) | #14 | `s_p16.jpg` → Drive `1XNNdSBsDsNKFMknUh0qKgGmXZMZtVlRT`<br>`s_p08.jpg` → Drive `1-_bC34fzvNs2OBW7Ufn7MzlaxWHQhxt5` | 02.11.2026 21:55 | `4900db94dd85` |
| `09_feudo.jpg` | `feudo` | Feudo Arancio | #15 | `s_p11.jpg` → Drive `1LGah6_n-iz7aDF1tLxO9kW2Z8CFAVYpY`<br>`s_p07.jpg` → Drive `1rR6-XqvuQP1xGNydVCQsibMa9HekcUET` | 02.11.2026 21:45 | `44860ab00b0c` |
| `10_frantoio.jpg` | `frantoio` | Frantoio | #16 | `s_p04.jpg` → Drive `1EsbS_2-OMHaGOYMWtQLFgULIUOvRMH0a (IMG_20261018_114219527.jpg)` | 02.11.2026 21:45 | `fe9d413f9cab` |
| `11_hain.jpg` | `hain` | eigener Hain | #17 | `s_p04.jpg` → Drive `1EsbS_2-OMHaGOYMWtQLFgULIUOvRMH0a (IMG_20261018_114219527.jpg)`<br>`s_p18.jpg` → Drive `1SwFq6ffTC6uzmK8mHtI1gox3e1xcD8ai` | 02.11.2026 21:45 | `f14eff8f1af2` |
| `12_belvedere.jpg` | `belv` | Belvedere | #18 | `s_p14.jpg` → Drive `1goO726Hul6skTelSH4RoX74yjcrobuff`<br>`s_p02.jpg` → Drive `1JegT9fQ29nphsENcbulSnzTMpOtXq5u3 (abgeleitet aus Reihenfolge)` | 02.11.2026 21:45 | `f108435fcdbf` |
| `13_lago.jpg` | `lago` | Lago Arancio | #19 | `s_p10.jpg` → Drive `1o3wjgKk7zBq3rbzg3Mdcg4xiZvTgC4Y9`<br>`blick.jpg` (Web-Referenz v0.6, nicht im Repo) | 02.11.2026 21:45 | `d2b009108f57` |
| `14_teatro_palazzo.jpg` | `teatro` | Teatro L'Idea / Palazzo Panitteri | #20 | `s_p03.jpg` → Drive `1ZT_2HgbVQbx9ea6ADpMW85G7kuyFMZwU` | 02.11.2026 21:45 | `957c1272f931` |
| `15_ruine_adranone.jpg` | `ruine` | Monte Adranone | #21 | `s_p15.jpg` → Drive `1Gk5pwAnJeZ1b0IdlnyDEbTHz8FRS-4Fb` | 02.11.2026 21:45 | `823244937754` |
| `16_banca.jpg` | `banca` | Banca; zwei Versuche (#3 mit p21, #6 mit p20_bank). Verwendet ist sehr wahrscheinlich #6 (später erzeugt, nachdem das Bankfoto 21:46 kam); nicht eindeutig protokolliert | #6 | `p20_bank.jpg` → Drive `1WOXUmAsRp40SuYf0jfqFYEVqWCpPdTXm`<br>`05_rathaus.jpg` (eigenes Spielbild/Stilreferenz, kein Foto von Thorsten) | 02.11.2026 21:55 | `c0dc79f41318` |

Hinweis zum Datum: Die Bilder wurden am 02.11.2026 zwischen etwa 21:41 und 22:00 (Europe/Berlin) erzeugt. Der Stempel oben ist der Zeitpunkt, zu dem sie in den v07-Ordner kopiert wurden.

## Weitere Bilder im Spiel

- **IMG_P (Figurenporträts)** und **IMG_B (altes Büro)** stammen aus v0.5 (generiert am 02.11.2026). Die Master liegen auf der Build-Box unter `/workspace/sambuca-game/v05/img/`. Die genauen Prompts sind für diese Runde nicht mehr als Werkzeugaufruf erhalten; erhalten sind nur die eingebetteten WebPs.
- **v0.6-Bilder** (`buero_v6`, `bar_v6`, `fest_v6`, Prompts #0–#2): echte Ortsansichten im Spielstil. Als Referenz dienten das vorherige Spielbild (`cur_*.png`) und Web-Fotos von Sambuca (`v06/ref/town.jpg`, `blick.jpg`, `piazza.jpg`). In v0.7 wurden sie durch die Szenen oben ersetzt.
- **Karten**: siehe MAPS.md. **Favicon** `icon.webp`: aus v0.6.

## Alle Prompts im Wortlaut

### #0 – `buero_v6.png` (9:16)

Referenzen: `/workspace/sambuca-game/v06/cur_buero.png`, `/workspace/sambuca-game/v06/ref/town.jpg`, `/workspace/sambuca-game/v06/ref/blick.jpg`

```text
Redraw the FIRST reference image (a Sicilian office interior, portrait 9:16) keeping its exact composition: open wooden window shutters top center, calendar on left wall, shelf with bottles right, wooden door lower left, desk with old computer monitor and red rotary phone bottom center/right. Only change the view through the window: it must now show the real town of Sambuca di Sicilia as in the other reference photos — a dense cluster of pale cream and ochre stone houses on a low hill, a church bell tower and dome (Chiesa Madre) on top, green rolling vineyard valley below, and the turquoise Lago Arancio reservoir in the distance with hills behind, at warm magenta-orange sunset. Style: rich painterly GTA loading-screen illustration, bold ink outlines, saturated purple/pink/orange palette, detailed, not pixel art, not retro, no text.
```

### #1 – `bar_v6.png` (9:16)

Referenzen: `/workspace/sambuca-game/v06/cur_bar.png`, `/workspace/sambuca-game/v06/ref/piazza.jpg`

```text
Redraw the FIRST reference image (a Sicilian bar interior, portrait 9:16) keeping its exact composition: espresso machine on the counter left, TV top right, hanging lamps, wall clock, tables and chairs in the lower half, newspaper rack bottom left, and a big open arched doorway on the right half. Change the view through the arched doorway to the real Piazza della Vittoria of Sambuca di Sicilia from the second reference photo: a row of tall golden-lit stone arches with heraldic shields, a pale ochre palazzo with balconies, a soldier war-memorial statue between two olive trees, a street lamp, at warm dusk with a magenta-orange sky. Style: rich painterly GTA loading-screen illustration, bold ink outlines, saturated purple/pink/orange palette, detailed, not pixel art, not retro, no text, no people.
```

### #2 – `fest_v6.png` (16:9)

Referenzen: `/workspace/sambuca-game/v06/cur_F.png`, `/workspace/sambuca-game/v06/ref/piazza.jpg`, `/workspace/sambuca-game/v06/ref/town.jpg`

```text
Redraw the FIRST reference image (a Sicilian night festival procession, 16:9) with the same mood and composition: men in white robes carrying a golden Madonna float on the left, crowds, festival lanterns, fireworks. Set it in the real Piazza della Vittoria of Sambuca di Sicilia from the second reference: the row of tall golden-lit stone arches with heraldic shields on the left, the pale ochre palazzo with balconies and the war-memorial statue between olive trees on the right, and in the far background the hill town of Sambuca with pale stone houses and church tower lit by thousands of lights. Style: rich painterly GTA loading-screen illustration, bold ink outlines, saturated purple/pink/orange palette, not pixel art, not retro, no text.
```

### #3 – `v07_banca.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/p21.jpg`, `/workspace/sambuca-game/v07/scenes/05_rathaus.jpg`

```text
Vertical 9:16 game background: the banking hall of the old Sicilian town bank in Sambuca di Sicilia, following the first reference photo's layout: large skylight in the ceiling, white walls, arched doorways framed in golden tufa stone, an old oil portrait painting, a wooden writing desk island with green glass panels in the center, granite tile floor, potted plants, green-cushioned wooden chairs. Render it in the exact art style of the second reference: bold GTA-style comic illustration, thick ink outlines, cel shading, moody warm lamplight with long shadows, 'The Godfather' mood, dusk. A small brass plaque above the central doorway reading exactly 'BANCA'. No other text. Leave open floor space in the lower half for characters. Not pixel art, not photographic.
```

### #4 – `v07_bar_del_corso.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p01.jpg`, `/workspace/sambuca-game/v07/scenes/05_rathaus.jpg`

```text
Vertical 9:16 game background scene, interior of 'Bar del Corso' in Sambuca di Sicilia: white vaulted ceiling, long glass pastry counter with Sicilian pastries (Minni di Virgini, cannoli, arancine), espresso machine, glass entrance door to the street, a few small tables. Match the bar layout of the first reference photo. Render in the exact art style of the second reference: bold GTA-style comic illustration, thick ink outlines, cel shading, warm amber light and deep shadows, 'The Godfather' mood, evening haze. Small elegant sign above the counter reading exactly 'BAR DEL CORSO'. No other text. Leave open floor space in the lower half for characters. Not pixel art, not photographic.
```

### #5 – `v07_festa_fix.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/scenes/08_festa.jpg`

```text
Recreate this exact image (same composition, festa procession scene, same GTA comic style, colors and lighting) but fix the garbled lettering on the church facade: the inscription must read exactly 'AVE MARIA' in clean Roman capital letters. No other text anywhere. Keep everything else identical. Bold comic ink outlines, Godfather mood, not pixel art.
```

### #6 – `v07_banca.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/p20_bank.jpg`, `/workspace/sambuca-game/v07/scenes/05_rathaus.jpg`

```text
Vertical 9:16 game background scene: interior of a small Sicilian town bank branch 'Banca' in Sambuca di Sicilia, based on the room layout of the first reference photo (bright polished marble floor, white counter on the right, shelves on the left, potted plants), reinterpreted as a bank: teller counter with brass grille, a heavy steel vault door on the back wall, framed ledger, desk lamp, ceiling fan. Render in the exact art style of the second reference: bold GTA-style comic illustration, thick ink outlines, cel shading, moody warm lamplight and long shadows, 'The Godfather' mood. Small sign above the counter reading exactly 'BANCA'. No other text. Open floor space in the lower half for characters. Not pixel art, not photographic.
```

### #7 – `buero1_start.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p09.jpg`, `/workspace/sambuca-game/v07/photos/s_p18.jpg`, `/workspace/sambuca-game/v06/cur_buero.png`

```text
Portrait 9:16 video game scene background: SHABBY STARTING OFFICE in an old Sicilian town house in Sambuca. Cracked plaster walls, bare bulb, wobbly wooden table with an old CRT computer and a black rotary phone, cardboard boxes, one rusty olive-oil can, a broken chair, an old wooden door on the left, a wall calendar. Center top: open green wooden shutters showing the narrow steep alley of the reference photo and the hill-town rooftops of Sambuca at golden hour. A dented Vespa visible in the alley below. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated warm amber and deep orange light with dramatic long shadows, Godfather-era Sicilian mood, dark wood. Not pixel art, not retro, no text, no people.
```

### #8 – `buero2_bescheiden.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p18.jpg`, `/workspace/sambuca-game/v06/cur_buero.png`

```text
Portrait 9:16 video game scene background: MODEST TIDY OFFICE of a small Sicilian olive oil trader in Sambuca. Freshly whitewashed walls, solid wooden desk with a beige computer and red rotary phone, filing cabinet, shelf with a few labelled olive oil bottles, framed map of the valley, wall calendar, wooden door on the left, ceiling fan. Center top: open wooden shutters showing the hill town of Sambuca (pale stone houses on a hill, green fields) like the reference photo. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated warm amber light, dramatic shadows, Godfather-era Sicilian mood, dark wood. Not pixel art, not retro, no text, no people.
```

### #9 – `buero3_erfolg.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p02.jpg`, `/workspace/sambuca-game/v07/photos/s_p13.jpg`

```text
Portrait 9:16 video game scene background: SUCCESSFUL BUSINESSMAN'S OFFICE in a palazzo in Sambuca di Sicilia. Polished dark walnut panelling, big carved desk with a modern computer and an elegant brass telephone, leather chair, glass cabinet full of premium olive oil bottles with gold labels, framed awards, Persian rug, green banker's lamp, a door on the left, calendar. Tall window with wooden shutters at the top centre opening onto the sunset view over Sambuca's rooftops and the valley like the reference photo. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated warm amber and gold light, dramatic shadows, Godfather-era Sicilian mood. Not pixel art, not retro, no text, no people.
```

### #10 – `buero4_padrino.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p06.jpg`

```text
Portrait 9:16 video game scene background: PADRINO-STYLE VILLA STUDY of a powerful Sicilian olive oil don, 1970s Godfather mood. Dark wood-panelled study with heavy half-closed shutters letting in blades of amber light, huge mahogany desk with a vintage gold telephone, a cat-shaped shadow, a glass of red wine, a cigar in an ashtray, an oil portrait of an olive tree, bookshelves, a leather armchair in shadow, a coppola cap and a fedora on a hat stand, a door on the left. Through the tall window: a terrace garden with stone walls, agave and an olive tree like the reference photo, and a black vintage car below. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, deep saturated amber and burgundy palette, very dramatic chiaroscuro shadows. Not pixel art, not retro, no text, no people.
```

### #11 – `rathaus.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p13.jpg`, `/workspace/sambuca-game/v07/photos/s_p17.jpg`

```text
Portrait 9:16 video game scene background: MUNICIPIO (town hall) of Sambuca di Sicilia, seen from the piazza: the ochre stone palazzo with ground-floor arcades, balconies with wrought-iron railings, a clock and flag, exactly like the reference photo; above the entrance the town coat of arms (crown, blue shield, golden harp) from the second reference. A small red Fiat and a Vespa parked in front, a public notice board on the right. Warm late afternoon. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated warm amber light with dramatic long shadows, Godfather-era Sicilian mood. Not pixel art, not retro, no readable text, no people.
```

### #12 – `bar.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p01.jpg`, `/workspace/sambuca-game/v07/photos/s_p05.jpg`

```text
Portrait 9:16 video game scene background: BAR NAVARRO, a Sicilian caffè interior based on the reference photo: vaulted stone arched ceiling, long bar counter with a chrome espresso machine, glass pastry display with cannoli, bottles on shelves, a TV high on the wall showing a calcio match in a green stadium, bistro tables and chairs, newspaper rack, glass front door open to an evening piazza with a parked Vespa. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated warm amber light and dramatic shadows, smoky Godfather-era Sicilian mood, dark wood. Not pixel art, not retro, no readable text, no people.
```

### #13 – `chiesa.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p19.jpg`, `/workspace/sambuca-game/v07/photos/s_p12.jpg`

```text
Portrait 9:16 video game scene background: CHIESA MADRE of Sambuca di Sicilia: the old honey-coloured stone church with its square bell tower and wide stone staircase leading up to the portal, as in the reference photos, seen from below at dusk, candles glowing in the open doorway, a few cypress and palm trees. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated warm amber and violet dusk sky, dramatic shadows, solemn Godfather-era Sicilian mood. Not pixel art, not retro, no text, no people.
```

### #14 – `festa.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p16.jpg`, `/workspace/sambuca-game/v07/photos/s_p08.jpg`

```text
Portrait 9:16 video game scene background: FESTA DELLA MADONNA DELL'UDIENZA at night in Sambuca di Sicilia: the church facade covered in colourful festival light arches (red, green, blue, gold) exactly as in the first reference photo, a golden Madonna statue on a float carried by men in white robes, crowds as dark silhouettes in coppola caps, fireworks above the bell towers, festival lights strung over the street. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, hyper-saturated neon festival colours against a deep night sky, dramatic Godfather-era Sicilian mood. Not pixel art, not retro, no text, no recognisable real persons.
```

### #15 – `feudo.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p11.jpg`, `/workspace/sambuca-game/v07/photos/s_p07.jpg`

```text
Portrait 9:16 video game scene background: FEUDO ARANCIO wine and olive estate near Sambuca: the low modern-rustic estate building above rows of vines, dirt road leading to it, with the Lago Arancio reservoir and soft hills behind at sunset, as in the reference photos. A vintage Fiat pickup with crates on the road. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated warm amber and pink sunset light, dramatic long shadows, Godfather-era Sicilian countryside mood. Not pixel art, not retro, no text, no people.
```

### #16 – `frantoio.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p04.jpg`

```text
Portrait 9:16 video game scene background: traditional Sicilian FRANTOIO (olive oil mill) interior: old stone vaulted hall, large granite millstones crushing olives, stacks of woven fibre press mats, a steel press and centrifuge, golden-green oil pouring into a steel vat, crates of fresh olives from the olive grove in the reference, a wooden door open to the olive grove outside. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated warm amber light beams through dust, dramatic shadows, Godfather-era Sicilian mood, dark wood. Not pixel art, not retro, no text, no people.
```

### #17 – `hain.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p04.jpg`, `/workspace/sambuca-game/v07/photos/s_p18.jpg`

```text
Portrait 9:16 video game scene background: the player's OLIVE GROVE (Hain) in the countryside near Sambuca: gnarled ancient olive trees like the reference photo, nets spread on the ground, a wooden ladder, olive crates, a dusty Vespa with a crate on the back, dry stone wall, and in the distance the hill town of Sambuca with pale houses on its hill. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated warm amber afternoon light with deep blue sky, dramatic shadows, Godfather-era Sicilian countryside mood. Not pixel art, not retro, no text, no people.
```

### #18 – `belvedere.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p14.jpg`, `/workspace/sambuca-game/v07/photos/s_p02.jpg`

```text
Portrait 9:16 video game scene background: BELVEDERE viewpoint of Sambuca di Sicilia: a stone balustrade terrace in the foreground with an iron street lamp and a bench, looking out over the dense rooftops and church domes of the town tumbling down the hill (from the aerial reference) to the valley at golden sunset (from the second reference). STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated amber, orange and magenta sky, dramatic shadows, Godfather-era Sicilian mood. Not pixel art, not retro, no text, no people.
```

### #19 – `lago.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p10.jpg`, `/workspace/sambuca-game/v06/ref/blick.jpg`

```text
Portrait 9:16 video game scene background: LAGO ARANCIO at sunset: the reservoir glowing in the valley with soft hills behind, the sun setting over the water, wild grasses and an olive branch framing the foreground exactly as in the reference photo, a small wooden jetty with a rowing boat. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated orange, pink and purple sky, dramatic silhouettes, Godfather-era Sicilian mood. Not pixel art, not retro, no text, no people.
```

### #20 – `teatro.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p03.jpg`

```text
Portrait 9:16 video game scene background: PALAZZO PANITTERI / Teatro L'Idea of Sambuca: an ornate small Italian horseshoe opera theatre interior with three tiers of red and gold boxes, a crystal chandelier, red velvet seats and a closed red stage curtain, as in the reference photo. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated deep red and warm gold light, dramatic shadows, elegant Godfather-opera mood. Not pixel art, not retro, no text, no people.
```

### #21 – `ruine.png` (9:16)

Referenzen: `/workspace/sambuca-game/v07/photos/s_p15.jpg`

```text
Portrait 9:16 video game scene background: ANCIENT RUINS on the hill near Sambuca (Monte Adranone / Torre area): a weathered stone portico of four Doric columns on a stepped base, exactly like the reference photo, with dramatic clouds, dry grass, a lone olive tree, and the far valley with Lago Arancio below. STYLE: strong GTA loading-screen comic art, thick bold black ink outlines, hard cel shading, saturated deep blue sky and warm amber stone, dramatic shadows, Godfather-era Sicilian mood. Not pixel art, not retro, no text, no people.
```


## v0.8 – Fest-Bilder & Orte nach Referenzfotos aus Google Drive (03.11.2026)

Thorsten hat am 03.11.2026 zwischen 01:00 und 01:24 (Europe/Berlin) sechs Fotos in Google Drive gelegt.
**Die Fotos sind nur Referenz.** Sie liegen nicht im Repo; sie lagen zum Bauen lokal unter `/workspace/sambuca-game/v08/festref/`.
Alle Bilder sind mit `GenerateImage` (9:16, Stil-Referenz `08_festa.jpg` bzw. Vorgängerbild) **im Spielstil neu gezeichnet**: painterly, kein Pixel-Look. Die Personen sind generisch und fiktiv, ohne erkennbare Gesichter. Die exakten Aufrufe stehen in `docs/prompts/generate_image_calls.jsonl` (letzte 4 Zeilen).

| Drive-ID | Motiv (Foto) | verwendet für | Datei | SC-Key | im Spiel |
|---|---|---|---|---|---|
| `1L5jkFHQWpMo6w3gENqqMFbDnUkDuuv2X` | lange Festtafel in der Gasse, nachts | Festa dei Vassalli (Aug.) | `23_fest_vassalli.jpg` | `vassalli` | Fest-Szene + Splash Monat 7, Event-Karten `vassalli`, `calici` |
| `1p2zfh9ub93txjTbSG4fwgYvz_OYnjal_` | Kochstand unter Zelt vor Kirchenfassade mit Uhr | Festa dei Vassalli | `23_fest_vassalli.jpg` | `vassalli` | wie oben |
| `11cYIGtjnKBDtnp4IW3dmlSU2Sw_N0VdY` | Prozession mit Priester & Messdienern in der Gasse | San Giorgio (Settimana Santa & San Giorgio, Apr.) | `24_fest_giorgio.jpg` | `giorgio` | Fest-Szene + Splash Monat 3, Event-Karte `giorgio` |
| `1elpWrZZtKB0XgLlTSLsqSLTgX0f9kzAk` | Freiluftmesse am Steinbogen, Altar mit Blumen | San Giorgio (Feldsegnung) | `24_fest_giorgio.jpg` | `giorgio` | wie oben |
| `1cTc0E_Z9rKnye6JrCDPxp4JPP9hWF8sj` | Torre di Pandolfina (Turm mit Efeu) | Ort Torre di Pandolfina (kein Fest) | `18_torre_pandolfina.jpg` (v2, ersetzt v0.8-Erstversion) | `torre` | Szene „TORRE DI PANDOLFINA" |
| `1QLMKkHuWd_0W1umXptqCih06W6hloiZ2` | Lido-Zelt mit Stühlen, Blick aufs Meer | Ort Lido (kein Fest) | `21_lido.jpg` (v2) | `lido` | Szene Lido |

Die Settimana-Santa-Szene `20_settimana_santa.jpg` bleibt bestehen. Sie ist jetzt das Banner der Event-Karte `santa`.
Code: `FEST_SC`, `EV_IMG` und `festImg()` in `source/game/src/c.tsx`, Banner in `evCard` (`f.tsx`).
Die übrigen Feste (Udienza, Vendemmia/Fiera, Raccolta, Natale) nutzen weiter `08_festa.jpg`.

### Prompts

**`source/scenes/23_fest_vassalli.jpg`** (Referenzen: source/scenes/08_festa.jpg, drive:1L5jkFHQWpMo6w3gENqqMFbDnUkDuuv2X, drive:1p2zfh9ub93txjTbSG4fwgYvz_OYnjal_)

> Portrait 9:16 scene in the exact painterly style of the first reference image (rich painterly GTA loading-screen illustration, bold ink outlines, saturated warm palette, not pixel art, no text). Scene: Festa dei Vassalli on a summer night in a Sicilian hill-town street: long tables with white tablecloths full of colourful plates of pasta col macco, bread and watermelon, a white market tent with a big pot cooking stand in front of a lit stone church facade with a clock, strings of warm festival lights, a crowd of generic stylised villagers seen from behind and side (no recognizable faces). Composition and atmosphere taken from the second and third reference photos, but fully re-drawn as illustration.

**`source/scenes/24_fest_giorgio.jpg`** (Referenzen: source/scenes/08_festa.jpg, drive:11cYIGtjnKBDtnp4IW3dmlSU2Sw_N0VdY, drive:1elpWrZZtKB0XgLlTSLsqSLTgX0f9kzAk)

> Portrait 9:16 scene in the exact painterly style of the first reference image (rich painterly GTA loading-screen illustration, bold ink outlines, saturated warm palette, not pixel art, no text). Scene: San Giorgio field blessing in a Sicilian hill town: a narrow sunny cobbled street with pastel houses, a small procession with a priest in a white and gold vestment and altar boys in white-and-red robes, a saint statue carried in the back; in the foreground an open-air altar with white flowers, a red candle and an open book in front of an old stone arch. Generic stylised people, no recognizable faces. Composition taken from the second and third reference photos, fully re-drawn as illustration.

**`source/scenes/18_torre_pandolfina.jpg`** (Referenzen: source/scenes/18_torre_pandolfina.jpg (v0.8 first version), drive:1cTc0E_Z9rKnye6JrCDPxp4JPP9hWF8sj)

> Portrait 9:16 scene in the exact painterly style of the first reference image (rich painterly GTA loading-screen illustration, bold ink outlines, saturated warm palette, not pixel art, no text). Scene: the medieval square stone watchtower Torre di Pandolfina with crenellations, ivy and bougainvillea on an attached low stone building with an arched door, golden dry grass in front, deep blue sky, olive trees on a hillside. Shape and details of the tower taken from the second reference photo, fully re-drawn as illustration. No people.

**`source/scenes/21_lido.jpg`** (Referenzen: source/scenes/21_lido.jpg (v0.8 first version), drive:1QLMKkHuWd_0W1umXptqCih06W6hloiZ2)

> Portrait 9:16 scene in the exact painterly style of the first reference image (rich painterly GTA loading-screen illustration, bold ink outlines, saturated warm palette, not pixel art, no text). Scene: Lido beach restaurant: a white tent pavilion with arched plastic windows, warm hanging lamps, cream plastic chairs and small tables on a terracotta floor, an open front looking out to the turquoise Mediterranean sea and a palm tree, golden evening light. A blank wooden boomerang-shaped sign without lettering. No people. Layout taken from the second reference photo, fully re-drawn as illustration.
