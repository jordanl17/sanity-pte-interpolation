import type {PortableTextBlock} from '@portabletext/react'

export const singleVariableBlock: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'block-1',
    style: 'normal',
    markDefs: [],
    children: [
      {_type: 'span', _key: 'span-1', text: 'Hello, ', marks: []},
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'span', _key: 'span-2', text: '!', marks: []},
    ],
  },
]

export const multipleVariablesBlock: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'block-1',
    style: 'normal',
    markDefs: [],
    children: [
      {_type: 'span', _key: 'span-1', text: 'Name: ', marks: []},
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'span', _key: 'span-2', text: ' ', marks: []},
      {_type: 'pteInterpolationVariable', _key: 'var-2', variableKey: 'lastName'},
      {_type: 'span', _key: 'span-3', text: ', Email: ', marks: []},
      {_type: 'pteInterpolationVariable', _key: 'var-3', variableKey: 'email'},
    ],
  },
]

export const plainTextBlock: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'block-1',
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: 'span-1', text: 'No variables here.', marks: []}],
  },
]

export const variableOnlyBlock: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'block-1',
    style: 'normal',
    markDefs: [],
    children: [{_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'}],
  },
]

export const consecutiveVariablesBlock: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'block-1',
    style: 'normal',
    markDefs: [],
    children: [
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'pteInterpolationVariable', _key: 'var-2', variableKey: 'lastName'},
    ],
  },
]

export const styledTextWithVariableBlock: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'block-1',
    style: 'normal',
    markDefs: [],
    children: [
      {_type: 'span', _key: 'span-1', text: 'Welcome ', marks: ['strong']},
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'span', _key: 'span-2', text: ' aboard', marks: ['em']},
    ],
  },
]

export const emptyBlocksContent: PortableTextBlock[] = []

export const multiBlockContent: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'block-1',
    style: 'normal',
    markDefs: [],
    children: [
      {_type: 'span', _key: 'span-1', text: 'Dear ', marks: []},
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'span', _key: 'span-2', text: ',', marks: []},
    ],
  },
  {
    _type: 'block',
    _key: 'block-2',
    style: 'normal',
    markDefs: [],
    children: [
      {_type: 'span', _key: 'span-3', text: 'Your email is ', marks: []},
      {_type: 'pteInterpolationVariable', _key: 'var-2', variableKey: 'email'},
      {_type: 'span', _key: 'span-4', text: '.', marks: []},
    ],
  },
]
