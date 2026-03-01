import {TagIcon} from '@sanity/icons'
import {defineArrayMember, defineField} from 'sanity'
import {
  createVariableInlineBlock,
  createVariableKeyInput,
  VariableKeyField,
} from './components/VariableInlineBlock'
import {isStaleVariable, staleVariableMessage} from './isStaleVariable'
import type {InterpolationVariable} from './types'

/** @public */
export const VARIABLE_TYPE_PREFIX = 'pteInterpolationVariable'

/** @public */
export function interpolationVariables(
  variables: InterpolationVariable[],
  block?: ReturnType<typeof defineArrayMember>,
) {
  const variableType = defineArrayMember({
    type: 'object',
    name: VARIABLE_TYPE_PREFIX,
    title: 'Variable',
    icon: TagIcon,
    options: {
      modal: {width: 0},
    },
    fields: [
      defineField({
        name: 'variableKey',
        title: 'Variable',
        type: 'string',
        validation: (rule) => [
          rule.required(),
          rule
            .custom((value) => {
              const variableKey = typeof value === 'string' ? value : undefined
              if (isStaleVariable(variableKey, variables) === false) return true
              return staleVariableMessage(value as string)
            })
            .warning(),
        ],
        components: {
          field: VariableKeyField,
          input: createVariableKeyInput(variables),
        },
      }),
    ],
    components: {
      inlineBlock: createVariableInlineBlock(variables),
    },
  })

  const baseBlock = block ?? defineArrayMember({type: 'block'})

  return {
    ...baseBlock,
    of: [...((baseBlock as {of?: unknown[]}).of ?? []), variableType],
  }
}
