# sanity-pte-interpolation

![Demo](https://raw.githubusercontent.com/jordanl17/sanity-pte-interpolation/main/.github/assets/demo.png)

Embed dynamic variables inside [Portable Text](https://portabletext.org/) content in [Sanity Studio](https://www.sanity.io/studio), then resolve them to real values at render time in React. Think mail merge for rich text - an editor writes "Hello, `{firstName}`!" and the frontend substitutes the actual value at runtime.

## Packages

This project ships three independent, decoupled packages:

| Package                                                                         | Purpose                                                                                         |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [`sanity-plugin-pte-interpolation`](./packages/sanity-plugin-pte-interpolation) | Sanity Studio schema helper that adds variable picker inline blocks to the Portable Text Editor |
| [`pte-interpolation-react`](./packages/pte-interpolation-react)                 | React rendering library that resolves variable blocks to real values                            |
| [`pte-interpolation-core`](./packages/pte-interpolation-core)                   | Framework-agnostic utilities for variable extraction and plain string interpolation             |

See each package's README for full installation, usage, and API documentation.

## Development

```sh
pnpm install
pnpm dev        # starts Studio + test app in parallel
```

See [Local Development](./docs/local-development.md) for the full dev workflow.

## Documentation

- [Local Development](./docs/local-development.md)
- [Release Process](./docs/release-process.md)
- [Contributing](./docs/contributing.md)

## License

MIT
