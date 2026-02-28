# Local Development

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/) (see `packageManager` in root `package.json` for the exact version)

## Getting Started

```sh
# Install all dependencies (including workspace links)
pnpm install

# Start both the Sanity Studio and test app in parallel
pnpm dev
```

Or run them individually:

```sh
# Sanity Studio at http://localhost:3333
pnpm dev:studio

# Vite test app at http://localhost:5173
pnpm dev:test-app
```

## How Local Dev Works

You do **not** need to build the packages to develop locally. Each package's `exports` map includes a `source` field pointing to the raw TypeScript in `src/`:

```json
{
  ".": {
    "source": "./src/index.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  }
}
```

When the apps import from a workspace package (e.g. `import {pteInterpolation} from 'sanity-plugin-pte-interpolation'`), the bundler resolves directly to the TypeScript source via the `source` condition. Changes are reflected immediately without rebuilding.

## Project Structure

```
packages/
  sanity-plugin-pte-interpolation/   # Sanity Studio plugin (publishable)
  pte-interpolation-react/           # React consumer library (publishable)
apps/
  studio/                            # Dev Sanity Studio (private)
  test-app/                          # Dev Vite + React app (private)
```

- **Packages** are publishable to npm and built with `@sanity/pkg-utils`.
- **Apps** are private, used only for local development and testing.

## Common Tasks

### Build packages for distribution

```sh
pnpm build:packages
```

This produces `dist/` in each package with ESM (`.js`), CommonJS (`.cjs`), and TypeScript declarations (`.d.ts`).

### Run tests

```sh
pnpm test
```

Tests use [Vitest](https://vitest.dev/) with `jsdom` environment. Test files live alongside source code in `src/__tests__/`.

### Lint and format

```sh
# ESLint
pnpm lint

# Prettier (check only)
pnpm format:check

# Prettier (write fixes)
pnpm format
```

Both ESLint and Prettier run automatically on staged files via lint-staged when you commit.

### Type check

```sh
pnpm type-check
```

### Clean build outputs

```sh
pnpm clean
```

## Testing with External Projects

To test a package in another local project without publishing, use [yalc](https://github.com/wclr/yalc):

```sh
# From the package directory
pnpm yalc:publish

# From the consuming project
npx yalc add sanity-plugin-pte-interpolation
```

For continuous development, use the watch mode:

```sh
pnpm link-watch
```

This rebuilds on file changes using `pkg-utils watch`.

## Turborepo

All root scripts are orchestrated by [Turborepo](https://turbo.build/). It handles:

- **Task dependencies**: packages build before apps that depend on them
- **Caching**: unchanged packages skip rebuilds
- **Parallelism**: independent tasks run concurrently

The pipeline is defined in `turbo.json`.
