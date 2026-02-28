import {Box, Text} from '@sanity/ui'
import type {BlockProps, FieldProps, InputProps} from 'sanity'
import type {InterpolationVariable} from '../types'

export function VariableKeyField(props: FieldProps) {
  return <>{props.children}</>
}

export function createVariableKeyInput(variables: InterpolationVariable[]) {
  return function VariableKeyInput(props: InputProps) {
    const selectedVariable = variables.find((variable) => variable.id === props.value)

    return (
      <>
        {props.renderDefault(props)}
        {selectedVariable?.description && (
          <Box marginTop={2}>
            <Text size={1} muted>
              {selectedVariable.description}
            </Text>
          </Box>
        )}
      </>
    )
  }
}

export function createVariableInlineBlock(variables: InterpolationVariable[]) {
  return function VariableInlineBlock(props: BlockProps) {
    const value = props.value as {variableKey?: string}
    const variableKey = value?.variableKey
    const variable = variables.find((candidate) => candidate.id === variableKey)

    return props.renderDefault({
      ...props,
      renderPreview: () => (
        <Text size={0} weight="medium">
          {variable ? variable.name : (variableKey ?? 'Select variable')}
        </Text>
      ),
    })
  }
}
