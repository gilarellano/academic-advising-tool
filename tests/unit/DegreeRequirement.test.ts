import { DegreeRequirement } from '../../src/models/DegreeRequirement';

describe('DegreeRequirement', () => {
    it('should correctly initialize with provided constructor values', () => {
        const requirementID = 1;
        const version = '1.0';
        const totalCredits = 10;

        const degreeRequirement = new DegreeRequirement(requirementID, version, totalCredits);

        expect(degreeRequirement.requirementID).toBe(requirementID);
        expect(degreeRequirement.version).toBe(version);
        expect(degreeRequirement.totalCredits).toBe(totalCredits);
    });

    it('should use default values when no constructor values provided', () => {
        const degreeRequirement = new DegreeRequirement();

        expect(degreeRequirement.requirementID).toBe(0);
        expect(degreeRequirement.version).toBe('-1.0');
        expect(degreeRequirement.totalCredits).toBe(0);
    });

    it('should allow partial constructor arguments', () => {
        const degreeRequirementWithPartialArgs = new DegreeRequirement(2);

        expect(degreeRequirementWithPartialArgs.requirementID).toBe(2);
        expect(degreeRequirementWithPartialArgs.version).toBe('-1.0'); // default value
        expect(degreeRequirementWithPartialArgs.totalCredits).toBe(0); // default value

        const degreeRequirementWithAnotherPartialArgs = new DegreeRequirement(undefined, '2.0');

        expect(degreeRequirementWithAnotherPartialArgs.requirementID).toBe(0); // default value
        expect(degreeRequirementWithAnotherPartialArgs.version).toBe('2.0');
        expect(degreeRequirementWithAnotherPartialArgs.totalCredits).toBe(0); // default value
    });
});
