import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import api from '../../api';
import { StyledTable, Button, Title, Card, Container } from './styledComponents';
import { Link } from 'react-router-dom';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedExpense, setEditedExpense] = useState({});

  const fetchExpenses = async () => {
    const response = await api.get('/expenses');
    setExpenses(response.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const columns = React.useMemo(() => [
    { Header: 'Description', accessor: 'description' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'Date', accessor: 'date' },
    { Header: 'Payment Method', accessor: 'paymentMethod' },
  ], []);

  const tableInstance = useTable(
    { columns, data: expenses, initialState: { pageIndex: 0 } },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex }
  } = tableInstance;

  const handleEdit = (id, expense) => {
    setEditingId(id);
    setEditedExpense(expense);
  };

  const handleSave = async (id) => {
    await api.patch(`/expenses/${id}`, editedExpense);
    fetchExpenses();
    setEditingId(null);
  };

  return (
    <Container>
      <Title>Expense List</Title>
      <Link to="/">
        <Button>Back to Dashboard</Button>
      </Link>
      <StyledTable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>
                    {editingId === row.original._id ? (
                      <input
                        type="text"
                        value={editedExpense[cell.column.id] || cell.value}
                        onChange={(e) => setEditedExpense({ ...editedExpense, [cell.column.id]: e.target.value })}
                      />
                    ) : (
                      cell.render('Cell')
                    )}
                  </td>
                ))}
                <td>
                  {editingId === row.original._id ? (
                    <Button onClick={() => handleSave(row.original._id)}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(row.original._id, row.original)}>Edit</Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>

      <div className="d-flex justify-content-between mt-3">
        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </Button>
        <span>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <Button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </Button>
      </div>
    </Container>
  );
};

export default ExpenseList;
