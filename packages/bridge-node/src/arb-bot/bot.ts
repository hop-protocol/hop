import '../moduleAlias'
import L2ArbitrumWallet from 'src/wallets/L2ArbitrumWallet'
import {
  L2ArbitrumBridgeAddress,
  L2ArbitrumTokenAddress,
  L2ArbitrumUniswapRouter,
  L2ArbitrumUniswapFactory
} from 'src/config'
import ArbBot from './ArbBot'

const bot = new ArbBot({
  token0: {
    label: 'canonicalDAI',
    address: L2ArbitrumBridgeAddress
  },
  token1: {
    label: 'hopDAI',
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

export default bot
