// RequirementCourses.ts

export class RequirementCourses {
    requirementID: number;
    courseID: number;
    isElective: boolean;

    constructor(requirementID: number, courseID: number, isElective: boolean) {
        this.requirementID = requirementID;
        this.courseID = courseID;
        this.isElective = isElective;
    }

}

