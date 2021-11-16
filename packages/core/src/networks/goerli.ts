import { Networks } from './types'
import { chains } from '../metadata'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 5,
    publicRpcUrl: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    explorerUrls: ['https://goerli.etherscan.io'],
    waitConfirmations: 1
  },
  polygon: {
    name: chains.polygon.name,
    networkId: 80001,
    publicRpcUrl: 'https://matic-testnet-archive-rpc.bwarelabs.com',
    explorerUrls: [
      'https://mumbai.polygonscan.com',
      'https://explorer-mumbai.maticvigil.com'
    ],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 1
  }
}
