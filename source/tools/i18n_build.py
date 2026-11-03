#!/usr/bin/env python3
"""v0.9.0 (FB-37): erzeugt source/game/i18n_dict.tsx.
Ablauf (siehe docs/I18N.md):
 1) TS5=/pfad/typescript node source/tools/i18n_extract.js > strings.json   (alle deutschen Literale + Template-Muster {0})
 2) Maschinelle Rohübersetzung (Argos Translate offline, de→en, en→it) → dict_mt.json {de: [en, it]}
 3) python3 source/tools/i18n_build.py dict_mt.json   → mischt source/tools/i18n_manual.json (handkorrigiert, hat Vorrang)
"""
import json, sys, os
H = os.path.dirname(os.path.abspath(__file__))
mt = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else {}
man = json.load(open(os.path.join(H, 'i18n_manual.json')))
import re
def fix(k, v):
    v = re.sub(r'\$\s?([\d.,]+)', r'\1 €', v)            # MT macht aus € gern $
    if k.startswith('„') and not v.lstrip('“"').startswith(('“','"')) and not v.startswith('“'): v = '“' + v.strip('"“”') + '”'
    return v
GERW = re.compile(r'[äöüßÄÖÜ]|\b(der|die|das|und|ist|nicht|mit|für|auf|ein|eine|zu|kein|Treffer|Sekunden|Bäume)\b')
CSS = re.compile(r'(\d\.?\d*s\b|translate\(|linear|infinite|^\[|^[a-z]+/[a-z]+|^[A-Z]{3,5}$|=)')
mt = {k: [fix(k, v[0]), fix(k, v[1])] for k, v in mt.items() if not CSS.search(k) or GERW.search(k)}
d = dict(mt); d.update(man)
d = {k: v for k, v in sorted(d.items()) if v and v[0] != k or k in man}
with open(os.path.join(H, '..', 'game', 'i18n_dict.tsx'), 'w') as f:
    f.write('// AUTOGENERIERT von source/tools/i18n_build.py – nicht von Hand bearbeiten (Korrekturen in tools/i18n_manual.json)\n')
    f.write('const I18N_DICT: Record<string, [string, string]> = ' + json.dumps(d, ensure_ascii=False, indent=0) + ';\n')
print(len(d), 'Einträge', file=sys.stderr)
