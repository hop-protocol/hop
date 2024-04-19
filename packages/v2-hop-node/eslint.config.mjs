// import baseConfig from '../../eslint.config.mjs'
// import tseslint from 'typescript-eslint'

// import jestPlugin from 'eslint-plugin-jest'

// export default tseslint.config(
//   ...baseConfig,
//   {
//     rules: {
//       /**
//        * Overrides from base
//        */
//       // General
//       '@typescript-eslint/no-misused-promises': 'error',
//       '@typescript-eslint/restrict-template-expressions': 'error',
//       '@typescript-eslint/no-base-to-string': 'error',
//       'unusedImports/no-unused-imports': 'error',
//       '@typescript-eslint/no-redundant-type-constituents': 'error',
//       '@typescript-eslint/prefer-nullish-coalescing': 'error',
//       '@typescript-eslint/no-floating-promises': 'error',
//       '@typescript-eslint/no-unnecessary-condition': 'error',
//       'n/no-missing-import': ['error'],
//       'n/no-extraneous-import': ['error'],
//       'n/no-process-exit': 'error',

//       // These allow `any`
//       '@typescript-eslint/no-explicit-any': 'error',
//       '@typescript-eslint/no-unsafe-assignment': 'error',
//       '@typescript-eslint/no-unsafe-argument': 'error',
//       '@typescript-eslint/no-unsafe-call': 'error',
//       '@typescript-eslint/no-unsafe-member-access': 'error',
//       '@typescript-eslint/no-unsafe-return': 'error',

//       /**
//        * Strict rules specific to this package
//        */

//       // Explicit type handling with for strict ESM packages using verbatimModuleSyntax
//       '@typescript-eslint/no-import-type-side-effects': 'error',
//       '@typescript-eslint/consistent-type-imports': 'error',
//       '@typescript-eslint/consistent-type-exports': 'error',

//       // Complexity rules
//       'complexity': 'error',
//       'max-depth': 'error',
//       'max-statements-per-line': 'error',
//       'max-nested-callbacks': 'error',
//       'max-lines': 'error',
//       'max-lines-per-function': 'error',
//       'max-statements': 'error',

//       // Other rules
//       '@typescript-eslint/strict-boolean-expressions': 'error',
//       'no-lonely-if': 'error',
//     }
//   },
//   // Strict jest rules
//   {
//     ...jestPlugin.configs['flat/recommended'],
//     plugins: {
//       jest: jestPlugin
//     }
//   }
// )