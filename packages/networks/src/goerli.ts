import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    networkId: 5,
    rpcUrls: ['https://goerli.rpc.hop.exchange'],
    explorerUrls: ['https://goerli.etherscan.io']
  },
  polygon: {
    networkId: 80001,
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    explorerUrls: ['https://explorer-mumbai.maticvigil.com']
  }
}
