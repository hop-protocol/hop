module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "plugin:react/recommended",
    "standard",
    "plugin:react-hooks/recommended",
    "plugin:json/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint", "unused-imports", "sort-imports-es6-autofix"],
  "ignorePatterns": [],
  "rules": {
    "@typescript-eslint/no-unused-vars": 0,
    "arrow-body-style": 0,
    "camelcase": 0,
    "comma-dangle": 0,
    "import/no-named-default": 0,
    "import/no-unresolved": 0,
    "indent": 0,
    "multiline-ternary": 0,
    "new-cap": 0,
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
    "prefer-const": 1,
    "quotes": 0,
    "semi": 0,
    "sort-imports": 0,
    "space-before-function-paren": 0,
    "spaced-comment": 0,
    "unused-imports/no-unused-imports": 1,
    "avoidEscape": 0,
    "sort-imports-es6-autofix/sort-imports-es6": [1, {
      "ignoreCase": false,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "single", "multiple", "all"]
    }],
    "react-hooks/exhaustive-deps": 0,
    "react-hooks/rules-of-hooks": 0,
    "react/display-name": 0,
    "react/jsx-key": 0,
    "react/jsx-one-expression-per-line": 0,
    "react/no-unescaped-entities": 0,
    "react/prop-types": 0,
    "react/jsx-filename-extension": [
      2,
      {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    ]
  },
  "settings": {
    "react": {
      "version": "999.999.999"
    }
  }
}
