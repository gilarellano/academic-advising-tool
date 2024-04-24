// CourseService.ts

import { Course } from '../models/Course';

export class CourseService {
    private courses: Course[] = [];

    public createCourse(courseID: number, name: string, credits: number, department: string, category: string): Course {
        const newCourse = new Course(courseID, name, credits, department, category);
        this.courses.push(newCourse);
        return newCourse;
    }

    public updateCourse(courseID: number, name?: string, credits?: number, department?: string, category?: string): Course | undefined {
        const courseIndex = this.courses.findIndex(course => course.courseID === courseID);
        if (courseIndex === -1) {
            return undefined; // Course not found
        }
        const course = this.courses[courseIndex];
        if (name) course.name = name;
        if (credits) course.credits = credits;
        if (department) course.department = department;
        if (category) course.category = category;

        return course;
    }

    public fetchCourse(courseID: number): Course | undefined {
        return this.courses.find(course => course.courseID === courseID);
    }

    public deleteCourse(courseID: number): boolean {
        const courseIndex = this.courses.findIndex(course => course.courseID === courseID);
        if (courseIndex === -1) {
            return false; // Course not found
        }
        this.courses.splice(courseIndex, 1);
        return true;
    }

}
