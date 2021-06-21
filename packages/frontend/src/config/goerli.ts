import { goerli as goerliAddresses } from '@hop-protocol/addresses'
import { goerli as goerliNetworks } from '@hop-protocol/networks'
import { HopAddresses, Networks } from './interfaces'

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: ''
  },
  tokens: goerliAddresses.bridges
}

export const networks: Networks = {
  ethereum: {
    networkId: goerliNetworks.ethereum.networkId.toString(),
    rpcUrls: goerliNetworks.ethereum.rpcUrls,
    explorerUrl: goerliNetworks.ethereum.explorerUrls[0]
  },
  polygon: {
    networkId: goerliNetworks.polygon.networkId.toString(),
    rpcUrls: goerliNetworks.polygon.rpcUrls,
    explorerUrl: goerliNetworks.polygon.explorerUrls[0]
  }
  /*
  arbitrum: {
    networkId: goerliNetworks.arbitrum.networkId.toString(),
    rpcUrls: goerliNetworks.arbitrum.rpcUrls,
    explorerUrl: goerliNetworks.arbitrum.explorerUrls[0]
  },
  optimism: {
    networkId: goerliNetworks.optimism.networkId.toString(),
    rpcUrls: goerliNetworks.optimism.rpcUrls,
    explorerUrl: goerliNetworks.optimism.explorerUrls[0]
  },
  xdai: {
    networkId: goerliNetworks.xdai.networkId.toString(),
    rpcUrls: goerliNetworks.xdai.rpcUrls,
    explorerUrl: goerliNetworks.xdai.explorerUrls[0]
  }
  */
}
