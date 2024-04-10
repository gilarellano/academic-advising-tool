import { SystemUser } from './SystemUser';

export class Student extends SystemUser {
    studentID: number;
    requirementID: number;
    advisorID: number;
    currentCredits: number;

    static specificFields = ['RequirementID', 'CurrentCredits', 'AdvisorID'];

    constructor(
        userID?: number,
        name?: string,
        email?: string,
        role: string = 'Student',
        studentID?: number,
        requirementID?: number,
        advisorID?: number,
        currentCredits: number = 0
    ) {
        super(userID ?? -1, name ?? 'Unknown', email ?? 'no-email@example.com', role);
        this.studentID = studentID ?? -1;
        this.requirementID = requirementID ?? -1;
        this.advisorID = advisorID ?? -1;
        this.currentCredits = currentCredits;
    }

    dispose() {
        console.log(`Cleaning up Student resources for ${this.name}`);
        // Add any specific cleanup logic here
    }

}
