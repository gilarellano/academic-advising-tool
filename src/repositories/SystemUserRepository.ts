// SystemUserRepository.ts
import { DataSource, QueryRunner } from 'typeorm';
import { SystemUser } from '../models';
import { sanitizeInput, hashPassword, comparePassword } from '../utils/security';

export class SystemUserRepository {
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async createSystemUser(name: string, email: string, role: string, password: string, queryRunner?: QueryRunner): Promise<SystemUser> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedName = sanitizeInput(name);
    
        if (!await this.validateUserRole({ role })) {
            throw new Error("Invalid user role.");
        }
    
        if (!await this.validateEmailUniqueness(sanitizedEmail, queryRunner)) {
            throw new Error("Email already exists.");
        }
    
        const hashedPassword = await hashPassword(password);
        const user = new SystemUser(sanitizedName, sanitizedEmail, hashedPassword, role);
    
        await manager.save(user);
        return user;
    }

    async findUserById(userId: number, queryRunner?: QueryRunner): Promise<SystemUser | null> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        return manager.findOneBy(SystemUser, { userID: userId });
    }

    async findUserByEmail(email: string, queryRunner?: QueryRunner): Promise<SystemUser | null> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        const sanitizedEmail = sanitizeInput(email);
        // This will return `null` if no user is found, which is treated as a non-exceptional case.
        return await manager.findOneBy(SystemUser, { email: sanitizedEmail });
}
    

    async findUserEmailById(userId: number, queryRunner?: QueryRunner): Promise<string | undefined> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        const user = await manager.findOne(SystemUser, {
            where: { userID: userId },
            select: ['email']
        });
        return user?.email;
    }

    async findUserRoleById(userId: number, queryRunner?: QueryRunner): Promise<string | undefined> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        const user = await manager.findOne(SystemUser, {
            where: { userID: userId },
            select: ['role']
        });
        return user?.role;
    }

    async findAllUsers(page: number, limit: number, queryRunner?: QueryRunner): Promise<SystemUser[]> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        return manager.find(SystemUser, {
            skip: (page - 1) * limit,
            take: limit
        });
    }

    async updateUserName(userId: number, newName: string, queryRunner?: QueryRunner): Promise<void> {
        const sanitizedNewName = sanitizeInput(newName);
        const user = await this.findUserById(userId, queryRunner);
        if (user) {
            user.name = sanitizedNewName;
            const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
            await manager.save(user);
        }
    }

    async updateUserEmail(userId: number, newEmail: string, queryRunner?: QueryRunner): Promise<void> {
        const sanitizedNewEmail = sanitizeInput(newEmail);
        if (!await this.validateEmailUniqueness(sanitizedNewEmail, queryRunner)) {
            throw new Error("Email already exists.");
        }
        const user = await this.findUserById(userId, queryRunner);
        if (user) {
            user.email = sanitizedNewEmail;
            const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
            await manager.save(user);
        }
    }

    async updateUserRole(userId: number, newRole: string, queryRunner?: QueryRunner): Promise<void> {
        if (!await this.validateUserRole({ role: newRole })) {
            throw new Error("Invalid role.");
        }
        const user = await this.findUserById(userId, queryRunner);
        if (user) {
            user.role = newRole;
            const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
            await manager.save(user);
        }
    }

    async updateUserPassword(userId: number, newPassword: string, queryRunner?: QueryRunner): Promise<void> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;

        const user = await this.findUserById(userId, queryRunner);
        if (!user) {
            throw new Error("User not found");
        }

        const sanitizedNewPassword = sanitizeInput(newPassword);
        const hashedNewPassword = await hashPassword(sanitizedNewPassword);
        user.password = hashedNewPassword;
        await manager.save(user);
    }

    async deleteSystemUser(userId: number, queryRunner?: QueryRunner): Promise<void> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        await manager.delete(SystemUser, { userID: userId });
    }

    async validatePassword(enteredPassword: string, userId: number, queryRunner: QueryRunner): Promise<boolean> {
        const user = await this.findUserById(userId, queryRunner);
        if (!user) {
            throw new Error('User not found');
        }
        return comparePassword(enteredPassword, user.password);
    }

    async validateUserRole(user: Partial<SystemUser>): Promise<boolean> {
        const validRoles = ['student', 'advisor', 'admin'];
        return user.role ? validRoles.includes(user.role) : false;
    }
    
    async validateEmailUniqueness(email: string, queryRunner?: QueryRunner): Promise<boolean> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        const user = await manager.findOneBy(SystemUser, { email: email });
        return !user;
    }
}