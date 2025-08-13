import { createDefaultEsmPreset } from 'ts-jest'
import baseConfig from './jest.config.base.mjs'

const presetConfig = createDefaultEsmPreset({
  tsconfig: './tsconfig.jest.json'
})

export default {
  ...baseConfig,
  ...presetConfig,

  // Allows for relative imports of *.js files
  // https://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1441733977
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}
