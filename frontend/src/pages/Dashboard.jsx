import React from 'react';
import AddExpense from '../components/Expenses/AddExpense';
import { Container, Button } from '../components/Expenses/styledComponents';
import { Link } from 'react-router-dom';
import ImportExpenses from '../components/Expenses/ImportExpenses';
const Dashboard = () => {
  return (
    <Container>
      <h1>Expense Dashboard</h1>
      <AddExpense />
      <ImportExpenses /> 
      <Link to="/expenses">
        <Button>View Expense List</Button>
      </Link>
      <Link to="/charts">
        <Button>View Expense Charts</Button>
      </Link>
    </Container>
  );
};

export default Dashboard;
