/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/client/', '<rootDir>/server/build/'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 80,
      lines: 90,
    },
  },
  coverageDirectory: '<rootDir>/server/coverage',
  coverageReporters: ['text', 'html', 'cobertura'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!client/**/*',
    '!server/build/**/*',
    '!server/coverage/**/*',
    '!jest.config.js',
  ],
  restoreMocks: true,
};

module.exports = config;
