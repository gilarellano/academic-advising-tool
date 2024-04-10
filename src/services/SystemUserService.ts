import { Student } from '../models/Student';
import { Advisor } from '../models/Advisor';

type User = Student | Advisor;

export class SystemUserService {
    private users: User[] = []; // Simulated storage for users

    createUser(user: User): User {
        this.users.push(user);
        return user; // Return the newly created user
    }

    getUserById(userID: number): User | undefined {
        return this.users.find(user => user.userID === userID);
    }
    
    updateUser(userID: number, newName?: string, newEmail?: string, newRole?: string): boolean {
        const user = this.users.find(user => user.userID === userID);
        if (!user) return false; // User not found

        // Only update the attributes that are provided (i.e., not undefined)
        if (newName !== undefined) user.name = newName;
        if (newEmail !== undefined) user.email = newEmail;
        if (newRole !== undefined) user.role = newRole;

        return true; // User updated successfully
    }

    deleteUser(userID: number): boolean {
        const userIndex = this.users.findIndex(user => user.userID === userID);
        if (userIndex === -1) return false; // User not found
    
        // Call the dispose method before deletion
        this.users[userIndex].dispose();
    
        this.users.splice(userIndex, 1); // Remove the user from the array
        return true;
    }

}