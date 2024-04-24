// Student.test.ts
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { Student, Advisor, DegreeRequirement } from '../../../src/models';

describe('Student Entity', () => {
  it('should have an Entity decorator', () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    expect(entities).toContain(Student);
  });

  it('should have a primary generated column "studentID"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === Student);
    const studentIDColumn = columns.find(column => column.propertyName === 'studentID');
    expect(studentIDColumn).toBeDefined();
    if (studentIDColumn) {
      expect(studentIDColumn.mode).toBe('regular');
      expect(studentIDColumn.options.primary).toBeTruthy();
    }
  });

  it('should have a required column "currentCredits" with the default value 0', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === Student);
    const currentCreditsColumn = columns.find(column => column.propertyName === 'currentCredits');
    expect(currentCreditsColumn).toBeDefined();
    if (currentCreditsColumn) {
      expect(currentCreditsColumn.options.default).toBe(0);
    }
  });

  it('should have correct relationships', () => {
    const relations = getMetadataArgsStorage().relations.filter(relation => relation.target === Student);
    expect(relations.some(relation => relation.propertyName === 'advisor' && relation.relationType === 'many-to-one')).toBeTruthy();
    expect(relations.some(relation => relation.propertyName === 'degreeRequirement' && relation.relationType === 'many-to-one')).toBeTruthy();
    expect(relations.some(relation => relation.propertyName === 'academicPlans' && relation.relationType === 'one-to-many')).toBeTruthy();
  });

  it('should correctly assign all properties via the constructor', () => {
    const name = 'Jane Doe';
    const email = 'jane.doe@example.com';
    const password = 'password';
    const currentCredits = 15;
    const advisor = new Advisor('John Dee', 'john@example.com', password, 'Fowler');
    const degreeRequirement = new DegreeRequirement('Computer Science Major', '2024', 10);

    const student = new Student(name, email, password, currentCredits, advisor, degreeRequirement);

    expect(student.name).toBe(name);
    expect(student.email).toBe(email);
    expect(student.password).toBe(password);
    expect(student.currentCredits).toBe(currentCredits);
    expect(student.advisor).toBe(advisor);
    expect(student.degreeRequirement).toBe(degreeRequirement);
    expect(student.role).toBe('Student');
  });
});
