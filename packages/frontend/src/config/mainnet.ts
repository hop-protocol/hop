import { mainnet as mainnetAddresses, staging as stagingAddresses } from '@hop-protocol/core/addresses'
import { mainnet as mainnetNetworks } from '@hop-protocol/core/networks'

import { HopAddresses, Networks } from './interfaces'

const isStaging = process.env.REACT_APP_NETWORK === 'staging'
const _addresses = isStaging ? stagingAddresses : mainnetAddresses

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: ''
  },
  tokens: _addresses.bridges,
  bonders: _addresses.bonders,
}

const _networks = mainnetNetworks as any

export const networks: Networks = {
  ethereum: {
    networkId: _networks.ethereum.networkId.toString(),
    rpcUrls: _networks.ethereum.rpcUrls,
    explorerUrl: _networks.ethereum.explorerUrls[0],
  },
  polygon: {
    networkId: _networks.polygon.networkId.toString(),
    rpcUrls: _networks.polygon.rpcUrls,
    explorerUrl: _networks.polygon.explorerUrls[0],
    nativeBridgeUrl: _networks.polygon.nativeBridgeUrl
  },
  /*
  arbitrum: {
    networkId: _networks.arbitrum.networkId.toString(),
    rpcUrls: _networks.arbitrum.rpcUrls,
    explorerUrl: _networks.arbitrum.explorerUrls[0],
    nativeBridgeUrl: _networks.arbitrum.nativeBridgeUrl
  },
  optimism: {
    networkId: _networks.optimism.networkId.toString(),
    rpcUrls: _networks.optimism.rpcUrls,
    explorerUrl: _networks.optimism.explorerUrls[0],
    nativeBridgeUrl: _networks.optimism.nativeBridgeUrl
  },
  */
  xdai: {
    networkId: _networks.xdai.networkId.toString(),
    rpcUrls: _networks.xdai.rpcUrls,
    explorerUrl: _networks.xdai.explorerUrls[0],
    nativeBridgeUrl: _networks.xdai.nativeBridgeUrl
  }
}
