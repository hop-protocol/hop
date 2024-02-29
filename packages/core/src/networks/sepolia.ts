import { Networks } from './types.js'
import { chains } from '../metadata/index.js'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    image: chains.ethereum.image,
    networkId: 11155111,
    publicRpcUrl: 'https://sepolia.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://sepolia.etherscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-sepolia',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {
      minGasLimit: 1_000_000
    },
    averageBlockTimeSeconds: 12
  }
}
