import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import styled from 'styled-components';

// Styled Components
const FormWrapper = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 24px;
`;

const UpdateExpense = () => {
  const [expense, setExpense] = useState({
    amount: '',
    description: '',
    date: '',
    category: '',
    paymentMethod: 'cash',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const fetchExpense = async () => {
    try {
      const response = await api.get(`/expenses/${id}`);
      const fetchedExpense = response.data;
      setExpense({
        ...fetchedExpense,
        date: formatDate(fetchedExpense.date),
      });
    } catch (error) {
      alert('Failed to fetch the expense. Please try again.');
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/expenses/${id}`, expense);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to update the expense. Please try again.');
    }
  };

  return (
    <FormWrapper>
      <Title>Update Expense</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="number"
          placeholder="Amount"
          value={expense.amount}
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Description"
          value={expense.description}
          onChange={(e) => setExpense({ ...expense, description: e.target.value })}
          required
        />
        <Input
          type="date"
          placeholder="Date"
          value={expense.date}
          onChange={(e) => setExpense({ ...expense, date: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Category"
          value={expense.category}
          onChange={(e) => setExpense({ ...expense, category: e.target.value })}
          required
        />
        <Select
          value={expense.paymentMethod}
          onChange={(e) => setExpense({ ...expense, paymentMethod: e.target.value })}
        >
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
        </Select>
        <Button type="submit">Update Expense</Button>
      </form>
    </FormWrapper>
  );
};

export default UpdateExpense;
