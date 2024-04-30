import { HopAddresses, Networks } from 'src/config/interfaces'
import { sepolia as _sepoliaAddresses } from '@hop-protocol/sdk/addresses'
import { NetworkSlug, getNetwork } from '@hop-protocol/sdk'

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

const _network = getNetwork(NetworkSlug.Sepolia)
const sepoliaNetworks: Networks = {}

for (const chainSlug in _network.chains) {
  sepoliaNetworks[chainSlug] = {
    networkId: _network.chains[chainSlug].chainId,
    rpcUrl: _network.chains[chainSlug].publicRpcUrl,
    fallbackRpcUrls: _network.chains[chainSlug].fallbackPublicRpcUrls,
    explorerUrl: _network.chains[chainSlug].explorerUrls[0]
  }
}

export { sepoliaNetworks }
