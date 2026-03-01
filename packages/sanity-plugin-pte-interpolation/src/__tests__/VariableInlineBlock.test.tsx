import {type ComponentType, type ReactElement, type ReactNode} from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ThemeProvider} from '@sanity/ui'
import {buildTheme} from '@sanity/ui/theme'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {
  VariableKeyField,
  createVariableInlineBlock,
  createVariableKeyInput,
} from '../components/VariableInlineBlock'
import type {InterpolationVariable} from '../types'

// jsdom does not implement window.matchMedia, which @sanity/ui components depend on
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

afterEach(cleanup)

const theme = buildTheme()

const testVariables: InterpolationVariable[] = [
  {id: 'firstName', name: 'First name', description: 'First name of the recipient'},
  {id: 'email', name: 'Email address'},
]

describe('createVariableInlineBlock', () => {
  function renderPreview(variableKey: string | undefined) {
    const VariableInlineBlock = createVariableInlineBlock(testVariables)
    const Block = VariableInlineBlock as unknown as ComponentType<{
      value: {variableKey?: string}
      renderDefault: (props: {renderPreview?: () => ReactElement}) => ReactElement
    }>

    return render(
      <ThemeProvider theme={theme}>
        <Block
          value={{variableKey}}
          renderDefault={(props) => (props.renderPreview?.() ?? null) as unknown as ReactElement}
        />
      </ThemeProvider>,
    )
  }

  it('renders the readable name when variableKey matches a variable id', () => {
    renderPreview('firstName')
    expect(screen.getByText('First name')).toBeDefined()
  })

  it('renders the raw variableKey when no variable matches', () => {
    renderPreview('unknown')
    expect(screen.getByText('unknown')).toBeDefined()
  })

  it('renders "Select variable" when variableKey is undefined', () => {
    renderPreview(undefined)
    expect(screen.getByText('Select variable')).toBeDefined()
  })

  it('renders a "Stale" badge when variableKey does not match any variable', () => {
    renderPreview('staleKey')
    expect(screen.getByText('Stale')).toBeDefined()
  })

  it('does not render a "Stale" badge when variableKey matches', () => {
    renderPreview('firstName')
    expect(screen.queryByText('Stale')).toBeNull()
  })
})

describe('createVariableKeyInput', () => {
  function renderInput(value: string | undefined, onChange = vi.fn()) {
    const VariableKeyInput = createVariableKeyInput(testVariables)
    const Input = VariableKeyInput as unknown as ComponentType<{
      value?: string
      onChange: () => void
    }>

    render(
      <ThemeProvider theme={theme}>
        <Input value={value} onChange={onChange} />
      </ThemeProvider>,
    )

    return {onChange}
  }

  it('includes the description when the selected variable has one', () => {
    renderInput('firstName')
    expect(screen.getByText('First name of the recipient')).toBeDefined()
  })

  it('does not include the description for a variable that has none', () => {
    renderInput('email')
    expect(screen.queryByText('First name of the recipient')).toBeNull()
  })

  it('does not include the description when no variable is selected', () => {
    renderInput(undefined)
    expect(screen.queryByText('First name of the recipient')).toBeNull()
  })

  it('renders a search placeholder', () => {
    renderInput(undefined)
    expect(screen.getByPlaceholderText('Search variables...')).toBeDefined()
  })

  it('renders a stale warning when variableKey is stale', () => {
    renderInput('staleKey')
    expect(screen.getByText(/is no longer defined/)).toBeDefined()
  })

  it('does not render a stale warning for a matched key or undefined value', () => {
    renderInput('firstName')
    expect(screen.queryByText(/is no longer defined/)).toBeNull()
    cleanup()

    renderInput(undefined)
    expect(screen.queryByText(/is no longer defined/)).toBeNull()
  })

  it('filters options by name when typing', async () => {
    const user = userEvent.setup()
    renderInput(undefined)

    const input = screen.getByPlaceholderText('Search variables...')
    await user.type(input, 'Email')

    expect(screen.getByText('Email address')).toBeDefined()
    expect(screen.queryByText('First name')).toBeNull()
  })

  it('calls onChange when selecting an option', async () => {
    const user = userEvent.setup()
    const {onChange} = renderInput(undefined)

    const input = screen.getByPlaceholderText('Search variables...')
    await user.type(input, 'First')

    const option = await screen.findByText('First name')
    await user.click(option)

    expect(onChange).toHaveBeenCalled()
  })
})

describe('VariableKeyField', () => {
  const Field = VariableKeyField as unknown as ComponentType<{children: ReactNode}>

  it('renders its children', () => {
    render(<Field>child content</Field>)
    expect(screen.getByText('child content')).toBeDefined()
  })

  it('renders nested element children', () => {
    render(
      <Field>
        <span>nested child</span>
      </Field>,
    )
    expect(screen.getByText('nested child')).toBeDefined()
  })
})
