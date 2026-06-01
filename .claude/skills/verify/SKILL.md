---
name: verify
description: Run typecheck and tests across the pnpm workspace and report only failures. Use when the user asks to "verify", "check this works", "make sure nothing's broken", or invokes /verify before handing off changes.
---

# Verify workspace

Run typecheck and tests across all packages and report a concise result.

## Steps

1. From the repo root, run in parallel:
   - `pnpm -r typecheck`
   - `pnpm -r test`
   - `pnpm lint` (Biome at the root)
2. Capture exit codes and stderr for each.

## Reporting

- If everything passes: one-line confirmation with the commands that ran.
- If anything fails: list each failing package and the first failure message. Do not paste full logs — the user can re-run for detail.
- If a script doesn't exist yet (e.g., no `typecheck` script in some package), note it and move on; don't treat missing scripts as failures.

## Do not

- Don't auto-fix failures. Report them and let the user decide.
- Don't run `pnpm install` unless `node_modules` is clearly missing — assume the workspace is set up.
