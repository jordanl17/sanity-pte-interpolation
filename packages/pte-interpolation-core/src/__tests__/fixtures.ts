import type {PortableTextBlockLike} from '../types'

export const singleVariableBlock: PortableTextBlockLike[] = [
  {
    _type: 'block',
    _key: 'block-1',
    children: [
      {_type: 'span', _key: 'span-1', text: 'Hello, '},
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'span', _key: 'span-2', text: '!'},
    ],
  },
]

export const multipleVariablesBlock: PortableTextBlockLike[] = [
  {
    _type: 'block',
    _key: 'block-1',
    children: [
      {_type: 'span', _key: 'span-1', text: 'Name: '},
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'span', _key: 'span-2', text: ' '},
      {_type: 'pteInterpolationVariable', _key: 'var-2', variableKey: 'lastName'},
      {_type: 'span', _key: 'span-3', text: ', Email: '},
      {_type: 'pteInterpolationVariable', _key: 'var-3', variableKey: 'email'},
    ],
  },
]

export const plainTextBlock: PortableTextBlockLike[] = [
  {
    _type: 'block',
    _key: 'block-1',
    children: [{_type: 'span', _key: 'span-1', text: 'No variables here.'}],
  },
]

export const consecutiveVariablesBlock: PortableTextBlockLike[] = [
  {
    _type: 'block',
    _key: 'block-1',
    children: [
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'pteInterpolationVariable', _key: 'var-2', variableKey: 'lastName'},
    ],
  },
]

export const multiBlockContent: PortableTextBlockLike[] = [
  {
    _type: 'block',
    _key: 'block-1',
    children: [
      {_type: 'span', _key: 'span-1', text: 'Dear '},
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'span', _key: 'span-2', text: ','},
    ],
  },
  {
    _type: 'block',
    _key: 'block-2',
    children: [
      {_type: 'span', _key: 'span-3', text: 'Your email is '},
      {_type: 'pteInterpolationVariable', _key: 'var-2', variableKey: 'email'},
      {_type: 'span', _key: 'span-4', text: '.'},
    ],
  },
]

export const duplicateVariableBlock: PortableTextBlockLike[] = [
  {
    _type: 'block',
    _key: 'block-1',
    children: [
      {_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 'firstName'},
      {_type: 'span', _key: 'span-1', text: ' and '},
      {_type: 'pteInterpolationVariable', _key: 'var-2', variableKey: 'firstName'},
    ],
  },
]

export const blockWithNoChildren: PortableTextBlockLike[] = [{_type: 'block', _key: 'block-1'}]

export const blockWithNonStringVariableKey: PortableTextBlockLike[] = [
  {
    _type: 'block',
    _key: 'block-1',
    children: [{_type: 'pteInterpolationVariable', _key: 'var-1', variableKey: 123} as never],
  },
]

export const emptyBlocksContent: PortableTextBlockLike[] = []
