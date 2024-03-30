export default {
  roots: ['test'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './test/tsconfig.json'
      }
    ]
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    "<rootDir>/^#(.*)$": "<rootDir>/dist/$1",
  },
  setupFiles: ['dotenv/config'],
  bail: 1,
  verbose: true
}
