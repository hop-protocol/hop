import * as assets from './assets/index.js'
import { TokenConfig } from './types.js'

export const tokenConfigs: Record<string, TokenConfig> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    image: assets.ETHImage,
    coingeckoId: 'ethereum',
    isStableCoin: false,
    addresses: {
      '11155111': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      '11155420': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      '84532': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    }
  },
  XDAI: {
    symbol: 'XDAI',
    name: 'XDAI',
    decimals: 18,
    image: assets.XDAIImage,
    coingeckoId: 'dai',
    isStableCoin: true,
    addresses: {}
  },
  MATIC: {
    symbol: 'MATIC',
    name: 'Matic',
    decimals: 18,
    image: assets.MATICImage,
    coingeckoId: 'matic-network',
    isStableCoin: false,
    addresses: {}
  },
  DAI: {
    symbol: 'DAI',
    name: 'DAI Stablecoin',
    decimals: 18,
    image: assets.DAIImage,
    coingeckoId: 'dai',
    isStableCoin: true,
    addresses: {}
  },
  ARB: {
    symbol: 'ARB',
    name: 'Arbitrum',
    decimals: 18,
    image: assets.ARBmage,
    coingeckoId: 'arbitrum',
    isStableCoin: false,
    addresses: {}
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    image: assets.USDCImage,
    coingeckoId: 'usd-coin',
    isStableCoin: true,
    addresses: {
      '11155111': '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      '11155420': '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
      '84532': '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    }
  },
  'USDC.e': {
    symbol: 'USDC.e',
    name: 'USD Coin Bridged',
    decimals: 6,
    image: assets.USDCImage,
    coingeckoId: 'usd-coin',
    isStableCoin: true,
    addresses: {}
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    image: assets.USDTImage,
    coingeckoId: 'tether',
    isStableCoin: true,
    addresses: {}
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    decimals: 8,
    image: assets.WBTCImage,
    coingeckoId: 'wrapped-bitcoin',
    isStableCoin: false,
    addresses: {}
  },
  HOP: {
    symbol: 'HOP',
    name: 'Hop',
    decimals: 18,
    image: assets.HOPImage,
    coingeckoId: 'hop-protocol',
    isStableCoin: false,
    addresses: {}
  },
  OP: {
    symbol: 'OP',
    name: 'Optimism',
    decimals: 18,
    image: assets.OPImage,
    coingeckoId: 'optimism',
    isStableCoin: false,
    addresses: {}
  },
  SNX: {
    symbol: 'SNX',
    name: 'Synthetix Network Token',
    decimals: 18,
    image: assets.SNXImage,
    coingeckoId: 'havven',
    isStableCoin: false,
    addresses: {}
  },
  sUSD: {
    symbol: 'sUSD',
    name: 'Synth sUSD',
    decimals: 18,
    image: assets.sUSDImage,
    coingeckoId: 'nusd',
    isStableCoin: true,
    addresses: {}
  },
  GNO: {
    symbol: 'GNO',
    name: 'Gnosis',
    decimals: 18,
    image: assets.GNOImage,
    coingeckoId: 'gnosis',
    isStableCoin: false,
    addresses: {}
  },
  rETH: {
    symbol: 'rETH',
    name: 'Rocket Pool ETH',
    decimals: 18,
    image: assets.rETHImage,
    coingeckoId: 'rocket-pool-eth',
    isStableCoin: false,
    addresses: {}
  },
  UNI: {
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    image: assets.UNIImage,
    coingeckoId: 'uniswap',
    isStableCoin: false,
    addresses: {}
  },
  RPL: {
    symbol: 'RPL',
    name: 'Rocket Pool Protocol',
    decimals: 18,
    image: assets.RPLImage,
    coingeckoId: 'rocket-pool',
    isStableCoin: false,
    addresses: {}
  },
  MAGIC: {
    symbol: 'MAGIC',
    name: 'MAGIC',
    decimals: 18,
    image: assets.MAGICImage,
    coingeckoId: 'magic',
    isStableCoin: false,
    addresses: {}
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    image: assets.ETHImage,
    coingeckoId: 'weth',
    isStableCoin: false,
    addresses: {}
  },
  MOCK: {
    symbol: 'MOCK',
    name: 'Mock',
    decimals: 18,
    image: assets.ETHImage,
    coingeckoId: 'mock',
    isStableCoin: false,
    addresses: {
      '11155111': '0x486910D137fA39e6B7b106a13C305F13e8219624',
      '11155420': '0x486910D137fA39e6B7b106a13C305F13e8219624',
      '84532': '0x486910D137fA39e6B7b106a13C305F13e8219624'
    }
  }
}
