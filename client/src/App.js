import React, { useState } from 'react';
import { Container, Navbar, Nav, Tab, Tabs } from 'react-bootstrap';
import TranslationForm from './components/TranslationForm';
import DictionaryManagement from './components/DictionaryManagement';

function App() {
  const [key, setKey] = useState('translate');

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Arabi Juba ↔ English Translator</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#translate" onClick={() => setKey('translate')}>Translate</Nav.Link>
              <Nav.Link href="#dictionary" onClick={() => setKey('dictionary')}>Dictionary</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Tabs
          id="main-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="translate" title="Translate">
            <TranslationForm />
          </Tab>
          <Tab eventKey="dictionary" title="Dictionary Management">
            <DictionaryManagement />
          </Tab>
        </Tabs>
      </Container>
      
      <footer className="bg-light text-center text-muted py-4 mt-5">
        <Container>
          <p>Arabi Juba ↔ English Translator</p>
          <p className="small">© {new Date().getFullYear()}</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;