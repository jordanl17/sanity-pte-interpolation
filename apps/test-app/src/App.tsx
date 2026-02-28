import {InterpolatedText} from 'pte-interpolation-react'

const sampleBlocks = [
  {
    _type: 'block',
    _key: 'block-1',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'span-1',
        text: 'Hello, {{userName}}! Welcome to {{siteName}}.',
        marks: [],
      },
    ],
  },
]

const sampleValues = {
  userName: 'World',
  siteName: 'PTE Interpolation Demo',
}

export function App() {
  return (
    <div style={{padding: '2rem', fontFamily: 'system-ui, sans-serif'}}>
      <h1>PTE Interpolation Test App</h1>
      <InterpolatedText blocks={sampleBlocks} values={sampleValues} />
    </div>
  )
}
