import { AcademicPlan } from '../../src/models/AcademicPlan';
import { DegreeRequirement } from '../../src/models/DegreeRequirement';
import { Course } from '../../src/models/Course';

describe('AcademicPlan', () => {
    it('should be constructed with the given properties', () => {
        const planID = 1;
        const degreeRequirementsVersion = '2021';
        const customizations = 'Custom Plan';
        const progress = 'In Progress';

        const academicPlan = new AcademicPlan(planID, degreeRequirementsVersion, customizations, progress);

        expect(academicPlan).toBeDefined();
        expect(academicPlan.planID).toBe(planID);
        expect(academicPlan.degreeRequirementsVersion).toBe(degreeRequirementsVersion);
        expect(academicPlan.customizations).toBe(customizations);
        expect(academicPlan.progress).toBe(progress);
        expect(academicPlan.courses).toEqual([]);
    });

    describe('addCourse()', () => {
        it('should add a course to the courses array', () => {
            const plan = new AcademicPlan(1, '2023A', 'No customizations', 'In progress');
            const course = new Course(101, 'Introduction to Programming', 3, 'Computer Science', 'Core');

            expect(plan.courses.length).toBe(0); // Ensure the courses array is initially empty

            plan.addCourse(course);

            expect(plan.courses.length).toBe(1); // The courses array should have one course after adding
            expect(plan.courses[0]).toBe(course); // The added course should be the one we created
        });
    });

    describe('removeCourse()', () => {
        it('should remove a course from the courses array', () => {
            const plan = new AcademicPlan(1, '2023A', 'No customizations', 'In progress');
            const course1 = new Course(101, 'Introduction to Programming', 3, 'Computer Science', 'Core');
            const course2 = new Course(102, 'Data Structures', 3, 'Computer Science', 'Core');

            plan.addCourse(course1);
            plan.addCourse(course2);
            expect(plan.courses.length).toBe(2); // Ensure the courses array has two courses before removal

            plan.removeCourse(course1);

            expect(plan.courses.length).toBe(1); // The courses array should have one course after removal
            expect(plan.courses[0]).toBe(course2); // The remaining course should be 'course2'
        });
    });

    describe('calculateTotalCredits()', () => {
        it('should calculate the total credits of all courses in the plan', () => {
            const plan = new AcademicPlan(1, '2023A', 'No customizations', 'In progress');
            const course1 = new Course(101, 'Introduction to Programming', 3, 'Computer Science', 'Core');
            const course2 = new Course(102, 'Data Structures', 4, 'Computer Science', 'Core');
            const course3 = new Course(103, 'Algorithms', 3, 'Computer Science', 'Core');

            plan.addCourse(course1);
            plan.addCourse(course2);
            plan.addCourse(course3);

            const totalCredits = plan.calculateTotalCredits();

            expect(totalCredits).toBe(10); // The sum of credits for the three courses should be 10
        });
    });

    describe('validatePlan()', () => {
        it('should return true if the plan meets all validation criteria, including required courses and elective categories', () => {
            const degreeRequirement = new DegreeRequirement(1, '2024C', ['101', '102'], ['Humanities'], 15);
            const plan = new AcademicPlan(1, '2024C', 'No customizations', 'In progress');
            plan.courses = [
                new Course(101, 'Intro to Computer Science', 6, 'Computer Science', 'Core'),
                new Course(102, 'Data Structures', 5, 'Computer Science', 'Core'),
                new Course(201, 'Philosophy 101', 4, 'Humanities', 'Elective')
            ];

            const isValid = plan.validatePlan();

            expect(isValid).toBe(true);
        });

        it('should return false if the plan does not meet one or more validation criteria', () => {
            const degreeRequirement = new DegreeRequirement(2, '2024C', ['101', '103'], ['Arts'], 15);
            const plan = new AcademicPlan(2, '2024C', 'No customizations', 'In progress');
            plan.courses = [
                new Course(101, 'Intro to Computer Science', 6, 'Computer Science', 'Core'),
                new Course(102, 'Data Structures', 5, 'Computer Science', 'Core')  // Missing required course 103 and no Arts elective
            ];

            const isValid = plan.validatePlan();

            expect(isValid).toBe(false);
        });
    });
});
