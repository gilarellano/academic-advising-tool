
// DegreeRequirement.ts

export class DegreeRequirement {
    requirementID: number;
    version: string;
    totalCredits: number;

    constructor(
        requirementID: number = 0,
        version: string = '-1.0',
        totalCredits: number = 0
    ) {
        this.requirementID = requirementID;
        this.version = version;
        this.totalCredits = totalCredits;
    }
}