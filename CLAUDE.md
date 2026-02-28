# sanity-pte-interpolation

## Architecture

Turborepo monorepo with two publishable npm packages and two dev apps.

### Packages

| Package                           | Path                                       | Description                                                      |
| --------------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| `sanity-plugin-pte-interpolation` | `packages/sanity-plugin-pte-interpolation` | Sanity Studio PTE plugin for variable interpolation              |
| `pte-interpolation-react`         | `packages/pte-interpolation-react`         | React component library for rendering interpolated Portable Text |

### Apps (dev only, not published)

| App        | Path            | Description                                             |
| ---------- | --------------- | ------------------------------------------------------- |
| `studio`   | `apps/studio`   | Dev Sanity Studio for testing the plugin                |
| `test-app` | `apps/test-app` | Vite + React app for testing the React consumer library |

## Commands

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `pnpm install`        | Install all dependencies          |
| `pnpm build`          | Build all packages and apps       |
| `pnpm build:packages` | Build only publishable packages   |
| `pnpm dev`            | Start all dev servers in parallel |
| `pnpm dev:studio`     | Start Sanity Studio dev server    |
| `pnpm dev:test-app`   | Start Vite test app dev server    |
| `pnpm lint`           | Run ESLint across the monorepo    |
| `pnpm format`         | Format all files with Prettier    |
| `pnpm format:check`   | Check formatting without writing  |
| `pnpm test`           | Run Vitest tests                  |
| `pnpm type-check`     | Run TypeScript type checking      |
| `pnpm clean`          | Clean all build outputs           |

## Build System

- **Build tool**: `@sanity/pkg-utils` for both publishable packages
- **Output**: `dist/` with ESM (`.js`), CJS (`.cjs`), and TypeScript declarations (`.d.ts`)
- **Local dev**: Workspace consumers import directly from `src/` via the `source` field in exports maps — no build needed during development
- **Orchestration**: Turborepo handles task dependencies and caching

## Coding Conventions

- Use `pnpm` as the package manager
- Prefer functional declarations and higher-order functions (map, filter, reduce)
- Use descriptive variable names (no single-character names)
- Do not use negated expressions
- Do not use immediately invoked function expressions (IIFEs)
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- ESLint + Prettier enforce code style (run automatically via lint-staged on commit)

## Release Process

- Releases are managed by [release-please](https://github.com/googleapis/release-please)
- Each package is versioned independently with separate release PRs
- Merging a release PR triggers npm publish via GitHub Actions
- Requires `NPM_TOKEN` secret configured in GitHub repo settings

## Peer Dependencies

- `sanity-plugin-pte-interpolation` supports `sanity ^3.0.0 || ^4.0.0 || ^5.0.0` and `react ^18.0.0 || ^19.0.0`
- `pte-interpolation-react` supports `react ^18.0.0 || ^19.0.0`
