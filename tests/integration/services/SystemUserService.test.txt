import { SystemUserService } from '../../src/services/SystemUserService';
import { Student } from '../../src/models/Student';
import { Advisor } from '../../src/models/Advisor';

describe('UserService', () => {
    let userService: SystemUserService;
    let mockStudent: Student;
    let mockAdvisor: Advisor;

    beforeEach(() => {
        userService = new SystemUserService();
        mockStudent = new Student(1, 'Test Student', 'test@student.com', 'Student', 123, 10, 30);
        mockAdvisor = new Advisor(2, 'Test Advisor', 'test@advisor.com', 'Advisor', 456, 'Math');

        userService.createUser(mockStudent);
        userService.createUser(mockAdvisor);
    });

    describe('createUser', () => {
        it('should add a new user to the system', () => {
            userService.createUser(mockStudent);
            expect(userService.getUserById(1)).toBe(mockStudent);
        });
    });

    describe('getUserById', () => {
        it('should return undefined for a non-existing user', () => {
            expect(userService.getUserById(99)).toBeUndefined();
        });
    });

    describe('deleteUser', () => {
        it('should remove a user from the system', () => {
            const deleteResult = userService.deleteUser(1);
            expect(deleteResult).toBe(true);
            expect(userService.getUserById(1)).toBeUndefined();
        });

        it('should return false when trying to delete a non-existing user', () => {
            const deleteResult = userService.deleteUser(99);
            expect(deleteResult).toBe(false);
        });
    });

    describe('updateUser', () => {
        it('should update the name of the user', () => {
            const updated = userService.updateUser(1, 'Updated Student');
            expect(updated).toBe(true);
            const user = userService.getUserById(1);
            expect(user?.name).toEqual('Updated Student');
        });

        it('should update the email of the user', () => {
            const updated = userService.updateUser(1, undefined, 'updated@student.com');
            expect(updated).toBe(true);
            const user = userService.getUserById(1);
            expect(user?.email).toEqual('updated@student.com');
        });

        it('should update the role of the user', () => {
            const updated = userService.updateUser(1, undefined, undefined, 'Updated Role');
            expect(updated).toBe(true);
            const user = userService.getUserById(1);
            expect(user?.role).toEqual('Updated Role');
        });

        it('should update multiple attributes of the user at once', () => {
            const updated = userService.updateUser(2, 'Updated Advisor', 'updated@advisor.com', 'Updated Role');
            expect(updated).toBe(true);
            const user = userService.getUserById(2);
            expect(user?.name).toEqual('Updated Advisor');
            expect(user?.email).toEqual('updated@advisor.com');
            expect(user?.role).toEqual('Updated Role');
        });

        it('should return false if user does not exist', () => {
            const updated = userService.updateUser(99, 'Nonexistent User');
            expect(updated).toBe(false);
        });

        it('should not update any attribute if none are provided', () => {
            const originalUser = { ...userService.getUserById(1) };
            const updated = userService.updateUser(1);
            expect(updated).toBe(true);
            const user = userService.getUserById(1);
            expect(user).toEqual(originalUser);
        });
    });

});
