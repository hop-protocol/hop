import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { CCTP } from '#implementations/index.js'
import { SignerConfig } from '#config/index.js'
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
  const network: NetworkSlug = SignerConfig.network
  const chains: ChainSlug[] = CHAINS[network]!
  const chainIds: string[] = chains.map(chainSlug => getChain(network, chainSlug).chainId)

  try {
    const messageManager = new CCTP.CCTP(chainIds)
    await messageManager.start()
    // TODO: V2: Add logger
    console.log('CCTP Manager started')

    // TODO: V2: Better way to run
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      await wait (60_000)
    }
  } catch (err: any) {
    console.trace(err)
    throw new Error(`CCTP CLI error: ${err.message}`)
  }
}

