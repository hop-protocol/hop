import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  extends: [
    ...baseConfig,
  ],
  ignores: [
    'dist'
  ],
  rules: {
    // Explicit type handling with for strict ESM packages using verbatimModuleSyntax
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-exports': 'error'
  }
})