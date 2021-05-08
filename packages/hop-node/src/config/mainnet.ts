import { mainnet as addresses } from '@hop-protocol/addresses'
export { addresses }

export const networks: any = {
  ethereum: {
    networkId: '1',
    rpcUrl: 'https://mainnet.rpc.hop.exchange',
    waitConfirmations: 12
  },
  /*
  // TODO: arbitrum mainnet
  arbitrum: {
    chainId: '1000',
    rpcUrl: 'https://mainnet.arbitrum.io',
    waitConfirmations: 12
  },
  optimism: {
    chainId: '10',
    rpcUrl: 'https://mainnet.optimism.io',
    waitConfirmations: 12
  },
  */
  xdai: {
    chainId: '100',
    rpcUrl: 'https://rpc.xdaichain.com',
    waitConfirmations: 12
  },
  polygon: {
    chainId: '137',
    rpcUrl: 'https://rpc-mainnet.maticvigil.com',
    waitConfirmations: 12
  }
}

export const bonders: string[] = []
