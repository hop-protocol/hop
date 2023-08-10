import {
  ARBmage,
  DAIImage,
  ETHImage,
  GNOImage,
  HOPImage,
  MAGICImage,
  MATICImage,
  OPImage,
  RPLImage,
  SNXImage,
  UNIImage,
  USDCImage,
  USDTImage,
  WBTCImage,
  XDAIImage,
  rETHImage,
  sUSDImage
  // FraxImage,
  // sBTCImage,
  // sETHImage,
} from './assets'
import { Tokens } from './types'

export const tokens: Tokens = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    image: ETHImage,
    coingeckoId: 'ethereum'
  },
  XDAI: {
    symbol: 'XDAI',
    name: 'XDAI',
    decimals: 18,
    image: XDAIImage,
    coingeckoId: 'dai'
  },
  MATIC: {
    symbol: 'MATIC',
    name: 'Matic',
    decimals: 18,
    image: MATICImage,
    coingeckoId: 'matic-network'
  },
  DAI: {
    symbol: 'DAI',
    name: 'DAI Stablecoin',
    decimals: 18,
    image: DAIImage,
    coingeckoId: 'dai'
  },
  ARB: {
    symbol: 'ARB',
    name: 'Arbitrum',
    decimals: 18,
    image: ARBmage,
    coingeckoId: 'arbitrum'
  },
  /*
  sETH: {
    symbol: 'sETH',
    name: 'Synth ETH',
    decimals: 18,
    image: sETHImage,
    coingeckoId: 'seth'
  },
  sBTC: {
    symbol: 'sBTC',
    name: 'Synth BTC',
    decimals: 18,
    image: sBTCImage,
    coingeckoId: 'sbtc'
  },
  */
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    image: USDCImage,
    coingeckoId: 'usd-coin'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    image: USDTImage,
    coingeckoId: 'tether'
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    decimals: 8,
    image: WBTCImage,
    coingeckoId: 'wrapped-bitcoin'
  },
  HOP: {
    symbol: 'HOP',
    name: 'Hop',
    decimals: 18,
    image: HOPImage,
    coingeckoId: 'hop-protocol'
  },
  OP: {
    symbol: 'OP',
    name: 'Optimism',
    decimals: 18,
    image: OPImage,
    coingeckoId: 'optimism'
  },
  SNX: {
    symbol: 'SNX',
    name: 'Synthetix Network Token',
    decimals: 18,
    image: SNXImage,
    coingeckoId: 'havven'
  },
  sUSD: {
    symbol: 'sUSD',
    name: 'Synth sUSD',
    decimals: 18,
    image: sUSDImage,
    coingeckoId: 'nusd'
  },
  GNO: {
    symbol: 'GNO',
    name: 'Gnosis',
    decimals: 18,
    image: GNOImage,
    coingeckoId: 'gnosis'
  },
  rETH: {
    symbol: 'rETH',
    name: 'Rocket Pool ETH',
    decimals: 18,
    image: rETHImage,
    coingeckoId: 'rocket-pool-eth'
  },
  UNI: {
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    image: UNIImage,
    coingeckoId: 'uniswap'
  },
  RPL: {
    symbol: 'RPL',
    name: 'Rocket Pool Protocol',
    decimals: 18,
    image: RPLImage,
    coingeckoId: 'rocket-pool'
  },
  MAGIC: {
    symbol: 'MAGIC',
    name: 'MAGIC',
    decimals: 18,
    image: MAGICImage,
    coingeckoId: 'magic'
  }
  /*
  FRAX: {
    symbol: 'FRAX',
    name: 'Frax',
    decimals: 18,
    image: FraxImage,
    coingeckoId: 'frax'
  }
  */
}
