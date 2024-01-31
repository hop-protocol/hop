module.exports = {
  extends: '../../.eslintrc.js',
  overrides: [
    {
      // Ignore TS rules in JS files
      files: ['src/**/*.js'],
      extends: [
        'plugin:@typescript-eslint/disable-type-checked'
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 0
      }
    },
  ],
}
