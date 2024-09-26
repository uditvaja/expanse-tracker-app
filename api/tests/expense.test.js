const request = require('supertest');
const app = require('../index');
let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'john@example.com', password: 'password123' });
  token = res.body.token;
});

describe('Expense CRUD Operations', () => {
  let expenseId;

  it('should create a new expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 100,
        description: 'Groceries',
        date: '2023-09-25',
        category: 'Food',
        paymentMethod: 'cash'
      });
    expenseId = res.body._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should get all expenses', async () => {
    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
  });

  it('should update an expense', async () => {
    const res = await request(app)
      .patch(`/api/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 150 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.amount).toEqual(150);
  });

  it('should delete an expense', async () => {
    const res = await request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
