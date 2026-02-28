import {PortableText} from '@portabletext/react'
import {renderToStaticMarkup} from 'react-dom/server'
import {describe, expect, it} from 'vitest'

import {VARIABLE_TYPE_PREFIX} from '../constants'
import {createInterpolationComponents} from '../createInterpolationComponents'
import {
  consecutiveVariablesBlock,
  multipleVariablesBlock,
  singleVariableBlock,
  variableOnlyBlock,
} from './fixtures'

describe('createInterpolationComponents', () => {
  it('returns object with types.pteInterpolationVariable component', () => {
    const components = createInterpolationComponents({firstName: 'Jordan'})
    expect(components.types).toBeDefined()
    expect(components.types).toHaveProperty('pteInterpolationVariable')
  })

  it('resolves variable value from the values map', () => {
    const components = createInterpolationComponents({firstName: 'Jordan'})
    const html = renderToStaticMarkup(
      <PortableText value={singleVariableBlock} components={components} />,
    )
    expect(html).toContain('Jordan')
    expect(html).toContain('data-variable-key="firstName"')
  })

  it('renders {variableKey} fallback for missing values', () => {
    const components = createInterpolationComponents({})
    const html = renderToStaticMarkup(
      <PortableText value={singleVariableBlock} components={components} />,
    )
    expect(html).toContain('{firstName}')
  })

  it('renders empty string when value is explicitly ""', () => {
    const components = createInterpolationComponents({firstName: ''})
    const html = renderToStaticMarkup(
      <PortableText value={singleVariableBlock} components={components} />,
    )
    expect(html).toContain('<span data-variable-key="firstName"></span>')
    expect(html).not.toContain('{firstName}')
  })

  it('calls custom fallback function for missing values', () => {
    const customFallback = (variableKey: string) => `[MISSING: ${variableKey}]`
    const components = createInterpolationComponents({}, customFallback)
    const html = renderToStaticMarkup(
      <PortableText value={singleVariableBlock} components={components} />,
    )
    expect(html).toContain('[MISSING: firstName]')
  })

  it('renders inside <span> with data-variable-key attribute', () => {
    const components = createInterpolationComponents({
      firstName: 'Jordan',
      lastName: 'Lawrence',
      email: 'jordan@example.com',
    })
    const html = renderToStaticMarkup(
      <PortableText value={multipleVariablesBlock} components={components} />,
    )
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
    expect(html).toContain('<span data-variable-key="lastName">Lawrence</span>')
    expect(html).toContain('<span data-variable-key="email">jordan@example.com</span>')
  })

  it('returns components with only a types key', () => {
    const components = createInterpolationComponents({firstName: 'Jordan'})
    expect(Object.keys(components)).toEqual(['types'])
  })

  it('registers component under VARIABLE_TYPE_PREFIX key', () => {
    const components = createInterpolationComponents({firstName: 'Jordan'})
    expect(Object.keys(components.types!)).toEqual([VARIABLE_TYPE_PREFIX])
  })

  it('falls back for all variables when values map is empty', () => {
    const components = createInterpolationComponents({})
    const html = renderToStaticMarkup(
      <PortableText value={multipleVariablesBlock} components={components} />,
    )
    expect(html).toContain('{firstName}')
    expect(html).toContain('{lastName}')
    expect(html).toContain('{email}')
  })

  it('escapes HTML special characters in values', () => {
    const components = createInterpolationComponents({firstName: '<script>alert("xss")</script>'})
    const html = renderToStaticMarkup(
      <PortableText value={singleVariableBlock} components={components} />,
    )
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('renders consecutive variables without interference', () => {
    const components = createInterpolationComponents({firstName: 'Jordan', lastName: 'Lawrence'})
    const html = renderToStaticMarkup(
      <PortableText value={consecutiveVariablesBlock} components={components} />,
    )
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
    expect(html).toContain('<span data-variable-key="lastName">Lawrence</span>')
  })

  it('renders a variable as the only child in a block', () => {
    const components = createInterpolationComponents({firstName: 'Jordan'})
    const html = renderToStaticMarkup(
      <PortableText value={variableOnlyBlock} components={components} />,
    )
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
  })
})
