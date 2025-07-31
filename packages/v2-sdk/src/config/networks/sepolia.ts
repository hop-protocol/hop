import { NO_PARENT_CHAIN_ID, sharedChain } from './shared.js'
import type { ChainConfig } from './types.js'

export const chains: Record<string, ChainConfig> = {
  ethereum: {
    ...sharedChain.ethereum,
    chainId: '11155111',
    parentChainId: NO_PARENT_CHAIN_ID,
    publicRpcUrl: 'https://sepolia.drpc.org',
    fallbackPublicRpcUrls: [
      'https://1rpc.io/sepolia',
      'https://rpc2.sepolia.org',
      'https://sepolia.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    ],
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
    chainId: '421614',
    parentChainId: '11155111',
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
    chainId: '11155420',
    parentChainId: '11155111',
    publicRpcUrl: 'https://optimism-sepolia.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://sepolia-optimism.etherscan.io'],
    subgraphUrl: '',
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    isRollup: true,
    txOverrides: {}
  },
  base: {
    ...sharedChain.base,
    chainId: '84532',
    parentChainId: '11155111',
    publicRpcUrl: 'https://sepolia.base.org',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://sepolia.basescan.org'],
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    subgraphUrl: '',
    etherscanApiUrl: '',
    isRollup: true,
    txOverrides: {}
  },
  hub: {
    ...sharedChain.hub,
    chainId: '42069',
    parentChainId: '11155111',
    publicRpcUrl: 'https://hub-testnet.rpc.hop.exchange',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://hub-explorer-testnet.hop.exchange'],
    multicall: '0x3Fb3C8023FA087F623D6077c4b70A7Bffe17b38D',
    subgraphUrl: '',
    etherscanApiUrl: '',
    isRollup: true,
    txOverrides: {}
  }
}
