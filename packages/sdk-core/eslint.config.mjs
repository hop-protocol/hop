import baseConfig from '../../eslint.config.mjs'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...baseConfig
)
// extends: '../../.eslintrc.js',
// // TODO: Remove this later
// ignorePatterns: [
//   // TODO: Remove after fixing up tests
//   'test',
//   // TODO: Remove after removal of typechain
//   'src/contracts',
//   // TODO: Remove after removal of top-level dirs
//   'abi',
//   'addresses',
//   'config',
//   'contracts',
//   'metadata',
//   'networks'
// ]