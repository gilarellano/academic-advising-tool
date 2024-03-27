import { Course } from './Course';  // Assuming you will create this class

export class AcademicPlan {
    planID: number;
    degreeRequirementsVersion: string;
    customizations: string;  // This could be a complex object or array depending on your needs
    progress: string;  // This could be an enum or a more complex type
    courses: Course[] = [];  // Initialize an empty array for courses

    constructor(planID: number, degreeRequirementsVersion: string, customizations: string, progress: string) {
        this.planID = planID;
        this.degreeRequirementsVersion = degreeRequirementsVersion;
        this.customizations = customizations;
        this.progress = progress;
    }

    addCourse(course: Course): void {
        // Logic to add a course to the academic plan
        this.courses.push(course);
    }

    removeCourse(course: Course): void {
        // Logic to remove a course from the academic plan
        const courseIndex = this.courses.findIndex(c => c.courseID === course.courseID);
        if (courseIndex !== -1) {
            this.courses.splice(courseIndex, 1);
        }
    }

    validatePlan(): boolean {
        // Logic to validate the academic plan against degree requirements
        // Placeholder return, replace with actual validation logic
        return true;  // Assume valid for now
    }

    calculateTotalCredits(): number {
        return this.courses.reduce((total, course) => total + course.credits, 0);
    }
}
