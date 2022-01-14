import deepmerge from 'deepmerge'
import * as hopMetadata from '@hop-protocol/core/metadata'
import MainnetLogo from 'src/assets/logos/mainnet.svg'
import ArbitrumLogo from 'src/assets/logos/arbitrum.svg'
import OptimismLogo from 'src/assets/logos/optimism.svg'
import GnosisLogo from 'src/assets/logos/gnosis.svg'
import PolygonLogo from 'src/assets/logos/polygon.svg'
import DaiLogo from 'src/assets/logos/dai.svg'
import SynthEthLogo from 'src/assets/logos/seth.svg'
import SynthBtcLogo from 'src/assets/logos/sbtc.svg'
import UsdcLogo from 'src/assets/logos/usdc.svg'
import usdtLogo from 'src/assets/logos/usdt.svg'
import wBtcLogo from 'src/assets/logos/wbtc.svg'
import ethLogo from 'src/assets/logos/eth.svg'
import maticLogo from 'src/assets/logos/matic.svg'
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

const images = {
  DAI: DaiLogo,
  ARB: ArbitrumLogo,
  sETH: SynthEthLogo,
  sBTC: SynthBtcLogo,
  USDC: UsdcLogo,
  USDT: usdtLogo,
  WBTC: wBtcLogo,
  ETH: ethLogo,
  MATIC: maticLogo,
}

const tokens = Object.keys(images).reduce((obj, token) => {
  obj[token] = deepmerge(hopMetadata[hopAppNetwork].tokens[token], {
    image: images[token],
  })
  return obj
}, {})

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
