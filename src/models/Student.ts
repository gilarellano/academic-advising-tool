
import { SystemUser } from './SystemUser';
import { AcademicPlan } from './AcademicPlan';  // Assuming you have or will create this class
import { Advisor } from './Advisor';

export class Student extends SystemUser {
    studentID: number;
    degreeProgram: string;
    currentCredits: number;
    academicPlans: AcademicPlan[];
    advisor: Advisor | null = null;  // Initially, there's no advisor assigned

    constructor(
        userID?: number,
        name?: string,
        email?: string,
        role: string = 'Student',
        studentID?: number,
        degreeProgram: string = 'Undeclared',
        currentCredits: number = 0
    ) {
        super(userID ?? -1, name ?? 'Unknown', email ?? 'no-email@example.com', role);
        this.studentID = studentID ?? -1;
        this.degreeProgram = degreeProgram;
        this.currentCredits = currentCredits;
        this.academicPlans = [];
    }

    assignAdvisor(advisor: Advisor | null) { // allow to accept 'null' values as a way to remove advisors
        this.advisor = advisor;
    }

    createPlan(): AcademicPlan {
        // Create a new AcademicPlan instance
        const newPlan = new AcademicPlan();
        
        // Add the new plan to the student's academicPlans array
        this.academicPlans.push(newPlan);

        // Return the newly created plan
        return newPlan;
    }

    submitPlanForApproval(): void {
        if (this.academicPlans.length > 0 && this.advisor) {
            const planToSubmit = this.academicPlans[0]; // Assuming we're submitting the first plan in the list
            this.advisor.pendingPlans.push(planToSubmit); // Add the plan to the advisor's pendingPlans list
        // istanbul ignore next
        } else {
            console.log('No academic plans available for submission or advisor not assigned.');
        }
    }
}
