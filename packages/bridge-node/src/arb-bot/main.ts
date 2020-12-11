import '../moduleAlias'
import L2ArbitrumWallet from 'src/wallets/L2ArbitrumWallet'
import {
  L2ArbitrumBridgeAddress,
  L2ArbitrumTokenAddress,
  L2ArbitrumUniswapRouter
} from 'src/config'
import ArbBot from './ArbBot'

async function main () {
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
      address: L2ArbitrumUniswapRouter
    },
    wallet: L2ArbitrumWallet,
    minThreshold: 1.01,
    arbitrageAmount: 10
  })

  await bot.start()
}

main()
