import { DataSource } from 'typeorm';
import { SystemUser } from '../../../src/models';  // Assuming SystemUser is exported from models
import { SystemUserService } from '../../../src/services/SystemUserService';
import { SystemUserRepository } from '../../../src/repositories/SystemUserRepository';
import { parsePort } from '../../../src/utils/config';
import * as securityUtils from '../../../src/utils/security';
import { comparePassword } from '../../../src/utils/security';
import * as entities from '../../../src/models';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Global scope variable for the queryRunner mock
const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn()
};


// Mock the repository and query runner
jest.mock('../../../src/repositories/SystemUserRepository');
jest.mock('../../../src/utils/security', () => ({
  comparePassword: jest.fn()
}));
jest.mock('typeorm', () => {
  const originalModule = jest.requireActual('typeorm');

  return {
    __esModule: true,
    ...originalModule,
    DataSource: jest.fn().mockImplementation(() => ({
      createQueryRunner: () => mockQueryRunner
      //({
        //connect: jest.fn(),
        //startTransaction: jest.fn(),
        //commitTransaction: jest.fn(),
        //rollbackTransaction: jest.fn(),
        //release: jest.fn()
      //})
    }))
  };
});

describe('SystemUserService', () => {
  let userService: SystemUserService;
  let dataSource: DataSource;
  let mockUserRepository: jest.Mocked<SystemUserRepository>;

  beforeEach(() => {
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parsePort(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: false
    });  // This will now use the mocked DataSource
    mockUserRepository = new SystemUserRepository(dataSource) as any;
    userService = new SystemUserService(dataSource);
    userService.userRepository = mockUserRepository;  // Inject the mock
  });

  describe('createUser', () => {
    const mockUser: SystemUser = {
      userID: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      password: 'hashedpassword'
    };

    it('should successfully create a user and commit the transaction', async () => {
      mockUserRepository.createSystemUser.mockResolvedValue(mockUser);

      const user = await userService.createUser('John Doe', 'john@example.com', 'user', 'password');

      expect(mockUserRepository.createSystemUser).toHaveBeenCalledWith('John Doe', 'john@example.com', 'user', 'password', expect.anything());
      expect(user).toEqual(mockUser);
    });

    it('should handle errors by rolling back the transaction', async () => {
      const error = new Error('Database failure');
      mockUserRepository.createSystemUser.mockRejectedValue(error);

      await expect(userService.createUser('John Doe', 'john@example.com', 'user', 'password'))
        .rejects.toThrow('Database failure');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('updateUserName', () => {
    it('should successfully update user name', async () => {
      mockUserRepository.updateUserName.mockResolvedValue(undefined); // Assuming it returns void

      await userService.updateUserName(1, 'New Name');
      expect(mockUserRepository.updateUserName).toHaveBeenCalledWith(1, 'New Name');
    });
  });

  describe('updateUserEmail', () => {
    it('should successfully update user email and commit transaction', async () => {
      mockUserRepository.updateUserEmail.mockResolvedValue(undefined);

      await userService.updateUserEmail(1, 'new@example.com');
      expect(mockUserRepository.updateUserEmail).toHaveBeenCalledWith(1, 'new@example.com', expect.anything());
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should handle errors by rolling back the transaction when updating email', async () => {
      const error = new Error('Update failed');
      mockUserRepository.updateUserEmail.mockRejectedValue(error);

      await expect(userService.updateUserEmail(1, 'new@example.com')).rejects.toThrow('Update failed');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('updateUserRole', () => {
    it('should successfully update user role', async () => {
      mockUserRepository.updateUserRole.mockResolvedValue(undefined);

      await userService.updateUserRole(1, 'admin');
      expect(mockUserRepository.updateUserRole).toHaveBeenCalledWith(1, 'admin');
    });
  });

  describe('updateUserPassword', () => {
    it('should successfully update user password and commit transaction', async () => {
      mockUserRepository.updateUserPassword.mockResolvedValue(undefined);

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
  });

  describe('loginUser', () => {
    const mockUser: SystemUser = {
      userID: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      password: 'hashedpassword'
    };

    it('should throw an error if the email does not exist', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      await expect(userService.loginUser('user@example.com', 'password'))
        .rejects.toThrow("Invalid credentials");
    });

    it('should throw an error if the password is incorrect', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      securityUtils.comparePassword.mockResolvedValue(false);

      await expect(userService.loginUser('user@example.com', 'wrongPassword'))
        .rejects.toThrow("Invalid credentials");
    });

    it('should return true if the email exists and the password matches', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      securityUtils.comparePassword.mockResolvedValue(true);

      const result = await userService.loginUser('user@example.com', 'correctPassword');
      expect(result).toBe(true);
    });
  });

});
