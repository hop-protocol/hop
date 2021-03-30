import '../moduleAlias'
import ArbBot from './ArbBot'
import { wallets } from 'src/wallets'
import { contracts } from 'src/contracts'

const tokenSymbols = Object.keys(contracts)
const networks = ['arbitrum', 'optimism', 'xdai']

export type Config = {
  minThreshold: number
  maxTradeAmount: number
}

export default {
  start: (config: Config) => {
    const bots: ArbBot[] = []
    for (let network of networks) {
      for (let token of tokenSymbols) {
        if (!contracts[token]) {
          continue
        }
        if (!contracts[token][network]) {
          continue
        }

        const tokenContracts = contracts[token][network]
        const bot = new ArbBot({
          label: `${network}.${token}`,
          token0: {
            label: `${network}.hop-${token}`,
            contract: tokenContracts.l2HopBridgeToken
          },
          token1: {
            label: `${network}.canonical-${token}`,
            contract: tokenContracts.l2CanonicalToken
          },
          uniswap: {
            router: {
              contract: tokenContracts.uniswapRouter
            },
            factory: {
              contract: tokenContracts.uniswapFactory
            },
            exchange: {
              contract: tokenContracts.uniswapExchange
            }
          },
          wallet: wallets[network],
          minThreshold: config.minThreshold || 1.01,
          maxTradeAmount: config.maxTradeAmount || 100000
        })

        bots.push(bot)
      }
    }

    bots.forEach(bot => bot.start())
  }
}
