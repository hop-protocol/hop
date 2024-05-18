import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'

export default tseslint.config(
  ...baseConfig,
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
      react: reactPlugin
    },
    rules: {
      'n/no-missing-import': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react/display-name': 'off',
      'react/jsx-key': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      ]
    }
  }
)
