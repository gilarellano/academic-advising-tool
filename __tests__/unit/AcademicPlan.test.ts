import { AcademicPlan } from '../../src/models/AcademicPlan';
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
});
