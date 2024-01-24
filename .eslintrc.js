module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true,
    browser: true
  },
  plugins: [
    'n',
    '@typescript-eslint',
    'unused-imports',
    'sort-imports-es6-autofix'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: [
      './tsconfig.json',
      './packages/*/tsconfig.json'
    ],
    tsconfigRootDir: __dirname
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
    'unused-imports/no-unused-imports': 'warn',
    'sort-imports-es6-autofix/sort-imports-es6': [1, {
      ignoreCase: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'single', 'multiple', 'all']
    }],

    // Explicit errors
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
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
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'no-else-return': 'off', // Could be a 1 but --fix does not correctly indent
    // https://github.com/eslint/eslint/issues/3400
    'no-lonely-if': 'off', // Could be a 1 but erroneously fixes nested items. Nesting is user error but still not worth the hassle
    '@typescript-eslint/no-unnecessary-condition': 0 // Nice to have but need to clean up first
  },
  ignorePatterns: [
    'node_modules',
    'build',
    'dist'
  ]
}
