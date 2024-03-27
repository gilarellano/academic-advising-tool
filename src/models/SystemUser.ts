export class SystemUser {
    userID: number;
    name: string;
    email: string;
    role: string;

    constructor(userID: number, name: string, email: string, role: string) {
        this.userID = userID;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
