import { SystemUser } from './SystemUser';
import { AcademicPlan } from './AcademicPlan';  // Assuming you will create this class
import { Student } from './Student';

export class Advisor extends SystemUser {
    advisorID: number | null;  // Explicitly allow number or null
    department: string | null;  // Explicitly allow string or null
    students: Student[];
    pendingPlans: AcademicPlan[] = [];

    constructor(
        userID: number | null = null,  // Explicitly allow number or null and default to null
        name: string | null = null,  // Explicitly allow string or null and default to null
        email: string | null = null,  // Explicitly allow string or null and default to null
        role: string | null = null,
        advisorID: number | null = null,  // Explicitly allow number or null and default to null
        department: string | null = null,  // Explicitly allow string or null and default to null
    ) {
        // Ensure to handle nulls appropriately in the superclass or further in this constructor
        super(userID ?? -1, name ?? 'Unknown', email ?? 'no-email@example.com', role ?? 'Advisor');
        this.advisorID = advisorID;
        this.department = department;
        this.students = [];
    }

    reviewPlan(plan: AcademicPlan): void {
        // First, check if the plan exists in pendingPlans
        const planIndex = this.pendingPlans.findIndex(p => p.planID === plan.planID);
        if (planIndex === -1) {
            console.log('No such plan found in pending plans.');
            return;
        }

        // If plan is valid, approve it, otherwise deny it
        if (plan.validatePlan()) {
            this.approvePlan(plan);
        } else {
            this.denyPlan(plan);
        }

        // Remove the plan from pendingPlans after review
        this.pendingPlans.splice(planIndex, 1);
    }

    approvePlan(plan: AcademicPlan): void {
        // Set the plan's isApproved property to true to mark it as approved
        plan.isApproved = true;
    }

    denyPlan(plan: AcademicPlan): void {
        // Explicitly set the plan's isApproved property to false to mark it as not approved
        plan.isApproved = false;
    }

    addStudent(student: Student): void {
        // Add the student to this advisor's list of students
        this.students.push(student);

        // Assign this advisor to the student
        student.assignAdvisor(this);
    }

    removeStudent(student: Student): void {
        // Find the index of the student to remove
        const index = this.students.findIndex(s => s.studentID === student.studentID);

        // If the student is found, remove them from the list
        if (index !== -1) {
            this.students.splice(index, 1);
            // Unset the advisor reference in the student object
            student.assignAdvisor(null);
        }
    }
}
