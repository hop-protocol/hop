import { goerli as goerliAddresses } from '@hop-protocol/core/addresses'
import { goerli as goerliNetworks } from '@hop-protocol/core/networks'
import { HopAddresses, Networks } from './interfaces'

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: '',
  },
  tokens: goerliAddresses.bridges,
  bonders: goerliAddresses.bonders,
}

const _networks = goerliNetworks as any
const networks: Networks = {}

for (const chainSlug in _networks) {
  networks[chainSlug] = {
    networkId: _networks[chainSlug].networkId,
    rpcUrl: _networks[chainSlug].publicRpcUrl,
    fallbackRpcUrls: _networks[chainSlug].fallbackPublicRpcUrls,
    explorerUrl: _networks[chainSlug].explorerUrls[0],
    nativeBridgeUrl: _networks[chainSlug].nativeBridgeUrl,
    waitConfirmations: _networks[chainSlug].waitConfirmations
  }
}

export { networks }
