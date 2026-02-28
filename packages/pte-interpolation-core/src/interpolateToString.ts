import {VARIABLE_TYPE_PREFIX} from './constants'
import type {InterpolationFallback, InterpolationValues, PortableTextBlockLike} from './types'

function defaultFallback(variableKey: string): string {
  return `{${variableKey}}`
}

/** @public */
export function interpolateToString(
  blocks: PortableTextBlockLike[],
  values: InterpolationValues,
  fallback: InterpolationFallback = defaultFallback,
): string {
  return blocks
    .map((block) => {
      const children = block.children ?? []

      return children
        .map((child) => {
          if (child._type === VARIABLE_TYPE_PREFIX) {
            const variableKey = child.variableKey as string
            return values[variableKey] !== undefined ? values[variableKey] : fallback(variableKey)
          }

          return typeof child.text === 'string' ? child.text : ''
        })
        .join('')
    })
    .join('\n')
}
