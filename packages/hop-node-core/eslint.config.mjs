import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

// import jestPlugin from 'eslint-plugin-jest'

/**
 * These rules add more explicit strict rules to this package.
 * 
 * @typescript-eslint/require-await Should be added in theory but it cannot handle the case
 * where an abstract class defines an async abstract method. A concrete class might not need
 * to be async, however this rule requires it to be. When that is better understood,
 * reintroduce this rule.
 */

export default tseslint.config(
  ...baseConfig,
  {
    rules: {
      /**
       * Overrides from base
       */
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      'unusedImports/no-unused-imports': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      /**
       *  Clean up and enable
       */

      // These allow `any`
      // '@typescript-eslint/no-explicit-any': 'error',
      // '@typescript-eslint/no-unsafe-assignment': 'error',
      // '@typescript-eslint/no-unsafe-argument': 'error',
      // '@typescript-eslint/no-unsafe-call': 'error',
      // '@typescript-eslint/no-unsafe-member-access': 'error',
      // '@typescript-eslint/no-unsafe-return': 'error',

      // Other
      // '@typescript-eslint/no-floating-promises': 'error',
      // '@typescript-eslint/no-unnecessary-condition': 'error',
      // Remove when ethers v6 is used and we do not import entire ethers paths
      // Remove when asn1.js is updated to modern package
      // 'n/no-missing-import': ['error', { 'allowModules': [ 'ethers', 'asn1.js' ] }],
      // Remove when ethers v6 is used and we do not import entire ethers paths
      // Remove when plugin supports workspaces
      // https://github.com/eslint-community/eslint-plugin-n/issues/209
      // 'n/no-extraneous-import': ['error', {
      //   'allowModules': [
      //     '@ethersproject/abstract',
      //     '@ethersproject/abstract-provider',
      //     '@ethersproject/bignumber',
      //     '@ethersproject/contracts',
      //     '@ethersproject/networks',
      //     '@ethersproject/properties',
      //     '@ethersproject/web',
      //     'typescript-eslint'
      //   ]
      // }],
      // Remove when we have more graceful shutdown logic
      // 'n/no-process-exit': 'error',

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
      'max-statements-per-line': 'error',
      'max-nested-callbacks': 'error',
      'max-lines-per-function': 'error',
      'max-statements': 'error',


      // Other rules
      // '@typescript-eslint/strict-boolean-expressions': 'error',
      'no-lonely-if': 'error',
    }
  },
  // Strict jest rules
  {
    // ...jestPlugin.configs['flat/recommended'],
    // plugins: {
    //   jest: jestPlugin
    // }
  }
)