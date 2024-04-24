// tests/utils/config.test.ts
import { parsePort } from '../../../src/utils/config';

describe('parsePort', () => {
    test('returns default port when input is undefined', () => {
        expect(parsePort(undefined)).toBe(5432);
    });

    test('returns parsed port when input is a valid string number', () => {
        expect(parsePort("7000")).toBe(7000);
    });

    test('returns default port when input is an invalid number', () => {
        expect(parsePort("invalid")).toBe(5432);
    });

    test('returns default port when input is an empty string', () => {
        expect(parsePort("")).toBe(5432);
    });
});
