import { Request, Response } from 'express';
import { SystemUserController } from '../../../src/api/controllers/SystemUserController';
import { SystemUserService } from '../../../src/services/SystemUserService';
import { DataSource } from 'typeorm';

// Mock SystemUserService methods (ex: mockService.createUser.mockResolvedValue(mockUser))
jest.mock('../../../src/services/SystemUserService');

const mockRequest = (body: any = {}, params: any = {}, query: any = {}) => ({
  body,
  params,
  query
}) as unknown as Request;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('SystemUserController', () => {
  let controller: SystemUserController;
  let mockService: jest.Mocked<SystemUserService>;
  
  beforeEach(() => {
    const dataSource = new DataSource( {type: 'postgres' } ); // Just a placeholder
    mockService = new SystemUserService(dataSource) as jest.Mocked<SystemUserService>;
    controller = new SystemUserController();
    controller.systemUserService = mockService; // Injecting the mocked service
  });

  describe('createUser', () => {
    it('should create a user and return 201 status', async () => {
      const req = mockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        password: 'password'
      });
      const res = mockResponse();
      const mockUser = {
        userID: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        password: 'hashedpassword'
      };

      mockService.createUser.mockResolvedValue(mockUser);

      await controller.createUser(req, res);

      expect(mockService.createUser).toHaveBeenCalledWith('John Doe', 'john@example.com', 'user', 'password');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 status if required fields are missing', async () => {
      const req = mockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password' // Missing role
      });
      const res = mockResponse();

      await controller.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Missing required fields" });
    });

    it('should handle exceptions by returning 500 status', async () => {
      const req = mockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        password: 'password'
      });
      const res = mockResponse();
      const error = new Error('Internal Server Error');

      mockService.createUser.mockRejectedValue(error);

      await controller.createUser(req, res);

      expect(mockService.createUser).toHaveBeenCalledWith('John Doe', 'john@example.com', 'user', 'password');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const req = { params: { userId: '1' } } as any;
      const res = mockResponse();
      const expectedUser = { userID: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', password: 'pass123' };
  
      mockService.findUserByID.mockResolvedValue(expectedUser);
  
      await controller.getUserById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedUser);
    });
  
  
    it('should return 404 if user not found', async () => {
      const req = { params: { userId: '1' } } as any;
      const res = mockResponse();
  
      mockService.findUserByID.mockResolvedValue(null);
  
      await controller.getUserById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it('should handle exceptions by returning 500 status', async () => {
        const req = { params: { userId: '1' } } as any;
        const res = mockResponse();
        const error = new Error('Database failure');
    
        // Simulate a rejection caused by a database error
        mockService.findUserByID.mockRejectedValue(error);
    
        await controller.getUserById(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: error.message });
      });

  });
  
  describe('updateUserName', () => {
    it('should update user name successfully', async () => {
      const req = mockRequest({ newName: 'New Name' }, { userId: '1' });
      const res = mockResponse();
  
      await controller.updateUserName(req, res);
  
      expect(mockService.updateUserName).toHaveBeenCalledWith(1, 'New Name');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User name updated successfully" });
    });
  
    it('should return 400 if new name is not provided', async () => {
      const req = mockRequest({}, { userId: '1' });  // newName is missing
      const res = mockResponse();
  
      await controller.updateUserName(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "New name must be provided" });
    });
  
    it('should handle exceptions by returning 500 status', async () => {
      const req = mockRequest({ newName: 'New Name' }, { userId: '1' });
      const res = mockResponse();
      const error = new Error('Internal Server Error');
  
      mockService.updateUserName.mockRejectedValue(error);
  
      await controller.updateUserName(req, res);
  
      expect(mockService.updateUserName).toHaveBeenCalledWith(1, 'New Name');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const req = mockRequest({}, { userId: '1' });
      const res = mockResponse();
    
      mockService.deleteSystemUser.mockResolvedValue();
      await controller.deleteUser(req, res);
  
      expect(mockService.deleteSystemUser).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  
    it('should handle exceptions by returning 500 status', async () => {
      const req = mockRequest({}, { userId: '1' });
      const res = mockResponse();
      const error = new Error('Deletion Failed');
  
      mockService.deleteSystemUser.mockRejectedValue(error);
  
      await controller.deleteUser(req, res);
  
      expect(mockService.deleteSystemUser).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('loginUser', () => {
    it('should login successfully', async () => {
      const req = mockRequest({ email: 'user@example.com', password: 'password123' });
      const res = mockResponse();
  
      mockService.loginUser.mockResolvedValue(true);
  
      await controller.loginUser(req, res);
  
      expect(mockService.loginUser).toHaveBeenCalledWith('user@example.com', 'password123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Login successful", isAuthenticated: true });
    });
  
    it('should return 401 if credentials are incorrect', async () => {
      const req = mockRequest({ email: 'user@example.com', password: 'wrongpassword' });
      const res = mockResponse();
      const error = new Error('Invalid credentials');
  
      mockService.loginUser.mockRejectedValue(error);
  
      await controller.loginUser(req, res);
  
      expect(mockService.loginUser).toHaveBeenCalledWith('user@example.com', 'wrongpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });

    it('should return 400 if password is not provided', async () => {
        const req = mockRequest({ email: 'user@example.com' }); // Missing password
        const res = mockResponse();

        await controller.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Email and password must be provided" });
    });

    it('should return 400 if email is not provided', async () => {
        const req = mockRequest({ password: 'password' }); // Missing email
        const res = mockResponse();

        await controller.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Email and password must be provided" });
    });

  });

  describe('getAllUsers', () => {
    it('should return users with default pagination if no parameters are provided', async () => {
      const req = mockRequest({}, {}, { query: {} }); // Ensure query is empty to use defaults
      const res = mockResponse();
      const mockUsers = [
        { userID: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', password: 'securepass' },
        { userID: 2, name: 'Bob', email: 'bob@example.com', role: 'user', password: 'securepass' }
      ];
  
      mockService.retrieveAllUsers.mockResolvedValue(mockUsers);
  
      await controller.getAllUsers(req, res);
  
      expect(mockService.retrieveAllUsers).toHaveBeenCalledWith(1, 10);  // Default values
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockUsers, page: 1, limit: 10 });
    });
  
    it('should return users with specified pagination', async () => {
      const req = mockRequest({}, {}, { page: '2', limit: '5' });
      const res = mockResponse();
      const mockUsers = [
          { userID: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user', password: 'securepass' }
      ];
  
      mockService.retrieveAllUsers.mockResolvedValue(mockUsers);
  
      await controller.getAllUsers(req, res);
  
      expect(mockService.retrieveAllUsers).toHaveBeenCalledWith(2, 5);  // Checks the specific values
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockUsers, page: 2, limit: 5 });
    });
  
  
    it('should handle no users found with specified pagination', async () => {
      const req = mockRequest({}, {}, { page: '3', limit: '5' });
      const res = mockResponse();
  
      mockService.retrieveAllUsers.mockResolvedValue([]);
  
      await controller.getAllUsers(req, res);
  
      expect(mockService.retrieveAllUsers).toHaveBeenCalledWith(3, 5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: [], page: 3, limit: 5 });
    });
  
    it('should handle internal server errors gracefully', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Internal server error');
  
      mockService.retrieveAllUsers.mockRejectedValue(error);
  
      await controller.getAllUsers(req, res);
  
      expect(mockService.retrieveAllUsers).toHaveBeenCalledWith(1, 10);  // Default values
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('updateUser', () => {
    it('should update user details successfully', async () => {
      const req = mockRequest({
        name: 'Updated Name',
        email: 'updated@example.com',
        role: 'admin',
        password: 'newpassword'
      }, { userId: '1' });
      const res = mockResponse();
  
      mockService.updateUserName.mockResolvedValue();
      mockService.updateUserEmail.mockResolvedValue();
      mockService.updateUserRole.mockResolvedValue();
      mockService.updateUserPassword.mockResolvedValue();
  
      await controller.updateUser(req, res);
  
      expect(mockService.updateUserName).toHaveBeenCalledWith(1, 'Updated Name');
      expect(mockService.updateUserEmail).toHaveBeenCalledWith(1, 'updated@example.com');
      expect(mockService.updateUserRole).toHaveBeenCalledWith(1, 'admin');
      expect(mockService.updateUserPassword).toHaveBeenCalledWith(1, 'newpassword');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully.' });
    });
  
    it('should return 200 if no user details are provided', async () => {
      const req = mockRequest({}, { userId: '1' }); // No body provided
      const res = mockResponse();
  
      await controller.updateUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully.'});
    });
  
    it('should handle missing user ID', async () => {
      const req = mockRequest({
        name: 'Updated Name'
      }); // Missing userId
      const res = mockResponse();
  
      await controller.updateUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User ID is required.' });
    });
  
    it('should handle exceptions', async () => {
      const req = mockRequest({
        name: 'Updated Name'
      }, { userId: '1' });
      const res = mockResponse();
      const error = new Error('Internal Server Error');
  
      mockService.updateUserName.mockRejectedValue(error);
  
      await controller.updateUser(req, res);
  
      expect(mockService.updateUserName).toHaveBeenCalledWith(1, 'Updated Name');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('checkEmailExists', () => {
    it('should return true when email exists', async () => {
      const req = mockRequest({}, {}, { email: 'existing@example.com' });
      const res = mockResponse();
      mockService.emailExists.mockResolvedValue(true);
  
      await controller.checkEmailExists(req, res);
  
      expect(mockService.emailExists).toHaveBeenCalledWith('existing@example.com');
      expect(res.json).toHaveBeenCalledWith({ exists: true });
    });
  
    it('should return false when email does not exist', async () => {
      const req = mockRequest({}, {}, { email: 'nonexistent@example.com' });
      const res = mockResponse();
      mockService.emailExists.mockResolvedValue(false);
  
      await controller.checkEmailExists(req, res);
  
      expect(mockService.emailExists).toHaveBeenCalledWith('nonexistent@example.com');
      expect(res.json).toHaveBeenCalledWith({ exists: false });
    });
  
    it('should return 400 if email parameter is not provided', async () => {
      const req = mockRequest();  // No email query parameter
      const res = mockResponse();
  
      await controller.checkEmailExists(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email parameter is required' });
    });
  
    it('should handle exceptions and return 500 status', async () => {
      const req = mockRequest({}, {}, { email: 'test@example.com' });
      const res = mockResponse();
      const error = new Error('Internal server error');
  
      mockService.emailExists.mockRejectedValue(error);
  
      await controller.checkEmailExists(req, res);
  
      expect(mockService.emailExists).toHaveBeenCalledWith('test@example.com');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error checking email existence", errorMessage: error.message });
    });
  });

});