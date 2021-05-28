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
    rpcUrl: goerliNetworks.ethereum.rpcUrls[0],
    explorerUrl: goerliNetworks.ethereum.explorerUrls[0]
  },
  polygon: {
    networkId: goerliNetworks.polygon.networkId.toString(),
    rpcUrl: goerliNetworks.polygon.rpcUrls[0],
    explorerUrl: goerliNetworks.polygon.explorerUrls[0]
  }
  /*
  arbitrum: {
    networkId: goerliNetworks.arbitrum.networkId.toString(),
    rpcUrl: goerliNetworks.arbitrum.rpcUrls[0],
    explorerUrl: goerliNetworks.arbitrum.explorerUrls[0]
  },
  optimism: {
    networkId: goerliNetworks.optimism.networkId.toString(),
    rpcUrl: goerliNetworks.optimism.rpcUrls[0],
    explorerUrl: goerliNetworks.optimism.explorerUrls[0]
  },
  xdai: {
    networkId: goerliNetworks.xdai.networkId.toString(),
    rpcUrl: goerliNetworks.xdai.rpcUrls[0],
    explorerUrl: goerliNetworks.xdai.explorerUrls[0]
  }
  */
}
