export default {
  // ESM transformation config
  // https://kulshekhar.github.io/ts-jest/docs/guides/esm-support#examples
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },

  // Optional
  verbose: true
}
