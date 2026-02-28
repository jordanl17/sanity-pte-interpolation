import type {PortableTextComponents, PortableTextProps} from '@portabletext/react'

/** @public */
export type InterpolationValues = Record<string, string>

/** @public */
export type InterpolationFallback = (variableKey: string) => string

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
