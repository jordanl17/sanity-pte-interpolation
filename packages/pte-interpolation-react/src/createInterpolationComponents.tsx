import type {PortableTextComponents, PortableTextTypeComponentProps} from '@portabletext/react'

import {VARIABLE_TYPE_PREFIX} from './constants'
import type {
  InterpolationFallback,
  InterpolationValues,
  PteInterpolationVariableBlock,
} from './types'

function defaultFallback(variableKey: string): string {
  return `{${variableKey}}`
}

/** @public */
export function createInterpolationComponents(
  values: InterpolationValues,
  fallback: InterpolationFallback = defaultFallback,
): PortableTextComponents {
  function VariableComponent(props: PortableTextTypeComponentProps<PteInterpolationVariableBlock>) {
    const {variableKey} = props.value
    const resolvedValue =
      values[variableKey] !== undefined ? values[variableKey] : fallback(variableKey)

    return <span data-variable-key={variableKey}>{resolvedValue}</span>
  }

  return {
    types: {
      [VARIABLE_TYPE_PREFIX]: VariableComponent,
    },
  }
}
