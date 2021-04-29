import { goerli as addresses } from '@hop-protocol/addresses'
export { addresses }

export const chains = {
  ethereum: {
    name: 'Goerli',
    chainId: '5',
    rpcUrl: 'https://goerli.rpc.hop.exchange',
    explorerUrl: 'https://goerli.etherscan.io/'
  },
  polygon: {
    name: 'Polygon',
    chainId: '80001',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://explorer-mumbai.maticvigil.com/'
  }
}
