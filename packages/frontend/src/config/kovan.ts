import { kovan as kovanAddresses } from '@hop-protocol/core/addresses'
import { kovan as kovanNetworks } from '@hop-protocol/core/networks'
import { HopAddresses, Networks } from './interfaces'

// export const isSynthDemo = !!process.env.REACT_APP_SYNTH_DEMO

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '0xCc60875df511a36d9b9A4ae7f20f55d1B89EbcE2',
    stakingRewardsFactory: '0x8714CFE33dA280Ab990D1aCD33F1E7caF541dce4',
    stakingRewards: '0xdB33bf4a7b76b459407Fc5849c33AE9763D66895',
    governorAlpha: '0xadcdb487C45bCB517D3873Bb54F2e01942e4e1d5',
  },
  tokens: kovanAddresses.bridges,
  bonders: kovanAddresses.bonders,
}

const _networks = kovanNetworks as any
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
