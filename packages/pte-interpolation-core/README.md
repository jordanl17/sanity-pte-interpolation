# pte-interpolation-core

[![npm version](https://img.shields.io/npm/v/pte-interpolation-core.svg?style=flat-square)](https://www.npmjs.com/package/pte-interpolation-core)

![Demo](https://raw.githubusercontent.com/jordanl17/sanity-pte-interpolation/main/.github/assets/demo.png)

Framework-agnostic utilities for [Portable Text](https://portabletext.org/) variable interpolation. Extract variable keys from PTE blocks and resolve them to plain strings - with zero dependencies. Use this package when you need plain string output without a React dependency: email templates, PDF generation, Node.js scripts, SMS or push notifications, or any non-React framework (Vue, Svelte, Angular, etc.). For React rendering with rich text output, use [`pte-interpolation-react`](https://www.npmjs.com/package/pte-interpolation-react) instead - it re-exports everything from this package.

Part of [sanity-pte-interpolation](https://github.com/jordanl17/sanity-pte-interpolation). For adding variable picker inline blocks to Sanity Studio, see [`sanity-plugin-pte-interpolation`](https://www.npmjs.com/package/sanity-plugin-pte-interpolation). For React rendering with rich text output, see [`pte-interpolation-react`](https://www.npmjs.com/package/pte-interpolation-react).

## Install

```sh
npm install pte-interpolation-core
```

No peer dependencies required.

## Usage

### Extract variable keys

`extractVariableKeys` returns the unique variable keys found in an array of PTE blocks, in first-occurrence order:

```ts
import {extractVariableKeys} from 'pte-interpolation-core'

const keys = extractVariableKeys(blocks)
// ['firstName', 'vouchersRemaining']
```

### Interpolate to a plain string

`interpolateToString` resolves PTE blocks to a plain string, substituting variable blocks with the provided values:

```ts
import {interpolateToString} from 'pte-interpolation-core'

const text = interpolateToString(blocks, {
  firstName: 'Sarah',
  vouchersRemaining: '3',
})
// "Hi, Sarah! You have 3 vouchers remaining."
```

### Custom fallback for missing values

By default, unresolved variables render as `{variableKey}` (e.g. `{firstName}`). Provide a fallback function to customise this:

```ts
const text = interpolateToString(blocks, {}, (variableKey) => `[${variableKey}]`)
// "Hi, [firstName]! You have [vouchersRemaining] vouchers remaining."
```

## Related Packages

This package handles **resolution** of variable blocks that already exist in Portable Text. To add the variable picker to Sanity Studio's Portable Text Editor, use [`sanity-plugin-pte-interpolation`](https://www.npmjs.com/package/sanity-plugin-pte-interpolation):

```ts
import {defineField} from 'sanity'
import {interpolationVariables} from 'sanity-plugin-pte-interpolation'

defineField({
  name: 'message',
  type: 'array',
  of: [
    interpolationVariables([
      {id: 'firstName', name: 'First name'},
      {id: 'vouchersRemaining', name: 'Vouchers remaining'},
      {id: 'totalVouchers', name: 'Total vouchers'},
      {id: 'expiryDate', name: 'Expiry date'},
    ]),
  ],
})
```

## Data Shape

Variable blocks in stored Portable Text look like this:

```json
{
  "_type": "block",
  "children": [
    {"_type": "span", "text": "Hi, "},
    {"_type": "pteInterpolationVariable", "variableKey": "firstName"},
    {"_type": "span", "text": ","}
  ]
}
```

The `variableKey` maps to the `id` defined in the Studio variable definitions and the keys in the values record passed to `interpolateToString`.

## API Reference

### `extractVariableKeys(blocks)`

Returns the unique variable keys from an array of PTE blocks, in first-occurrence order.

| Parameter | Type                      | Description                  |
| --------- | ------------------------- | ---------------------------- |
| `blocks`  | `PortableTextBlockLike[]` | Portable Text blocks to scan |

Returns `string[]`.

### `interpolateToString(blocks, values, fallback?)`

Resolves PTE blocks to a plain string, replacing variable blocks with the corresponding values. Multiple blocks are joined with newlines.

| Parameter  | Type                              | Description                                                              |
| ---------- | --------------------------------- | ------------------------------------------------------------------------ |
| `blocks`   | `PortableTextBlockLike[]`         | Portable Text blocks to resolve                                          |
| `values`   | `Record<string, string>`          | Map of variable IDs to their resolved values                             |
| `fallback` | `(variableKey: string) => string` | Optional function for unresolved variables (defaults to `{variableKey}`) |

Returns `string`.

### `VARIABLE_TYPE_PREFIX`

The constant `'pteInterpolationVariable'` - the `_type` string used for variable inline blocks in stored Portable Text. Exported for advanced use cases.

### Types

| Type                            | Description                                           |
| ------------------------------- | ----------------------------------------------------- |
| `PortableTextBlockLike`         | Minimal block shape with optional `children` array    |
| `PortableTextChild`             | A child node within a block (span or variable)        |
| `PteInterpolationVariableBlock` | A variable inline block with `variableKey`            |
| `InterpolationValues`           | `Record<string, string>` - variable ID to value map   |
| `InterpolationFallback`         | `(variableKey: string) => string` - fallback function |

## License

MIT
