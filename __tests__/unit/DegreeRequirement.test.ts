
import { DegreeRequirement } from '../../src/models/DegreeRequirement';

describe('DegreeRequirement', () => {
    it('should correctly initialize a DegreeRequirement instance with constructor values', () => {
        const requirementID = 1;
        const version = '2022A';
        const requiredCourseIDs = ['CSCI101', 'MATH201'];
        const electiveCategories = ['Humanities', 'Social Sciences'];
        const totalCredits = 120;

        const degreeRequirement = new DegreeRequirement(requirementID, version, requiredCourseIDs, electiveCategories, totalCredits);

        expect(degreeRequirement.requirementID).toBe(requirementID);
        expect(degreeRequirement.version).toBe(version);
        expect(degreeRequirement.requiredCourseIDs).toEqual(requiredCourseIDs);
        expect(degreeRequirement.electiveCategories).toEqual(electiveCategories);
        expect(degreeRequirement.totalCredits).toBe(totalCredits);
    });
});
