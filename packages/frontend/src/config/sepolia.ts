import { HopAddresses, Networks } from 'src/config/interfaces'
import { sepolia as _sepoliaAddresses } from '@hop-protocol/sdk/addresses'
import { sepolia as _sepoliaNetworks } from '@hop-protocol/sdk/networks'

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
    networkId: _networks[chainSlug].chainId,
    rpcUrl: _networks[chainSlug].publicRpcUrl,
    fallbackRpcUrls: _networks[chainSlug].fallbackPublicRpcUrls,
    explorerUrl: _networks[chainSlug].explorerUrls[0]
  }
}

export { sepoliaNetworks }
