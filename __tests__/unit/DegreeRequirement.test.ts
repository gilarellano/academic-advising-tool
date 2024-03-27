
import { DegreeRequirement } from '../../src/models/DegreeRequirement';
import { Course } from '../../src/models/Course';

describe('DegreeRequirement', () => {
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
            const degreeRequirement = new DegreeRequirement(1, '2024A', ['101', '102'], ['Humanities', 'Arts'], 120);
            const courses = [
                new Course(101, 'Intro to Computer Science', 4, 'Computer Science', 'Core'),
                new Course(102, 'Algorithms', 3, 'Computer Science', 'Core'),
                new Course(201, 'World History', 2, 'History', 'Elective')
            ];

            const totalCredits = degreeRequirement.calculateCredits(courses);

            expect(totalCredits).toBe(9); // Expected sum of credits is 4 + 3 + 2 = 9
        });
    }); 
    
    describe('checkCourseRequirement()', () => {
        it('should return true if the course is a required course', () => {
            const degreeRequirement = new DegreeRequirement(1, '2023A', ['101', '102'], ['Humanities', 'Social Sciences'], 120);
            const requiredCourse = new Course(101, 'Introduction to Programming', 3, 'Computer Science', 'Core');

            const isRequired = degreeRequirement.checkCourseRequirement(requiredCourse);

            expect(isRequired).toBe(true); // The course is in the list of required courses
        });

        it('should return false if the course is not a required course', () => {
            const degreeRequirement = new DegreeRequirement(1, '2023A', ['101', '102'], ['Humanities', 'Social Sciences'], 120);
            const nonRequiredCourse = new Course(103, 'Philosophy 101', 3, 'Humanities', 'Elective');

            const isRequired = degreeRequirement.checkCourseRequirement(nonRequiredCourse);

            expect(isRequired).toBe(false); // The course is not in the list of required courses
        });
    });

    describe('checkElectiveRequirement()', () => {
        it('should return true if the course category matches an elective category', () => {
            const degreeRequirement = new DegreeRequirement(1, '2023B', ['101', '102'], ['Humanities', 'Arts'], 120);
            const electiveCourse = new Course(201, 'Philosophy 101', 3, 'Humanities', 'Humanities');
        
            const electiveMet = degreeRequirement.checkElectiveRequirement(electiveCourse);
        
            expect(electiveMet).toBe(true); // The course category matches one of the elective categories
        });

        it('should return false if the course category does not match any elective category', () => {
            const degreeRequirement = new DegreeRequirement(1, '2023B', ['101', '102'], ['Humanities', 'Arts'], 120);
            const nonElectiveCourse = new Course(203, 'Computer Science 101', 3, 'Computer Science', 'Core');

            const electiveMet = degreeRequirement.checkElectiveRequirement(nonElectiveCourse);

            expect(electiveMet).toBe(false); // The course category does not match any of the elective categories
        });
    });

});
