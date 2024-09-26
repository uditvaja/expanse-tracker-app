import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Container, Button, Title, Input } from './styledComponents';
import Autosuggest from 'react-autosuggest';

const AddExpense = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [allCategories, setAllCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.get('/expenses');
      const categories = response.data.map(expense => expense.category);
      setAllCategories([...new Set(categories)]);
    };
    fetchCategories();
  }, []);

  const handleSuggestionsFetchRequested = ({ value }) => {
    const filteredCategories = allCategories.filter(cat =>
      cat.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredCategories);
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = suggestion => <div>{suggestion}</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/expenses', { amount, description, date, category, paymentMethod });
    // Clear form after submission
    setAmount('');
    setDescription('');
    setDate('');
    setCategory('');
    setPaymentMethod('cash');
  };

  return (
    <Container>
      <Title>Add Expense</Title>
      <form onSubmit={handleSubmit}>
        <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <Input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={handleSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            placeholder: 'Category',
            value: category,
            onChange: (e, { newValue }) => setCategory(newValue)
          }}
        />
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ padding: '10px', borderRadius: '4px', margin: '5px 0', width: '100%' }}>
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
        </select>
        <Button type="submit">Add Expense</Button>
      </form>
    </Container>
  );
};

export default AddExpense;
