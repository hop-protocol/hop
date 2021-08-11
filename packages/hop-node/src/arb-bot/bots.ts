import '../moduleAlias'
import ArbBot from './ArbBot'
import contracts from 'src/contracts'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { config as globalConfig } from 'src/config'

const tokenSymbols = Object.keys(globalConfig.tokens)
const networks = [Chain.Arbitrum, Chain.Optimism, Chain.xDai, Chain.Polygon]

export type Config = {
  minThreshold: number
  maxTradeAmount: number
}

export default {
  start: (config: Config) => {
    const bots: ArbBot[] = []
    for (const network of networks) {
      for (const token of tokenSymbols) {
        if (!contracts.has(token, network)) {
          continue
        }

        const tokenContracts = contracts.get(token, network)
        const bot = new ArbBot({
          network,
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
          tokenDecimals: globalConfig.metadata.tokens[token]
            .decimals,
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
