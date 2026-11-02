# Spielstand (v0.7.1)

Speicherung erfolgt im Browser per `localStorage`, **nur lokal auf dem Gerät**. Es gibt keinen Server und keine Synchronisation.

| Schlüssel | Inhalt |
|---|---|
| `sambuca5_save` | kompletter Zustand `G` als JSON, Version SAVE-v = 5 |
| `sambuca5_name` | Spielername |
| `sambuca5_hs` | Bestenliste, Top 20 (ECO-hsPut) |

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

**Stats-Felder:** `harvest`, `oilMade`, `sold`, `revenue`, `goals`, `n`, `soldM`, `mg`, `met`

**Grove-Felder:** `id`, `name`, `trees`, `cond`, `lease`, `prune`, `fert`, `irr`, `traps`, `harvested`, `x`, `y`

**Flags `g.fl.*` (im Code gefunden):** `agri`, `apb`, `bees`, `carmelaHere`, `cheap`, `dach`, `dog`, `drain`, `early`, `lyG`, `lyH`, `lyO`, `lyR`, `metM`, `netz`, `po_`, `pray`, `py_`, `sand`, `share`, `trapdisc`, `try_`

**Monats-Sperren `g.acts` (Präfixe):** `enc`, `gift`, `pk`, `sp`

**localStorage-Schlüssel:** `sambuca5_hs`, `sambuca5_name`, `sambuca5_save`
<!-- END GENERATED:save -->
