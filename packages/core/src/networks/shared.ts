import { ChainFinalityTag, ChainSlug, FinalityState, Superchains } from '../config/types'
import { Network } from './types'
import { chains } from '../metadata'

const SuperchainFinalityTags: Record<Superchains, ChainFinalityTag> = {
  [ChainSlug.optimism]: {
    latest: FinalityState.Latest,
    safe: FinalityState.Finalized,
    finalized: FinalityState.Finalized
  },
  [ChainSlug.arbitrum]: {
    latest: FinalityState.Latest,
    safe: FinalityState.Safe,
    finalized: FinalityState.Finalized
  }
}

export const BaseChainData: { [key in ChainSlug]: Partial<Network> } = {
  ethereum: {
    name: chains.ethereum.name,
    image: chains.ethereum.image,
    finalityTags: {
      latest: FinalityState.Latest,
      safe: FinalityState.Safe,
      finalized: FinalityState.Safe
    }
  },
  gnosis: {
    name: chains.gnosis.name,
    image: chains.gnosis.image,
    finalityTags: {
      latest: FinalityState.Latest,
      safe: 12,
      finalized: FinalityState.Finalized
    }
  },
  polygon: {
    name: chains.polygon.name,
    image: chains.polygon.image,
    finalityTags: {
      latest: FinalityState.Latest,
      safe: 64,
      finalized: 256
    }
  },
  optimism: {
    name: chains.optimism.name,
    image: chains.optimism.image,
    finalityTags: SuperchainFinalityTags[ChainSlug.optimism]
  },
  arbitrum: {
    name: chains.arbitrum.name,
    image: chains.arbitrum.image,
    finalityTags: SuperchainFinalityTags[ChainSlug.arbitrum]
  },
  zksync: {
    name: chains.zksync.name,
    image: chains.zksync.image,
    finalityTags: {
      latest: FinalityState.Latest,
      safe: FinalityState.Safe,
      finalized: FinalityState.Finalized
    }
  },
  linea: {
    name: chains.linea.name,
    image: chains.linea.image,
    finalityTags: {
      latest: FinalityState.Latest,
      safe: FinalityState.Safe,
      finalized: FinalityState.Finalized
    }
  },
  scrollzk: {
    name: chains.scrollzk.name,
    image: chains.scrollzk.image,
    finalityTags: {
      latest: FinalityState.Latest,
      safe: FinalityState.Safe,
      finalized: FinalityState.Finalized
    }
  },
  nova: {
    name: chains.nova.name,
    image: chains.nova.image,
    finalityTags: SuperchainFinalityTags[ChainSlug.arbitrum]
  },
  base: {
    name: chains.base.name,
    image: chains.base.image,
    finalityTags: SuperchainFinalityTags[ChainSlug.optimism]
  },
  polygonzk: {
    name: chains.polygonzk.name,
    image: chains.polygonzk.image,
    finalityTags: {
      latest: FinalityState.Latest,
      safe: FinalityState.Safe,
      finalized: FinalityState.Finalized
    }
  }
}
