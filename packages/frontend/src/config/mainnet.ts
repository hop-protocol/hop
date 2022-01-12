import {
  mainnet as mainnetAddresses,
  staging as stagingAddresses,
} from '@hop-protocol/core/addresses'
import { mainnet as mainnetNetworks } from '@hop-protocol/core/networks'

import { HopAddresses, Networks } from './interfaces'

const isStaging = process.env.REACT_APP_NETWORK === 'staging'
const _addresses = isStaging ? stagingAddresses : mainnetAddresses

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: '',
  },
  tokens: _addresses.bridges,
  bonders: _addresses.bonders,
}

const _networks = mainnetNetworks as any

export const networks: Networks = {
  ethereum: {
    networkId: _networks.ethereum.networkId.toString(),
    rpcUrl: _networks.ethereum.publicRpcUrl,
    explorerUrl: _networks.ethereum.explorerUrls[0],
    waitConfirmations: _networks.ethereum.waitConfirmations,
  },
  polygon: {
    networkId: _networks.polygon.networkId.toString(),
    rpcUrl: _networks.polygon.publicRpcUrl,
    explorerUrl: _networks.polygon.explorerUrls[0],
    nativeBridgeUrl: _networks.polygon.nativeBridgeUrl,
    waitConfirmations: _networks.polygon.waitConfirmations,
  },
  arbitrum: {
    networkId: _networks.arbitrum.networkId.toString(),
    rpcUrl: _networks.arbitrum.publicRpcUrl,
    explorerUrl: _networks.arbitrum.explorerUrls[0],
    nativeBridgeUrl: _networks.arbitrum.nativeBridgeUrl,
    waitConfirmations: _networks.arbitrum.waitConfirmations,
  },
  optimism: {
    networkId: _networks.optimism.networkId.toString(),
    rpcUrl: _networks.optimism.publicRpcUrl,
    explorerUrl: _networks.optimism.explorerUrls[0],
    nativeBridgeUrl: _networks.optimism.nativeBridgeUrl,
    waitConfirmations: _networks.optimism.waitConfirmations,
  },
  gnosis: {
    networkId: _networks.gnosis.networkId.toString(),
    rpcUrl: _networks.gnosis.publicRpcUrl,
    explorerUrl: _networks.gnosis.explorerUrls[0],
    nativeBridgeUrl: _networks.gnosis.nativeBridgeUrl,
    waitConfirmations: _networks.gnosis.waitConfirmations,
  },
}
