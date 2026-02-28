import {defineArrayMember} from 'sanity'
import {describe, expect, it} from 'vitest'
import {interpolationVariables, VARIABLE_TYPE_PREFIX} from '../interpolationVariables'

const testVariables = [
  {id: 'firstName', name: 'First name', description: 'First name of the recipient'},
  {id: 'email', name: 'Email address'},
]

describe('interpolationVariables', () => {
  it('should return a block definition with type block', () => {
    const result = interpolationVariables(testVariables)

    expect(result).toMatchObject({type: 'block'})
  })

  it('should include a single pteInterpolationVariable type in the block of array', () => {
    const result = interpolationVariables(testVariables)
    const ofArray = result.of as Array<Record<string, unknown>>

    expect(ofArray).toHaveLength(1)
    expect(ofArray[0]).toMatchObject({
      type: 'object',
      name: VARIABLE_TYPE_PREFIX,
    })
  })

  it('should set the title to Variable', () => {
    const result = interpolationVariables(testVariables)
    const ofArray = result.of as Array<Record<string, unknown>>

    expect(ofArray[0]).toMatchObject({title: 'Variable'})
  })

  it('should set an icon on the variable type', () => {
    const result = interpolationVariables(testVariables)
    const ofArray = result.of as Array<Record<string, unknown>>

    expect(ofArray[0].icon).toBeDefined()
  })

  it('should have a variableKey string field without options.list', () => {
    const result = interpolationVariables(testVariables)
    const ofArray = result.of as Array<{fields?: Array<Record<string, unknown>>}>
    const fields = ofArray[0].fields

    expect(fields).toHaveLength(1)
    expect(fields?.[0]).toMatchObject({
      name: 'variableKey',
      type: 'string',
    })
    expect((fields?.[0] as Record<string, unknown>)?.options).toBeUndefined()
  })

  it('should set required validation on the variableKey field', () => {
    const result = interpolationVariables(testVariables)
    const ofArray = result.of as Array<{fields?: Array<Record<string, unknown>>}>
    const variableKeyField = ofArray[0].fields?.[0]

    expect(variableKeyField?.validation).toBeTypeOf('function')
  })

  it('should register both field and input component overrides on the variableKey field', () => {
    const result = interpolationVariables(testVariables)
    const ofArray = result.of as Array<{
      fields?: Array<{components?: Record<string, unknown>}>
    }>
    const variableKeyField = ofArray[0].fields?.[0]

    expect(variableKeyField?.components?.field).toBeTypeOf('function')
    expect(variableKeyField?.components?.input).toBeTypeOf('function')
  })

  it('should attach an inlineBlock component to the variable type', () => {
    const result = interpolationVariables(testVariables)
    const ofArray = result.of as Array<{components?: {inlineBlock?: unknown}}>

    expect(ofArray[0].components?.inlineBlock).toBeTypeOf('function')
  })

  it('should merge the variable type into a custom block of array', () => {
    const customBlock = defineArrayMember({
      type: 'block',
      of: [{type: 'image' as const}],
    })
    const result = interpolationVariables(testVariables, customBlock)
    const ofArray = result.of as Array<Record<string, unknown>>

    expect(ofArray).toHaveLength(2)
    expect(ofArray[0]).toMatchObject({type: 'image'})
    expect(ofArray[1]).toMatchObject({
      type: 'object',
      name: VARIABLE_TYPE_PREFIX,
    })
  })
})
