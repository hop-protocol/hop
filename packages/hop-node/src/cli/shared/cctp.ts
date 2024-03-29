import { Chain, Network } from '#constants/index.js'
import { MessageManager } from '#cctp/cctp/MessageManager.js'
import { config as globalConfig } from '#config/index.js'
import { wait } from '#utils/wait.js'

// TODO: Automate
const CHAINS: Partial<Record<Network, Chain[]>> = {
  [Network.Mainnet]: [
    Chain.Ethereum,
    Chain.Optimism,
    Chain.Arbitrum,
    Chain.Base,
    Chain.Polygon
  ],
  [Network.Sepolia]: [
    Chain.Ethereum,
    Chain.Optimism,
    Chain.Arbitrum,
    Chain.Base
  ]
}
export async function main () {
  const chains: Chain[] = CHAINS[globalConfig.network as Network]!
  try {
    const manager = new MessageManager(chains)
    manager.start()
    console.log('CCTP Manager started')

    // TODO: Better way to run
    while (true) {
      await wait (60_000)
    }
  } catch (err: any) {
    console.trace(err)
    throw new Error(`CCTP CLI error: ${err.message}`)
  }
}

