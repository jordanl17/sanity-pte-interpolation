import {describe, expect, it} from 'vitest'
import {pteInterpolation} from '../plugin'

describe('pteInterpolation', () => {
  it('should return a valid plugin definition', () => {
    const plugin = pteInterpolation()
    expect(plugin).toBeDefined()
    expect(plugin.name).toBe('sanity-plugin-pte-interpolation')
  })

  it('should accept configuration options', () => {
    const plugin = pteInterpolation({
      variables: [{name: 'userName', defaultValue: 'Guest'}],
    })
    expect(plugin).toBeDefined()
    expect(plugin.name).toBe('sanity-plugin-pte-interpolation')
  })
})
