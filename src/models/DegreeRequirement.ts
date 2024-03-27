
import { Course } from './Course';  // Assuming you have the Course class defined

export class DegreeRequirement {
    requirementID: number;
    version: string;
    requiredCourseIDs: string[];
    electiveCategories: string[];
    totalCredits: number;

    constructor(requirementID: number, version: string, requiredCourseIDs: string[], electiveCategories: string[], totalCredits: number) {
        this.requirementID = requirementID;
        this.version = version;
        this.requiredCourseIDs = requiredCourseIDs;
        this.electiveCategories = electiveCategories;
        this.totalCredits = totalCredits;
    }

    checkCourseRequirement(course: Course): boolean {
        // Check if the course is in the list of required courses
        return this.requiredCourseIDs.includes(course.courseID.toString());
    }

    calculateCredits(courses: Course[]): number {
        // Sum up the credits for the provided courses
        return courses.reduce((total, course) => total + course.credits, 0);
    }

    checkElectiveRequirement(courses: Course[]): boolean {
        // Placeholder logic to check if elective requirements are met
        // You will need to implement the actual logic based on your application's rules
        // For now, let's assume it always returns true
        return true;
    }
}
