import type {InterpolationVariable} from './types'

export function isStaleVariable(
  variableKey: string | undefined,
  variables: InterpolationVariable[],
): boolean {
  if (typeof variableKey === 'undefined' || variableKey.length === 0) return false
  const hasMatchingVariable = variables.some((variable) => variable.id === variableKey)
  return hasMatchingVariable === false
}

export function staleVariableMessage(variableKey: string): string {
  return `Variable "${variableKey}" is no longer defined. Please select a valid variable.`
}
