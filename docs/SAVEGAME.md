# Spielstand (v0.9.0)

Speicherung erfolgt im Browser per `localStorage`, **nur lokal auf dem Gerät**. Es gibt keinen Server und keine Synchronisation.

| Schlüssel | Inhalt |
|---|---|
| `sambuca5_save` | kompletter Zustand `G` als JSON, Version SAVE-v = 5 |
| `sambuca5_name` | Spielername |
| `sambuca5_hs` | Bestenliste, Top 20 (ECO-hsPut) |
| `sambuca5_lang` | Sprache `de`/`en`/`it` (v0.9.0), gesetzt bei der Sprachwahl vor dem Intro |

- **Gespeichert wird** bei jeder Zustandsänderung (`src/f.tsx:52`).
- **Inkompatibel:** Ist `v` ≠ 5 oder der Stand nicht lesbar, startet ein neues Spiel.
- **Seed:** SAVE-seed steuert alle `hr()`-Zufälle (Ereignisse, Preise, Rivalen). Minispiele nutzen dagegen `Math.random()`.
- **Zurücksetzen:** „▶ Neues Spiel“ am Spielende, oder die Website-Daten löschen.

## Felder von G

<!-- BEGIN GENERATED:save -->
| ID | Typ |
|---|---|
| `SAVE-v` | `5` |
| `SAVE-seed` | `number` |
| `SAVE-run` | `string` |
| `SAVE-y` | `number` |
| `SAVE-m` | `number` |
| `SAVE-money` | `number` |
| `SAVE-debt` | `number` |
| `SAVE-olives` | `number` |
| `SAVE-oil` | `number` |
| `SAVE-q` | `number` |
| `SAVE-price` | `number` |
| `SAVE-hist` | `number[]` |
| `SAVE-rep` | `number` |
| `SAVE-water` | `boolean` |
| `SAVE-bio` | `boolean` |
| `SAVE-dop` | `boolean` |
| `SAVE-gear` | `boolean` |
| `SAVE-spade` | `number` |
| `SAVE-crew` | `number` |
| `SAVE-wine` | `number` |
| `SAVE-yieldMod` | `number` |
| `SAVE-over` | `boolean` |
| `SAVE-log` | `string[]` |
| `SAVE-groves` | `Grove[]` |
| `SAVE-offers` | `Offer[]` |
| `SAVE-cur` | `string[]` |
| `SAVE-queue` | `[number, string][]` |
| `SAVE-used` | `string[]` |
| `SAVE-pick` | `Record<string, number>` |
| `SAVE-res` | `Record<string, string>` |
| `SAVE-goalDone` | `boolean[]` |
| `SAVE-stats` | `Stats` |
| `SAVE-tot` | `Stats` |
| `SAVE-rel` | `Record<string, number>` |
| `SAVE-met` | `string[]` |
| `SAVE-talked` | `string[]` |
| `SAVE-acts` | `string[]` |
| `SAVE-deals` | `string[]` |
| `SAVE-fl` | `Record<string, number>` |
| `SAVE-ap` | `number` |
| `SAVE-best` | `number` |
| `SAVE-yhist` | `number[]` |

**Stats-Felder:** `harvest`, `oilMade`, `sold`, `revenue`, `goals`, `n`, `soldM`, `mg`, `met`

**Grove-Felder:** `id`, `name`, `trees`, `cond`, `lease`, `prune`, `fert`, `irr`, `traps`, `harvested`, `x`, `y`

**Flags `g.fl.*` (im Code gefunden):** `agri`, `apb`, `bees`, `carmelaHere`, `cheap`, `dach`, `dog`, `drain`, `early`, `intro_`, `intro_sindaco`, `kamm`, `lyG`, `lyH`, `lyO`, `lyR`, `metM`, `netz`, `office`, `po_`, `pray`, `presse`, `py_`, `sand`, `schneise`, `share`, `trapdisc`, `try_`

**Monats-Sperren `g.acts` (Präfixe):** `enc`, `gift`, `pk`, `sp`

**localStorage-Schlüssel:** `sambuca5_hs`, `sambuca5_lang`, `sambuca5_name`, `sambuca5_save`, `sambuca5_seen`, `sambuca5_sub_`
<!-- END GENERATED:save -->


## v0.9.0
- `G.lang?: "de"|"en"|"it"` – beim Start (`start()` in f.tsx) gesetzt. Beim Laden gilt: `x.lang` aus dem Spielstand vor `sambuca5_lang`. Ältere Stände ohne `lang` laden weiter (Sprache aus `sambuca5_lang`, sonst Sprachwahl). SAVE-v bleibt 5.
- `fl.metM` – absoluter Monat (Jahr·12+Monat) der letzten neuen Bekanntschaft (Regel: max. 1 pro Monat).
- `fl.intro_<id>` – absoluter Monat, in dem der Vitamin-B-Vermittler die Figur `<id>` vorgestellt hat (Perk `vb_<id>`); Perk-Verbrauch wie alle einmaligen Perks über die Perk-Flags.
