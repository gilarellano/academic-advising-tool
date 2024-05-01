// AcademicPlan.test.ts
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { AcademicPlan, Student, DegreeRequirement } from '../../../src/models';

describe('AcademicPlan Entity', () => {
  it('should have an Entity decorator', () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    expect(entities).toContain(AcademicPlan);
  });

  it('should have a primary generated column "academicPlanID"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === AcademicPlan);
    const academicPlanIDColumn = columns.find(column => column.propertyName === 'academicPlanID');
    expect(academicPlanIDColumn).toBeDefined();
    if (academicPlanIDColumn) {
      expect(academicPlanIDColumn.mode).toBe('regular');
      expect(academicPlanIDColumn.options.primary).toBeTruthy();
    }
  });

  it('should have required columns "totalCredits" with default value and "isApproved"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === AcademicPlan);
    const totalCreditsColumn = columns.find(column => column.propertyName === 'totalCredits');
    const isApprovedColumn = columns.find(column => column.propertyName === 'isApproved');
    expect(totalCreditsColumn).toBeDefined();
    expect(isApprovedColumn).toBeDefined();
    if (totalCreditsColumn && isApprovedColumn) {
      expect(totalCreditsColumn.options.default).toBe(0);
      expect(isApprovedColumn.options.default).toBe(false);
    }
  });

  it('should have correct relationships with Student, DegreeRequirement, and PlanCourses', () => {
    const relations = getMetadataArgsStorage().relations.filter(relation => relation.target === AcademicPlan);
    expect(relations.some(relation => relation.propertyName === 'student' && relation.relationType === 'many-to-one')).toBeTruthy();
    expect(relations.some(relation => relation.propertyName === 'degreeRequirement' && relation.relationType === 'many-to-one')).toBeTruthy();
    expect(relations.some(relation => relation.propertyName === 'planCourses' && relation.relationType === 'one-to-many')).toBeTruthy();
  });

  it('should correctly assign all properties via the constructor', () => {
    const student = new Student('John Doe', 'john.doe@example.com', 'password');
    const degreeRequirement = new DegreeRequirement('Computer Science Major', '2021', 120);
    const academicPlan = new AcademicPlan(student, degreeRequirement, 0, false);

    expect(academicPlan.totalCredits).toBe(0);
    expect(academicPlan.isApproved).toBe(false);
    expect(academicPlan.student).toBe(student);
    expect(academicPlan.degreeRequirement).toBe(degreeRequirement);
  });
});
