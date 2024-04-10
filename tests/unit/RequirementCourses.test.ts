import { RequirementCourses } from '../../src/models/RequirementCourses';

describe('RequirementCourses', () => {
    it('should create an instance with the given requirement ID and course ID', () => {
        const requirementID = 1;
        const courseID = 101;
        const isElective = false;

        const requirementCourse = new RequirementCourses(requirementID, courseID, isElective);

        expect(requirementCourse).toBeDefined();
        expect(requirementCourse.requirementID).toBe(requirementID);
        expect(requirementCourse.courseID).toBe(courseID);
        expect(requirementCourse.isElective).toBe(false);
    });

});