import {
  mainnet as _mainnetAddresses,
  staging as stagingAddresses,
} from '@hop-protocol/core/addresses'
import { mainnet as _mainnetNetworks } from '@hop-protocol/core/networks'
import { HopAddresses, Networks } from './interfaces'

const isStaging = process.env.REACT_APP_NETWORK === 'staging'
const _addresses = isStaging ? stagingAddresses : _mainnetAddresses

export const mainnetAddresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: '',
  },
  tokens: _addresses.bridges,
  bonders: _addresses.bonders,
}

const _networks = _mainnetNetworks as any
const mainnetNetworks: Networks = {}

for (const chainSlug in _networks) {
  mainnetNetworks[chainSlug] = {
    networkId: _networks[chainSlug].networkId,
    rpcUrl: _networks[chainSlug].publicRpcUrl,
    fallbackRpcUrls: _networks[chainSlug].fallbackPublicRpcUrls,
    explorerUrl: _networks[chainSlug].explorerUrls[0],
    nativeBridgeUrl: _networks[chainSlug].nativeBridgeUrl,
    waitConfirmations: _networks[chainSlug].waitConfirmations
  }
}

export { mainnetNetworks }
