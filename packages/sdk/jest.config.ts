export default {
  roots: ['test'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest']
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: [],
  bail: 1,
  verbose: true
}
