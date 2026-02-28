import {type ReactElement} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {createVariableInlineBlock, createVariableKeyInput} from '../components/VariableInlineBlock'
import type {BlockProps, InputProps} from 'sanity'
import type {InterpolationVariable} from '../types'

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useId: () => 'test-autocomplete-id',
    useCallback: (callback: unknown) => callback,
  }
})

const testVariables: InterpolationVariable[] = [
  {id: 'firstName', name: 'First name', description: 'First name of the recipient'},
  {id: 'email', name: 'Email address'},
]

function findTextInElement(element: unknown): string[] {
  if (typeof element === 'string') return [element]
  if (!element || typeof element !== 'object') return []
  const el = element as {props?: Record<string, unknown>}
  if (!el.props) return []
  const {children} = el.props
  if (Array.isArray(children)) return children.flatMap(findTextInElement)
  return findTextInElement(children)
}

function findPropInElement(element: unknown, propName: string): unknown {
  if (!element || typeof element !== 'object') return undefined
  const el = element as {props?: Record<string, unknown>}
  if (!el.props) return undefined
  if (propName in el.props) return el.props[propName]
  const {children} = el.props
  if (Array.isArray(children)) {
    for (const child of children) {
      const found = findPropInElement(child, propName)
      if (found !== undefined) return found
    }
  }
  return findPropInElement(children, propName)
}

describe('createVariableInlineBlock', () => {
  function captureRenderPreview(variableKey: string | undefined): ReactElement | undefined {
    const VariableInlineBlock = createVariableInlineBlock(testVariables)
    let capturedRenderPreview: ((...args: unknown[]) => ReactElement) | undefined

    VariableInlineBlock({
      value: {variableKey},
      renderDefault: (props: unknown) => {
        capturedRenderPreview = (props as {renderPreview?: (...args: unknown[]) => ReactElement})
          .renderPreview
        return null as unknown as ReactElement
      },
    } as unknown as BlockProps)

    return capturedRenderPreview?.()
  }

  it('renders the readable name when variableKey matches a variable id', () => {
    expect(findTextInElement(captureRenderPreview('firstName'))).toContain('First name')
  })

  it('renders the raw variableKey when no variable matches', () => {
    expect(findTextInElement(captureRenderPreview('unknown'))).toContain('unknown')
  })

  it('renders "Select variable" when variableKey is undefined', () => {
    expect(findTextInElement(captureRenderPreview(undefined))).toContain('Select variable')
  })
})

describe('createVariableKeyInput', () => {
  function renderInput(value: string | undefined): ReactElement {
    const VariableKeyInput = createVariableKeyInput(testVariables)
    return VariableKeyInput({
      value,
      onChange: vi.fn(),
    } as unknown as InputProps) as ReactElement
  }

  it('includes the description when the selected variable has one', () => {
    expect(findTextInElement(renderInput('firstName'))).toContain('First name of the recipient')
  })

  it('does not include description when the selected variable has none', () => {
    const element = renderInput('email')
    const allText = findTextInElement(element)
    const textsOutsideAutocomplete = allText.filter((text) => text !== 'Search variables...')
    expect(textsOutsideAutocomplete).toHaveLength(0)
  })

  it('does not include description when no variable is selected', () => {
    const element = renderInput(undefined)
    const allText = findTextInElement(element)
    const textsOutsideAutocomplete = allText.filter((text) => text !== 'Search variables...')
    expect(textsOutsideAutocomplete).toHaveLength(0)
  })

  it('renders a search placeholder', () => {
    const element = renderInput(undefined)
    const placeholder = findPropInElement(element, 'placeholder')
    expect(placeholder).toBe('Search variables...')
  })
})
