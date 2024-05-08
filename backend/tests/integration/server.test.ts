// server.test.ts
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from '../../src/database/DataSource';
import SystemUserController from '../../src/api/controllers/SystemUserController';

// Mock the database and controllers
jest.mock('../../src/database/DataSource', () => ({
  AppDataSource: {
    initialize: jest.fn(),
    destroy: jest.fn(),
    isInitialized: true
  }
}));

jest.mock('../../src/api/controllers/SystemUserController', () => ({
  createUser: jest.fn((req, res) => res.status(201).json({ message: 'User created' })),
  getUserById: jest.fn((req, res) => res.status(200).json({ userID: req.params.userId })),
  updateUser: jest.fn((req, res) => res.status(200).json({ message: 'User updated' })),
  deleteUser: jest.fn((req, res) => res.status(204).end()),
  loginUser: jest.fn((req, res) => res.status(200).json({ message: 'Login successful' })),
  getAllUsers: jest.fn((req, res) => res.status(200).json([{ userID: 1 }, { userID: 2 }])),
  checkEmailExists: jest.fn((req, res) => res.status(200).json({ exists: true }))
}));

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/users', SystemUserController.createUser);
app.get('/users/:userId', SystemUserController.getUserById);
app.put('/users/:userId', SystemUserController.updateUser);
app.delete('/users/:userId', SystemUserController.deleteUser);
app.post('/users/login', SystemUserController.loginUser);
app.get('/users', SystemUserController.getAllUsers);
app.get('/check-email', SystemUserController.checkEmailExists);

describe('Server Endpoints', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  test('POST /users', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      password: 'password'
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User created' });
  });

  test('GET /users/:userId', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userID: '1' });
  });

  test('PUT /users/:userId', async () => {
    const response = await request(app).put('/users/1').send({ name: 'Jane Doe' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User updated' });
  });

  test('DELETE /users/:userId', async () => {
    const response = await request(app).delete('/users/1');
    expect(response.status).toBe(204);
  });

  test('POST /users/login', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'john@example.com',
      password: 'password'
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Login successful' });
  });

  test('GET /users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ userID: 1 }, { userID: 2 }]);
  });

  test('GET /check-email', async () => {
    const response = await request(app).get('/check-email').query({ email: 'john@example.com' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });
});

export {};
