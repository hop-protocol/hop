import { HopAddresses } from './interfaces'

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: ''
  },
  tokens: {}
}

export const networks: any = {
  goerli: {
    networkId: '5',
    rpcUrl: 'https://goerli.rpc.hop.exchange',
    explorerUrl: 'https://goerli.etherscan.io/'
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
