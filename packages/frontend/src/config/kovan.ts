import { kovan as kovanAddresses } from '@hop-protocol/core/addresses'
import { kovan as kovanNetworks } from '@hop-protocol/core/networks'
import { HopAddresses, Networks } from './interfaces'

// export const isSynthDemo = !!process.env.REACT_APP_SYNTH_DEMO

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '0xCc60875df511a36d9b9A4ae7f20f55d1B89EbcE2',
    stakingRewardsFactory: '0x8714CFE33dA280Ab990D1aCD33F1E7caF541dce4',
    stakingRewards: '0xdB33bf4a7b76b459407Fc5849c33AE9763D66895',
    governorAlpha: '0xadcdb487C45bCB517D3873Bb54F2e01942e4e1d5'
  },
  tokens: kovanAddresses.bridges,
  bonders: kovanAddresses.bonders,
}

const _networks = kovanNetworks as any

export const networks: Networks = {
  ethereum: {
    networkId: _networks.ethereum.networkId.toString(),
    rpcUrls: _networks.ethereum.rpcUrls,
    explorerUrl: _networks.ethereum.explorerUrls[0],
    nativeBridgeUrl: _networks.ethereum.nativeBridgeUrl
  },
  /*
  arbitrum: {
    networkId: _networks.arbitrum.networkId.toString(),
    rpcUrls: _networks.arbitrum.rpcUrls,
    explorerUrl: _networks.arbitrum.explorerUrls[0],
    nativeBridgeUrl: _networks.arbitrum.nativeBridgeUrl
  },
  */
  optimism: {
    networkId: _networks.optimism.networkId.toString(),
    rpcUrls: _networks.optimism.rpcUrls,
    explorerUrl: _networks.optimism.explorerUrls[0],
    nativeBridgeUrl: _networks.optimism.nativeBridgeUrl
  },
  xdai: {
    networkId: _networks.xdai.networkId.toString(),
    rpcUrls: _networks.xdai.rpcUrls,
    explorerUrl: _networks.xdai.explorerUrls[0],
    nativeBridgeUrl: _networks.xdai.nativeBridgeUrl
  }
}
