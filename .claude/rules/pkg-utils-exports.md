---
paths:
  - 'packages/*/package.json'
  - 'packages/*/package.config.ts'
---

# Package Exports & Build

Each publishable package's exports map requires: `source`, `import`, `require`, `default`, and `./package.json`.

- `source` — raw TypeScript entry for local dev
- `import` — ESM build output
- `require` — CJS build output
- `default` — fallback (same as `import`)

Also required: `sideEffects: false`, `browserslist`, and `publishConfig.exports` (mirrors `exports` without `source`).

Build with `pkg-utils build --strict --check --clean` (via `pnpm build:packages`). `--strict` enforces api-extractor validation.
