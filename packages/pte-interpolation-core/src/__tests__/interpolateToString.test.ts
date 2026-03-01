import {describe, expect, it} from 'vitest'
import {interpolateToString} from '../interpolateToString'
import {
  consecutiveVariablesBlock,
  emptyBlocksContent,
  multiBlockContent,
  multipleVariablesBlock,
  plainTextBlock,
  singleVariableBlock,
} from './fixtures'

describe('interpolateToString', () => {
  it('returns an empty string for empty blocks', () => {
    expect(interpolateToString(emptyBlocksContent, {})).toBe('')
  })

  it('returns plain text unchanged', () => {
    expect(interpolateToString(plainTextBlock, {})).toBe('No variables here.')
  })

  it('resolves a single variable from values', () => {
    expect(interpolateToString(singleVariableBlock, {firstName: 'Patrick'})).toBe('Hello, Patrick!')
  })

  it('uses default fallback for missing variables', () => {
    expect(interpolateToString(singleVariableBlock, {})).toBe('Hello, {firstName}!')
  })

  it('uses a custom fallback for missing variables', () => {
    const customFallback = (variableKey: string) => `[${variableKey}]`
    expect(interpolateToString(singleVariableBlock, {}, customFallback)).toBe('Hello, [firstName]!')
  })

  it('uses the value when it is an empty string', () => {
    expect(interpolateToString(singleVariableBlock, {firstName: ''})).toBe('Hello, !')
  })

  it('resolves consecutive variables', () => {
    expect(
      interpolateToString(consecutiveVariablesBlock, {firstName: 'Patrick', lastName: 'Pickles'}),
    ).toBe('PatrickPickles')
  })

  it('joins multiple blocks with newlines', () => {
    expect(
      interpolateToString(multiBlockContent, {firstName: 'Patrick', email: 'patrick@example.com'}),
    ).toBe('Dear Patrick,\nYour email is patrick@example.com.')
  })

  it('resolves multiple variables in one block', () => {
    expect(
      interpolateToString(multipleVariablesBlock, {
        firstName: 'Patrick',
        lastName: 'Pickles',
        email: 'patrick@example.com',
      }),
    ).toBe('Name: Patrick Pickles, Email: patrick@example.com')
  })
})
