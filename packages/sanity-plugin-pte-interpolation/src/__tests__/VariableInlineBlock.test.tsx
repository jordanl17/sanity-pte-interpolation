import {type ReactElement} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {createVariableInlineBlock, createVariableKeyInput} from '../components/VariableInlineBlock'
import type {BlockProps, InputProps} from 'sanity'
import type {InterpolationVariable} from '../types'

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
      renderDefault: vi.fn(() => null),
    } as unknown as InputProps) as ReactElement
  }

  it('includes the description when the selected variable has one', () => {
    expect(findTextInElement(renderInput('firstName'))).toContain('First name of the recipient')
  })

  it('does not include description when the selected variable has none', () => {
    expect(findTextInElement(renderInput('email'))).toHaveLength(0)
  })

  it('does not include description when no variable is selected', () => {
    expect(findTextInElement(renderInput(undefined))).toHaveLength(0)
  })
})
