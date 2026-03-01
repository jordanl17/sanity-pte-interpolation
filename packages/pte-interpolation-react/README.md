# pte-interpolation-react

[![npm version](https://img.shields.io/npm/v/pte-interpolation-react.svg?style=flat-square)](https://www.npmjs.com/package/pte-interpolation-react)

![Demo](https://raw.githubusercontent.com/jordanl17/sanity-pte-interpolation/main/.github/assets/demo.png)

React rendering library that resolves dynamic variable inline blocks in [Portable Text](https://portabletext.org/) to actual values. Wraps [`@portabletext/react`](https://github.com/portabletext/react-portabletext) with automatic variable substitution.

Part of [sanity-pte-interpolation](https://github.com/jordanl17/sanity-pte-interpolation). For adding variable picker inline blocks to Sanity Studio, see [`sanity-plugin-pte-interpolation`](https://www.npmjs.com/package/sanity-plugin-pte-interpolation).

## Install

```sh
npm install pte-interpolation-react @portabletext/react
```

### Peer dependencies

- `react ^18.0.0 || ^19.0.0`

## Usage

### Drop-in component (recommended)

`<InterpolatedPortableText>` is a drop-in replacement for `<PortableText>` that handles variable resolution automatically:

```tsx
import {InterpolatedPortableText} from 'pte-interpolation-react'

function PromoCard({message, recipient}) {
  return (
    <InterpolatedPortableText
      value={message}
      interpolationValues={{
        firstName: recipient.firstName,
        vouchersRemaining: String(recipient.vouchersRemaining),
        totalVouchers: String(recipient.totalVouchers),
        expiryDate: recipient.expiryDate,
      }}
    />
  )
}
```

Variables render as `<span data-variable-key="firstName">Sarah</span>`, making them easy to target with CSS for styling or highlighting.

### With custom Portable Text components

Pass your own `components` prop and they will be merged with the interpolation types:

```tsx
<InterpolatedPortableText
  value={body}
  interpolationValues={values}
  components={{
    marks: {
      link: ({children, value}) => <a href={value.href}>{children}</a>,
    },
  }}
/>
```

### Custom fallback for missing values

By default, unresolved variables render as `{variableKey}` (e.g. `{firstName}`). Provide a `fallback` function to customise this:

```tsx
<InterpolatedPortableText
  value={body}
  interpolationValues={values}
  fallback={(variableKey) => `[missing: ${variableKey}]`}
/>
```

### Low-level API

If you need full control over component merging, use `createInterpolationComponents` directly with `<PortableText>` from `@portabletext/react`:

```tsx
import {useMemo} from 'react'
import {PortableText} from '@portabletext/react'
import {createInterpolationComponents} from 'pte-interpolation-react'

function PromoCard({message, values, customComponents}) {
  const components = useMemo(() => {
    const interpolation = createInterpolationComponents(values)
    return {
      ...customComponents,
      types: {
        ...customComponents.types,
        ...interpolation.types,
      },
    }
  }, [values, customComponents])

  return <PortableText value={message} components={components} />
}
```

## Related Packages

This package handles the **rendering** side. To add the variable picker to Sanity Studio's Portable Text Editor, use [`sanity-plugin-pte-interpolation`](https://www.npmjs.com/package/sanity-plugin-pte-interpolation):

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

The `variableKey` maps to the `id` defined in the Studio variable definitions and the keys in the `interpolationValues` record.

## API Reference

### `<InterpolatedPortableText>`

| Prop                  | Type                              | Description                                                                |
| --------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| `value`               | `PortableTextBlock[]`             | Portable Text content from Sanity                                          |
| `interpolationValues` | `Record<string, string>`          | Map of variable IDs to their resolved values                               |
| `components`          | `PortableTextComponents`          | Optional custom Portable Text components (merged with interpolation types) |
| `fallback`            | `(variableKey: string) => string` | Optional function for unresolved variables (defaults to `{variableKey}`)   |

Also accepts all other props from `@portabletext/react`'s `<PortableText>`.

### `createInterpolationComponents(values, fallback?)`

Returns a `PortableTextComponents` object with a `types.pteInterpolationVariable` renderer. Use this when you need manual control over component merging.

| Parameter  | Type                              | Description                                |
| ---------- | --------------------------------- | ------------------------------------------ |
| `values`   | `Record<string, string>`          | Map of variable IDs to values              |
| `fallback` | `(variableKey: string) => string` | Optional fallback for unresolved variables |

### `VARIABLE_TYPE_PREFIX`

The constant `'pteInterpolationVariable'` - the `_type` string used for variable inline blocks. Exported for advanced use cases.

## License

MIT
