import { Student } from '../../src/models/Student';

describe('Student', () => {
  const userID = 1;
  const name = 'John Doe';
  const email = 'johndoe@example.com';
  const studentID = 123456;
  const requirementID = 101; // Assuming a mock requirement ID
  const advisorID = 101;
  const currentCredits = 30;
  const defaultUserID = -1;
  const defaultName = 'Unknown';
  const defaultEmail = 'no-email@example.com';
  const defaultStudentID = -1;
  const defaultRequirementID = -1;
  const defaultAdvisorID = -1;
  const initialCredits = 0;

  describe('construction', () => {
    let student: Student;

    beforeEach(() => {
      student = new Student(userID, name, email, 'Student', studentID, requirementID, advisorID, currentCredits);
    });

    it('initializes all properties with specified values', () => {
      expect(student).toBeInstanceOf(Student);
      expect(student.userID).toBe(userID);
      expect(student.name).toBe(name);
      expect(student.email).toBe(email);
      expect(student.role).toBe('Student'); // Assuming role is always 'Student' for Student instances
      expect(student.studentID).toBe(studentID);
      expect(student.requirementID).toBe(requirementID);
      expect(student.advisorID).toBe(advisorID);
      expect(student.currentCredits).toBe(currentCredits);
    });
  });

  describe('default values', () => {
    it('uses default values when no arguments are provided to the constructor', () => {
      const student = new Student();

      expect(student).toBeInstanceOf(Student);
      expect(student.userID).toBe(defaultUserID);
      expect(student.name).toBe(defaultName);
      expect(student.email).toBe(defaultEmail);
      expect(student.role).toBe('Student'); // Assuming role is always 'Student' for Student instances
      expect(student.studentID).toBe(defaultStudentID);
      expect(student.requirementID).toBe(defaultRequirementID);
      expect(student.advisorID).toBe(defaultAdvisorID);
      expect(student.currentCredits).toBe(initialCredits);
    });
  });

  describe('dispose method', () => {
    it('should perform cleanup operations for Student', () => {
        const student = new Student();

        const consoleSpy = jest.spyOn(console, 'log');
        student.dispose();
        expect(consoleSpy).toHaveBeenCalledWith(`Cleaning up Student resources for ${defaultName}`);
    });
  });

});
