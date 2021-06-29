import { Tokens } from './types'
import {
  ARBImage,
  DAIImage,
  sBTCImage,
  sETHImage,
  USDCImage,
  WBTCImage
} from './assets'

export const tokens: Tokens = {
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
    name: 'USDC',
    decimals: 6,
    image: USDCImage
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    decimals: 18,
    image: WBTCImage
  }
}
