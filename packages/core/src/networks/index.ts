import { networks as goerli } from './goerli.js'
import { networks as mainnet } from './mainnet.js'
import { networks as sepolia } from './sepolia.js'

const networks = { goerli, sepolia, mainnet }
export { goerli, sepolia, mainnet, networks }

export * from './types'
export * from './enums'
