import * as assets from './assets/index.js'
import { TokenSymbol, type Tokens } from './types.js'

export const tokens: Tokens = {
  ETH: {
    symbol: TokenSymbol.ETH,
    name: 'Ethereum',
    decimals: 18,
    image: assets.ETHImage,
    coingeckoId: 'ethereum',
    isStablecoin: false
  },
  XDAI: {
    symbol: TokenSymbol.XDAI,
    name: 'XDAI',
    decimals: 18,
    image: assets.XDAIImage,
    coingeckoId: 'dai',
    isStablecoin: true
  },
  MATIC: {
    symbol: TokenSymbol.MATIC,
    name: 'Matic',
    decimals: 18,
    image: assets.MATICImage,
    coingeckoId: 'matic-network',
    isStablecoin: false
  },
  DAI: {
    symbol: TokenSymbol.DAI,
    name: 'DAI Stablecoin',
    decimals: 18,
    image: assets.DAIImage,
    coingeckoId: 'dai',
    isStablecoin: true
  },
  ARB: {
    symbol: TokenSymbol.ARB,
    name: 'Arbitrum',
    decimals: 18,
    image: assets.ARBmage,
    coingeckoId: 'arbitrum',
    isStablecoin: false
  },
  USDC: {
    symbol: TokenSymbol.USDC,
    name: 'USD Coin',
    decimals: 6,
    image: assets.USDCImage,
    coingeckoId: 'usd-coin',
    isStablecoin: true
  },
  'USDC.e': {
    symbol: TokenSymbol['USDC.e'],
    name: 'USD Coin Bridged',
    decimals: 6,
    image: assets.USDCImage,
    coingeckoId: 'usd-coin',
    isStablecoin: true
  },
  USDT: {
    symbol: TokenSymbol.USDT,
    name: 'Tether USD',
    decimals: 6,
    image: assets.USDTImage,
    coingeckoId: 'tether',
    isStablecoin: true
  },
  WBTC: {
    symbol: TokenSymbol.WBTC,
    name: 'Wrapped BTC',
    decimals: 8,
    image: assets.WBTCImage,
    coingeckoId: 'wrapped-bitcoin',
    isStablecoin: false
  },
  HOP: {
    symbol: TokenSymbol.HOP,
    name: 'Hop',
    decimals: 18,
    image: assets.HOPImage,
    coingeckoId: 'hop-protocol',
    isStablecoin: false
  },
  OP: {
    symbol: TokenSymbol.OP,
    name: 'Optimism',
    decimals: 18,
    image: assets.OPImage,
    coingeckoId: 'optimism',
    isStablecoin: false
  },
  SNX: {
    symbol: TokenSymbol.SNX,
    name: 'Synthetix Network Token',
    decimals: 18,
    image: assets.SNXImage,
    coingeckoId: 'havven',
    isStablecoin: false
  },
  sUSD: {
    symbol: TokenSymbol.sUSD,
    name: 'Synth sUSD',
    decimals: 18,
    image: assets.sUSDImage,
    coingeckoId: 'nusd',
    isStablecoin: true
  },
  GNO: {
    symbol: TokenSymbol.GNO,
    name: 'Gnosis',
    decimals: 18,
    image: assets.GNOImage,
    coingeckoId: 'gnosis',
    isStablecoin: false
  },
  rETH: {
    symbol: TokenSymbol.rETH,
    name: 'Rocket Pool ETH',
    decimals: 18,
    image: assets.rETHImage,
    coingeckoId: 'rocket-pool-eth',
    isStablecoin: false
  },
  UNI: {
    symbol: TokenSymbol.UNI,
    name: 'Uniswap',
    decimals: 18,
    image: assets.UNIImage,
    coingeckoId: 'uniswap',
    isStablecoin: false
  },
  RPL: {
    symbol: TokenSymbol.RPL,
    name: 'Rocket Pool Protocol',
    decimals: 18,
    image: assets.RPLImage,
    coingeckoId: 'rocket-pool',
    isStablecoin: false
  },
  MAGIC: {
    symbol: TokenSymbol.MAGIC,
    name: 'MAGIC',
    decimals: 18,
    image: assets.MAGICImage,
    coingeckoId: 'magic',
    isStablecoin: false
  },
  WETH: {
    symbol: TokenSymbol.WETH,
    name: 'Wrapped Ether',
    decimals: 18,
    image: assets.ETHImage,
    coingeckoId: 'weth',
    isStablecoin: false
  }
}
