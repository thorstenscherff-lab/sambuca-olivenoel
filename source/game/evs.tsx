const EVS: EvDef[] = [
  // ---------- Zufalls-Ereignisse ----------
  { id: "frost", dis: true, icon: "❄️", t: "Nachtfrost angesagt", months: [0, 1, 11], text: "−4 °C über dem Belice-Tal. Junge Triebe sind in Gefahr.", ch: [
    { l: "Vlies über die Bäume", d: "1 €/Baum, sicher", f: (g) => { pay(g, trees(g)); return `Vlies gespannt (−${eur(trees(g))}). Kein Schaden.`; } },
    { l: "Feuertonnen mit Turi teilen", d: "200 €, Turi ♥+8, 20 %: −8 %", f: (g, r) => { pay(g, 200); const s = rel(g, "turi", 8); if (r < 0.2) { condAll(g, -8); return "Halbe Nacht, halber Schutz: −8 %." + s; } return "Die ganze Nacht am Feuer – Turi erzählt Geschichten." + s; } },
    { l: "Risiko eingehen", d: "50 %: alle Haine −15 %", f: (g, r) => { if (r < 0.5) { condAll(g, -15); return "Frost! Alle Haine −15 %."; } return "Glück gehabt – nur Raureif."; } }] },
  { id: "hagel", dis: true, icon: "🌩️", t: "Hagel über dem Monte Genuardo", months: [3, 4, 5], text: "Schwarze Wolken ziehen auf. Eine Versicherung kostet 250 €.", ch: [
    { l: "Versichern (250 €)", d: "kein Risiko", f: (g) => { pay(g, 250); return "Versichert. Der Hagel zieht vorbei – das Geld ist trotzdem weg."; } },
    { l: "Padre Vito um ein Gebet bitten", d: "gratis, Padre ♥+4, 35 %: −12 %", f: (g, r) => { const s = rel(g, "padre", 4); if (r < 0.35) { condAll(g, -12); return "Der Himmel hatte andere Pläne: −12 %." + s; } return "Der Hagel trifft nur das Nachbartal. Miracolo!" + s; } },
    { l: "Ohne Versicherung", d: "50 %: alle Haine −12 %", f: (g, r) => { if (r < 0.5) { condAll(g, -12); return "Hagel! Alle Haine −12 %."; } return "Glück gehabt."; } }] },
  { id: "blogger", icon: "📸", t: "Foodbloggerin aus Mailand", months: ALL, text: "Giulia (480.000 Follower) will dein Öl probieren – gute Qualität macht dich berühmt, schlechte blamiert dich.", ch: [
    { l: "10 l Probe schicken", d: "ab Qualität 60 lohnt es", ok: (g) => g.oil >= 10, f: (g) => { g.oil -= 10; if (g.q >= 60) { repAdd(g, 12); return "Begeisterte Story! Ansehen +12."; } repAdd(g, -4); return "„Ganz okay …“ – Ansehen −4."; } },
    { l: "Führung durch die Vicoli Saraceni", d: "100 €, Chiara ♥+6, ★ +5", f: (g) => { pay(g, 100); repAdd(g, 5); return "Giulia filmt die sieben Gassen. Viral!" + rel(g, "chiara", 6); } },
    { l: "Lieber nicht", d: "★ −1", f: (g) => { repAdd(g, -1); return "Giulia fährt weiter nach Menfi."; } }] },
  { id: "kontrolle", icon: "🏛️", t: "Kontrolle der Forstbehörde", months: ALL, text: "Ein Beamter will Katasterpläne, Pflanzenschutz-Register und Arbeitsverträge sehen.", ch: [
    { l: "Geometra bezahlen (400 €)", d: "sauber, ★ +3", f: (g) => { pay(g, 400); repAdd(g, 3); return "Alles korrekt. Der Beamte nickt anerkennend."; } },
    { l: "Den Sindaco anrufen", d: "Sindaco ♥ ≥ 50 nötig", ok: (g) => R(g, "sindaco") >= 50, f: (g) => "Ein Anruf, ein Espresso – der Beamte fährt freundlich weiter." + rel(g, "sindaco", -3) },
    { l: "Selbst durchwursteln", d: "50 %: 600 € Strafe", f: (g, r) => { if (r < 0.5) { pay(g, 600); repAdd(g, -3); return "Formfehler! 600 € Strafe."; } return "Glück gehabt, alles durchgegangen."; } }] },
  { id: "touristen", icon: "🚌", t: "Reisebus aus Palermo", months: [3, 5, 6, 7, 9], text: "45 Tourist:innen suchen ein „echtes Erlebnis“. Eine Verkostung im Hain bringt Spitzenpreise.", ch: [
    { l: "Verkostung (−150 €)", d: "bis 60 l zu 160 %", ok: (g) => g.oil > 0, f: (g) => { pay(g, 150); repAdd(g, 4); return "Verkostung! " + sellAt(g, 60, 1.6, "Tourist:innen") + rel(g, "chiara", 4); } },
    { l: "Zu Nonna Pina schicken", d: "Minni di Virgini, Nonna ♥+6, +120 €", f: (g) => { g.money += 120; return "Die Tourist:innen kaufen Nonnas komplettes Gebäck." + rel(g, "nonna", 6); } },
    no("Keine Zeit")] },
  { id: "duerre", dis: true, icon: "☀️", t: "Dürre-Warnung", months: [5, 6, 7], text: "Seit sechs Wochen kein Regen. Ohne Wasser verlieren die Bäume ihre Früchte.", ch: [
    { l: "Tankwagen bestellen", d: "1 €/Baum, alle geschützt", f: (g) => { pay(g, trees(g)); return `Tankwagen rollt an (−${eur(trees(g))}).`; } },
    { l: "Auf Regen hoffen", d: "70 %: ungeschützte Haine −20 %", f: (g, r) => { if (r < 0.7 && !g.water) { condAll(g, -20, (x) => !x.irr); return "Kein Regen. Ungeschützte Haine −20 %."; } return g.water ? "Dein Wasserrecht am Lago rettet dich." : "Ein Gewitter in letzter Minute!"; } }] },
  { id: "fliege", icon: "🪰", t: "Olivenfliege im Anflug", months: [6, 7, 8], dis: true, text: "Die Nachbarn melden Larven in den Früchten. Fallen helfen vorbeugend – oder du jagst sie selbst.", ch: [
    { l: "Kaolin spritzen", d: "1,50 €/Baum", f: (g) => { const c = Math.round(trees(g) * 1.5); pay(g, c); return `Weiße Bäume, gesunde Oliven (−${eur(c)}).`; } },
    { l: "🎮 Fliegen jagen", d: "Minispiel: Haine ohne Fallen bis −20 %", mg: "fliege", f: (g, r, s) => { const d = Math.round(20 * (1 - s)); condAll(g, -d, (x) => !x.traps); return g.groves.every((x) => x.traps) ? "Deine Fallen halten die Fliege fern." : `Haine ohne Fallen −${d} %.`; } },
    { l: "Abwarten", d: "Haine ohne Fallen −20 %", f: (g) => { condAll(g, -20, (x) => !x.traps); return g.groves.every((x) => x.traps) ? "Deine Fallen halten die Fliege fern." : "Befall! Haine ohne Fallen −20 %."; } }] },
  { id: "wild", dis: true, icon: "🐗", t: "Wildschweine aus dem Bosco", months: [8, 9, 10], text: "Nachts wühlt eine Rotte in den Hainen.", ch: [
    { l: "Zaun bauen (300 €)", d: "sicher", f: (g) => { pay(g, 300); return "Der Zaun hält."; } },
    { l: "Die Jäger von Adragna rufen", d: "Wurst als Lohn, ★ +2, 30 %: −6 %", f: (g, r) => { repAdd(g, 2); if (r < 0.3) { condAll(g, -6); return "Die Jäger kommen eine Nacht zu spät: −6 %."; } return "Salsiccia di cinghiale für alle!"; } },
    { l: "Riskieren", d: "60 %: alle Haine −10 %", f: (g, r) => { if (r < 0.6) { condAll(g, -10); return "Verwüstung! −10 %."; } return "Die Rotte zieht weiter."; } }] },
  { id: "cousin", icon: "🧑‍🦱", t: "Cousin Peppe braucht Geld", months: ALL, text: "„500 € – nur bis nächstes Jahr, giuro!“", ch: [
    { l: "Leihen (500 €)", d: "★ +6", f: (g) => { pay(g, 500); repAdd(g, 6); return "Peppe umarmt dich. Das ganze Dorf weiß davon."; } },
    { l: "Er soll bei der Ernte helfen", d: "gratis, Crew-Chance", f: (g, r) => { if (r < 0.5) { g.crew = Math.max(g.crew, 1); return "Peppe bringt drei Freunde mit – Ernte-Crew gesichert!"; } return "Peppe verspricht es … und verschwindet nach Palermo."; } },
    { l: "Ablehnen", d: "★ −3", f: (g) => { repAdd(g, -3); return "Peppe ist beleidigt."; } }] },
  { id: "mailand", icon: "🚚", t: "Großhändler aus Mailand", months: [1, 2, 3, 5, 6, 7, 11], text: "Ein Einkäufer will heute dein ganzes Öl – zu 120 % des Marktpreises.", ch: [
    { l: "Alles verkaufen (120 %)", d: "sofort Geld", ok: (g) => g.oil > 0, f: (g) => sellAt(g, g.oil, 1.2, "den Mailänder Großhandel") },
    no("Ablehnen")] },
  { id: "palermo", icon: "🎄", t: "Weihnachtsmarkt in Palermo", months: [11], text: "Ein Stand an der Via Maqueda kostet 250 €.", ch: [
    { l: "Stand (250 €)", d: "bis 120 l zu 170 %, ★ +5", ok: (g) => g.oil > 0, f: (g) => { pay(g, 250); repAdd(g, 5); return "Buon Natale! " + sellAt(g, 120, 1.7, "Weihnachtsmarkt-Gäste"); } },
    no("Zuhause bleiben")] },
  { id: "novello", icon: "🫒", t: "Olio-Novello-Hype", months: [10], text: "Alle wollen frisches, grünes Öl. Werbung bei Radio Sambuca kostet 200 €.", ch: [
    { l: "Radio-Jingle (200 €)", d: "★ +6", f: (g) => { pay(g, 200); repAdd(g, 6); return "Radio Sambuca spielt deinen Jingle in Dauerschleife."; } },
    { l: "Novello-Abend in Salvos Bar", d: "bis 40 l zu 150 %, Salvo ♥+6", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 40, 1.5, "Salvos Gäste") + rel(g, "salvo", 6) },
    no("Nichts tun")] },
  { id: "bluete", icon: "🌸", t: "Traumwetter zur Blüte", months: [2, 3, 4], text: "Die Bäume blühen wie seit Jahren nicht. Eine Extra-Düngung könnte das nutzen.", ch: [
    { l: "Extra-Dünger (1 €/Baum)", d: "Ertrag +15 %", f: (g) => { pay(g, trees(g)); g.yieldMod += 0.15; return "Die Ernte-Prognose steigt um 15 %."; } },
    { l: "Einfach freuen", d: "Ertrag +6 %", f: (g) => { g.yieldMod += 0.06; return "Die Bienen summen."; } }] },
  { id: "scirocco", dis: true, icon: "🌬️", t: "Scirocco aus Afrika", months: [5, 6, 7], text: "Heißer Wind mit rotem Sand. 42 °C im Schatten.", ch: [
    { l: "Nachts extra wässern", d: "0,80 €/Baum", f: (g) => { const c = Math.round(trees(g) * 0.8); pay(g, c); return `Die Bäume überstehen den Scirocco (−${eur(c)}).`; } },
    { l: "Durchhalten", d: "Haine ohne Bewässerung −10 %", f: (g) => { condAll(g, -10, (x) => !x.irr && !g.water); return "Die Blätter rollen sich ein."; } }] },
  { id: "diebe", icon: "🔦", t: "Olivendiebe unterwegs", months: [9, 10], text: "In Contrada Misilifurmi fehlen über Nacht ganze Bäume voller Oliven.", ch: [
    { l: "Nachtwache (200 €)", d: "sicher", f: (g) => { pay(g, 200); return "Deine Wache sieht nur Füchse."; } },
    { l: "Salvo hört sich um", d: "Salvo ♥ ≥ 40, ★ +3", ok: (g) => R(g, "salvo") >= 40, f: (g) => { repAdd(g, 3); return "Salvo kennt den Schwager des Diebes. Die Oliven bleiben, wo sie sind." + rel(g, "salvo", 3); } },
    { l: "Wird schon gutgehen", d: "40 %: Ertrag −15 %", f: (g, r) => { if (r < 0.4) { g.yieldMod -= 0.15; return "Bestohlen! Ertrag −15 %."; } return "Diesmal trifft es andere."; } }] },
  { id: "traktor", icon: "🚜", t: "Der alte Fiat-Traktor streikt", months: [0, 1, 2, 3], text: "Kupplung durch. Ohne Traktor wird jede Arbeit teurer.", ch: [
    { l: "Reparieren (450 €)", d: "sicher", f: (g) => { pay(g, 450); return "Der Fiat brummt wieder."; } },
    { l: "Turi um seinen bitten", d: "gratis, Turi ♥ ≥ 35", ok: (g) => R(g, "turi") >= 35, f: (g) => "Turi leiht ihn dir – mit einem langen Vortrag über Pflege." + rel(g, "turi", 5) },
    { l: "Ohne Traktor weiter", d: "alle Haine −6 %", f: (g) => { condAll(g, -6); return "Alles dauert doppelt so lange."; } }] },
  { id: "zeitung", icon: "📰", t: "Giornale di Sicilia will ein Interview", months: ALL, text: "„Junge Rückkehrer retten die Olivenhaine“ – du sollst das Titelgesicht sein.", ch: [
    { l: "Interview im Hain", d: "★ +6", f: (g) => { repAdd(g, 6); return "Großes Foto vor der Torre di Pandolfina."; } },
    { l: "Den Sindaco mitbringen", d: "★ +4, Sindaco ♥+10", f: (g) => { repAdd(g, 4); return "Der Sindaco redet 80 % der Zeit. Er liebt dich dafür." + rel(g, "sindaco", 10); } },
    no("Kein Interesse")] },
  { id: "rezept", icon: "🍪", t: "Nonnas Geheimrezept", months: [0, 1, 2, 9], text: "Nonna Pina will Olivenöl-Kekse backen und in Salvos Bar verkaufen – mit deinem Öl.", ch: [
    { l: "20 l Öl beisteuern", d: "+350 €, Nonna ♥+10, Salvo ♥+4", ok: (g) => g.oil >= 20, f: (g) => { g.oil -= 20; g.money += 350; return "„Biscotti della Nonna“ sind ausverkauft!" + rel(g, "nonna", 10) + rel(g, "salvo", 4); } },
    { l: "Lieber nicht", d: "Nonna ♥−6", f: (g) => "Nonna schaut dich lange an. Sehr lange." + rel(g, "nonna", -6) }] },
  { id: "wette", icon: "⚽", t: "Salvos Wette: Palermo gegen Catania", months: ALL, text: "Die ganze Bar wettet aufs Derby. Salvo hält die Kasse.", ch: [
    { l: "200 € auf Palermo", d: "50 %: +400 €", f: (g, r) => { if (r < 0.5) { g.money += 200; return "Forza Palermo! +200 € Gewinn." + rel(g, "salvo", 3); } pay(g, 200); return "Catania gewinnt. Die Bar schweigt."; } },
    { l: "Runde für alle ausgeben", d: "120 €, Salvo ♥+8, ★ +2", f: (g) => { pay(g, 120); repAdd(g, 2); return "Du bist der Held des Abends." + rel(g, "salvo", 8); } },
    no("Nicht wetten")] },
  { id: "studis", icon: "🎒", t: "Freiwillige aus Erasmus", months: [1, 2, 3, 4], text: "Sechs Studierende aus Lyon wollen gegen Kost und Logis im Hain arbeiten.", ch: [
    { l: "Aufnehmen (250 € Essen)", d: "alle Haine +8 %", f: (g) => { pay(g, 250); condAll(g, 8); return "Es wird gelacht, gegraben und geschnitten."; } },
    no("Absagen")] },
  { id: "strom", icon: "⚡", t: "Stromausfall im Frantoio", months: [9, 10], text: "Rosalias Presse steht. Die Oliven in den Kisten fangen an zu gären.", ch: [
    { l: "Generator mieten (300 €)", d: "Rosalia ♥+12", f: (g) => { pay(g, 300); return "Die Presse läuft wieder – Rosalia vergisst dir das nie." + rel(g, "rosalia", 12); } },
    { l: "Warten", d: "Qualität −8", f: (g) => { g.q = Math.max(0, g.q - 8); return "Zwei Tage Pause. Das Öl wird etwas schlechter."; } }] },
  { id: "regen", dis: true, icon: "🌧️", t: "Dauerregen zur Ernte", months: [9, 10], text: "Die Wege in die Contrade sind Matsch. Pflücken im Regen schadet den Früchten.", ch: [
    { l: "Warten, bis es trocknet", d: "Ertrag −5 %, Qualität bleibt", f: (g) => { g.yieldMod -= 0.05; return "Eine Woche Pause – aber saubere Oliven."; } },
    { l: "Trotzdem pflücken", d: "Qualität −6", f: (g) => { g.q = Math.max(0, g.q - 6); return "Schlammige Kisten, müde Leute."; } }] },
  { id: "japan", icon: "🗾", t: "E-Mail aus Tokio", months: ALL, text: "Ein Feinkosthändler in Ginza sucht sizilianisches Premium-Öl. Nur Qualität ≥ 70.", ch: [
    { l: "50 l zu 200 %", d: "Qualität ≥ 70", ok: (g) => g.oil >= 50 && g.q >= 70, f: (g) => { repAdd(g, 6); return "Arigatō! " + sellAt(g, 50, 2, "Ginza Fine Foods"); } },
    no("Absagen")] },
  { id: "hochzeit", icon: "💍", t: "Hochzeit in der Matrice", months: [5, 6, 8], text: "Die Tochter des Apothekers heiratet. 300 Gäste – Gastgeschenk: kleine Ölflaschen.", ch: [
    { l: "40 l als Gastgeschenk", d: "zu 140 %, ★ +4", ok: (g) => g.oil >= 40, f: (g) => { repAdd(g, 4); return sellAt(g, 40, 1.4, "das Brautpaar"); } },
    { l: "Hingehen & tanzen", d: "50 € Geschenk, Padre ♥+4, Sindaco ♥+4", f: (g) => { pay(g, 50); return "Du tanzt die Tarantella bis 4 Uhr." + rel(g, "padre", 4) + rel(g, "sindaco", 4); } }] },
  { id: "kurs", icon: "✂️", t: "Schnittkurs vom Meister", months: [0, 1, 11], text: "Ein Agronom aus Castelvetrano zeigt, wie man Nocellara richtig schneidet.", ch: [
    { l: "Teilnehmen (200 €)", d: "alle Haine +6 %, Ertrag +5 %", f: (g) => { pay(g, 200); condAll(g, 6); g.yieldMod += 0.05; return "Du schneidest jetzt wie ein Profi."; } },
    no("Kein Bedarf")] },
  { id: "rai", icon: "📺", t: "RAI-Sendung „Linea Verde“", months: [3, 5, 6, 8, 9], text: "Das Fernsehen dreht im Belice. Sie suchen einen Hain mit Postkartenblick.", ch: [
    { l: "Drehgenehmigung geben", d: "★ +10 bei Zustand ≥ 60, sonst −3", f: (g) => { const ok = g.groves.some((x) => x.cond >= 60); repAdd(g, ok ? 10 : -3); return ok ? "Primetime! Ganz Italien sieht deinen Hain." : "Die Kamera zeigt vor allem Unkraut …"; } },
    { l: "An Chiara weiterreichen", d: "Chiara ♥+8", f: (g) => "Chiara organisiert den Dreh am Belvedere." + rel(g, "chiara", 8) }] },
  { id: "xylella", dis: true, icon: "🦠", t: "Xylella-Gerücht", months: [4, 5, 6], text: "In Salvos Bar heißt es, das Bakterium sei in der Provinz angekommen.", ch: [
    { l: "Labortest (300 €)", d: "★ +3, Ruhe", f: (g) => { pay(g, 300); repAdd(g, 3); return "Negativ. Du hängst das Zertifikat in die Bar."; } },
    { l: "Gerücht ignorieren", d: "★ −2", f: (g) => { repAdd(g, -2); return "Die Kund:innen fragen nervös nach."; } }] },
  { id: "hund", icon: "🐕", t: "Ein streunender Hund", months: ALL, text: "Ein Mischling folgt dir seit Tagen durch die Vicoli. Alle nennen ihn Peppino.", ch: [
    { l: "Adoptieren (60 €)", d: "★ +2, Wachhund", f: (g) => { pay(g, 60); repAdd(g, 2); g.fl.dog = 1; return "Peppino bewacht ab sofort den Hain."; } },
    no("Weiterlaufen")] },
  { id: "imu", icon: "🧾", t: "Bescheid vom Finanzamt", months: [5, 6, 11], text: "Grundsteuer auf deine Haine: 380 €. Oder Einspruch?", ch: [
    { l: "Zahlen (380 €)", d: "sauber", f: (g) => { pay(g, 380); return "Bezahlt."; } },
    { l: "Einspruch", d: "50 %: 0 € · 50 %: 600 €", f: (g, r) => { if (r < 0.5) return "Einspruch durch! Nichts zu zahlen."; pay(g, 600); return "Abgelehnt, mit Zuschlag: −600 €."; } }] },
  { id: "dop", icon: "🏅", t: "Prüfer für DOP Val di Mazara", months: [1, 2, 3, 6, 7], text: "Mit dem DOP-Siegel bekommt dein Öl dauerhaft 8 % mehr.", ch: [
    { l: "Zertifizieren (1.000 €)", d: "+8 % Preis, ★ +3", ok: (g) => !g.dop && g.money >= 1000, f: (g) => { pay(g, 1000); g.dop = true; repAdd(g, 3); return "DOP Val di Mazara! Das Siegel klebt auf jeder Flasche."; } },
    no("Später")] },
  { id: "bank", icon: "🏦", t: "Die Sicilbanca ruft an", months: [2, 3, 6, 7], text: "Direttore Mangiapane bietet einen Kredit zu Sonderzinsen – oder will eine Spende fürs Fest.", ch: [
    { l: "5.000 € Kredit nehmen", d: "1 % Zins/Monat", ok: (g) => g.debt < 15000, f: (g) => { g.debt += 5000; g.money += 5000; return "Geld auf dem Konto."; } },
    { l: "Spende fürs Fest (150 €)", d: "★ +3", f: (g) => { pay(g, 150); repAdd(g, 3); return "Dein Name steht auf dem Festplakat."; } },
    no("Auflegen")] },
  // ---------- Story-Ketten ----------
  { id: "turi1", icon: "🗣️", t: "Turi redet schlecht über dein Öl", months: [1, 2, 3, 5, 6], who: "turi", text: "Salvo flüstert: „Turi erzählt in der Bar, dein Öl sei gepanscht.“", ch: [
    { l: "Ihn öffentlich zur Rede stellen", d: "★ +3, Turi ♥−15, Fortsetzung …", f: (g) => { repAdd(g, 3); later(g, 2, "turi2"); return "Laut wird es auf der Piazza della Vittoria." + rel(g, "turi", -15); } },
    { l: "Auf einen Caffè einladen", d: "Turi ♥+12, Salvo ♥+3", f: (g) => "Zwei Sturköpfe, ein Tisch – am Ende lacht sogar Turi." + rel(g, "turi", 12) + rel(g, "salvo", 3) },
    { l: "Ignorieren", d: "★ −3, Fortsetzung …", f: (g) => { repAdd(g, -3); later(g, 2, "turi2"); return "Das Gerede geht weiter."; } }] },
  { id: "turi2", icon: "🔧", t: "Sabotage am Bewässerungsschlauch", months: [], who: "turi", text: "Jemand hat deinen Schlauch zerschnitten. Reifenspuren führen zu Turis Hang.", ch: [
    { l: "Carabinieri rufen", d: "Turi ♥−10, ★ +2", f: (g) => { repAdd(g, 2); condAll(g, -5); return "Protokoll, Fotos, Ärger. Der Schaden bleibt: −5 %." + rel(g, "turi", -10); } },
    { l: "Padre Vito vermitteln lassen", d: "Padre ♥ ≥ 40, Turi ♥+20", ok: (g) => R(g, "padre") >= 40, f: (g) => { later(g, 3, "turi3"); return "Nach der Messe reichen sich Turi und du die Hand. Halbwegs." + rel(g, "turi", 20); } },
    { l: "Selbst flicken (150 €)", d: "still bleiben", f: (g) => { pay(g, 150); return "Neuer Schlauch. Du merkst dir das."; } }] },
  { id: "turi3", icon: "🤝", t: "Turi will gemeinsam mahlen", months: [], who: "turi", text: "„Mahlen wir zusammen bei Rosalia, dann zahlt jeder die Hälfte.“", ch: [
    { l: "Einschlagen", d: "Mahlgebühr −50 %", f: (g) => { deal(g, "coop"); return "Handschlag. Ein wackeliger Frieden." + rel(g, "turi", 10); } },
    no("Ablehnen")] },
  { id: "klaus1", need: (g) => g.met.includes("klaus"), icon: "🏡", t: "Klaus will ein Agriturismo", months: [0, 1, 2, 3], who: "klaus", text: "„Dein alter Casale in Pandolfina – daraus mach ma a Agriturismo! Du die Oliven, ich die Gäste.“", ch: [
    { l: "Partner werden (1.000 € Einlage)", d: "Fortsetzung in 2 Monaten", ok: (g) => g.money >= 1000, f: (g) => { pay(g, 1000); later(g, 2, "klaus2"); return "Klaus öffnet eine Flasche Weißbier. Aus München mitgebracht." + rel(g, "klaus", 15); } },
    { l: "Erst mal nur Kaffee", d: "Klaus ♥+5", f: (g) => "Klaus erzählt zwei Stunden von Bad Tölz." + rel(g, "klaus", 5) },
    no("Kein Interesse")] },
  { id: "klaus2", icon: "📐", t: "Die Baugenehmigung hakt", months: [], who: "sindaco", text: "Das Bauamt im Palazzo dell'Arpa blockiert den Umbau. Klaus ist verzweifelt.", ch: [
    { l: "Mit dem Sindaco reden", d: "Sindaco ♥ ≥ 50", ok: (g) => R(g, "sindaco") >= 50, f: (g) => { later(g, 2, "klaus3"); return "Ein Stempel, ein Händedruck." + rel(g, "sindaco", 3); } },
    { l: "Geometra einschalten (600 €)", d: "sicher", f: (g) => { pay(g, 600); later(g, 2, "klaus3"); return "Papierkram erledigt."; } },
    { l: "Aufgeben", d: "Einlage verloren", f: (g) => "Klaus fliegt enttäuscht nach München." + rel(g, "klaus", -15) }] },
  { id: "klaus3", icon: "🎉", t: "Eröffnung: Agriturismo Pandolfina", months: [], who: "klaus", text: "Lichterketten, Caponata, die Banda spielt. Die ersten Gäste aus Deutschland sind da.", ch: [
    { l: "Mit Öl-Verkostung eröffnen", d: "+250 €/Monat, ★ +6", f: (g) => { deal(g, "agri"); repAdd(g, 6); return "DEAL: Agriturismo läuft – jeden Monat Einnahmen." + rel(g, "klaus", 10); } },
    { l: "Stille Teilhaberschaft", d: "+200 €/Monat", f: (g) => { deal(g, "agri"); g.fl.agri = 200; return "DEAL: Agriturismo läuft."; } }] },
  { id: "export2", icon: "📦", t: "Bestellung aus München", months: [], who: "klaus", text: "Klaus' Spezl will dein Öl für sein Feinkostgeschäft am Viktualienmarkt.", ch: [
    { l: "150 l zu 160 %", d: "Qualität ≥ 55", ok: (g) => g.oil >= 150 && g.q >= 55, f: (g) => { deal(g, "export"); repAdd(g, 5); return "DEAL: Export nach München! " + sellAt(g, 150, 1.6, "Feinkost München"); } },
    { l: "50 l zu 150 %", d: "kleine Menge", ok: (g) => g.oil >= 50, f: (g) => { deal(g, "export"); return "DEAL: Export! " + sellAt(g, 50, 1.5, "Feinkost München"); } },
    no("Kein Öl übrig")] },
  { id: "sindaco1", need: (g) => g.met.includes("sindaco"), icon: "🗳️", t: "Der Sindaco braucht Unterstützer", months: [0, 1, 2], who: "sindaco", text: "Für einen EU-Antrag „Strada dell'Olio Terre Sicane“ braucht er Betriebe, die mitmachen.", ch: [
    { l: "Unterschreiben & mitplanen", d: "Sindaco ♥+15, Fortsetzung …", f: (g) => { later(g, 3, "sindaco2"); return "Dein Betrieb steht im Antrag." + rel(g, "sindaco", 15); } },
    no("Politik? Nein danke")] },
  { id: "sindaco2", icon: "💶", t: "EU-Topf bewilligt!", months: [], who: "sindaco", text: "Die Strada dell'Olio kommt. Wer mitgemacht hat, bekommt Geld für Schilder & Verkostungen.", ch: [
    { l: "Geld abholen", d: "+1.800 €, ★ +4", f: (g) => { g.money += 1800; repAdd(g, 4); return "+1.800 € Fördermittel!"; } },
    { l: "In die Strada investieren", d: "Tourismus-Deal, ★ +6", f: (g) => { deal(g, "tour"); repAdd(g, 6); return "DEAL: Dein Hain wird Station der Strada dell'Olio." + rel(g, "chiara", 8); } }] },
  { id: "padre1", icon: "⛪", t: "Das Dach der Matrice leckt", months: [0, 1, 2], who: "padre", text: "Padre Vito sammelt für die Reparatur der Chiesa Madre – rechtzeitig vor der Madonna dell'Udienza.", ch: [
    { l: "Großzügig spenden (500 €)", d: "Padre ♥+20, Ehre im Mai …", f: (g) => { pay(g, 500); g.fl.dach = 1; repAdd(g, 4); return "Dein Name auf der Spendertafel." + rel(g, "padre", 20); } },
    { l: "Kleine Spende (100 €)", d: "Padre ♥+6", f: (g) => { pay(g, 100); return "Grazie, figliolo." + rel(g, "padre", 6); } },
    no("Nichts geben")] },
  // ---------- Vendemmia (fest im Kalender) ----------
  { id: "vend1", icon: "🍇", t: "Die Weinlese ruft – deine Crew wackelt", months: [], fest: true, who: "giusi", text: "Die Cantine am Lago Arancio zahlen Lesehelfern 30 % mehr. Deine Leute überlegen zu wechseln – und im Oktober fehlen sie dir für die Oliven.", ch: [
    { l: "Lohn erhöhen (+400 €)", d: "Crew bleibt sicher", ok: (g) => g.crew > 0, f: (g) => { pay(g, 400); return "Die Crew bleibt. Teuer, aber sicher."; } },
    { l: "Crew mit Giusi teilen", d: "Giusi ♥ ≥ 40: Sept. Wein, Okt. Oliven", ok: (g) => R(g, "giusi") >= 40, f: (g) => { g.crew = Math.max(g.crew, 1); g.fl.share = 1; return "Abgemacht: im September lesen sie Trauben, im Oktober Oliven." + rel(g, "giusi", 12); } },
    { l: "Gehen lassen", d: "keine Crew mehr", f: (g) => { g.crew = 0; return "Deine Leute schleppen jetzt Traubenkisten."; } }] },
  { id: "vend2", icon: "🍷", t: "Vendemmia-Chaos", months: [], fest: true, who: "giusi", text: "Die Lese ist spät dran. Giusi braucht deinen Rüttler und zwei Hände – sonst platzen die Trauben.", ch: [
    { l: "Selbst mitlesen (3 Tage)", d: "Giusi ♥+15, Haine −4 %", f: (g) => { condAll(g, -4); return "Lila Hände, Rückenschmerzen, großes Fest am Ende." + rel(g, "giusi", 15); } },
    { l: "Gerät verleihen", d: "Rüttler nötig, +300 €", ok: (g) => g.gear, f: (g) => { g.money += 300; return "Dein Rüttler schafft die Trauben in Rekordzeit." + rel(g, "giusi", 8); } },
    { l: "Wein-Nebenlinie starten (1.200 €)", d: "eigene Etiketten, Verkauf ab Nov.", ok: (g) => g.wine === 0 && g.money >= 1200, f: (g) => { pay(g, 1200); g.wine = 600; return "600 Flaschen „Rosso Pandolfina“ reifen bei Giusi." + rel(g, "giusi", 6); } },
    no("Nicht meine Baustelle")] },
  { id: "vend3", icon: "⏰", t: "Kommt die Crew rechtzeitig zurück?", months: [], fest: true, text: "Die Weinlese zieht sich. Deine Oliven sind reif – jeder Tag Warten kostet Qualität.", ch: [
    { l: "Bonus zahlen, sofort zurück", d: "350 €", ok: (g) => g.crew > 0, f: (g) => { pay(g, 350); return "Die Crew steht am Montag um 6 Uhr im Hain."; } },
    { l: "Abwarten", d: "Glückssache", f: (g, r) => { if (g.fl.share) return "Giusi hält Wort – die Crew ist pünktlich da, mit einer Kiste Wein."; if (g.crew > 0 && r < 0.45) { g.crew = 0; return "Die Crew bleibt bei den Cantine. Du stehst allein da."; } return g.crew ? "Die Crew kommt, zwei Tage zu spät." : "Ohne Crew wird es teuer."; } },
    { l: "Früh ernten, Novello-Qualität", d: "Ertrag −10 %, Qualität +6", f: (g) => { g.yieldMod -= 0.1; g.fl.early = 6; return "Grüne, scharfe Oliven – Top-Novello."; } }] },
];
const FEV: EvDef[] = [
  // Settimana Santa & San Giorgio (April)
  { id: "santa", icon: "✝️", t: "Settimana Santa: Prozession des Cristo Morto", months: [], fest: true, who: "padre", text: "Karfreitag. Die Banda Gian Matteo Rinaldo spielt Trauermärsche, die Addolorata zieht durch den Corso Umberto. Ganz Sambuca ist auf der Straße.", ch: [
    { l: "Mit der Confraternita mitgehen", d: "Padre ♥+12, ★ +4", f: (g) => { repAdd(g, 4); return "Du gehst barfuß hinter dem Kreuz. Die Alten nicken." + rel(g, "padre", 12); } },
    { l: "Die Banda sponsern (300 €)", d: "★ +7, Sindaco ♥+6", f: (g) => { pay(g, 300); repAdd(g, 7); return "„Mit freundlicher Unterstützung von …“ – dein Name auf dem Programm." + rel(g, "sindaco", 6); } },
    { l: "Ostergebäck mit Nonna verkaufen", d: "+220 €, Nonna ♥+6", f: (g) => { g.money += 220; return "Cassatelle und Cuddure gehen weg wie nichts." + rel(g, "nonna", 6); } }] },
  { id: "giorgio", icon: "🐎", t: "San Giorgio: Feldsegnung am 23. April", months: [], fest: true, who: "padre", text: "Der Heilige reitet für die Bauern. Nach der Segnung gibt’s die Zabbinata – frische Ricotta für alle.", ch: [
    { l: "Haine segnen lassen", d: "alle Haine +6 %, Padre ♥+5", f: (g) => { condAll(g, 6); return "Weihwasser auf jedem Baum." + rel(g, "padre", 5); } },
    { l: "Zabbinata mit Turi teilen", d: "Turi ♥+10", f: (g) => "Ricotta, Brot und ein seltenes Lächeln." + rel(g, "turi", 10) },
    { l: "Öl-Stand am Sagrato", d: "bis 40 l zu 140 %", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 40, 1.4, "Festbesucher") }] },
  // Madonna dell'Udienza (Mai) – das größte Fest
  { id: "ud1", icon: "🕯️", t: "Udienza Tag 1: Pilgerweg vom Cellaro", months: [], fest: true, who: "padre", text: "Die Festwoche beginnt: Tausende pilgern nachts vom Cellaro hinauf zum Santuario del Carmine. Die Luminarie gehen an.", ch: [
    { l: "Mitpilgern neben Padre Vito", d: "Padre ♥+10, ★ +4", f: (g) => { repAdd(g, 4); return "Zwei Stunden bergauf, Gespräche über Gott und Oliven." + rel(g, "padre", 10); } },
    { l: "Wasser & Öl-Brot für Pilger (200 €)", d: "★ +8, Chiara ♥+6", f: (g) => { pay(g, 200); repAdd(g, 8); return "Dein Stand ist der beliebteste am Weg." + rel(g, "chiara", 6); } },
    { l: "Mit dem Sindaco im Auto vorfahren", d: "Sindaco ♥+10, ★ −2", f: (g) => { repAdd(g, -2); return "Bequem, aber die Leute reden." + rel(g, "sindaco", 10); } }] },
  { id: "ud2", icon: "🏇", t: "Udienza Tag 4: Palio & Minna Fest", months: [], fest: true, who: "nonna", text: "Der Palio jagt durch die Straßen, auf der Piazza duftet es nach Minni di Virgini. Bester Verkaufstag des Jahres.", ch: [
    { l: "Großer Stand am Corso (350 €)", d: "bis 150 l zu 165 %, ★ +6", ok: (g) => g.oil > 0, f: (g) => { pay(g, 350); repAdd(g, 6); return "Schlange bis zum Teatro L'Idea! " + sellAt(g, 150, 1.65, "Festbesucher"); } },
    { l: "Gemeinschaftsstand mit Nonna", d: "bis 60 l zu 150 %, Nonna ♥+10", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 60, 1.5, "Festbesucher") + rel(g, "nonna", 10) },
    { l: "Auf ein Pferd im Palio setzen", d: "150 €: 30 % → +600 €", f: (g, r) => { if (r < 0.3) { g.money += 450; return "Dein Pferd gewinnt! +450 € netto."; } pay(g, 150); return "Dein Pferd bleibt vor dem Palazzo stehen und frisst Blumen."; } }] },
  { id: "ud3", icon: "💡", t: "Udienza Tag 6: Sponsor der Luminarie", months: [], fest: true, who: "sindaco", text: "Das Festkomitee sucht Sponsoren für die Lichterbögen über dem Corso – dein Name würde eine Woche lang leuchten.", ch: [
    { l: "Hauptsponsor (1.200 €)", d: "★ +15, Sindaco ♥+12, Padre ♥+8", ok: (g) => g.money >= 1200, f: (g) => { pay(g, 1200); repAdd(g, 15); return "„OLIO PANDOLFINA“ in 20.000 Lämpchen!" + rel(g, "sindaco", 12) + rel(g, "padre", 8); } },
    { l: "Ein Lichterbogen (400 €)", d: "★ +6, Sindaco ♥+5", f: (g) => { pay(g, 400); repAdd(g, 6); return "Ein Bogen vor der Bar del Corso trägt deinen Namen." + rel(g, "sindaco", 5); } },
    { l: "Nur zuschauen", d: "gratis", f: () => "Die Lichter sind auch so schön." }] },
  { id: "ud4", icon: "🥂", t: "Udienza Tag 8: Empfang im Palazzo dell'Arpa", months: [], fest: true, who: "klaus", text: "Der Sindaco lädt Honoratioren, Winzer und Gäste aus dem Ausland. Wer hier die richtigen Hände schüttelt, macht das Geschäft des Jahres.", ch: [
    { l: "Klaus & seinen Münchner Spezl treffen", d: "Klaus ♥+15, Export-Anfrage folgt", f: (g) => { later(g, 3, "export2"); return "Weißbier trifft Nocellara. Man tauscht Nummern." + rel(g, "klaus", 15); } },
    { l: "Mit Giusi über Wein & Öl reden", d: "Giusi ♥+15", f: (g) => "Giusi skizziert einen Plan auf einer Serviette: Wein + Öl = Kombi-Kisten." + rel(g, "giusi", 15) },
    { l: "Chiara: Tourismus-Deal sofort", d: "Chiara ♥ ≥ 45", ok: (g) => R(g, "chiara") >= 45 && !g.deals.includes("tour"), f: (g) => { deal(g, "tour"); return "DEAL: Dein Hain kommt auf jede Pro-Loco-Tour." + rel(g, "chiara", 10); } }] },
  { id: "ud5", icon: "🎆", t: "Udienza Finale: La Nisciuta", months: [], fest: true, who: "padre", text: "Mitternacht. Die Madonna verlässt auf dem Fercolo von 1817 das Santuario. Glocken, Tränen, Feuerwerk über dem Lago Arancio. Ganz Sambuca schaut, wer heute in der ersten Reihe steht.", ch: [
    { l: "Den Fercolo mittragen", d: "Padre ♥ ≥ 60 oder Dach-Spende · ★ +14", ok: (g) => R(g, "padre") >= 60 || !!g.fl.dach, f: (g) => { repAdd(g, 14); return "Du trägst die Madonna. Die ganze Stadt sieht es." + rel(g, "padre", 5) + rel(g, "turi", 5); } },
    { l: "Nachtverkauf am Belvedere", d: "bis 80 l zu 150 %", ok: (g) => g.oil > 0, f: (g) => sellAt(g, 80, 1.5, "Nachtschwärmer") },
    { l: "Feuerwerk mit allen in Salvos Bar", d: "100 €, alle ♥+3", f: (g) => { pay(g, 100); CHARS.forEach((c) => { rel(g, c.id, 3); }); return "Die ganze Bar singt. Alle mögen dich ein bisschen mehr."; } }] },
  // August
  { id: "vassalli", icon: "🍝", t: "Festa dei Vassalli (5. August)", months: [], fest: true, who: "nonna", text: "Pasta col Macco für das ganze Viertel. Die Tische stehen mitten in den Vicoli Saraceni.", ch: [
    { l: "Öl für die Riesenpfanne spenden (15 l)", d: "★ +6, Nonna ♥+8", ok: (g) => g.oil >= 15, f: (g) => { g.oil -= 15; repAdd(g, 6); return "Alle fragen, wessen Öl das ist." + rel(g, "nonna", 8); } },
    { l: "Mit Turi am Tisch sitzen", d: "Turi ♥+10", f: (g) => "Bohnen, Wein und alte Geschichten." + rel(g, "turi", 10) },
    no("Zu heiß heute")] },
  { id: "calici", icon: "🌠", t: "Calici di Stelle am Belvedere (10. August)", months: [], fest: true, who: "giusi", text: "Sternschnuppennacht der Strada del Vino Terre Sicane. Winzer schenken aus, das Tal glitzert. Wen sprichst du an?", ch: [
    { l: "Giusi – Wein-Kooperation", d: "Giusi ♥ ≥ 50: DEAL, sonst ♥+12", f: (g) => { if (R(g, "giusi") >= 50 && deal(g, "wine")) return "DEAL: Wein-Kooperation! Crew & Rüttler teilen, Löhne −30 %." + rel(g, "giusi", 8); return "Ein langes Gespräch unter Sternen." + rel(g, "giusi", 12); } },
    { l: "Klaus – Export & Gäste", d: "Klaus ♥+12, Export-Anfrage", f: (g) => { later(g, 2, "export2"); return "Klaus macht Selfies mit jedem Winzer." + rel(g, "klaus", 12); } },
    { l: "Öl-Wein-Pairing-Stand (200 €)", d: "bis 60 l zu 160 %", ok: (g) => g.oil > 0, f: (g) => { pay(g, 200); repAdd(g, 4); return sellAt(g, 60, 1.6, "Weinfreunde"); } }] },
  // September
  { id: "fiera", icon: "🐂", t: "Fiera del Bestiame (21.–22. Sept.)", months: [], fest: true, who: "turi", text: "Der große Viehmarkt: Maultiere, Traktoren, Netze, Rüttler – und alle Bauern des Tals an einem Ort.", ch: [
    { l: "Gebrauchten Rüttler kaufen (1.200 €)", d: "Ernte +15 %, Lohnkosten −50 %", ok: (g) => !g.gear && g.money >= 1200, f: (g) => { pay(g, 1200); g.gear = true; return "Ein Abbacchiatore, kaum benutzt."; } },
    { l: "Erntehelfer anwerben", d: "Lohn zum Messepreis (500 €)", ok: (g) => g.crew === 0, f: (g) => { pay(g, 500); g.crew = 1; return "Eine Crew aus Santa Margherita ist dabei."; } },
    { l: "Bauern-Netzwerk: Turi & Cooperativa", d: "Turi ♥+8, ★ +3", f: (g) => { repAdd(g, 3); return "Man redet über Preise, Wetter und Rosalia." + rel(g, "turi", 8) + rel(g, "rosalia", 5); } }] },
  // Dezember
  { id: "zabut", icon: "🌟", t: "Natale a Sambuca: Krippe in den Vicoli", months: [], fest: true, who: "chiara", text: "Lebende Krippe in den Gassen, Zampognari, Weihnachtsmarkt auf der Piazza. Die Pro Loco sucht Stände.", ch: [
    { l: "Stand mit Geschenk-Kisten", d: "bis 80 l zu 160 %", ok: (g) => g.oil > 0, f: (g) => { repAdd(g, 3); return sellAt(g, 80, 1.6, "Weihnachtsgäste") + rel(g, "chiara", 6); } },
    { l: "Rosso Pandolfina verkaufen", d: "Wein-Nebenlinie", ok: (g) => g.wine > 0, f: (g) => { const e = Math.round(g.wine * 4.2 * (1 + g.rep / 300)); g.money += e; g.wine = 0; return `Alle 600 Flaschen weg: +${eur(e)}!` + rel(g, "giusi", 6); } },
    { l: "Hirte in der Krippe spielen", d: "★ +5, Padre ♥+6", f: (g) => { repAdd(g, 5); return "Du stehst drei Stunden mit einem Schaf in der Kälte." + rel(g, "padre", 6); } }] },
];
EVS.push(...FEV, ...EVX);
const EVM: Record<string, EvDef> = {}; EVS.forEach((e) => { EVM[e.id] = e; });
