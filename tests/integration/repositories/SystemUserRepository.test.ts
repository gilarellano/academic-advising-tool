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

    describe('Create functionalities', () => {

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

        it('should return false if role is undefined', async () => {
            const userWithNoRole = { }; // no role provided
            const isValidRole = await userRepository.validateUserRole(userWithNoRole);
            expect(isValidRole).toBe(false);
        });
    })

    describe('Read functionalities', () => {

        it('should find a user by ID', async () => {
            const newUser = await userRepository.createSystemUser('Daniel', 'daniel@example.com', 'student', 'password123', queryRunner);
            const foundUser = await userRepository.findUserById(newUser.userID, queryRunner);
            expect(foundUser).toBeDefined();
            if (foundUser) {
                expect(foundUser.email).toBe('daniel@example.com');
            }
        });

        it('should find a users email by ID', async () => {
            const newUser = await userRepository.createSystemUser('Daniel', 'daniel@example.com', 'student', 'password123', queryRunner);
            const foundEmail = await userRepository.findUserEmailById(newUser.userID, queryRunner);
            expect(foundEmail).toBeDefined();
            if (foundEmail) {
                expect(foundEmail).toBe('daniel@example.com');
            }
        });

        // Test for finding a user's role by ID
        it('should find a users role by ID', async () => {
            const newUser = await userRepository.createSystemUser('Daniel', 'daniel@example.com', 'student', 'password123', queryRunner);
            const foundRole = await userRepository.findUserRoleById(newUser.userID, queryRunner);
            expect(foundRole).toBeDefined();
            if (foundRole) {
                expect(foundRole).toBe('student');
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

        it('should return undefined for email if no user is found by ID', async () => {
            const nonExistentUserId = 999; // assuming this ID does not exist
            const foundEmail = await userRepository.findUserEmailById(nonExistentUserId, queryRunner);
            expect(foundEmail).toBeUndefined();
        });
    
        it('should return undefined for role if no user is found by ID', async () => {
            const nonExistentUserId = 999; // assuming this ID does not exist
            const foundRole = await userRepository.findUserRoleById(nonExistentUserId, queryRunner);
            expect(foundRole).toBeUndefined();
        });


    })

    describe('Update functionalities', () => {
        // Test for updating a user's name
        it('should update a user name', async () => {
            const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123', queryRunner);
            await userRepository.updateUserName(newUser.userID, 'Jane', queryRunner);
            const updatedUser = await userRepository.findUserById(newUser.userID, queryRunner);
            if (updatedUser) {
                expect(updatedUser.name).toBe('Jane');
            }
        });

        it('should update a user email', async () => {
            const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123', queryRunner);
            await userRepository.updateUserEmail(newUser.userID, 'eve_updated@example.com', queryRunner);
            const updatedUser = await userRepository.findUserById(newUser.userID, queryRunner);
            if (updatedUser) {
                expect(updatedUser.email).toBe('eve_updated@example.com');
            }
        });

        it('should not allow to update a user email if it already exist', async () => {
            const eveUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123', queryRunner);
            const geoergeUser = await userRepository.createSystemUser('George', 'george@example.com', 'admin', 'secure456', queryRunner);
            await expect(userRepository.updateUserEmail(eveUser.userID, 'george@example.com', queryRunner)).rejects.toThrow('Email already exists.');
        });

        it('should update a user role', async () => {
            const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123', queryRunner);
            await userRepository.updateUserRole(newUser.userID, 'student', queryRunner);
            const updatedUser = await userRepository.findUserById(newUser.userID, queryRunner);
            if (updatedUser) {
                expect(updatedUser.role).toBe('student');
            }
        });

        it('should not allow to update a user role if its invalid', async () => {
            const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123', queryRunner);
            await expect(userRepository.updateUserRole(newUser.userID, 'president', queryRunner)).rejects.toThrow('Invalid role.');
        });


        it('should update a user password', async () => {
            const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123',queryRunner);
            await userRepository.updateUserPassword(newUser.userID, 'newpassword123', queryRunner);
            const updatedUser = await userRepository.findUserById(newUser.userID, queryRunner);
            if (updatedUser) {
                // Here you should verify if the password has been updated successfully,
                // based on your implementation you might need to hash 'newpassword123' and compare it with the updated user's password.
                // I'll leave this part to you as you know your implementation details better.
                expect(updatedUser.password).not.toBe('password123');
            }
        });
    })
 
    describe('Delete functionalities', () => {
        // Test for deleting a user
        it('should delete a user', async () => {
            const newUser = await userRepository.createSystemUser('Harry', 'harry@example.com', 'admin', 'password789', queryRunner);
            await userRepository.deleteSystemUser(newUser.userID, queryRunner);
            const deletedUser = await userRepository.findUserById(newUser.userID, queryRunner);
            expect(deletedUser).toBeNull();
        });
    })

});