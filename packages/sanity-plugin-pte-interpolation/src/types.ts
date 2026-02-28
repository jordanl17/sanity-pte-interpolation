/** @public */
export interface InterpolationVariable {
  name: string
  defaultValue?: string
  description?: string
}

/** @public */
export interface PteInterpolationPluginConfig {
  variables?: InterpolationVariable[]
}
