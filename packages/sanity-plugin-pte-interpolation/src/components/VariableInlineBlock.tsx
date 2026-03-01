import {SearchIcon, WarningOutlineIcon} from '@sanity/icons'
import {Autocomplete, Badge, Box, Card, Flex, Text} from '@sanity/ui'
import {useCallback, useId} from 'react'
import {set, unset} from 'sanity'
import type {BlockProps, FieldProps, InputProps} from 'sanity'
import {isStaleVariable, staleVariableMessage} from '../isStaleVariable'
import type {InterpolationVariable} from '../types'

interface VariableOption {
  value: string
  name: string
  description?: string
}

export function VariableKeyField(props: FieldProps) {
  return <>{props.children}</>
}

export function createVariableKeyInput(variables: InterpolationVariable[]) {
  const options: VariableOption[] = variables.map((variable) => ({
    value: variable.id,
    name: variable.name,
    description: variable.description,
  }))

  return function VariableKeyInput(props: InputProps) {
    const autocompleteId = useId()
    const selectedVariable = variables.find((variable) => variable.id === props.value)
    const variableKey = typeof props.value === 'string' ? props.value : undefined
    const stale = isStaleVariable(variableKey, variables)

    const handleChange = useCallback(
      (selectedValue: string) => {
        props.onChange(selectedValue ? set(selectedValue) : unset())
      },
      [props],
    )

    const filterOption = useCallback((query: string, option: VariableOption) => {
      return option.name.toLowerCase().includes(query.toLowerCase())
    }, [])

    const renderOption = useCallback((option: VariableOption) => {
      return (
        <Card as="button" padding={3}>
          <Text size={1} weight="medium">
            {option.name}
          </Text>
          {option.description && (
            <Box marginTop={2}>
              <Text size={0} muted>
                {option.description}
              </Text>
            </Box>
          )}
        </Card>
      )
    }, [])

    const renderValue = useCallback((_value: string, option?: VariableOption) => {
      if (option) return option.name
      const matchedOption = options.find((candidate) => candidate.value === _value)
      return matchedOption?.name ?? _value
    }, [])

    return (
      <>
        <Autocomplete
          id={autocompleteId}
          options={options}
          value={variableKey}
          onChange={handleChange}
          filterOption={filterOption}
          renderOption={renderOption}
          renderValue={renderValue}
          openButton
          icon={SearchIcon}
          placeholder="Search variables..."
          fontSize={1}
          padding={3}
          customValidity={stale && variableKey ? staleVariableMessage(variableKey) : undefined}
        />
        {stale && variableKey && (
          <Card tone="caution" padding={3} marginTop={2} radius={2}>
            <Flex align="center" gap={2}>
              <Text size={1}>
                <WarningOutlineIcon />
              </Text>
              <Text size={1}>{staleVariableMessage(variableKey)}</Text>
            </Flex>
          </Card>
        )}
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
    const stale = isStaleVariable(variableKey, variables)

    return props.renderDefault({
      ...props,
      renderPreview: () => (
        <Box padding={2}>
          <Flex align="center" gap={2}>
            <Text size={0} weight="medium">
              {variable?.name ?? variableKey ?? 'Select variable'}
            </Text>
            {stale && (
              <Badge tone="caution" fontSize={0}>
                Stale
              </Badge>
            )}
          </Flex>
        </Box>
      ),
    })
  }
}
