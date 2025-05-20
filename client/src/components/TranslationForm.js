import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { VolumeUp } from 'react-bootstrap-icons';
import '../App.css';
import API_URL from '../utils/api';

const TranslationForm = () => {
  const [input, setInput] = useState('');
  const [translated, setTranslated] = useState('');
  const [direction, setDirection] = useState('en-aj');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTranslated('');
    setError('');
    setLoading(true);

    if (!input.trim()) {
      setError('Please enter a phrase to translate.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/dictionary/translate`, {
        params: {
          phrase: input,
          source: direction === 'en-aj' ? 'english' : 'arabiJuba'
        }
      });

      const data = response.data;

      if (data && (data.englishPhrase || data.arabiJubaPhrase)) {
        if (direction === 'en-aj') {
          setTranslated(`${data.englishPhrase} → ${data.arabiJubaPhrase}`);
        } else {
          setTranslated(`${data.arabiJubaPhrase} → ${data.englishPhrase}`);
        }
      } else {
        setError('Translation not found in dictionary.');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Translation not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <Container fluid className="translation-bg">
      <Card className="mx-auto shadow-lg border-0" style={{ maxWidth: "700px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(6px)" }}>
        <Card.Body>
          <h2 className="mb-4 text-center text-primary fw-bold">🌍 Arabi Juba ↔ English Translator</h2>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Label className="fw-semibold">Translation Direction</Form.Label>
                <Form.Select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                >
                  <option value="en-aj">English → Arabi Juba</option>
                  <option value="aj-en">Arabi Juba → English</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Phrase</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type a phrase..."
                  value={input}
                  autoFocus
                  onChange={(e) => setInput(e.target.value)}
                />
              </Col>
            </Row>

            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="px-4 py-2 fw-semibold rounded-pill"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" role="status" className="me-2" />
                    Translating...
                  </>
                ) : (
                  'Translate'
                )}
              </Button>
            </div>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-4 text-center fw-medium">
              {error}
            </Alert>
          )}

          {translated && (
            <div className="mt-5 p-4 bg-light rounded border shadow-sm animate__animated animate__fadeIn">
              <h5 className="text-success">✅ Translation Result</h5>
              <div className="d-flex align-items-center justify-content-between mt-3">
                <div style={{ fontSize: '1.4rem', color: '#0d6efd' }}>{translated}</div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handlePlayAudio(translated)}
                  title="Play Translation"
                >
                  <VolumeUp />
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TranslationForm;



