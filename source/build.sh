#!/usr/bin/env bash
# Reproduzierbarer Build: Quellen -> game.tsx -> Typecheck -> app.js (Repo-Wurzel)
# Aufruf aus dem Repo:  bash source/build.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(dirname "$HERE")"; G="$HERE/game"; H="$HERE/harness"
cd "$H"; [ -d node_modules ] || npm ci --no-audit --no-fund
# 1) Verketten (Reihenfolge ist relevant: Typen/Konstanten vor Nutzung)
cat "$G/imports.tsx" "$G/i18n_dict.tsx" "$G/i18n.tsx" "$G/imgs.tsx" "$G/src/a.tsx" "$G/src/c.tsx" "$G/evs.tsx" "$G/src/d.tsx" "$G/ui_old.tsx" "$G/src/e.tsx" "$G/src/f.tsx" > "$H/game.tsx"
# 2) Typecheck (strict)
npx tsc --noEmit -p .
# 3) Bundle + Minify
npx esbuild main.jsx --bundle --minify --alias:grok/canvas=./shim/grok-canvas.js --jsx=automatic \
  --define:process.env.NODE_ENV='"production"' --outfile="$ROOT/app.js" --log-level=warning
ls -la "$ROOT/app.js"; sha256sum "$ROOT/app.js"
