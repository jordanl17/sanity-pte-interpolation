import {PortableText} from '@portabletext/react'
import {useMemo} from 'react'

import {useInterpolationValues} from './InterpolationContext'
import {createInterpolationComponents} from './createInterpolationComponents'
import type {InterpolatedPortableTextProps} from './types'

/** @public */
export function InterpolatedPortableText({
  interpolationValues: interpolationValuesProp,
  components: userComponents,
  fallback: fallbackProp,
  ...rest
}: InterpolatedPortableTextProps) {
  const contextValue = useInterpolationValues()

  const mergedComponents = useMemo(() => {
    const resolvedValues = interpolationValuesProp ?? contextValue?.interpolationValues ?? {}
    const resolvedFallback = fallbackProp ?? contextValue?.fallback
    const interpolationComponents = createInterpolationComponents(resolvedValues, resolvedFallback)

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
  }, [interpolationValuesProp, contextValue, fallbackProp, userComponents])

  return <PortableText {...rest} components={mergedComponents} />
}
