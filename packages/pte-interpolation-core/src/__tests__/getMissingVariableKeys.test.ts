import {describe, expect, it} from 'vitest'
import {getMissingVariableKeys} from '../getMissingVariableKeys'
import {
  blockWithNoChildren,
  blockWithNonStringVariableKey,
  consecutiveVariablesBlock,
  duplicateVariableBlock,
  emptyBlocksContent,
  multiBlockContent,
  multipleVariablesBlock,
  plainTextBlock,
  singleVariableBlock,
} from './fixtures'

describe('getMissingVariableKeys', () => {
  it('returns empty array for empty blocks', () => {
    expect(getMissingVariableKeys(emptyBlocksContent, {})).toEqual([])
  })

  it('returns empty array when no variables exist', () => {
    expect(getMissingVariableKeys(plainTextBlock, {})).toEqual([])
  })

  it('returns empty array when all variables provided', () => {
    expect(getMissingVariableKeys(singleVariableBlock, {firstName: 'Alice'})).toEqual([])
  })

  it('returns empty array when all multiple variables provided', () => {
    expect(
      getMissingVariableKeys(multipleVariablesBlock, {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'a@b.com',
      }),
    ).toEqual([])
  })

  it('returns missing key when value not provided', () => {
    expect(getMissingVariableKeys(singleVariableBlock, {})).toEqual(['firstName'])
  })

  it('returns only missing keys when some values provided', () => {
    expect(getMissingVariableKeys(multipleVariablesBlock, {firstName: 'Alice'})).toEqual([
      'lastName',
      'email',
    ])
  })

  it('does not treat empty string as missing', () => {
    expect(getMissingVariableKeys(singleVariableBlock, {firstName: ''})).toEqual([])
  })

  it('returns missing keys across multiple blocks', () => {
    expect(getMissingVariableKeys(multiBlockContent, {firstName: 'Alice'})).toEqual(['email'])
  })

  it('deduplicates missing keys', () => {
    expect(getMissingVariableKeys(duplicateVariableBlock, {})).toEqual(['firstName'])
  })

  it('handles blocks with no children property', () => {
    expect(getMissingVariableKeys(blockWithNoChildren, {})).toEqual([])
  })

  it('skips children with non-string variableKey', () => {
    expect(getMissingVariableKeys(blockWithNonStringVariableKey, {})).toEqual([])
  })

  it('returns missing keys for consecutive variables', () => {
    expect(getMissingVariableKeys(consecutiveVariablesBlock, {firstName: 'Alice'})).toEqual([
      'lastName',
    ])
  })

  it('ignores extra values not in blocks', () => {
    expect(
      getMissingVariableKeys(singleVariableBlock, {firstName: 'Alice', extraKey: 'ignored'}),
    ).toEqual([])
  })

  it('preserves first-occurrence order of missing keys', () => {
    expect(getMissingVariableKeys(multipleVariablesBlock, {})).toEqual([
      'firstName',
      'lastName',
      'email',
    ])
  })
})
