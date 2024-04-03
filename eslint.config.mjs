import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

import nodePlugin from 'eslint-plugin-n'
import sortImports from 'eslint-plugin-sort-imports-es6-autofix'
import unusedImports from 'eslint-plugin-unused-imports'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  nodePlugin.configs["flat/recommended-script"],
  {
    languageOptions: {
      parserOptions: {
        // Explicitly require all modules being linted to have tsconfig.eslint.json
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      unusedImports,
      sortImports,
    },
    rules: {
      // Explicit offs
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      'avoidEscape': 'off',
      'camelcase': 'off',
      'no-async-promise-executor': 'off',
      'no-unreachable-loop': 'off',
      'no-unused-vars': 'off',
      'no-constant-condition': 'off',

      // Explicit warns
      'unusedImports/no-unused-imports': 'warn',
      'sortImports/sort-imports-es6': [1, {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'single', 'multiple', 'all']
      }],

      // Explicit errors
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'dot-notation': 'error',
      'new-cap': [2, { 'properties': false }], // Used by ethers event filters
      'no-empty': [2, { 'allowEmptyCatch': true }],
      'no-new': 'error',
      'prefer-const': [2, { 'destructuring': 'all' }],
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      // Note: for @typescript-eslint/return-await', you must disable the base rule as it can report incorrect errors
      'no-return-await': 'off',
      '@typescript-eslint/return-await': 'error',

      // Custom - These allow `any`. Remove over time as codebase is cleaned up
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',

      // Custom - Set to 1 or 2 over time as codebase is cleaned up. Possibly add options
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      // Could be a 1 but --fix does not correctly indent
      'no-else-return': 'off',
      // Could be a 1 but erroneously fixes nested items. Nesting is user error but still not worth the hassle
      // https://github.com/eslint/eslint/issues/3400
      'no-lonely-if': 'off',
      // Nice to have but need to clean up first
      '@typescript-eslint/no-unnecessary-condition': 0,
      // Remove when ethers v6 is used and we do not import entire ethers paths
      // Remove when asn1.js is updated to modern package
      'n/no-missing-import': [2, { 'allowModules': [ 'ethers', 'asn1.js' ] }],
      // Remove when ethers v6 is used and we do not import entire ethers paths
      // Remove when plugin supports workspaces
      // https://github.com/eslint-community/eslint-plugin-n/issues/209
      'n/no-extraneous-import': [2, {
        'allowModules': [
          '@ethersproject/abstract',
          '@ethersproject/abstract-provider',
          '@ethersproject/bignumber',
          '@ethersproject/contracts',
          '@ethersproject/networks',
          '@ethersproject/properties',
          '@ethersproject/web',
          'typescript-eslint'
        ]
      }],
      // Remove when we have more graceful shutdown logic
      'n/no-process-exit': 0,
    },
    ignores: [
      'node_modules',
      'build',
      'dist'
    ]
  }
)
