---
"@rtorcato/api-validation": minor
"@rtorcato/api-config": minor
"@rtorcato/api-response": minor
---

Update the `zod` peer dependency range from `^3.23.0` to `^4.0.0`. These packages are developed and tested against Zod 4 (which is what the workspace resolves); the old `^3.23.0` peer no longer matched reality. Consumers still on Zod 3 should upgrade to Zod 4.
