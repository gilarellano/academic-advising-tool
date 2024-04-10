import { SystemUser } from './SystemUser';

class AuthenticationToken {
    tokenID: number;
    token: string;
    expiryDate: Date;
    user: SystemUser;

    constructor(tokenID: number, token: string, expiryDate: Date, user: SystemUser) {
        this.tokenID = tokenID;
        this.token = token;
        this.expiryDate = expiryDate;
        this.user = user;
    }

    // Checks if the token is expired based on the current date
    isExpired(): boolean {
        return new Date() > this.expiryDate;
    }
}

export { AuthenticationToken };
