import '../moduleAlias'
import ArbBot from './ArbBot'
import { wallets } from 'src/wallets'
import { contracts } from 'src/contracts'

const tokenSymbols = Object.keys(contracts)
const networks = ['arbitrum', 'optimism', 'xdai']

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
      token0: {
        label: `${network} hop${token}`,
        contract: tokenContracts.l2HopBridgeToken
      },
      token1: {
        label: `${network} canonical${token}`,
        contract: tokenContracts.l2CanonicalToken
      },
      uniswap: {
        router: {
          contract: tokenContracts.l2UniswapRouter
        },
        factory: {
          contract: tokenContracts.l2UniswapFactory
        },
        exchange: {
          contract: tokenContracts.l2UniswapExchange
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
