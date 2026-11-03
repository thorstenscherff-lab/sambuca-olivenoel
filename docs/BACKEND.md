# BACKEND – Live-Highscore (v0.8.1, FB-19/OI-007)

Freigegeben von Thorsten am 03.11.2026. Das Spiel bleibt eine statische GitHub-Pages-Seite; nur der Highscore spricht mit Supabase.

## Dienst
- Projekt-URL: `https://aqgigngeksgpbhcdaiar.supabase.co`
- REST-Endpunkt: `/rest/v1/highscores`
- Schlüssel: Publishable Key `sb_publishable_wU2pe73e-cWRpppIgNICpQ_eart3DN5` (öffentlich, darf im Client stehen). Kein Service-Key im Repo.
- Schema: `supabase/001_highscores.sql` (Spalten id, name 1–24 Zeichen, wealth, years 0–200, version ≤ 16, created_at; Index auf wealth desc).
- RLS: `anon` darf nur `select` und `insert`. Kein Update, kein Delete → Einträge lassen sich vom Client weder ändern noch löschen.

## Client (source/game/src/f.tsx)
- `ghsTop()`: `GET ?select=name,wealth,years,version,created_at&order=wealth.desc&limit=20` mit Headern `apikey` und `Authorization: Bearer <key>`.
- `ghsPost(name, wealth, years)`: `POST` mit `Prefer: return=minimal`; Werte werden vor dem Senden auf die Check-Constraints geklemmt; `version = "0.8.1"`.
- Komponente `LiveHS`: zeigt Top 20; mit `subKey` erscheint Namensfeld + „Eintragen“. Gesendet wird nur auf Knopfdruck (Jahresbilanz: `run_y<Jahr>`, Karriere-Ende: `run_end`); erledigt wird in `localStorage` `sambuca5_sub_<subKey>` vermerkt. Der Name wird als `sambuca5_name` gemerkt.
- Offline/Fehler: Hinweis „📴 Offline – es gilt die Liste dieses Geräts“; die lokale Liste `sambuca5_hs` (HSList) bleibt unverändert erhalten. Fehlgeschlagenes Senden zeigt eine Meldung, erneut tippen möglich.

## Grenzen
- Keine Authentifizierung: Einträge sind fälschbar (öffentlicher Insert). Für ein Familienspiel akzeptiert; Abhilfe später z. B. per Edge Function mit Plausibilitätsprüfung.
- Testeinträge: anon kann nicht löschen. QA-Einträge heißen `TEST QA v0.8.1` und müssen im Supabase-Dashboard gelöscht werden.

## Reproduzieren
```bash
curl -s "https://aqgigngeksgpbhcdaiar.supabase.co/rest/v1/highscores?select=*&order=wealth.desc&limit=20" -H "apikey: sb_publishable_wU2pe73e-cWRpppIgNICpQ_eart3DN5"
```
