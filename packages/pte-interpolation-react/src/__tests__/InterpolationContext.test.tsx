import {render, renderHook} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import type {ReactNode} from 'react'

import {InterpolatedPortableText} from '../InterpolatedPortableText'
import {InterpolationProvider, useInterpolationValues} from '../InterpolationContext'
import {multipleVariablesBlock, singleVariableBlock} from './fixtures'

describe('InterpolationProvider + InterpolatedPortableText integration', () => {
  it('renders variables from provider context when no prop is supplied', () => {
    const {container} = render(
      <InterpolationProvider interpolationValues={{firstName: 'Patrick'}}>
        <InterpolatedPortableText value={singleVariableBlock} />
      </InterpolationProvider>,
    )
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
  })

  it('prop interpolationValues overrides provider context entirely', () => {
    const {container} = render(
      <InterpolationProvider interpolationValues={{firstName: 'Patrick'}}>
        <InterpolatedPortableText
          value={singleVariableBlock}
          interpolationValues={{firstName: 'Patrick'}}
        />
      </InterpolationProvider>,
    )
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
  })

  it('prop override does not merge - missing provider keys render fallback', () => {
    const {container} = render(
      <InterpolationProvider
        interpolationValues={{
          firstName: 'Patrick',
          lastName: 'Pickles',
          email: 'patrick@example.com',
        }}
      >
        <InterpolatedPortableText
          value={multipleVariablesBlock}
          interpolationValues={{firstName: 'Morgan'}}
        />
      </InterpolationProvider>,
    )
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Morgan</span>')
    expect(container.innerHTML).toContain('<span data-variable-key="lastName">{lastName}</span>')
    expect(container.innerHTML).toContain('<span data-variable-key="email">{email}</span>')
  })

  it('provider fallback is used when prop fallback is absent', () => {
    const {container} = render(
      <InterpolationProvider interpolationValues={{}} fallback={(key) => `[provider:${key}]`}>
        <InterpolatedPortableText value={singleVariableBlock} />
      </InterpolationProvider>,
    )
    expect(container.innerHTML).toContain('[provider:firstName]')
  })

  it('prop fallback overrides provider fallback', () => {
    const {container} = render(
      <InterpolationProvider interpolationValues={{}} fallback={(key) => `[provider:${key}]`}>
        <InterpolatedPortableText value={singleVariableBlock} fallback={(key) => `[prop:${key}]`} />
      </InterpolationProvider>,
    )
    expect(container.innerHTML).toContain('[prop:firstName]')
  })

  it('nested providers use innermost values', () => {
    const {container} = render(
      <InterpolationProvider interpolationValues={{firstName: 'Outer'}}>
        <InterpolationProvider interpolationValues={{firstName: 'Inner'}}>
          <InterpolatedPortableText value={singleVariableBlock} />
        </InterpolationProvider>
      </InterpolationProvider>,
    )
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Inner</span>')
  })

  it('provider with empty values renders all variables as fallbacks', () => {
    const {container} = render(
      <InterpolationProvider interpolationValues={{}}>
        <InterpolatedPortableText value={singleVariableBlock} />
      </InterpolationProvider>,
    )
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">{firstName}</span>')
  })

  it('components prop merges correctly alongside provider values', () => {
    const {container} = render(
      <InterpolationProvider interpolationValues={{firstName: 'Patrick'}}>
        <InterpolatedPortableText
          value={singleVariableBlock}
          components={{
            block: {normal: ({children}) => <div data-testid="custom-block">{children}</div>},
          }}
        />
      </InterpolationProvider>,
    )
    expect(container.innerHTML).toContain('data-testid="custom-block"')
    expect(container.innerHTML).toContain('<span data-variable-key="firstName">Patrick</span>')
  })
})

describe('useInterpolationValues hook', () => {
  it('returns undefined when no provider exists', () => {
    const {result} = renderHook(() => useInterpolationValues())
    expect(result.current).toBeUndefined()
  })

  it('returns context value when provider exists', () => {
    const wrapper = ({children}: {children: ReactNode}) => (
      <InterpolationProvider interpolationValues={{firstName: 'Patrick'}}>
        {children}
      </InterpolationProvider>
    )
    const {result} = renderHook(() => useInterpolationValues(), {wrapper})
    expect(result.current).toEqual({
      interpolationValues: {firstName: 'Patrick'},
      fallback: undefined,
    })
  })
})
