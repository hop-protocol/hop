import { mainnet as addresses } from '@hop-protocol/addresses'
export { addresses }

export const networks: any = {
  ethereum: {
    networkId: '1',
    rpcUrl: 'https://mainnet.rpc.hop.exchange'
  },
  /*
  // TODO: arbitrum mainnet
  arbitrum: {
    chainId: '1000',
    rpcUrl: 'https://mainnet.arbitrum.io'
  },
  optimism: {
    chainId: '10',
    rpcUrl: 'https://mainnet.optimism.io'
  },
  */
  xdai: {
    chainId: '100',
    rpcUrl: 'https://rpc.xdaichain.com'
  },
  polygon: {
    chainId: '137',
    rpcUrl: 'https://rpc-mainnet.maticvigil.com'
  }
}

export const bonders: string[] = []
