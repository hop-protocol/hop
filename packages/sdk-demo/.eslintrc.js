module.exports = {
  "extends": [
    "../../.eslintrc.js",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["react"],
  "rules": {
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
      "version": "detect"
    }
  }
}
