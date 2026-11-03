# BACKEND – Live-Highscore (seit v0.8.1, FB-19/OI-007; Stand v0.8.2)

Freigegeben von Thorsten am 03.11.2026. Das Spiel bleibt eine statische GitHub-Pages-Seite; nur der Highscore spricht mit Supabase.

## Dienst
- Projekt-URL: `https://aqgigngeksgpbhcdaiar.supabase.co`
- REST-Endpunkt: `/rest/v1/highscores`
- Schlüssel: Publishable Key `sb_publishable_wU2pe73e-cWRpppIgNICpQ_eart3DN5` (öffentlich, darf im Client stehen). Kein Service-Key im Repo.
- Schema: `supabase/001_highscores.sql` (Spalten id, name 1–24 Zeichen, wealth, years 0–200, version ≤ 16, created_at; Index auf wealth desc).
- RLS: `anon` darf nur `select` und `insert`. Kein Update, kein Delete → Einträge lassen sich vom Client weder ändern noch löschen.

## Client (source/game/src/f.tsx)
- `ghsTop()`: `GET ?select=name,wealth,years,version,created_at&order=wealth.desc&limit=20` mit Headern `apikey` und `Authorization: Bearer <key>`.
- `ghsPost(name, wealth, years)`: `POST` mit `Prefer: return=minimal`; Werte werden vor dem Senden auf die Check-Constraints geklemmt; `version = GAME_V` (seit v0.8.2 „0.8.2“).
- Komponente `LiveHS`: zeigt Top 20; mit `subKey` erscheint Namensfeld + „Eintragen“. Gesendet wird nur auf Knopfdruck (Jahresbilanz: `run_y<Jahr>`, Karriere-Ende: `run_end`); erledigt wird in `localStorage` `sambuca5_sub_<subKey>` vermerkt. Der Name wird als `sambuca5_name` gemerkt.
- Offline/Fehler: Hinweis „📴 Offline – es gilt die Liste dieses Geräts“; die lokale Liste `sambuca5_hs` (HSList) bleibt unverändert erhalten. Fehlgeschlagenes Senden zeigt eine Meldung, erneut tippen möglich.

## Grenzen
- Keine Authentifizierung: Einträge sind fälschbar (öffentlicher Insert). Für ein Familienspiel akzeptiert; Abhilfe später z. B. per Edge Function mit Plausibilitätsprüfung.
- Testeinträge: anon kann nicht löschen. QA-Einträge heißen `TEST QA v<Version>` und müssen im Supabase-Dashboard gelöscht werden. Der Eintrag `TEST QA v0.8.1` wurde von Thorsten am 03.11.2026 gelöscht. Die v0.8.2-QA hat keine Einträge gesendet.

## Reproduzieren
```bash
curl -s "https://aqgigngeksgpbhcdaiar.supabase.co/rest/v1/highscores?select=*&order=wealth.desc&limit=20" -H "apikey: sb_publishable_wU2pe73e-cWRpppIgNICpQ_eart3DN5"
```

## Supabase-Setup (ohne Geheimnisse)
| Punkt | Wert |
|---|---|
| Projekt-ID (Ref) | `aqgigngeksgpbhcdaiar` |
| Region | **nicht dokumentiert** – nur im Dashboard sichtbar (Project Settings → General). Nachtragen: OI-045 |
| Organisation | **nicht dokumentiert** – im Dashboard oben links sichtbar. Nachtragen: OI-045 |
| Inhaber | Thorstens Supabase-Konto |
| Tabelle | `public.highscores`, angelegt mit `supabase/001_highscores.sql` (SQL Editor → Run) |
| RLS | aktiviert; Policies nur `select` und `insert` für `anon`; kein `update`/`delete` |
| Client-Schlüssel | Publishable Key (öffentlich, siehe oben). Service-Role-Key und DB-Passwort liegen **nicht** im Repo und nicht in der Doku. |

**Neu aufsetzen:** neues Projekt anlegen → SQL Editor → Inhalt von `supabase/001_highscores.sql` ausführen → Project Settings → API Keys: Publishable Key kopieren → `SB_URL`/`SB_KEY` in `source/game/src/f.tsx` ersetzen → Build (BUILD.md).

**DB-Passwort zurücksetzen:** Dashboard → Project Settings → Database → „Reset database password“. Das Spiel nutzt das Passwort nicht (nur REST mit Publishable Key); ein Reset ändert am Spiel nichts.

**Testeinträge löschen:** Dashboard → Table Editor → `highscores` → Zeile markieren → Delete (oder SQL: `delete from public.highscores where name like 'TEST QA%';`).


**Projekt-Metadaten (abgelesen 03.11.2026):** Region Central EU (Frankfurt), Organisation `thorstenscherff-lab`, Plan FREE, Projektname `sambuca-olivenoel` (Branch main, PRODUCTION). OI-045 erledigt.
