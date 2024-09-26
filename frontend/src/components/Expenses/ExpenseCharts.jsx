import React from 'react';
import { LineChart, Line, PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api';
import { Card, ChartContainer, Title, Button, Container } from './styledComponents';
import { Link } from 'react-router-dom';

const ExpenseCharts = () => {
  const [expenses, setExpenses] = React.useState([]);

  React.useEffect(() => {
    const fetchExpenses = async () => {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    };
    fetchExpenses();
  }, []);

  const monthlyData = expenses.map(exp => ({ name: exp.date.split('T')[0], value: exp.amount }));
  const categoryData = Object.entries(expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {})).map(([category, value]) => ({ name: category, value }));

  return (
    <Container>
      <Title>Expense Charts</Title>
      <Link to="/">
        <Button>Back to Dashboard</Button>
      </Link>
      <ChartContainer>
        <Card>
          <Title>Monthly Expenses</Title>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <Line type="monotone" dataKey="value" stroke="#007bff" />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Title>Category Breakdown</Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" fill="#007bff" />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </ChartContainer>
    </Container>
  );
};

export default ExpenseCharts;
