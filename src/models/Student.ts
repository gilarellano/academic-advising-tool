
import { SystemUser } from './SystemUser';
import { AcademicPlan } from './AcademicPlan';  // Assuming you have or will create this class

export class Student extends SystemUser {
    studentID: number;
    degreeProgram: string;
    currentCredits: number;

    constructor(userID: number, name: string, email: string, role: string, studentID: number, degreeProgram: string, currentCredits: number) {
        super(userID, name, email, role);  // Call the base class constructor
        this.studentID = studentID;
        this.degreeProgram = degreeProgram;
        this.currentCredits = currentCredits;
    }

    createPlan(): void { // Returns AcademicPlan object
        // Logic to create an academic plan
        // Placeholder return, replace with actual logic
        // return AcademicPlan(/*parameters*/)
    }

    submitPlanForApproval(): void {
        // Logic to submit the academic plan for approval
        // Implement the logic here
    }
}
