// Course.test.ts
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { Course } from '../../../src/models';

describe('Course Entity', () => {
  it('should have an Entity decorator', () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    expect(entities).toContain(Course);
  });

  it('should have a primary generated column "courseID"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === Course);
    const courseIDColumn = columns.find(column => column.propertyName === 'courseID');
    expect(courseIDColumn).toBeDefined();
    if (courseIDColumn) {
      expect(courseIDColumn.mode).toBe('regular');
      expect(courseIDColumn.options.primary).toBeTruthy();
    }
  });

  it('should have required columns "name", "credits", "department", and "category"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === Course);
    const nameColumn = columns.find(column => column.propertyName === 'name');
    const creditsColumn = columns.find(column => column.propertyName === 'credits');
    const departmentColumn = columns.find(column => column.propertyName === 'department');
    const categoryColumn = columns.find(column => column.propertyName === 'category');
    expect(nameColumn).toBeDefined();
    expect(creditsColumn).toBeDefined();
    expect(departmentColumn).toBeDefined();
    expect(categoryColumn).toBeDefined();
  });

  it('should have correct relationships with PlanCourses and RequirementCourses', () => {
    const relations = getMetadataArgsStorage().relations.filter(relation => relation.target === Course);
    expect(relations.some(relation => relation.propertyName === 'planCourses' && relation.relationType === 'one-to-many')).toBeTruthy();
    expect(relations.some(relation => relation.propertyName === 'requirementCourses' && relation.relationType === 'one-to-many')).toBeTruthy();
  });

  it('should correctly assign all properties via the constructor', () => {
    const name = 'Advanced Mathematics';
    const credits = 4;
    const department = 'Math';
    const category = 'Core';

    const course = new Course(name, credits, department, category);

    expect(course.name).toBe(name);
    expect(course.credits).toBe(credits);
    expect(course.department).toBe(department);
    expect(course.category).toBe(category);
  });
});
