// src/models/__tests__/SystemUser.test.ts

import { SystemUser } from '../../src/models/SystemUser';

describe('SystemUser', () => {
  it('should construct a SystemUser object properly', () => {
    const userID = 1;
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const role = 'Student';

    const user = new SystemUser(userID, name, email, role);

    expect(user).toBeInstanceOf(SystemUser);
    expect(user.userID).toBe(userID);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.role).toBe(role);
  });
});
