import { ChainSlug, NetworkSlug } from '@hop-protocol/sdk'
import { MessageManager } from '#cctp/cctp/MessageManager.js'
import { config as globalConfig } from '#config/index.js'
import { wait } from '@hop-protocol/hop-node-core'

// TODO: Automate
const CHAINS: Partial<Record<NetworkSlug, ChainSlug[]>> = {
  [NetworkSlug.Mainnet]: [
    ChainSlug.Ethereum,
    ChainSlug.Optimism,
    ChainSlug.Arbitrum,
    ChainSlug.Base,
    ChainSlug.Polygon
  ],
  [NetworkSlug.Sepolia]: [
    ChainSlug.Ethereum,
    ChainSlug.Optimism,
    ChainSlug.Arbitrum,
    ChainSlug.Base
  ]
}
export async function main () {
  const chains: ChainSlug[] = CHAINS[globalConfig.network as NetworkSlug]!
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

