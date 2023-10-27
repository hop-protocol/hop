import { ChainSlug } from '../config/types'
import { Network } from './types'
import { chains } from '../metadata'

export const BaseChainData: { [key in ChainSlug]: Partial<Network> } = {
  ethereum: {
    name: chains.ethereum.name,
    image: chains.ethereum.image,
    waitConfirmations: 32
  },
  gnosis: {
    name: chains.gnosis.name,
    image: chains.gnosis.image,
    waitConfirmations: 40
  },
  polygon: {
    name: chains.polygon.name,
    image: chains.polygon.image,
    waitConfirmations: 128
  },
  optimism: {
    name: chains.optimism.name,
    image: chains.optimism.image,
    waitConfirmations: 222
  },
  arbitrum: {
    name: chains.arbitrum.name,
    image: chains.arbitrum.image,
    waitConfirmations: 1776
  },
  zksync: {
    name: chains.zksync.name,
    image: chains.zksync.image,
    waitConfirmations: 1
  },
  linea: {
    name: chains.linea.name,
    image: chains.linea.image,
    waitConfirmations: 1
  },
  scrollzk: {
    name: chains.scrollzk.name,
    image: chains.scrollzk.image,
    waitConfirmations: 1
  },
  nova: {
    name: chains.nova.name,
    image: chains.nova.image,
    waitConfirmations: 1776
  },
  base: {
    name: chains.base.name,
    image: chains.base.image,
    waitConfirmations: 222
  },
  polygonzk: {
    name: chains.polygonzk.name,
    image: chains.polygonzk.image,
    waitConfirmations: 1
  }
}
