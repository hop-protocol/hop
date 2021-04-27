import { HopAddresses } from './interfaces'
import { goerli as goerliAddresses } from '@hop-protocol/addresses'

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: ''
  },
  tokens: goerliAddresses
}

export const networks: any = {
  goerli: {
    networkId: '5',
    rpcUrl: 'https://goerli.rpc.hop.exchange',
    explorerUrl: 'https://goerli.etherscan.io/'
  },
  polygon: {
    networkId: '80001',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://explorer-mumbai.maticvigil.com/'
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
    explorerUrl:
      `https://expedition.dev/?rpcUrl=https%3A%2F%2Fkovan.optimism.io`
  },
  xdai: {
    networkId: '77',
    rpcUrl: 'https://sokol.poa.network',
    explorerUrl: 'https://blockscout.com/poa/sokol/'
  }
	*/
}
