// PlanCourses.test.ts
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { PlanCourses, AcademicPlan, Course, Student, DegreeRequirement, Advisor } from '../../../src/models';

describe('PlanCourses Entity', () => {
  it('should have an Entity decorator', () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    expect(entities).toContain(PlanCourses);
  });

  it('should have a primary generated column "planCoursesID"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === PlanCourses);
    const planCoursesIDColumn = columns.find(column => column.propertyName === 'planCoursesID');
    expect(planCoursesIDColumn).toBeDefined();
    if (planCoursesIDColumn) {
      expect(planCoursesIDColumn.mode).toBe('regular');
      expect(planCoursesIDColumn.options.primary).toBeTruthy();
    }
  });

  it('should have correct relationships with AcademicPlan and Course', () => {
    const relations = getMetadataArgsStorage().relations.filter(relation => relation.target === PlanCourses);
    const academicPlanRelation = relations.find(relation => relation.propertyName === 'academicPlan');
    const courseRelation = relations.find(relation => relation.propertyName === 'course');
    expect(academicPlanRelation).toBeDefined();
    if (academicPlanRelation) {
      expect(academicPlanRelation.relationType).toBe('many-to-one');
      //expect(academicPlanRelation.joinColumns[0].name).toBe('academicPlanID'); // Verify the join column is correctly set
    }
    expect(courseRelation).toBeDefined();
    if (courseRelation) {
      expect(courseRelation.relationType).toBe('many-to-one');
      //expect(courseRelation.joinColumns[0].name).toBe('courseID'); // Verify the join column is correctly set
    }
  });

  it('should correctly assign all properties via the constructor', () => {
    const degreeRequirement = new DegreeRequirement('Computer Science Major', '2024', 10);
    const course = new Course('Calculus', 3, 'Mathematics', 'Core');
    const advisor = new Advisor('Jane Doe', 'jane@example.com', 'pass', 'Fowler');
    const student = new Student('John Doe', 'john@example.com', 'pass', 0, advisor, degreeRequirement);
    const academicPlan = new AcademicPlan(student, degreeRequirement, 10, false);
    const planCourses = new PlanCourses(academicPlan, course);

    expect(planCourses.academicPlan).toBe(academicPlan);
    expect(planCourses.course).toBe(course);
  });
});
