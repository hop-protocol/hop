import deepmerge from 'deepmerge'
import * as hopMetadata from '@hop-protocol/core/metadata'
import { TokenSymbol, Slug } from '@hop-protocol/sdk'
import { hopAppNetwork } from 'src/config'

type Metadata = {
  tokens: {
    [key in TokenSymbol | string]: {
      symbol: string
      name: string
      decimals: number
      image: any
      nativeTokenSymbol: string
    }
  }
  networks: {
    [key in Slug | string]: {
      name: string
      isLayer1: boolean
      image: any
      nativeTokenSymbol: string
    }
  }
}

const { tokens, chains } = hopMetadata[hopAppNetwork]

export const metadata: Metadata = {
  tokens,
  networks: {
    ethereum: {
      name: chains.ethereum.name,
      isLayer1: true,
      image: chains.ethereum.image,
      nativeTokenSymbol: chains.ethereum.nativeTokenSymbol,
    },
    goerli: {
      name: 'Goerli',
      isLayer1: true,
      image: chains.ethereum.image,
      nativeTokenSymbol: chains.ethereum.nativeTokenSymbol,
    },
    mainnet: {
      name: chains.ethereum.name,
      isLayer1: true,
      image: chains.ethereum.image,
      nativeTokenSymbol: chains.ethereum.nativeTokenSymbol,
    },
    arbitrum: {
      name: chains.arbitrum.name,
      isLayer1: false,
      image: chains.arbitrum.image,
      nativeTokenSymbol: chains.arbitrum.nativeTokenSymbol,
    },
    optimism: {
      name: chains.optimism.name,
      isLayer1: false,
      image: chains.optimism.image,
      nativeTokenSymbol: chains.optimism.nativeTokenSymbol,
    },
    gnosis: {
      name: chains.gnosis.name,
      isLayer1: false,
      image: chains.gnosis.image,
      nativeTokenSymbol: chains.gnosis.nativeTokenSymbol,
    },
    polygon: {
      name: chains.polygon.name,
      isLayer1: false,
      image: chains.polygon.image,
      nativeTokenSymbol: chains.polygon.nativeTokenSymbol,
    },
    nova: {
      name: chains.nova.name,
      isLayer1: false,
      image: chains.nova.image,
      nativeTokenSymbol: chains.nova.nativeTokenSymbol,
    },
    zksync: {
      name: chains.zksync.name,
      isLayer1: false,
      image: chains.zksync.image,
      nativeTokenSymbol: chains.zksync.nativeTokenSymbol,
    },
    linea: {
      name: chains.linea.name,
      isLayer1: false,
      image: chains.linea.image,
      nativeTokenSymbol: chains.linea.nativeTokenSymbol,
    },
    scrollzk: {
      name: chains.scrollzk.name,
      isLayer1: false,
      image: chains.scrollzk.image,
      nativeTokenSymbol: chains.scrollzk.nativeTokenSymbol,
    },
    base: {
      name: chains.base.name,
      isLayer1: false,
      image: chains.base.image,
      nativeTokenSymbol: chains.base.nativeTokenSymbol,
    },
    polygonzk: {
      name: chains.polygonzk.name,
      isLayer1: false,
      image: chains.polygonzk.image,
      nativeTokenSymbol: chains.polygonzk.nativeTokenSymbol,
    },
  },
}
