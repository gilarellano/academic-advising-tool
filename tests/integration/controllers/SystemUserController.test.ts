// SystemUserController.ts
import { Request, Response } from 'express';
import { SystemUserController } from '../../../src/api/controllers/SystemUserController';
import { SystemUserService } from '../../../src/services/SystemUserService';
import { DataSource } from 'typeorm';
import { SystemUser } from '../../../src/models';

// Mock SystemUserService including createUser directly on the service
jest.mock('../../../src/services/SystemUserService', () => {
    const mockUserRepository = {
      findUserById: jest.fn(),
      updateUserName: jest.fn(),
      deleteSystemUser: jest.fn(),
      // createUser is NOT here because it's on the service directly
    };
    return {
      SystemUserService: jest.fn().mockImplementation(() => {
        return {
            userRepository: mockUserRepository,
            createUser: jest.fn(),  // createUser is mocked directly on the service
            loginUser: jest.fn()
        };
      })
    };
});


jest.mock('typeorm', () => {
  const original = jest.requireActual('typeorm');
  return {
    __esModule: true,
    ...original,
    DataSource: jest.fn().mockImplementation(() => ({
      initialize: jest.fn()
    }))
  };
});

// Mock Request and Response objects
const mockRequest = (body: any = {}, params: any = {}) => ({
  body,
  params,
  get: jest.fn()
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
  //let mockService = SystemUserService;
  
  beforeEach(() => {
    const dataSource = new DataSource({type: 'postgres'}); // This is just a placeholder
    //mockService = new SystemUserService(dataSource);
    mockService = new SystemUserService(dataSource) as jest.Mocked<SystemUserService>;
    controller = new SystemUserController(); // Assuming controller uses a singleton pattern or DI is handled elsewhere
    controller.systemUserService = mockService;
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
      const mockUser: SystemUser = {
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
      const expectedUser = { userID: 1, name: 'Alice', email: 'alice@example.com' };
  
      (mockService.userRepository.findUserById as jest.Mock).mockResolvedValue(expectedUser);
  
      await controller.getUserById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedUser);
    });
  
    it('should return 404 if user not found', async () => {
      const req = { params: { userId: '1' } } as any;
      const res = mockResponse();
  
      (mockService.userRepository.findUserById as jest.Mock).mockResolvedValue(null);
  
      await controller.getUserById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it('should handle exceptions by returning 500 status', async () => {
        const req = { params: { userId: '1' } } as any;
        const res = mockResponse();
        const error = new Error('Database failure');
    
        // Simulate a rejection caused by a database error
        (mockService.userRepository.findUserById as jest.Mock).mockRejectedValue(error);
    
        await controller.getUserById(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: error.message });
      });

  });

  describe('updateUserName', () => {
    it('should update user name successfully', async () => {
      const req = mockRequest({ newName: 'New Name' }, { userId: '1' });
      const res = mockResponse();
  
      //(mockService.userRepository.updateUserName as jest.Mock).mockResolvedValue();
      //mockService.userRepository.up
  
      await controller.updateUserName(req, res);
  
      expect(mockService.userRepository.updateUserName).toHaveBeenCalledWith(1, 'New Name');
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
  
      (mockService.userRepository.updateUserName as jest.Mock).mockRejectedValue(error);
  
      await controller.updateUserName(req, res);
  
      expect(mockService.userRepository.updateUserName).toHaveBeenCalledWith(1, 'New Name');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const req = mockRequest({}, { userId: '1' });
      const res = mockResponse();
  
      //mockService.userRepository.deleteSystemUser.mockResolvedValue();
  
      await controller.deleteUser(req, res);
  
      expect(mockService.userRepository.deleteSystemUser).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  
    it('should handle exceptions by returning 500 status', async () => {
      const req = mockRequest({}, { userId: '1' });
      const res = mockResponse();
      const error = new Error('Deletion Failed');
  
      //mockService.userRepository.deleteSystemUser.mockRejectedValue(error);
      (mockService.userRepository.deleteSystemUser as jest.Mock).mockRejectedValue(error);

  
      await controller.deleteUser(req, res);
  
      expect(mockService.userRepository.deleteSystemUser).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('loginUser', () => {
    it('should login successfully', async () => {
      const req = mockRequest({ email: 'user@example.com', password: 'password123' });
      const res = mockResponse();
  
      mockService.loginUser.mockResolvedValue(true);
      //(mockService.userRepository.findUserById as jest.Mock).mockResolvedValue(null);

  
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
  
});