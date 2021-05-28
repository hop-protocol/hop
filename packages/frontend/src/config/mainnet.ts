import { mainnet as mainnetAddresses } from '@hop-protocol/addresses'
import { mainnet as mainnetNetworks } from '@hop-protocol/networks'
import { HopAddresses, Networks } from './interfaces'

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: ''
  },
  tokens: mainnetAddresses.bridges
}

export const networks: Networks = {
  ethereum: {
    networkId: mainnetNetworks.ethereum.networkId.toString(),
    rpcUrl: mainnetNetworks.ethereum.rpcUrls[0],
    explorerUrl: mainnetNetworks.ethereum.explorerUrls[0]
  },
  polygon: {
    networkId: mainnetNetworks.polygon.networkId.toString(),
    rpcUrl: mainnetNetworks.polygon.rpcUrls[0],
    explorerUrl: mainnetNetworks.polygon.explorerUrls[0]
  },
  /*
  arbitrum: {
    networkId: mainnetNetworks.arbitrum.networkId.toString(),
    rpcUrl: mainnetNetworks.arbitrum.rpcUrls[0],
    explorerUrl: mainnetNetworks.arbitrum.explorerUrls[0]
  },
  optimism: {
    networkId: mainnetNetworks.optimism.networkId.toString(),
    rpcUrl: mainnetNetworks.optimism.rpcUrls[0],
    explorerUrl: mainnetNetworks.optimism.explorerUrls[0]
  },
  */
  xdai: {
    networkId: mainnetNetworks.xdai.networkId.toString(),
    rpcUrl: mainnetNetworks.xdai.rpcUrls[0],
    explorerUrl: mainnetNetworks.xdai.explorerUrls[0]
  }
}
