// SystemUserRepository.test.ts
import { AppDataSource } from '../../../src/database/DataSource';
import { SystemUserRepository } from '../../../src/repositories/SystemUserRepository';
import { QueryRunner } from 'typeorm';

describe('SystemUserRepository Integration Tests', () => {
    let userRepository: SystemUserRepository;
    let queryRunner: QueryRunner;

    beforeAll(async () => {
        await AppDataSource.initialize();
        userRepository = new SystemUserRepository(AppDataSource);
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();
    });

    afterEach(async () => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
    });

    it('should create a system user successfully', async () => {
        const user = await userRepository.createSystemUser('Alice', 'alice@example.com', 'admin', 'password123', queryRunner);
        expect(user.name).toBe('Alice');
        expect(user.email).toBe('alice@example.com');
        expect(user.role).toBe('admin');
        expect(user.password).not.toBe('password123');
    });

    it('should not create a user with a duplicate email', async () => {
        await userRepository.createSystemUser('Bob', 'bob@example.com', 'student', 'password123', queryRunner);
        await expect(userRepository.createSystemUser('Bobby', 'bob@example.com', 'student', 'password123', queryRunner))
            .rejects.toThrow('Email already exists.');
    });

    it('should not create a user with an invalid role', async () => {
        await expect(userRepository.createSystemUser('Charlie', 'charlie@example.com', 'guest', 'password123', queryRunner))
            .rejects.toThrow('Invalid user role.');
    });

    // Test for finding a user by ID
    it('should find a user by ID', async () => {
        const newUser = await userRepository.createSystemUser('Daniel', 'daniel@example.com', 'student', 'password123', queryRunner);
        const foundUser = await userRepository.findUserById(newUser.userID, queryRunner);
        expect(foundUser).toBeDefined();
        if (foundUser) {
            expect(foundUser.email).toBe('daniel@example.com');
        }
    });

    // Test for updating a user's name
    it('should update a user name', async () => {
        const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123', queryRunner);
        await userRepository.updateUserName(newUser.userID, 'Jane', queryRunner);
        const updatedUser = await userRepository.findUserById(newUser.userID, queryRunner);
        if (updatedUser) {
            expect(updatedUser.name).toBe('Jane');
        }
    });

    // Test for pagination functionality
    it('should retrieve a list of users with pagination', async () => {
        await userRepository.createSystemUser('Fred', 'fred@example.com', 'admin', 'secure123', queryRunner);
        await userRepository.createSystemUser('George', 'george@example.com', 'admin', 'secure456', queryRunner);
        const usersPage1 = await userRepository.findAllUsers(1, 1, queryRunner);
        expect(usersPage1.length).toBe(1);
        const usersPage2 = await userRepository.findAllUsers(2, 1, queryRunner);
        expect(usersPage2.length).toBe(1);
        expect(usersPage1[0].name).not.toBe(usersPage2[0].name);
    });

    // Test for deleting a user
    it('should delete a user', async () => {
        const newUser = await userRepository.createSystemUser('Harry', 'harry@example.com', 'admin', 'password789', queryRunner);
        await userRepository.deleteSystemUser(newUser.userID, queryRunner);
        const deletedUser = await userRepository.findUserById(newUser.userID, queryRunner);
        expect(deletedUser).toBeNull();
    });

});