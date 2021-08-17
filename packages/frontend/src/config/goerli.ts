import { goerli as goerliAddresses } from '@hop-protocol/core/addresses'
import { goerli as goerliNetworks } from '@hop-protocol/core/networks'
import { HopAddresses, Networks } from './interfaces'

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: ''
  },
  tokens: goerliAddresses.bridges,
  bonders: goerliAddresses.bonders,
}

const _networks = goerliNetworks as any

export const networks: Networks = {
  ethereum: {
    networkId: _networks.ethereum.networkId.toString(),
    rpcUrls: _networks.ethereum.rpcUrls,
    explorerUrl: _networks.ethereum.explorerUrls[0]
  },
  polygon: {
    networkId: _networks.polygon.networkId.toString(),
    rpcUrls: _networks.polygon.rpcUrls,
    explorerUrl: _networks.polygon.explorerUrls[0]
  }
  /*
  arbitrum: {
    networkId: _networks.arbitrum.networkId.toString(),
    rpcUrls: _networks.arbitrum.rpcUrls,
    explorerUrl: _networks.arbitrum.explorerUrls[0]
  },
  optimism: {
    networkId: _networks.optimism.networkId.toString(),
    rpcUrls: _networks.optimism.rpcUrls,
    explorerUrl: _networks.optimism.explorerUrls[0]
  },
  xdai: {
    networkId: _networks.xdai.networkId.toString(),
    rpcUrls: _networks.xdai.rpcUrls,
    explorerUrl: _networks.xdai.explorerUrls[0]
  }
  */
}
