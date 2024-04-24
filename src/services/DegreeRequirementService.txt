// DegreeRequirementService.ts

import { DegreeRequirement } from '../models/DegreeRequirement';

export class DegreeRequirementService {
    private requirements: DegreeRequirement[] = [];

    public addRequirement(requirement: DegreeRequirement): void {
        this.requirements.push(requirement);
    }

    public getRequirementById(requirementID: number): DegreeRequirement {
        const requirement = this.requirements.find(req => req.requirementID === requirementID);
        if (!requirement) {
            // Throw a custom error if the requirement is not found
            throw new Error(`DegreeRequirement with ID ${requirementID} not found.`);
        }
        return requirement;
    }

    public updateRequirement(updatedRequirement: DegreeRequirement): void {
        const index = this.requirements.findIndex(req => req.requirementID === updatedRequirement.requirementID);
        if (index !== -1) {
            this.requirements[index] = updatedRequirement;
        } else {
            console.log("Requirement not found, cannot update.");
        }
    }

    public deleteRequirement(requirementID: number): void {
        const index = this.requirements.findIndex(req => req.requirementID === requirementID);
        if (index !== -1) {
            this.requirements.splice(index, 1);
        } else {
            console.log("Requirement not found, cannot delete.");
        }
    }

    /*
    public validatePlan(plan: AcademicPlan, requirementID: number): boolean {
        const requirement = this.getRequirementById(requirementID);
        const requirementCourses = requirementCoursesService.getCoursesForRequirement(requirementID);

        const totalCredits = courseService.calculateTotalCredits(plan.courses);

        // Check if the total credits meet or exceed the requirement
        if (totalCredits < requirement.totalCredits) return false;

        // Validate required courses
        for (const reqCourse of requirementCourses.filter(rc => !rc.isElective)) {
            if (!plan.courses.includes(reqCourse.courseID)) return false; // Required course not in plan
        }

        // Validate elective courses, if needed
        const electiveCredits = requirementCourses
            .filter(rc => rc.isElective && plan.courses.includes(rc.courseID))
            .map(ec => courseService.getCourseById(ec.courseID).credits)
            .reduce((acc, credits) => acc + credits, 0);

        // Assume there's a minimum elective credits requirement in DegreeRequirement
        // This is just an example, adapt based on your actual requirements
        if (electiveCredits < requirement.minElectiveCredits) return false;

        // If all checks pass
        return true;
    }
    */
    
}
