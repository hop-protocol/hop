import { getChain } from '@hop-protocol/sdk'
import { wallets } from '#wallets/index.js'
import { CCTP } from '#clients/index.js'
import { Logger } from '#logger/index.js'
import { Command } from 'commander'

export const program = new Command()

program
  .name('relay-cctp')
  .description('Relay CCTP Messages')
  .action(run)

async function run (source: any) {
  const logger = new Logger(program.name())

  const unrelayedMessages = await CCTP.getUnrelayedMessages()
  if (unrelayedMessages.length === 0) {
    logger.debug('No unrelayed messages found')
    return
  }

  for (const message of unrelayedMessages) {
    await relayMessage(message, logger)
  }
}

async function relayMessage(item: CCTP.ISentCCTPMessage, logger: Logger) {
  const { message, destinationChainId, txContext } = item
  const chainSlug = getChain(destinationChainId).slug
  const wallet = wallets.get(chainSlug)

  try {
    logger.debug(`Relaying message with txHash ${txContext.txHash}... on destination chain: ${chainSlug}`)
    const attestation = await CCTP.CCTPSDK.fetchAttestation(message)
    await CCTP.CCTPSDK.relayMessage(wallet, message, attestation)
  } catch (e) {
    logger.error(`Error relaying message ${message}`)
  }
}
