// SystemUserService.test.ts
import { DataSource } from 'typeorm';
import { SystemUser } from '../../../src/models';  
import { SystemUserService } from '../../../src/services/SystemUserService';
import { SystemUserRepository } from '../../../src/repositories/SystemUserRepository';
import * as security from '../../../src/utils/security';

// Setup global mocks
jest.mock('../../../src/repositories/SystemUserRepository');
jest.mock('../../../src/utils/security', () => ({
  ...jest.requireActual('../../../src/utils/security'),
  comparePassword: jest.fn()
}));
jest.mock('typeorm', () => {
  const original = jest.requireActual('typeorm');
  return {
    __esModule: true,
    ...original,
    DataSource: jest.fn(() => ({
      createQueryRunner: () => mockQueryRunner
    }))
  };
});

// Global variables for mocks
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn()
};

describe('SystemUserService', () => {
  let userService: SystemUserService;
  let dataSource: DataSource;
  let mockUserRepository: jest.Mocked<SystemUserRepository>;

  beforeEach(() => {
    dataSource = new DataSource({
      type: "postgres"
      //host: process.env.DB_HOST,
      //port: parsePort(process.env.DB_PORT),
      //username: process.env.DB_USERNAME,
      //password: process.env.DB_PASSWORD,
      //database: process.env.DB_DATABASE,
      //synchronize: true,
      //logging: false
    });
    mockUserRepository = new SystemUserRepository(dataSource) as any;
    userService = new SystemUserService(dataSource);
    userService.userRepository = mockUserRepository;
  });

  describe('User Creation and Updates', () => {
    const mockUser: SystemUser = {
      userID: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      password: 'hashedpassword'
    };

    it('creates a user successfully and commits the transaction', async () => {
      mockUserRepository.createSystemUser.mockResolvedValue(mockUser);
      const user = await userService.createUser('John Doe', 'john@example.com', 'user', 'password');
      expect(mockUserRepository.createSystemUser).toHaveBeenCalledWith('John Doe', 'john@example.com', 'user', 'password', expect.anything());
      expect(user).toEqual(mockUser);
    });

    it('handles errors by rolling back the transaction on user creation', async () => {
      const error = new Error('Database failure');
      mockUserRepository.createSystemUser.mockRejectedValue(error);
      await expect(userService.createUser('John Doe', 'john@example.com', 'user', 'password'))
        .rejects.toThrow('Database failure');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    describe('Updates', () => {
      it('updates user name successfully', async () => {
        await userService.updateUserName(1, 'New Name');
        expect(mockUserRepository.updateUserName).toHaveBeenCalledWith(1, 'New Name');
      });

      it('updates user email and commits transaction', async () => {
        await userService.updateUserEmail(1, 'new@example.com');
        expect(mockUserRepository.updateUserEmail).toHaveBeenCalledWith(1, 'new@example.com', expect.anything());
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      });

      it('updates user role successfully', async () => {
        await userService.updateUserRole(1, 'admin');
        expect(mockUserRepository.updateUserRole).toHaveBeenCalledWith(1, 'admin');
      });

      it('updates user password and commits transaction', async () => {
        await userService.updateUserPassword(1, 'newPassword');
        expect(mockUserRepository.updateUserPassword).toHaveBeenCalledWith(1, 'newPassword', expect.anything());
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      });

      it('should handle errors by rolling back the transaction when updating password', async () => {
        const error = new Error('Update failed');
        mockUserRepository.updateUserPassword.mockRejectedValue(error);
  
        await expect(userService.updateUserPassword(1, 'newPassword')).rejects.toThrow('Update failed');
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      });

      it('should handle errors by rolling back the transaction when updating email', async () => {
        const error = new Error('Update failed');
        mockUserRepository.updateUserEmail.mockRejectedValue(error);
  
        await expect(userService.updateUserEmail(1, 'new@example.com')).rejects.toThrow('Update failed');
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      });
    });

    describe('Finds User', () =>{
      it('returns a user when found by ID', async () => {
        mockUserRepository.findUserById.mockResolvedValue(mockUser);
        const user = await userService.findUserByID(1);
        expect(mockUserRepository.findUserById).toHaveBeenCalledWith(1);
        expect(user).toEqual(mockUser);
      });

      it('returns null when no user is found', async () => {
        mockUserRepository.findUserById.mockResolvedValue(null);
        const user = await userService.findUserByID(999);
        expect(mockUserRepository.findUserById).toHaveBeenCalledWith(999);
        expect(user).toEqual(null);
      });
    });

    describe('deleteSystemUser', () => {
      it('successfully deletes a user and commits the transaction', async () => {
        mockUserRepository.deleteSystemUser.mockResolvedValue();
        await userService.deleteSystemUser(1);
        expect(mockUserRepository.deleteSystemUser).toHaveBeenCalledWith(1, expect.anything());
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      });

      it('handles error by rolling back the transaction when user to delete is not found', async () => {
        const error = new Error('User not found');
        mockUserRepository.deleteSystemUser.mockRejectedValue(error);
        await expect(userService.deleteSystemUser(999)).rejects.toThrow('User not found');
        expect(mockUserRepository.deleteSystemUser).toHaveBeenCalledWith(999, expect.anything());
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      });
    });
  });

  describe('User Authentication', () => {
    const mockUser: SystemUser = {
      userID: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      password: 'hashedpassword'
    };

    it('throws an error if the email does not exist', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      await expect(userService.loginUser('nonexistent@example.com', 'password')).rejects.toThrow("Invalid credentials");
    });

    it('throws an error if the password does not match', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      (security.comparePassword as jest.Mock).mockResolvedValue(false);
      await expect(userService.loginUser('john@example.com', 'wrongpassword')).rejects.toThrow("Invalid credentials");
    });

    it('returns true when email exists and password matches', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      (security.comparePassword as jest.Mock).mockResolvedValue(true);
      const loginSuccess = await userService.loginUser('john@example.com', 'correctpassword');
      expect(loginSuccess).toBe(true);
    });
  });

  describe('Retrieve All Users', () => {
    const mockUsers: SystemUser[] = [
      { userID: 1, name: 'John Doe', email: 'john@example.com', role: 'user', password: 'hashedpassword' },
      { userID: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'admin', password: 'hashedpassword' }
    ];

    it('successfully retrieves all users with pagination', async () => {
      mockUserRepository.findAllUsers.mockResolvedValue(mockUsers);
      const users = await userService.retrieveAllUsers(1, 2);
      expect(mockUserRepository.findAllUsers).toHaveBeenCalledWith(1, 2);
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });

    it('returns an empty array if no users are found', async () => {
      mockUserRepository.findAllUsers.mockResolvedValue([]);
      const users = await userService.retrieveAllUsers(2, 2);
      expect(mockUserRepository.findAllUsers).toHaveBeenCalledWith(2, 2);
      expect(users).toEqual([]);
      expect(users.length).toBe(0);
    });
  });

});
