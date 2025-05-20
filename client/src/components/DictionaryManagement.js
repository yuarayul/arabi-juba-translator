import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Container, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import API_URL from '../utils/api';

const DictionaryManagement = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    englishPhrase: '',
    arabiJubaPhrase: '',
    category: 'general',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      console.log("Fetching entries from:", `${API_URL}/dictionary`);
      const response = await axios.get(`${API_URL}/dictionary`);
      console.log("Entries response:", response.data);
      setEntries(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching dictionary entries:', err);
      setError('Failed to load dictionary entries');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentEntry({
      englishPhrase: '',
      arabiJubaPhrase: '',
      category: 'general',
      notes: ''
    });
    setIsEditing(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate input
      if (!currentEntry.englishPhrase || !currentEntry.arabiJubaPhrase) {
        setError('English and Arabi Juba phrases are required');
        return;
      }
      
      if (isEditing) {
        console.log("Updating entry:", currentEntry);
        // For editing, use PUT with the ID
        await axios.put(`${API_URL}/dictionary/${currentEntry._id}`, currentEntry);
        setSuccess('Entry updated successfully');
      } else {
        console.log("Adding new entry:", currentEntry);
        // For adding, use POST with the entry data
        await axios.post(`${API_URL}/dictionary`, currentEntry);
        setSuccess('Entry added successfully');
      }
      
      handleModalClose();
      fetchEntries();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving dictionary entry:', err);
      setError('Failed to save entry');
    }
  };

  const handleEdit = (entry) => {
    setCurrentEntry({...entry});
    setIsEditing(true);
    handleModalShow();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        console.log("Deleting entry with ID:", id);
        // Use DELETE method with the entry ID
        await axios.delete(`${API_URL}/dictionary/${id}`);
        fetchEntries();
        setSuccess('Entry deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting entry:', err);
        setError('Failed to delete entry');
      }
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Dictionary Management</h3>
          <Button variant="light" onClick={handleModalShow}>Add New Entry</Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          {loading ? (
            <div className="text-center my-4">Loading...</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>English Phrase</th>
                  <th>Arabi Juba Phrase</th>
                  <th>Category</th>
                  <th width="200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No entries found. Add your first entry!</td>
                  </tr>
                ) : (
                  entries.map(entry => (
                    <tr key={entry._id}>
                      <td>{entry.englishPhrase}</td>
                      <td>{entry.arabiJubaPhrase}</td>
                      <td>{entry.category}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleEdit(entry)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(entry._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Entry Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Entry' : 'Add New Entry'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>English Phrase</Form.Label>
              <Form.Control
                type="text"
                name="englishPhrase"
                value={currentEntry.englishPhrase}
                onChange={handleInputChange}
                placeholder="Enter English phrase"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Arabi Juba Phrase</Form.Label>
              <Form.Control
                type="text"
                name="arabiJubaPhrase"
                value={currentEntry.arabiJubaPhrase}
                onChange={handleInputChange}
                placeholder="Enter Arabi Juba phrase"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={currentEntry.category}
                onChange={handleInputChange}
              >
                <option value="general">General</option>
                <option value="greetings">Greetings</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="emergency">Emergency</option>
                <option value="conversation">Conversation</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={currentEntry.notes}
                onChange={handleInputChange}
                placeholder="Add any additional context or usage notes"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DictionaryManagement;