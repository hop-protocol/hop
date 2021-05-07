import deepmerge from 'deepmerge'
import * as hopMetadata from '@hop-protocol/metadata'
import MainnetLogo from 'src/assets/logos/mainnet.svg'
import ArbitrumLogo from 'src/assets/logos/arbitrum.svg'
import OptimismLogo from 'src/assets/logos/optimism.svg'
import xDaiLogo from 'src/assets/logos/xdai.svg'
import PolygonLogo from 'src/assets/logos/polygon.svg'
import DaiLogo from 'src/assets/logos/dai.svg'
import SynthEthLogo from 'src/assets/logos/seth.svg'
import SynthBtcLogo from 'src/assets/logos/sbtc.svg'
import UsdcLogo from 'src/assets/logos/usdc.svg'
import wBtcLogo from 'src/assets/logos/wbtc.svg'

type Metadata = {
  tokens: {
    [key: string]: {
      symbol: string
      name: string
      decimals: number
      image: any
    }
  }
  networks: {
    [key: string]: {
      name: string
      isLayer1: boolean
      image: any
    }
  }
}

const images = {
  DAI: DaiLogo,
  ARB: ArbitrumLogo,
  sETH: SynthEthLogo,
  sBTC: SynthBtcLogo,
  USDC: UsdcLogo,
  WBTC: wBtcLogo
}

const network = process.env.REACT_APP_NETWORK || 'kovan'
const tokens = Object.keys(images).reduce((obj, token) => {
  obj[token] = deepmerge(hopMetadata[network].tokens[token], {
    image: images[token]
  })
  return obj
}, {})

export const metadata: Metadata = {
  tokens,
  networks: {
    ethereum: {
      name: 'Ethereum',
      isLayer1: true,
      image: MainnetLogo
    },
    kovan: {
      name: 'Kovan',
      isLayer1: true,
      image: MainnetLogo
    },
    goerli: {
      name: 'Goerli',
      isLayer1: true,
      image: MainnetLogo
    },
    mainnet: {
      name: 'Mainnet',
      isLayer1: true,
      image: MainnetLogo
    },
    arbitrum: {
      name: 'Arbitrum',
      isLayer1: false,
      image: ArbitrumLogo
    },
    optimism: {
      name: 'Optimism',
      isLayer1: false,
      image: OptimismLogo
    },
    xdai: {
      name: 'xDai',
      isLayer1: false,
      image: xDaiLogo
    },
    polygon: {
      name: 'Polygon',
      isLayer1: false,
      image: PolygonLogo
    }
  }
}
