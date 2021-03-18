import MainnetLogo from 'src/assets/logos/mainnet.svg'
import ArbitrumLogo from 'src/assets/logos/arbitrum.svg'
import OptimismLogo from 'src/assets/logos/optimism.svg'
import xDaiLogo from 'src/assets/logos/xdai.svg'
import MaticLogo from 'src/assets/logos/matic.svg'

type Metadata = {
  tokens: {
    [key: string]: {
      symbol: string
      name: string
      decimals: number
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
      decimals: 18
    },
    ARB: {
      symbol: 'ARB',
      name: 'ARB Token',
      decimals: 18
    },
    sETH: {
      symbol: 'sETH',
      name: 'Synth ETH',
      decimals: 18
    },
    sBTC: {
      symbol: 'sBTC',
      name: 'Synth BTC',
      decimals: 18
    }
  },
  networks: {
    kovan: {
      name: 'Kovan',
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
