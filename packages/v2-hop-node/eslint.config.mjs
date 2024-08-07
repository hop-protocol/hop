import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

import jestPlugin from 'eslint-plugin-jest'

export default tseslint.config(
  ...baseConfig,
  {
    rules: {
      /**
       * Stylistic
       */
      // These do not enforce strict style rules, but rather prevent obviously incorrect code.
      'no-multi-spaces': 'warn',
      'no-trailing-spaces': 'warn',

      /**
       * Overrides from base
       */
      // General
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      'unusedImports/no-unused-imports': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      'n/no-missing-import': ['error'],
      'n/no-extraneous-import': ['error'],

      // These allow `any`. Reintroduce them over time as code is cleaned up.
      // Periodically run these commands to find and fix issues to keep the codebase clean.
      // '@typescript-eslint/no-explicit-any': 'error',
      // '@typescript-eslint/no-unsafe-assignment': 'error',
      // '@typescript-eslint/no-unsafe-argument': 'error',
      // '@typescript-eslint/no-unsafe-call': 'error',
      // '@typescript-eslint/no-unsafe-member-access': 'error',
      // '@typescript-eslint/no-unsafe-return': 'error',

      /**
       * Strict rules specific to this package
       */

      // Explicit type handling with for strict ESM packages using verbatimModuleSyntax
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',

      // Complexity rules
      'complexity': 'error',
      'max-depth': 'error',
      // Allow up to 2 statements per line for cleaner code
      'max-statements-per-line': ['error', { max: 2 }],
      'max-nested-callbacks': 'error',
      'max-lines': 'error',
      'max-lines-per-function': 'error',
      // Arbitrary limit. Only used as guidance and dev should add explicit ignore comments if
      // method is long but logically necessary.
      'max-statements': ['error', { max: 25 }],

      // Other rules
      // TODO: Reintroduce this at some point
      // '@typescript-eslint/strict-boolean-expressions': 'error',
      'no-lonely-if': 'error',
    }
  },
  // Strict jest rules
  {
    ...jestPlugin.configs['flat/recommended'],
    plugins: {
      jest: jestPlugin
    }
  }
)