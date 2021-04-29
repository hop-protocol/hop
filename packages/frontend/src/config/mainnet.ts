import { mainnet as mainnetAddresses } from '@hop-protocol/addresses'
import { HopAddresses } from './interfaces'

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: ''
  },
  tokens: mainnetAddresses
}

export const networks: any = {
  ethereum: {
    networkId: '1',
    rpcUrl: 'https://mainnet.rpc.hop.exchange',
    explorerUrl: 'https://etherscan.io/'
  },
  /*
  polygon: {
    networkId: '137',
    rpcUrl: 'https://rpc-mainnet.maticvigil.com',
    explorerUrl: 'https://explorer-mainnet.maticvigil.com/'
  },
  arbitrum: {
    networkId: '?',
    rpcUrl: 'https://mainnet.arbitrum.io/rpc',
    explorerUrl: 'https://explorer.offchainlabs.com/#/'
  },
  optimism: {
    networkId: '69',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl:
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fmainnet.optimism.io'
  },
	*/
  xdai: {
    networkId: '100',
    rpcUrl: 'https://rpc.xdaichain.com',
    explorerUrl: 'https://blockscout.com/xdai/mainnet/'
  }
}
