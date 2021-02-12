import '../moduleAlias'
import L2ArbitrumWallet from 'src/wallets/L2ArbitrumWallet'
import L2OptimismWallet from 'src/wallets/L2OptimismWallet'
import ArbBot from './ArbBot'
import { tokens } from 'src/config'

const tokenSymbols = Object.keys(tokens)
const networks = ['arbitrum', 'optimism']

const wallets = {
  arbitrum: L2ArbitrumWallet,
  optimism: L2OptimismWallet
}

const bots: ArbBot[] = []
for (let network of networks) {
  for (let token of tokenSymbols) {
    if (!tokens[token][network]) {
      continue
    }
    const bot = new ArbBot({
      token0: {
        label: `${network} hop${token}`,
        address: tokens[token][network].l2Bridge
      },
      token1: {
        label: `${network} canonical${token}`,
        address: tokens[token][network].l2CanonicalToken
      },
      uniswap: {
        router: {
          address: tokens[token][network].uniswapRouter
        },
        factory: {
          address: tokens[token][network].uniswapFactory
        }
      },
      wallet: wallets[network],
      minThreshold: 1.01,
      arbitrageAmount: 10
    })

    bots.push(bot)
  }
}

export default {
  start: () => {
    bots.forEach(bot => bot.start())
  }
}
