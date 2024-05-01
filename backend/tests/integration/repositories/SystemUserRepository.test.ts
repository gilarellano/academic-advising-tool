// SystemUserRepository.test.ts
import { AppDataSource } from '../../../src/database/DataSource';
import { QueryRunner } from 'typeorm';
import { SystemUserRepository } from '../../../src/repositories/SystemUserRepository';
import { comparePassword } from '../../../src/utils/security';

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

    describe('Transactional Tests', () => {
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

            it('should find a users email by ID', async () => {
                const newUser = await userRepository.createSystemUser('Daniel', 'daniel@example.com', 'student', 'password123', queryRunner);
                const foundEmail = await userRepository.findUserEmailById(newUser.userID, queryRunner);
                expect(foundEmail).toBeDefined();
                if (foundEmail) {
                    expect(foundEmail).toBe('daniel@example.com');
                }
            });


            it('should find a users role by ID', async () => {
                const newUser = await userRepository.createSystemUser('Daniel', 'daniel@example.com', 'student', 'password123', queryRunner);
                const foundRole = await userRepository.findUserRoleById(newUser.userID, queryRunner);
                expect(foundRole).toBeDefined();
                if (foundRole) {
                    expect(foundRole).toBe('student');
                }
            });

            it('should find a user by their email', async () => {
                const newUser = await userRepository.createSystemUser('Daniel', 'daniel@example.com', 'student', 'password123', queryRunner);
                const foundUser = await userRepository.findUserByEmail('daniel@example.com', queryRunner);
                expect(foundUser).toBeDefined();
                if (foundUser) {
                    expect(foundUser.userID).toEqual(newUser.userID);
                }
            })

            it('should receive a null when no user is found by their email', async () => {
                const email = 'nonexistent@example.com';
                const foundUser = await userRepository.findUserByEmail(email);
                expect(foundUser).toBeNull();
            });
            

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
                const foundEmail = await userRepository.findUserEmailById(nonExistentUserId);
                expect(foundEmail).toBeUndefined();
            });
        
            it('should return undefined for role if no user is found by ID', async () => {
                const nonExistentUserId = 999; // assuming this ID does not exist
                const foundRole = await userRepository.findUserRoleById(nonExistentUserId);
                expect(foundRole).toBeUndefined();
            });


        })

        describe('Update functionalities', () => {
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
                const updatedUser = await userRepository.findUserById(newUser.userID);
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
                const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123', queryRunner);
                await userRepository.updateUserPassword(newUser.userID, 'newpassword123', queryRunner);
                const updatedUser = await userRepository.findUserById(newUser.userID, queryRunner);
                if (updatedUser) {
                    // Use comparePassword to verify the password was updated correctly.
                    const passwordMatch = await comparePassword('newpassword123', updatedUser.password);
                    expect(passwordMatch).toBe(true);
                } 
            });
        
            it('should handle user not found during password update', async () => {
                const nonExistentUserId = 999; // assuming this ID does not exist
                await expect(userRepository.updateUserPassword(nonExistentUserId, 'newpassword456', queryRunner))
                    .rejects.toThrow('User not found');
            });
        })
    
        describe('Delete functionalities', () => {
            it('should delete a user', async () => {
                const newUser = await userRepository.createSystemUser('Harry', 'harry@example.com', 'admin', 'password789', queryRunner);
                await userRepository.deleteSystemUser(newUser.userID, queryRunner);
                const deletedUser = await userRepository.findUserById(newUser.userID);
                expect(deletedUser).toBeNull();
            });
        })

        describe('Validate functionalities', () =>{
            it('should validate a correct password', async () => {
                const user = await userRepository.createSystemUser('John', 'john@example.com', 'admin', 'correctPassword123', queryRunner);
                const isValid = await userRepository.validatePassword('correctPassword123', user.userID, queryRunner);
                expect(isValid).toBe(true);
            });
        
            it('should reject an incorrect password', async () => {
                const user = await userRepository.createSystemUser('John', 'john@example.com', 'admin', 'correctPassword123', queryRunner);
                const isValid = await userRepository.validatePassword('wrongPassword321', user.userID, queryRunner);
                expect(isValid).toBe(false);
            });        

            it('should throw an error if the user does not exist', async () => {
                const nonExistentUserId = 999; // assuming this ID does not exist
                await expect(userRepository.validatePassword('anyPassword', nonExistentUserId, queryRunner))
                    .rejects.toThrow('User not found');
            });

            it('should return false if role is undefined', async () => {
                const userWithNoRole = { }; // no role provided
                const isValidRole = await userRepository.validateUserRole(userWithNoRole);
                expect(isValidRole).toBe(false);
            });
        })

    })

    describe('Without QueryRunner', () => {

        it('should use dataSource manager to create a user', async () => {
            const user = await userRepository.createSystemUser('NonTxUser', 'nontx@example.com', 'admin', 'securePass');
            expect(user).toBeDefined();
            expect(user.email).toBe('nontx@example.com');

            // Cleanup (consider abstracting this into an afterEach if used frequently)
            await userRepository.deleteSystemUser(user.userID);
        });

        it('should use dataSource manager to find a user by email', async () => {
            const user = await userRepository.createSystemUser('NonTxUser', 'findme@example.com', 'admin', 'findPass');
            const foundUser = await userRepository.findUserByEmail('findme@example.com');
            expect(foundUser).toBeDefined();
            if (foundUser) {
                expect(foundUser.email).toBe('findme@example.com');
            }
            // Ensure cleanup
            await userRepository.deleteSystemUser(user.userID);
        });

        it('should use dataSource manager to update a user role', async () => {
            const user = await userRepository.createSystemUser('RoleChangeUser', 'rolechange@example.com', 'student', 'rolePass');
            await userRepository.updateUserRole(user.userID, 'admin');
            const updatedUser = await userRepository.findUserById(user.userID);
            if (updatedUser) {
                expect(updatedUser.role).toBe('admin');
            }
            // Ensure cleanup
            await userRepository.deleteSystemUser(user.userID);
        });

        it('should use dataSource manager to delete a user', async () => {
            const user = await userRepository.createSystemUser('DeleteMe', 'deleteme@example.com', 'admin', 'deletePass');
            await userRepository.deleteSystemUser(user.userID);
            const deletedUser = await userRepository.findUserById(user.userID);
            expect(deletedUser).toBeNull();
        });


        it('should use dataSource manager to retrieve a list of users with pagination', async () => {
            const user1 = await userRepository.createSystemUser('Fred', 'fred@example.com', 'admin', 'secure123');
            const user2 = await userRepository.createSystemUser('George', 'george@example.com', 'admin', 'secure456');
            const usersPage1 = await userRepository.findAllUsers(1, 1);
            expect(usersPage1.length).toBe(1);
            const usersPage2 = await userRepository.findAllUsers(2, 1);
            expect(usersPage2.length).toBe(1);
            expect(usersPage1[0].name).not.toBe(usersPage2[0].name);

            // Ensure cleanup
            await userRepository.deleteSystemUser(user1.userID);
            await userRepository.deleteSystemUser(user2.userID);
        });

        it('should use dataSource manager to update a user name', async () => {
            const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123');
            await userRepository.updateUserName(newUser.userID, 'Jane');
            const updatedUser = await userRepository.findUserById(newUser.userID);
            if (updatedUser) {
                expect(updatedUser.name).toBe('Jane');
            }
            await userRepository.deleteSystemUser(newUser.userID);

        });

        it('should use dataSource manager to update a user email', async () => {
            const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123');
            await userRepository.updateUserEmail(newUser.userID, 'eve_updated@example.com');
            const updatedUser = await userRepository.findUserById(newUser.userID);
            if (updatedUser) {
                expect(updatedUser.email).toBe('eve_updated@example.com');
            }
            await userRepository.deleteSystemUser(newUser.userID);

        });       
        
        it('should use dataSource manager to update a user password', async () => {
            const newUser = await userRepository.createSystemUser('Eve', 'eve@example.com', 'admin', 'password123');
            await userRepository.updateUserPassword(newUser.userID, 'newpassword123');
            const updatedUser = await userRepository.findUserById(newUser.userID);
            if (updatedUser) {
                // Use comparePassword to verify the password was updated correctly.
                const passwordMatch = await comparePassword('newpassword123', updatedUser.password);
                expect(passwordMatch).toBe(true);
            } 
            await userRepository.deleteSystemUser(newUser.userID);

        });

    });

});