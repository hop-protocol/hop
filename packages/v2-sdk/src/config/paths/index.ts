export * from './types.js'
import { paths as mainnetPaths } from './mainnet.js'
import { paths as sepoliaPaths } from './sepolia.js'

export { mainnetPaths, sepoliaPaths }

export const allPaths = {
  ...mainnetPaths,
  ...sepoliaPaths
}