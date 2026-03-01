# Plan: `InterpolationProvider` and `useInterpolationValues`

Add a React context layer to `pte-interpolation-react` so consumers can provide `interpolationValues` (and optionally `fallback`) at a tree level, removing the need to thread these props through every `<InterpolatedPortableText>` instance.

## Execution strategy

Tasks 1-2 have no dependencies and should be executed as **concurrent background sub-agents**. Task 3 depends on both. Tasks 4 and 5 depend on 3. Task 6 depends on all. Tasks are structured for `TaskCreate` with `addBlockedBy` relationships.

## Tasks

### Task 1: Add types and create context module

**activeForm**: "Creating InterpolationContext and types"
**blockedBy**: none

Update `packages/pte-interpolation-react/src/types.ts`:

- Add `InterpolationProviderProps` interface:
  ```ts
  export interface InterpolationProviderProps {
    interpolationValues: InterpolationValues
    fallback?: InterpolationFallback
    children: ReactNode
  }
  ```
- Make `interpolationValues` optional on `InterpolatedPortableTextProps` (was required, now optional - non-breaking widening)

Create `packages/pte-interpolation-react/src/InterpolationContext.tsx`:

Contains context definition, provider component, and hook in a single file (roughly 30-40 lines).

**Context shape:**

```ts
interface InterpolationContextValue {
  interpolationValues: InterpolationValues
  fallback?: InterpolationFallback
}
```

Default value is `undefined` (not empty object).

**Provider:** wraps children with `InterpolationContext.Provider`, passing a `useMemo`-ed value keyed on `interpolationValues` and `fallback`.

**Hook:** thin wrapper around `useContext(InterpolationContext)`, returns `InterpolationContextValue | undefined`.

### Task 2: Update `InterpolatedPortableText` to consume context

**activeForm**: "Integrating context into InterpolatedPortableText"
**blockedBy**: [Task 1]

Update `packages/pte-interpolation-react/src/InterpolatedPortableText.tsx`:

- Import `useInterpolationValues` from `./InterpolationContext`
- Resolve effective values with prop-over-context precedence:
  ```tsx
  const contextValue = useInterpolationValues()
  const interpolationValues = interpolationValuesProp ?? contextValue?.interpolationValues ?? {}
  const fallback = fallbackProp ?? contextValue?.fallback
  ```
- Rest of the component unchanged

### Task 3: Write tests

**activeForm**: "Writing context and integration tests"
**blockedBy**: [Task 1, Task 2]

Create `packages/pte-interpolation-react/src/__tests__/InterpolationContext.test.tsx`:

**Provider + InterpolatedPortableText integration:**

1. renders variables from provider context (no prop on component)
2. prop `interpolationValues` overrides provider context entirely
3. prop `interpolationValues` overrides without merging (provider has `firstName` + `lastName`, prop has only `firstName` - assert `lastName` renders fallback)
4. provider `fallback` is used when prop `fallback` is absent
5. prop `fallback` overrides provider `fallback`
6. works without provider when prop is supplied (regression)
7. renders fallback text when neither provider nor prop supplies values
8. nested providers use innermost values
9. provider with empty values `{}` renders all fallbacks
10. provider with `components` prop still merges correctly

**`useInterpolationValues` hook:**

11. returns `undefined` when no provider exists
12. returns context value when provider exists
13. returns innermost provider value with nested providers

Update `packages/pte-interpolation-react/src/__tests__/reexports.test.ts`:

- Add assertions that `InterpolationProvider` and `useInterpolationValues` are exported functions

### Task 4: Update barrel exports

**activeForm**: "Updating barrel exports"
**blockedBy**: [Task 1]

Update `packages/pte-interpolation-react/src/index.ts`:

- Add value exports: `InterpolationProvider`, `useInterpolationValues`
- Add type export: `InterpolationProviderProps`

### Task 5: Update documentation

**activeForm**: "Updating README documentation"
**blockedBy**: [Task 1, Task 2]

Update `packages/pte-interpolation-react/README.md`:

- Add a "Context provider" usage section after "Custom fallback for missing values":

  ```tsx
  import {InterpolationProvider, InterpolatedPortableText} from 'pte-interpolation-react'

  function App({recipient}) {
    return (
      <InterpolationProvider
        interpolationValues={{
          firstName: recipient.firstName,
          email: recipient.email,
        }}
      >
        <PromoCard />
        <WelcomeMessage />
      </InterpolationProvider>
    )
  }

  function PromoCard() {
    return <InterpolatedPortableText value={promoContent} />
  }
  ```

- Document that props override context entirely (no shallow merge)
- Document the `useInterpolationValues` hook for headless usage
- Add API reference entries for `<InterpolationProvider>` and `useInterpolationValues()`
- Update `<InterpolatedPortableText>` API reference to note `interpolationValues` is now optional when a provider is present
- Add `InterpolationProviderProps` to the types table

### Task 6: Verify

**activeForm**: "Running build, lint, type-check, and tests"
**blockedBy**: [Task 3, Task 4, Task 5]

Run `pnpm build:packages && pnpm lint && pnpm type-check && pnpm test` to verify everything passes.

## Design decisions

### Prop-over-context precedence (no shallow merge)

When `interpolationValues` is passed as a prop, it replaces the context value entirely. No shallow merge of the two objects.

Shallow merging creates subtle bugs - a provider with `{firstName: "Jordan", lastName: "Lawrence"}` and a component prop with `{firstName: "Alex"}` would produce `{firstName: "Alex", lastName: "Lawrence"}`, which might be unintentional. If a consumer wants to merge, they can do so explicitly:

```tsx
const contextValues = useInterpolationValues()
<InterpolatedPortableText
  interpolationValues={{...contextValues?.interpolationValues, firstName: 'Alex'}}
  value={body}
/>
```

### `undefined` default context (not empty object)

Preserves the semantic distinction between "no provider exists" and "provider exists with empty values." The `??` operator in the component correctly falls through to `{}` as a last resort, while still preferring explicit empty values from a provider.

### Hook returns value or `undefined` (does not throw)

The hook does not throw when used outside a provider. `InterpolatedPortableText` can work without a provider (via props), and consumers who use the hook directly can check for `undefined` gracefully.

### `interpolationValues` becomes optional on the component

With a provider the prop is genuinely not needed. Without either, the component still works (all variables show fallback text) - same behavior as passing `{}` today.

## Edge cases

| Edge case                                                                       | Behavior                                                                |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| No provider, prop provided                                                      | Works exactly as before                                                 |
| Provider present, no prop                                                       | Uses context values                                                     |
| Provider present, prop provided                                                 | Prop wins entirely, context ignored                                     |
| Provider `interpolationValues`, no prop; context `fallback`, no prop `fallback` | Context fallback used                                                   |
| Provider `interpolationValues`, prop `fallback`                                 | Prop fallback used                                                      |
| No provider, no prop                                                            | Resolves to `{}`, all variables render default fallback `{variableKey}` |
| Nested providers                                                                | Inner provider wins (standard React context)                            |
| Provider with `{}` values                                                       | Valid - all variables render fallback                                   |
| Hook called outside provider                                                    | Returns `undefined`                                                     |
| Provider re-renders with new values                                             | `useMemo` in provider ensures referential stability                     |

## No changes needed

- `createInterpolationComponents.tsx` - remains a pure function, no context awareness needed
- `constants.ts` - unchanged
- `package.json` - no new dependencies (`createContext`/`useContext`/`useMemo` are React core)
- Core package (`pte-interpolation-core`) - context is purely a React-layer concern
