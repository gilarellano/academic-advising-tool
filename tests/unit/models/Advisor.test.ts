// Advisor.test.ts
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { Advisor } from '../../../src/models';

describe('Advisor Entity', () => {
  it('should have an Entity decorator', () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    expect(entities).toContain(Advisor);
  });

  it('should have a primary generated column "advisorID"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === Advisor);
    const advisorIDColumn = columns.find(column => column.propertyName === 'advisorID');
    expect(advisorIDColumn).toBeDefined();
    if (advisorIDColumn) {
      expect(advisorIDColumn.mode).toBe('regular');
      expect(advisorIDColumn.options.primary).toBeTruthy();
    }
  });

  it('should have required columns "department"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === Advisor);
    expect(columns.some(column => column.propertyName === 'department')).toBeTruthy();
  });

  it('should have correct relationships with Students', () => {
    const relations = getMetadataArgsStorage().relations.filter(relation => relation.target === Advisor);
    const studentRelation = relations.find(relation => relation.propertyName === 'listOfStudents');
    expect(studentRelation).toBeDefined();
    if (studentRelation) {
      expect(studentRelation.relationType).toBe('one-to-many');
      // expect(studentRelation.inverseSideProperty).toBe(Student); Not sure how to check Object type
    }
  });

  it('should correctly assign all properties via the constructor', () => {
    const name = 'John Smith';
    const email = 'john.smith@example.com';
    const password = 'password';
    const department = 'Mathematics';

    const advisor = new Advisor(name, email, password, department);

    expect(advisor.name).toBe(name);
    expect(advisor.email).toBe(email);
    expect(advisor.password).toBe(password);
    expect(advisor.department).toBe(department);
    expect(advisor.role).toBe('Advisor');
  });
});
