import { AcademicPlanService } from '../../src/services/AcademicPlanService';
import { CourseService } from '../../src/services/CourseService';
import { PlanCoursesService } from '../../src/services/PlanCoursesService';

// Mocking the entire modules without specific implementations here
jest.mock('../../src/services/CourseService');
jest.mock('../../src/services/PlanCoursesService');

describe('AcademicPlanService', () => {
  let academicPlanService: AcademicPlanService;

  beforeEach(() => {
    // Update mock implementation to sometimes return undefined
    const mockFetchCourse = jest.fn((courseID: number) => {
      if (courseID === 3) return undefined; // Simulate a case where a course might not be found
      return {
        courseID,
        name: `Course ${courseID}`,
        credits: 3,
        department: 'Dept',
        category: 'Cat',
      };
    });
  
    const mockGetCoursesForPlan = jest.fn((planID: number) => [1, 2, 3]); // Include a courseID that will result in an undefined course
  
    CourseService.prototype.fetchCourse = mockFetchCourse;
    PlanCoursesService.prototype.getCoursesForPlan = mockGetCoursesForPlan;
  
    academicPlanService = new AcademicPlanService();
  });

  test('createPlan should create a new plan with a unique ID', () => {
    const plan1 = academicPlanService.createPlan();
    const plan2 = academicPlanService.createPlan();

    expect(plan1.planID).not.toEqual(plan2.planID);
  });

  test('createPlan should respect provided degreeRequirementID', () => {
    const specificRequirementID = 10;
    const plan = academicPlanService.createPlan(specificRequirementID);
    expect(plan.degreeRequirementID).toBe(specificRequirementID);
  });

  test('createPlan should use -1 as default degreeRequirementID when not provided', () => {
    const plan = academicPlanService.createPlan();
    expect(plan.degreeRequirementID).toBe(-1);
  });

  test('getPlanById should retrieve the correct plan', () => {
    const newPlan = academicPlanService.createPlan();
    const fetchedPlan = academicPlanService.getPlanById(newPlan.planID);

    expect(fetchedPlan).toBeDefined();
    expect(fetchedPlan?.planID).toEqual(newPlan.planID);
  });

  test('updatePlan should correctly update plan properties', () => {
    const plan = academicPlanService.createPlan();
    const updated = academicPlanService.updatePlan(plan.planID, 123, true);

    expect(updated).toBeDefined();
    expect(updated?.isApproved).toBe(true);
    expect(updated?.degreeRequirementID).toBe(123);
  });

  test('deletePlan should remove the plan', () => {
    const plan = academicPlanService.createPlan();
    const deleted = academicPlanService.deletePlan(plan.planID);
    const fetchedAfterDelete = academicPlanService.getPlanById(plan.planID);

    expect(deleted).toBe(true);
    expect(fetchedAfterDelete).toBeUndefined();
  });

  test('recalculateTotalCredits should update totalCredits accurately', async () => {
    const plan = academicPlanService.createPlan();
    await academicPlanService.recalculateTotalCredits(plan.planID);

    const updatedPlan = academicPlanService.getPlanById(plan.planID);
    expect(updatedPlan?.totalCredits).toBe(6); // Assuming each mocked course has 3 credits
  });
  
  test('recalculateTotalCredits for non-existent plan should not throw', async () => {
    await expect(async () => { 
        academicPlanService.recalculateTotalCredits(999); 
    }).not.toThrow();
  });

  test('recalculateTotalCredits should handle undefined courses gracefully', async () => {
    const plan = academicPlanService.createPlan();
    await academicPlanService.recalculateTotalCredits(plan.planID);
  
    expect(CourseService.prototype.fetchCourse).toHaveBeenCalledWith(3); // Ensure fetchCourse is called with the ID that leads to undefined

    const updatedPlan = academicPlanService.getPlanById(plan.planID);
    expect(updatedPlan?.totalCredits).toBe(6); // 2 courses with 3 credits each, one undefined course
  });
  

  test('deletePlan for non-existent plan should return false', () => {
    const result = academicPlanService.deletePlan(999); // Assuming 999 is a non-existent planID
    expect(result).toBe(false);
  });

  test('updatePlan for non-existent plan should return undefined', () => {
    const result = academicPlanService.updatePlan(999, 123, true); // Assuming 999 is a non-existent planID
    expect(result).toBeUndefined();
  });

});
