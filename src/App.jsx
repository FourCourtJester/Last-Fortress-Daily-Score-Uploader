// Import core
import { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'

// Import Custom
import { Table } from 'components'
import { parse } from './toolkits/parse'

// Import Assets
import 'scss/site.scss'

function App() {
  // States
  const [data, setData] = useState({})
  // Refs
  const $options = {
    $daily: useRef(null),
    $weekly: useRef(null),
    $donations: useRef(null),
    $members: useRef(null)
  }

  const handleOption = (e) => {
    location.hash = e.target.value
  }

  const handleFile = async (e) => {
    setData(await parse(e.target.files[0]))
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
                <Button variant="outline-success" type="submit" disabled>Submit</Button>
              </InputGroup>
              <div className="text-end mt-2">
                <Form.Check ref={$options.$daily} id="daily" label="Daily" type="radio" name="report" value="daily" inline defaultChecked={true} onChange={handleOption} />
                <Form.Check ref={$options.$weekly} id="weekly" label="Weekly" type="radio" name="report" value="weekly"  inline onChange={handleOption} />
                <Form.Check ref={$options.$total} id="score" label="Daily &amp; Weekly" type="radio" name="report" value="score"  inline onChange={handleOption} />
                <Form.Check ref={$options.$donations} id="donations" label="Donations" type="radio" name="report" value="donations" inline onChange={handleOption} />
                <Form.Check ref={$options.$members} id="members" label="Members" type="radio" name="report" value="members" inline onChange={handleOption} />
              </div>
            </Form>
          </Col>
        </Row>
        <Table data={data} />
    </Container>
  )
}

export default App
