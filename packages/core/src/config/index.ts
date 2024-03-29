import { config as goerli } from './goerli.js'
import { config as mainnet } from './mainnet.js'
import { config as sepolia } from './sepolia.js'

const config = { goerli, sepolia, mainnet }

export { goerli, sepolia, mainnet, config }
export * from './types.js'
