---
paths:
  - 'packages/*/src/**/*.ts'
  - 'packages/*/src/**/*.tsx'
---

# Public API JSDoc Tags

Every exported type, interface, function, and constant should have a `/** @public */` JSDoc tag.

## Enforcement

- **`sanity-plugin-pte-interpolation`**: Required by `@sanity/pkg-utils --strict` (api-extractor). Missing tags fail the build:

```
"<symbol>" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
```

- **`pte-interpolation-core` and `pte-interpolation-react`**: Include tags for documentation; `tsup` builds these packages without api-extractor, so the build does not enforce them.
