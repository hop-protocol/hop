import { NO_PARENT_CHAIN_ID, sharedChain } from './shared.js'
import { type Chains } from '../types.js'
import { TokenSymbol } from '#tokens/index.js'

export const chains: Chains = {
  ethereum: {
    ...sharedChain.ethereum,
    chainId: 11155111,
    parentChainId: NO_PARENT_CHAIN_ID,
    publicRpcUrl: 'https://sepolia.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://sepolia.etherscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-sepolia',
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {
      minGasLimit: 1_000_000
    }
  },
  arbitrum: {
    ...sharedChain.arbitrum,
    chainId: 421614,
    parentChainId: 11155111,
    publicRpcUrl: 'https://arbitrum-sepolia.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://sepolia.arbiscan.io'],
    subgraphUrl: '',
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  optimism: {
    ...sharedChain.optimism,
    chainId: 11155420,
    parentChainId: 11155111,
    publicRpcUrl: 'https://optimism-sepolia.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://sepolia-optimism.etherscan.io'],
    subgraphUrl: '',
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  }
}
