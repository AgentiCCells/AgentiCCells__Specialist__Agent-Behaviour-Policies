#!/usr/bin/env bash
# Run every gate, then rebase on dev and push. Stops at the first failure. Never pipe a gate.
set -euo pipefail
cd "$(dirname "$0")/.."
# HOLD (CLAUDE.md; gap G5 of abp/specialist-abp.md, closed 2026-11-19 at Dinis's word): never release while board/HOLD.md exists.
if [ -e board/HOLD.md ]; then echo "board/HOLD.md exists: no release. Read it, and ask Dinis." >&2; exit 1; fi
node scripts/build.mjs
node scripts/validate.mjs
node scripts/leak-scan.mjs
node scripts/abp-check.mjs
for i in 1 2 3 4 5; do
  git fetch -q origin dev
  git rebase -q origin/dev
  node scripts/build.mjs >/dev/null && node scripts/validate.mjs >/dev/null && node scripts/leak-scan.mjs >/dev/null && node scripts/abp-check.mjs >/dev/null
  if git -c push.negotiate=true push -q origin HEAD:dev; then echo "released $(git rev-parse --short HEAD) to dev"; exit 0; fi
  sleep $((i * 3))
done
echo "release failed after 5 attempts" >&2; exit 1
