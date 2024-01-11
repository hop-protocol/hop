module.exports = {
  "env": {
    "node": true,
    "browser": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:json/recommended",
    "standard"
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
    "@typescript-eslint",
    "node",
    "import",
    "unused-imports",
    "sort-imports-es6-autofix"
  ],
  "rules": {
    // Explicit offs
    "@typescript-eslint/consistent-type-definitions": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/method-signature-style": 0,
    "@typescript-eslint/no-dynamic-delete": 0,
    "@typescript-eslint/no-misused-promises": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unsafe-enum-comparison": 0,
    "@typescript-eslint/require-await": 0,
    "@typescript-eslint/restrict-template-expressions": 0,
    "@typescript-eslint/strict-boolean-expressions": 0,
    "arrow-body-style": 0,
    "avoidEscape": 0,
    "camelcase": 0,
    "comma-dangle": 0,
    "import/no-named-default": 0,
    "import/no-unresolved": 0,
    "indent": 0,
    "multiline-ternary": 0,
    "no-async-promise-executor": 0,
    "no-constant-condition": 0,
    "no-multi-spaces": 0,
    "no-multiple-empty-lines": 0,
    "no-trailing-spaces": 0,
    "no-underscore-dangle": 0,
    "no-unreachable": 0,
    "no-unreachable-loop": 0,
    "no-unused-vars": 0,
    "no-use-before-define": 0,
    "node/handle-callback-err": 0,
    "node/no-callback-literal": 0,
    "padded-blocks": 0,
    "quotes": 0,
    "semi": 0,
    "sort-imports": 0,
    "space-before-function-paren": 0,
    "spaced-comment": 0,

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
    "node/no-exports-assign": 2,
    "node/no-new-require": 2,
    "node/no-path-concat": 2,
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
