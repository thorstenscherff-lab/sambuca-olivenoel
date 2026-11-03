// v0.9.0 QA: Logiktest Kontakt-Gating (FB-38/39/40). Aufruf: node source/qa/logic9.mjs (nach build.sh)
import { readFileSync, writeFileSync } from "fs"; import { execSync } from "child_process";
const H = new URL("../harness/", import.meta.url).pathname;
writeFileSync(H + "logic_tmp.tsx", readFileSync(H + "game.tsx", "utf8") + "\nexport { CHARS, gateMiss, gateOk, present, act, newGame, PERKS, abs };\n");
execSync(`npx esbuild logic_tmp.tsx --bundle --platform=node --format=esm --jsx=automatic --alias:grok/canvas=./shim/grok-canvas.js --outfile=/tmp/logic9.mjs --log-level=error`, { cwd: H });
const M = await import("/tmp/logic9.mjs"); const { CHARS, gateOk, gateMiss, act, newGame, PERKS, abs } = M;
const out = {}; let g = newGame([]);
out.total = CHARS.length;
out.month1_reachable = CHARS.filter((c) => gateOk(g, c)).map((c) => c.id);
// zwei Kennenlernen im selben Monat
const r1 = out.month1_reachable.filter((id) => !g.met.includes(id));
let g1 = act(g, { k: "meet", id: r1[0], f: 1 }); let g2 = act(g1, { k: "meet", id: r1[1], f: 1 });
out.meet1 = g1.met.includes(r1[0]); out.meet2_blocked = !g2.met.includes(r1[1]); out.meet2_log = g2.log[0];
// Vitamin-B: vb-Figuren sind ohne Vorstellung gesperrt
const vb = CHARS.filter((c) => c.vb); const late = { ...g, y: 5, m: 0, rep: 90 };
out.vb_chars = vb.map((c) => `${c.id}<-${c.vb[0]}@${c.vb[1]}`);
out.vb_locked_without_intro = vb.every((c) => !gateOk(late, c)); out.vb_miss_example = gateMiss(late, vb[0]);
const c = vb[0]; const withIntro = { ...late, fl: { ...late.fl, ["intro_" + c.id]: abs(late) } };
out.vb_unlocked_with_intro = gateOk(withIntro, c);
out.vb_perks = PERKS.filter((p) => p.id.startsWith("vb_")).map((p) => p.id);
console.log(JSON.stringify(out, null, 1));
