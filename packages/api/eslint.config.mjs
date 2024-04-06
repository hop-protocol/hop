import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...baseConfig,
  {
    // Ignore TS rules in JS files
    files: ['src/**/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off'
    }
  }
)