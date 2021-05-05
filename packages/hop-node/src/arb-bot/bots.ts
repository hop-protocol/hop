import '../moduleAlias'
import ArbBot from './ArbBot'
import wallets from 'src/wallets'
import contracts from 'src/contracts'
import { config } from 'src/config'
import { Chain } from 'src/constants'

const tokenSymbols = Object.keys(config.tokens)
const networks = [Chain.Arbitrum, Chain.Optimism, Chain.xDai, Chain.Polygon]

export type Config = {
  minThreshold: number
  maxTradeAmount: number
}

export default {
  start: (_config: Config) => {
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
          tokenDecimals: (config.metadata.tokens[config.network] as any)[token]
            .decimals,
          wallet: wallets.get(network),
          minThreshold: _config.minThreshold || 1.01,
          maxTradeAmount: _config.maxTradeAmount || 100000
        })

        bots.push(bot)
      }
    }

    bots.forEach(bot => bot.start())
  }
}
