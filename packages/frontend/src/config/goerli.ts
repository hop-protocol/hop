import { HopAddresses, Networks } from 'src/config/interfaces'
import { goerli as _goerliAddresses } from '@hop-protocol/core/addresses'
import { goerli as _goerliNetworks } from '@hop-protocol/core/networks'

export const goerliAddresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: '',
  },
  tokens: _goerliAddresses.bridges,
  bonders: _goerliAddresses.bonders,
}

const _networks = _goerliNetworks as any
const goerliNetworks: Networks = {}

for (const chainSlug in _networks) {
  goerliNetworks[chainSlug] = {
    networkId: _networks[chainSlug].networkId,
    rpcUrl: _networks[chainSlug].publicRpcUrl,
    fallbackRpcUrls: _networks[chainSlug].fallbackPublicRpcUrls,
    explorerUrl: _networks[chainSlug].explorerUrls[0],
    nativeBridgeUrl: _networks[chainSlug].nativeBridgeUrl
  }
}

export { goerliNetworks }
