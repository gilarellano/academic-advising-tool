import { Advisor } from '../../src/models/Advisor';

describe('Advisor', () => {
  const userID = 2;
  const name = 'Jane Doe';
  const email = 'janedoe@example.com';
  const advisorID = 789012;
  const department = 'Computer Science';
  const defaultUserID = -1;
  const defaultName = 'Unknown';
  const defaultEmail = 'no-email@example.com';
  const defaultRole = 'Advisor';
  const defaultAdvisorID = -1;
  const defaultDepartment = 'Undeclared';

  describe('construction with specified values', () => {
    let advisor: Advisor;

    beforeEach(() => {
      advisor = new Advisor(userID, name, email, defaultRole, advisorID, department);
    });

    it('initializes all properties with specified values', () => {
      expect(advisor).toBeInstanceOf(Advisor);
      expect(advisor.userID).toBe(userID);
      expect(advisor.name).toBe(name);
      expect(advisor.email).toBe(email);
      expect(advisor.role).toBe(defaultRole);
      expect(advisor.advisorID).toBe(advisorID);
      expect(advisor.department).toBe(department);
    });
  });

  describe('construction with default values', () => {
    let advisor: Advisor;

    beforeEach(() => {
      advisor = new Advisor();
    });

    it('initializes all properties with default values when no arguments are provided', () => {
      expect(advisor).toBeInstanceOf(Advisor);
      expect(advisor.userID).toBe(defaultUserID);
      expect(advisor.name).toBe(defaultName);
      expect(advisor.email).toBe(defaultEmail);
      expect(advisor.role).toBe(defaultRole);
      expect(advisor.advisorID).toBe(defaultAdvisorID);
      expect(advisor.department).toBe(defaultDepartment);
    });
  });

  describe('dispose method', () => {
    it('should perform cleanup operations for Student', () => {
        const student = new Advisor();

        const consoleSpy = jest.spyOn(console, 'log');
        student.dispose();
        expect(consoleSpy).toHaveBeenCalledWith(`Cleaning up Advisor resources for ${defaultName}`);
    });
  });

});
