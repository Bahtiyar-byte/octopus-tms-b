module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/tests/puppeteer/**/*.test.js'],
  testTimeout: 30000,
  testEnvironment: './tests/puppeteer-environment.js',
  setupFilesAfterEnv: ['./tests/jest.setup.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
};