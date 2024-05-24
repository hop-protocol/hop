import { HopAddresses, Networks } from '#config/interfaces.js'
import { goerli as _goerliAddresses } from '@hop-protocol/sdk/addresses'
import { NetworkSlug, getNetwork } from '@hop-protocol/sdk'

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

const _network = getNetwork(NetworkSlug.Goerli)
const goerliNetworks: Networks = {}

for (const chainSlug in _network.chains) {
  goerliNetworks[chainSlug] = {
    networkId: _network.chains[chainSlug].chainId,
    rpcUrl: _network.chains[chainSlug].publicRpcUrl,
    fallbackRpcUrls: _network.chains[chainSlug].fallbackPublicRpcUrls,
    explorerUrl: _network.chains[chainSlug].explorerUrls[0]
  }
}

export { goerliNetworks }
