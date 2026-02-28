# Contributing

## Setup

1. Fork and clone the repo
2. Install dependencies: `pnpm install`
3. Create a branch: `git checkout -b feat/my-feature`

See [Local Development](./local-development.md) for the full development workflow.

## Commit Messages

This repo enforces [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must follow the format:

```
type(scope): description
```

Examples:

```
feat(plugin): add variable picker to PTE toolbar
fix(react): handle empty blocks array gracefully
docs: update local development guide
chore: upgrade typescript to 5.10
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`

A commitlint hook validates this on every commit. If your commit is rejected, check the message format.

## Pull Requests

1. Run all checks before pushing:
   ```sh
   pnpm build:packages
   pnpm lint
   pnpm format:check
   pnpm type-check
   pnpm test
   ```
2. Push your branch and open a PR against `main`
3. CI runs the same checks automatically

## Package Exports

Both publishable packages use `@sanity/pkg-utils` with `--strict` mode. This means:

- All public API exports **must** have `/** @public */` JSDoc tags
- The `exports` map in `package.json` must include `source`, `import`, `require`, `default`, and `./package.json`
- Run `pnpm build:packages` to verify your changes pass the strict checks

## Tests

Tests use [Vitest](https://vitest.dev/) and live in `src/__tests__/` within each package:

```
packages/my-package/src/__tests__/MyModule.test.ts
```

Run tests with:

```sh
pnpm test
```

## Code Style

- **Functional style**: prefer `map`, `filter`, `reduce` over `for` loops
- **Descriptive names**: no single-character variable names
- **No negated expressions**: use positive conditions
- **No IIFEs**: avoid immediately invoked function expressions
- ESLint + Prettier handle formatting (runs automatically on commit via lint-staged)

## Adding a New Package

1. Create a directory under `packages/`
2. Add `package.json` with the standard exports map pattern (copy from an existing package)
3. Add `package.config.ts`, `tsconfig.json`, and `tsconfig.build.json`
4. Add the package to `release-please-config.json` and `.release-please-manifest.json`
5. Run `pnpm install` to link the new workspace
