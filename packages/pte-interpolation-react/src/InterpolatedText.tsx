import type {InterpolatedTextProps} from './types'

/** @public */
export function InterpolatedText({blocks, values}: InterpolatedTextProps) {
  return (
    <pre>
      <code>{JSON.stringify({blocks, values}, null, 2)}</code>
    </pre>
  )
}
