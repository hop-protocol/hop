import { program as relayCCTPProgram } from './relay.js'
import { program as unrelayedCCTPMessages } from './unrelayedCCTPMessages.js'
import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { CCTP } from '#clients/index.js'
import { SignerConfig } from '#config/index.js'
import { wait } from '#utils/wait.js'
import { Logger } from '#logger/index.js'
import { Command } from 'commander'
import { CCTP_ART } from './../../constants.js'
import { getHelpTextBefore } from './../../utils.js'

export const program = new Command()

program
  .name('cctp')
  .description('Run CCTP commands')
  .addHelpText('before', getHelpTextBefore(CCTP_ART))
  .addCommand(relayCCTPProgram)
  .addCommand(unrelayedCCTPMessages)
  .action(run)

  // TODO: V2: Automate
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

async function run (options: any): Promise<never> {
  const logger = new Logger(program.name())
  parseArt(CCTP_ART)

  const network: NetworkSlug = SignerConfig.network
  const chains: ChainSlug[] = CHAINS[network]!
  const chainIds: string[] = chains.map(chainSlug => getChain(network, chainSlug).chainId)

  try {
    const messageManager = new CCTP.CCTP(chainIds)
    await messageManager.start()
    logger.debug('CCTP Manager started')

    // TODO: V2: Better way to run
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      await wait (60_000)
    }
  } catch (err: any) {
    logger.error(err)
    throw new Error(`CCTP CLI error: ${err.message}`)
  }
}
