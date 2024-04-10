// DegreeRequirementService.test.ts

import { DegreeRequirement } from '../../src/models/DegreeRequirement';
import { DegreeRequirementService } from '../../src/services/DegreeRequirementService';

describe('DegreeRequirementService', () => {
    let service: DegreeRequirementService;

    beforeEach(() => {
        service = new DegreeRequirementService();
    });

    test('addRequirement should add a requirement', () => {
        const requirement = new DegreeRequirement(1, '1.0', 120);
        service.addRequirement(requirement);
        
        expect(service.getRequirementById(1)).toEqual(requirement);
    });

    test('getRequirementById should throw an error if requirement does not exist', () => {
        expect(() => service.getRequirementById(99)).toThrow('DegreeRequirement with ID 99 not found.');
    });

    test('updateRequirement should update an existing requirement', () => {
        const requirement = new DegreeRequirement(1, '1.0', 120);
        service.addRequirement(requirement);

        const updatedRequirement = new DegreeRequirement(1, '1.1', 130);
        service.updateRequirement(updatedRequirement);

        expect(service.getRequirementById(1)).toEqual(updatedRequirement);
    });

    test('deleteRequirement should remove a requirement', () => {
        const requirement1 = new DegreeRequirement(1, '1.0', 120);
        const requirement2 = new DegreeRequirement(2, '2.0', 100);
        service.addRequirement(requirement1);
        service.addRequirement(requirement2);

        service.deleteRequirement(1);

        expect(() => service.getRequirementById(1)).toThrow('DegreeRequirement with ID 1 not found.');
        expect(service.getRequirementById(2)).toEqual(requirement2);
    });

    test('updateRequirement should not update any requirement if it does not exist', () => {
        const initialRequirement = new DegreeRequirement(1, '1.0', 120);
        service.addRequirement(initialRequirement);

        const nonExistentRequirement = new DegreeRequirement(99, '99.0', 150);
        service.updateRequirement(nonExistentRequirement);

        // Expect the initial requirement to remain unchanged since the non-existent ID should not match any requirement
        expect(service.getRequirementById(1)).toEqual(initialRequirement);
        // Optionally, you can also check that the total count of requirements hasn't changed
        expect(() => service.getRequirementById(99)).toThrow('DegreeRequirement with ID 99 not found.');
    });

    test('deleteRequirement should not remove any requirement if it does not exist', () => {
        const requirement1 = new DegreeRequirement(1, '1.0', 120);
        service.addRequirement(requirement1);

        // Attempt to delete a non-existent requirement
        service.deleteRequirement(99);

        // Expect the existing requirement to still be present
        expect(service.getRequirementById(1)).toEqual(requirement1);
        // Optionally, you can also check that the total count of requirements hasn't decreased
    });
    
});
