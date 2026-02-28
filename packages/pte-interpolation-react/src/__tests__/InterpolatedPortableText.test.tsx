import type {PortableTextComponents} from '@portabletext/react'
import {renderToStaticMarkup} from 'react-dom/server'
import {describe, expect, it} from 'vitest'

import {VARIABLE_TYPE_PREFIX} from '../constants'
import {InterpolatedPortableText} from '../InterpolatedPortableText'
import {
  emptyBlocksContent,
  multiBlockContent,
  multipleVariablesBlock,
  plainTextBlock,
  singleVariableBlock,
  styledTextWithVariableBlock,
} from './fixtures'

describe('InterpolatedPortableText', () => {
  it('renders single variable resolved inline', () => {
    const html = renderToStaticMarkup(
      <InterpolatedPortableText
        value={singleVariableBlock}
        interpolationValues={{firstName: 'Jordan'}}
      />,
    )
    expect(html).toContain('Hello, ')
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
    expect(html).toContain('!')
  })

  it('renders multiple variables in one block', () => {
    const html = renderToStaticMarkup(
      <InterpolatedPortableText
        value={multipleVariablesBlock}
        interpolationValues={{
          firstName: 'Jordan',
          lastName: 'Lawrence',
          email: 'jordan@example.com',
        }}
      />,
    )
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
    expect(html).toContain('<span data-variable-key="lastName">Lawrence</span>')
    expect(html).toContain('<span data-variable-key="email">jordan@example.com</span>')
  })

  it('renders plain text unchanged', () => {
    const html = renderToStaticMarkup(
      <InterpolatedPortableText value={plainTextBlock} interpolationValues={{}} />,
    )
    expect(html).toContain('No variables here.')
  })

  it('renders fallback for missing values', () => {
    const html = renderToStaticMarkup(
      <InterpolatedPortableText value={singleVariableBlock} interpolationValues={{}} />,
    )
    expect(html).toContain('{firstName}')
  })

  it('uses custom fallback prop', () => {
    const html = renderToStaticMarkup(
      <InterpolatedPortableText
        value={singleVariableBlock}
        interpolationValues={{}}
        fallback={(key) => `[${key}]`}
      />,
    )
    expect(html).toContain('[firstName]')
  })

  it('preserves user components alongside interpolation types', () => {
    const userComponents: PortableTextComponents = {
      block: {
        normal: ({children}) => <div data-testid="custom-block">{children}</div>,
      },
    }

    const html = renderToStaticMarkup(
      <InterpolatedPortableText
        value={singleVariableBlock}
        interpolationValues={{firstName: 'Jordan'}}
        components={userComponents}
      />,
    )
    expect(html).toContain('data-testid="custom-block"')
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
  })

  it('renders variables across multiple blocks', () => {
    const html = renderToStaticMarkup(
      <InterpolatedPortableText
        value={multiBlockContent}
        interpolationValues={{
          firstName: 'Jordan',
          email: 'jordan@example.com',
        }}
      />,
    )
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
    expect(html).toContain('<span data-variable-key="email">jordan@example.com</span>')
    expect(html).toContain('Dear ')
    expect(html).toContain('Your email is ')
  })

  it('interpolation types take precedence over user types with same key', () => {
    const userComponents: PortableTextComponents = {
      types: {
        [VARIABLE_TYPE_PREFIX]: () => <span>user-override</span>,
      },
    }

    const html = renderToStaticMarkup(
      <InterpolatedPortableText
        value={singleVariableBlock}
        interpolationValues={{firstName: 'Jordan'}}
        components={userComponents}
      />,
    )
    expect(html).not.toContain('user-override')
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
  })

  it('renders user custom types alongside interpolation types', () => {
    const customWidgetBlock = [
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal' as const,
        markDefs: [],
        children: [
          {_type: 'span', _key: 'span-1', text: 'Hello ', marks: []},
          {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
        ],
      },
      {
        _type: 'customWidget',
        _key: 'widget-1',
        label: 'Click me',
      },
    ]

    const userComponents: PortableTextComponents = {
      types: {
        customWidget: ({value}: {value: {label: string}}) => (
          <button data-testid="widget">{value.label}</button>
        ),
      },
    }

    const html = renderToStaticMarkup(
      <InterpolatedPortableText
        value={customWidgetBlock}
        interpolationValues={{firstName: 'Jordan'}}
        components={userComponents}
      />,
    )
    expect(html).toContain('data-testid="widget"')
    expect(html).toContain('Click me')
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
  })

  it('preserves user mark components', () => {
    const userComponents: PortableTextComponents = {
      marks: {
        strong: ({children}) => <strong data-testid="custom-strong">{children}</strong>,
      },
    }

    const html = renderToStaticMarkup(
      <InterpolatedPortableText
        value={styledTextWithVariableBlock}
        interpolationValues={{firstName: 'Jordan'}}
        components={userComponents}
      />,
    )
    expect(html).toContain('data-testid="custom-strong"')
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
  })

  it('renders without errors when value array is empty', () => {
    const html = renderToStaticMarkup(
      <InterpolatedPortableText value={emptyBlocksContent} interpolationValues={{}} />,
    )
    expect(html).toBe('')
  })

  it('default fallback renders exactly {variableKey} format', () => {
    const html = renderToStaticMarkup(
      <InterpolatedPortableText value={singleVariableBlock} interpolationValues={{}} />,
    )
    expect(html).toContain('<span data-variable-key="firstName">{firstName}</span>')
  })

  it('renders styled text marks alongside variables', () => {
    const html = renderToStaticMarkup(
      <InterpolatedPortableText
        value={styledTextWithVariableBlock}
        interpolationValues={{firstName: 'Jordan'}}
      />,
    )
    expect(html).toContain('<strong>Welcome </strong>')
    expect(html).toContain('<span data-variable-key="firstName">Jordan</span>')
    expect(html).toContain('<em> aboard</em>')
  })
})
