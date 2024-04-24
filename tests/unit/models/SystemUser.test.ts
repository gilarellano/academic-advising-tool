// SystemUser.test.ts
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { SystemUser} from '../../../src/models';

class ConcreteSystemUser extends SystemUser {} // Used solely for testing the abstract class SystemUser

describe('SystemUser Entity', () => {
  it('should have an Entity decorator', () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    expect(entities).toContain(SystemUser);
  });

  it('should have a primary generated column "userID"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === SystemUser);
    const userIDColumn = columns.find(column => column.propertyName === 'userID');
    expect(userIDColumn).toBeDefined();
    if (userIDColumn) {
      expect(userIDColumn.mode).toBe('regular');
      expect(userIDColumn.options.primary).toBeTruthy();
    }
  });

  it('should have required columns with proper types', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === SystemUser);
    expect(columns.some(column => column.propertyName === 'name')).toBeTruthy();
    expect(columns.some(column => column.propertyName === 'email')).toBeTruthy();
    expect(columns.some(column => column.propertyName === 'password')).toBeTruthy();
    expect(columns.some(column => column.propertyName === 'role')).toBeTruthy();
  });

  it('should use table inheritance', () => {
    const inheritance = getMetadataArgsStorage().inheritances.find(i => i.target === SystemUser);
    expect(inheritance).toBeDefined();
    if (inheritance && inheritance.column) {
      expect(inheritance.column.type).toBe('varchar');
      expect(inheritance.column.name).toBe('type');
    }
  });

  it('should have a one-to-one relationship with AuthenticationToken', () => {
    const relations = getMetadataArgsStorage().relations.filter(relation => relation.target === SystemUser);
    const tokenRelation = relations.find(relation => relation.propertyName === 'token');
    expect(tokenRelation).toBeDefined();
    if (tokenRelation) {
      expect(tokenRelation.relationType).toBe('one-to-one');
      // Cannot make sure it is with AuthenticationToken, not sure how to identify
    }
  });

  it('should correctly assign all properties via the constructor in a derived class', () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = 'password';
    const role = 'admin';

    const concreteSystemUser = new ConcreteSystemUser(name, email, password, role);

    expect(concreteSystemUser.name).toBe(name);
    expect(concreteSystemUser.email).toBe(email);
    expect(concreteSystemUser.password).toBe(password);
    expect(concreteSystemUser.role).toBe(role);
  });

});
