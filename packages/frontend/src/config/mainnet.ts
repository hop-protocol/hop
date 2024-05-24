import { HopAddresses, Networks } from '#config/interfaces.js'
import { mainnet as _mainnetAddresses } from '@hop-protocol/sdk/addresses'
import { NetworkSlug, getNetwork } from '@hop-protocol/sdk'

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

const _network = getNetwork(NetworkSlug.Mainnet)
const mainnetNetworks: Networks = {}

for (const chainSlug in _network.chains) {
  mainnetNetworks[chainSlug] = {
    networkId: _network.chains[chainSlug].chainId,
    rpcUrl: _network.chains[chainSlug].publicRpcUrl,
    fallbackRpcUrls: _network.chains[chainSlug].fallbackPublicRpcUrls,
    explorerUrl: _network.chains[chainSlug].explorerUrls[0]
  }
}

export { mainnetNetworks }
