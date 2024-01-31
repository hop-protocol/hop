module.exports = {
  extends: '../../.eslintrc.js',
  ignorePatterns: [
    // TODO: Remove after fixing up tests
    'test',
    // TODO: Remove after removal of typechain
    'src/contracts',
    // TODO: Remove after removal of top-level dirs
    'abi',
    'addresses',
    'config',
    'contracts',
    'metadata',
    'networks'
  ]
}
