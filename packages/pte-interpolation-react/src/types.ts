import type {PortableTextBlock} from '@portabletext/react'

/** @public */
export type InterpolationValues = Record<string, string>

/** @public */
export interface InterpolatedTextProps {
  blocks: PortableTextBlock[]
  values: InterpolationValues
}
