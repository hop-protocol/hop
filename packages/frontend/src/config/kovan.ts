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

export const networks: Networks = {
  ethereum: {
    networkId: kovanNetworks.ethereum.networkId.toString(),
    rpcUrls: kovanNetworks.ethereum.rpcUrls,
    explorerUrl: kovanNetworks.ethereum.explorerUrls[0],
    nativeBridgeUrl: kovanNetworks.ethereum.nativeBridgeUrl
  },
  /*
  arbitrum: {
    networkId: kovanNetworks.arbitrum.networkId.toString(),
    rpcUrls: kovanNetworks.arbitrum.rpcUrls,
    explorerUrl: kovanNetworks.arbitrum.explorerUrls[0],
    nativeBridgeUrl: kovanNetworks.arbitrum.nativeBridgeUrl
  },
  */
  optimism: {
    networkId: kovanNetworks.optimism.networkId.toString(),
    rpcUrls: kovanNetworks.optimism.rpcUrls,
    explorerUrl: kovanNetworks.optimism.explorerUrls[0],
    nativeBridgeUrl: kovanNetworks.optimism.nativeBridgeUrl
  },
  xdai: {
    networkId: kovanNetworks.xdai.networkId.toString(),
    rpcUrls: kovanNetworks.xdai.rpcUrls,
    explorerUrl: kovanNetworks.xdai.explorerUrls[0],
    nativeBridgeUrl: kovanNetworks.xdai.nativeBridgeUrl
  }
}
