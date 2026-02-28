import {definePlugin} from 'sanity'
import type {PteInterpolationPluginConfig} from './types'

/** @public */
export const pteInterpolation = definePlugin<PteInterpolationPluginConfig | void>((_config) => {
  return {
    name: 'sanity-plugin-pte-interpolation',
  }
})
