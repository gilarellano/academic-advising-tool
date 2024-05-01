// security.test.ts
import bcrypt from 'bcrypt';
import { sanitizeInput, hashPassword, comparePassword } from '../../../src/utils/security';

jest.mock('bcrypt', () => ({
    genSalt: jest.fn().mockResolvedValue('test_salt'),
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn()
}));

describe('sanitizeInput', () => {
  it('should trim whitespace from input', () => {
    expect(sanitizeInput('  text  ')).toEqual('text');
  });

  it('should escape ampersands', () => {
    expect(sanitizeInput('Ben & Jerry')).toEqual('Ben &amp; Jerry');
  });

  it('should escape less than and greater than signs', () => {
    expect(sanitizeInput('<script>')).toEqual('&lt;script&gt;');
  });

  it('should escape double and single quotes', () => {
    expect(sanitizeInput('He said "Hello"')).toEqual('He said &quot;Hello&quot;');
    expect(sanitizeInput("It's")).toEqual('It&#39;s');
  });

  it('should return unchanged string when no escapable characters are present', () => {
    const input = 'Hello World!';
    expect(sanitizeInput(input)).toEqual('Hello World!');
  });

  it('should return unchanged non-escapable special characters', () => {
    const input = 'Enjoy your meal #Yummy';
    expect(sanitizeInput(input)).toEqual('Enjoy your meal #Yummy');
  });

});

describe('hashPassword', () => {
  it('should use bcrypt to hash a password', async () => {
    const password = 'securePassword123!';
    const hashed = await hashPassword(password);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 'test_salt');
    expect(hashed).toEqual('hashed_password');
  });
});

describe('comparePassword', () => {
    it('should return true when passwords match', async () => {
        // Mock bcrypt.compare to resolve true
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await comparePassword('password', 'hashed_password');
        expect(result).toBe(true);
    });

    it('should return false when passwords do not match', async () => {
        // Mock bcrypt.compare to resolve false
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const result = await comparePassword('password', 'different_hashed_password');
        expect(result).toBe(false);
    });

});