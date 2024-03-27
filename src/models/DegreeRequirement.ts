
import { Course } from './Course';  // Assuming you have the Course class defined

export class DegreeRequirement {
    requirementID: number;
    version: string;
    requiredCourseIDs: string[];
    electiveCategories: string[];
    totalCredits: number;

    constructor(
        requirementID: number = 0,
        version: string = '-1.0',
        requiredCourseIDs: string[] = [],
        electiveCategories: string[] = [],
        totalCredits: number = 0
    ) {
        this.requirementID = requirementID;
        this.version = version;
        this.requiredCourseIDs = requiredCourseIDs;
        this.electiveCategories = electiveCategories;
        this.totalCredits = totalCredits;
    }

    calculateCredits(courses: Course[]): number {
        return courses.reduce((acc, course) => acc + course.credits, 0);
    }
    
    checkCourseRequirement(course: Course): boolean {
        // Check if the course is in the list of required courses
        return this.requiredCourseIDs.includes(course.courseID.toString());
    }

    checkElectiveRequirement(course: Course): boolean {
        return this.electiveCategories.includes(course.category);
    }

}
