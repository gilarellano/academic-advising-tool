// server.ts
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database/DataSource';
import SystemUserController from './api/controllers/SystemUserController';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' })); // Frontend URL
app.use(express.json());

// Initialize the database
AppDataSource.initialize().then(() => {
    console.log('Data Source Initialized');

    // User routes
    app.post('/users', SystemUserController.createUser);
    app.get('/users/:userId', SystemUserController.getUserById);
    app.put('/users/:userId', SystemUserController.updateUserName);
    app.delete('/users/:userId', SystemUserController.deleteUser);
    app.post('/users/login', SystemUserController.loginUser);
    app.get('/users', SystemUserController.getAllUsers);
    app.get('/check-email', SystemUserController.checkEmailExists);

    // Start server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(error => console.log('Error during Data Source initialization', error));
