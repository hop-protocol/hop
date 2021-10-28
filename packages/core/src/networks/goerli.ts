import { Networks } from './types'
import { chains } from '../metadata'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 5,
    rpcUrls: ['https://goerli.rpc.hop.exchange'],
    explorerUrls: ['https://goerli.etherscan.io'],
    waitConfirmations: 1
  },
  polygon: {
    name: chains.polygon.name,
    networkId: 80001,
    rpcUrls: ['https://mumbai.rpc.hop.exchange'],
    explorerUrls: [
      'https://mumbai.polygonscan.com',
      'https://explorer-mumbai.maticvigil.com'
    ],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 1
  }
}
