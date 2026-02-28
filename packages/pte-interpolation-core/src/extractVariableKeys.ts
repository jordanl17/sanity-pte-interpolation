import {VARIABLE_TYPE_PREFIX} from './constants'
import type {PortableTextBlockLike} from './types'

/** @public */
export function extractVariableKeys(blocks: PortableTextBlockLike[]): string[] {
  const seen = new Set<string>()

  return blocks.reduce<string[]>((keys, block) => {
    const children = block.children ?? []

    return children.reduce((accumulated, child) => {
      if (child._type !== VARIABLE_TYPE_PREFIX) return accumulated

      const variableKey = child.variableKey
      if (typeof variableKey !== 'string') return accumulated
      if (seen.has(variableKey)) return accumulated

      seen.add(variableKey)
      return [...accumulated, variableKey]
    }, keys)
  }, [])
}
