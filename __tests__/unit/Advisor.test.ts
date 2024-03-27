import { Advisor } from '../../src/models/Advisor';
import { Student } from '../../src/models/Student';
import { AcademicPlan } from '../../src/models/AcademicPlan';

describe('Advisor Class', () => {
    let advisor: Advisor;

    beforeEach(() => {
        const advisorID = 101;
        const name = 'Jane Doe';
        const email = 'jane.doe@example.com';
        const role = 'Advisor';
        const department = 'Computer Science';

        advisor = new Advisor(advisorID, name, email, role, advisorID, department);
    });

    it('should create an instance of Advisor with the correct properties', () => {
        expect(advisor).toBeInstanceOf(Advisor);
        expect(advisor.userID).toBe(101);
        expect(advisor.name).toBe('Jane Doe');
        expect(advisor.email).toBe('jane.doe@example.com');
        expect(advisor.role).toBe('Advisor');
        expect(advisor.advisorID).toBe(101);
        expect(advisor.department).toBe('Computer Science');
    });

    it('should add a student to the advisor’s list of students and set the advisor for the student', () => {
        const student = new Student(201, 'John Smith', 'john.smith@example.com', 'Student', 202, 'Computer Science', 0);
        advisor.addStudent(student);
    
        // Check if the student was added to the advisor's list
        expect(advisor.students.length).toBe(1);
        expect(advisor.students[0]).toBe(student);
    
        // Check if the advisor is correctly assigned to the student
        expect(student.advisor).toBe(advisor);
    });

    it('should remove a student from the advisor’s list of students and unset the advisor for the student', () => {
        const student = new Student(201, 'John Smith', 'john.smith@example.com', 'Student', 202, 'Computer Science', 0);
        advisor.addStudent(student);  // First, add the student to ensure there's one to remove

        // Verify the student was added
        expect(advisor.students.length).toBe(1);
        expect(student.advisor).toBe(advisor);

        advisor.removeStudent(student);  // Now, remove the student

        // Verify the student was removed
        expect(advisor.students.length).toBe(0);
        // Verify the student's advisor reference was unset
        expect(student.advisor).toBeNull();
    });

    it('should review pending academic plans, approving valid ones and denying invalid ones', () => {
        const validPlan = new AcademicPlan(/* parameters */); // Assume this plan is valid
        const invalidPlan = new AcademicPlan(/* parameters */); // Assume this plan is invalid

        // Mocking validatePlan method to return true for validPlan and false for invalidPlan
        jest.spyOn(validPlan, 'validatePlan').mockReturnValue(true);
        jest.spyOn(invalidPlan, 'validatePlan').mockReturnValue(false);

        // Adding plans to the advisor's pending plans
        advisor.pendingPlans.push(validPlan, invalidPlan);

        // Mocking approvePlan and denyPlan methods
        const approvePlanSpy = jest.spyOn(advisor, 'approvePlan');
        const denyPlanSpy = jest.spyOn(advisor, 'denyPlan');

        // Assuming reviewPlan method takes an AcademicPlan as argument
        advisor.reviewPlan(validPlan);
        advisor.reviewPlan(invalidPlan);

        // Check if approvePlan was called for the valid plan
        expect(approvePlanSpy).toHaveBeenCalledWith(validPlan);

        // Check if denyPlan was called for the invalid plan
        expect(denyPlanSpy).toHaveBeenCalledWith(invalidPlan);
    });

    it('should mark an academic plan as approved when approvePlan is called', () => {
        const plan = new AcademicPlan(/* parameters */); // Initialize the plan, assume it's not approved yet
        expect(plan.isApproved).toBe(false); // Initial state should be not approved

        advisor.approvePlan(plan);

        expect(plan.isApproved).toBe(true); // After approvePlan is called, the plan should be marked as approved
    });

    it('should ensure an academic plan is not marked as approved when denyPlan is called', () => {
        const plan = new AcademicPlan(/* parameters */); // Initialize the plan, it might be approved or not
        plan.isApproved = true; // Simulate a scenario where the plan might have been mistakenly marked as approved

        advisor.denyPlan(plan);

        expect(plan.isApproved).toBe(false); // After denyPlan is called, the plan should be marked as not approved
    });

});
