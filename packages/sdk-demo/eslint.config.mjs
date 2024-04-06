import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'

export default tseslint.config({
  extends: [
    ...baseConfig
  ],
  ignores: [
    "dist/**"
  ],
  plugins: {
    'react-hooks': reactHooksPlugin,
    react: reactPlugin
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react/display-name': 'off',
    'react/jsx-key': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    ]
  }
})