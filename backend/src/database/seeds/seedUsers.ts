// seedUsers.ts
import { AppDataSource } from '../DataSource';
import { SystemUser } from '../../models/';
import bcrypt from 'bcrypt';

export async function createInitialUsers() {
  const userRepository = AppDataSource.getRepository(SystemUser);
  const users = [
    { name: "Alice", email: "alice@example.com", role: "admin", password: await bcrypt.hash("alice_pass123", 10) },
    { name: "Bob", email: "bob@example.com", role: "student", password: await bcrypt.hash("bob_pass123", 10) },
    { name: "Charlie", email: "charlie@example.com", role: "advisor", password: await bcrypt.hash("charlie_pass123", 10) },
    { name: "David", email: "david@example.com", role: "admin", password: await bcrypt.hash("david_pass123", 10) },
    { name: "Eva", email: "eva@example.com", role: "student", password: await bcrypt.hash("eva_pass123", 10) },
    { name: "Fiona", email: "fiona@example.com", role: "advisor", password: await bcrypt.hash("fiona_pass123", 10) },
    { name: "George", email: "george@example.com", role: "admin", password: await bcrypt.hash("george_pass123", 10) },
    { name: "Hannah", email: "hannah@example.com", role: "student", password: await bcrypt.hash("hannah_pass123", 10) },
    { name: "Ian", email: "ian@example.com", role: "advisor", password: await bcrypt.hash("ian_pass123", 10) },
    { name: "Julia", email: "julia@example.com", role: "student", password: await bcrypt.hash("julia_pass123", 10) }
  ];

  // Check if users already exist to avoid duplicates on multiple runs
  for (const user of users) {
    const foundUser = await userRepository.findOneBy({ email: user.email });
    if (!foundUser) {
      await userRepository.save(user);
      console.log(`User ${user.email} added.`);
    } else {
      console.log(`User ${user.email} already exists.`);
    }
  }
}

export async function runMigrations() {
  try {
    const migrations = await AppDataSource.runMigrations();
    console.log(`${migrations.length} migration(s) executed.`);
  } catch (error) {
    console.error("Error during migrations", error);
    throw error;
  }
}

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    runMigrations().then(() => {
      createInitialUsers().then(() => {
        console.log("Seeding completed!");
        AppDataSource.destroy();
      });
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
