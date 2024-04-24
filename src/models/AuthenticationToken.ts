import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { SystemUser } from './SystemUser';

@Entity()
export class AuthenticationToken {
    @PrimaryGeneratedColumn()
    tokenID!: number; // Assuming TokenID is a numeric identifier

    @Column()
    token: string; // The JWT token string

    @Column()
    expiryDate: Date; // The expiration date/time of the token

    @OneToOne(() => SystemUser) // Define a one-to-one relationship with SystemUser
    @JoinColumn({ name: 'userID' }) // SystemUser is the owning side
    user: SystemUser; // Relation to SystemUser

    constructor(
        user: SystemUser,
        token: string,
        expiryDate?: Date // ExpiryDate is optional in the constructor and defaults to 1 hour from creation if not provided
    ) {
        this.user = user;
        this.token = token;
        this.expiryDate = expiryDate || new Date(new Date().getTime() + 60 * 60 * 1000); // Defaults to 1 hour from now
    }
}
