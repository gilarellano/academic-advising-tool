import { AcademicPlan } from '../../src/models/AcademicPlan';

describe('AcademicPlan', () => {
  const planID = 1;
  const degreeRequirementID = 2;
  const defaultPlanID = 0;
  const defaultDegreeRequirementID = -1;
  const initialTotalCredits = 0;
  const newTotalCredits = 15;

  describe('construction', () => {
    it('should initialize with specified planID, degreeRequirementID, and approval status', () => {
      const academicPlan = new AcademicPlan(planID, degreeRequirementID, false);

      expect(academicPlan).toBeDefined();
      expect(academicPlan.planID).toBe(planID);
      expect(academicPlan.degreeRequirementID).toBe(degreeRequirementID);
      expect(academicPlan.totalCredits).toBe(initialTotalCredits);
      expect(academicPlan.isApproved).toBe(false);
    });

    it('should initialize with default values when no arguments are provided', () => {
      const academicPlan = new AcademicPlan();

      expect(academicPlan).toBeDefined();
      expect(academicPlan.planID).toBe(defaultPlanID);
      expect(academicPlan.degreeRequirementID).toBe(defaultDegreeRequirementID);
      expect(academicPlan.totalCredits).toBe(initialTotalCredits);
      expect(academicPlan.isApproved).toBe(false);
    });
  });

  describe('behavior', () => {
    let academicPlan: AcademicPlan;

    beforeEach(() => {
      academicPlan = new AcademicPlan(planID, degreeRequirementID, false);
    });

    it('should update totalCredits correctly', () => {
      academicPlan.updateTotalCredits(newTotalCredits);

      expect(academicPlan.totalCredits).toBe(newTotalCredits);
    });
  });
});
