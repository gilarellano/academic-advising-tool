// AuthenticationToken.test.ts
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { SystemUser, AuthenticationToken } from '../../../src/models';

class ConcreteSystemUser extends SystemUser {} // Used solely for testing the abstract class SystemUser

describe('AuthenticationToken Entity', () => {
  it('should have an Entity decorator', () => {
    const entities = getMetadataArgsStorage().tables.map(table => table.target);
    expect(entities).toContain(AuthenticationToken);
  });

  it('should have a primary generated column "tokenID"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === AuthenticationToken);
    const tokenIDColumn = columns.find(column => column.propertyName === 'tokenID');
    expect(tokenIDColumn).toBeDefined();
    if (tokenIDColumn) {
      expect(tokenIDColumn.mode).toBe('regular');
      expect(tokenIDColumn.options.primary).toBeTruthy();
    }
  });

  it('should have required columns "token" and "expiryDate"', () => {
    const columns = getMetadataArgsStorage().columns.filter(column => column.target === AuthenticationToken);
    const tokenColumn = columns.find(column => column.propertyName === 'token');
    const expiryDateColumn = columns.find(column => column.propertyName === 'expiryDate');
    expect(tokenColumn).toBeDefined();
    expect(expiryDateColumn).toBeDefined();
  });

  it('should have a correct one-to-one relationship with SystemUser', () => {
    const relations = getMetadataArgsStorage().relations.filter(relation => relation.target === AuthenticationToken);
    const userRelation = relations.find(relation => relation.propertyName === 'user');
    expect(userRelation).toBeDefined();
    if (userRelation) {
      expect(userRelation.relationType).toBe('one-to-one');
      //expect(userRelation.joinColumns[0].name).toBe('userID'); // Dont know how to check object types yet
    }
  });

  it('should correctly assign all properties via the constructor', () => {
    const systemUser = new ConcreteSystemUser('John Doe', 'john.doe@example.com', 'password', 'admin');
    const tokenString = 'xyz123';
    const expiryDate = new Date(); // Current time for simplicity in test

    const authToken = new AuthenticationToken(systemUser, tokenString, expiryDate);

    expect(authToken.user).toBe(systemUser);
    expect(authToken.token).toBe(tokenString);
    expect(authToken.expiryDate).toBe(expiryDate);
  });

  it('should handle default expiryDate when not provided', () => {
    const systemUser = new ConcreteSystemUser('Jane Smith', 'jane.smith@example.com', 'password', 'user');
    const tokenString = 'abc123';
    const authToken = new AuthenticationToken(systemUser, tokenString);

    const expectedExpiryTime = new Date(new Date().getTime() + 3600000); // 1 hour from now
    expect(authToken.expiryDate.getTime()).toBeCloseTo(expectedExpiryTime.getTime(), -2); // Allow some milliseconds difference
  });
});
