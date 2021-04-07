import { addresses as mainnetAddresses } from './mainnet'
import { addresses as kovanAddresses } from './kovan'
import { addresses as goerliAddresses } from './goerli'

const network = process.env.REACT_APP_NETWORK
let addresses = kovanAddresses
let isMainnet = false

if (network === 'mainnet') {
  isMainnet = true
  addresses = mainnetAddresses
} else if (network === 'goerli') {
  addresses = goerliAddresses
}

console.log('config addresses:', addresses.tokens)

export { isMainnet, addresses }
export const blocknativeDappid = '328621b8-952f-4a86-bd39-724ba822d416'
export const infuraKey = '8e4fe7af961f48a1958584ec36742b44'
export const fortmaticApiKey = 'pk_live_AB6F615F133473CA'
export const portisDappId = 'fbde3745-1363-4ae4-a517-00d98ab2dfbc'

export const networks: any = {
  kovan: {
    networkId: '42',
    rpcUrl: 'https://kovan.rpc.hop.exchange',
    explorerUrl: 'https://kovan.etherscan.io/'
  },
  /*
  arbitrum: {
    networkId: '79377087078960',
    rpcUrl: 'https://kovan3.arbitrum.io/rpc',
    explorerUrl: 'https://explorer.offchainlabs.com/#/'
  },
	*/
  optimism: {
    networkId: '69',
    rpcUrl: 'https://kovan.optimism.io',
    explorerUrl:
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fkovan.optimism.io'
  },
  xdai: {
    networkId: '77',
    rpcUrl: 'https://sokol.poa.network',
    explorerUrl: 'https://blockscout.com/poa/sokol/'
  }
}
