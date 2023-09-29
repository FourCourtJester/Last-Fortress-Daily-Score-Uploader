// Import core
import { useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap'

// Import custom
import { parse } from './toolkits/parse'

// Import assets
import 'scss/site.scss'

const captions = ['Daily', 'Weekly']

function App() {
  // States
  const [weekly, setWeekly] = useState([])
  const [daily, setDaily] = useState([])

  const handleFile = async (e) => {
    const data = await parse(e.target.files[0])

    setDaily(data.daily)
    setWeekly(data.weekly)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center pt-2 pb-1 w-100 h-100">
        <Row className="top mb-1 w-100">
          <Col>
            <img src="/logo.png" />
            <Form className="border border-secondary rounded bg-dark p-2 w-100" onSubmit={handleSubmit}>
              <InputGroup size="lg">
                <InputGroup.Text>Daily Score File</InputGroup.Text>
                <Form.Control type="file" accept=".txt, .json" onChange={handleFile} />
                <Button variant="outline-success" type="submit">Parse</Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      {[daily, weekly].map((tbl, i) =>
        tbl.length > 0 && (
          <Row className="bottom py-1 w-100 overflow-hidden" key={captions[i]}>
            <Col className="h-100">
              <div className="border border-secondary rounded bg-dark h-100 overflow-auto" >
                <Table className="caption-top" hover striped borderless>
                  <caption className="px-2">{captions[i]}</caption>
                  <thead>
                    <tr>
                      {Object.keys(tbl[0]).map((title) => (<th key={title}>{title}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.map((entry) => (
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
        )
      )}
    </Container>
  )
}

export default App
