// AcademicPlan.ts

export class AcademicPlan {
    planID: number;
    degreeRequirementID: number;
    totalCredits: number;
    isApproved: boolean = false;

    constructor(
        planID: number = 0,
        degreeRequirementID: number = -1,
        isApproved = false,
    ) {
        this.planID = planID;
        this.degreeRequirementID = degreeRequirementID;
        this.totalCredits = 0;
        this.isApproved = isApproved;
    }

    updateTotalCredits(newTotal: number): void {
        this.totalCredits = newTotal;
    }

}
