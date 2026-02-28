import {Card, Code, Inline, Label, Stack} from '@sanity/ui'
import type {InterpolationValues, PortableTextBlockLike} from 'pte-interpolation-react'
import {extractVariableKeys, interpolateToString} from 'pte-interpolation-react'

interface InterpolationMetadataProps {
  body: PortableTextBlockLike[]
  values: InterpolationValues
  showPlainText?: boolean
}

export function InterpolationMetadata({body, values, showPlainText}: InterpolationMetadataProps) {
  const variableKeys = extractVariableKeys(body)

  return (
    <Card padding={3} radius={2} tone="transparent" border>
      <Stack space={3}>
        <Inline space={2}>
          <Label size={0}>Extracted variables:</Label>
          <Code size={1}>{variableKeys.length > 0 ? variableKeys.join(', ') : '(none)'}</Code>
        </Inline>
        {showPlainText === true && (
          <Stack space={2}>
            <Label size={0}>Plain text output:</Label>
            <Card padding={3} radius={2} tone="default">
              <Code size={1}>{interpolateToString(body, values)}</Code>
            </Card>
          </Stack>
        )}
      </Stack>
    </Card>
  )
}
