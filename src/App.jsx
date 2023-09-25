// Import core
import { useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap'

// Import custom
// ...

// Import assets
import 'scss/site.scss'

const START = "{\"rankInfo\":"
const END = "}]}"

function _parse(file, set) {
  const reader = new FileReader()

  reader.addEventListener('load', (e) => {
    try {
      const start = e.target.result.lastIndexOf(START)
      const end = e.target.result.indexOf(END, start)
      const data = JSON.parse(e.target.result.substring(start, end + END.length + 1))

      set(data?.rankInfo.map((entry) => {
        const { uid, score, name, abbr, serverId} = entry
        return { uid, score, name, abbr, serverId}
      }))
    } catch (err) {
      console.error(err)
    }

  })

  reader.readAsText(file)
}

function App() {
  // States
  const [data, setData] = useState([])

  const handleFile = (e) => {
    _parse(e.target.files[0], setData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  console.log(data)

  return (
    <Container className="w-100 h-100">
      <Row className="border border-secondary rounded bg-dark w-100">
        <Col>
          <Form className="p-2 w-100" onSubmit={handleSubmit}>
            <InputGroup size="lg">
              <InputGroup.Text>Daily Score File</InputGroup.Text>
              <Form.Control type="file" accept=".txt, .json" onChange={handleFile} />
              <Button variant="outline-success" type="submit">Parse</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      {data.length > 0 && (
        <Row className="border border-secondary rounded bg-dark mt-2 w-100">
          <Col>
            <div className="overflow-scroll" style={{maxHeight: "418px"}} >
              <Table hover striped borderless>
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((title) => (<th key={title}>{title}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((entry) => (
                    <tr key={entry.uid}>
                      {Object.values(entry).map((stat, i) => (
                        <td key={i}>{stat}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default App
