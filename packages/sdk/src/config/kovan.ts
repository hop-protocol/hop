import { kovan as addresses } from '@hop-protocol/addresses'
export { addresses }

export const chains = {
  ethereum: {
    name: 'Kovan',
    chainId: '42',
    rpcUrl: 'https://kovan.rpc.hop.exchange',
    explorerUrl: 'https://kovan.etherscan.io/'
  },
  arbitrum: {
    name: 'Arbitrum',
    chainId: '212984383488152',
    rpcUrl: 'https://kovan4.arbitrum.io/rpc',
    explorerUrl: 'https://explorer.offchainlabs.com/#/'
  },
  optimism: {
    name: 'Optimism',
    chainId: '69',
    rpcUrl: 'https://kovan.optimism.io',
    explorerUrl:
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fkovan.optimism.io'
  },
  xdai: {
    name: 'xDai',
    chainId: '77',
    rpcUrl: 'https://sokol.poa.network',
    explorerUrl: 'https://blockscout.com/poa/sokol/'
  }
}
