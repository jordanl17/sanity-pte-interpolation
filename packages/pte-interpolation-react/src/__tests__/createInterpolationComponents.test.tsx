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
  it('returns components with only a types key registered under VARIABLE_TYPE_PREFIX', () => {
    const components = createInterpolationComponents({firstName: 'Patrick'})
    expect(Object.keys(components)).toEqual(['types'])
    expect(Object.keys(components.types!)).toEqual([VARIABLE_TYPE_PREFIX])
  })

  it('renders {variableKey} fallback for all missing values', () => {
    const components = createInterpolationComponents({})
    const html = renderToStaticMarkup(
      <PortableText value={multipleVariablesBlock} components={components} />,
    )
    expect(html).toContain('{firstName}')
    expect(html).toContain('{lastName}')
    expect(html).toContain('{email}')
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
      firstName: 'Patrick',
      lastName: 'Pickles',
      email: 'patrick@example.com',
    })
    const html = renderToStaticMarkup(
      <PortableText value={multipleVariablesBlock} components={components} />,
    )
    expect(html).toContain('<span data-variable-key="firstName">Patrick</span>')
    expect(html).toContain('<span data-variable-key="lastName">Pickles</span>')
    expect(html).toContain('<span data-variable-key="email">patrick@example.com</span>')
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
    const components = createInterpolationComponents({firstName: 'Patrick', lastName: 'Pickles'})
    const html = renderToStaticMarkup(
      <PortableText value={consecutiveVariablesBlock} components={components} />,
    )
    expect(html).toContain('<span data-variable-key="firstName">Patrick</span>')
    expect(html).toContain('<span data-variable-key="lastName">Pickles</span>')
  })

  it('renders a variable as the only child in a block', () => {
    const components = createInterpolationComponents({firstName: 'Patrick'})
    const html = renderToStaticMarkup(
      <PortableText value={variableOnlyBlock} components={components} />,
    )
    expect(html).toContain('<span data-variable-key="firstName">Patrick</span>')
  })
})
