import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import UpdateExpense from './components/Expenses/UpdateExpense';
import ExpenseList from './components/Expenses/ExpenseList';
import ExpenseCharts from './components/Expenses/ExpenseCharts';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update-expense/:id" element={<UpdateExpense />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/charts" element={<ExpenseCharts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
