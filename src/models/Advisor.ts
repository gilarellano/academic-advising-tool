import { SystemUser } from './SystemUser';
import { AcademicPlan } from './AcademicPlan';  // Assuming you will create this class

export class Advisor extends SystemUser {
    advisorID: number;
    department: string;

    constructor(userID: number, name: string, email: string, role: string, advisorID: number, department: string) {
        super(userID, name, email, role);  // Call the base class constructor
        this.advisorID = advisorID;
        this.department = department;
    }

    reviewPlan(plan: AcademicPlan): void {
        // Logic to review an academic plan
        // Implement the logic here
    }

    approvePlan(plan: AcademicPlan): void {
        // Logic to approve an academic plan
        // Implement the logic here
    }

    denyPlan(plan: AcademicPlan): void {
        // Logic to deny an academic plan
        // Implement the logic here
    }
}
