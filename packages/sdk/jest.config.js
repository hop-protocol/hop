module.exports = {
  roots: ['test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: [],
  bail: 1,
  verbose: true
}
