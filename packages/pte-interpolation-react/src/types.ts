import type {PortableTextComponents, PortableTextProps} from '@portabletext/react'
import type {InterpolationFallback, InterpolationValues} from 'pte-interpolation-core'

export type {InterpolationFallback, InterpolationValues} from 'pte-interpolation-core'

/** @public */
export interface PteInterpolationVariableBlock {
  _type: 'pteInterpolationVariable'
  _key: string
  variableKey: string
}

/** @public */
export interface InterpolatedPortableTextProps extends Omit<PortableTextProps, 'components'> {
  interpolationValues: InterpolationValues
  components?: PortableTextComponents
  fallback?: InterpolationFallback
}
