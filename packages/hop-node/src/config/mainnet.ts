import { mainnet as addresses } from '@hop-protocol/addresses'
export { addresses }

export const networks: any = {
  ethereum: {
    networkId: '1',
    rpcUrl: 'https://mainnet.rpc.hop.exchange'
  },
  polygon: {
    networkId: '137',
    rpcUrl: 'https://rpc-mainnet.maticvigil.com'
  }
  /*
  arbitrum: {
    networkId: '79377087078960',
    rpcUrl: 'https://kovan3.arbitrum.io/rpc',
    explorerUrl: 'https://explorer.offchainlabs.com/#/'
  },
  optimism: {
    networkId: '69',
    rpcUrl: 'https://kovan.optimism.io',
  },
  xdai: {
    networkId: '77',
    rpcUrl: 'https://sokol.poa.network',
  }
  */
}

export const bonders: string[] = []
