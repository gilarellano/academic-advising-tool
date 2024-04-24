// DataSource.ts
import { DataSource } from 'typeorm';
import * as entities from '../models';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { parsePort } from '../utils/config';

// Dynamically determine which .env file to use based on NODE_ENV
const basePath = path.join(__dirname, '../../'); // Adjust this path as necessary to point to your project root
const envPath = `${basePath}.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envPath });

// For Debugging
//console.log(`Environment: ${process.env.NODE_ENV}`);
//console.log(`Database: ${process.env.DB_DATABASE}`);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parsePort(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: Object.values(entities),
    migrations: ['src/migration/**/*.ts']
});