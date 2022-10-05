import {
  ARBImage,
  DAIImage,
  ETHImage,
  HOPImage,
  MATICImage,
  OPImage,
  SNXImage,
  USDCImage,
  USDTImage,
  WBTCImage,
  XDAIImage,
  sBTCImage,
  sETHImage,
  sUSDImage
} from './assets'
import { Tokens } from './types'

export const tokens: Tokens = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    image: ETHImage
  },
  XDAI: {
    symbol: 'XDAI',
    name: 'XDAI',
    decimals: 18,
    image: XDAIImage
  },
  MATIC: {
    symbol: 'MATIC',
    name: 'Matic',
    decimals: 18,
    image: MATICImage
  },
  DAI: {
    symbol: 'DAI',
    name: 'DAI Stablecoin',
    decimals: 18,
    image: DAIImage
  },
  ARB: {
    symbol: 'ARB',
    name: 'ARB Token',
    decimals: 18,
    image: ARBImage
  },
  sETH: {
    symbol: 'sETH',
    name: 'Synth ETH',
    decimals: 18,
    image: sETHImage
  },
  sBTC: {
    symbol: 'sBTC',
    name: 'Synth BTC',
    decimals: 18,
    image: sBTCImage
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    image: USDCImage
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    image: USDTImage
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    decimals: 8,
    image: WBTCImage
  },
  HOP: {
    symbol: 'HOP',
    name: 'Hop',
    decimals: 18,
    image: HOPImage
  },
  OP: {
    symbol: 'OP',
    name: 'Optimism',
    decimals: 18,
    image: OPImage
  },
  SNX: {
    symbol: 'SNX',
    name: 'Synthetix Network Token',
    decimals: 18,
    image: SNXImage
  },
  sUSD: {
    symbol: 'sUSD',
    name: 'Synth sUSD',
    decimals: 18,
    image: sUSDImage
  }
}
