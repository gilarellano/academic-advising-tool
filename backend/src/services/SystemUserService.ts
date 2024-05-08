// SystemUserService.ts
import { DataSource} from 'typeorm';
import { SystemUser } from '../models';
import { SystemUserRepository } from '../repositories/SystemUserRepository';
import { comparePassword } from '../utils/security';


export class SystemUserService {
    userRepository: SystemUserRepository;
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.userRepository = new SystemUserRepository(dataSource);
    }

    async createUser(name: string, email: string, role: string, password: string): Promise<SystemUser> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await this.userRepository.createSystemUser(name, email, role, password, queryRunner);
            await queryRunner.commitTransaction();
            return user;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async loginUser(email: string, password: string): Promise<boolean> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");  // Generalize error message
        }
        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            throw new Error("Invalid credentials");  // Generalize error message
        }
        return true;  // Return true only if both email exists and password matches
    }

    async updateUserName(userId: number, newName: string): Promise<void> {
        await this.userRepository.updateUserName(userId, newName);
    }

    async updateUserEmail(userId: number, newEmail: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.userRepository.updateUserEmail(userId, newEmail, queryRunner);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateUserRole(userId: number, newRole: string): Promise<void> {
        await this.userRepository.updateUserRole(userId, newRole);
    }

    async updateUserPassword(userId: number, newPassword: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.userRepository.updateUserPassword(userId, newPassword, queryRunner);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // New method to retrieve all users with pagination
    async retrieveAllUsers(page: number, limit: number): Promise<SystemUser[]> {
        return await this.userRepository.findAllUsers(page, limit);
    }

    async findUserByID(userID: number): Promise<SystemUser | null> {
        return this.userRepository.findUserById(userID);
    }

    // Method to check if an email already exists
    async emailExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findUserByEmail(email);
        return user !== null;
    }

    async deleteSystemUser(userID: number): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            await this.userRepository.deleteSystemUser(userID, queryRunner);
            await queryRunner.commitTransaction();
        } catch (error){
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
