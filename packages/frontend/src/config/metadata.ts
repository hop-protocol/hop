import MainnetLogo from 'src/assets/logos/mainnet.svg'
import ArbitrumLogo from 'src/assets/logos/arbitrum.svg'
import OptimismLogo from 'src/assets/logos/optimism.svg'
import xDaiLogo from 'src/assets/logos/xdai.svg'
import MaticLogo from 'src/assets/logos/matic.svg'
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

export const metadata: Metadata = {
  tokens: {
    DAI: {
      symbol: 'DAI',
      name: 'DAI Stablecoin',
      decimals: 18,
      image: DaiLogo
    },
    ARB: {
      symbol: 'ARB',
      name: 'ARB Token',
      decimals: 18,
      image: ArbitrumLogo
    },
    sETH: {
      symbol: 'sETH',
      name: 'Synth ETH',
      decimals: 18,
      image: SynthEthLogo
    },
    sBTC: {
      symbol: 'sBTC',
      name: 'Synth BTC',
      decimals: 18,
      image: SynthBtcLogo
    },
    USDC: {
      symbol: 'USDC',
      name: 'USDC',
      decimals: 18,
      image: UsdcLogo
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 18,
      image: wBtcLogo
    }
  },
  networks: {
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
    matic: {
      name: 'Matic',
      isLayer1: false,
      image: MaticLogo
    }
  }
}
