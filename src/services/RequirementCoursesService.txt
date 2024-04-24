// RequirementCoursesService.ts

import { RequirementCourses } from '../models/RequirementCourses';

export class RequirementCoursesService {
    private requirementCourses: RequirementCourses[] = [];

    public associateCourseWithRequirement(requirementID: number, courseID: number, isElective: boolean): RequirementCourses {
        const newAssociation = new RequirementCourses(requirementID, courseID, isElective);
        this.requirementCourses.push(newAssociation);
        return newAssociation;
    }

    public disassociateCourseFromRequirement(requirementID: number, courseID: number): boolean {
        const index = this.requirementCourses.findIndex(assoc => assoc.requirementID === requirementID && assoc.courseID === courseID);
        if (index === -1) {
            return false; // Association not found
        }
        this.requirementCourses.splice(index, 1);
        return true;
    }

    public getCoursesForRequirement(requirementID: number): RequirementCourses[] {
        return this.requirementCourses.filter(assoc => assoc.requirementID === requirementID);
    }
}
