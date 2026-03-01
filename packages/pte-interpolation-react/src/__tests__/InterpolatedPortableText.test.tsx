import type {PortableTextComponents} from '@portabletext/react'
import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

import {VARIABLE_TYPE_PREFIX} from '../constants'
import {InterpolatedPortableText} from '../InterpolatedPortableText'
import {
  emptyBlocksContent,
  multipleVariablesBlock,
  singleVariableBlock,
  styledTextWithVariableBlock,
} from './fixtures'

describe('InterpolatedPortableText', () => {
  it('renders single variable resolved inline', () => {
    const {container} = render(
      <InterpolatedPortableText
        value={singleVariableBlock}
        interpolationValues={{firstName: 'Patrick'}}
      />,
    )
    expect(container.innerHTML).toContain('Hello, ')
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
    expect(container.innerHTML).toContain('!')
  })

  it('renders multiple variables in one block', () => {
    const {container} = render(
      <InterpolatedPortableText
        value={multipleVariablesBlock}
        interpolationValues={{
          firstName: 'Patrick',
          lastName: 'Pickles',
          email: 'patrick@example.com',
        }}
      />,
    )
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
    expect(container.innerHTML).toContain('<span data-variable-key="lastName">Pickles</span>')
    expect(container.innerHTML).toContain(
      '<span data-variable-key="email">patrick@example.com</span>',
    )
  })

  it('uses custom fallback prop', () => {
    const {container} = render(
      <InterpolatedPortableText
        value={singleVariableBlock}
        interpolationValues={{}}
        fallback={(key) => `[${key}]`}
      />,
    )
    expect(container.innerHTML).toContain('[firstName]')
  })

  it('preserves user components alongside interpolation types', () => {
    const userComponents: PortableTextComponents = {
      block: {
        normal: ({children}) => <div data-testid="custom-block">{children}</div>,
      },
    }

    const {container} = render(
      <InterpolatedPortableText
        value={singleVariableBlock}
        interpolationValues={{firstName: 'Patrick'}}
        components={userComponents}
      />,
    )
    expect(container.innerHTML).toContain('data-testid="custom-block"')
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
  })

  it('interpolation types take precedence over user types with same key', () => {
    const userComponents: PortableTextComponents = {
      types: {
        [VARIABLE_TYPE_PREFIX]: () => <span>user-override</span>,
      },
    }

    const {container} = render(
      <InterpolatedPortableText
        value={singleVariableBlock}
        interpolationValues={{firstName: 'Patrick'}}
        components={userComponents}
      />,
    )
    expect(container.innerHTML).not.toContain('user-override')
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
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

    const {container} = render(
      <InterpolatedPortableText
        value={customWidgetBlock}
        interpolationValues={{firstName: 'Patrick'}}
        components={userComponents}
      />,
    )
    expect(container.innerHTML).toContain('data-testid="widget"')
    expect(container.innerHTML).toContain('Click me')
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
  })

  it('preserves user mark components', () => {
    const userComponents: PortableTextComponents = {
      marks: {
        strong: ({children}) => <strong data-testid="custom-strong">{children}</strong>,
      },
    }

    const {container} = render(
      <InterpolatedPortableText
        value={styledTextWithVariableBlock}
        interpolationValues={{firstName: 'Patrick'}}
        components={userComponents}
      />,
    )
    expect(container.innerHTML).toContain('data-testid="custom-strong"')
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
  })

  it('renders without errors when value array is empty', () => {
    const {container} = render(
      <InterpolatedPortableText value={emptyBlocksContent} interpolationValues={{}} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('default fallback renders exactly {variableKey} format', () => {
    const {container} = render(
      <InterpolatedPortableText value={singleVariableBlock} interpolationValues={{}} />,
    )
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">{firstName}</span>')
  })

  it('renders styled text marks alongside variables', () => {
    const {container} = render(
      <InterpolatedPortableText
        value={styledTextWithVariableBlock}
        interpolationValues={{firstName: 'Patrick'}}
      />,
    )
    expect(container.innerHTML).toContain('<strong>Welcome </strong>')
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
    expect(container.innerHTML).toContain('<em> aboard</em>')
  })
})
