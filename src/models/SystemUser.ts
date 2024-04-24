// SystemUser.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, TableInheritance } from 'typeorm';
import { AuthenticationToken } from './AuthenticationToken';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })  // Using 'type' column to distinguish between subclasses
export class SystemUser {
    @PrimaryGeneratedColumn()
    userID!: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @OneToOne(() => AuthenticationToken, token => token.user) // Link back to AuthenticationToken
    token?: AuthenticationToken;

    constructor(name: string, email: string, password: string, role: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
