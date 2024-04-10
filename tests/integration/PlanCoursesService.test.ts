// PlanCoursesService.test.ts

import { PlanCoursesService } from '../../src/services/PlanCoursesService';

describe('PlanCoursesService', () => {
    let service: PlanCoursesService;

    beforeEach(() => {
        service = new PlanCoursesService();
    });

    test('should add a course to a plan', () => {
        const planID = 1;
        const courseID = 101;
        service.addCourseToPlan(planID, courseID);

        const coursesForPlan = service.getCoursesForPlan(planID);
        expect(coursesForPlan).toContain(courseID);
    });

    test('should remove a course from a plan', () => {
        const planID = 2;
        const courseID = 202;
        service.addCourseToPlan(planID, courseID);

        const removeSuccess = service.removeCourseFromPlan(planID, courseID);
        expect(removeSuccess).toBe(true);

        const coursesForPlan = service.getCoursesForPlan(planID);
        expect(coursesForPlan).not.toContain(courseID);
    });

    test('should return false when removing a course that is not found', () => {
        const planID = 3;
        const courseID = 303;
        const nonExistentCourseID = 404;
        service.addCourseToPlan(planID, courseID);

        const removeSuccess = service.removeCourseFromPlan(planID, nonExistentCourseID);
        expect(removeSuccess).toBe(false);
    });

    test('should fetch all courses for a plan', () => {
        const planID = 4;
        const courseIDs = [401, 402, 403];
        courseIDs.forEach(courseID => service.addCourseToPlan(planID, courseID));

        const coursesForPlan = service.getCoursesForPlan(planID);
        expect(coursesForPlan.length).toBe(courseIDs.length);
        courseIDs.forEach(courseID => {
            expect(coursesForPlan).toContain(courseID);
        });
    });
});
