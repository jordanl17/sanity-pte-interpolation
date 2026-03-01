export {InterpolatedPortableText} from './InterpolatedPortableText'
export {InterpolationProvider, useInterpolationValues} from './InterpolationContext'
export {createInterpolationComponents} from './createInterpolationComponents'
export {VARIABLE_TYPE_PREFIX} from './constants'
export {
  extractVariableKeys,
  getMissingVariableKeys,
  interpolateToString,
} from 'pte-interpolation-core'
export type {
  InterpolatedPortableTextProps,
  InterpolationFallback,
  InterpolationProviderProps,
  InterpolationValues,
  PteInterpolationVariableBlock,
} from './types'
export type {PortableTextBlockLike, PortableTextChild} from 'pte-interpolation-core'
