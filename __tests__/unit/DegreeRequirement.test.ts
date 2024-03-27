import { DegreeRequirement } from '../../src/models/DegreeRequirement';
import { Course } from '../../src/models/Course';

describe('DegreeRequirement', () => {
    let degreeRequirement: DegreeRequirement;
    let course1: Course;
    let course2: Course;
    let electiveCourse: Course;
    let nonElectiveCourse: Course;

    beforeEach(() => {
        // Common setup for DegreeRequirement
        degreeRequirement = new DegreeRequirement(1, '2024A', ['101', '102'], ['Humanities', 'History'], 120);

        // Common Courses setup, adjust as necessary for your tests
        course1 = new Course(101, 'Intro to Computer Science', 4, 'Computer Science', 'Core');
        course2 = new Course(102, 'Algorithms', 3, 'Computer Science', 'Core');
        electiveCourse = new Course(201, 'World History', 2, 'History', 'Humanities');
        nonElectiveCourse = new Course(203, 'Computer Science 101', 3, 'Computer Science', 'Core');
    });

    it('should correctly initialize a DegreeRequirement instance with constructor values', () => {
        const requirementID = 1;
        const version = '2022A';
        const requiredCourseIDs = ['CSCI101', 'MATH201'];
        const electiveCategories = ['Humanities', 'Social Sciences'];
        const totalCredits = 120;

        const degreeRequirement = new DegreeRequirement(requirementID, version, requiredCourseIDs, electiveCategories, totalCredits);

        expect(degreeRequirement.requirementID).toBe(requirementID);
        expect(degreeRequirement.version).toBe(version);
        expect(degreeRequirement.requiredCourseIDs).toEqual(requiredCourseIDs);
        expect(degreeRequirement.electiveCategories).toEqual(electiveCategories);
        expect(degreeRequirement.totalCredits).toBe(totalCredits);
    });

    describe('calculateCredits()', () => {
        it('should calculate the total credits for a given array of courses', () => {
            const courses = [course1, course2, electiveCourse];
            const totalCredits = degreeRequirement.calculateCredits(courses);

            expect(totalCredits).toBe(9); // Expected sum of credits is 4 + 3 + 2 = 9
        });
    });

    describe('checkCourseRequirement()', () => {
        it('should return true if the course is a required course', () => {
            const isRequired = degreeRequirement.checkCourseRequirement(course1);
            expect(isRequired).toBe(true); // The course is in the list of required courses
        });

        it('should return false if the course is not a required course', () => {
            const isRequired = degreeRequirement.checkCourseRequirement(nonElectiveCourse);
            expect(isRequired).toBe(false); // The course is not in the list of required courses
        });
    });

    describe('checkElectiveRequirement()', () => {
        it('should return true if the course category matches an elective category', () => {
            const electiveMet = degreeRequirement.checkElectiveRequirement(electiveCourse);
            expect(electiveMet).toBe(true); // The course category matches one of the elective categories
        });

        it('should return false if the course category does not match any elective category', () => {
            const electiveMet = degreeRequirement.checkElectiveRequirement(nonElectiveCourse);
            expect(electiveMet).toBe(false); // The course category does not match any of the elective categories
        });
    });
});
