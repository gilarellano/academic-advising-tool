import { Student } from '../../src/models/Student';
import { Advisor } from '../../src/models/Advisor';
import { AcademicPlan } from '../../src/models/AcademicPlan';

describe('SystemUser', () => {
  let student: Student;
  let advisor: Advisor;

  // This block runs before each test, setting up common objects
  beforeEach(() => {
    const userID = 1;
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const studentID = 123456;
    const degreeProgram = 'Computer Science';
    const currentCredits = 30;

    // Create a Student object without an Advisor
    student = new Student(userID, name, email, 'Student', studentID, degreeProgram, currentCredits);
    advisor = new Advisor();
  });

  it('should construct a SystemUser object properly', () => {
    expect(student).toBeInstanceOf(Student);
    expect(student.userID).toBe(1);
    expect(student.name).toBe('John Doe');
    expect(student.email).toBe('johndoe@example.com');
    expect(student.role).toBe('Student');
    expect(student.studentID).toBe(123456);
    expect(student.degreeProgram).toBe('Computer Science');
    expect(student.currentCredits).toBe(30);
    expect(student.academicPlans).toEqual([]);
    expect(student.advisor).toBeNull(); // Expecting advisor to be null initially
  });

  describe('assignAdvisor()', () => {
    it('should assign an advisor to the student', () => {
      student.assignAdvisor(advisor);

      expect(student.advisor).toBe(advisor);
    });
  });

  describe('createPlan()', () => {
    it('should create a new academic plan and add it to the academicPlans array', () => {
      // The student object is already created by beforeEach, so we can directly use it
      const initialPlanCount = student.academicPlans.length;

      const newPlan = student.createPlan();

      expect(student.academicPlans.length).toBe(initialPlanCount + 1); // Check if a new plan is added
      expect(student.academicPlans).toContain(newPlan); // Check if the new plan is the one that was added
    });
  });

  describe('submitPlanForApproval()', () => {
    it('should submit the first academic plan to the advisor’s pending plans list', () => {
      student.assignAdvisor(advisor); // Assign the advisor to the student

      // Create a new AcademicPlan instance and add it to the student's academicPlans array
      const newPlan = new AcademicPlan();
      student.academicPlans.push(newPlan);

      // Submit the plan for approval
      student.submitPlanForApproval();

      // Check if the submitted plan is added to the new advisor's pendingPlans list
      expect(advisor.pendingPlans.length).toBe(1);
      expect(advisor.pendingPlans[0]).toBe(newPlan);
    });
  });
});
