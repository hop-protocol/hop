import { kovan as kovanAddresses } from '@hop-protocol/addresses'
import { kovan as kovanNetworks } from '@hop-protocol/networks'
import { HopAddresses, Networks } from './interfaces'

// export const isSynthDemo = !!process.env.REACT_APP_SYNTH_DEMO

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '0xCc60875df511a36d9b9A4ae7f20f55d1B89EbcE2',
    stakingRewardsFactory: '0x8714CFE33dA280Ab990D1aCD33F1E7caF541dce4',
    stakingRewards: '0xdB33bf4a7b76b459407Fc5849c33AE9763D66895',
    governorAlpha: '0xadcdb487C45bCB517D3873Bb54F2e01942e4e1d5'
  },
  tokens: kovanAddresses.bridges
}

export const networks: Networks = {
  ethereum: {
    networkId: kovanNetworks.ethereum.networkId.toString(),
    rpcUrl: kovanNetworks.ethereum.rpcUrls[0],
    explorerUrl: kovanNetworks.ethereum.explorerUrls[0]
  },
  /*
  arbitrum: {
    networkId: kovanNetworks.arbitrum.networkId.toString(),
    rpcUrl: kovanNetworks.arbitrum.rpcUrls[0],
    explorerUrl: kovanNetworks.arbitrum.explorerUrls[0]
  },
  */
  optimism: {
    networkId: kovanNetworks.optimism.networkId.toString(),
    rpcUrl: kovanNetworks.optimism.rpcUrls[0],
    explorerUrl: kovanNetworks.optimism.explorerUrls[0]
  },
  xdai: {
    networkId: kovanNetworks.xdai.networkId.toString(),
    rpcUrl: kovanNetworks.xdai.rpcUrls[0],
    explorerUrl: kovanNetworks.xdai.explorerUrls[0]
  }
}
