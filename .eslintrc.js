module.exports = {
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:json/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2021,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": [
    "n",
    "@typescript-eslint",
    "unused-imports",
    "sort-imports-es6-autofix"
  ],
  "rules": {
    // Explicit offs
    "@typescript-eslint/no-misused-promises": 0,
    "@typescript-eslint/no-unsafe-enum-comparison": 0,
    "@typescript-eslint/require-await": 0,
    "@typescript-eslint/restrict-template-expressions": 0,
    "@typescript-eslint/no-base-to-string": 0,
    "avoidEscape": 0,
    "camelcase": 0,
    "no-async-promise-executor": 0,
    "no-unreachable-loop": 0,
    "no-unused-vars": 0,
    "no-constant-condition": 0,

    // Explicit warns
    "unused-imports/no-unused-imports": 1,
    "sort-imports-es6-autofix/sort-imports-es6": [1, {
      "ignoreCase": false,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "single", "multiple", "all"]
    }],

    // Explicit errors
    "@typescript-eslint/prefer-nullish-coalescing": 2,
    "array-callback-return": 2,
    "block-scoped-var": 2,
    "dot-notation": 2,
    "new-cap": [2, { "properties": false }], // Used by ethers event filters
    "no-empty": [2, { "allowEmptyCatch": true }],
    "no-new": 2,
    "prefer-const": [2, { "destructuring": "all" }],
    "n/no-new-require": 2,
    "n/no-path-concat": 2,
    // Note: for @typescript-eslint/return-await", you must disable the base rule as it can report incorrect errors
    "no-return-await": 0,
    "@typescript-eslint/return-await": 2,

    // Custom - These allow `any`. Remove over time as codebase is cleaned up
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unsafe-assignment": 0,
    "@typescript-eslint/no-unsafe-argument": 0,
    "@typescript-eslint/no-unsafe-call": 0,
    "@typescript-eslint/no-unsafe-member-access": 0,
    "@typescript-eslint/no-unsafe-return": 0,
    "@typescript-eslint/no-redundant-type-constituents": 0,

    // Custom - Set to 1 or 2 over time as codebase is cleaned up. Possibly add options
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-floating-promises": 0,
    "no-else-return": 0, // Could be a 1 but --fix does not correctly indent
    // https://github.com/eslint/eslint/issues/3400
    "no-lonely-if": 0, // Could be a 1 but erroneously fixes nested items. Nesting is user error but still not worth the hassle
    "@typescript-eslint/no-unnecessary-condition": 0 // Nice to have but need to clean up first
  },
  "ignorePatterns": [
    "node_modules",
    "build",
    "dist",
    "*.json",
    "*.md"
  ],
  "root": true
}
