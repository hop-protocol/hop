import deepmerge from 'deepmerge'
import * as hopMetadata from '@hop-protocol/core/metadata'
import MainnetLogo from 'src/assets/logos/mainnet.svg'
import ArbitrumLogo from 'src/assets/logos/arbitrum.svg'
import OptimismLogo from 'src/assets/logos/optimism.svg'
import GnosisLogo from 'src/assets/logos/gnosis.svg'
import PolygonLogo from 'src/assets/logos/polygon.svg'
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

const { tokens } = hopMetadata[hopAppNetwork]

export const metadata: Metadata = {
  tokens,
  networks: {
    ethereum: {
      name: 'Ethereum',
      isLayer1: true,
      image: MainnetLogo,
      nativeTokenSymbol: 'ETH',
    },
    kovan: {
      name: 'Kovan',
      isLayer1: true,
      image: MainnetLogo,
      nativeTokenSymbol: 'ETH',
    },
    goerli: {
      name: 'Goerli',
      isLayer1: true,
      image: MainnetLogo,
      nativeTokenSymbol: 'ETH',
    },
    mainnet: {
      name: 'Mainnet',
      isLayer1: true,
      image: MainnetLogo,
      nativeTokenSymbol: 'ETH',
    },
    arbitrum: {
      name: 'Arbitrum',
      isLayer1: false,
      image: ArbitrumLogo,
      nativeTokenSymbol: 'ETH',
    },
    optimism: {
      name: 'Optimism',
      isLayer1: false,
      image: OptimismLogo,
      nativeTokenSymbol: 'ETH',
    },
    gnosis: {
      name: 'Gnosis',
      isLayer1: false,
      image: GnosisLogo,
      nativeTokenSymbol: 'xDAI',
    },
    polygon: {
      name: 'Polygon',
      isLayer1: false,
      image: PolygonLogo,
      nativeTokenSymbol: 'MATIC',
    },
  },
}
