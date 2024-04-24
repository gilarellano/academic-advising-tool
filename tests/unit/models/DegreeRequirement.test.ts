// DegreeRequirement.test.ts
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { DegreeRequirement } from '../../../src/models';

describe('DegreeRequirement Entity', () => {
  it('should have an Entity decorator', () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    expect(entities).toContain(DegreeRequirement);
  });

  it('should have a primary generated column "degreeRequirementID"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === DegreeRequirement);
    const degreeRequirementIDColumn = columns.find(column => column.propertyName === 'degreeRequirementID');
    expect(degreeRequirementIDColumn).toBeDefined();
    if (degreeRequirementIDColumn) {
      expect(degreeRequirementIDColumn.mode).toBe('regular');
      expect(degreeRequirementIDColumn.options.primary).toBeTruthy();
    }
  });

  it('should have required columns "version" and "totalCredits"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === DegreeRequirement);
    const nameColumn = columns.find(column => column.propertyName === 'name');
    const versionColumn = columns.find(column => column.propertyName === 'version');
    const totalCreditsColumn = columns.find(column => column.propertyName === 'totalCredits');
    expect(versionColumn).toBeDefined();
    expect(totalCreditsColumn).toBeDefined();
  });

  it('should have correct relationships with Students and RequirementCourses', () => {
    const relations = getMetadataArgsStorage().relations.filter(relation => relation.target === DegreeRequirement);
    expect(relations.some(relation => relation.propertyName === 'students' && relation.relationType === 'one-to-many')).toBeTruthy();
    expect(relations.some(relation => relation.propertyName === 'requirementCourses' && relation.relationType === 'one-to-many')).toBeTruthy();
  });

  it('should correctly assign all properties via the constructor', () => {
    const name = 'Computer Science Major'
    const version = '2024';
    const totalCredits = 120;

    const degreeRequirement = new DegreeRequirement(name, version, totalCredits);

    expect(degreeRequirement.name).toBe(name);
    expect(degreeRequirement.version).toBe(version);
    expect(degreeRequirement.totalCredits).toBe(totalCredits);
  });
});
