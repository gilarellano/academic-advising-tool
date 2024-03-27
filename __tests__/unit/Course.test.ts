import { Course } from '../../src/models/Course';

describe('Course Class', () => {
    it('should create a course with the correct properties', () => {
        const courseID = 101;
        const name = 'Introduction to TypeScript';
        const credits = 3;
        const department = 'Computer Science';
        const category = 'Elective';

        const course = new Course(courseID, name, credits, department, category);

        expect(course).toBeInstanceOf(Course);
        expect(course.courseID).toBe(courseID);
        expect(course.name).toBe(name);
        expect(course.credits).toBe(credits);
        expect(course.department).toBe(department);
        expect(course.category).toBe(category);
    });
});
