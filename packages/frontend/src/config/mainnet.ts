import { mainnet as mainnetAddresses } from '@hop-protocol/addresses'
import { mainnet as mainnetNetworks } from '@hop-protocol/networks'
import { HopAddresses, Networks } from './interfaces'

export const addresses: HopAddresses = {
  governance: {
    l1Hop: '',
    stakingRewardsFactory: '',
    stakingRewards: '',
    governorAlpha: ''
  },
  tokens: mainnetAddresses.bridges,
  bonders: mainnetAddresses.bonders,
}

export const networks: Networks = {
  ethereum: {
    networkId: mainnetNetworks.ethereum.networkId.toString(),
    rpcUrls: mainnetNetworks.ethereum.rpcUrls,
    explorerUrl: mainnetNetworks.ethereum.explorerUrls[0],
  },
  polygon: {
    networkId: mainnetNetworks.polygon.networkId.toString(),
    rpcUrls: mainnetNetworks.polygon.rpcUrls,
    explorerUrl: mainnetNetworks.polygon.explorerUrls[0],
    nativeBridgeUrl: mainnetNetworks.polygon.nativeBridgeUrl
  },
  /*
  arbitrum: {
    networkId: mainnetNetworks.arbitrum.networkId.toString(),
    rpcUrls: mainnetNetworks.arbitrum.rpcUrls,
    explorerUrl: mainnetNetworks.arbitrum.explorerUrls[0],
    nativeBridgeUrl: mainnetNetworks.arbitrum.nativeBridgeUrl
  },
  optimism: {
    networkId: mainnetNetworks.optimism.networkId.toString(),
    rpcUrls: mainnetNetworks.optimism.rpcUrls,
    explorerUrl: mainnetNetworks.optimism.explorerUrls[0],
    nativeBridgeUrl: mainnetNetworks.optimism.nativeBridgeUrl
  },
  */
  xdai: {
    networkId: mainnetNetworks.xdai.networkId.toString(),
    rpcUrls: ['https://dark-solitary-dawn.xdai.quiknode.pro/0d72762fc2a22e8c90437a0279b00e7fc11a7e3b/'],
    explorerUrl: mainnetNetworks.xdai.explorerUrls[0],
    nativeBridgeUrl: mainnetNetworks.xdai.nativeBridgeUrl
  }
}
