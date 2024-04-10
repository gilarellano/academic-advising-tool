import { SystemUser } from './SystemUser';

export class Advisor extends SystemUser {
    advisorID: number;
    department: string;

    static specificFields = ['Department'];

    constructor(
        userID?: number,
        name?: string,
        email?: string,
        role: string = 'Advisor', // Default role is 'Advisor'
        advisorID?: number,
        department: string = 'Undeclared' // Default department is 'Undeclared'
    ) {
        super(userID ?? -1, name ?? 'Unknown', email ?? 'no-email@example.com', role);
        this.advisorID = advisorID ?? -1;
        this.department = department;
    }

    dispose() {
        console.log(`Cleaning up Advisor resources for ${this.name}`);
        // Add any specific cleanup logic here
    }
}
