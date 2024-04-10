// CourseService.test.ts

import { CourseService } from '../../src/services/CourseService';

describe('CourseService', () => {
    let courseService: CourseService;

    beforeEach(() => {
        // Initialize a new CourseService before each test to ensure test isolation
        courseService = new CourseService();
    });

    describe('Course Creation', () => {
        test('creates a course with the correct properties', () => {
            const course = courseService.createCourse(1, 'Introduction to Programming', 3, 'Computer Science', 'Core');
            expect(course).toEqual({
                courseID: 1,
                name: 'Introduction to Programming',
                credits: 3,
                department: 'Computer Science',
                category: 'Core'
            });
        });
    });

    describe('Course Updates', () => {
        test('updates the name and credits of an existing course', () => {
            courseService.createCourse(2, 'Data Structures', 3, 'Computer Science', 'Core');
            const updatedCourse = courseService.updateCourse(2, 'Advanced Data Structures', 4);
            expect(updatedCourse).toEqual(expect.objectContaining({
                name: 'Advanced Data Structures',
                credits: 4
            }));
        });

        test('updates the department and category of an existing course', () => {
            courseService.createCourse(5, 'Database Systems', 3, 'Computer Science', 'Core');
            const updatedCourse = courseService.updateCourse(5, undefined, undefined, 'Information Technology', 'Elective');
            expect(updatedCourse).toEqual(expect.objectContaining({
                department: 'Information Technology',
                category: 'Elective'
            }));
            expect(updatedCourse).toEqual(expect.objectContaining({
                courseID: 5,
                name: 'Database Systems',
                credits: 3
            }));
        });

        test('returns undefined when attempting to update a non-existing course', () => {
            const updatedCourse = courseService.updateCourse(999, 'Non-Existing Course', 0, 'None', 'Optional');
            expect(updatedCourse).toBeUndefined();
        });
    });

    describe('Course Retrieval and Deletion', () => {
        test('fetches an existing course', () => {
            courseService.createCourse(3, 'Algorithms', 3, 'Computer Science', 'Core');
            const course = courseService.fetchCourse(3);
            expect(course).toEqual(expect.objectContaining({
                courseID: 3,
                name: 'Algorithms'
            }));
        });

        test('deletes an existing course and ensures it cannot be fetched', () => {
            courseService.createCourse(4, 'Operating Systems', 3, 'Computer Science', 'Core');
            const deletionSuccess = courseService.deleteCourse(4);
            expect(deletionSuccess).toBe(true);
            const course = courseService.fetchCourse(4);
            expect(course).toBeUndefined();
        });

        test('returns false when attempting to delete a non-existing course', () => {
            const deletionSuccess = courseService.deleteCourse(999);
            expect(deletionSuccess).toBe(false);
        });
    });

});
