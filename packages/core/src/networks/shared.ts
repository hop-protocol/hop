import { ChainSlug } from '../config/types'
import { Network } from './types'
import { chains } from '../metadata'

export const BaseChainData: { [key in ChainSlug]: Partial<Network> } = {
  ethereum: {
    name: chains.ethereum.name,
    image: chains.ethereum.image
  },
  gnosis: {
    name: chains.gnosis.name,
    image: chains.gnosis.image
  },
  polygon: {
    name: chains.polygon.name,
    image: chains.polygon.image
  },
  optimism: {
    name: chains.optimism.name,
    image: chains.optimism.image
  },
  arbitrum: {
    name: chains.arbitrum.name,
    image: chains.arbitrum.image
  },
  zksync: {
    name: chains.zksync.name,
    image: chains.zksync.image
  },
  linea: {
    name: chains.linea.name,
    image: chains.linea.image
  },
  scrollzk: {
    name: chains.scrollzk.name,
    image: chains.scrollzk.image
  },
  nova: {
    name: chains.nova.name,
    image: chains.nova.image
  },
  base: {
    name: chains.base.name,
    image: chains.base.image
  },
  polygonzk: {
    name: chains.polygonzk.name,
    image: chains.polygonzk.image
  }
}
