import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...baseConfig,
  {
    rules: {
      /**
       * Overrides from base
       */
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
