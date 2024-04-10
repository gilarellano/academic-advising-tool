import { PlanCourses } from '../../src/models/PlanCourses';

describe('RequirementCourses', () => {
    it('should create an instance with the given requirement ID and course ID', () => {
        const planID = 1;
        const courseID = 101;

        const planCourse = new PlanCourses(planID, courseID);

        expect(planCourse).toBeDefined();
        expect(planCourse.planID).toBe(planID);
        expect(planCourse.courseID).toBe(courseID);
    });

});
