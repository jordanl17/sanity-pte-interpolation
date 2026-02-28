import {PortableText} from '@portabletext/react'
import type {PortableTextBlock, PortableTextComponents} from '@portabletext/react'
import {Card, Container, Flex, Heading, Label, Spinner, Stack, Text, TextInput} from '@sanity/ui'
import type {InterpolationValues} from 'pte-interpolation-react'
import {createInterpolationComponents, InterpolatedPortableText} from 'pte-interpolation-react'
import {type ReactNode, useEffect, useMemo, useState} from 'react'

import {InterpolationMetadata} from './InterpolationMetadata'
import {sanityClient} from './sanityClient'

interface TestDocument {
  _id: string
  title: string
  body: PortableTextBlock[]
}

const VARIABLE_FIELDS = ['firstName', 'lastName', 'email'] as const

const DEFAULT_VALUES: InterpolationValues = {
  firstName: 'Test firstname',
  lastName: 'Test lastname',
  email: 'test-test@email.com',
}

function BlockFallback({children}: {children?: ReactNode}) {
  return <Text size={2}>{children}</Text>
}

const baseComponents: PortableTextComponents = {
  block: {
    normal: BlockFallback,
    h1: ({children}) => (
      <Heading as="h1" size={3}>
        {children}
      </Heading>
    ),
    h2: ({children}) => (
      <Heading as="h2" size={2}>
        {children}
      </Heading>
    ),
    h3: ({children}) => (
      <Heading as="h3" size={1}>
        {children}
      </Heading>
    ),
    h4: ({children}) => (
      <Heading as="h4" size={0}>
        {children}
      </Heading>
    ),
    h5: BlockFallback,
    h6: BlockFallback,
    blockquote: ({children}) => (
      <Card paddingLeft={3} borderLeft>
        <Text size={2} muted>
          {children}
        </Text>
      </Card>
    ),
  },
  marks: {
    strong: ({children}) => <strong>{children}</strong>,
    em: ({children}) => <em>{children}</em>,
  },
}

const diyComponents: PortableTextComponents = {
  ...baseComponents,
  block: {
    ...baseComponents.block,
    normal: ({children}) => (
      <Card padding={2} radius={2} tone="primary">
        <Text size={2}>{children}</Text>
      </Card>
    ),
  } as PortableTextComponents['block'],
}

export function App() {
  const [documents, setDocuments] = useState<TestDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState<InterpolationValues>(DEFAULT_VALUES)

  useEffect(() => {
    sanityClient
      .fetch<TestDocument[]>('*[_type == "testDocument"]{ _id, title, body }')
      .then(setDocuments)
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false))
  }, [])

  function handleInputChange(field: string, inputValue: string) {
    setValues((previous) => ({...previous, [field]: inputValue}))
  }

  return (
    <Container width={2} padding={4}>
      <Stack space={5}>
        <Heading as="h1" size={3}>
          PTE Interpolation Test
        </Heading>

        <Flex wrap="wrap" gap={3}>
          {VARIABLE_FIELDS.map((field) => (
            <Stack key={field} space={2} style={{flex: '1 1 10rem'}}>
              <Label size={1}>{field}</Label>
              <TextInput
                value={values[field] ?? ''}
                onChange={(event) => handleInputChange(field, event.currentTarget.value)}
              />
            </Stack>
          ))}
        </Flex>

        {loading && (
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text muted>Loading documents...</Text>
          </Flex>
        )}

        {error && (
          <Card padding={3} radius={2} tone="critical">
            <Text>Error: {error}</Text>
          </Card>
        )}

        {loading === false && documents.length === 0 && error === null && (
          <Text muted>No test documents found. Create some in the Studio.</Text>
        )}

        {documents.length > 0 && (
          <>
            <Section
              title="InterpolatedPortableText"
              description="High-level API that handles component merging for you."
            >
              {documents.map((document) => (
                <DocumentCard
                  key={document._id}
                  title={document.title}
                  body={document.body}
                  values={values}
                >
                  <InterpolatedPortableText
                    value={document.body}
                    interpolationValues={values}
                    components={baseComponents}
                  />
                </DocumentCard>
              ))}
            </Section>

            <Section
              title="createInterpolationComponents"
              description="Low-level API to merge interpolation with custom block/mark renderers via your own PortableText setup."
            >
              {documents.map((document) => (
                <DiyDocumentCard key={document._id} document={document} values={values} />
              ))}
            </Section>

            <Section
              title="Core Utilities (Raw JS)"
              description="Framework-agnostic utilities from pte-interpolation-core. No React rendering involved - just plain string output."
            >
              {documents.map((document) => (
                <DocumentCard
                  key={document._id}
                  title={document.title}
                  body={document.body}
                  values={values}
                  metadataOnly
                />
              ))}
            </Section>
          </>
        )}
      </Stack>
    </Container>
  )
}

interface SectionProps {
  title: string
  description: string
  children: ReactNode
}

function Section({title, description, children}: SectionProps) {
  return (
    <Card borderTop paddingTop={5}>
      <Stack space={4}>
        <Stack space={2}>
          <Heading as="h2" size={2}>
            {title}
          </Heading>
          <Text size={1} muted>
            {description}
          </Text>
        </Stack>
        <Stack space={3}>{children}</Stack>
      </Stack>
    </Card>
  )
}

interface DocumentCardProps {
  title: string
  body: PortableTextBlock[]
  values: InterpolationValues
  children?: ReactNode
  metadataOnly?: boolean
}

function DocumentCard({title, body, values, children, metadataOnly}: DocumentCardProps) {
  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={3}>
        <Heading as="h3" size={1}>
          {title}
        </Heading>
        {body ? (
          <Stack space={3}>
            {metadataOnly === true ? null : children}
            <InterpolationMetadata
              body={body}
              values={values}
              showPlainText={metadataOnly === true}
            />
          </Stack>
        ) : (
          <Text muted>No body content</Text>
        )}
      </Stack>
    </Card>
  )
}

interface DiyDocumentCardProps {
  document: TestDocument
  values: InterpolationValues
}

function DiyDocumentCard({document, values}: DiyDocumentCardProps) {
  const mergedComponents = useMemo(() => {
    const interpolation = createInterpolationComponents(values)

    return {
      ...diyComponents,
      types: {
        ...diyComponents.types,
        ...interpolation.types,
      },
    }
  }, [values])

  return (
    <DocumentCard title={document.title} body={document.body} values={values}>
      <PortableText value={document.body} components={mergedComponents} />
    </DocumentCard>
  )
}
