import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'i2zyueht',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})
