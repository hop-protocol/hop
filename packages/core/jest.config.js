module.exports = {
  roots: ['test', 'src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: ['dotenv/config'],
  bail: 1,
  verbose: true
}
