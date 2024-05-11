import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...baseConfig,
  {
    rules: {
      // Overrides from base
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      'unusedImports/no-unused-imports': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      // Explicit type handling with for strict ESM packages using verbatimModuleSyntax
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',

      // Complexity rules
      'max-depth': 'error',
      'max-statements-per-line': 'error',
      'max-nested-callbacks': 'error',

      // Other rules
      'no-lonely-if': 'error'
    }
  }
)
