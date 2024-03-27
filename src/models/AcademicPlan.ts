import { Course } from './Course';  // Assuming you will create this class
import { DegreeRequirement } from './DegreeRequirement';

export class AcademicPlan {
    planID: number;
    degreeRequirementsVersion: string;
    customizations: string;  // This could be a complex object or array depending on your needs
    progress: string;  // This could be an enum or a more complex type
    courses: Course[] = [];  // Initialize an empty array for courses
    degreeRequirement: DegreeRequirement;

    constructor(planID: number, degreeRequirementsVersion: string, customizations: string, progress: string, degreeRequirement: DegreeRequirement) {
        this.planID = planID;
        this.degreeRequirementsVersion = degreeRequirementsVersion;
        this.customizations = customizations;
        this.progress = progress;
        this.degreeRequirement = degreeRequirement;
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
        // Calculate the total credits of all courses in the academic plan
        const totalCredits = this.calculateTotalCredits();
    
        // Check if the total credits are less than the required credits for the degree
        if (totalCredits < this.degreeRequirement.totalCredits) {
            // If not enough credits, the plan is not valid
            return false;
        }
    
        // Iterate over the required course IDs defined in the degree requirement
        for (const courseId of this.degreeRequirement.requiredCourseIDs) {
            // Check if the current academic plan includes each required course
            const hasRequiredCourse = this.courses.some(course => course.courseID.toString() === courseId);
    
            // If any required course is missing, the plan is not valid
            if (!hasRequiredCourse) {
                return false;
            }
        }
    
        // Iterate over the courses in the academic plan
        for (const course of this.courses) {
            // Check if the course's category is among the elective categories defined in the degree requirement
            if (this.degreeRequirement.electiveCategories.includes(course.category)) {
                // For each course that falls into an elective category, check if it meets the elective requirement
                const electiveMet = this.degreeRequirement.checkElectiveRequirement(course);
    
                // If any elective course does not meet the elective requirement, the plan is not valid
                if (!electiveMet) {
                    return false;
                }
            }
        }
    
        // If all checks pass, the academic plan is considered valid
        return true;
    }

    calculateTotalCredits(): number {
        return this.courses.reduce((total, course) => total + course.credits, 0);
    }
}
