import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  // ESM transformation config
  // https://kulshekhar.github.io/ts-jest/docs/guides/esm-support#examples
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './test/tsconfig.json'
      }
    ]
  },
  extensionsToTreatAsEsm: ['.ts'],

  // Optional
  verbose: true
}

export default jestConfig
