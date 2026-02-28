/** @public */
export interface PortableTextChild {
  _type: string
  _key?: string
  text?: string
  variableKey?: string
}

/** @public */
export interface PortableTextBlockLike {
  _type: string
  _key?: string
  children?: PortableTextChild[]
}

/** @public */
export interface PteInterpolationVariableBlock {
  _type: 'pteInterpolationVariable'
  _key: string
  variableKey: string
}

/** @public */
export type InterpolationValues = Record<string, string>

/** @public */
export type InterpolationFallback = (variableKey: string) => string
