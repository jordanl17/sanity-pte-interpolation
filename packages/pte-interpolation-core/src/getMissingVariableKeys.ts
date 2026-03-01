import {extractVariableKeys} from './extractVariableKeys'
import type {InterpolationValues, PortableTextBlockLike} from './types'

/** @public */
export function getMissingVariableKeys(
  blocks: PortableTextBlockLike[],
  values: InterpolationValues,
): string[] {
  return extractVariableKeys(blocks).filter((key) => values[key] === undefined)
}
