import {PortableText} from '@portabletext/react'
import {useMemo} from 'react'

import {createInterpolationComponents} from './createInterpolationComponents'
import type {InterpolatedPortableTextProps} from './types'

/** @public */
export function InterpolatedPortableText({
  interpolationValues,
  components: userComponents,
  fallback,
  ...rest
}: InterpolatedPortableTextProps) {
  const mergedComponents = useMemo(() => {
    const interpolationComponents = createInterpolationComponents(interpolationValues, fallback)

    if (!userComponents) {
      return interpolationComponents
    }

    return {
      ...userComponents,
      types: {
        ...userComponents.types,
        ...interpolationComponents.types,
      },
    }
  }, [interpolationValues, fallback, userComponents])

  return <PortableText {...rest} components={mergedComponents} />
}
