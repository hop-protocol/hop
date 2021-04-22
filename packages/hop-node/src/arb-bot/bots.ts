import '../moduleAlias'
import ArbBot from './ArbBot'
import wallets from 'src/wallets'
import contracts from 'src/contracts'
import { config } from 'src/config'
import { ETHEREUM, OPTIMISM, ARBITRUM, XDAI } from 'src/constants'

const tokenSymbols = Object.keys(config.tokens)
const networks = [ARBITRUM, OPTIMISM, XDAI]

export type Config = {
  minThreshold: number
  maxTradeAmount: number
}

export default {
  start: (config: Config) => {
    const bots: ArbBot[] = []
    for (let network of networks) {
      for (let token of tokenSymbols) {
        if (!contracts.has(token, network)) {
          continue
        }

        const tokenContracts = contracts.get(token, network)
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
          amm: {
            saddleSwap: {
              contract: tokenContracts.saddleSwap
            }
          },
          wallet: wallets.get(network),
          minThreshold: config.minThreshold || 1.01,
          maxTradeAmount: config.maxTradeAmount || 100000
        })

        bots.push(bot)
      }
    }

    bots.forEach(bot => bot.start())
  }
}
