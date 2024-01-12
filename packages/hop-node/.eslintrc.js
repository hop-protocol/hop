module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended-type-checked", // this can't be at the root because the frontend has to use an older version of eslint due to version of react-scripts it's using
    '../../.eslintrc.js'
  ]
}
