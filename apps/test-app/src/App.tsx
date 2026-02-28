import {PortableText} from '@portabletext/react'
import type {PortableTextBlock, PortableTextComponents} from '@portabletext/react'
import type {InterpolationValues} from 'pte-interpolation-react'
import {createInterpolationComponents, InterpolatedPortableText} from 'pte-interpolation-react'
import {useEffect, useMemo, useState} from 'react'

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
    <div
      style={{
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h1>PTE Interpolation Test</h1>

      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap'}}>
        {VARIABLE_FIELDS.map((field) => (
          <label key={field} style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
            <span style={{fontSize: '0.875rem', fontWeight: 600}}>{field}</span>
            <input
              type="text"
              value={values[field] ?? ''}
              onChange={(event) => handleInputChange(field, event.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
          </label>
        ))}
      </div>

      {loading && <p>Loading documents...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}

      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        {documents.map((document) => (
          <div
            key={document._id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#fafafa',
            }}
          >
            <h2 style={{margin: '0 0 0.75rem', fontSize: '1.125rem'}}>{document.title}</h2>
            {document.body ? (
              <InterpolatedPortableText value={document.body} interpolationValues={values} />
            ) : (
              <p style={{color: '#999', fontStyle: 'italic'}}>No body content</p>
            )}
          </div>
        ))}
      </div>

      {!loading && documents.length === 0 && !error && (
        <p style={{color: '#666'}}>No test documents found. Create some in the Studio.</p>
      )}

      {documents.length > 0 && <DiySection documents={documents} values={values} />}
    </div>
  )
}

const customComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => (
      <p
        style={{
          margin: '0.25rem 0',
          padding: '0.5rem',
          backgroundColor: '#e8f4f8',
          borderRadius: '4px',
        }}
      >
        {children}
      </p>
    ),
    h1: ({children}) => (
      <h1 style={{color: '#1a5276', borderBottom: '2px solid #1a5276', paddingBottom: '0.25rem'}}>
        {children}
      </h1>
    ),
    h2: ({children}) => <h2 style={{color: '#2e86c1'}}>{children}</h2>,
  },
  marks: {
    strong: ({children}) => <strong style={{color: '#c0392b'}}>{children}</strong>,
    em: ({children}) => <em style={{fontStyle: 'italic', color: '#7d3c98'}}>{children}</em>,
  },
}

interface DiySectionProps {
  documents: TestDocument[]
  values: InterpolationValues
}

function DiySection({documents, values}: DiySectionProps) {
  const mergedComponents = useMemo(() => {
    const interpolation = createInterpolationComponents(values)

    return {
      ...customComponents,
      types: {
        ...customComponents.types,
        ...interpolation.types,
      },
    }
  }, [values])

  return (
    <div style={{marginTop: '3rem', borderTop: '2px solid #ddd', paddingTop: '2rem'}}>
      <h2 style={{margin: '0 0 0.5rem'}}>Advanced: createInterpolationComponents</h2>
      <p style={{color: '#666', margin: '0 0 1.5rem', fontSize: '0.875rem'}}>
        Uses the low-level API to merge interpolation with custom block/mark renderers via your own
        PortableText setup.
      </p>

      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        {documents.map((document) => (
          <div
            key={document._id}
            style={{
              border: '2px dashed #2e86c1',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#fdfefe',
            }}
          >
            <h3 style={{margin: '0 0 0.75rem', fontSize: '1.125rem'}}>{document.title}</h3>
            {document.body ? (
              <PortableText value={document.body} components={mergedComponents} />
            ) : (
              <p style={{color: '#999', fontStyle: 'italic'}}>No body content</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
