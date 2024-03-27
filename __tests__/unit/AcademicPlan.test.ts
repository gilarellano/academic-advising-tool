import { AcademicPlan } from '../../src/models/AcademicPlan';
import { DegreeRequirement } from '../../src/models/DegreeRequirement';
import { Course } from '../../src/models/Course';

describe('AcademicPlan', () => {
    let academicPlan: AcademicPlan;
    let degreeRequirement: DegreeRequirement;

    beforeEach(() => {
        degreeRequirement = new DegreeRequirement(1, '2024C', ['101', '102'], ['Humanities'], 15);
        academicPlan = new AcademicPlan(1, '2023A', 'No customizations', 'In progress', degreeRequirement);
    });

    it('should be constructed with the given properties', () => {
        const planID = 1;
        const degreeRequirementsVersion = '2021';
        const customizations = 'Custom Plan';
        const progress = 'In Progress';
        const degreeRequirement = new DegreeRequirement(1, '2024C', ['101', '102'], ['Humanities'], 15);

        const academicPlan = new AcademicPlan(planID, degreeRequirementsVersion, customizations, progress, degreeRequirement);

        expect(academicPlan).toBeDefined();
        expect(academicPlan.planID).toBe(planID);
        expect(academicPlan.degreeRequirementsVersion).toBe(degreeRequirementsVersion);
        expect(academicPlan.customizations).toBe(customizations);
        expect(academicPlan.progress).toBe(progress);
        expect(academicPlan.courses).toEqual([]);
    });

    describe('addCourse()', () => {
        it('should add a course to the courses array', () => {
            const course = new Course(101, 'Introduction to Programming', 3, 'Computer Science', 'Core');

            expect(academicPlan.courses.length).toBe(0); // Ensure the courses array is initially empty

            academicPlan.addCourse(course);

            expect(academicPlan.courses.length).toBe(1); // The courses array should have one course after adding
            expect(academicPlan.courses[0]).toBe(course); // The added course should be the one we created
        });
    });

    describe('removeCourse()', () => {
        it('should remove a course from the courses array', () => {
            const course1 = new Course(101, 'Introduction to Programming', 3, 'Computer Science', 'Core');
            const course2 = new Course(102, 'Data Structures', 3, 'Computer Science', 'Core');

            academicPlan.addCourse(course1);
            academicPlan.addCourse(course2);
            expect(academicPlan.courses.length).toBe(2); // Ensure the courses array has two courses before removal

            academicPlan.removeCourse(course1);

            expect(academicPlan.courses.length).toBe(1); // The courses array should have one course after removal
            expect(academicPlan.courses[0]).toBe(course2); // The remaining course should be 'course2'
        });
    });

    describe('calculateTotalCredits()', () => {
        it('should calculate the total credits of all courses in the plan', () => {
            const course1 = new Course(101, 'Introduction to Programming', 3, 'Computer Science', 'Core');
            const course2 = new Course(102, 'Data Structures', 4, 'Computer Science', 'Core');
            const course3 = new Course(103, 'Algorithms', 3, 'Computer Science', 'Core');

            academicPlan.addCourse(course1);
            academicPlan.addCourse(course2);
            academicPlan.addCourse(course3);

            const totalCredits = academicPlan.calculateTotalCredits();

            expect(totalCredits).toBe(10); // The sum of credits for the three courses should be 10
        });
    });

    describe('validatePlan()', () => {
        let degreeRequirement: DegreeRequirement;
        beforeEach(() => {
            degreeRequirement = new DegreeRequirement(1, '2024C', ['101', '102'], ['Humanities'], 12);
        });

        it('should return false if the plan has exact required credits but is missing required courses', () => {
            const plan = new AcademicPlan(3, '2024C', 'No customizations', 'In progress', degreeRequirement);
            plan.courses = [
                new Course(101, 'Intro to Computer Science', 6, 'Computer Science', 'Core'),
                new Course(201, 'Philosophy 101', 6, 'Humanities', 'Elective')  // Missing required course 102
            ];

            expect(plan.validatePlan()).toBe(false);
        });

        it('should return true if the plan has more than required credits and all required courses', () => {
            const plan = new AcademicPlan(4, '2024C', 'No customizations', 'In progress', degreeRequirement);
            plan.courses = [
                new Course(101, 'Intro to Computer Science', 6, 'Computer Science', 'Core'),
                new Course(102, 'Data Structures', 5, 'Computer Science', 'Core'),
                new Course(201, 'Advanced Philosophy', 4, 'Humanities', 'Elective')  // Extra credits
            ];

            expect(plan.validatePlan()).toBe(true);
        });

        it('should return false if the plan has required courses but insufficient total credits', () => {
            const plan = new AcademicPlan(5, '2024C', 'No customizations', 'In progress', degreeRequirement);
            plan.courses = [
                new Course(101, 'Intro to Computer Science', 6, 'Computer Science', 'Core'),
                new Course(102, 'Data Structures', 5, 'Computer Science', 'Core')  // Total 11 credits, 1 short of 12 required
            ];

            expect(plan.validatePlan()).toBe(false);
        });

        it('should return true if the plan meets all criteria and includes an unrelated course', () => {
            const plan = new AcademicPlan(6, '2024C', 'No customizations', 'In progress', degreeRequirement);
            plan.courses = [
                new Course(101, 'Intro to Computer Science', 6, 'Computer Science', 'Core'),
                new Course(102, 'Data Structures', 5, 'Computer Science', 'Core'),
                new Course(301, 'Random Course', 3, 'Random Department', 'Elective')  // Unrelated course
            ];

            expect(plan.validatePlan()).toBe(true);
        });

        it('should return true if the plan meets all criteria but includes duplicate courses', () => {
            const plan = new AcademicPlan(7, '2024C', 'No customizations', 'In progress', degreeRequirement);
            plan.courses = [
                new Course(101, 'Intro to Computer Science', 6, 'Computer Science', 'Core'),
                new Course(101, 'Intro to Computer Science', 6, 'Computer Science', 'Core'),  // Duplicate course
                new Course(102, 'Data Structures', 5, 'Computer Science', 'Core')
            ];

            expect(plan.validatePlan()).toBe(true);  // Assuming duplicates don't invalidate the plan
        });
    });
    
});
