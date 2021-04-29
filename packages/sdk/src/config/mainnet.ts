import { mainnet as addresses } from '@hop-protocol/addresses'
export { addresses }

export const chains = {
  ethereum: {
    name: 'Ethereum',
    chainId: '1',
    rpcUrl: 'https://mainnet.rpc.hop.exchange',
    explorerUrl: 'https://etherscan.io/'
  },
  optimism: {
    name: 'Optimism',
    chainId: '10',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl:
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fmainnet.optimism.io'
  },
  xdai: {
    name: 'xDai',
    chainId: '100',
    rpcUrl: 'https://rpc.xdaichain.com',
    explorerUrl: 'https://blockscout.com/xdai/mainnet/'
  },
  polygon: {
    name: 'Polygon',
    chainId: '137',
    rpcUrl: 'https://rpc-mainnet.maticvigil.com',
    explorerUrl: 'https://explorer-mainnet.maticvigil.com/'
  }
}
