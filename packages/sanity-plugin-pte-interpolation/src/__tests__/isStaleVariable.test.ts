import {describe, expect, it} from 'vitest'
import {isStaleVariable} from '../isStaleVariable'
import type {InterpolationVariable} from '../types'

const testVariables: InterpolationVariable[] = [
  {id: 'firstName', name: 'First name'},
  {id: 'email', name: 'Email address'},
]

describe('isStaleVariable', () => {
  it('returns false when variableKey is undefined', () => {
    expect(isStaleVariable(undefined, testVariables)).toBe(false)
  })

  it('returns false when variableKey is empty string', () => {
    expect(isStaleVariable('', testVariables)).toBe(false)
  })

  it('returns false when variableKey matches a variable id', () => {
    expect(isStaleVariable('firstName', testVariables)).toBe(false)
  })

  it('returns true when variableKey matches no variable id', () => {
    expect(isStaleVariable('removed', testVariables)).toBe(true)
  })

  it('returns true when variables array is empty', () => {
    expect(isStaleVariable('anything', [])).toBe(true)
  })
})
