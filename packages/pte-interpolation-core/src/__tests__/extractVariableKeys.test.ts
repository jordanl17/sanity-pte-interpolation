import {describe, expect, it} from 'vitest'
import {extractVariableKeys} from '../extractVariableKeys'
import {
  blockWithNoChildren,
  blockWithNonStringVariableKey,
  consecutiveVariablesBlock,
  duplicateVariableBlock,
  emptyBlocksContent,
  multipleVariablesBlock,
  plainTextBlock,
  singleVariableBlock,
} from './fixtures'

describe('extractVariableKeys', () => {
  it('returns an empty array for empty blocks', () => {
    expect(extractVariableKeys(emptyBlocksContent)).toEqual([])
  })

  it('returns an empty array when no variables exist', () => {
    expect(extractVariableKeys(plainTextBlock)).toEqual([])
  })

  it('extracts a single variable key', () => {
    expect(extractVariableKeys(singleVariableBlock)).toEqual(['firstName'])
  })

  it('extracts multiple variable keys in order', () => {
    expect(extractVariableKeys(multipleVariablesBlock)).toEqual(['firstName', 'lastName', 'email'])
  })

  it('extracts consecutive variable keys', () => {
    expect(extractVariableKeys(consecutiveVariablesBlock)).toEqual(['firstName', 'lastName'])
  })

  it('deduplicates variable keys preserving first-occurrence order', () => {
    expect(extractVariableKeys(duplicateVariableBlock)).toEqual(['firstName'])
  })

  it('handles blocks with no children property', () => {
    expect(extractVariableKeys(blockWithNoChildren)).toEqual([])
  })

  it('skips children with non-string variableKey', () => {
    expect(extractVariableKeys(blockWithNonStringVariableKey)).toEqual([])
  })
})
