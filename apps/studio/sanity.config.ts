import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {pteInterpolation} from 'sanity-plugin-pte-interpolation'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'PTE Interpolation Dev',
  projectId: 'i2zyueht',
  dataset: 'production',
  plugins: [structureTool(), visionTool(), pteInterpolation()],
  schema: {
    types: schemaTypes,
  },
})
