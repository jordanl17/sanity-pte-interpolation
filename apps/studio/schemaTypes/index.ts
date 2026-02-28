import {defineType, defineField} from 'sanity'
import {interpolationVariables} from 'sanity-plugin-pte-interpolation'

const testDocument = defineType({
  name: 'testDocument',
  title: 'Test Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        interpolationVariables([
          {id: 'firstName', name: 'First name', description: 'First name of the recipient'},
          {id: 'lastName', name: 'Last name', description: 'Last name of the recipient'},
          {id: 'email', name: 'Email address', description: 'Email address of the recipient'},
        ]),
      ],
    }),
  ],
})

export const schemaTypes = [testDocument]
