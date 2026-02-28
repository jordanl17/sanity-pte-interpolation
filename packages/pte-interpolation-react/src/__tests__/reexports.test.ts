import {describe, expect, it} from 'vitest'
import {
  extractVariableKeys,
  interpolateToString,
  VARIABLE_TYPE_PREFIX,
} from 'pte-interpolation-react'
import type {
  InterpolationFallback,
  InterpolationValues,
  PortableTextBlockLike,
  PortableTextChild,
  PteInterpolationVariableBlock,
} from 'pte-interpolation-react'
import {singleVariableBlock, multipleVariablesBlock, plainTextBlock} from './fixtures'

describe('re-exports from pte-interpolation-core', () => {
  describe('VARIABLE_TYPE_PREFIX', () => {
    it('equals pteInterpolationVariable', () => {
      expect(VARIABLE_TYPE_PREFIX).toBe('pteInterpolationVariable')
    })
  })

  describe('extractVariableKeys', () => {
    it('extracts variable keys from blocks', () => {
      const keys = extractVariableKeys(singleVariableBlock)
      expect(keys).toEqual(['firstName'])
    })

    it('extracts multiple variable keys', () => {
      const keys = extractVariableKeys(multipleVariablesBlock)
      expect(keys).toEqual(['firstName', 'lastName', 'email'])
    })

    it('returns empty array for plain text', () => {
      const keys = extractVariableKeys(plainTextBlock)
      expect(keys).toEqual([])
    })
  })

  describe('interpolateToString', () => {
    it('interpolates variable values into text', () => {
      const result = interpolateToString(singleVariableBlock, {firstName: 'Alice'})
      expect(result).toBe('Hello, Alice!')
    })

    it('uses default fallback for missing values', () => {
      const result = interpolateToString(singleVariableBlock, {})
      expect(result).toBe('Hello, {firstName}!')
    })

    it('uses custom fallback for missing values', () => {
      const customFallback: InterpolationFallback = (variableKey) => `[${variableKey}]`
      const result = interpolateToString(singleVariableBlock, {}, customFallback)
      expect(result).toBe('Hello, [firstName]!')
    })
  })

  describe('type exports', () => {
    it('InterpolationValues type works as a record of strings', () => {
      const values: InterpolationValues = {firstName: 'Alice', lastName: 'Smith'}
      expect(values).toEqual({firstName: 'Alice', lastName: 'Smith'})
    })

    it('PortableTextBlockLike type is compatible with fixture blocks', () => {
      const blocks: PortableTextBlockLike[] = singleVariableBlock
      expect(blocks).toHaveLength(1)
    })

    it('PortableTextChild type is compatible with block children', () => {
      const child: PortableTextChild = {
        _type: 'span',
        _key: 'span-1',
        text: 'Hello',
      }
      expect(child._type).toBe('span')
    })

    it('PteInterpolationVariableBlock type is compatible with variable blocks', () => {
      const variableBlock: PteInterpolationVariableBlock = {
        _type: 'pteInterpolationVariable',
        _key: 'var-1',
        variableKey: 'firstName',
      }
      expect(variableBlock.variableKey).toBe('firstName')
    })
  })
})
