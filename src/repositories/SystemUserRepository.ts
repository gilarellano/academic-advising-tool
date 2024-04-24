// SystemUserRepository.ts
import { DataSource, QueryRunner } from 'typeorm';
import { SystemUser } from '../models';
import * as bcrypt from 'bcrypt';

export class SystemUserRepository {
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async createSystemUser(name: string, email: string, role: string, password: string, queryRunner?: QueryRunner): Promise<SystemUser> {
        const sanitizedEmail = this.sanitizeInput(email);
        const sanitizedName = this.sanitizeInput(name);
    
        if (!await this.validateUserRole({ role }, queryRunner)) {
            throw new Error("Invalid user role.");
        }
    
        if (!await this.validateEmailUniqueness(sanitizedEmail, queryRunner)) {
            throw new Error("Email already exists.");
        }
    
        const hashedPassword = await this.hashPassword(password);
        const user = new SystemUser(sanitizedName, sanitizedEmail, hashedPassword, role);
    
        const entityManager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        await entityManager.save(user);
        return user;
    }

    async findUserById(userId: number, queryRunner?: QueryRunner): Promise<SystemUser | null> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        return manager.findOneBy(SystemUser, { userID: userId });
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
        const sanitizedNewName = this.sanitizeInput(newName);
        const user = await this.findUserById(userId, queryRunner);
        if (user) {
            user.name = sanitizedNewName;
            const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
            await manager.save(user);
        }
    }

    async updateUserEmail(userId: number, newEmail: string, queryRunner?: QueryRunner): Promise<void> {
        const sanitizedNewEmail = this.sanitizeInput(newEmail);
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
        if (!await this.validateUserRole({ role: newRole }, queryRunner)) {
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
        const sanitizedNewPassword = this.sanitizeInput(newPassword);
        const hashedNewPassword = await this.hashPassword(sanitizedNewPassword);
        const user = await this.findUserById(userId, queryRunner);
        if (user) {
            user.password = hashedNewPassword;
            const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
            await manager.save(user);
        }
    }

    async deleteSystemUser(userId: number, queryRunner?: QueryRunner): Promise<void> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        await manager.delete(SystemUser, { userID: userId });
    }

    async validateUserRole(user: Partial<SystemUser>, queryRunner?: QueryRunner): Promise<boolean> {
        const validRoles = ['student', 'advisor', 'admin'];
        return user.role ? validRoles.includes(user.role) : false;
    }
    
    async validateEmailUniqueness(email: string, queryRunner?: QueryRunner): Promise<boolean> {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        const user = await manager.findOneBy(SystemUser, { email: email });
        return !user;
    }

    sanitizeInput(input: string): string {
        // Trim whitespace at both ends of the string
        const trimmed = input.trim();
    
        // Escape potentially dangerous characters
        const escaped = trimmed.replace(/[&<>"']/g, match => {
            switch (match) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
                default: return match;
            }
        });
    
        return escaped;
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
}
