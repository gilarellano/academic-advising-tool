// RequirementCourses.test.ts
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { RequirementCourses, Course, DegreeRequirement } from '../../../src/models';

describe('RequirementCourses Entity', () => {
  it('should have an Entity decorator', () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    expect(entities).toContain(RequirementCourses);
  });

  it('should have a primary generated column "requirementCoursesID"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === RequirementCourses);
    const requirementCoursesIDColumn = columns.find(column => column.propertyName === 'requirementCoursesID');
    expect(requirementCoursesIDColumn).toBeDefined();
    if (requirementCoursesIDColumn) {
      expect(requirementCoursesIDColumn.mode).toBe('regular');
      expect(requirementCoursesIDColumn.options.primary).toBeTruthy();
    }
  });

  it('should have a required column "isElective"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === RequirementCourses);
    const isElectiveColumn = columns.find(column => column.propertyName === 'isElective');
    expect(isElectiveColumn).toBeDefined();
  });

  it('should have correct relationships with DegreeRequirement and Course', () => {
    const relations = getMetadataArgsStorage().relations.filter(relation => relation.target === RequirementCourses);
    const degreeRequirementRelation = relations.find(relation => relation.propertyName === 'degreeRequirement');
    const courseRelation = relations.find(relation => relation.propertyName === 'course');
    expect(degreeRequirementRelation).toBeDefined();
    if (degreeRequirementRelation) {
      expect(degreeRequirementRelation.relationType).toBe('many-to-one');
      //expect(degreeRequirementRelation.joinColumns[0].name).toBe('requirementID'); // Verify the join column is correctly set
    }
    expect(courseRelation).toBeDefined();
    if (courseRelation) {
      expect(courseRelation.relationType).toBe('many-to-one');
      //expect(courseRelation.joinColumns[0].name).toBe('courseID'); // Verify the join column is correctly set
    }
  });

  it('should correctly assign all properties via the constructor', () => {
    const degreeRequirement = new DegreeRequirement('Computer Science Major', '2024', 120);
    const course = new Course('Calculus', 3, 'Mathematics', 'Core');
    const isElective = true;
    const requirementCourses = new RequirementCourses(degreeRequirement, course, isElective);

    expect(requirementCourses.degreeRequirement).toBe(degreeRequirement);
    expect(requirementCourses.course).toBe(course);
    expect(requirementCourses.isElective).toBe(isElective);
  });
});
