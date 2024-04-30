const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
  serverUrl: 'http://localhost:9000', // Change this to your SonarCloud or SonarQube server URL
  //token: "<your_access_token>", // Only necessary for SonarCloud or secured SonarQube instances
  options: {
    'sonar.projectKey': 'academic-advising-tool',
    'sonar.sources': 'src',
    'sonar.exclusions': '**/*.test.ts,**/*.spec.ts',
    'sonar.tests': 'tests',
    'sonar.test.inclusions': 'tests/**/*.ts',
    'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    //'sonar.testExecutionReportPaths': 'coverage/transformed-test-report.xml',
    'sonar.language': 'ts',
    'sonar.qualitygate.wait': 'true',
    'sonar.login': 'admin',
    'sonar.password': 'admin'
  }
}, () => {});

