import {createContext, useContext, useMemo} from 'react'

import type {InterpolationFallback, InterpolationValues, InterpolationProviderProps} from './types'

interface InterpolationContextValue {
  interpolationValues: InterpolationValues
  fallback?: InterpolationFallback
}

const InterpolationContext = createContext<InterpolationContextValue | undefined>(undefined)

/** @public */
export function InterpolationProvider({
  interpolationValues,
  fallback,
  children,
}: InterpolationProviderProps) {
  const contextValue = useMemo(
    () => ({interpolationValues, fallback}),
    [interpolationValues, fallback],
  )
  return (
    <InterpolationContext.Provider value={contextValue}>{children}</InterpolationContext.Provider>
  )
}

/** @public */
export function useInterpolationValues(): InterpolationContextValue | undefined {
  return useContext(InterpolationContext)
}
