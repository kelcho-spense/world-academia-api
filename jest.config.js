/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts', 'jest-extended/all'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};