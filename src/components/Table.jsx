// Import Core
import { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'

// Import Custom
import { parse } from 'toolkits/hash'

// Import Assets
import fields from 'fields.json'

export function InteractiveTable({ data = {} }) {
  const [keys, setKeys] = useState(fields.daily)
  const [report, setReport] = useState('daily')

  const handleHashChange = () => setReport(parse(location.hash))

  useEffect(() => {
    setKeys(fields[report])
  }, [report])

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange, false);

    return () => window.removeEventListener("hashchange", handleHashChange, false);
  }, [])

  if (!Object.keys(data).length) return null

  return (
    <Row className="bottom py-1 w-100 overflow-hidden">
      <Col className="h-100">
        <div className="border border-secondary rounded bg-dark h-100 overflow-auto" >
          <Table className="caption-top" hover striped borderless>
            <caption className="text-uppercase px-2">{report}</caption>
            <thead>
              <tr>
                {keys.map((k) => (<th key={k}>{k}</th>))}
              </tr>
            </thead>
            <tbody>
              {data[report].map((entry, i) => (
                <tr key={entry.uid}>
                  {keys.map((k) => (
                    <td key={k}>{entry[k]}</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Col>
    </Row>
  )
}