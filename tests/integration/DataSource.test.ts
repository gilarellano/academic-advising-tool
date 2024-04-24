// DataSource.test.ts
import { AppDataSource } from '../../src/database/DataSource';

describe('Database Connection', () => {
  beforeAll(async () => {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized for testing!");
    } catch (err) {
      console.error("Initialization failed during testing", err);
      throw err;  // Ensure test fails if initialization does not succeed
    }
  });

  afterAll(async () => {
    try {
      await AppDataSource.destroy();
      console.log("Data Source has been closed after testing!");
    } catch (err) {
      console.error("Error during Data Source destruction", err);
    }
  });

  test('should connect and disconnect without error', () => {
    expect(AppDataSource.isInitialized).toBeTruthy();
  });
});

describe('DataSource Configuration', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };  // Restore environment after each test
  });

  test('should use development config if NODE_ENV is not set', async () => {
    delete process.env.NODE_ENV;
    jest.resetModules();  // Reset modules to ensure env vars are re-evaluated
    const { AppDataSource } = require('../../src/database/DataSource');
    expect(AppDataSource.options.database).toBe(process.env.DB_DATABASE);  // Adjust assertion based on actual env setup
  });
});
