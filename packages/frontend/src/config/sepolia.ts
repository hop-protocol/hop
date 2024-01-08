import { sepolia as _sepoliaAddresses } from '@hop-protocol/core/addresses'
import { sepolia as _sepoliaNetworks } from '@hop-protocol/core/networks'
import { HopAddresses, Networks } from 'src/config/interfaces'

export const sepoliaAddresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: '',
  },
  tokens: _sepoliaAddresses.bridges,
  bonders: _sepoliaAddresses.bonders,
}

const _networks = _sepoliaNetworks as any
const sepoliaNetworks: Networks = {}

for (const chainSlug in _networks) {
  sepoliaNetworks[chainSlug] = {
    networkId: _networks[chainSlug].networkId,
    rpcUrl: _networks[chainSlug].publicRpcUrl,
    fallbackRpcUrls: _networks[chainSlug].fallbackPublicRpcUrls,
    explorerUrl: _networks[chainSlug].explorerUrls[0],
    nativeBridgeUrl: _networks[chainSlug].nativeBridgeUrl
  }
}

export { sepoliaNetworks }
