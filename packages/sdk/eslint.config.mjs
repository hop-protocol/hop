import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  extends: [
    ...baseConfig,
  ],
  ignores: [
    "dist",
    "hop.js"
  ]
})