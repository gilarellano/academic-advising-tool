import DegreePlanService from '../../src/services/DegreePlanService';
import { Student } from '../../src/models/Student';
import { AcademicPlan } from '../../src/models/AcademicPlan';
import { DegreeRequirement } from '../../src/models/DegreeRequirement';
import { Advisor } from '../../src/models/Advisor';
import { Course } from '../../src/models/Course';

describe('DegreePlanService Integration Test', () => {
  let student: Student;
  let advisor: Advisor;
  let degreeRequirement: DegreeRequirement;

  beforeEach(() => {
    // Initialize Advisor
    advisor = new Advisor(1, 'Jane Doe', 'jane.doe@example.com', 'Advisor', 1, 'Computer Science');

    // Initialize DegreeRequirement
    degreeRequirement = new DegreeRequirement(1, '2024A', ['101', '102'], ['Humanities', 'History'], 120);

    // Initialize Student and associate with Advisor
    student = new Student(201, 'John Doe', 'john.doe@example.com', 'Student', 123, 'Computer Science', 60);
    student.assignAdvisor(advisor);
  });

  it('should create an AcademicPlan, set DegreeRequirements, and associate with a Student', () => {
    // Initialize Course(s)
    const course1 = new Course(101, 'Intro to Computer Science', 4, 'Computer Science', 'Core');
    const course2 = new Course(102, 'Algorithms', 3, 'Computer Science', 'Core');

    // Initialize AcademicPlan with DegreeRequirement
    const academicPlan = new AcademicPlan(1, '2024', '', 'In Progress', degreeRequirement);

    // Add Course(s) to AcademicPlan
    academicPlan.addCourse(course1);
    academicPlan.addCourse(course2);

    // Associate AcademicPlan with Student
    student.academicPlans.push(academicPlan);

    // Assertions
    expect(student.academicPlans.includes(academicPlan)).toBeTruthy();
    expect(academicPlan.degreeRequirement).toBe(degreeRequirement);
    expect(academicPlan.courses.includes(course1)).toBeTruthy();
    expect(student.advisor).toBe(advisor);
  });

  describe('Valid Academic Plan', () => {
    let validAcademicPlan: AcademicPlan;

    beforeEach(() => {
      // Initializing a valid AcademicPlan
      validAcademicPlan = new AcademicPlan(1, '2024', '', 'In Progress', degreeRequirement);
      validAcademicPlan.validatePlan = jest.fn(() => true); // Assuming 'validatePlan' will return true

      // Adding only the valid AcademicPlan to the Student's plans
      student.academicPlans.push(validAcademicPlan);
    });

    it('should approve a valid academic plan upon review', () => {
      // Student submits the plan for approval
      student.submitPlanForApproval();

      // Advisor reviews and decides on the plan
      advisor.reviewPlan(validAcademicPlan);

      // Assertions for valid plan
      expect(validAcademicPlan.isApproved).toBe(true);
      expect(advisor.pendingPlans).not.toContain(validAcademicPlan);
    });
  });

  describe('Invalid Academic Plan', () => {
    let invalidAcademicPlan: AcademicPlan;

    beforeEach(() => {
      // Initializing an invalid AcademicPlan
      invalidAcademicPlan = new AcademicPlan(2, '2024', '', 'In Progress', degreeRequirement);
      invalidAcademicPlan.validatePlan = jest.fn(() => false); // Assuming 'validatePlan' will return false

      // Adding only the invalid AcademicPlan to the Student's plans
      student.academicPlans.push(invalidAcademicPlan);
    });

    it('should deny an invalid academic plan upon review', () => {
      // Student submits the plan for approval
      student.submitPlanForApproval();

      // Advisor reviews and decides on the plan
      advisor.reviewPlan(invalidAcademicPlan);

      // Assertions for invalid plan
      expect(invalidAcademicPlan.isApproved).toBe(false);
      expect(advisor.pendingPlans).not.toContain(invalidAcademicPlan);
    });
  });

  describe('DegreePlanService functionality', () => {
    it('should successfully create an academic plan for a student', () => {
      // Data for DegreeRequirement, mimicking what might be fetched from a database or another source
      const degreeRequirementsData = {
        requirementID: 1,
        version: '2024A',
        requiredCourseIDs: ['101', '102'],
        electiveCategories: ['Humanities', 'History'],
        totalCredits: 120
      };

      // Using DegreePlanService to create an AcademicPlan
      const academicPlan = DegreePlanService.createAcademicPlanForStudent(student, advisor, degreeRequirementsData);

      // Assertions to verify the academic plan is correctly created and associated
      expect(academicPlan).toBeInstanceOf(AcademicPlan);
      expect(student.academicPlans).toContain(academicPlan);
      expect(academicPlan.degreeRequirement).toEqual(expect.objectContaining(degreeRequirementsData));
    });

    it('should approve a valid academic plan and deny an invalid one upon review', () => {
      // Create a valid AcademicPlan
      const validAcademicPlan = DegreePlanService.createAcademicPlanForStudent(student, advisor, {
        requirementID: 2,
        version: '2024A',
        requiredCourseIDs: ['101', '102'],
        electiveCategories: ['Humanities', 'History'],
        totalCredits: 120
      });
      validAcademicPlan.validatePlan = jest.fn(() => true);

      // Review the valid AcademicPlan
      DegreePlanService.reviewAndDecideOnPlan(student, validAcademicPlan);
      expect(validAcademicPlan.isApproved).toBe(true);

      // Create an invalid AcademicPlan
      const invalidAcademicPlan = DegreePlanService.createAcademicPlanForStudent(student, advisor, {
        requirementID: 3,
        version: '2024A',
        requiredCourseIDs: ['103', '104'], // Assuming these courses don't meet the requirement
        electiveCategories: ['Arts', 'Literature'], // Different elective categories
        totalCredits: 110 // Less than required credits
      });
      invalidAcademicPlan.validatePlan = jest.fn(() => false);

      // Review the invalid AcademicPlan
      DegreePlanService.reviewAndDecideOnPlan(student, invalidAcademicPlan);
      expect(invalidAcademicPlan.isApproved).toBe(false);
    });
  });
});