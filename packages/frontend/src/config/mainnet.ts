import { HopAddresses, Networks } from 'src/config/interfaces'
import { mainnet as _mainnetAddresses } from '@hop-protocol/core/addresses'
import { mainnet as _mainnetNetworks } from '@hop-protocol/core/networks'

export const mainnetAddresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: '',
  },
  tokens: _mainnetAddresses.bridges,
  bonders: _mainnetAddresses.bonders,
}

const _networks = _mainnetNetworks as any
const mainnetNetworks: Networks = {}

for (const chainSlug in _networks) {
  mainnetNetworks[chainSlug] = {
    networkId: _networks[chainSlug].networkId,
    rpcUrl: _networks[chainSlug].publicRpcUrl,
    fallbackRpcUrls: _networks[chainSlug].fallbackPublicRpcUrls,
    explorerUrl: _networks[chainSlug].explorerUrls[0],
    nativeBridgeUrl: _networks[chainSlug].nativeBridgeUrl
  }
}

export { mainnetNetworks }
