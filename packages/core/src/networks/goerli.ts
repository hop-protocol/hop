import { chains } from '../metadata'
import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 5,
    rpcUrls: ['https://goerli.rpc.hop.exchange'],
    archiveRpcUrls: ['https://goerli.rpc.hop.exchange'],
    explorerUrls: ['https://goerli.etherscan.io'],
    waitConfirmations: 1
  },
  polygon: {
    name: chains.polygon.name,
    networkId: 80001,
    rpcUrls: [
      'https://mumbai.rpc.hop.exchange',
      'https://rpc-mumbai.maticvigil.com'
    ],
    archiveRpcUrls: ['https://mumbai.rpc.hop.exchange'],
    specialArchiveRpcUrl: 'https://matic-testnet-archive-rpc.bwarelabs.com',
    explorerUrls: [
      'https://mumbai.polygonscan.com',
      'https://explorer-mumbai.maticvigil.com'
    ],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 1
  }
}
