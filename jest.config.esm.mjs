import { createDefaultEsmPreset } from 'ts-jest'
import baseConfig from './jest.config.base.mjs'

const presetConfig = createDefaultEsmPreset({
  tsconfig: './tsconfig.jest.json'
})

export default {
  ...baseConfig,
  ...presetConfig
}
