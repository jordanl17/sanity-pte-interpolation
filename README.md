# sanity-pte-interpolation

[![npm version](https://img.shields.io/npm/v/sanity-plugin-pte-interpolation.svg?style=flat-square)](https://www.npmjs.com/package/sanity-plugin-pte-interpolation) [![npm version](https://img.shields.io/npm/v/pte-interpolation-react.svg?style=flat-square)](https://www.npmjs.com/package/pte-interpolation-react)

Embed dynamic variables inside [Portable Text](https://portabletext.org/) content in [Sanity Studio](https://www.sanity.io/studio), then resolve them to real values at render time in React. Think mail merge for rich text — an editor writes "Hello, `{firstName}`!" and the frontend substitutes the actual value at runtime.

## Packages

This project ships two independent, decoupled packages:

| Package                                                                         | Purpose                                                                                         |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [`sanity-plugin-pte-interpolation`](./packages/sanity-plugin-pte-interpolation) | Sanity Studio schema helper that adds variable picker inline blocks to the Portable Text Editor |
| [`pte-interpolation-react`](./packages/pte-interpolation-react)                 | React rendering library that resolves variable blocks to real values                            |

See each package's README for full installation, usage, and API documentation.

## How It Works

```
AUTHORING (Sanity Studio)                 RENDERING (React)
───────────────────────────               ─────────────────────────
Editor writes:                            App provides values:
"Hello, [firstName]! Your                 { firstName: "Jo",
email is [email]."                          email: "jo@example.com" }

Stored as Portable Text with              Rendered as:
inline pteInterpolationVariable           "Hello, Jo! Your
objects containing variableKey            email is jo@example.com."
```

### Studio (authoring)

```ts
import {interpolationVariables} from 'sanity-plugin-pte-interpolation'

defineField({
  name: 'body',
  type: 'array',
  of: [
    interpolationVariables([
      {id: 'firstName', name: 'First name'},
      {id: 'email', name: 'Email address'},
    ]),
  ],
})
```

### React (rendering)

```tsx
import {InterpolatedPortableText} from 'pte-interpolation-react'
;<InterpolatedPortableText
  value={body}
  interpolationValues={{firstName: 'Jo', email: 'jo@example.com'}}
/>
```

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
