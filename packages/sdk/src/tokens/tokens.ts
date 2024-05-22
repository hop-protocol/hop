import * as assets from './assets/index.js'
import { TokenSymbol, type Tokens } from './types.js'

export const tokens: Tokens = {
  ETH: {
    symbol: TokenSymbol.ETH,
    name: 'Ethereum',
    decimals: 18,
    image: assets.ETHImage,
    coingeckoId: 'ethereum',
    isStableCoin: false
  },
  XDAI: {
    symbol: TokenSymbol.XDAI,
    name: 'XDAI',
    decimals: 18,
    image: assets.XDAIImage,
    coingeckoId: 'dai',
    isStableCoin: true
  },
  MATIC: {
    symbol: TokenSymbol.MATIC,
    name: 'Matic',
    decimals: 18,
    image: assets.MATICImage,
    coingeckoId: 'matic-network',
    isStableCoin: false
  },
  DAI: {
    symbol: TokenSymbol.DAI,
    name: 'DAI Stablecoin',
    decimals: 18,
    image: assets.DAIImage,
    coingeckoId: 'dai',
    isStableCoin: true
  },
  ARB: {
    symbol: TokenSymbol.ARB,
    name: 'Arbitrum',
    decimals: 18,
    image: assets.ARBmage,
    coingeckoId: 'arbitrum',
    isStableCoin: false
  },
  USDC: {
    symbol: TokenSymbol.USDC,
    name: 'USD Coin',
    decimals: 6,
    image: assets.USDCImage,
    coingeckoId: 'usd-coin',
    isStableCoin: true
  },
  'USDC.e': {
    symbol: TokenSymbol['USDC.e'],
    name: 'USD Coin Bridged',
    decimals: 6,
    image: assets.USDCImage,
    coingeckoId: 'usd-coin',
    isStableCoin: true
  },
  USDT: {
    symbol: TokenSymbol.USDT,
    name: 'Tether USD',
    decimals: 6,
    image: assets.USDTImage,
    coingeckoId: 'tether',
    isStableCoin: true
  },
  WBTC: {
    symbol: TokenSymbol.WBTC,
    name: 'Wrapped BTC',
    decimals: 8,
    image: assets.WBTCImage,
    coingeckoId: 'wrapped-bitcoin',
    isStableCoin: false
  },
  HOP: {
    symbol: TokenSymbol.HOP,
    name: 'Hop',
    decimals: 18,
    image: assets.HOPImage,
    coingeckoId: 'hop-protocol',
    isStableCoin: false
  },
  OP: {
    symbol: TokenSymbol.OP,
    name: 'Optimism',
    decimals: 18,
    image: assets.OPImage,
    coingeckoId: 'optimism',
    isStableCoin: false
  },
  SNX: {
    symbol: TokenSymbol.SNX,
    name: 'Synthetix Network Token',
    decimals: 18,
    image: assets.SNXImage,
    coingeckoId: 'havven',
    isStableCoin: false
  },
  sUSD: {
    symbol: TokenSymbol.sUSD,
    name: 'Synth sUSD',
    decimals: 18,
    image: assets.sUSDImage,
    coingeckoId: 'nusd',
    isStableCoin: true
  },
  GNO: {
    symbol: TokenSymbol.GNO,
    name: 'Gnosis',
    decimals: 18,
    image: assets.GNOImage,
    coingeckoId: 'gnosis',
    isStableCoin: false
  },
  rETH: {
    symbol: TokenSymbol.rETH,
    name: 'Rocket Pool ETH',
    decimals: 18,
    image: assets.rETHImage,
    coingeckoId: 'rocket-pool-eth',
    isStableCoin: false
  },
  UNI: {
    symbol: TokenSymbol.UNI,
    name: 'Uniswap',
    decimals: 18,
    image: assets.UNIImage,
    coingeckoId: 'uniswap',
    isStableCoin: false
  },
  RPL: {
    symbol: TokenSymbol.RPL,
    name: 'Rocket Pool Protocol',
    decimals: 18,
    image: assets.RPLImage,
    coingeckoId: 'rocket-pool',
    isStableCoin: false
  },
  MAGIC: {
    symbol: TokenSymbol.MAGIC,
    name: 'MAGIC',
    decimals: 18,
    image: assets.MAGICImage,
    coingeckoId: 'magic',
    isStableCoin: false
  },
  WETH: {
    symbol: TokenSymbol.WETH,
    name: 'Wrapped Ether',
    decimals: 18,
    image: assets.ETHImage,
    coingeckoId: 'weth',
    isStableCoin: false
  }
}
