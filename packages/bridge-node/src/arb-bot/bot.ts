import '../moduleAlias'
import L2ArbitrumWallet from 'src/wallets/L2ArbitrumWallet'
import L2OptimismWallet from 'src/wallets/L2OptimismWallet'
import {
  L2ArbitrumBridgeAddress,
  L2ArbitrumTokenAddress,
  L2ArbitrumUniswapRouter,
  L2ArbitrumUniswapFactory,
  L2OptimismBridgeAddress,
  L2OptimismTokenAddress,
  L2OptimismUniswapRouter,
  L2OptimismUniswapFactory
} from 'src/config'
import ArbBot from './ArbBot'

const arbitrumBot = new ArbBot({
  token0: {
    label: 'arbitrum hopDai',
    address: L2ArbitrumBridgeAddress
  },
  token1: {
    label: 'arbitrum canonicalDAI',
    address: L2ArbitrumTokenAddress
  },
  uniswap: {
    router: {
      address: L2ArbitrumUniswapRouter
    },
    factory: {
      address: L2ArbitrumUniswapFactory
    }
  },
  wallet: L2ArbitrumWallet,
  minThreshold: 1.01,
  arbitrageAmount: 10
})

const optimismBot = new ArbBot({
  token0: {
    label: 'optimism hopDai',
    address: L2OptimismBridgeAddress
  },
  token1: {
    label: 'optimism canonicalDAI',
    address: L2OptimismTokenAddress
  },
  uniswap: {
    router: {
      address: L2OptimismUniswapRouter
    },
    factory: {
      address: L2OptimismUniswapFactory
    }
  },
  wallet: L2OptimismWallet,
  minThreshold: 1.01,
  arbitrageAmount: 10
})

export { arbitrumBot, optimismBot }
