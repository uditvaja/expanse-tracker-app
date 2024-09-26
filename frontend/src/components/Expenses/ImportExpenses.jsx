// src/components/Expenses/ImportExpenses.js
import React, { useState } from 'react';
import api from '../../api';
import { Container, Title, Button, Input } from './styledComponents';

const ImportExpenses = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/expenses/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(`Successfully imported ${response.data.length} expenses.`);
    } catch (error) {
      setMessage('Error importing expenses. Please check your file format.');
      console.error('Import error:', error);
    }
  };

  return (
    <Container>
      <Title>Import Expenses</Title>
      <form onSubmit={handleSubmit}>
        <Input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
        />
        <Button type="submit">Import</Button>
      </form>
      {message && <p>{message}</p>}
    </Container>
  );
};

export default ImportExpenses;
