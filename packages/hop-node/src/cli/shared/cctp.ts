import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { Message } from '#cctp/cctp/Message.js'
import { config as globalConfig } from '#config/index.js'
import { wait } from '#utils/wait.js'

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
  const chainIds: string[] = chains.map(chainSlug => getChain(globalConfig.network as NetworkSlug, chainSlug).chainId)

  try {
    const messageManager = new Message(chainIds)
    await messageManager.start()
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

