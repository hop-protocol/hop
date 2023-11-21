import { config as goerli } from './goerli'
import { config as mainnet } from './mainnet'
import { config as sepolia } from './sepolia'

const config = { goerli, sepolia, mainnet }

export { goerli, sepolia, mainnet, config }
export * from './types'
