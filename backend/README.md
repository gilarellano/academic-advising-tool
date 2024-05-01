# Academic Advising Tool

## Author
**Name:** Gilberto Arellano
**Student ID:** 1801074

The Academic Advising Tool is a web-based application designed to facilitate the academic planning process for students, advisors, and faculty. It automates the generation of degree plans, allows for flexible customization, and provides progress tracking to ensure students stay on track with their academic goals.

## Getting Started

### Installation

1. Clone the repository:
   ```sh
   git clone https://your-repository-url-here.git
   ```
2. Navigate to the project directory:
   ```sh
   cd academic-advising-tool
   ```
3. Install project dependencies:
   ```sh
   npm install
   ```

## Running the Tests

The project uses Jest for unit and integration testing, leveraging TypeScript directly. Tests are organized under the `__tests__` directory, with separate subdirectories for unit and integration tests.

### Running All Tests

To run all tests and display a coverage summary, execute the following command:
```sh
npm test
```

This command directly runs the TypeScript tests without the need to compile them to JavaScript first.

### Running Specific Tests

To run a specific test file, use the Jest command followed by the path to the test file:
```sh
npx jest tests/unit/YourTestFile.test.ts
```

## Test Coverage

After running tests, a coverage report is generated in the `coverage/lcov-report` directory. To view the coverage report, open the `index.html` file in your browser:
```sh
open coverage/lcov-report/index.html
```

## Project Structure

- `src/`: Contains the source code with models and services.
  - `models/`: Classes representing the business logic.
  - `services/`: Services for handling operations and interactions between models.
- `__tests__/`: Test suites for the project.
  - `unit/`: Unit tests for individual components.
  - `integration/`: Integration tests to test the interactions between components.
- `coverage/`: Generated directory to provide test coverage report.
- `node_modules/`: Project dependencies.
- `jest.config.js`: Configuration file for Jest, set up to handle TypeScript tests directly.
- `tsconfig.json`: Configuration file for TypeScript.
- `package.json`: Defines scripts and dependencies of the project.

