// RequirementCoursesService.test.ts

import { RequirementCoursesService } from '../../src/services/RequirementCoursesService';
import { RequirementCourses } from '../../src/models/RequirementCourses';

describe('RequirementCoursesService', () => {
    let service: RequirementCoursesService;

    beforeEach(() => {
        service = new RequirementCoursesService();
    });

    test('should associate a course with a requirement', () => {
        const requirementID = 1;
        const courseID = 101;
        const isElective = false;

        const association = service.associateCourseWithRequirement(requirementID, courseID, isElective);

        expect(association).toBeInstanceOf(RequirementCourses);
        expect(association.requirementID).toEqual(requirementID);
        expect(association.courseID).toEqual(courseID);
        expect(association.isElective).toEqual(isElective);
    });

    test('should disassociate a course from a requirement', () => {
        // First, create an association
        const requirementID = 2;
        const courseID = 102;
        service.associateCourseWithRequirement(requirementID, courseID, true);

        // Now, disassociate the course
        const result = service.disassociateCourseFromRequirement(requirementID, courseID);

        expect(result).toBeTruthy();
    });

    test('should return false when trying to disassociate a non-existing association', () => {
        const requirementID = 3;
        const courseID = 103;
        
        // Attempt to disassociate a course that was never associated
        const result = service.disassociateCourseFromRequirement(requirementID, courseID);

        expect(result).toBeFalsy();
    });

    test('should fetch all courses associated with a specific requirement', () => {
        // Create multiple associations
        service.associateCourseWithRequirement(1, 101, true);
        service.associateCourseWithRequirement(1, 102, false);
        service.associateCourseWithRequirement(2, 201, true);

        // Fetch courses for requirement 1
        const courses = service.getCoursesForRequirement(1);

        expect(courses.length).toEqual(2);
        expect(courses[0].courseID).toEqual(101);
        expect(courses[1].courseID).toEqual(102);
    });
});
