# Backend for Academic Advising Tool

## Author
**Name:** Gilberto Arellano
**Student ID:** 1801074

**Note: This application is currently under development.** 

## Description

This backend serves as the server-side component for the Academic Advising Tool, handling database operations, API services, and user management. It's built with TypeScript, uses TypeORM for ORM, and is tested with Jest.

## System Requirements

- Node.js
- PostgreSQL
- A modern web browser
- SonarQube (for code quality analysis)

## Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd [repository-directory]/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your PostgreSQL database and remember your credentials.**

4. **Configure your environment variables:**
   Create a `.env` file in the root of the `backend` directory and populate it with your database credentials and environment configuration as shown below:
   ```
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=your_database_port
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password
   DB_DATABASE=your_database_name
   ```

## Running the Application

To run the server in development mode, use:
```bash
npm run start:dev
```

## Testing

To run all tests:
```bash
npm run test
```

To run tests silently:
```bash
npm run test:silent
```

To seed the database with users
```bash
npm run seed
```

To test only the database connections:
```bash
npm run test:datasource
```

## SonarQube Analysis

To set up and run a SonarQube report, ensure you have SonarQube server running. Configure `sonar-project.js` with your project specifics. A typical configuration might look like this:
```javascript
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
  serverUrl: 'http://localhost:9000',
  options : {
    'sonar.sources': 'src',
    'sonar.tests': 'tests',
    'sonar.inclusions': '**', // Path to your source code
    'sonar.test.inclusions': 'tests/**/*.ts,tests/**/*.tsx',
    'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.testExecutionReportPaths': 'coverage/test-report.xml',
    'sonar.login': 'admin',
    'sonar.password': 'admin'
  }
}, () => {});
```

Run SonarQube analysis with:
```bash
npm run sonar
```
