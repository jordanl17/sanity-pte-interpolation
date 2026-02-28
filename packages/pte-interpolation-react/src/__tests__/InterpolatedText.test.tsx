import {describe, expect, it} from 'vitest'
import {InterpolatedText} from '../InterpolatedText'

describe('InterpolatedText', () => {
  it('should be defined', () => {
    expect(InterpolatedText).toBeDefined()
    expect(typeof InterpolatedText).toBe('function')
  })
})
